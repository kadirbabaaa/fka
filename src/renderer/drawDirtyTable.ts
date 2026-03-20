export function drawDirtyTable(ctx: CanvasRenderingContext2D, seatX: number, seatY: number) {
  // seatY, masanın y'sinden ±47 uzakta (getSeatSlots'tan geliyor)
  // Üst koltuk: seatY = tableY - 47 → tabak masanın üstünde (seatY + 27)
  // Alt koltuk: seatY = tableY + 47 → tabak masanın altında (seatY - 27)
  const tableY = seatY < 500 ? seatY + 47 : seatY - 47; // yaklaşık masa merkezi
  const isTopSeat = seatY < tableY;
  const plateY = isTopSeat ? seatY + 27 : seatY - 27;

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
