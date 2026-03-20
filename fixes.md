# Düzeltme Listesi

## 1. `useGameState.ts` — yanlış upgrade key
- `stockMax` → `plateStackMax` olmalı
- **Dosya:** `src/hooks/useGameState.ts`
- **Durum:** [x]

## 2. Game Over'da `dirtyTables` temizlenmiyor
- `lives = 0` olunca `customers` ve `waitList` temizleniyor ama `dirtyTables` kalmaya devam ediyor
- **Dosya:** `server/gameLoop.ts`
- **Durum:** [x]

## 3. Gece ekranı — "Yeni Güne Başla" butonu `menuChoices` varken disabled olmalı
- Server zaten reddediyor ama UI'da buton aktif görünüyor
- **Dosya:** `src/components/UpgradeShop.tsx`
- **Durum:** [x]

## 4. `CLOSING_THRESHOLD` client'ta re-export edilmiyor
- `shared/types.ts`'de var ama `src/types/game.ts`'de re-export yok
- **Dosya:** `src/types/game.ts`
- **Durum:** [x]

## 5. Müşteri `phase` alanı `isSeated` olunca güncellenmez
- `seating` fazında `isSeated = true` olunca `phase` hâlâ `'seating'` kalıyor
- **Dosya:** `server/gameLoop.ts`
- **Durum:** [x]

## 6. `drawGrassPatch` dead code
- `drawFloor.ts`'de tanımlı ama hiçbir yerde çağrılmıyor
- **Dosya:** `src/renderer/drawFloor.ts`
- **Durum:** [x]

## 7. Mobilde `HudEditor` açıkken joystick/butonlar üst üste biniyor
- `HudEditor` açıkken diğer HUD elemanları gizlenmeli
- **Dosya:** `src/components/GameScreen.tsx`
- **Durum:** [x]
