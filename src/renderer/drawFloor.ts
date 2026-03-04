import {
    GAME_WIDTH, GAME_HEIGHT, WALL_Y1, DOOR_RANGES,
    INGREDIENTS, COOK_STATION_DEFS, TRASH_STATION, SINK_STATION,
    UTIL_WALL_X1, UTIL_WALL_X2, UTIL_DOOR_RANGE,
} from '../types/game';

/** Restoran zemini: mutfak tezgahlar + salon ahşap + duvar + kapılar */
export function drawFloor(ctx: CanvasRenderingContext2D) {
    // ── Yemek salonu — sıcak ahşap ────────────────────────────────────────────
    ctx.fillStyle = '#f5e6d0';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Ahşap çizgiler
    ctx.strokeStyle = '#e8d4b8';
    ctx.lineWidth = 1;
    for (let y = WALL_Y1 + 18; y < GAME_HEIGHT; y += 36) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_WIDTH, y); ctx.stroke();
    }
    for (let x = 0; x < GAME_WIDTH; x += 100) {
        for (let row = 0; row < (GAME_HEIGHT - WALL_Y1) / 36; row++) {
            const off = row % 2 === 0 ? 0 : 50;
            const ry = WALL_Y1 + 18 + row * 36;
            ctx.beginPath(); ctx.moveTo(x + off, ry); ctx.lineTo(x + off, ry + 36); ctx.stroke();
        }
    }

    // ── Mutfak zemini — koyu karo ──────────────────────────────────────────────
    ctx.fillStyle = '#d4cfc8';
    ctx.fillRect(0, 0, GAME_WIDTH, WALL_Y1);

    const tile = 32;
    for (let ty = 0; ty < WALL_Y1; ty += tile) {
        for (let tx = 0; tx < GAME_WIDTH; tx += tile) {
            if ((Math.floor(tx / tile) + Math.floor(ty / tile)) % 2 === 0) {
                ctx.fillStyle = 'rgba(0,0,0,0.05)';
                ctx.fillRect(tx, ty, tile, tile);
            }
            // Karo çizgisi
            ctx.strokeStyle = 'rgba(0,0,0,0.06)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(tx, ty, tile, tile);
        }
    }

    // ── Arka duvar (mutfak üstü) ───────────────────────────────────────────────
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(0, 0, GAME_WIDTH, 8);

    // ── Tezgah — malzeme rafları (üst sıra) ────────────────────────────────────
    INGREDIENTS.forEach(ing => {
        const { x, y } = ing.pos;
        // Tezgah yüzeyi
        ctx.fillStyle = '#d6d3d1';
        ctx.beginPath();
        ctx.roundRect(x - 55, y - 30, 110, 60, 6);
        ctx.fill();
        ctx.strokeStyle = '#a8a29e';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Tezgah üst parlama
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x - 53, y - 28, 106, 8);
    });

    // ── Tezgah — pişirme istasyonları (alt sıra) ──────────────────────────────
    for (const def of Object.values(COOK_STATION_DEFS)) {
        const { x, y } = def.pos;
        // Tezgah yüzeyi
        ctx.fillStyle = '#c4b5a4';
        ctx.beginPath();
        ctx.roundRect(x - 55, y - 28, 110, 56, 6);
        ctx.fill();
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // ── Lavabo (dekoratif) ──────────────────────────────────────────────────────
    const sx = SINK_STATION.x, sy = SINK_STATION.y;
    // Tezgah
    ctx.fillStyle = '#d6d3d1';
    ctx.beginPath();
    ctx.roundRect(sx - 40, sy - 30, 80, 60, 8);
    ctx.fill();
    ctx.strokeStyle = '#a8a29e';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Lavabo çukuru
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(sx - 22, sy - 14, 44, 28, 10);
    ctx.fill();
    // Su parlaması
    ctx.fillStyle = 'rgba(147,197,253,0.4)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Musluk
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 14);
    ctx.lineTo(sx, sy - 28);
    ctx.lineTo(sx + 10, sy - 28);
    ctx.stroke();
    // Etiket
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('🚿 Lavabo', sx, sy + 22);

    // ── Çöp kutusu tezgahı ──────────────────────────────────────────────────────
    const tx = TRASH_STATION.x, tty = TRASH_STATION.y;
    ctx.fillStyle = '#d6d3d1';
    ctx.beginPath();
    ctx.roundRect(tx - 35, tty - 25, 70, 50, 8);
    ctx.fill();
    ctx.strokeStyle = '#a8a29e';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ── Ok işaretleri (malzeme → pişirme akışı) ────────────────────────────────
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    INGREDIENTS.forEach(ing => {
        ctx.beginPath();
        ctx.moveTo(ing.pos.x, ing.pos.y + 30);
        ctx.lineTo(ing.pos.x, ing.pos.y + 55);
        ctx.stroke();
        // Ok ucu
        ctx.beginPath();
        ctx.moveTo(ing.pos.x - 5, ing.pos.y + 50);
        ctx.lineTo(ing.pos.x, ing.pos.y + 58);
        ctx.lineTo(ing.pos.x + 5, ing.pos.y + 50);
        ctx.stroke();
    });
    ctx.setLineDash([]);

    // ── Duvar ─────────────────────────────────────────────────────────────────
    ctx.fillStyle = '#6b5240';
    ctx.fillRect(0, WALL_Y1, GAME_WIDTH, 18);

    // Kapılar (servis pencereleri)
    DOOR_RANGES.forEach(([x1, x2]) => {
        const w = x2 - x1;
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(x1, WALL_Y1, w, 18);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(x1, WALL_Y1, w, 3);
    });

    // ── Dikey Duvar (mutfak ↔ lavabo bölümü) ────────────────────────────
    const uwx = UTIL_WALL_X1;
    const uww = UTIL_WALL_X2 - UTIL_WALL_X1;
    const [doorTop, doorBot] = UTIL_DOOR_RANGE;
    // Üst kısım (duvarın kapının üstü)
    ctx.fillStyle = '#6b5240';
    ctx.fillRect(uwx, 0, uww, doorTop);
    // Alt kısım (kapının altından duvara kadar)
    ctx.fillRect(uwx, doorBot, uww, WALL_Y1 - doorBot);
    // Kapı açıklığı
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(uwx, doorTop, uww, doorBot - doorTop);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(uwx, doorTop, 3, doorBot - doorTop);
    ctx.fillRect(uwx + uww - 3, doorTop, 3, doorBot - doorTop);

    // ── Giriş kapısı (alt) ────────────────────────────────────────────────────
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, GAME_HEIGHT - 30, GAME_WIDTH, 30);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(570, GAME_HEIGHT - 30, 140, 30);
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GİRİŞ', 640, GAME_HEIGHT - 15);
}
