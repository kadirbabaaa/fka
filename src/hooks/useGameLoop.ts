import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import {
  GameState,
  Player,
  GAME_WIDTH,
  GAME_HEIGHT,
  DIRTY_TRAY_POS,
  TRAY_STATION,
  INGREDIENTS,
  PLATE_STACK_POS,
  RECIPE_DEFS,
  TRASH_STATION,
  SINK_STATION,
} from "../types/game";

import { drawFloor } from "../renderer/drawFloor";
import { drawStation } from "../renderer/drawStation";
import { drawTable } from "../renderer/drawTable";
import { drawCustomer } from "../renderer/drawCustomer";
import { drawPlayer } from "../renderer/drawPlayer";
import { drawCookStation } from "../renderer/drawCookStation";
import { drawHoldingStation } from "../renderer/drawHoldingStation";
import { drawCounters } from "../renderer/drawCounter";
import { movePlayer } from "./usePlayerMovement";
import { setupGameEffects, renderFloatingTexts, renderPunchParticles } from "./useGameEffects";
import { updateProximityAudio } from "./useProximityAudio";
import { drawLayoutPreview, LayoutEditorState } from '../renderer/drawLayoutEditor';
import { drawDirtyTrayBasket } from '../renderer/drawDirtyTrayBasket';
import { drawWaitList } from '../renderer/drawWaitList';
import { drawDirtyTable } from '../renderer/drawDirtyTable';

interface UseGameLoopProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isJoined: boolean;
  myId: string;
  socket: Socket | null;
  gameStateRef: React.MutableRefObject<GameState>;
  localPlayerRef: React.MutableRefObject<{ x: number; y: number }>;
  keysRef: React.MutableRefObject<{ w: boolean; a: boolean; s: boolean; d: boolean }>;
  joystickVectorRef: React.MutableRefObject<{ x: number; y: number }>;
  audioElementsRef?: React.MutableRefObject<Record<string, HTMLAudioElement>>;
  globalVolume?: number;
  editorStateRef?: React.MutableRefObject<LayoutEditorState>;
}

const FLOOR_CACHE_VERSION = 9;
let floorCache: OffscreenCanvas | HTMLCanvasElement | null = null;
let floorCacheVersion = 0;
let cachedUnlockedDishes = "";

function drawFloorCached(ctx: CanvasRenderingContext2D, unlockedDishes: string[] = [], forceRedraw = false, ingredientPositions?: Record<string, { x: number; y: number }>, tablePositions?: Record<string, { id: string; x: number; y: number }>, movingTableId?: string | null, plateStackPos?: { x: number; y: number }) {
  const currentDishesStr = [...unlockedDishes].sort().join(',');
  const ingPosStr = ingredientPositions
    ? Object.entries(ingredientPositions).map(([k, v]) => `${k}:${v.x},${v.y}`).join(';')
    : '';
  const tablePosStr = tablePositions
    ? Object.entries(tablePositions).map(([k, v]) => `${k}:${v.x},${v.y}`).join(';')
    : '';
  const platePosStr = plateStackPos ? `${plateStackPos.x},${plateStackPos.y}` : '';
  if (forceRedraw || floorCacheVersion !== FLOOR_CACHE_VERSION || cachedUnlockedDishes !== currentDishesStr + ingPosStr + tablePosStr + platePosStr) {
    floorCache = null; floorCacheVersion = FLOOR_CACHE_VERSION; cachedUnlockedDishes = currentDishesStr + ingPosStr + tablePosStr + platePosStr;
  }
  if (!floorCache) {
    floorCache = typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(GAME_WIDTH, GAME_HEIGHT)
      : Object.assign(document.createElement("canvas"), { width: GAME_WIDTH, height: GAME_HEIGHT });
    const offCtx = floorCache.getContext("2d");
    if (offCtx) {
      drawFloor(offCtx as unknown as CanvasRenderingContext2D, unlockedDishes, ingredientPositions, plateStackPos);
      const tables = tablePositions ? Object.values(tablePositions) : [];
      tables.forEach((t) => {
        if (movingTableId === t.id) {
          (offCtx as unknown as CanvasRenderingContext2D).save();
          (offCtx as unknown as CanvasRenderingContext2D).globalAlpha = 0.4;
          drawTable(offCtx as unknown as CanvasRenderingContext2D, t.x, t.y);
          (offCtx as unknown as CanvasRenderingContext2D).restore();
        } else {
          drawTable(offCtx as unknown as CanvasRenderingContext2D, t.x, t.y);
        }
      });
    }
  }
  ctx.drawImage(floorCache, 0, 0);
}

