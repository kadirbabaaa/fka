# Görev Listesi: Station Layout Editor

## Görevler

- [x] 1. shared/types.ts — Veri modeli genişletmesi
  - [x] 1.1 `StationPosition` interface'ini ekle (`id`, `x`, `y`)
  - [x] 1.2 `GameState`'e `stationLayout: Record<string, StationPosition>` ve `lockedStations: Record<string, string>` alanlarını ekle
  - [x] 1.3 Grid sabitleri ekle: `GRID_CELL_SIZE = 40`, `GRID_COLS`, `GRID_ROWS`
  - [x] 1.4 `mkGameState()` içinde `stationLayout` ve `lockedStations` başlangıç değerlerini ayarla (mevcut sabit koordinatlardan türet)

- [x] 2. server/layoutHandler.ts — Yeni dosya
  - [x] 2.1 `registerLayoutHandler` fonksiyonunu oluştur
  - [x] 2.2 `lockStation` event'ini dinle: prep fazı kontrolü, kilit çakışma kontrolü, `stationLocked` broadcast
  - [x] 2.3 `moveStation` event'ini dinle: prep fazı kontrolü, çakışma kontrolü, `stationLayout` güncelle, kilit kaldır, `stationMoved` broadcast
  - [x] 2.4 `unlockStation` event'ini dinle: kilidi kaldır, `stationUnlocked` broadcast
  - [x] 2.5 Oyuncu disconnect olduğunda kilitlediği istasyonları serbest bırak

- [x] 3. server.ts — layoutHandler entegrasyonu
  - [x] 3.1 `registerLayoutHandler`'ı import et ve her socket bağlantısında çağır

- [x] 4. server/interactHandler.ts — Dinamik koordinatlar
  - [x] 4.1 Lavabo (`SINK_STATION`) sabit koordinatını `gs.stationLayout['sink']` ile değiştir
  - [x] 4.2 Malzeme istasyonları (`INGREDIENTS`) koordinatlarını `gs.stationLayout` üzerinden oku
  - [x] 4.3 Fırınlar (`cookStations`) zaten `station.x/y` kullanıyor — `stationLayout` ile senkronize et
  - [x] 4.4 Counter istasyonları (`COUNTER_POSITIONS`) koordinatlarını `gs.stationLayout` üzerinden oku

- [x] 5. src/renderer/drawLayoutEditor.ts — Yeni dosya
  - [x] 5.1 `snapToGrid(x, y)` fonksiyonu: en yakın grid hücresi merkezine snap
  - [x] 5.2 `pixelToGridIndex(x, y)` ve `gridIndexToPixel(col, row)` yardımcı fonksiyonları
  - [x] 5.3 `isGridCellOccupied(col, row, layout, excludeId?)` fonksiyonu
  - [x] 5.4 `drawLayoutPreview(ctx, editorState, stationLayout)` fonksiyonu: yeşil/kırmızı önizleme, orijinal konum efekti

- [x] 6. src/hooks/useLayoutEditor.ts — Yeni hook
  - [x] 6.1 `LayoutEditorState` interface'ini tanımla
  - [x] 6.2 `handleInteract()`: prep fazı + mesafe kontrolü, taşıma modu başlat/bitir, `lockStation`/`moveStation` emit
  - [x] 6.3 `handleCancel()`: taşıma modunu iptal et, orijinal konuma dön, `unlockStation` emit
  - [x] 6.4 `stationMoved` ve `stationLocked`/`stationUnlocked` socket event'lerini dinle, `gameStateRef` güncelle
  - [x] 6.5 `dayPhase` değiştiğinde (prep → day) taşıma modunu otomatik iptal et

- [x] 7. src/components/GameScreen.tsx — UI entegrasyonu
  - [x] 7.1 `useLayoutEditor` hook'unu entegre et
  - [x] 7.2 "AL/VER" butonunun `onPointerDown`'ını `handleInteract`'e yönlendir (prep fazında)
  - [x] 7.3 Prep fazında taşıma modu aktifken "İptal" butonu göster (`handleCancel` bağlı)
  - [x] 7.4 Prep fazında HUD ipucu güncelle: PC için "E: İstasyon taşı", mobil için "AL/VER: İstasyon taşı"
  - [x] 7.5 Taşıma modu aktifken PC için Escape tuşu dinle (`handleCancel`)

- [x] 8. src/hooks/useGameLoop.ts — Renderer entegrasyonu
  - [x] 8.1 `drawLayoutPreview`'ı render döngüsüne ekle (taşıma modu aktifken çağır)

- [ ] 9. Property-Based Testler
  - [ ] 9.1 `fast-check` ile Özellik 1 testi: Grid snap round-trip
  - [ ] 9.2 `fast-check` ile Özellik 3 testi: Çakışma tespiti
  - [ ] 9.3 `fast-check` ile Özellik 5 testi: İptal round-trip
  - [ ] 9.4 `fast-check` ile Özellik 11 testi: Layout serileştirme round-trip
  - [ ] 9.5 `fast-check` ile Özellik 12 testi: Hatalı layout dayanıklılığı
