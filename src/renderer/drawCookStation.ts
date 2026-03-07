import { CookStation, COOK_STATION_DEFS, BURN_TICKS, BURNED_FOOD } from '../types/game';

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
    const w = 76, h = 58;

    // ── 3D Fırın / İstasyon Görünümü ──────────────────────────────────────────

    // 1. Gölge (Geniş elips)
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + h / 2 + 5, w * 0.55, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Renk Tanımları
    let frontColor = '#78716c'; // Normal gövde
    let topColor = '#a8a29e';   // Üst tezgah
    let winColor = '#292524';   // Fırın içi
    let glowColor = '';         // Fırın ışıması

    if (station.input) {
        frontColor = '#ea580c'; // Pişiyor 
        topColor = '#f97316';
        winColor = '#fdba74';
        glowColor = 'rgba(252, 211, 77, 0.4)';
    } else if (station.isBurned) {
        frontColor = '#1c1917'; // YANDI
        topColor = '#292524';
        winColor = '#000000';
    } else if (station.output) {
        frontColor = '#16a34a'; // HAZIR
        topColor = '#22c55e';
        glowColor = 'rgba(134, 239, 172, 0.3)';
    }

    const topDepth = 22; // İzometrik/Üst derinlik
    const boxY = y - h / 2 + 10; // Kutu y ofseti (Y eksenini ortaladık)

    // 2. Ana Gövde (Ön Yüz)
    ctx.fillStyle = frontColor;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, boxY, w, h - 10, 8);
    ctx.fill();

    // Ön Kenarlık
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Üst Yüzey (Tezgah - Trapezoid)
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, boxY);
    ctx.lineTo(x - w / 2 + 12, boxY - topDepth);
    ctx.lineTo(x + w / 2 - 12, boxY - topDepth);
    ctx.lineTo(x + w / 2, boxY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Ocak Göstergeleri (Üst Tezgah Detayları)
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x - 16, boxY - 10, 8, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 16, boxY - 10, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Fırın Kapağı (Ön Yüzde Siyah/Turuncu Cam)
    const winW = w * 0.65;
    const winH = (h - 10) * 0.45;
    const winY = boxY + 12; // Kapağın Y konumu

    ctx.fillStyle = winColor;
    ctx.beginPath();
    ctx.roundRect(x - winW / 2, winY, winW, winH, 4);
    ctx.fill();

    // 6. Işıma (Glow) ve Cam Parlaması
    if (glowColor) {
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.roundRect(x - winW / 2, winY, winW, winH, 4);
        ctx.fill();
    }

    // Cam ışıltı yansıması (Parlak beyaz/gri çapraz çizik)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(x - winW / 2, winY);
    ctx.lineTo(x + winW / 2 - 10, winY);
    ctx.lineTo(x + winW / 2 - 25, winY + winH);
    ctx.lineTo(x - winW / 2, winY + winH);
    ctx.closePath();
    ctx.fill();

    // Fırın tutma kulbu (Kapağın üstünde yatay gri bar)
    ctx.strokeStyle = '#d6d3d1';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - winW / 3, winY - 6);
    ctx.lineTo(x + winW / 3, winY - 6);
    ctx.stroke();

    // 7. Fırın Düğmeleri (Öst Sağ veya Üst panele)
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.arc(x - w / 2 + 12, boxY + 6, 3, 0, Math.PI * 2);
    ctx.arc(x - w / 2 + 22, boxY + 6, 3, 0, Math.PI * 2);
    ctx.arc(x + w / 2 - 22, boxY + 6, 3, 0, Math.PI * 2);
    ctx.arc(x + w / 2 - 12, boxY + 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // ── İçerik (Emojiler vs. Fırın Tezgahı Üzerine) ──────────────────────────
    // İçeriği fırının üst (izometrik) tezgahına tam merkeze oturtalım
    const contentY = boxY - topDepth / 2;

    if (station.input && station.timer > 0) {
        // Pişiyor — progress ring
        const progress = 1 - station.timer / def.time;
        const radius = 14;

        // Arka halka
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, contentY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // İlerleme halkası
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(x, contentY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
        ctx.lineCap = 'butt';

        // Input emoji (ortada, küçük)
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(station.input, x, contentY);

        // Yüzde (Hemen altına)
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(`${Math.round(progress * 100)}%`, x, contentY + 24);

    } else if (station.isBurned) {
        // Yandı — Kömür efekti
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(BURNED_FOOD, x, contentY);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YANDI!', x, contentY + 20);

    } else if (station.output) {
        // Hazır — pulse efekti
        const pulse = 1 + Math.sin(time / 200) * 0.1;
        ctx.save();
        ctx.translate(x, contentY);
        ctx.scale(pulse, pulse);
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(station.output, 0, 0);
        ctx.restore();

        // Yanma Uyarı Barı & İkonu
        if (station.burnTimer !== undefined && station.burnTimer > 0) {
            const burnPct = Math.max(0, 1 - station.burnTimer / BURN_TICKS); // 0 -> 1'e kadar dolar

            // Yanıp sönen uyarı ikonu (Sadece son demlerde hızlı yanar)
            if (burnPct > 0.5 && Math.floor(Date.now() / (burnPct > 0.8 ? 100 : 300)) % 2 === 0) {
                ctx.font = '18px Arial';
                ctx.fillText('🔥', x + 14, contentY - 14);
            }

            // Kırmızı/turuncu tehlike barı
            const barW = 32;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(x - barW / 2, contentY + 16, barW, 6);
            ctx.fillStyle = burnPct > 0.8 ? '#ef4444' : '#f97316';
            ctx.fillRect(x - barW / 2, contentY + 16, barW * burnPct, 6);
        } else {
            // Normal hazır barı yoksa "HAZIR!" metni
            ctx.fillStyle = '#fef9c3';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('HAZIR!', x, contentY + 18);
        }
    } else {
        // Boş — sadece label (istenen çıkış emojisini gösteriyoruz silik bir formatta)
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(def.output, x, contentY);
    }

    // ── Etiket (altta gövdenin hemen altında) ──────────────────────────────
    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(def.label, x, y + h / 2 - 2);
}
