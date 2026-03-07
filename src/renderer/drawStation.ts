/** Bir ürün/servis istasyonu kutusu çizer */
export function drawStation(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    icon: string,
    label: string,
    stock?: number,
) {
    const w = 90, h = 90;

    // Derin gölge
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 5, y - h / 2 + 7, w, h, 12);
    ctx.fill();

    // Gradient gövde (3D etki)
    const grad = ctx.createLinearGradient(x, y - h / 2, x, y + h / 2);
    grad.addColorStop(0, lighten(color, 25));
    grad.addColorStop(0.6, color);
    grad.addColorStop(1, darken(color, 15));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 12);
    ctx.fill();

    // Üst renk şeridi (kategori göstergesi)
    ctx.fillStyle = darken(color, 20);
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, 10, [12, 12, 0, 0]);
    ctx.fill();

    // Parlama efekti (cam gibi)
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 5, y - h / 2 + 12, w - 10, h / 3, 8);
    ctx.fill();

    // Kenarlık
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 12);
    ctx.stroke();

    // İkon (gölgeli)
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.font = '34px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x, y - 8);
    ctx.shadowBlur = 0;

    // Etiket
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(label, x, y + 26);

    // Stok Badge
    if (stock !== undefined) {
        const badgeColor = stock > 5 ? '#22c55e' : stock > 0 ? '#f59e0b' : '#ef4444';
        const badgeX = x + w / 2 - 12;
        const badgeY = y - h / 2 + 12;

        ctx.fillStyle = badgeColor;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(stock), badgeX, badgeY);
    }
}

/** Rengi açar (highlight için) */
function lighten(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
}

/** Rengi koyulaştırır (shadow için) */
function darken(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return `rgb(${r},${g},${b})`;
}
