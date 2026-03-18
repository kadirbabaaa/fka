// ═══════════════════════════════════════════════════════════════════════════════
// SHARED TYPES & CONSTANTS — Server ve Client ortak kullanır
// Bu dosyayı değiştirirsen HER İKİ TARAF da otomatik güncellenir.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Temel Tipler ────────────────────────────────────────────────────────────
import { Personality } from './dialogues';
export type { Personality };

export type Item = string | null;
export type StockKey = '🍞' | '🥩' | '🥬' | '🥘' | '🍢';
export type UpgradeKey = 'patience' | 'earnings' | 'stockMax';
export const CLEAN_PLATE = '__clean_plate__';
export const DIRTY_PLATE = '__dirty_plate__';

export interface Player {
    id: string; x: number; y: number;
    holding: Item; color: string; name: string; hat: string;
    charType?: number;
    peerId?: string;
}

// 8 Karakter Tipi — CharacterSelect + drawPlayer kullanır
export const CHARACTER_TYPES = [
    { id: 0, name: 'Aşçı', hat: '👨‍🍳', bodyColor: '#f5f5f4', accent: '#a78bfa', label: 'Klasik Aşçı' },
    { id: 1, name: 'Suşici', hat: '🍣', bodyColor: '#fca5a5', accent: '#dc2626', label: 'Hızlı Suşi' },
    { id: 2, name: 'Ninja', hat: '🥷', bodyColor: '#292524', accent: '#ef4444', label: 'Gizli Ninja' },
    { id: 3, name: 'Chef', hat: '🧑‍🍳', bodyColor: '#fed7aa', accent: '#f97316', label: 'Baş Chef' },
    { id: 4, name: 'Bahçıvan', hat: '🌿', bodyColor: '#bbf7d0', accent: '#16a34a', label: 'Taze Bahçı' },
    { id: 5, name: 'Kaptan', hat: '⛴️', bodyColor: '#bfdbfe', accent: '#1d4ed8', label: 'Kaptan' },
    { id: 6, name: 'Garson', hat: '🍽️', bodyColor: '#fef3c7', accent: '#92400e', label: 'Şık Garson' },
    { id: 7, name: 'Bulaşıkçı', hat: '🧽', bodyColor: '#e0f2fe', accent: '#0284c7', label: 'Temizlikçi' },
] as const;

export interface Customer {
    id: string;
    seatX: number; seatY: number;
    x: number; y: number; targetY: number;
    wants: Item;
    patience: number; maxPatience: number;
    isSeated: boolean; isEating: boolean; eatTimer: number;
    tipAmount?: number;

    personality: Personality;
    currentDialog?: string;
    dialogTimer?: number;
    isBeatUp?: boolean;
    isLeaving?: boolean;

    bodyShape: 1 | 2 | 3 | 4;
    bodyColor: string;
    beatUpTimer?: number;
    punchCount?: number;
}

export interface WaitingGuest {
    id: string;
    wants: Item;
    personality: Personality;
    currentDialog?: string;
    dialogTimer?: number;
    isBeatUp?: boolean;
    bodyShape: 1 | 2 | 3 | 4;
    bodyColor: string;
}

export interface Upgrades {
    patience: number; earnings: number; stockMax: number;
}

export interface CookStation {
    input: string | null;
    timer: number;
    output: string | null;
    burnTimer?: number;
    isBurned?: boolean;
    id: string;
    x: number;
    y: number;
}

export interface HoldingStation {
    id: string;
    items: string[];
    type: 'plate' | 'counter';
    maxItems: number;
}

// ─── Tepsi Fonksiyonları ───────────────────────────────────────────────────
export const TRAY_PREFIX = 'TRAY:';
export const MAX_TRAY_CAPACITY = 4;

export function isTray(item: Item): boolean {
    return typeof item === 'string' && item.startsWith(TRAY_PREFIX);
}

export function getTrayItems(item: Item): string[] {
    if (!item || !item.startsWith(TRAY_PREFIX)) return [];
    const content = item.substring(TRAY_PREFIX.length);
    return content ? content.split(',') : [];
}

