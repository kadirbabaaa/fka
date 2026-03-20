# Oyun Geliştirme İlerleme Notları

## Tamamlanan Görevler

### TASK 1: Kod Şişkinliği Azaltma
- `server.ts` 783→320 satıra düşürüldü
- Renderer fonksiyonları ayrı dosyalara taşındı

### TASK 2: Station Layout Editor
- Prep fazında E tuşuyla istasyonları grid üzerinde taşıma sistemi

### TASK 3: Table Layout Editor
- 7 task implement edildi, test edildi
- Commit: `97948f1`

### TASK 4: Görsel Yenileme — Dış Alan
- `GAME_HEIGHT` 720→870 genişletildi
- Tek kapı: `[580, 700]`
- `drawExterior()`: tuğla ön duvar, taş döşeme, yaya yolu, ağaçlar, sokak lambaları
- Sol/sağ/üst tuğla duvar şeritleri eklendi
- `object-contain` + body bg `#9a7858` (tuğla rengi)
- Canvas max-w %80vw ile sınırlandırıldı
- Commit: `4e3c855`, `7c756fc`, `eb356f3`

### TASK 5: Tabak Yığını Taşıma
- `plate_stack` stationLayout'a eklendi
- Prep fazında taşınabilir hale getirildi
- Server interactHandler dinamik koordinat kullanıyor
- Commit: `1fbfecd`

### TASK 6: Müşteriler Kapıdan Giriyor
- `phase: 'entering' | 'seating'` alanı eklendi
- Müşteriler dışarıdan kapıya yürüyerek giriyor
- Çıkarken de kapıya doğru gidip dışarı çıkıyor
- Commit: `1fbfecd`

### TASK 7: Oyun Döngüsü Hata Düzeltmeleri
- `patLimit(lv, day)` — gün ilerledikçe sabır azalıyor: `max(300, 1200 + 300*lv - day*30)`
- Gece timer bitince `menuChoices` yoksa otomatik `nextDay` tetikleniyor
- `resetDay` sonrası tüm fırınlar temizleniyor (`input/output/isBurned/burnTimer`)
- `queueLimit` gün bazlı artıyor: `10 + day*2 + (playerCount-1)*3`
- `score -= 10` → `score = Math.max(0, score - 10)` (negatife düşmez)
- Spawn rate cap `0.005` → `0.008` (daha yüksek gün limitine uygun)

---

## Tespit Edilen Hatalar (Düzeltildi ✅)

1. ~~**Sabırsızlık gün ilerledikçe artmıyor**~~ — `patLimit(lv, day)` ile düzeltildi
2. ~~**Gece timer otomatik geçiş yok**~~ — `menuChoices` yoksa otomatik geçiş eklendi
3. ~~**`resetDay` sonrası fırınlar temizlenmiyor**~~ — `cookStations.forEach` ile temizleniyor
4. ~~**Spawn rate gün 10 sonrası sabit**~~ — `queueLimit` gün bazlı artıyor
5. ~~**`score -= 10` negatife düşebilir**~~ — `Math.max(0, ...)` ile düzeltildi

---

## Mevcut Sabitler

| Sabit | Değer | Açıklama |
|-------|-------|----------|
| `GAME_WIDTH` | 1280 | Canvas genişliği |
| `GAME_HEIGHT` | 870 | Canvas yüksekliği |
| `EXTERIOR_Y` | 720 | Dış alan başlangıcı |
| `WALL_Y1` | 225 | Mutfak-salon sınırı üst |
| `WALL_Y2` | 265 | Mutfak-salon sınırı alt |
| `DAY_TICKS` | 3000 | Gündüz süresi |
| `NIGHT_TICKS` | 600 | Gece süresi |

---

## Mimari

```
server.ts          — Socket.io, oda yönetimi, upgrade/shop eventleri
server/gameLoop.ts — gameTick, spawnTick, customerTick, tryQueueSeat
server/interactHandler.ts — E tuşu etkileşimleri
server/layoutHandler.ts   — İstasyon/masa taşıma eventleri
shared/types.ts    — Ortak tipler ve sabitler
src/hooks/useGameLoop.ts  — Client render döngüsü
src/renderer/      — Canvas çizim fonksiyonları
```
