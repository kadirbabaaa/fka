/** Masa + 4 sandalye takımı çizer */
export function drawTable(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const chairColor = '#92400e';
    const chairBack = '#78350f';

    // Üst 2 sandalye
    for (const ox of [-25, 25]) {
        ctx.fillStyle = chairColor;
        ctx.beginPath();
        ctx.roundRect(cx + ox - 14, cy - 58, 28, 22, 6);
        ctx.fill();
        ctx.fillStyle = chairBack;
        ctx.fillRect(cx + ox - 12, cy - 70, 24, 10);
    }

    // Alt 2 sandalye
    for (const ox of [-25, 25]) {
        ctx.fillStyle = chairColor;
        ctx.beginPath();
        ctx.roundRect(cx + ox - 14, cy + 36, 28, 22, 6);
        ctx.fill();
        ctx.fillStyle = chairBack;
        ctx.fillRect(cx + ox - 12, cy + 60, 24, 10);
    }

    // Masa gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.roundRect(cx - 44, cy - 32, 90, 70, 10);
    ctx.fill();

    // Masa yüzeyi (degrade)
    const grad = ctx.createLinearGradient(cx - 44, cy - 30, cx + 46, cy + 38);
    grad.addColorStop(0, '#fde68a');
    grad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(cx - 44, cy - 34, 88, 68, 10);
    ctx.fill();

    // Masa kenarı
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - 44, cy - 34, 88, 68, 10);
    ctx.stroke();

    // Tabak izi (dekor)
    ctx.strokeStyle = 'rgba(217,119,6,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy - 2, 20, 0, Math.PI * 2);
    ctx.stroke();
}
