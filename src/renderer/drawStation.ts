/** Bir ürün/servis istasyonu kutusu çizer — kompakt ve şık tasarım */
export function drawStation(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    icon: string,
    label: string,
    _stock?: number,  // Artık kullanılmıyor (sonsuz stok), eski çağrılarla uyumluluk için korundu
    locked?: boolean, // Kilitli malzeme (yemek kilidi sistemi)
) {
    const w = 60, h = 56;

    ctx.save();

    if (locked) {
        ctx.globalAlpha = 0.35;
    }

    // Yumuşak gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 3, y - h / 2 + 4, w, h, 10);
    ctx.fill();

    // Ana kutu
    const grad = ctx.createLinearGradient(x, y - h / 2, x, y + h / 2);
    grad.addColorStop(0, '#e8ddd0');
    grad.addColorStop(1, '#d4c4b0');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 10);
    ctx.fill();

    // İnce kenar
    ctx.strokeStyle = '#c4b49e';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Üst renk bandı
    ctx.fillStyle = locked ? '#78716c' : color;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, 8, [10, 10, 0, 0]);
    ctx.fill();

    // İç cam parlama
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 4, y - h / 2 + 10, w - 8, h / 3, 6);
    ctx.fill();

    // İkon
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(locked ? '🔒' : icon, x, y - 4);

    // Etiket
    ctx.fillStyle = locked ? '#a8a29e' : '#78716c';
    ctx.font = 'bold 10px Arial';
    ctx.fillText(locked ? 'Kilitli' : label, x, y + 18);

    ctx.globalAlpha = 1;
    ctx.restore();
}
