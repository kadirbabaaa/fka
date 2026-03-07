/**
 * Masa + 4 sandalye takımı çizer — detaylı restoran görünümü
 * Top-down (yukarıdan bakış) açısıyla
 */
export function drawTable(ctx: CanvasRenderingContext2D, cx: number, cy: number) {

    // ── 4 Sandalye ────────────────────────────────────────────────────────────
    drawChair(ctx, cx - 28, cy - 56, 'up');
    drawChair(ctx, cx + 28, cy - 56, 'up');
    drawChair(ctx, cx - 28, cy + 40, 'down');
    drawChair(ctx, cx + 28, cy + 40, 'down');

    // ── Masa Golvesi (masanın altında tüm yapının gölgesi) ────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.13)';
    ctx.beginPath();
    ctx.roundRect(cx - 44, cy - 28, 88, 64, 12);
    ctx.fill();

    // ── Ahşap masa çerçevesi (örtünün altından sadece kenar görünür) ──────────
    const frameGrad = ctx.createLinearGradient(cx - 42, cy - 30, cx + 42, cy + 30);
    frameGrad.addColorStop(0, '#b8864e');
    frameGrad.addColorStop(1, '#8b6914');
    ctx.fillStyle = frameGrad;
    ctx.beginPath();
    ctx.roundRect(cx - 42, cy - 32, 84, 62, 10);
    ctx.fill();
    ctx.strokeStyle = '#7a5c12';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ── ÖRTÜ: Sarkan kenar gölgesi (örtünün masadan dışarı taşan kısmı) ──────
    // Örtü masadan biraz taşıyor, taşan kısımlar hafif gölge bırakır
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    // Üst sarkma gölgesi
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 32);
    ctx.quadraticCurveTo(cx, cy - 40, cx + 40, cy - 32);
    ctx.lineTo(cx + 40, cy - 32);
    ctx.closePath();
    ctx.fill();
    // Alt sarkma gölgesi
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 30);
    ctx.quadraticCurveTo(cx, cy + 40, cx + 40, cy + 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // ── ÖRTÜ: Ana kumaş yüzeyi ───────────────────────────────────────────────
    // Örtü masadan biraz büyük, kenarlar hafif dalgalı (organik form)
    ctx.save();
    ctx.beginPath();
    // Üst kenar — hafif dalgalı, ortada aşağı sarkar
    ctx.moveTo(cx - 46, cy - 30);
    ctx.quadraticCurveTo(cx - 20, cy - 36, cx, cy - 35);
    ctx.quadraticCurveTo(cx + 20, cy - 36, cx + 46, cy - 30);
    // Sağ kenar — hafif dışa bombeli
    ctx.quadraticCurveTo(cx + 49, cy, cx + 46, cy + 28);
    // Alt kenar — hafif dalgalı
    ctx.quadraticCurveTo(cx + 20, cy + 35, cx, cy + 33);
    ctx.quadraticCurveTo(cx - 20, cy + 35, cx - 46, cy + 28);
    // Sol kenar — hafif dışa bombeli
    ctx.quadraticCurveTo(cx - 49, cy, cx - 46, cy - 30);
    ctx.closePath();

    // Kumaş gradient — çok hafif beyaz-krem tonları
    const clothGrad = ctx.createRadialGradient(cx - 8, cy - 8, 5, cx, cy, 55);
    clothGrad.addColorStop(0, '#ffffff');
    clothGrad.addColorStop(0.5, '#fafaf8');
    clothGrad.addColorStop(1, '#f0ede8');
    ctx.fillStyle = clothGrad;
    ctx.fill();

    // Örtü kenar çizgisi — çok ince, doğal
    ctx.strokeStyle = 'rgba(190,185,175,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // ── ÖRTÜ: Kumaş kıvrım/katlama gölgeleri (doğal görünüm) ─────────────────
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.2;

    // Yatay kıvrım 1
    ctx.beginPath();
    ctx.moveTo(cx - 38, cy - 12);
    ctx.bezierCurveTo(cx - 15, cy - 14, cx + 15, cy - 10, cx + 38, cy - 12);
    ctx.stroke();

    // Yatay kıvrım 2
    ctx.beginPath();
    ctx.moveTo(cx - 36, cy + 8);
    ctx.bezierCurveTo(cx - 10, cy + 6, cx + 10, cy + 10, cx + 36, cy + 8);
    ctx.stroke();

    // Dikey kıvrım (hafif)
    ctx.globalAlpha = 0.04;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 30);
    ctx.bezierCurveTo(cx - 10, cy - 10, cx - 6, cy + 10, cx - 8, cy + 28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 10, cy - 30);
    ctx.bezierCurveTo(cx + 8, cy - 10, cx + 12, cy + 10, cx + 10, cy + 28);
    ctx.stroke();

    ctx.restore();

    // ── ÖRTÜ: Üst kısım hafif ışık yansıması ─────────────────────────────────
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(cx - 5, cy - 14, 28, 10, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── Ortadaki dekoratif peçete + çiçek ─────────────────────────────────────
    // Küçük katlanmış peçete (kare, hafif dönük)
    ctx.save();
    ctx.translate(cx, cy - 1);
    ctx.rotate(Math.PI / 4); // 45 derece döndür — elmas formu
    ctx.fillStyle = '#fdfcfa';
    ctx.fillRect(-6, -6, 12, 12);
    ctx.strokeStyle = 'rgba(180,175,165,0.35)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-6, -6, 12, 12);
    ctx.restore();

    // Çiçek
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌸', cx, cy - 1);
}

