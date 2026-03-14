import { GameState, mkGameState, Player, StockKey } from "./types";

// Tüm odaların durumunu tutan merkezi nesne
const rooms: Record<string, GameState> = {};

// Yeni bir oda oluşturur ve başlangıç GameState'ini döndürür
export function createRoom(roomId: string, marketName: string): GameState {
    if (rooms[roomId]) {
        // Oda zaten varsa mevcut durumu döndür
        return rooms[roomId];
    }
    const newGameState = mkGameState();
    if (marketName) {
        newGameState.marketName = marketName;
    }
    rooms[roomId] = newGameState;
    return newGameState;
}

// Belirli bir odanın GameState'ini döndürür
export function getRoomState(roomId: string): GameState | undefined {
    return rooms[roomId];
}

// Odaya oyuncu ekler
export function addPlayerToRoom(roomId: string, playerId: string, player: Player): void {
    if (rooms[roomId]) {
        rooms[roomId].players[playerId] = player;
    }
}

// Odadan oyuncu çıkarır
export function removePlayerFromRoom(roomId: string, playerId: string): void {
    if (rooms[roomId] && rooms[roomId].players[playerId]) {
        delete rooms[roomId].players[playerId];
    }
}

// Tüm odaları döndürür (oyun döngüsü için)
export function getAllRooms(): Record<string, GameState> {
    return rooms;
}

// Oda durumunu günceller (oyun döngüsü için)
export function updateRoomState(roomId: string, newState: GameState): void {
    if (rooms[roomId]) {
        rooms[roomId] = newState;
    }
}

// Oda varlığını kontrol eder
export function roomExists(roomId: string): boolean {
    return !!rooms[roomId];
}

// Oda boş mu kontrol eder
export function isRoomEmpty(roomId: string): boolean {
    return !rooms[roomId] || Object.keys(rooms[roomId].players).length === 0;
}

// Oda listesini döndürür (sadece id'ler)
export function getRoomIds(): string[] {
    return Object.keys(rooms);
}

// Oda listesini temizler (test veya reset için)
export function clearRooms(): void {
    for (const key in rooms) {
        delete rooms[key];
    }
}

export function deleteRoom(roomId: string) {
  delete rooms[roomId];
}
