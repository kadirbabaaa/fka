import { Customer, TABLE_Y, EAT_TICKS } from '../types/game';

type CustomerRenderState = {
    lastX: number;
    lastY: number;
    faceRight: boolean;
    bobPhase: number;
    bobAmount: number;
    beatUpShake: number; // Beat-up efekti için sarsıntı frame sayacı
};

const customerRenderState = new Map<string, CustomerRenderState>();

function getRenderState(id: string, x: number, y: number) {
    if (!customerRenderState.has(id)) {
        customerRenderState.set(id, {
            lastX: x,
            lastY: y,
            faceRight: true,
            bobPhase: 0,
            bobAmount: 0,
            beatUpShake: 0,
        });
    }

    return customerRenderState.get(id)!;
}

/**
 * Müşteri vücudunu bodyShape'e göre çizer.
 * 1=Normal, 2=Tombul, 3=Uzun ince, 4=Kısa tıknaz
 */
function getBodyProps(bodyShape: 1 | 2 | 3 | 4) {
    switch (bodyShape) {
        case 2: // Tombul
            return { bodyW: 30, bodyH: 18, headR: 14, neckH: 2, legLen: 10 };
        case 3: // Uzun ince
            return { bodyW: 18, bodyH: 12, headR: 10, neckH: 5, legLen: 18 };
        case 4: // Kısa tıknaz
            return { bodyW: 26, bodyH: 16, headR: 11, neckH: 1, legLen: 8 };
        case 1:
        default: // Normal
            return { bodyW: 24, bodyH: 14, headR: 12, neckH: 3, legLen: 14 };
    }
}

