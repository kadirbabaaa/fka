import { TABLE_Y } from '../types/game';

export function drawDirtyTable(ctx: CanvasRenderingContext2D, seatX: number, seatY: number) {
  const isTopSeat = seatY < TABLE_Y;
  const plateY = isTopSeat ? TABLE_Y - 20 : TABLE_Y + 20;

  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath(); ctx.ellipse(seatX + 1, plateY + 3, 18, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath(); ctx.ellipse(seatX, plateY, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(seatX, plateY, 18, 8, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.arc(seatX - 4, plateY - 1, 2.5, 0, Math.PI * 2);
  ctx.arc(seatX + 3, plateY + 1, 2, 0, Math.PI * 2);
  ctx.arc(seatX + 8, plateY - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
