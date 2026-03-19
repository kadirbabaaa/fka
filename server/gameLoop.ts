import { Server } from "socket.io";
import {
  GameState, Personality,
  DAY_TICKS, NIGHT_TICKS,
  RECIPE_DEFS, BURN_TICKS, EAT_TICKS, BURNED_FOOD,
  DISH_ITEMS, SEAT_SLOTS, DISH_UNLOCK_POOL,
  GAME_HEIGHT,
} from "../shared/types.js";
import { DIALOGUES } from "../shared/dialogues.js";

const CLOSING_THRESHOLD = 300;
const SPAWN_GRACE_TICKS = 240;

function patLimit(lv: number) { return 1200 + 300 * lv; }

export function generateMenuChoices(gs: GameState): void {
  const locked = [...DISH_UNLOCK_POOL].filter((d: string) => !gs.unlockedDishes.includes(d));
  if (locked.length === 0) { gs.menuChoices = null; return; }
  const shuffled = locked.sort(() => Math.random() - 0.5);
  gs.menuChoices = shuffled.slice(0, Math.min(2, locked.length));
}

export function tryQueueSeat(gs: GameState, io: Server, rid: string) {
  if (gs.dayPhase !== "day") return;
  while (gs.waitList.length > 0) {
    const occupied = new Set([
      ...gs.customers.map(c => `${c.seatX},${c.seatY}`),
      ...gs.dirtyTables.map(t => `${t.seatX},${t.seatY}`),
    ]);
    const free = SEAT_SLOTS.filter(s => !occupied.has(`${s.x},${s.y}`));
    if (!free.length) break;
    const guest = gs.waitList.shift()!;
    const seat = free[Math.floor(Math.random() * free.length)];
    const maxP = patLimit(gs.upgrades.patience);
    gs.customers.push({
      id: guest.id, seatX: seat.x, seatY: seat.y,
      x: seat.x, y: GAME_HEIGHT + 60, targetY: seat.y,
      wants: guest.wants, patience: maxP, maxPatience: maxP,
      isSeated: false, isEating: false, eatTimer: 0,
      tipAmount: undefined,
      personality: guest.personality,
      currentDialog: guest.currentDialog,
      dialogTimer: guest.dialogTimer,
      isBeatUp: false, isLeaving: false,
      bodyShape: guest.bodyShape, bodyColor: guest.bodyColor,
      punchCount: 0,
    });
    io.to(rid).emit("sound", "arrive");
  }
}

export function gameTick(gs: GameState, io: Server, rid: string) {
  // Fırınları güncelle
  gs.cookStations.forEach(s => {
    if (s.input && s.timer > 0) {
      s.timer--;
      if (s.timer <= 0) {
        const recipe = RECIPE_DEFS[s.input as keyof typeof RECIPE_DEFS];
        s.output = recipe ? recipe.output : s.input;
        s.input = null;
        s.burnTimer = BURN_TICKS;
      }
    } else if (s.output && s.burnTimer !== undefined && s.burnTimer > 0) {
      s.burnTimer--;
      if (s.burnTimer <= 0) {
        s.isBurned = true;
        s.output = BURNED_FOOD;
      }
    }
  });

  // Gündüz timer
  if (gs.dayPhase === 'day') {
    if (gs.dayTimer > 0) gs.dayTimer--;
    if (gs.dayTimer <= 0 && gs.customers.length === 0 && gs.waitList.length === 0 && gs.dirtyTables.length === 0) {
      gs.dayPhase = 'night';
      gs.dayTimer = NIGHT_TICKS;
      gs.hasOrderedTonight = false;
      generateMenuChoices(gs);
    }
  }

  if (gs.dayPhase === 'night') {
    if (gs.dayTimer > 0) gs.dayTimer--;
  }

  // Spawn
  if (gs.dayPhase === 'day' && gs.dayTimer > CLOSING_THRESHOLD && gs.dayTimer < (DAY_TICKS - SPAWN_GRACE_TICKS)) {
    spawnTick(gs, io, rid);
  }

  tryQueueSeat(gs, io, rid);

  // WaitList dialog timer
  gs.waitList.forEach(guest => {
    if (guest.dialogTimer && guest.dialogTimer > 0) {
      guest.dialogTimer--;
      if (guest.dialogTimer <= 0) guest.currentDialog = undefined;
    }
  });

  // Müşteri tick
  customerTick(gs, io, rid);

  io.to(rid).emit("state", gs);
}

