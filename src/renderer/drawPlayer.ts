import { Player } from '../types/game';
import { hexToRgb } from '../utils/color';

/**
 * Oyuncu çizer.
 * isMe = true ise beyaz kenar + kendi rengiyle isim etiketi
 */
export function drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    p: Player,
    isMe: boolean,
) {
    // Zemin gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vücut
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Parlama efekti
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(x - 7, y - 7, 10, 0, Math.PI * 2);
    ctx.fill();

    // Kenar halkası
    ctx.lineWidth = isMe ? 3 : 2;
    ctx.strokeStyle = isMe ? '#ffffff' : 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.stroke();

    // Şapka
    if (p.hat) {
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.hat, x, y - 26);
    }

    // Elde tuttuğu ürün (küçük balon)
    if (p.holding) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + 18, y - 18, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.holding, x + 18, y - 18);
    }

    // İsim etiketi
    const rgb = hexToRgb(p.color);
    const nameW = ctx.measureText(p.name).width + 12;

    ctx.fillStyle = isMe ? `rgba(${rgb},0.9)` : 'rgba(30,41,59,0.85)';
    ctx.beginPath();
    ctx.roundRect(x - nameW / 2, y + 28, nameW, 18, 4);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.name, x, y + 37);
}
