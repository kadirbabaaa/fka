import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import { MARKET_NAME } from "./src/constants";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

type Item = '🍎' | '🍞' | '🥛' | null;

interface Player {
  id: string;
  x: number;
  y: number;
  holding: Item;
  color: string;
  name: string;
  hat: string;
}

interface Customer {
  id: string;
  x: number;
  y: number;
  targetY: number;
  wants: Item;
  patience: number;
  maxPatience: number;
}

interface GameState {
  players: Record<string, Player>;
  customers: Customer[];
  score: number;
  stock: Record<Exclude<Item, null>, number>;
  marketName: string;
}

const ITEMS: Exclude<Item, null>[] = ['🍎', '🍞', '🥛'];

const rooms: Record<string, GameState> = {};

function createRoom(roomId: string): GameState {
  return {
    players: {},
    customers: [],
    score: 0,
    stock: { '🍎': 10, '🍞': 10, '🥛': 10 },
    marketName: MARKET_NAME,
  };
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: "*" } });
  const PORT = process.env.PORT || 3000;

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  io.on("connection", (socket) => {
    let currentRoomId: string | null = null;
    console.log("Player connected:", socket.id);
    
    socket.on("join", (data: { name: string, color: string, hat: string, roomId: string, marketName: string }) => {
      const roomId = data.roomId || "default";
      currentRoomId = roomId;
      console.log(`Player ${data.name} (${socket.id}) joined room: ${roomId}`);
      
      if (!rooms[roomId]) {
        rooms[roomId] = createRoom(roomId);
        if (data.marketName) rooms[roomId].marketName = data.marketName;
      }
      
      const gameState = rooms[roomId];
      socket.join(roomId);

      gameState.players[socket.id] = {
        id: socket.id,
        x: GAME_WIDTH / 2 + (Math.random() * 100 - 50),
        y: GAME_HEIGHT / 2 + (Math.random() * 100 - 50),
        holding: null,
        color: data.color,
        name: data.name || "Oyuncu",
        hat: data.hat || "",
      };
      socket.emit("init", { id: socket.id, state: gameState });
    });

    socket.on("move", (data: { x: number, y: number }) => {
      if (currentRoomId && rooms[currentRoomId]?.players[socket.id]) {
        const player = rooms[currentRoomId].players[socket.id];
        player.x = data.x;
        player.y = data.y;
      }
    });

    socket.on("interact", () => {
      if (!currentRoomId || !rooms[currentRoomId]) return;
      const gameState = rooms[currentRoomId];
      const player = gameState.players[socket.id];
      if (!player) return;

      const px = player.x;
      const py = player.y;

      // Check stations (radius 80)
      if (Math.hypot(px - 100, py - 100) < 80 && gameState.stock['🍎'] > 0) { 
        player.holding = '🍎'; 
        gameState.stock['🍎']--;
        socket.emit("sound", "pickup"); 
      }
      else if (Math.hypot(px - 700, py - 100) < 80 && gameState.stock['🍞'] > 0) { 
        player.holding = '🍞'; 
        gameState.stock['🍞']--;
        socket.emit("sound", "pickup"); 
      }
      else if (Math.hypot(px - 100, py - 500) < 80 && gameState.stock['🥛'] > 0) { 
        player.holding = '🥛'; 
        gameState.stock['🥛']--;
        socket.emit("sound", "pickup"); 
      }
      else if (Math.hypot(px - 700, py - 500) < 80) { player.holding = null; socket.emit("sound", "trash"); }
      else if (Math.hypot(px - 400, py - 550) < 80 && gameState.score >= 50) {
        gameState.score -= 50;
        gameState.stock['🍎'] += 5;
        gameState.stock['🍞'] += 5;
        gameState.stock['🥛'] += 5;
        socket.emit("sound", "success");
      }

      // Check counter (serve customer)
      if (px > 200 && px < 680 && py > 150 && py < 450) {
        if (player.holding) {
          const customerIndex = gameState.customers.findIndex(c => 
            c.wants === player.holding && c.y <= c.targetY + 10
          );
          
          if (customerIndex !== -1) {
            gameState.score += 10;
            player.holding = null;
            gameState.customers.splice(customerIndex, 1);
            io.to(currentRoomId).emit("sound", "success");
          }
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Player left:", socket.id);
      if (currentRoomId && rooms[currentRoomId]) {
        delete rooms[currentRoomId].players[socket.id];
        // Clean up empty rooms
        if (Object.keys(rooms[currentRoomId].players).length === 0) {
          delete rooms[currentRoomId];
        }
      }
    });
  });

  // Game Loop
  setInterval(() => {
    Object.keys(rooms).forEach(roomId => {
      const gameState = rooms[roomId];
      if (!gameState.stock) {
        gameState.stock = { '🍎': 10, '🍞': 10, '🥛': 10 };
      }
      if (!gameState.stock) {
        gameState.stock = { '🍎': 10, '🍞': 10, '🥛': 10 };
      }
      if (!gameState.stock) {
        gameState.stock = { '🍎': 10, '🍞': 10, '🥛': 10 };
      }
      
      // Spawn customers
      if (gameState.customers.length < 4 && Math.random() < 0.03) {
        const slots = [350, 410, 470, 530];
        const occupiedSlots = gameState.customers.map(c => c.x);
        const availableSlots = slots.filter(s => !occupiedSlots.includes(s));

        if (availableSlots.length > 0) {
          const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
          gameState.customers.push({
            id: Math.random().toString(36).substring(2, 9),
            x: randomSlot,
            y: GAME_HEIGHT + 50,
            targetY: 350 + Math.random() * 20,
            wants: ITEMS[Math.floor(Math.random() * ITEMS.length)],
            patience: 1000,
            maxPatience: 1000,
          });
          io.to(roomId).emit("sound", "arrive");
        }
      }

      // Update customers
      for (let i = gameState.customers.length - 1; i >= 0; i--) {
        const c = gameState.customers[i];
        if (c.y > c.targetY) {
          c.y -= 2;
        } else {
          c.patience -= 1;
          if (c.patience <= 0) {
            gameState.score = Math.max(0, gameState.score - 5);
            gameState.customers.splice(i, 1);
            io.to(roomId).emit("sound", "fail");
          }
        }
      }

      io.to(roomId).emit("state", gameState);
    });
  }, 1000 / 30); // 30 FPS

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  httpServer.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();
