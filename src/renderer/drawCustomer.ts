import { Customer, TABLE_Y, EAT_TICKS } from '../types/game';

type CRS = {
    lastX: number; lastY: number;
    faceRight: boolean;
    bobPhase: number; bobAmount: number;
    beatUpShake: number;
};

const crs = new Map<string, CRS>();

function getCRS(id: string, x: number, y: number): CRS {
    if (!crs.has(id)) crs.set(id, { lastX: x, lastY: y, faceRight: true, bobPhase: 0, bobAmount: 0, beatUpShake: 0 });
    return crs.get(id)!;
}

// Vücut şekli parametreleri — PlateUp tarzı şişman/ince/normal/tıknaz
function bodyProps(shape: 1 | 2 | 3 | 4) {
    switch (shape) {
        case 2: return { bw: 28, bh: 20, hr: 16, neck: 2, leg: 11, feet: 9 }; // tombul
        case 3: return { bw: 16, bh: 12, hr: 11, neck: 5, leg: 20, feet: 6 }; // uzun ince
        case 4: return { bw: 25, bh: 17, hr: 13, neck: 1, leg: 9,  feet: 8 }; // kısa tıknaz
        default:return { bw: 21, bh: 15, hr: 13, neck: 3, leg: 15, feet: 7 }; // normal
    }
}

function stk(ctx: CanvasRenderingContext2D, color = '#1a0a0a', w = 3) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
}

// Saç rengi — vücut rengine göre uyumlu koyu ton
const HAIR_COLORS = ['#2d1b0e','#1a1a1a','#5c3317','#8b4513','#2c2c54','#1a3a1a'];
function hairColor(bodyColor: string, id: string): string {
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return HAIR_COLORS[hash % HAIR_COLORS.length];
}

