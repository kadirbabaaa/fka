/** Ortak renderer yardımcıları — drawPlayer ve drawCustomer tarafından kullanılır */

export function stk(ctx: CanvasRenderingContext2D, color = '#1a0a0a', w = 3) {
    ctx.strokeStyle = color; ctx.lineWidth = w;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
}

export function adjustColor(hex: string, amt: number): string {
    try {
        const c = hex.replace('#', '');
        const full = c.length === 3 ? c.split('').map(x => x + x).join('') : c;
        const n = parseInt(full, 16);
        const r = Math.min(255, Math.max(0, (n >> 16) + amt));
        const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
        const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
        return `rgb(${r},${g},${b})`;
    } catch { return hex; }
}

export const lighten = (h: string, a: number) => adjustColor(h, a);
export const darken  = (h: string, a: number) => adjustColor(h, -a);

export function drawShadowEllipse(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    rx: number, ry: number,
    alpha = 0.22,
) {
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
}
