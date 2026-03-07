import { Player, CHARACTER_TYPES } from '../types/game';
import { hexToRgb } from '../utils/color';

/**
 * Oyuncu çizer — karakter tipine göre farklı görünüm
 */
export function drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    p: Player,
    isMe: boolean,
) {
    const typeId = Math.min(p.charType ?? 0, CHARACTER_TYPES.length - 1);
    const charDef = CHARACTER_TYPES[typeId];
    const bodyColor = p.color || charDef.bodyColor;
    const accentColor = charDef.accent;

    // ── Zemin gölgesi ────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 22, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Gövde (daire) ────────────────────────────────────────────────────────
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // ── Kıyafet şeridi (farklı her char) ─────────────────────────────────────
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(x, y, 22, Math.PI * 0.2, Math.PI * 0.8); // Alt yarısı
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();

    // ── Yüz: Ten rengi kafa ─────────────────────────────────────────────────
    ctx.fillStyle = '#fce7c3';
    ctx.beginPath();
    ctx.arc(x, y - 4, 13, 0, Math.PI * 2);
    ctx.fill();

    // ── Gözler ──────────────────────────────────────────────────────────────
    const eyeY = y - 6;
    [-5, 5].forEach(ox => {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(x + ox, eyeY, 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // Göz parlaması
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(x + ox + 1, eyeY - 1, 1, 0, Math.PI * 2);
        ctx.fill();
    });

    // ── Tatlı ağız (küçük gülümseme) ─────────────────────────────────────────
    ctx.strokeStyle = '#7c3f00';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y - 1, 4, 0.3, Math.PI - 0.3);
    ctx.stroke();

    // ── "Benim" kenar halkası ──────────────────────────────────────────────
    if (isMe) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.stroke();

        // Mavi aura
        ctx.strokeStyle = 'rgba(99,179,255,0.5)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x, y, 27, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.stroke();
    }

    // ── Şapka (büyük emoji) ───────────────────────────────────────────────────
    const hat = p.hat || charDef.hat;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hat, x, y - 29);

    // ── Elde tuttuğu ürün (balon) ─────────────────────────────────────────
    if (p.holding) {
        // Balon gölgesi
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.arc(x + 20, y - 18, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + 19, y - 19, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.holding, x + 19, y - 19);
    }

    // ── İsim etiketi ────────────────────────────────────────────────────────
    const rgb = hexToRgb(bodyColor);
    const nameW = ctx.measureText(p.name).width + 14;

    ctx.fillStyle = isMe ? `rgba(${rgb},0.9)` : 'rgba(15,23,42,0.85)';
    ctx.beginPath();
    ctx.roundRect(x - nameW / 2, y + 28, nameW, 18, 4);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.name, x, y + 37);
}
