import { WaitingGuest, ENTRANCE, OUTSIDE_QUEUE_Y } from '../types/game';

export function drawWaitList(ctx: CanvasRenderingContext2D, list: WaitingGuest[]) {
  if (list.length === 0) return;
  const cx = ENTRANCE.x;
  const y = OUTSIDE_QUEUE_Y;

  ctx.fillStyle = 'rgba(120, 53, 15, 0.85)';
  ctx.beginPath(); ctx.roundRect(cx - 100, y - 18, 200, 20, 6); ctx.fill();
  ctx.fillStyle = '#fde68a'; ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`👥 Kapıda Bekleyen: ${list.length}`, cx, y - 8);

  list.forEach((g, i) => {
    const gx = cx - (list.length - 1) * 16 + i * 32;
    const gy = y + 8;
    ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(gx, gy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(gx, gy - 2, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(gx + 10, gy - 14, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.font = '9px Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(g.wants || '?', gx + 10, gy - 14);
  });
}
