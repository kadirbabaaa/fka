import {
  GAME_WIDTH,
  GAME_HEIGHT,
  WALL_Y1,
  DOOR_RANGES,
  INGREDIENTS,
  TRASH_STATION,
  SINK_STATION,
  PLATE_STACK_POS,
  COUNTER_POSITIONS,
  RECIPE_DEFS,
} from "../types/game";

/** Metalik tezgah tabanı — gölge + gradient gövde + üst parlama */
function drawWorkstationBase(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  hw: number, hh: number,
  radius = 10,
  shadowAlpha = 0.30,
) {
  // Gölge
  ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
  ctx.beginPath(); ctx.roundRect(x - hw - 1, y - hh - 1, (hw + 1) * 2, (hh + 1) * 2, radius + 2); ctx.fill();

  // Metalik gövde
  const g = ctx.createLinearGradient(x - hw, y - hh, x + hw, y + hh);
  g.addColorStop(0, '#565656'); g.addColorStop(0.5, '#484848'); g.addColorStop(1, '#3a3a3a');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.roundRect(x - hw, y - hh, hw * 2, hh * 2, radius); ctx.fill();
  ctx.strokeStyle = '#282828'; ctx.lineWidth = 1.8; ctx.stroke();

  // Üst parlama
  ctx.fillStyle = 'rgba(255,255,255,0.11)';
  ctx.beginPath(); ctx.roundRect(x - hw + 4, y - hh + 2, (hw - 4) * 2, 10, [radius, radius, 0, 0]); ctx.fill();
}

