# Gereksinimler Belgesi

## Giriş

Bu özellik, PlateUp tarzı restoran oyununda oyunculara **prep (hazırlık) fazında** müşteri masalarını ve sandalyelerini özgürce yeniden düzenleyebilme imkânı tanır. Oyuncular, gün başlamadan önce masaları istedikleri konuma taşıyarak salon düzenini optimize edebilir. Masa taşındığında ona bağlı iki koltuk da otomatik olarak aynı offset'te taşınır.

Sistem mevcut `stationLayout` + `useLayoutEditor` altyapısıyla paralel çalışır ve aynı socket event pattern'ini kullanır. Taşıma akışı "yaklaş → etkileşim tuşuna bas → yeni konuma git → tekrar bas" şeklindedir. PC'de E/Boşluk tuşu, mobilde mevcut "AL/VER" butonu kullanılır. Pozisyonlar 40×40 piksellik grid hücrelerine snap'lenir.

---

## Sözlük

- **Table_Layout_Editor**: Prep fazında masa konumlarını değiştiren sistem bütünü.
- **Masa**: Oyun alanındaki müşteri masası — `drawTable(cx, cy)` ile çizilen, 2 koltuğu olan nesne.
- **Koltuk**: Masaya bağlı müşteri oturma noktası. Her masa için üst (cy - 47) ve alt (cy + 47) olmak üzere 2 koltuk bulunur.
- **tableLayout**: `GameState` içinde tutulan, her masanın güncel konumunu içeren `Record<string, TablePosition>`.
- **TablePosition**: `{ id, x, y }` yapısı — bir masanın benzersiz kimliği ve piksel koordinatları.
- **getSeatSlots**: `tableLayout`'tan dinamik olarak koltuk listesi hesaplayan fonksiyon.
- **Kilitli_Masa**: Başka bir oyuncu tarafından taşınmakta olan, seçilemeyen masa.
- **Grid**: Oyun alanını kaplayan 40×40 piksellik hücre ızgarası (mevcut `GRID_CELL_SIZE` sabiti).
- **Snap**: Masanın en yakın Grid_Hücresi merkezine otomatik hizalanması.
- **Taşıma_Modu**: Oyuncunun bir masayı tuttuğu, henüz bırakmadığı durum.
- **Önizleme**: Taşıma_Modu sırasında masanın bırakılacağı konumu gösteren yarı saydam gösterim.
- **AABB**: Axis-Aligned Bounding Box — masa çakışma kontrolünde kullanılan dikdörtgen çarpışma alanı (`TABLE_HALF_W`, `TABLE_HALF_H`).
- **Mutfak_Bölgesi**: `y < 320` olan, masaların giremeyeceği mutfak alanı.
- **Duvar_Bandı**: `WALL_Y1..WALL_Y2` arasındaki, masaların giremeyeceği duvar çizgisi.
- **Prep_Fazı**: `dayPhase === 'prep'` olan, müşteri bulunmayan hazırlık dönemi.

---

## Gereksinimler

### Gereksinim 1: Masa Seçimi

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, prep fazında bir masaya yaklaşıp etkileşim tuşuna basarak o masayı seçmek istiyorum; böylece taşıma modunu başlatabilirim.

#### Kabul Kriterleri

1. WHEN Prep_Fazı aktifken ve oyuncu bir masaya 75 piksel veya daha yakınken etkileşim tuşuna bastığında, THE Table_Layout_Editor SHALL o masa için Taşıma_Modu'nu başlatmalıdır.
2. THE Table_Layout_Editor SHALL etkileşim tuşunu platform bağımsız olarak ele almalıdır: PC'de E veya Boşluk tuşu, mobilde mevcut "AL/VER" dokunmatik butonu aynı `interact` olayını tetiklemelidir.
3. WHEN Taşıma_Modu başladığında, THE Table_Layout_Editor SHALL oyuncunun elindeki nesneyi (`holding`) kontrol etmeli; elde nesne varsa Taşıma_Modu başlatılmamalıdır.
4. IF Prep_Fazı aktif değilken oyuncu etkileşim tuşuna basarsa, THEN THE Table_Layout_Editor SHALL Taşıma_Modu'nu başlatmamalı ve normal etkileşim akışını sürdürmelidir.
5. IF oyuncu herhangi bir masaya 75 pikselden daha uzaktayken etkileşim tuşuna basarsa, THEN THE Table_Layout_Editor SHALL Taşıma_Modu'nu başlatmamalıdır.
6. WHEN oyuncu bir Kilitli_Masa'ya yaklaşıp etkileşim tuşuna bastığında, THE Table_Layout_Editor SHALL Taşıma_Modu'nu başlatmamalıdır.
7. THE Table_Layout_Editor SHALL masa seçim kontrolünü istasyon seçim kontrolünden ÖNCE yapmalıdır; böylece masa ve istasyon çakışan konumlarda olsa bile masa öncelik alır.

---