export function createTray(items: string[]): string {
    return TRAY_PREFIX + items.join(',');
}

export interface DirtyTable {
    seatX: number;
    seatY: number;
    tip: number;
}

// ─── Masa Çarpışma Boyutları ───────────────────────────────────────────────
export const TABLE_HALF_W = 45;
export const TABLE_HALF_H = 35;

export interface GameState {
    players: Record<string, Player>;
    customers: Customer[];
    waitList: WaitingGuest[];
    holdingStations: HoldingStation[];
    dirtyTables: DirtyTable[];
    score: number;
    stock: Record<StockKey, number>;
    marketName: string;
    dayPhase: 'prep' | 'day' | 'night';
    dayTimer: number;
    upgrades: Upgrades;
    day: number;
    hasOrderedTonight: boolean;
    cookStations: CookStation[];
    dirtyTrayCount: number;

    // Game Over & Penalty
    lives: number;
    isGameOver: boolean;

    // Revenge System
    revengeQueue: number[];

    // ─── Yemek Kilidi Sistemi (Plate Up tarzı) ─────────────────────────────
    unlockedDishes: string[];       // Müşterilerin sipariş edebileceği yemekler
    menuChoices: string[] | null;   // Gece ekranında seçim için sunulan kilitli yemekler
}

// ─── Boyut ───────────────────────────────────────────────────────────────────
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// ─── Gün / Gece ──────────────────────────────────────────────────────────────
export const DAY_TICKS = 3000;
export const NIGHT_TICKS = 600;
export const CLOSING_THRESHOLD = 450;
export const BURN_TICKS = 300;
export const EAT_TICKS = 240;
export const BURNED_FOOD = '⬛';

// ─── Bekletme İstasyonları ──────────────────────────────────────────────────
export const HOLDING_STATION_POSITIONS = [
    { id: 'plate0', x: 560, y: 65, radius: 35, type: 'plate' as const },
    { id: 'plate1', x: 620, y: 65, radius: 35, type: 'plate' as const },
    { id: 'plate2', x: 680, y: 65, radius: 35, type: 'plate' as const },
    { id: 'plate3', x: 740, y: 65, radius: 35, type: 'plate' as const },
];

// ─── Servis Masaları ─────────────────────────────────────────────────────────
export const COUNTER_POSITIONS = [
    { id: 'counter0', x: 180, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter1', x: 220, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter2', x: 440, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter3', x: 480, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter4', x: 580, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter5', x: 620, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter6', x: 660, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter7', x: 700, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter8', x: 800, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter9', x: 840, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter10', x: 1020, y: 245, width: 40, height: 40, type: 'counter' as const },
    { id: 'counter11', x: 1060, y: 245, width: 40, height: 40, type: 'counter' as const },
];

// ─── Yatay Duvar & Kapılar ────────────────────────────────────────────────────
export const WALL_Y1 = 225;
export const WALL_Y2 = 265;
export const DOOR_RANGES: [number, number][] = [
    [280, 420],
    [860, 1000],
];
export function isInDoor(x: number): boolean {
    return DOOR_RANGES.some(([a, b]) => x >= a && x <= b);
}

// ─── Tepsi ve Malzeme İstasyonları ──────────────────────────────────────────
export const TRAY_STATION = { x: 80, y: 170 };

export const INGREDIENTS = [
    { key: '🍞' as StockKey, pos: { x: 100, y: 65 }, label: 'Hamur', color: '#fde68a' },
    { key: '🥩' as StockKey, pos: { x: 190, y: 65 }, label: 'Et', color: '#fca5a5' },
    { key: '🥬' as StockKey, pos: { x: 280, y: 65 }, label: 'Sebze', color: '#bbf7d0' },
    { key: '🥘' as StockKey, pos: { x: 370, y: 65 }, label: 'Çorba', color: '#fbbf24' },
    { key: '🍢' as StockKey, pos: { x: 460, y: 65 }, label: 'Kebap', color: '#92400e' },
];