export function useGameLoop({
  canvasRef, isJoined, myId, socket, gameStateRef,
  localPlayerRef, keysRef, joystickVectorRef, audioElementsRef, globalVolume = 1.0, editorStateRef,
}: UseGameLoopProps) {
  useEffect(() => {
    if (!isJoined) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    floorCache = null;
    let frameId = 0;
    let lastFrameTime = 0;
    const lastEmitRef = { current: 0 };
    const { floatingTexts, punchParticles, cleanup: cleanupEffects } = setupGameEffects(socket);

    const render = (time: number) => {
      const state = gameStateRef.current;
      const deltaMs = lastFrameTime === 0 ? 1000 / 60 : Math.min(50, time - lastFrameTime);
      lastFrameTime = time;
      const frameScale = deltaMs / (1000 / 60);

      movePlayer(time, lastEmitRef, frameScale, { socket, gameStateRef, localPlayerRef, keysRef, joystickVectorRef });

      const isEditing = !!(editorStateRef?.current?.isMoving || editorStateRef?.current?.isMovingTable);
      // stationLayout'tan ingredient pozisyonlarını çıkar
      const ingPositions: Record<string, { x: number; y: number }> = {};
      if (state.stationLayout) {
        for (const [id, pos] of Object.entries(state.stationLayout) as [string, { x: number; y: number }][]) {
          if (id.startsWith('ingredient_')) {
            ingPositions[id.replace('ingredient_', '')] = { x: pos.x, y: pos.y };
          }
        }
      }
      const movingTableId = editorStateRef?.current?.movingTableId;
      const plateStackDynPos = state.stationLayout?.['plate_stack'] ?? undefined;
      drawFloorCached(ctx, state.unlockedDishes, isEditing, ingPositions, state.tableLayout, movingTableId, plateStackDynPos);

      const stock = state.stock ?? { "🍞": 0, "🥩": 0, "🥬": 0 };
      const movingId = editorStateRef?.current?.movingStationId;
      INGREDIENTS.forEach((ing) => {
        const recipe = RECIPE_DEFS[ing.key as keyof typeof RECIPE_DEFS];
        if (recipe && !state.unlockedDishes.includes(recipe.output)) return;
        if (movingId === `ingredient_${ing.key}`) return; // taşınıyor, preview çizer
        // stationLayout'tan dinamik koordinat al, yoksa sabit koordinata düş
        const dynPos = state.stationLayout?.[`ingredient_${ing.key}`];
        const px = dynPos?.x ?? ing.pos.x;
        const py = dynPos?.y ?? ing.pos.y;
        drawStation(ctx, px, py, ing.color, ing.key, ing.label, stock[ing.key] ?? 0);
      });

      // Tepsi
      const trayPos = state.stationLayout?.['tray'] ?? TRAY_STATION;
      if (movingId !== 'tray') drawStation(ctx, trayPos.x, trayPos.y, "#8b5a2b", "🍽️", "Tepsi");

      // Çöp kovası
      const trashPos = state.stationLayout?.['trash'] ?? TRASH_STATION;
      if (movingId !== 'trash') drawStation(ctx, trashPos.x, trashPos.y, "#78716c", "🗑️", "Çöp");

      // Lavabo
      const sinkPos = state.stationLayout?.['sink'] ?? SINK_STATION;
      if (movingId !== 'sink') drawStation(ctx, sinkPos.x, sinkPos.y, "#0ea5e9", "🚿", "Lavabo");

      // Kirli tepsi sepeti
      const dirtyTrayLayout = state.stationLayout?.['dirty_tray'] ?? DIRTY_TRAY_POS;
      if (movingId !== 'dirty_tray') {
        drawDirtyTrayBasket(ctx, state.dirtyTrayCount || 0, dirtyTrayLayout);
      } // end dirty_tray guard

      const hs = state.holdingStations;
      if (hs) {
        if (state.plateStack && PLATE_STACK_POS) {
          const platePos = state.stationLayout?.['plate_stack'] ?? PLATE_STACK_POS;
          const sx = platePos.x, sy = platePos.y;
          if (movingId !== 'plate_stack') {
          ctx.fillStyle = "rgba(0,0,0,0.15)";
          ctx.beginPath(); ctx.ellipse(sx, sy + 4, 25, 12, 0, 0, Math.PI * 2); ctx.fill();
          for (let i = 0; i < state.plateStack.count; i++) {
            const oy = sy - i * 4;
            const rimGrad = ctx.createRadialGradient(sx, oy, 12, sx, oy, 24);
            rimGrad.addColorStop(0, "#f1f5f9"); rimGrad.addColorStop(1, "#e2e8f0");
            ctx.fillStyle = rimGrad;
            ctx.beginPath(); ctx.ellipse(sx, oy, 23, 11, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#fefefe";
            ctx.beginPath(); ctx.ellipse(sx, oy + 1, 16, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(sx, oy + 1, 16, 8, 0, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(sx, oy, 23, 11, 0, 0, Math.PI * 2); ctx.stroke();
          }
          ctx.fillStyle = "white"; ctx.font = "bold 13px Arial";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
          ctx.fillText(`${state.plateStack.count}/${state.plateStack.maxCount}`, sx, sy - state.plateStack.count * 4 - 15);
          ctx.shadowBlur = 0;
          }
        }
        drawCounters(ctx, hs);
      }

      if (state.cookStations) {
        for (const station of state.cookStations) drawCookStation(ctx, station, time);
      }

      state.customers.forEach((c) => drawCustomer(ctx, c));
      (state.dirtyTables ?? []).forEach((t) => drawDirtyTable(ctx, t.seatX, t.seatY));
      drawWaitList(ctx, state.waitList ?? []);

      // Layout editor önizlemesi — oyunculardan ÖNCE çizilir (oyuncu üstte kalır)
      if ((editorStateRef?.current?.isMoving || editorStateRef?.current?.isMovingTable) && state.stationLayout) {
        drawLayoutPreview(ctx, editorStateRef.current, state.stationLayout);
      }

      const sp = state.players;
      if (sp) {
        Object.values(sp).forEach((p: Player) => {
          const isMe = p.id === myId;
          drawPlayer(ctx, isMe ? localPlayerRef.current.x : p.x, isMe ? localPlayerRef.current.y : p.y, p, isMe);
        });
        if (audioElementsRef?.current) {
          updateProximityAudio(audioElementsRef, localPlayerRef, sp, myId, globalVolume);
        }
      }

      renderFloatingTexts(ctx, floatingTexts);
      renderPunchParticles(ctx, punchParticles);

      if (state.dayPhase === "night") {
        ctx.fillStyle = "rgba(5,10,60,0.45)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        [[80,25],[200,55],[420,18],[660,42],[870,22],[1100,48],[1220,70],[320,35],[740,60],[950,30]].forEach(([sx, sy]) => {
          ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
        });
        ctx.font = "32px Arial"; ctx.textAlign = "right"; ctx.textBaseline = "top";
        ctx.fillText("🌙", GAME_WIDTH - 16, 14);
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frameId); cleanupEffects(); };
  }, [isJoined, myId, socket]);
}
