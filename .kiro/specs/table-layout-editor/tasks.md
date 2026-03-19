# Görev Listesi: Table Layout Editor

## Görevler

- [ ] 1. shared/types.ts — Veri modeli genişletmesi
  - [ ] 1.1 `TablePosition` interface'ini ekle (`id`, `x`, `y`)
  - [ ] 1.2 `GameState`'e `tableLayout: Record<string, TablePosition>` ve `lockedTables: Record<string, string>` alanlarını ekle
  - [ ] 1.3 `getSeatSlots(tableLayout)` fonksiyonunu ekle — her masa için `(t.x, t.y - 47)` ve `(t.x, t.y + 47)` döndürür
  - [ ] 1.4 `SEAT_SLOTS` sabit array'ini kaldır
  - [ ] 1.5 `mkGameState()` içinde `tableLayout` başlangıç değerlerini ayarla (5 masa, mevcut `TABLE_X_SLOTS` + `TABLE_Y` koordinatlarından türet)
  - [ ] 1.6 `mkGameState()` içinde `lockedTables: {}` ekle

- [ ] 2. src/types/game.ts — Re-export güncelleme
  - [ ] 2.1 `TABLE_X_SLOTS` ve `TABLE_Y` sabitlerini kaldır
  - [ ] 2.2 `TablePosition` ve `getSeatSlots` re-export et
  - [ ] 2.3 `SEAT_SLOTS` re-export'unu kaldır

- [ ] 3. server/layoutHandler.ts — Masa event'leri
  - [ ] 3.1 `lockTable` event'ini dinle: prep fazı kontrolü, müşteri/kirli masa kontrolü, kilit çakışma kontrolü, `tableLocked` broadcast
  - [ ] 3.2 `moveTable` event'ini dinle: kilit kontrolü, bölge kısıtları, AABB çakışma kontrolü, `tableLayout` güncelle, kilit kaldır, `tableMoved` + `tableUnlocked` broadcast
  - [ ] 3.3 `unlockTable` event'ini dinle: kilidi kaldır, `tableUnlocked` broadcast
  - [ ] 3.4 `disconnect` handler'ına masa kilit temizleme ekle (`lockedTables` üzerinde döngü)
  - [ ] 3.5 `tableOverlaps` yardımcı fonksiyonunu ekle (AABB kontrolü)

- [ ] 4. server/gameLoop.ts — Koltuk sistemi güncelleme
  - [ ] 4.1 `SEAT_SLOTS` import'unu kaldır
  - [ ] 4.2 `getSeatSlots` import et
  - [ ] 4.3 `tryQueueSeat` içinde `SEAT_SLOTS` → `getSeatSlots(gs.tableLayout)` ile değiştir

- [ ] 5. src/renderer/drawLayoutEditor.ts — Genişletme
  - [ ] 5.1 `LayoutEditorState`'e `isMovingTable: boolean` ve `movingTableId: string | null` alanlarını ekle
  - [ ] 5.2 `isTablePositionValid(x, y, tableLayout, excludeId)` fonksiyonunu ekle (AABB + bölge kısıtları)
  - [ ] 5.3 `drawLayoutPreview` fonksiyonuna masa preview desteği ekle: `isMovingTable` true ise `TABLE_HALF_W × TABLE_HALF_H` boyutunda outline çiz (yeşil/kırmızı)

- [ ] 6. src/hooks/useLayoutEditor.ts — Masa taşıma mantığı
  - [ ] 6.1 `DEFAULT_STATE`'e `isMovingTable: false` ve `movingTableId: null` ekle
  - [ ] 6.2 `handleInteract()` içine masa taşıma modu bırakma mantığını ekle (istasyon kontrolünden ÖNCE)
  - [ ] 6.3 `handleInteract()` içine en yakın boş masa arama mantığını ekle (müşteri/kirli masa/kilit kontrolü dahil)
  - [ ] 6.4 `handleCancel()` içine masa kilidi serbest bırakma ekle (`unlockTable` emit)
  - [ ] 6.5 Preview interval'ını masa taşıma modunu da destekleyecek şekilde güncelle (`isTablePositionValid` kullan)
  - [ ] 6.6 `tableMoved`, `tableLocked`, `tableUnlocked` socket event listener'larını ekle
  - [ ] 6.7 `dayPhase` değiştiğinde masa taşıma modunu da iptal et

- [ ] 7. src/hooks/useGameLoop.ts — Render güncelleme
  - [ ] 7.1 `TABLE_X_SLOTS`, `TABLE_Y` import'larını kaldır
  - [ ] 7.2 `drawFloorCached`'e `tablePositions` parametresi ekle
  - [ ] 7.3 Cache key hesaplamasına masa pozisyonlarını dahil et
  - [ ] 7.4 `TABLE_X_SLOTS.forEach` → `Object.values(tableLayout).forEach` ile değiştir
  - [ ] 7.5 Taşınan masa için orijinal konumda `globalAlpha = 0.4` ile yarı saydam çizim uygula

- [ ] 8. Doğrulama
  - [ ] 8.1 `npm run build` — sıfır TypeScript hatası
  - [ ] 8.2 Tek oyuncuda masa taşıma çalışıyor (seç → taşı → bırak)
  - [ ] 8.3 Müşteri oturmuş masayı seçmeye çalışınca engelleniyor
  - [ ] 8.4 Kirli masa varken seçim engelleniyor
  - [ ] 8.5 Masalar birbirine çakışmıyor
  - [ ] 8.6 Mutfak bölgesine (y < 320) masa taşınamıyor
  - [ ] 8.7 Gece/gündüz geçişinde pozisyonlar korunuyor
  - [ ] 8.8 İki oyuncuda aynı masayı aynı anda seçmeye çalışınca kilit çalışıyor
  - [ ] 8.9 Mobil joystick + AL/VER butonu çalışıyor