/**
 * Tek bir sandalye çizer
 * dir: 'up' = masanın üstünde (aşağı bakıyor), 'down' = masanın altında (yukarı bakıyor)
 */
function drawChair(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    dir: 'up' | 'down',
) {
    const w = 24, h = 20;

    // ── Gölge ─────────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.roundRect(cx - w / 2 + 2, cy + 3, w, h, 5);
    ctx.fill();

    // ── Oturma yüzeyi (yastık) ────────────────────────────────────────────────
    const cushionGrad = ctx.createLinearGradient(cx, cy, cx, cy + h);
    cushionGrad.addColorStop(0, '#dc8a6e');
    cushionGrad.addColorStop(1, '#b5694d');
    ctx.fillStyle = cushionGrad;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy, w, h, 6);
    ctx.fill();

    // ── Yastık parlama ────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.roundRect(cx - w / 2 + 3, cy + 2, w - 6, 6, 3);
    ctx.fill();

    // ── Kenar ─────────────────────────────────────────────────────────────────
    ctx.strokeStyle = '#8b5a3a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy, w, h, 6);
    ctx.stroke();

    // ── Arkalık (yöne göre) ───────────────────────────────────────────────────
    const backH = 8;
    if (dir === 'up') {
        // Arkalık üstte (masanın üstündeki sandalye)
        const grad2 = ctx.createLinearGradient(cx, cy - backH - 4, cx, cy - 4);
        grad2.addColorStop(0, '#6d3a1f');
        grad2.addColorStop(1, '#8b5a3a');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.roundRect(cx - w / 2 + 2, cy - backH - 4, w - 4, backH, [4, 4, 0, 0]);
        ctx.fill();
        // Arkalık dekoratif çubuklar
        ctx.strokeStyle = '#5a2d10';
        ctx.lineWidth = 1;
        for (let i = 0; i < 2; i++) {
            const lx = cx - 4 + i * 8;
            ctx.beginPath();
            ctx.moveTo(lx, cy - backH - 2);
            ctx.lineTo(lx, cy - 5);
            ctx.stroke();
        }
    } else {
        // Arkalık altta (masanın altındaki sandalye)
        const grad2 = ctx.createLinearGradient(cx, cy + h + 4, cx, cy + h + backH + 4);
        grad2.addColorStop(0, '#8b5a3a');
        grad2.addColorStop(1, '#6d3a1f');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.roundRect(cx - w / 2 + 2, cy + h + 4, w - 4, backH, [0, 0, 4, 4]);
        ctx.fill();
        ctx.strokeStyle = '#5a2d10';
        ctx.lineWidth = 1;
        for (let i = 0; i < 2; i++) {
            const lx = cx - 4 + i * 8;
            ctx.beginPath();
            ctx.moveTo(lx, cy + h + 5);
            ctx.lineTo(lx, cy + h + backH + 2);
            ctx.stroke();
        }
    }
}
