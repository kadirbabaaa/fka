import {
  GAME_WIDTH,
  GAME_HEIGHT,
  WALL_Y1,
  DOOR_RANGES,
  INGREDIENTS,
  TRASH_STATION,
  SINK_STATION,
  HOLDING_STATION_POSITIONS,
  COUNTER_POSITIONS,
} from "../types/game";

/** Restoran zemini — sıcak renkler, detaylı mutfak + salon */
export function drawFloor(ctx: CanvasRenderingContext2D) {

  // ══════════════════════════════════════════════════════════════════
  // SALON — sıcak ahşap parke
  // ══════════════════════════════════════════════════════════════════
  const salonGrad = ctx.createLinearGradient(0, WALL_Y1, 0, GAME_HEIGHT);
  salonGrad.addColorStop(0, '#f7e8d0');
  salonGrad.addColorStop(1, '#eedfc4');
  ctx.fillStyle = salonGrad;
  ctx.fillRect(0, WALL_Y1, GAME_WIDTH, GAME_HEIGHT - WALL_Y1);

  // Parke tahta yatay çizgiler
  const plankH = 38;
  ctx.lineWidth = 1;
  for (let ry = 0; ry < Math.ceil((GAME_HEIGHT - WALL_Y1) / plankH); ry++) {
    const py = WALL_Y1 + ry * plankH;
    // Çizgi gölgesi
    ctx.strokeStyle = 'rgba(160,110,60,0.15)';
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(GAME_WIDTH, py); ctx.stroke();
    // Tahta dikey bölümleri (ofsetli)
    const off = ry % 2 === 0 ? 0 : 60;
    ctx.strokeStyle = 'rgba(160,110,60,0.08)';
    for (let px = off; px < GAME_WIDTH; px += 120) {
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + plankH); ctx.stroke();
    }
    // Hafif koyu/açık tahta bantları
    if (ry % 2 === 0) {
      ctx.fillStyle = 'rgba(180,120,60,0.04)';
      ctx.fillRect(0, py, GAME_WIDTH, plankH);
    }
  }

  // Salon kenarlık (duvar geçişi)
  const borderGrad = ctx.createLinearGradient(0, WALL_Y1, 0, WALL_Y1 + 12);
  borderGrad.addColorStop(0, 'rgba(80,40,10,0.25)');
  borderGrad.addColorStop(1, 'rgba(80,40,10,0)');
  ctx.fillStyle = borderGrad;
  ctx.fillRect(0, WALL_Y1, GAME_WIDTH, 12);

  // ══════════════════════════════════════════════════════════════════
  // MUTFAK ZEMİNİ — açık krem karo
  // ══════════════════════════════════════════════════════════════════
  const kitGrad = ctx.createLinearGradient(0, 0, 0, WALL_Y1);
  kitGrad.addColorStop(0, '#ece8e0');
  kitGrad.addColorStop(1, '#e0dbd0');
  ctx.fillStyle = kitGrad;
  ctx.fillRect(0, 0, GAME_WIDTH, WALL_Y1);

  // Mutfak karoları — beyazlı krem, ince gri çizgi
  const tile = 36;
  for (let ty = 0; ty < WALL_Y1; ty += tile) {
    for (let tx = 0; tx < GAME_WIDTH; tx += tile) {
      const even = (Math.floor(tx / tile) + Math.floor(ty / tile)) % 2 === 0;
      // Karo arka plan
      ctx.fillStyle = even ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.03)';
      ctx.fillRect(tx + 0.5, ty + 0.5, tile - 1, tile - 1);
      // Karo kenar
      ctx.strokeStyle = 'rgba(150,140,130,0.20)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(tx + 0.5, ty + 0.5, tile - 1, tile - 1);
      // Karo köşe (ince çapraz efekt)
      ctx.fillStyle = 'rgba(180,170,155,0.08)';
      ctx.fillRect(tx, ty, 3, 3);
    }
  }

  // Mutfak zemin hafif sis (derinlik için)
  const fogGrad = ctx.createLinearGradient(0, 0, GAME_WIDTH, WALL_Y1);
  fogGrad.addColorStop(0, 'rgba(240,230,210,0.12)');
  fogGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
  fogGrad.addColorStop(1, 'rgba(210,200,180,0.10)');
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, 0, GAME_WIDTH, WALL_Y1);

  // ══════════════════════════════════════════════════════════════════
  // ARKA DUVAR (tepede) — çini bezeli
  // ══════════════════════════════════════════════════════════════════
  ctx.fillStyle = '#c8bfb0';
  ctx.fillRect(0, 0, GAME_WIDTH, 10);
  // İnce dekoratif çizgi
  ctx.fillStyle = '#b0a898';
  ctx.fillRect(0, 8, GAME_WIDTH, 2);
  // Duvar-mutfak arası ince bant
  ctx.fillStyle = '#a09888';
  ctx.fillRect(0, 0, GAME_WIDTH, 3);

  // ══════════════════════════════════════════════════════════════════
  // ARA DUVAR (mutfak-salon arası)
  // ══════════════════════════════════════════════════════════════════
  // Kalın duvar bölgesi
  ctx.fillStyle = '#b8b0a0';
  ctx.fillRect(0, WALL_Y1 - 14, GAME_WIDTH, 14);

  // Duvar üst gölge bandı
  const wallTopGrad = ctx.createLinearGradient(0, WALL_Y1 - 14, 0, WALL_Y1);
  wallTopGrad.addColorStop(0, 'rgba(60,40,20,0.08)');
  wallTopGrad.addColorStop(1, 'rgba(60,40,20,0.22)');
  ctx.fillStyle = wallTopGrad;
  ctx.fillRect(0, WALL_Y1 - 14, GAME_WIDTH, 14);

  // Duvar alt gölge (salon tarafı)
  const wallBotGrad = ctx.createLinearGradient(0, WALL_Y1, 0, WALL_Y1 + 18);
  wallBotGrad.addColorStop(0, 'rgba(40,20,5,0.18)');
  wallBotGrad.addColorStop(1, 'rgba(40,20,5,0)');
  ctx.fillStyle = wallBotGrad;
  ctx.fillRect(0, WALL_Y1, GAME_WIDTH, 18);

  // ── KAPILAR ────────────────────────────────────────────────────────────────
  DOOR_RANGES.forEach(([x0, x1]: [number, number]) => {
    const dw = x1 - x0;
    // Kapı iç dolgu
    const doorGrad = ctx.createLinearGradient(x0, WALL_Y1 - 14, x0, WALL_Y1 + 2);
    doorGrad.addColorStop(0, '#8b6030');
    doorGrad.addColorStop(1, '#6a4820');
    ctx.fillStyle = doorGrad;
    ctx.fillRect(x0, WALL_Y1 - 14, dw, 14);

    // Kapı çerçevesi
    ctx.strokeStyle = '#5a3818';
    ctx.lineWidth = 2;
    ctx.strokeRect(x0 + 1, WALL_Y1 - 13, dw - 2, 12);

    // Kapı kolu
    ctx.fillStyle = '#d4a830';
    ctx.beginPath();
    ctx.arc(x0 + dw - 8, WALL_Y1 - 7, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b8922a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Kapı sarkma gölgesi
    const doorShadow = ctx.createLinearGradient(x0, WALL_Y1 - 14, x0 + dw, WALL_Y1 - 14);
    doorShadow.addColorStop(0, 'rgba(0,0,0,0.12)');
    doorShadow.addColorStop(0.3, 'rgba(0,0,0,0)');
    doorShadow.addColorStop(0.7, 'rgba(0,0,0,0)');
    doorShadow.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = doorShadow;
    ctx.fillRect(x0, WALL_Y1 - 14, dw, 14);
  });

  // ══════════════════════════════════════════════════════════════════
  // MALZEMELİK RAFLAR (üst sıra) — daha gösterişli
  // ══════════════════════════════════════════════════════════════════
  INGREDIENTS.forEach((ing) => {
    const { x, y } = ing.pos;

    // Raf gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.roundRect(x - 36, y - 28, 72, 56, 10); ctx.fill();

    // Raf gövdesi
    const rg = ctx.createLinearGradient(x - 36, y - 28, x + 36, y + 28);
    rg.addColorStop(0, '#e8e0d0');
    rg.addColorStop(1, '#d0c8b8');
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.roundRect(x - 36, y - 28, 72, 56, 10); ctx.fill();
    ctx.strokeStyle = '#b8b0a0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Üst parlama şeridi
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath(); ctx.roundRect(x - 32, y - 26, 64, 10, [8, 8, 0, 0]); ctx.fill();

    // Raf kenar çizgisi (alt)
    ctx.fillStyle = '#a09888';
    ctx.fillRect(x - 32, y + 24, 64, 2);
  });

  // ══════════════════════════════════════════════════════════════════
  // LAVABO — daha detaylı
  // ══════════════════════════════════════════════════════════════════
  const sx = SINK_STATION.x, sy = SINK_STATION.y;

  // Tezgah gölgesi
  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  ctx.beginPath(); ctx.roundRect(sx - 44, sy - 32, 88, 64, 12); ctx.fill();

  // Tezgah gövde
  const sinkTezGrad = ctx.createLinearGradient(sx - 44, sy - 32, sx + 44, sy + 32);
  sinkTezGrad.addColorStop(0, '#dbd6ce');
  sinkTezGrad.addColorStop(1, '#c8c2b8');
  ctx.fillStyle = sinkTezGrad;
  ctx.beginPath(); ctx.roundRect(sx - 44, sy - 32, 88, 64, 12); ctx.fill();
  ctx.strokeStyle = '#a8a098'; ctx.lineWidth = 1.5; ctx.stroke();

  // Çukur (lavabo iç)
  const sinkInner = ctx.createRadialGradient(sx, sy, 2, sx, sy, 28);
  sinkInner.addColorStop(0, '#7eb8d4');
  sinkInner.addColorStop(0.6, '#5a9ab8');
  sinkInner.addColorStop(1, '#3a7898');
  ctx.fillStyle = sinkInner;
  ctx.beginPath(); ctx.roundRect(sx - 26, sy - 18, 52, 32, 14); ctx.fill();
  ctx.strokeStyle = '#2e607a'; ctx.lineWidth = 1.5; ctx.stroke();

  // Su yansıması
  ctx.fillStyle = 'rgba(180,230,255,0.35)';
  ctx.beginPath(); ctx.ellipse(sx - 6, sy - 5, 14, 8, -0.3, 0, Math.PI * 2); ctx.fill();

  // Musluk gövde
  ctx.strokeStyle = '#888'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(sx, sy - 18); ctx.lineTo(sx, sy - 32); ctx.lineTo(sx + 14, sy - 32); ctx.stroke();
  // Musluk başlık
  ctx.fillStyle = '#aaa';
  ctx.beginPath(); ctx.ellipse(sx + 14, sy - 32, 5, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Etiket
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('🚿 Lavabo', sx, sy + 20);

  // ══════════════════════════════════════════════════════════════════
  // ÇÖP KUTUSU — daha belirgin
  // ══════════════════════════════════════════════════════════════════
  const tx = TRASH_STATION.x, ty2 = TRASH_STATION.y;

  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  ctx.beginPath(); ctx.roundRect(tx - 40, ty2 - 32, 80, 64, 12); ctx.fill();

  const trashG = ctx.createLinearGradient(tx - 40, ty2 - 32, tx + 40, ty2 + 32);
  trashG.addColorStop(0, '#808878');
  trashG.addColorStop(1, '#606858');
  ctx.fillStyle = trashG;
  ctx.beginPath(); ctx.roundRect(tx - 40, ty2 - 32, 80, 64, 12); ctx.fill();
  ctx.strokeStyle = '#505848'; ctx.lineWidth = 1.5; ctx.stroke();

  // Çöp kutu kapağı çizgisi
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(tx - 36, ty2 - 12); ctx.lineTo(tx + 36, ty2 - 12); ctx.stroke();

  // Kapak kolu
  ctx.strokeStyle = '#a0a890'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(tx - 8, ty2 - 16); ctx.lineTo(tx + 8, ty2 - 16); ctx.stroke();

  ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillStyle = '#c8d0b8';
  ctx.fillText('🗑️ Çöp', tx, ty2 + 22);

  // ══════════════════════════════════════════════════════════════════
  // TABAK BEKLETME RAFLARI
  // ══════════════════════════════════════════════════════════════════
  const plates = HOLDING_STATION_POSITIONS;
  if (plates.length > 0) {
    const fp = plates[0], lp = plates[plates.length - 1];
    const pw = lp.x - fp.x + 100;

    // Arka gölge
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.roundRect(fp.x - 52, fp.y - 30, pw + 4, 60, 10); ctx.fill();

    // Raf gövde
    const plateGrad = ctx.createLinearGradient(fp.x - 50, fp.y, lp.x + 50, fp.y);
    plateGrad.addColorStop(0, '#cdc5b8');
    plateGrad.addColorStop(0.5, '#d8d0c5');
    plateGrad.addColorStop(1, '#cdc5b8');
    ctx.fillStyle = plateGrad;
    ctx.beginPath(); ctx.roundRect(fp.x - 50, fp.y - 28, pw, 56, 10); ctx.fill();
    ctx.strokeStyle = '#a8a098'; ctx.lineWidth = 1.5; ctx.stroke();

    // Üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.20)';
    ctx.beginPath(); ctx.roundRect(fp.x - 46, fp.y - 26, pw - 8, 10, [8, 8, 0, 0]); ctx.fill();
  }

  // ══════════════════════════════════════════════════════════════════
  // SERVİS TEZGAHI (counter)
  // ══════════════════════════════════════════════════════════════════
  if (COUNTER_POSITIONS && COUNTER_POSITIONS.length > 0) {
    const cp0 = COUNTER_POSITIONS[0], cpN = COUNTER_POSITIONS[COUNTER_POSITIONS.length - 1];
    const cw   = cpN.x - cp0.x + 90;

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.roundRect(cp0.x - 46, cp0.y - 28, cw + 4, 56, 10); ctx.fill();

    const counterGrad = ctx.createLinearGradient(cp0.x - 44, cp0.y - 26, cpN.x + 46, cp0.y + 28);
    counterGrad.addColorStop(0, '#e0d8c8');
    counterGrad.addColorStop(1, '#ccc4b4');
    ctx.fillStyle = counterGrad;
    ctx.beginPath(); ctx.roundRect(cp0.x - 44, cp0.y - 26, cw, 52, 10); ctx.fill();
    ctx.strokeStyle = '#b0a898'; ctx.lineWidth = 1.5; ctx.stroke();

    // Alt çizgi detay
    ctx.fillStyle = '#a09888';
    ctx.fillRect(cp0.x - 40, cp0.y + 24, cw - 8, 2);
  }
}
