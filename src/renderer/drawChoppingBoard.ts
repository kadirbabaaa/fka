import { ChoppingBoard, CHOP_TICKS, isChopped, getChoppedSource } from '../types/game';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawChoppingBoard(
  ctx: CanvasRenderingContext2D,
  board: ChoppingBoard,
  time: number,
) {
  const { x, y, input, progress, isChopping } = board;

  // Gölge
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y + 20, 38, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ahşap tahta gövdesi
  const woodGrad = ctx.createLinearGradient(x - 34, y - 12, x + 34, y + 16);
  woodGrad.addColorStop(0, '#d4b483');
  woodGrad.addColorStop(0.5, '#c8a96e');
  woodGrad.addColorStop(1, '#a8834a');
  ctx.fillStyle = woodGrad;
  roundRect(ctx, x - 34, y - 12, 68, 32, 5);
  ctx.fill();

  // Ahşap doku çizgileri
  ctx.strokeStyle = 'rgba(100, 60, 20, 0.2)';
  ctx.lineWidth = 1;
  for (let i = -1; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 28, y - 4 + i * 8);
    ctx.lineTo(x + 28, y - 2 + i * 8);
    ctx.stroke();
  }

  // Tahta kenar
  ctx.strokeStyle = '#7a5535';
  ctx.lineWidth = 2;
  roundRect(ctx, x - 34, y - 12, 68, 32, 5);
  ctx.stroke();

  // Tutma kolu
  ctx.fillStyle = '#9a6a3a';
  roundRect(ctx, x + 30, y - 4, 14, 18, 3);
  ctx.fill();
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x + 30, y - 4, 14, 18, 3);
  ctx.stroke();

  // Etiket (tahtanın altında)
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('🔪 Kesme Tahtası', x, y + 24);

  // Üzerindeki malzeme
  if (input) {
    const displayItem = isChopped(input) ? getChoppedSource(input) : input;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayItem, x - 4, y + 4);

    if (isChopped(input)) {
      // Doğranmış — yeşil ✓
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = '#22c55e';
      ctx.fillText('✓', x + 14, y - 6);
    }
  }

  // Progress bar
  if (input && !isChopped(input)) {
    const barW = 56;
    const barH = 6;
    const barX = x - barW / 2;
    const barY = y + 36;
    const pct = Math.min(1, progress / CHOP_TICKS);

    // Arka plan
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    roundRect(ctx, barX - 1, barY - 1, barW + 2, barH + 2, 3);
    ctx.fill();

    // Dolgu rengi
    const barColor = pct < 0.5 ? '#22c55e' : pct < 0.85 ? '#eab308' : '#f97316';
    ctx.fillStyle = barColor;
    if (pct > 0) {
      roundRect(ctx, barX, barY, barW * pct, barH, 3);
      ctx.fill();
    }

    // Parlama
    if (isChopping && pct > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      roundRect(ctx, barX, barY, barW * pct, barH / 2, 3);
      ctx.fill();
    }
  }

  // Bıçak animasyonu
  if (isChopping && input && !isChopped(input)) {
    const chopAnim = Math.sin(time * 0.02) * 0.5 + 0.5;
    const knifeY = y - 30 - chopAnim * 10;

    ctx.save();
    ctx.translate(x - 4, knifeY);
    ctx.rotate(-0.2 + chopAnim * 0.25);
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔪', 0, 0);
    ctx.restore();
  }
}
