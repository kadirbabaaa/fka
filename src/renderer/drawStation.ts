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

    // Gölge
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 4, y - h / 2 + 6, w, h, 10);
    ctx.fill();

    // Gövde
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 10);
    ctx.fill();

    // Üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 4, y - h / 2 + 4, w - 8, h / 3, [10, 10, 0, 0]);
    ctx.fill();

    // Kenarlık
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 10);
    ctx.stroke();

    // İkon
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(icon, x, y - 8);

    // Etiket
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(label, x, y + 26);

    // Stok sayısı
    if (stock !== undefined) {
        ctx.fillStyle = stock > 5 ? '#15803d' : '#dc2626';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`x${stock}`, x, y + 42);
    }
}
