import { CookStation, COOK_STATION_DEFS } from '../types/game';

type StationId = keyof typeof COOK_STATION_DEFS;

/**
 * Pişirme istasyonu çizer.
 * - Boş: sadece istasyon kutusu
 * - Pişiyor: progress ring animasyonu
 * - Hazır: pulse efekti + output emoji
 */
export function drawCookStation(
    ctx: CanvasRenderingContext2D,
    id: StationId,
    station: CookStation,
    time: number,
) {
    const def = COOK_STATION_DEFS[id];
    const { x, y } = def.pos;
    const w = 90, h = 70;

    // ── Gölge ──────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 4, y - h / 2 + 5, w, h, 10);
    ctx.fill();

    // ── Gövde rengi: duruma göre ────────────────────────────────────────────
    let bgColor = '#78716c'; // boş — gri
    if (station.input) bgColor = '#ea580c'; // pişiyor — turuncu
    if (station.output) bgColor = '#16a34a'; // hazır — yeşil

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 10);
    ctx.fill();

    // Üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 4, y - h / 2 + 3, w - 8, h / 3, [10, 10, 0, 0]);
    ctx.fill();

    // Kenarlık
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 10);
    ctx.stroke();

    // ── İçerik ──────────────────────────────────────────────────────────────

    if (station.input && station.timer > 0) {
        // Pişiyor — progress ring
        const progress = 1 - station.timer / def.time;
        const radius = 18;

        // Arka halka
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y - 4, radius, 0, Math.PI * 2);
        ctx.stroke();

        // İlerleme halkası
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(x, y - 4, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
        ctx.lineCap = 'butt';

        // Input emoji (ortada, küçük)
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(station.input, x, y - 4);

        // Yüzde
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(`${Math.round(progress * 100)}%`, x, y + 20);

    } else if (station.output) {
        // Hazır — pulse efekti
        const pulse = 1 + Math.sin(time / 200) * 0.1;
        ctx.save();
        ctx.translate(x, y - 4);
        ctx.scale(pulse, pulse);
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(station.output, 0, 0);
        ctx.restore();

        // "HAZIR!" yazısı
        ctx.fillStyle = '#fef9c3';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HAZIR!', x, y + 22);

    } else {
        // Boş — sadece label
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(def.output, x, y - 6);
    }

    // ── Etiket (altta) ──────────────────────────────────────────────────────
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(def.label, x, y + h / 2 + 3);
}