// ─── Universal Fırın Sistemi ─────────────────────────────────────────────────
export const RECIPE_DEFS = {
    '🍞': { output: '🍕', time: 90,  label: '🍕 Pizza' },
    '🥩': { output: '🍔', time: 60,  label: '🍔 Burger' },
    '🥬': { output: '🥗', time: 30,  label: '🥗 Salata' },
    '🥘': { output: '🍜', time: 120, label: '🍜 Çorba' },
    '🍢': { output: '🌯', time: 100, label: '🌯 Dürüm' },
} as const;

// ─── Yemek kilidi sırası — her gece 1 yeni yemek seçilir ─────────────────────
// Başlangıçta Salata + Burger açık, geri kalanlar gece seçimiyle açılır
export const DISH_UNLOCK_POOL = ['🍕', '🍜', '🌯'] as const; // Kilidini açılabilecek yemekler

export const INITIAL_OVEN_POSITIONS = [
    { x: 200, y: 170 },
];

export const ADDITIONAL_OVEN_POSITIONS = [
    { x: 350, y: 170 },
    { x: 500, y: 170 },
    { x: 650, y: 170 },
];

// ─── Çöp Kutusu, Kirli Sepeti & Lavabo ──────────────────────────────────────
export const TRASH_STATION = { x: 1200, y: 190 };
export const DIRTY_TRAY_POS = { x: 1050, y: 90 };
export const SINK_STATION = { x: 1180, y: 90 };

// ─── Koltuklar ───────────────────────────────────────────────────────────────
export const SEAT_SLOTS: { x: number; y: number }[] = [
    { x: 190, y: 453 }, { x: 190, y: 547 },
    { x: 390, y: 453 }, { x: 390, y: 547 },
    { x: 640, y: 453 }, { x: 640, y: 547 },
    { x: 890, y: 453 }, { x: 890, y: 547 },
    { x: 1090, y: 453 }, { x: 1090, y: 547 },
];

// ─── Yemek Çıktıları (tüm olası yemekler) ────────────────────────────────────
export const DISH_ITEMS = ['🍕', '🍔', '🥗', '🍜', '🌯'] as const;

// ─── Upgrade Tanımları ───────────────────────────────────────────────────────
export const UPGRADE_DEFS: Record<UpgradeKey, { costs: number[]; max: number }> = {
    patience: { costs: [50, 100, 200], max: 3 },
    earnings: { costs: [100, 250], max: 2 },
    stockMax: { costs: [75, 150, 300], max: 3 },
};

export const OVEN_UPGRADE_COSTS = [80, 120, 180];

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────
export function mkCook(id: string, x: number, y: number): CookStation {
  return { input: null, timer: 0, output: null, id, x, y };
}

export function mkGameState(): GameState {
  const initialOvens = INITIAL_OVEN_POSITIONS.map((pos, i) =>
    mkCook(`oven${i + 1}`, pos.x, pos.y)
  );

  const allHoldingStations = [
    ...HOLDING_STATION_POSITIONS.map(p => ({ id: p.id, items: [CLEAN_PLATE], type: p.type, maxItems: 1 })),
    ...COUNTER_POSITIONS.map(p => ({ id: p.id, items: [], type: p.type, maxItems: 1 })),
  ];

  return {
    players: {}, customers: [], waitList: [],
    holdingStations: allHoldingStations,
    dirtyTables: [],
    score: 0, stock: { '🍞': 10, '🥩': 10, '🥬': 10, '🥘': 5, '🍢': 5 },
    marketName: "TerraMarket", dayPhase: 'prep', dayTimer: DAY_TICKS,
    upgrades: { patience: 0, earnings: 0, stockMax: 0 }, day: 1, hasOrderedTonight: false,
    cookStations: initialOvens,
    dirtyTrayCount: 0,
    lives: 3,
    isGameOver: false,
    revengeQueue: [],
    // Başlangıçta sadece Salata + Burger açık (en hızlı yemekler)
    unlockedDishes: ['🥗', '🍔'],
    menuChoices: null,
  };
}