/** Restoran zemini — PlateUp tarzı koyu mutfak + sıcak ahşap salon */
export function drawFloor(ctx: CanvasRenderingContext2D, unlockedDishes: string[] = [], ingredientPositions?: Record<string, { x: number; y: number }>) {

  // ══════════════════════════════════════════════════════════════════
  // SALON — sıcak açık ahşap parke (PlateUp dining room tonu)
  // ══════════════════════════════════════════════════════════════════
  ctx.fillStyle = '#e8d8b8';
  ctx.fillRect(0, WALL_Y1, GAME_WIDTH, GAME_HEIGHT - WALL_Y1);

  // Parke yatay bantlar
  const plankH = 36;
  for (let ry = 0; ry < Math.ceil((GAME_HEIGHT - WALL_Y1) / plankH); ry++) {
    const py = WALL_Y1 + ry * plankH;
    const isAlt = ry % 2 === 0;
    if (isAlt) {
      ctx.fillStyle = 'rgba(180,130,70,0.06)';
      ctx.fillRect(0, py, GAME_WIDTH, plankH);
    }
    ctx.strokeStyle = 'rgba(150,100,50,0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(GAME_WIDTH, py); ctx.stroke();

    // Dikey tahta bölücüler (ofsetli)
    const off = ry % 2 === 0 ? 0 : 55;
    ctx.strokeStyle = 'rgba(150,100,50,0.07)';
    for (let px = off; px < GAME_WIDTH; px += 110) {
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + plankH); ctx.stroke();
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // MUTFAK ZEMİNİ — PlateUp tarzı: koyu antrasit karo, net çizgiler
  // ══════════════════════════════════════════════════════════════════

  // Zemin tabanı — koyu gri/antrasit
  ctx.fillStyle = '#2e2e2e';
  ctx.fillRect(0, 0, GAME_WIDTH, WALL_Y1);

  // Karo ızgarası (PlateUp: büyük, net, koyu-açık geçişli)
  const tile = 48;
  for (let ty = 0; ty < WALL_Y1; ty += tile) {
    for (let tx = 0; tx < GAME_WIDTH; tx += tile) {
      const even = (Math.floor(tx / tile) + Math.floor(ty / tile)) % 2 === 0;

      // Karo dolgu — iki ton arası hafif fark
      ctx.fillStyle = even ? '#343434' : '#2a2a2a';
      ctx.fillRect(tx + 1, ty + 1, tile - 2, tile - 2);

      // Karo yüzey parlaması (üst sol köşede hafif ışık)
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(tx + 1, ty + 1, tile - 2, (tile - 2) * 0.4);

      // Karo kenar (ince parlak çizgi — plastik/porselen his)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(tx + 1, ty + 1, tile - 2, tile - 2);
    }
  }

  // Karo fugaları (koyu-siyah çizgi ızgarası üstte)
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2;
  for (let ty = 0; ty <= WALL_Y1; ty += tile) {
    ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(GAME_WIDTH, ty); ctx.stroke();
  }
  for (let tx = 0; tx <= GAME_WIDTH; tx += tile) {
    ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, WALL_Y1); ctx.stroke();
  }

  // Mutfak zemin genel parlaması (üstte az, altta çok — ışık kaynağı üstte)
  const kitShine = ctx.createLinearGradient(0, 0, 0, WALL_Y1);
  kitShine.addColorStop(0, 'rgba(255,255,255,0.05)');
  kitShine.addColorStop(0.4, 'rgba(255,255,255,0.02)');
  kitShine.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = kitShine;
  ctx.fillRect(0, 0, GAME_WIDTH, WALL_Y1);

  // ══════════════════════════════════════════════════════════════════
  // ARKA DUVAR (üst kenar) — açık bej/krem
  // ══════════════════════════════════════════════════════════════════
  ctx.fillStyle = '#d8d0c0';
  ctx.fillRect(0, 0, GAME_WIDTH, 10);
  ctx.fillStyle = '#c0b8a8';
  ctx.fillRect(0, 8, GAME_WIDTH, 2);

  // ══════════════════════════════════════════════════════════════════
  // ARA DUVAR (mutfak–salon sınırı)
  // ══════════════════════════════════════════════════════════════════
  // Duvar bandı
  ctx.fillStyle = '#c8c0b0';
  ctx.fillRect(0, WALL_Y1 - 14, GAME_WIDTH, 14);

  // Üst gölge (mutfak tarafı)
  const wtop = ctx.createLinearGradient(0, WALL_Y1 - 14, 0, WALL_Y1);
  wtop.addColorStop(0, 'rgba(0,0,0,0.08)');
  wtop.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = wtop;
  ctx.fillRect(0, WALL_Y1 - 14, GAME_WIDTH, 14);

  // Alt gölge (salon tarafı)
  const wbot = ctx.createLinearGradient(0, WALL_Y1, 0, WALL_Y1 + 18);
  wbot.addColorStop(0, 'rgba(30,15,5,0.22)');
  wbot.addColorStop(1, 'rgba(30,15,5,0)');
  ctx.fillStyle = wbot;
  ctx.fillRect(0, WALL_Y1, GAME_WIDTH, 18);

  // ── KAPILAR ────────────────────────────────────────────────────────────────
  DOOR_RANGES.forEach(([x0, x1]: [number, number]) => {
    const dw = x1 - x0;
    const dg = ctx.createLinearGradient(x0, WALL_Y1 - 14, x0, WALL_Y1);
    dg.addColorStop(0, '#9b7040');
    dg.addColorStop(1, '#7a5228');
    ctx.fillStyle = dg;
    ctx.fillRect(x0, WALL_Y1 - 14, dw, 14);

    ctx.strokeStyle = '#5a3818'; ctx.lineWidth = 2;
    ctx.strokeRect(x0 + 1, WALL_Y1 - 13, dw - 2, 12);

    ctx.fillStyle = '#d4a830';
    ctx.beginPath(); ctx.arc(x0 + dw - 8, WALL_Y1 - 7, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b8922a'; ctx.lineWidth = 1; ctx.stroke();
  });

  // ══════════════════════════════════════════════════════════════════
  // MALZEMELİK RAFLAR — karanlık zemine uyumlu metalik görünüm
  // ══════════════════════════════════════════════════════════════════
  INGREDIENTS.forEach((ing) => {
    // Gizli malzemelerin raflarını da gizle
    const recipe = RECIPE_DEFS[ing.key as keyof typeof RECIPE_DEFS];
    if (recipe && !unlockedDishes.includes(recipe.output)) {
      return;
    }

    const pos = ingredientPositions?.[ing.key] ?? ing.pos;
    const { x, y } = pos;

    drawWorkstationBase(ctx, x, y, 36, 26, 10, 0.35);

    // Alt gölge çizgisi
    ctx.fillStyle = '#222';
    ctx.fillRect(x - 32, y + 22, 64, 2);
  });

  // ══════════════════════════════════════════════════════════════════
  // LAVABO — metalik/endüstriyel görünüm
  // ══════════════════════════════════════════════════════════════════
  const sx = SINK_STATION.x, sy = SINK_STATION.y;

  drawWorkstationBase(ctx, sx, sy, 44, 32, 12, 0.30);

  const si = ctx.createRadialGradient(sx, sy, 2, sx, sy, 26);
  si.addColorStop(0, '#6aaccc'); si.addColorStop(0.6, '#4888aa'); si.addColorStop(1, '#2c6888');
  ctx.fillStyle = si;
  ctx.beginPath(); ctx.roundRect(sx - 26, sy - 18, 52, 30, 14); ctx.fill();
  ctx.strokeStyle = '#1e5068'; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.fillStyle = 'rgba(160,220,255,0.30)';
  ctx.beginPath(); ctx.ellipse(sx - 6, sy - 5, 14, 8, -0.3, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#707070'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(sx, sy - 18); ctx.lineTo(sx, sy - 32); ctx.lineTo(sx + 14, sy - 32); ctx.stroke();
  ctx.fillStyle = '#909090';
  ctx.beginPath(); ctx.ellipse(sx + 14, sy - 32, 5, 3, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#a0a8a0';
  ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('🚿 Lavabo', sx, sy + 18);

  // ══════════════════════════════════════════════════════════════════
  // ÇÖP KUTUSU — gerçek kova şekli
  // ══════════════════════════════════════════════════════════════════
  const tx = TRASH_STATION.x, ty2 = TRASH_STATION.y;

  // Zemin gölgesi
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(tx + 2, ty2 + 28, 22, 7, 0, 0, Math.PI * 2); ctx.fill();

  // Kova gövdesi (hafif trapez — altta dar, üstte geniş)
  ctx.beginPath();
  ctx.moveTo(tx - 20, ty2 - 14);
  ctx.lineTo(tx + 20, ty2 - 14);
  ctx.lineTo(tx + 16, ty2 + 26);
  ctx.lineTo(tx - 16, ty2 + 26);
  ctx.closePath();
  const kovGrad = ctx.createLinearGradient(tx - 20, ty2, tx + 20, ty2);
  kovGrad.addColorStop(0, '#607a6e');
  kovGrad.addColorStop(0.45, '#718f81');
  kovGrad.addColorStop(1, '#4a6058');
  ctx.fillStyle = kovGrad;
  ctx.fill();
  ctx.strokeStyle = '#2e4a3e'; ctx.lineWidth = 2; ctx.stroke();

  // Dikey çizgi detaylar
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1.5; ctx.lineCap = 'butt';
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(tx + i * 8, ty2 - 12);
    ctx.lineTo(tx + i * 6, ty2 + 24);
    ctx.stroke();
  }

  // Kapak (lid)
  const lidGrad = ctx.createLinearGradient(tx - 23, ty2 - 27, tx + 23, ty2 - 15);
  lidGrad.addColorStop(0, '#859e92'); lidGrad.addColorStop(1, '#506860');
  ctx.fillStyle = lidGrad;
  ctx.beginPath(); ctx.roundRect(tx - 22, ty2 - 27, 44, 14, [6, 6, 0, 0]); ctx.fill();
  ctx.strokeStyle = '#2e4a3e'; ctx.lineWidth = 2; ctx.stroke();

  // Kapak tutacağı
  ctx.fillStyle = '#3a5248';
  ctx.beginPath(); ctx.roundRect(tx - 7, ty2 - 35, 14, 10, 4); ctx.fill();
  ctx.strokeStyle = '#223830'; ctx.lineWidth = 1.5; ctx.stroke();

  // Etiket
  ctx.fillStyle = '#d0e8e0';
  ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('🗑️ Çöp', tx, ty2 + 28);

  // ══════════════════════════════════════════════════════════════════
  // TABAK YIĞINI İSTASYONU (PLATE STACK BASE)
  // ══════════════════════════════════════════════════════════════════
  if (PLATE_STACK_POS) {
    const { x, y } = PLATE_STACK_POS;
    drawWorkstationBase(ctx, x, y, 42, 28, 10, 0.28);
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 9px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('TABAKLAR', x, y + 20);
  }

  // ══════════════════════════════════════════════════════════════════
  // SERVİS TEZGAHI — metalik / açık
  // ══════════════════════════════════════════════════════════════════
  if (COUNTER_POSITIONS && COUNTER_POSITIONS.length > 0) {
    const cp0 = COUNTER_POSITIONS[0], cpN = COUNTER_POSITIONS[COUNTER_POSITIONS.length - 1];
    const cw = cpN.x - cp0.x + 90;
    const cx = cp0.x - 44 + cw / 2;
    const cy = cp0.y;

    drawWorkstationBase(ctx, cx, cy, cw / 2 + 2, 26, 10, 0.28);

    ctx.fillStyle = '#303030';
    ctx.fillRect(cp0.x - 40, cp0.y + 24, cw - 8, 2);
  }
}
