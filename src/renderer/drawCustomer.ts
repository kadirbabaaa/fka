import { Customer, TABLE_Y } from '../types/game';

/**
 * Müşteri çizer.
 * - Yürürken: saydam + küçük
 * - Otururken + bekliyor: yöne göre sandalye, balon, sabır barı
 * - Yiyor: yeme animasyonu
 * Üst sıra (seatY < TABLE_Y) → aşağı bakıyor
 * Alt sıra (seatY > TABLE_Y) → yukarı bakıyor (masaya doğru)
 */
export function drawCustomer(ctx: CanvasRenderingContext2D, c: Customer) {
    const { x, y, seatY, wants, patience, maxPatience, isSeated, isEating, eatTimer } = c;

    // Yön: alt sıra mı? (masanın altında oturan müşteriler yukarı bakar)
    const facingUp = seatY > TABLE_Y;
    const dir = facingUp ? -1 : 1; // -1 = yukarı bakıyor, 1 = aşağı bakıyor

    // ── Yeme animasyonu ──────────────────────────────────────────────────────
    if (isEating) {
        const progress = eatTimer / 90; // 1→0
        ctx.globalAlpha = 0.9;

        // Gövde
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();

        // Yüz
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x, y - 2 * dir, 12, 0, Math.PI * 2);
        ctx.fill();

        // Yüzen yemek emojisi
        ctx.globalAlpha = progress;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const emojiY = facingUp ? y + 30 + (1 - progress) * 15 : y - 30 - (1 - progress) * 15;
        ctx.fillText('🍽️', x, emojiY);

        // Yeme süre barı
        ctx.globalAlpha = 0.9;
        const barY = facingUp ? y - 24 : y + 22;
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(x - 20, barY, 40, 5, 2);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(x - 20, barY, 40 * progress, 5, 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        return;
    }

    // ── Yürüme / bekleme ─────────────────────────────────────────────────────
    const pp = Math.max(0, patience / maxPatience);
    const barColor = pp > 0.5 ? '#22c55e' : pp > 0.25 ? '#f59e0b' : '#ef4444';
    const radius = isSeated ? 18 : 14;

    ctx.globalAlpha = isSeated ? 1 : 0.6;

    // Gövde
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Yüz
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y - 2 * dir, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    if (isSeated) {
        // Sandalye yayı — yöne göre
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        if (facingUp) {
            // Alt sıra: sandalye altta, müşteri yukarı bakıyor
            ctx.arc(x, y + 14, 14, 0, Math.PI);
        } else {
            // Üst sıra: sandalye üstte, müşteri aşağı bakıyor
            ctx.arc(x, y - 14, 14, Math.PI, Math.PI * 2);
        }
        ctx.fill();

        // Konuşma balonu — yöne göre
        const bx = x + 28;
        const by = facingUp ? y + 36 : y - 36;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(bx - 16, by - 14, 36, 28, 7);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Balon kuyruğu — yöne göre
        ctx.fillStyle = 'white';
        ctx.beginPath();
        if (facingUp) {
            ctx.moveTo(bx - 8, by - 14);
            ctx.lineTo(x + 14, y + 6);
            ctx.lineTo(bx + 4, by - 14);
        } else {
            ctx.moveTo(bx - 8, by + 14);
            ctx.lineTo(x + 14, y - 6);
            ctx.lineTo(bx + 4, by + 14);
        }
        ctx.fill();

        // İstenen ürün
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText(wants || '?', bx + 2, by);

        // Sabır barı — yöne göre
        const pw = 40;
        const barY = facingUp ? y - 26 : y + 24;
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(x - pw / 2, barY, pw, 5, 2);
        ctx.fill();
        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.roundRect(x - pw / 2, barY, pw * pp, 5, 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}
