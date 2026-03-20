# Floorplan Seçim Sistemi

## Ne yapılacak?
Run başında oyuncu farklı restoran şekilleri arasından seçim yapıyor.
Her şekil farklı duvar/kapı konfigürasyonu, farklı masa ve istasyon başlangıç pozisyonları içeriyor.
Run boyunca şekil sabit kalıyor (PlateUp floorplan mantığı).

---

## Zorluk: ORTA-ZOR ⚠️

### Neden orta-zor?
- `drawFloor.ts` şu an tamamen hardcoded — duvarlar, kapılar, dış alan hepsi sabit koordinatlarla çiziliyor
- `usePlayerMovement.ts` çarpışma sistemi `WALL_Y1`, `WALL_Y2`, `EXTERIOR_Y`, kapı aralıkları sabit import ediyor
- `mkGameState()` masa ve istasyon pozisyonları sabit
- Server `join` event'i floorplan parametresi almıyor
- `CharacterSelect` ekranına yeni bir seçim adımı eklenmeli

### Kolay olan kısımlar
- Floorplan tanımları sadece veri (JSON benzeri sabitler) — kod değil
- `stationLayout` ve `tableLayout` zaten dinamik (layout editor altyapısı hazır)
- Render sistemi zaten `stationLayout`'tan pozisyon okuyor

---

## Planlanan Floorplanlar

### 1. Klasik (Dikdörtgen) — varsayılan
```
┌──────────────────────────────┐
│         MUTFAK               │
├────────────[KAPI]────────────┤
│         SALON                │
│  [M] [M] [M] [M] [M]        │
└──────────[ÇIKIŞ]─────────────┘
```
- Mevcut layout, değişiklik yok
- Zorluk: Kolay

### 2. L-Şekli
```
┌──────────────┐
│   MUTFAK     │
├──────[K]─────┤──────────┐
│   SALON      │  EK ALAN │
│  [M] [M]     │  [M] [M] │
└──────────────┴──────────┘
```
- Sağ tarafta ek salon alanı
- Kapı sola kayıyor
- Masalar iki bölgeye dağılıyor
- Zorluk: Orta (daha uzun servis mesafesi)

### 3. U-Şekli
```
┌────┐              ┌────┐
│ K  │   AÇIK ALAN  │ K  │
│ İ  ├──────────────┤ İ  │
│ T  │    SALON     │ T  │
│ A  │  [M] [M] [M] │ A  │
└────┘              └────┘
```
- İki ayrı mutfak bölgesi (sol/sağ)
- Ortada geniş salon
- İki kapı (sol ve sağ)
- Zorluk: Zor (koordinasyon gerektirir)

### 4. Dar & Uzun
```
┌──────────┐
│  MUTFAK  │
├───[K]────┤
│  SALON   │
│  [M]     │
│  [M]     │
│  [M]     │
│  [M]     │
└──[ÇIKIŞ]─┘
```
- Dar ama uzun restoran
- Masalar dikey sıralanıyor
- Zorluk: Zor (trafik yönetimi zor)

---

## Teknik Adımlar

### 1. `shared/types.ts`
- `FloorplanId` tipi ekle: `'classic' | 'l-shape' | 'u-shape' | 'narrow'`
- `FloorplanDef` interface: `{ wallY1, wallY2, exteriorY, doorRanges, tableLayout, stationLayout }`
- `FLOORPLANS` sabiti: 4 floorplan tanımı
- `GameState`'e `floorplanId` alanı ekle

### 2. `server.ts`
- `join` event'inde `floorplanId` al
- `mkGameState(floorplanId)` şeklinde parametre geç

### 3. `server/gameLoop.ts`
- `DOOR_X`, `DOOR_ENTRY_Y` sabitlerini floorplan'dan al
- `tryQueueSeat` kapı pozisyonunu dinamik kullansın

### 4. `src/renderer/drawFloor.ts`
- `drawFloor(ctx, gs)` — gameState'ten floorplan oku
- Duvar/kapı çizimlerini floorplan'a göre yap

### 5. `src/hooks/usePlayerMovement.ts`
- Çarpışma kontrollerini `gameState.floorplan` üzerinden yap

### 6. `src/components/CharacterSelect.tsx`
- Floorplan seçim kartları ekle (görsel mini harita)
- `floorplanId` state'i App.tsx'e taşı
- `join` emit'ine `floorplanId` ekle

### 7. `src/App.tsx`
- `floorplanId` state ekle
- `handleJoin` ve `handleQuickStart`'a geç

---

## Tahmini Süre
- Adım 1-2: ~30 dk (veri tanımları)
- Adım 3-5: ~1 saat (render + hareket sistemi)
- Adım 6-7: ~30 dk (UI)
- **Toplam: ~2 saat**

---

## Riskler
- `drawFloor.ts` çok büyük ve hardcoded — refactor gerekiyor
- Çarpışma sistemi floorplan'a göre test edilmeli
- Multiplayer'da tüm oyuncular aynı floorplan'ı görmeli (server'dan gelecek)