### Gereksinim 2: Müşteri ve Kirli Masa Engeli

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, üzerinde müşteri oturan veya kirli tabak bulunan masaları taşıyamamalıyım; böylece oyun mekaniği bozulmaz.

#### Kabul Kriterleri

1. WHEN bir masanın koltuklarından herhangi birinde oturan bir müşteri (`customers` listesinde `seatX/seatY` eşleşen) varsa, THE Table_Layout_Editor SHALL o masanın seçilmesini engellemelidir.
2. WHEN bir masanın koltuklarından herhangi birinde kirli tabak (`dirtyTables` listesinde `seatX/seatY` eşleşen) varsa, THE Table_Layout_Editor SHALL o masanın seçilmesini engellemelidir.
3. THE Server SHALL `lockTable` event'i geldiğinde müşteri ve kirli masa kontrolünü sunucu tarafında da doğrulamalıdır.
4. WHEN masa seçimi engellendiğinde, THE Client SHALL oyuncuya görsel veya sesli geri bildirim vermemelidir (sessizce reddedilir).

---

### Gereksinim 3: Masa Taşıma ve Önizleme

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, seçtiğim masayı WASD/joystick ile hareket ederek yeni konuma götürmek ve bırakmadan önce nereye yerleşeceğini görmek istiyorum.

#### Kabul Kriterleri

1. WHILE Taşıma_Modu aktifken, THE Table_Layout_Editor SHALL oyuncunun bulunduğu Grid_Hücresi'nde taşınan masanın Önizlemesini çizmelidir.
2. WHILE Taşıma_Modu aktifken ve hedef konum geçerliyken, THE Table_Layout_Editor SHALL Önizlemeyi yeşil tonlu yarı saydam renkte göstermelidir.
3. WHILE Taşıma_Modu aktifken ve hedef konum geçersizken (çakışma veya yasak bölge), THE Table_Layout_Editor SHALL Önizlemeyi kırmızı tonlu yarı saydam renkte göstermelidir.
4. WHILE Taşıma_Modu aktifken, THE Table_Layout_Editor SHALL taşınan masayı orijinal konumunda yarı saydam (alpha 0.4) olarak çizmelidir.
5. WHILE Taşıma_Modu aktifken, THE Table_Layout_Editor SHALL masanın 2 koltuğunu da Önizleme ile birlikte göstermelidir.

---

### Gereksinim 4: Çakışma ve Bölge Kısıtları

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, masaları birbirine çakıştıramamamı ve mutfak/duvar bölgelerine koyamamı istiyorum; böylece oyun alanı mantıklı kalır.

#### Kabul Kriterleri

1. THE Table_Layout_Editor SHALL iki masanın AABB'leri çakıştığında (`|dx| < TABLE_HALF_W * 2 + 10` VE `|dy| < TABLE_HALF_H * 2 + 10`) bırakmayı reddetmelidir.
2. THE Table_Layout_Editor SHALL hedef konumun `y < 320` (Mutfak_Bölgesi) olduğunda bırakmayı reddetmelidir.
3. THE Table_Layout_Editor SHALL hedef konumun `WALL_Y1 <= y <= WALL_Y2` (Duvar_Bandı) içinde olduğunda bırakmayı reddetmelidir.
4. THE Table_Layout_Editor SHALL hedef konumun `y > GAME_HEIGHT - 60` olduğunda bırakmayı reddetmelidir.
5. THE Server SHALL tüm bu kısıtları sunucu tarafında da doğrulamalıdır; client kontrolü yalnızca UX amaçlıdır.

---

### Gereksinim 5: Masa Bırakma

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, yeni konuma gidip tekrar etkileşim tuşuna basarak masayı bırakmak istiyorum.

#### Kabul Kriterleri

1. WHEN Taşıma_Modu aktifken oyuncu etkileşim tuşuna bastığında ve hedef konum geçerliyken, THE Table_Layout_Editor SHALL masayı o konuma yerleştirmeli ve Taşıma_Modu'nu sonlandırmalıdır.
2. WHEN Taşıma_Modu aktifken oyuncu etkileşim tuşuna bastığında ve hedef konum geçersizken, THE Table_Layout_Editor SHALL yerleştirme işlemini reddetmeli ve Taşıma_Modu'nu sürdürmelidir.
3. WHEN bir masa başarıyla bırakıldığında, THE Server SHALL güncellenmiş `tableLayout`'u aynı Oda'daki tüm Client'lara `tableMoved` olayıyla iletmelidir.
4. WHEN bir masa başarıyla bırakıldığında, THE Client SHALL kısa süreli bir başarı sesi çalmalıdır.

---

### Gereksinim 6: Koltuk Senkronizasyonu

**Kullanıcı Hikâyesi:** Bir geliştirici olarak, masa taşındığında müşteri spawn ve oturma sisteminin yeni koltuk konumlarını kullanmasını istiyorum; böylece oyun mekaniği tutarlı kalır.

#### Kabul Kriterleri

