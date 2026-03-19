import { Socket, Server } from "socket.io";
import { GameState, GRID_CELL_SIZE, GAME_WIDTH, GAME_HEIGHT } from "../shared/types.js";

function snapToGrid(x: number, y: number): { x: number; y: number } {
  const col = Math.floor(x / GRID_CELL_SIZE);
  const row = Math.floor(y / GRID_CELL_SIZE);
  const clampedCol = Math.max(0, Math.min(col, Math.floor(GAME_WIDTH / GRID_CELL_SIZE) - 1));
  const clampedRow = Math.max(0, Math.min(row, Math.floor(GAME_HEIGHT / GRID_CELL_SIZE) - 1));
  return {
    x: clampedCol * GRID_CELL_SIZE + GRID_CELL_SIZE / 2,
    y: clampedRow * GRID_CELL_SIZE + GRID_CELL_SIZE / 2,
  };
}

function isOccupied(
  x: number, y: number,
  layout: GameState["stationLayout"],
  excludeId: string
): boolean {
  return Object.values(layout).some(
    s => s.id !== excludeId && s.x === x && s.y === y
  );
}

export function registerLayoutHandler(
  socket: Socket,
  io: Server,
  getRoomId: () => string | null,
  getRoomState: (rid: string) => GameState | undefined
): void {
  // Oyuncu disconnect → kilitlediği istasyonları serbest bırak
  socket.on("disconnect", () => {
    const roomId = getRoomId();
    if (!roomId) return;
    const gs = getRoomState(roomId);
    if (!gs) return;
    const freed: string[] = [];
    for (const [stationId, lockedBy] of Object.entries(gs.lockedStations)) {
      if (lockedBy === socket.id) {
        delete gs.lockedStations[stationId];
        freed.push(stationId);
      }
    }
    freed.forEach(stationId =>
      io.to(roomId).emit("stationUnlocked", { stationId })
    );
  });

  socket.on("lockStation", ({ stationId }: { stationId: string }) => {
    const roomId = getRoomId();
    if (!roomId) return;
    const gs = getRoomState(roomId);
    if (!gs) return;
    if (gs.dayPhase !== "prep") return;
    if (!(stationId in gs.stationLayout)) return;

    // Zaten kilitliyse reddet
    if (gs.lockedStations[stationId]) {
      socket.emit("stationLocked", { stationId, lockedBy: gs.lockedStations[stationId] });
      return;
    }

    gs.lockedStations[stationId] = socket.id;
    io.to(roomId).emit("stationLocked", { stationId, lockedBy: socket.id });
  });

  socket.on("moveStation", ({ stationId, x, y }: { stationId: string; x: number; y: number }) => {
    const roomId = getRoomId();
    if (!roomId) return;
    const gs = getRoomState(roomId);
    if (!gs) return;
    if (gs.dayPhase !== "prep") return;
    if (!(stationId in gs.stationLayout)) return;
    if (gs.lockedStations[stationId] !== socket.id) return;

    const snapped = snapToGrid(x, y);
    if (isOccupied(snapped.x, snapped.y, gs.stationLayout, stationId)) {
      socket.emit("sound", "fail");
      return;
    }

    gs.stationLayout[stationId].x = snapped.x;
    gs.stationLayout[stationId].y = snapped.y;

    // Fırın ise cookStation koordinatını da güncelle
    const oven = gs.cookStations.find(s => s.id === stationId);
    if (oven) { oven.x = snapped.x; oven.y = snapped.y; }

    delete gs.lockedStations[stationId];
    io.to(roomId).emit("stationMoved", { stationId, x: snapped.x, y: snapped.y });
    io.to(roomId).emit("stationUnlocked", { stationId });
    socket.emit("sound", "success");
  });

  socket.on("unlockStation", ({ stationId }: { stationId: string }) => {
    const roomId = getRoomId();
    if (!roomId) return;
    const gs = getRoomState(roomId);
    if (!gs) return;
    if (gs.lockedStations[stationId] !== socket.id) return;
    delete gs.lockedStations[stationId];
    io.to(roomId).emit("stationUnlocked", { stationId });
  });
}
