import { useState, useEffect } from 'react';
import { setSfxEnabled } from '../utils/audio';

export interface HudElementLayout {
    x: number;  // % cinsinden (0-100), sol kenardan
    y: number;  // % cinsinden (0-100), üst kenardan
    scale: number; // 0.5 - 2.0
}

export interface HudLayout {
    joystick: HudElementLayout;
    actionBtn: HudElementLayout;
    punchBtn: HudElementLayout;
    musicBtn: HudElementLayout;
    chopBtn: HudElementLayout;
}

export const DEFAULT_HUD_LAYOUT: HudLayout = {
    joystick:  { x: 3,  y: 65, scale: 1.0 },
    actionBtn: { x: 82, y: 68, scale: 1.0 },
    punchBtn:  { x: 82, y: 55, scale: 1.0 },
    musicBtn:  { x: 82, y: 82, scale: 0.7 },
    chopBtn:   { x: 72, y: 68, scale: 1.0 },
};

export interface Settings {
    masterVolume: number;
    sfxOn: boolean;
    // Legacy (artık kullanılmıyor ama eski kayıtlarla uyumluluk için tutuyoruz)
    buttonSize: number;
    buttonOffset: number;
    joystickSide: 'left' | 'right';
    joystickSize: number;
    punchButtonSize: number;
    joystickOffset: number;
    // Yeni HUD layout sistemi
    hudLayout: HudLayout;
}

const DEFAULTS: Settings = {
    masterVolume: 0.5,
    sfxOn: true,
    buttonSize: 80,
    buttonOffset: 32,
    joystickSide: 'left',
    joystickSize: 128,
    punchButtonSize: 72,
    joystickOffset: 32,
    hudLayout: DEFAULT_HUD_LAYOUT,
};

const LS_KEY = 'terracraft-settings';

function load(): Settings {
    try {
        const saved = localStorage.getItem(LS_KEY);
        if (!saved) return DEFAULTS;
        const parsed = JSON.parse(saved);
        // hudLayout yoksa default ekle
        if (!parsed.hudLayout) parsed.hudLayout = DEFAULT_HUD_LAYOUT;
        // Yeni eklenen alanlar için fallback
        if (!parsed.hudLayout.chopBtn) parsed.hudLayout.chopBtn = DEFAULT_HUD_LAYOUT.chopBtn;
        return { ...DEFAULTS, ...parsed };
    } catch {
        return DEFAULTS;
    }
}

function save(s: Settings) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { }
}

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(load);

    useEffect(() => {
        setSfxEnabled(settings.sfxOn);
    }, [settings.sfxOn]);

    const update = (patch: Partial<Settings>) =>
        setSettings(prev => {
            const next = { ...prev, ...patch };
            save(next);
            return next;
        });

    return { settings, update };
}