1. THE Server SHALL `SEAT_SLOTS` sabit array'ini kaldırmalı ve yerine `getSeatSlots(gs.tableLayout)` fonksiyonunu kullanmalıdır.
2. `getSeatSlots` fonksiyonu SHALL her masa için `{ x: t.x, y: t.y - 47 }` ve `{ x: t.x, y: t.y + 47 }` olmak üzere 2 koltuk döndürmelidir.
3. THE Server SHALL `tryQueueSeat` fonksiyonunda müşteri oturma hesaplamalarını dinamik koltuk listesiyle yapmalıdır.
4. WHEN bir masa taşındığında, THE Server SHALL o masanın koltuklarına atanmış müşterilerin `seatX/seatY` değerlerini güncellememelidir — taşıma yalnızca boş masalarda mümkündür (Gereksinim 2).

---

### Gereksinim 7: İptal Etme

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, taşıma işlemini iptal edip masayı orijinal konumuna geri döndürmek istiyorum.

#### Kabul Kriterleri

1. WHEN Taşıma_Modu aktifken oyuncu Escape tuşuna bastığında (PC), THE Table_Layout_Editor SHALL Taşıma_Modu'nu sonlandırmalı ve masayı orijinal konumunda bırakmalıdır.
2. WHEN Taşıma_Modu aktifken oyuncu ekrandaki "İptal" butonuna dokunduğunda (mobil), THE Table_Layout_Editor SHALL Taşıma_Modu'nu sonlandırmalı ve masayı orijinal konumunda bırakmalıdır.
3. WHEN Taşıma_Modu iptal edildiğinde, THE Table_Layout_Editor SHALL Server'a herhangi bir konum güncellemesi göndermemelidir.
4. WHEN Taşıma_Modu iptal edildiğinde, THE Table_Layout_Editor SHALL Önizleme görselini kaldırmalıdır.

---

### Gereksinim 8: Multiplayer Senkronizasyonu

**Kullanıcı Hikâyesi:** Çok oyunculu bir oyunda, tüm oyuncuların aynı masa düzenini görmesini istiyorum.

#### Kabul Kriterleri

1. WHEN bir oyuncu bir masayı başarıyla taşıdığında, THE Server SHALL güncellenmiş `tableLayout`'u aynı Oda'daki tüm Client'lara `tableMoved` olayıyla iletmelidir.
2. WHEN bir Client `tableMoved` olayını aldığında, THE Client SHALL kendi yerel `GameState.tableLayout`'unu güncellemeli ve Canvas'ı yeniden çizmelidir.
3. WHILE bir oyuncu Taşıma_Modu'ndayken, THE Server SHALL diğer oyuncuların aynı masayı taşımasını engellemeli ve `tableLocked` olayını ilgili Client'lara iletmelidir.
4. WHEN Taşıma_Modu sona erdiğinde (bırakma veya iptal), THE Server SHALL masa kilidini serbest bırakmalı ve `tableUnlocked` olayını Oda'daki tüm Client'lara iletmelidir.
5. WHEN bir oyuncu disconnect olduğunda, THE Server SHALL o oyuncunun kilitlediği tüm masaları serbest bırakmalı ve `tableUnlocked` broadcast etmelidir.

---

### Gereksinim 9: Kalıcılık ve GameState Entegrasyonu

**Kullanıcı Hikâyesi:** Bir geliştirici olarak, masa konumlarının `GameState` içinde tutulmasını ve gece/gündüz geçişlerinde korunmasını istiyorum.

#### Kabul Kriterleri

1. THE GameState SHALL her masa için `x` ve `y` koordinatlarını içeren bir `tableLayout` alanı barındırmalıdır.
2. WHEN `mkGameState` çağrıldığında, THE Server SHALL `tableLayout`'u 5 masanın varsayılan konumlarıyla başlatmalıdır.
3. THE Server SHALL `tableLayout`'u `state` event'iyle tüm Client'lara iletmelidir; böylece her frame güncel konumlar render edilir.
4. WHEN gece/gündüz geçişi yaşandığında, THE Server SHALL `tableLayout`'u sıfırlamamalı; konumlar korunmalıdır.

---

### Gereksinim 10: Görsel Geri Bildirim (HUD)

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, prep fazında masa taşıma modunun mevcut olduğunu ve nasıl kullanılacağını görmek istiyorum.

#### Kabul Kriterleri

1. WHILE Prep_Fazı aktifken ve cihaz PC ise, THE Client SHALL ekranda masa taşıma ipucunu göstermelidir.
2. WHILE Taşıma_Modu aktifken PC'de, THE Client SHALL "Yeni konuma git → E | İptal: Escape" durum mesajını göstermelidir.
3. WHILE Taşıma_Modu aktifken mobilde, THE Client SHALL "Yeni konuma git → AL/VER" durum mesajını ve ekranda görünür bir "İptal" butonunu göstermelidir.
4. WHEN bir masa başka bir oyuncu tarafından kilitlendiğinde, THE Client SHALL o masanın üzerinde bir kilit simgesi göstermelidir.