function spawnTick(gs: GameState, io: Server, rid: string) {
  const availableDishes = gs.unlockedDishes.length > 0 ? gs.unlockedDishes : [...DISH_ITEMS];
  const baseRate = 0.001 + Math.min(gs.day * 0.0005, 0.005);
  const dayProgress = 1 - gs.dayTimer / DAY_TICKS;
  const playerCount = Object.keys(gs.players).length || 1;
  const spawnMultiplier = 1 + (playerCount - 1) * 0.6;
  const queueLimit = 10 + (playerCount - 1) * 3;
  const currentRate = (baseRate + (dayProgress * 0.001)) * spawnMultiplier;

  if (Math.random() < currentRate && gs.customers.length + gs.waitList.length < queueLimit) {
    const personalities: Personality[] = ['polite', 'rude', 'recep'];
    const pers = personalities[Math.floor(Math.random() * personalities.length)];
    let dialog: string | undefined;
    let timer: number | undefined;
    if (Math.random() < 0.3) {
      const list = DIALOGUES[pers].entry;
      dialog = list[Math.floor(Math.random() * list.length)];
      timer = 90;
    }
    const bodyShapes = [1, 2, 3, 4] as const;
    const bodyColors: Record<Personality, string[]> = {
      polite: ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6'],
      rude: ['#f59e0b', '#ef4444', '#f97316', '#dc2626'],
      recep: ['#7c3aed', '#b91c1c', '#1d4ed8', '#064e3b'],
      thug: ['#000000', '#1c1917', '#7f1d1d', '#57534e'],
    };
    const bodyShape = bodyShapes[Math.floor(Math.random() * bodyShapes.length)];
    const bodyColor = bodyColors[pers][Math.floor(Math.random() * bodyColors[pers].length)];
    gs.waitList.push({
      id: Math.random().toString(36).slice(2, 9),
      wants: availableDishes[Math.floor(Math.random() * availableDishes.length)],
      personality: pers,
      currentDialog: dialog, dialogTimer: timer,
      bodyShape, bodyColor,
    });
  }

  // Revenge Queue
  for (let i = gs.revengeQueue.length - 1; i >= 0; i--) {
    gs.revengeQueue[i]--;
    if (gs.revengeQueue[i] <= 0) {
      gs.revengeQueue.splice(i, 1);
      const thugCount = 3 + Math.floor(Math.random() * 2);
      for (let j = 0; j < thugCount; j++) {
        const bodyShapes = [2, 4] as const;
        const bodyShape = bodyShapes[Math.floor(Math.random() * bodyShapes.length)];
        const bodyColors = ['#000000', '#1c1917', '#7f1d1d', '#57534e'];
        const bodyColor = bodyColors[Math.floor(Math.random() * bodyColors.length)];
        const list = DIALOGUES.thug.revenge;
        const dialog = list[Math.floor(Math.random() * list.length)];
        gs.waitList.push({
          id: Math.random().toString(36).slice(2, 9),
          wants: availableDishes[Math.floor(Math.random() * availableDishes.length)],
          personality: 'thug',
          currentDialog: dialog, dialogTimer: 150,
          bodyShape, bodyColor,
        });
      }
      io.to(rid).emit("sound", "fail");
    }
  }
}

function customerTick(gs: GameState, io: Server, rid: string) {
  for (let i = gs.customers.length - 1; i >= 0; i--) {
    const c = gs.customers[i];

    if (c.dialogTimer && c.dialogTimer > 0) {
      c.dialogTimer--;
      if (c.dialogTimer <= 0) c.currentDialog = undefined;
    }
    if (c.beatUpTimer && c.beatUpTimer > 0) {
      c.beatUpTimer--;
      if (c.beatUpTimer <= 0) { c.beatUpTimer = 0; c.isBeatUp = false; }
    }

    if (c.isLeaving) {
      c.isSeated = false; c.isEating = false;
      c.y += 4;
      if (c.y >= GAME_HEIGHT + 60) gs.customers.splice(i, 1);
      continue;
    }

    if (c.isEating) {
      c.eatTimer--;
      if (!c.currentDialog && Math.random() < 0.001) {
        const list = DIALOGUES[c.personality].eating;
        c.currentDialog = list[Math.floor(Math.random() * list.length)];
        c.dialogTimer = 90;
      }
      if (c.eatTimer <= 0) {
        gs.dirtyTables.push({ seatX: c.seatX, seatY: c.seatY, tip: c.tipAmount || 0 });
        c.isLeaving = true; c.isSeated = false; c.targetY = GAME_HEIGHT + 60;
        if (Math.random() < 0.4) {
          const list = DIALOGUES[c.personality].leaving_happy;
          c.currentDialog = list[Math.floor(Math.random() * list.length)];
          c.dialogTimer = 90;
        }
        tryQueueSeat(gs, io, rid);
      }
      continue;
    }

    if (!c.isSeated) {
      if (c.y > c.targetY) {
        c.y = Math.max(c.targetY, c.y - 3);
        if (c.y <= c.targetY) c.isSeated = true;
      }
    } else {
      if (!c.currentDialog && Math.random() < 0.001) {
        const list = DIALOGUES[c.personality].waiting;
        c.currentDialog = list[Math.floor(Math.random() * list.length)];
        c.dialogTimer = 90;
      }
      if (gs.dayPhase === 'day') {
        const playerCount = Object.keys(gs.players).length || 1;
        let patienceDrain = 1 + (playerCount - 1) * 0.25;
        if (gs.dayTimer <= DAY_TICKS * 0.25) patienceDrain *= 1.5;
        const baseDrain = Math.floor(patienceDrain);
        const actualDrain = baseDrain + (Math.random() < (patienceDrain - baseDrain) ? 1 : 0);

        if (!c.isEating && c.wants) {
          c.patience -= actualDrain;
          if (gs.isImmortal && c.patience <= 0) c.patience = 1;
          if (c.patience <= 0) {
            gs.score -= 10;
            gs.lives -= 1;
            io.to(rid).emit("sound", "fail");
            if (gs.lives <= 0) {
              gs.isGameOver = true;
              gs.customers = []; gs.waitList = [];
              io.to(rid).emit("sound", "fail");
              break;
            }
            c.isLeaving = true; c.isSeated = false; c.targetY = GAME_HEIGHT + 60;
            const list = DIALOGUES[c.personality].leaving_angry;
            c.currentDialog = list[Math.floor(Math.random() * list.length)];
            c.dialogTimer = 90;
            tryQueueSeat(gs, io, rid);
          }
        }
      }
    }
  }
}