export function drawCustomer(ctx: CanvasRenderingContext2D, customer: Customer) {
    const { id, x, y, seatY, wants, patience, maxPatience, isSeated, isEating, eatTimer, beatUpTimer } = customer;
    const shape = customer.bodyShape ?? 1;
    const bodyColor = customer.bodyColor ?? '#475569';
    const facingUp = seatY > TABLE_Y;
    const st = getCRS(id, x, y);

    const dx = x - st.lastX, dy = y - st.lastY;
    const moving = !isSeated && (dx * dx + dy * dy > 0.8);

    if (moving) {
        st.bobPhase  += 0.26;
        st.bobAmount  = Math.min(1, st.bobAmount + 0.16);
        if (Math.abs(dx) > 0.2) st.faceRight = dx > 0;
    } else {
        st.bobAmount = Math.max(0, st.bobAmount - 0.20);
        if (st.bobAmount > 0) st.bobPhase += 0.16;
        else st.bobPhase = 0;
    }

    if (beatUpTimer && beatUpTimer > 0 && st.beatUpShake <= 0) st.beatUpShake = 28;
    if (st.beatUpShake > 0) st.beatUpShake--;

    st.lastX = x; st.lastY = y;

    const shakeX  = st.beatUpShake > 0 ? Math.sin(st.beatUpShake * 2) * 2 : 0;
    const bobY    = Math.abs(Math.sin(st.bobPhase)) * 4 * st.bobAmount;
    const tilt    = Math.sin(st.bobPhase) * 0.06 * st.bobAmount;
    const legSwing = moving ? Math.sin(st.bobPhase) * 6 : 0;
    const beatUp  = st.beatUpShake > 0;
    const eatPct  = isEating ? eatTimer / EAT_TICKS : 0;

    const { bw, bh, hr, neck, leg, feet } = bodyProps(shape);
    const hair = hairColor(bodyColor, id);

    ctx.save();
    ctx.translate(x + shakeX, y);
    if (beatUp) ctx.globalAlpha = 0.88;

    // ── Zemin gölgesi ────────────────────────────────────────────────────────
    if (!isSeated) {
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.beginPath(); ctx.ellipse(0, 18, 17, 7, 0, 0, Math.PI * 2); ctx.fill();
    }

    // ── Sandalye (oturuyorsa) ─────────────────────────────────────────────────
    if (isSeated) {
        ctx.fillStyle = '#9b6d3a';
        ctx.beginPath();
        ctx.roundRect(-16, facingUp ? 10 : -16, 32, 7, 4);
        ctx.fill();
        ctx.strokeStyle = '#7a5428'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    ctx.translate(0, -bobY);
    ctx.rotate(tilt);
    if (!isSeated) ctx.scale(st.faceRight ? 1 : -1, 1);

    // ── BACAKLAR ─────────────────────────────────────────────────────────────
    if (!isSeated) {
        // Sol bacak
        ctx.beginPath(); ctx.roundRect(-bw / 2 - 2 + legSwing, bh / 2 + neck + 2, bw / 2 + 1, leg, [0, 0, 4, 4]);
        ctx.fillStyle = '#1a1a2e'; ctx.fill(); stk(ctx);
        // Sol ayak
        ctx.beginPath(); ctx.ellipse(-bw / 4 + legSwing, bh / 2 + neck + leg + 5, feet + 2, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#111'; ctx.fill(); stk(ctx, '#000', 2);

        // Sağ bacak
        ctx.beginPath(); ctx.roundRect(1 - legSwing, bh / 2 + neck + 2, bw / 2 + 1, leg, [0, 0, 4, 4]);
        ctx.fillStyle = '#252540'; ctx.fill(); stk(ctx);
        // Sağ ayak
        ctx.beginPath(); ctx.ellipse(bw / 4 - legSwing, bh / 2 + neck + leg + 5, feet + 2, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#111'; ctx.fill(); stk(ctx, '#000', 2);
    }

    // ── GÖVDE ────────────────────────────────────────────────────────────────
    const bodyY = isSeated ? (facingUp ? -bh / 2 - 4 : -bh / 2 - 10) : -bh / 2;

    // Kıyafet gövdesi (konturlu)
    ctx.beginPath(); ctx.roundRect(-bw / 2 - 2, bodyY, bw + 4, bh + 4, 9);
    const bg = ctx.createLinearGradient(-bw / 2, bodyY, bw / 2, bodyY + bh);
    bg.addColorStop(0, beatUp ? '#ef4444' : lighten(bodyColor, 28));
    bg.addColorStop(1, beatUp ? '#dc2626' : bodyColor);
    ctx.fillStyle = bg; ctx.fill(); stk(ctx);

    // Kıyafet detay (düğme çizgisi)
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bodyY + 3); ctx.lineTo(0, bodyY + bh - 2);
    ctx.stroke();

    // Parlaklık
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.roundRect(-bw / 2, bodyY, bw, 6, [9, 9, 0, 0]); ctx.fill();

    // ── KOLLAR ───────────────────────────────────────────────────────────────
    const armSwing = moving ? Math.sin(st.bobPhase + Math.PI) * 5 : 0;
    // Arka kol
    ctx.beginPath(); ctx.roundRect(-bw / 2 - 10, bodyY - 1 - armSwing, 9, bh - 2, 5);
    ctx.fillStyle = darken(bodyColor, 18); ctx.fill(); stk(ctx);
    // Ön kol
    ctx.beginPath(); ctx.roundRect(bw / 2 + 1, bodyY - 1 + armSwing, 9, bh - 2, 5);
    ctx.fillStyle = bodyColor; ctx.fill(); stk(ctx);

    // ── BAŞ ──────────────────────────────────────────────────────────────────
    const headY = bodyY - neck - hr - 2;

    // Boyun
    ctx.beginPath(); ctx.roundRect(-5, bodyY - neck, 10, neck + 4, 3);
    ctx.fillStyle = '#f5c090'; ctx.fill();

    // Kafa (yuvarlak, büyük)
    ctx.beginPath(); ctx.arc(0, headY, hr, 0, Math.PI * 2);
    const hg = ctx.createRadialGradient(-4, headY - 4, 2, 0, headY, hr);
    hg.addColorStop(0, '#fde8cc'); hg.addColorStop(1, '#f0b882');
    ctx.fillStyle = hg; ctx.fill(); stk(ctx);

    // Saç
    ctx.beginPath();
    ctx.arc(0, headY, hr, Math.PI, 0);
    ctx.fillStyle = hair; ctx.fill();
    ctx.beginPath();
    ctx.arc(0, headY - hr + 4, hr * 0.7, Math.PI, 0);
    ctx.fillStyle = hair; ctx.fill();

    // Yanaklar
    ctx.fillStyle = 'rgba(255,130,100,0.25)';
    ctx.beginPath(); ctx.ellipse(-hr * 0.55, headY + 2, hr * 0.38, hr * 0.28, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hr * 0.55, headY + 2, hr * 0.38, hr * 0.28, 0.2, 0, Math.PI * 2); ctx.fill();

    // Gözler (sabırsız = şaşkın, yiyor = mutlu, normal = nötr)
    const patiencePct = Math.max(0, patience / maxPatience);
    ctx.fillStyle = '#1a0a0a';

    if (patiencePct < 0.25 && !isEating) {
        // Kızgın gözler (çatık kaş)
        ctx.beginPath(); ctx.ellipse(-hr * 0.38, headY - 1, 4, 3.5, 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(hr * 0.38, headY - 1, 4, 3.5, -0.35, 0, Math.PI * 2); ctx.fill();
        // Kaşlar
        ctx.strokeStyle = '#1a0a0a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-hr * 0.55, headY - 6); ctx.lineTo(-hr * 0.18, headY - 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hr * 0.55, headY - 6); ctx.lineTo(hr * 0.18, headY - 3); ctx.stroke();
        // Kızgın ağız
        ctx.beginPath(); ctx.arc(0, headY + 6, 5, Math.PI, 0); ctx.stroke();
    } else if (isEating) {
        // Yeme animasyonu
        const blink = Math.sin(Date.now() / 200) > 0.5;
        if (blink) {
            ctx.beginPath(); ctx.moveTo(-hr * 0.42, headY); ctx.lineTo(-hr * 0.18, headY); ctx.lineWidth = 2.5; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(hr * 0.18, headY); ctx.lineTo(hr * 0.42, headY); ctx.lineWidth = 2.5; ctx.stroke();
        } else {
            ctx.beginPath(); ctx.ellipse(-hr * 0.30, headY, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(hr * 0.30, headY, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
        }
        // Mutlu ağız
        ctx.strokeStyle = '#7a3020'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, headY + 5, 6, 0.1, Math.PI - 0.1); ctx.stroke();
        // Yemek balonu (eatTimer)
        const eatAlpha = 1 - eatPct;
        ctx.globalAlpha = eatAlpha * 0.8;
        ctx.font = '14px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('😋', hr + 8, headY - hr);
        ctx.globalAlpha = beatUp ? 0.88 : 1;
    } else {
        // Normal gözler
        ctx.beginPath(); ctx.ellipse(-hr * 0.34, headY - 1, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(hr * 0.34, headY - 1, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        // Göz parıltısı
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath(); ctx.ellipse(-hr * 0.28, headY - 3, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(hr * 0.40, headY - 3, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill();
        // Nötr ağız
        ctx.strokeStyle = '#7a3020'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, headY + 5, 5, 0.2, Math.PI - 0.2); ctx.stroke();
    }

    // Beat-up efekti (yıldız)
    if (beatUp) {
        ctx.globalAlpha = Math.min(1, st.beatUpShake / 10);
        ctx.font = '16px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('💫', hr + 4, headY - hr - 4);
        ctx.globalAlpha = 1;
    }

    ctx.restore();

    // ── SİPARİŞ BALONU & SABIR ÇUBUĞU ──────────────────────────────────────
    if (customer.isBeatUp || customer.isLeaving || !wants) return;

    const bar    = Math.max(0, patience / maxPatience);
    const barClr = bar > 0.5 ? '#22c55e' : bar > 0.25 ? '#f59e0b' : '#ef4444';
    const bx     = x + (isSeated ? 32 : 30);
    const by     = facingUp ? y + 36 : y - 42;
    const barY   = facingUp ? y - 30 : y + 26;

    // Balon gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.roundRect(bx - 14, by - 13, 36, 28, 8); ctx.fill();

    // Balon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(bx - 16, by - 15, 36, 28, 8); ctx.fill();
    ctx.strokeStyle = barClr; ctx.lineWidth = 2; ctx.stroke();

    // Ok ucu
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (facingUp) {
        ctx.moveTo(bx - 6, by - 15); ctx.lineTo(x + 14, y + 4); ctx.lineTo(bx + 4, by - 15);
    } else {
        ctx.moveTo(bx - 6, by + 13); ctx.lineTo(x + 14, y - 4); ctx.lineTo(bx + 4, by + 13);
    }
    ctx.fill();

    // Sipariş emojisi
    ctx.font = '22px Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(wants ?? '?', bx + 2, by - 1);

    // Sabır çubuğu — arka plan
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.roundRect(x - 22, barY, 44, 6, 3); ctx.fill();
    // Sabır çubuğu — dolu
    ctx.fillStyle = barClr;
    ctx.beginPath(); ctx.roundRect(x - 22, barY, 44 * bar, 6, 3); ctx.fill();
}

function lighten(hex: string, amt: number) { return adj(hex, amt); }
function darken(hex: string, amt: number)  { return adj(hex, -amt); }
function adj(hex: string, amt: number): string {
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
