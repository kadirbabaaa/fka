import React, { useRef, useCallback } from 'react';
import { HudLayout, HudElementLayout, DEFAULT_HUD_LAYOUT } from '../hooks/useSettings';

interface Props {
    layout: HudLayout;
    onChange: (layout: HudLayout) => void;
    onClose: () => void;
}

interface DraggableHudItemProps {
    id: keyof HudLayout;
    layout: HudElementLayout;
    containerRef: React.RefObject<HTMLDivElement>;
    onUpdate: (id: keyof HudLayout, patch: Partial<HudElementLayout>) => void;
    children: React.ReactNode;
    label: string;
}

const DraggableHudItem: React.FC<DraggableHudItemProps> = ({ id, layout, containerRef, onUpdate, children, label }) => {
    const isDragging = useRef(false);
    const startPos = useRef({ mx: 0, my: 0, ex: 0, ey: 0 });

    const startDrag = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        isDragging.current = true;
        startPos.current = { mx: clientX, my: clientY, ex: layout.x, ey: layout.y };
    }, [layout.x, layout.y, containerRef]);

    const onMouseDown = (e: React.MouseEvent) => {
        // Resize handle'a tıklandıysa drag başlatma
        if ((e.target as HTMLElement).dataset.resize) return;
        e.preventDefault();
        startDrag(e.clientX, e.clientY);

        const onMove = (me: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const dx = ((me.clientX - startPos.current.mx) / rect.width) * 100;
            const dy = ((me.clientY - startPos.current.my) / rect.height) * 100;
            onUpdate(id, {
                x: Math.max(0, Math.min(95, startPos.current.ex + dx)),
                y: Math.max(0, Math.min(95, startPos.current.ey + dy)),
            });
        };
        const onUp = () => {
            isDragging.current = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        if ((e.target as HTMLElement).dataset.resize) return;
        e.stopPropagation();
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);

        const onMove = (te: TouchEvent) => {
            if (!isDragging.current || !containerRef.current || !te.touches[0]) return;
            te.preventDefault();
            const rect = containerRef.current.getBoundingClientRect();
            const dx = ((te.touches[0].clientX - startPos.current.mx) / rect.width) * 100;
            const dy = ((te.touches[0].clientY - startPos.current.my) / rect.height) * 100;
            onUpdate(id, {
                x: Math.max(0, Math.min(95, startPos.current.ex + dx)),
                y: Math.max(0, Math.min(95, startPos.current.ey + dy)),
            });
        };
        const onEnd = () => {
            isDragging.current = false;
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        };
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    };

    // Resize: köşe handle
    const onResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startScale = layout.scale;
        const startX = e.clientX;

        const onMove = (me: MouseEvent) => {
            const delta = (me.clientX - startX) / 80;
            onUpdate(id, { scale: Math.max(0.4, Math.min(2.0, startScale + delta)) });
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    const onResizeTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startScale = layout.scale;
        const startX = e.touches[0].clientX;

        const onMove = (te: TouchEvent) => {
            if (!te.touches[0]) return;
            te.preventDefault();
            const delta = (te.touches[0].clientX - startX) / 80;
            onUpdate(id, { scale: Math.max(0.4, Math.min(2.0, startScale + delta)) });
        };
        const onEnd = () => {
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        };
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    };

    return (
        <div
            className="absolute touch-none select-none cursor-grab active:cursor-grabbing"
            style={{ left: `${layout.x}%`, top: `${layout.y}%`, transform: `scale(${layout.scale})`, transformOrigin: 'top left' }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
        >
            {/* Seçim çerçevesi */}
            <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400 pointer-events-none z-10" />
                {/* Label */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-yellow-300 whitespace-nowrap pointer-events-none z-10 drop-shadow-md">
                    {label}
                </div>
                {/* Resize handle — sağ alt köşe */}
                <div
                    data-resize="1"
                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full z-20 cursor-se-resize flex items-center justify-center shadow-lg"
                    onMouseDown={onResizeMouseDown}
                    onTouchStart={onResizeTouchStart}
                >
                    <svg width="8" height="8" viewBox="0 0 8 8" className="pointer-events-none">
                        <path d="M1 7L7 1M4 7L7 4M7 7L7 7" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>
                {children}
            </div>
        </div>
    );
};

export const HudEditor: React.FC<Props> = ({ layout, onChange, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null!);

    const updateElement = useCallback((id: keyof HudLayout, patch: Partial<HudElementLayout>) => {
        onChange({ ...layout, [id]: { ...layout[id], ...patch } });
    }, [layout, onChange]);

    const joystickSize = 128;
    const actionBtnSize = 80;
    const punchBtnSize = 72;
    const musicBtnSize = Math.round(actionBtnSize * 0.55);

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.6)' }}>
            {/* Üst bar */}
            <div className="flex-none flex items-center justify-between px-4 py-2 bg-stone-900/90 border-b border-yellow-600/40">
                <div>
                    <span className="text-yellow-300 font-black text-sm">🎮 Arayüz Düzenle</span>
                    <p className="text-stone-400 text-[10px] mt-0.5">Sürükle: taşı · Sarı köşe: boyutlandır</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onChange(DEFAULT_HUD_LAYOUT)}
                        className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg text-xs font-bold border border-stone-600 transition-colors"
                    >
                        ↺ Sıfırla
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-stone-900 rounded-lg text-xs font-black border border-yellow-300 transition-colors"
                    >
                        ✓ Kaydet
                    </button>
                </div>
            </div>

            {/* Düzenleme alanı */}
            <div ref={containerRef} className="flex-1 relative overflow-hidden">
                {/* Izgara arka plan */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '5% 5%' }}
                />

                <DraggableHudItem id="joystick" layout={layout.joystick} containerRef={containerRef} onUpdate={updateElement} label="Joystick">
                    <div className="rounded-full bg-stone-400/70 border-4 border-stone-600 flex items-center justify-center"
                        style={{ width: joystickSize, height: joystickSize }}>
                        <div className="rounded-full bg-stone-700" style={{ width: joystickSize / 2, height: joystickSize / 2 }} />
                    </div>
                </DraggableHudItem>

                <DraggableHudItem id="punchBtn" layout={layout.punchBtn} containerRef={containerRef} onUpdate={updateElement} label="Döv">
                    <div className="bg-red-500 text-white rounded-full shadow-xl font-black text-sm border-4 border-red-300 flex items-center justify-center"
                        style={{ width: punchBtnSize, height: punchBtnSize }}>
                        DÖV<br />👊
                    </div>
                </DraggableHudItem>

                <DraggableHudItem id="actionBtn" layout={layout.actionBtn} containerRef={containerRef} onUpdate={updateElement} label="AL/VER">
                    <div className="bg-blue-500 text-white rounded-full shadow-xl font-black text-sm border-4 border-blue-300 flex items-center justify-center"
                        style={{ width: actionBtnSize, height: actionBtnSize }}>
                        AL<br />VER
                    </div>
                </DraggableHudItem>

                <DraggableHudItem id="musicBtn" layout={layout.musicBtn} containerRef={containerRef} onUpdate={updateElement} label="Müzik">
                    <div className="rounded-full shadow-md text-base border-2 flex items-center justify-center bg-stone-700 border-stone-600 text-stone-400"
                        style={{ width: musicBtnSize, height: musicBtnSize }}>
                        🔇
                    </div>
                </DraggableHudItem>

                <DraggableHudItem id="chopBtn" layout={layout.chopBtn} containerRef={containerRef} onUpdate={updateElement} label="Doğra">
                    <div className="bg-amber-600 text-white rounded-full shadow-xl font-black text-xs border-4 border-amber-400 flex items-center justify-center"
                        style={{ width: Math.round(actionBtnSize * 0.7), height: Math.round(actionBtnSize * 0.7) }}>
                        🔪<br />DOĞRA
                    </div>
                </DraggableHudItem>
            </div>
        </div>
    );
};
