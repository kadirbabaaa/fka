import { Player, CHARACTER_TYPES, CLEAN_PLATE, DIRTY_PLATE } from '../types/game';
import { hexToRgb } from '../utils/color';

/**
 * Oyuncu çizer — karakter tipine göre farklı görünüm
 */
// ─── LOCAL STATE FOR ANIMATION ───────────────────────────────────────────────
// Karakterlerin yürüdüğünü anlamak ve sağa/sola döndüklerini bilmek için
// geçici (sadece görsel) bir state tutuyoruz.
const playerRenderState = new Map<string, { lastX: number; lastY: number; faceRight: boolean; walkTimer: number; isMoving: boolean }>();

export function drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    p: Player,
    isMe: boolean,
) {
    const heldItem = p.holding === CLEAN_PLATE ? '🍽️' : p.holding === DIRTY_PLATE ? '🧽' : p.holding;
    const typeId = Math.min(p.charType ?? 0, CHARACTER_TYPES.length - 1);
    const charDef = CHARACTER_TYPES[typeId];
    const bodyColor = p.color || charDef.bodyColor;
    const accentColor = charDef.accent;

    // ── Animasyon State Yönetimi ──────────────────────────────────────────────
    if (!playerRenderState.has(p.id)) {
        playerRenderState.set(p.id, { lastX: x, lastY: y, faceRight: true, walkTimer: 0, isMoving: false });
    }
    const state = playerRenderState.get(p.id)!;

    // Hareket ediyor mu? (Son frame'e göre konumu değişti mi?)
    const dx = x - state.lastX;
    const dy = y - state.lastY;
    const distSq = dx * dx + dy * dy;

    state.isMoving = distSq > 0.5; // Çok ufak titremeleri yoksay

    // Yön belirleme (Sadece belirgin bir yatay hareket varsa yön değişir)
    if (Math.abs(dx) > 0.5) {
        state.faceRight = dx > 0;
    }

    // Yürüme Sayacı (Zıp zıp efekti için zamanlayıcı artar)
    if (state.isMoving) {
        state.walkTimer += 0.3; // Hız faktörü
    } else {
        // Durduğunda yavaşça merkeze dön (hemen 0'lanmasın küt diye durmasın)
        state.walkTimer = state.walkTimer % (Math.PI * 2);
        if (state.walkTimer > 0) {
            state.walkTimer += 0.3;
            if (state.walkTimer >= Math.PI * 2) state.walkTimer = 0;
        }
    }

    // Son konumu kaydet (bir sonraki frame için)
    state.lastX = x;
    state.lastY = y;

    // ── Matematiksel Zıplama (Bobbing Y calculation) ───────────────────────────
    // Sadece yürüyorlarsa aşağı yukarı zıplasınlar
    const bobbingY = state.isMoving || state.walkTimer > 0 ? Math.abs(Math.sin(state.walkTimer)) * 6 : 0;

    // Sadece yürüyorlarsa sağa sola sallansınlar (penguen yürüyüşü açısı)
    const tiltAngle = state.isMoving ? Math.sin(state.walkTimer) * 0.15 : 0;

    // Yön katsayısı (1 = Sağa, -1 = Sola)
    const directionMul = state.faceRight ? 1 : -1;

    // ─────────────────────────────────────────────────────────────────────────

    ctx.save();
    ctx.translate(x, y);

    // ── 0. Zemin Gölgesi (Aura ve gölge) ──────────────────────────────────────────────────
    // Aura ve Zemin Gölgesi zıplamaz, yerde kalır!
    if (isMe) {
        ctx.fillStyle = 'rgba(99,179,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 18, 28, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Gölge karakter zıpladıkça küçülüp büyür
    const shadowScale = 1 - (bobbingY / 30);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 20 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── AŞAĞIDAKİ HER ŞEY (Karakterin kendisi) Zıplama (bobbingY) ve Eğilmeden (tilt) etkilenir ──
    ctx.translate(0, -bobbingY); // Zıplama
    ctx.rotate(tiltAngle);       // Yalpalamak

    // Dönme Efekti (Sağa/Sola aynalama)
    // Sadece Yüzü ve Gövdeyi döndürüyoruz ki gözler ve eller yön değiştirsin
    ctx.scale(directionMul, 1);

    // ── 1. Kapsül Gövde (Vücut) ────────────────────────────────────────────────────────
    const bodyWidth = 32;
    const bodyHeight = 28;
    const bodyRadius = 16;

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(-bodyWidth / 2, -bodyHeight / 2 + 8, bodyWidth, bodyHeight - 8, [0, 0, bodyRadius, bodyRadius]);
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(-bodyWidth / 2, -bodyHeight / 2 - 12, bodyWidth, 20, [bodyRadius, bodyRadius, 0, 0]);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(-bodyWidth / 2 + 4, -bodyHeight / 2 - 8, 6, bodyHeight - 4, 10);
    ctx.fill();

    // ── 2. Eller / Kollar ────────────────────────────────────────────────
    ctx.fillStyle = '#fce7c3';

    // Elde tabak varsa kollar zıplamayla ileri geri hareket edebilir
    const handSwing = state.isMoving && !heldItem ? Math.sin(state.walkTimer) * 5 : 0;

    if (heldItem) {
        ctx.beginPath(); ctx.arc(-10, -5, 6, 0, Math.PI * 2); ctx.fill(); // Arka El
        ctx.beginPath(); ctx.arc(10, -5, 6, 0, Math.PI * 2); ctx.fill();  // Ön El
    } else {
        // Yürürken zıt kollar sallanır
        ctx.beginPath(); ctx.arc(-18 + handSwing, 5, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(18 - handSwing, 5, 6, 0, Math.PI * 2); ctx.fill();
    }

    // ── 3. Elde tutulan obje (ellerin hemen üstünde/önünde) ──────────────────────────
    // Yüzümüzü directionMul ile çevirmiştik ama yazının ters dönmemesi lazım!!
    if (heldItem) {
        ctx.save();
        ctx.scale(directionMul, 1); // Yazı düz okunsun diye ters yönde bir daha çeviriyoruz

        // objenin duracağı yer X olarak karakterin yüzüne göre önde (sağında)
        const holdX = directionMul > 0 ? 12 : -12;

        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath(); ctx.ellipse(holdX, -6, 18, 5, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.ellipse(holdX, -8, 18, 8, 0, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(heldItem, holdX, -12);

        ctx.restore();
    }

    // ── 4. Ayrı Duran Kafa ──────────────────────────────────────────────────
    // Kafa yürürken biraz daha dalgalanır
    const headBobY = state.isMoving ? Math.cos(state.walkTimer) * 2 : 0;
    const headY = -30 + headBobY;

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath(); ctx.ellipse(0, -22, 12, 4, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#fce7c3';
    ctx.beginPath(); ctx.arc(0, headY, 15, 0, Math.PI * 2); ctx.fill();

    // ── 5. Yüz İfadeleri ────────────────────────────────────────────────────────────────
    // Yüze de hafif bakış yönü veriyoruz (Tam ortada değil, baktığı yöne doğru kayık)
    const faceOffsetX = 4; // Yüz biraz baktığı yöne kaysın (Çünkü zaten scale(directionMul,1) ile çevirdik, hep pozitif vereceğiz)

    const eyeY = headY - 2;
    [-4, 6].forEach(ox => {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.ellipse(ox + faceOffsetX, eyeY, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath(); ctx.arc(ox + faceOffsetX + 1, eyeY - 1.5, 1.2, 0, Math.PI * 2); ctx.fill();
    });

    ctx.strokeStyle = '#7c3f00';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(faceOffsetX, headY + 5, 4, 0.2, Math.PI - 0.2); ctx.stroke();

    // ── 6. Şapka (Emoji) ────────────────────────────────────────────────────────────────
    ctx.save();
    ctx.scale(directionMul, 1); // Emojiler aynalanmasın (Pizza falan ters durmasın)
    const hat = p.hat ?? '';
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hat, directionMul * faceOffsetX, headY - 15);
    ctx.restore();

    ctx.restore(); // Tüm transformasyonları sıfırla (İsim etiketi düz kalsın diye)

    // ── 7. İsim Etiketi (Zıplamaz, Adamın altında sabit durur) ──────────────────────
    const rgb = hexToRgb(bodyColor);
    const nameW = ctx.measureText(p.name).width + 16;

    ctx.fillStyle = isMe ? `rgba(${rgb},0.9)` : 'rgba(15,23,42,0.85)';
    ctx.beginPath();
    ctx.roundRect(x - nameW / 2, y + 26, nameW, 18, 6);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.name, x, y + 36);
}