export function drawCustomer(ctx: CanvasRenderingContext2D, customer: Customer) {
    const { id, x, y, seatY, wants, patience, maxPatience, isSeated, isEating, eatTimer, beatUpTimer } = customer;
    const bodyShape = customer.bodyShape ?? 1;
    const bodyColor = customer.bodyColor ?? '#475569';
    const facingUp = seatY > TABLE_Y;
    const state = getRenderState(id, x, y);

    const dx = x - state.lastX;
    const dy = y - state.lastY;
    const distance = Math.hypot(dx, dy);
    const isMoving = !isSeated && distance > 0.9;

    if (isMoving) {
        state.bobPhase += 0.28;
        state.bobAmount = Math.min(1, state.bobAmount + 0.18);
        if (Math.abs(dx) > 0.25) state.faceRight = dx > 0;
    } else {
        state.bobAmount = Math.max(0, state.bobAmount - 0.22);
        if (state.bobAmount > 0) state.bobPhase += 0.18;
        else state.bobPhase = 0;
    }

    // Beat-up shake efekti — eğer beatUpTimer varsa sarsıntı sayacını güncelle
    if (beatUpTimer && beatUpTimer > 0 && state.beatUpShake <= 0) {
        state.beatUpShake = 30; // 30 frame (1 saniye) sarsıntı
    }
    if (state.beatUpShake > 0) state.beatUpShake--;

    state.lastX = x;
    state.lastY = y;

    // Sarsıntı offset (beat-up ani sarsıntı)
    const shakeX = state.beatUpShake > 0 ? Math.sin(state.beatUpShake * 1.8) * 4 : 0;
    const bobbingY = Math.abs(Math.sin(state.bobPhase)) * 3.5 * state.bobAmount;
    const tilt = Math.sin(state.bobPhase) * 0.05 * state.bobAmount;
    const eatProgress = isEating ? eatTimer / EAT_TICKS : 0;

    const { bodyW, bodyH, headR, neckH, legLen } = getBodyProps(bodyShape);

    ctx.save();
    ctx.translate(x + shakeX, y);

    // Kırmızı tint efekti (beat-up aktifken)
    const isBeatUpActive = state.beatUpShake > 0;
    if (isBeatUpActive) {
        ctx.globalAlpha = 0.85;
    }

    if (!isSeated) {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 16, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    if (isSeated) {
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.roundRect(-14, facingUp ? 8 : -14, 28, 6, 3);
        ctx.fill();
    }

    ctx.translate(0, -bobbingY);
    ctx.rotate(tilt);
    if (!isSeated) ctx.scale(state.faceRight ? 1 : -1, 1);

    const bodyY = isSeated ? 2 : 0;

    // Alt gövde (pantolon/etek benzeri) — daha koyu renk
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-bodyW / 2, bodyY + 2, bodyW, bodyH / 2 + 4, [0, 0, 8, 8]);
    ctx.fill();

    // Üst gövde (kıyafet rengi kişiliğe göre)
    ctx.fillStyle = isBeatUpActive ? '#ef4444' : bodyColor;
    ctx.beginPath();
    ctx.roundRect(-bodyW / 2, bodyY - bodyH, bodyW, bodyH + 4, [8, 8, 0, 0]);
    ctx.fill();

    // Bacaklar (sadece yürürken görünür — seating durumunda gizli)
    if (!isSeated) {
        const swing = Math.sin(state.bobPhase) * 4 * state.bobAmount;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(-8 + swing, bodyY + 4, 7, legLen, 3);
        ctx.roundRect(1 - swing, bodyY + 4, 7, legLen, 3);
        ctx.fill();

        // Ayaklar
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.roundRect(-10 + swing, bodyY + 4 + legLen, 10, 5, 2);
        ctx.roundRect(-1 - swing, bodyY + 4 + legLen, 10, 5, 2);
        ctx.fill();
    }

    // Eller
    ctx.fillStyle = '#f5d0a9';
    if (isSeated) {
        const handY = facingUp ? bodyY - bodyH + 6 : bodyY + 4;
        ctx.beginPath();
        ctx.arc(-bodyW / 2 + 4, handY, 4, 0, Math.PI * 2);
        ctx.arc(bodyW / 2 - 4, handY, 4, 0, Math.PI * 2);
        ctx.fill();
    } else {
        const swing = Math.sin(state.bobPhase) * 3.5 * state.bobAmount;
        ctx.beginPath();
        ctx.arc(-bodyW / 2 - 2 + swing, 5, 4.5, 0, Math.PI * 2);
        ctx.arc(bodyW / 2 + 2 - swing, 5, 4.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Baş
    const headY = isSeated ? (facingUp ? -bodyH - neckH : 2) : -bodyH - neckH - headR;
    const eatingHeadOffset = isEating ? Math.sin((1 - eatProgress) * Math.PI * 8) * 1.8 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath();
    ctx.ellipse(0, headY + headR + 4, headR - 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isBeatUpActive ? '#fca5a5' : '#f5d0a9';
    ctx.beginPath();
    ctx.arc(0, headY + eatingHeadOffset, headR, 0, Math.PI * 2);
    ctx.fill();

    // Yüz ifadesi
    const showFace = !isSeated || !facingUp;
    if (showFace) {
        const eyeY = headY - 2 + eatingHeadOffset;
        ctx.fillStyle = isBeatUpActive ? '#ffffff' : '#111827';
        ctx.beginPath();

        if (isBeatUpActive) {
            // Korkmuş gözler (daha büyük) — beat-up aktif
            ctx.ellipse(-headR * 0.35, eyeY, 3, 4, 0, 0, Math.PI * 2);
            ctx.ellipse(headR * 0.35, eyeY, 3, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // Göz akı
            ctx.fillStyle = '#111827';
            ctx.beginPath();
            ctx.arc(-headR * 0.35, eyeY + 1, 1.5, 0, Math.PI * 2);
            ctx.arc(headR * 0.35, eyeY + 1, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.ellipse(-headR * 0.3, eyeY, 2.2, 3, 0, 0, Math.PI * 2);
            ctx.ellipse(headR * 0.3, eyeY, 2.2, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Ağız ifadesi
        if (isEating) {
            ctx.fillStyle = '#7c2d12';
            ctx.beginPath();
            ctx.arc(0, headY + 4 + eatingHeadOffset, 2.4, 0, Math.PI * 2);
            ctx.fill();
        } else if (isBeatUpActive) {
            // Korkmuş ağız — O şekli
            ctx.strokeStyle = '#7c2d12';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, headY + 5, 3, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.strokeStyle = '#7c2d12';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(0, headY + 4, 3, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }
    } else {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.arc(0, headY - 3, headR, Math.PI, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

    // Beat-up overlay: 😱 emoji kafanın üstünde (efekt aktifken)
    if (isBeatUpActive) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, state.beatUpShake / 15);
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('😱', x + shakeX, y - 65);
        ctx.restore();
    }

    // ─── DİYALOG BALONU (Speech Bubble) ──────────────────────────────────────────
    if (customer.currentDialog) {
        ctx.save();
        ctx.translate(customer.x, customer.y - 50); // İstek balonunun üstünde

        ctx.font = 'bold 11px Arial';
        const textWidth = ctx.measureText(customer.currentDialog).width;
        const bubbleW = Math.min(textWidth + 16, 260); // max genişlik
        const bubbleH = 24;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.roundRect(-bubbleW / 2, -bubbleH, bubbleW, bubbleH, 8);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.lineTo(0, 6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = customer.personality === 'recep' ? '#ef4444' : customer.personality === 'rude' ? '#f59e0b' : '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-bubbleW / 2, -bubbleH, bubbleW, bubbleH, 8);
        ctx.stroke();

        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.lineTo(0, 6);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Uzun metinleri kırp
        let displayText = customer.currentDialog;
        if (textWidth > 244) {
            displayText = customer.currentDialog.slice(0, 28) + '…';
        }
        ctx.fillText(displayText, 0, -bubbleH / 2);

        ctx.restore();
    }

    if (isEating) {
        const iconY = facingUp ? y + 30 + (1 - eatProgress) * 10 : y - 30 - (1 - eatProgress) * 10;
        ctx.globalAlpha = eatProgress;
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍽️', x, iconY);
        ctx.globalAlpha = 1;
    }

    if (!isSeated) return;

    if (isEating) {
        const barY = facingUp ? y - 24 : y + 22;
        ctx.fillStyle = 'rgba(226,232,240,0.72)';
        ctx.beginPath();
        ctx.roundRect(x - 20, barY, 40, 5, 3);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(x - 20, barY, 40 * eatProgress, 5, 3);
        ctx.fill();
        return;
    }

    const patiencePct = Math.max(0, patience / maxPatience);
    const barColor = patiencePct > 0.5 ? '#22c55e' : patiencePct > 0.25 ? '#f59e0b' : '#ef4444';
    const bubbleX = x + 30;
    const bubbleY = facingUp ? y + 40 : y - 40;
    const patienceY = facingUp ? y - 28 : y + 24;

    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath();
    ctx.roundRect(bubbleX - 16, bubbleY - 14, 38, 28, 7);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(bubbleX - 18, bubbleY - 16, 38, 28, 7);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    if (facingUp) {
        ctx.moveTo(bubbleX - 8, bubbleY - 16);
        ctx.lineTo(x + 14, y + 6);
        ctx.lineTo(bubbleX + 4, bubbleY - 16);
    } else {
        ctx.moveTo(bubbleX - 8, bubbleY + 12);
        ctx.lineTo(x + 14, y - 6);
        ctx.lineTo(bubbleX + 4, bubbleY + 12);
    }
    ctx.fill();

    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(wants || '?', bubbleX + 1, bubbleY - 2);

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(x - 20, patienceY, 40, 5, 3);
    ctx.fill();
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(x - 20, patienceY, 40 * patiencePct, 5, 3);
    ctx.fill();
}
