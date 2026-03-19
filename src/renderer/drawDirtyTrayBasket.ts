import { DIRTY_TRAY_POS } from '../types/game';
import { StationPosition } from '../../shared/types';

export function drawDirtyTrayBasket(
  ctx: CanvasRenderingContext2D,
  dirtyTrayCount: number,
  pos?: StationPosition,
) {
  const tcx = pos?.x ?? DIRTY_TRAY_POS.x;
  const tcy = pos?.y ?? DIRTY_TRAY_POS.y;

  ctx.fillStyle = '#475569';
  ctx.beginPath(); ctx.roundRect(tcx - 22, tcy - 16, 44, 32, 4); ctx.fill();
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 2; ctx.stroke();

  const displayCount = Math.min(6, dirtyTrayCount);
  for (let i = 0; i < displayCount; i++) {
    const py = tcy + 4 - i * 4;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(tcx + 1, py + 3, 18, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.ellipse(tcx, py, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(tcx, py, 18, 8, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(tcx - 4, py - 1, 2.5, 0, Math.PI * 2);
    ctx.arc(tcx + 3, py + 1, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = dirtyTrayCount > 0 ? 'bold 14px Arial' : '10px Arial';
  ctx.fillStyle = dirtyTrayCount > 0 ? 'white' : '#94a3b8';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(dirtyTrayCount > 0 ? String(dirtyTrayCount) : 'SEPET', tcx, tcy + 22);
}
