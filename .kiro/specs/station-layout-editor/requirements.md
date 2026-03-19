# Gereksinimler Belgesi

## Giriş

Bu özellik, PlateUp tarzı restoran oyununda oyunculara **prep (hazırlık) fazında** mutfak istasyonlarını özgürce yeniden düzenleyebilme imkânı tanır. Oyuncular, gün başlamadan önce malzeme istasyonlarını, fırınları, servis tezgahlarını ve yardımcı istasyonları (tepsi, lavabo, çöp) istedikleri konuma taşıyarak kendi iş akışlarını optimize edebilir.

Sistem multiplayer uyumludur: tüm oyuncular aynı layout'u gerçek zamanlı olarak görür. Taşıma işlemi sürükle-bırak değil, "yaklaş → etkileşim tuşuna bas → yeni konuma git → tekrar bas" akışıyla çalışır. PC'de E/Boşluk tuşu, mobilde mevcut "AL/VER" butonu kullanılır. Pozisyonlar 40×40 piksellik grid hücrelerine snap'lenir.

---

## Sözlük

- **Layout_Editor**: Prep fazında istasyon konumlarını değiştiren sistem bütünü.
- **Station**: Oyun alanındaki etkileşilebilir nesne (malzeme istasyonu, fırın, servis tezgahı, tepsi, lavabo, çöp).
- **Taşınabilir_İstasyon**: Oyuncu tarafından yeniden konumlandırılabilen istasyon türü (malzeme istasyonları, fırınlar, servis tezgahları, tepsi, lavabo, çöp).
- **Kilitli_İstasyon**: Taşınamayan nesne (masalar, sandalyeler, duvarlar).
- **Grid**: Oyun alanını kaplayan 40×40 piksellik hücre ızgarası.
- **Grid_Hücresi**: Grid üzerindeki tek bir 40×40 piksellik konum birimi.
- **Snap**: İstasyonun en yakın Grid_Hücresi merkezine otomatik hizalanması.
- **Taşıma_Modu**: Oyuncunun bir istasyonu tuttuğu, henüz bırakmadığı durum.
- **Önizleme**: Taşıma_Modu sırasında istasyonun bırakılacağı konumu gösteren yarı saydam gösterim.
- **Çakışma**: İki istasyonun aynı Grid_Hücresi'ni işgal etmesi durumu.
- **Layout**: Tüm istasyonların o anki konum konfigürasyonu.
- **Prep_Fazı**: `dayPhase === 'prep'` olan, müşteri bulunmayan hazırlık dönemi.
- **Server**: Socket.io tabanlı oyun sunucusu.
- **Client**: React + Canvas tabanlı oyun istemcisi.
- **Oda**: Aynı Layout'u paylaşan multiplayer oyuncu grubu.

---

## Gereksinimler

### Gereksinim 1: Grid Sistemi

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, istasyonların düzenli bir ızgaraya hizalanmasını istiyorum; böylece yerleştirme işlemi öngörülebilir ve temiz görünümlü olur.

#### Kabul Kriterleri

1. THE Layout_Editor SHALL oyun alanını 40×40 piksellik Grid_Hücrelerine bölmek için bir koordinat dönüşüm fonksiyonu sağlamalıdır.
2. WHEN bir istasyon bırakıldığında, THE Layout_Editor SHALL istasyonu en yakın Grid_Hücresi merkezine Snap etmelidir.
3. THE Layout_Editor SHALL piksel koordinatını Grid_Hücresi indeksine dönüştüren ve tersini yapan yardımcı fonksiyonlar sağlamalıdır.
4. WHILE Taşıma_Modu aktifken, THE Layout_Editor SHALL oyuncu konumuna göre hedef Grid_Hücresi'ni sürekli hesaplamalıdır.

---

### Gereksinim 2: Taşıma Modu Aktivasyonu

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, bir istasyona yaklaşıp etkileşim tuşuna (PC: E/Boşluk, mobil: AL/VER butonu) basarak taşıma modunu başlatmak istiyorum; böylece hem klavyede hem dokunmatik ekranda aynı akış çalışır.

#### Kabul Kriterleri

1. WHEN Prep_Fazı aktifken ve oyuncu bir Taşınabilir_İstasyon'a 75 piksel veya daha yakınken etkileşim tuşuna bastığında, THE Layout_Editor SHALL o istasyon için Taşıma_Modu'nu başlatmalıdır.
2. THE Layout_Editor SHALL etkileşim tuşunu platform bağımsız olarak ele almalıdır: PC'de E veya Boşluk tuşu, mobilde mevcut "AL/VER" dokunmatik butonu aynı `interact` olayını tetiklemelidir.
3. WHEN Taşıma_Modu başladığında, THE Layout_Editor SHALL oyuncunun elindeki nesneyi (`holding`) boş olup olmadığını kontrol etmeli; elde nesne varsa Taşıma_Modu başlatılmamalıdır.
4. WHILE Taşıma_Modu aktifken, THE Layout_Editor SHALL normal `interact` (etkileşim) olaylarını devre dışı bırakmalıdır.
5. IF Prep_Fazı aktif değilken oyuncu etkileşim tuşuna basarsa, THEN THE Layout_Editor SHALL Taşıma_Modu'nu başlatmamalı ve normal etkileşim akışını sürdürmelidir.
6. IF oyuncu herhangi bir Taşınabilir_İstasyon'a 75 pikselden daha uzaktayken etkileşim tuşuna basarsa, THEN THE Layout_Editor SHALL Taşıma_Modu'nu başlatmamalıdır.
7. WHEN oyuncu bir Kilitli_İstasyon'a yaklaşıp etkileşim tuşuna bastığında, THE Layout_Editor SHALL Taşıma_Modu'nu başlatmamalı ve oyuncuya görsel geri bildirim vermemelidir.

---

### Gereksinim 3: Taşıma Modu Sırasında Önizleme

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, istasyonu bırakmadan önce nereye yerleşeceğini görmek istiyorum; böylece yanlış konuma bırakmaktan kaçınabilirim.

#### Kabul Kriterleri

1. WHILE Taşıma_Modu aktifken, THE Layout_Editor SHALL oyuncunun bulunduğu Grid_Hücresi'nde taşınan istasyonun Önizlemesini çizmelidir.
2. WHILE Taşıma_Modu aktifken ve hedef Grid_Hücresi boşken, THE Layout_Editor SHALL Önizlemeyi yeşil tonlu yarı saydam renkte göstermelidir.
3. WHILE Taşıma_Modu aktifken ve hedef Grid_Hücresi başka bir istasyon tarafından işgal edilmişken, THE Layout_Editor SHALL Önizlemeyi kırmızı tonlu yarı saydam renkte göstermelidir.
4. WHILE Taşıma_Modu aktifken, THE Layout_Editor SHALL taşınan istasyonun orijinal konumunu farklı bir görsel efektle (örn. kesik çizgi veya soluk renk) işaretlemelidir.

---

### Gereksinim 4: İstasyon Bırakma

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, yeni konuma gidip tekrar etkileşim tuşuna (PC: E/Boşluk, mobil: AL/VER) basarak istasyonu bırakmak istiyorum; böylece taşıma işlemini tamamlayabilirim.

#### Kabul Kriterleri

1. WHEN Taşıma_Modu aktifken oyuncu etkileşim tuşuna bastığında ve hedef Grid_Hücresi boşken, THE Layout_Editor SHALL istasyonu o Grid_Hücresi'ne yerleştirmeli ve Taşıma_Modu'nu sonlandırmalıdır.
2. WHEN Taşıma_Modu aktifken oyuncu etkileşim tuşuna bastığında ve hedef Grid_Hücresi başka bir istasyon tarafından işgal edilmişken, THE Layout_Editor SHALL yerleştirme işlemini reddetmeli ve Taşıma_Modu'nu sürdürmelidir.
3. WHEN bir istasyon başarıyla bırakıldığında, THE Layout_Editor SHALL yeni konumu Snap ederek Grid_Hücresi merkezine hizalamalıdır.
4. WHEN bir istasyon başarıyla bırakıldığında, THE Server SHALL güncellenmiş Layout'u aynı Oda'daki tüm Client'lara yayınlamalıdır.

---

### Gereksinim 5: İptal Etme

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, taşıma işlemini iptal edip istasyonu orijinal konumuna geri döndürmek istiyorum; hem PC'de Escape tuşuyla hem mobilde ekrandaki iptal butonuyla bunu yapabilmeliyim.

#### Kabul Kriterleri

1. WHEN Taşıma_Modu aktifken oyuncu Escape tuşuna bastığında (PC), THE Layout_Editor SHALL Taşıma_Modu'nu sonlandırmalı ve istasyonu orijinal konumuna geri döndürmelidir.
2. WHEN Taşıma_Modu aktifken oyuncu ekrandaki "İptal" butonuna dokunduğunda (mobil), THE Layout_Editor SHALL Taşıma_Modu'nu sonlandırmalı ve istasyonu orijinal konumuna geri döndürmelidir.
3. THE Client SHALL Taşıma_Modu aktifken ekranda görünür bir "İptal" butonu göstermelidir; bu buton hem mobil hem PC'de çalışmalıdır.
4. WHEN Taşıma_Modu iptal edildiğinde, THE Layout_Editor SHALL Server'a herhangi bir konum güncellemesi göndermemelidir.
5. WHEN Taşıma_Modu iptal edildiğinde, THE Layout_Editor SHALL Önizleme görselini kaldırmalıdır.

---

### Gereksinim 6: Multiplayer Senkronizasyonu

**Kullanıcı Hikâyesi:** Çok oyunculu bir oyunda, tüm oyuncuların aynı Layout'u görmesini istiyorum; böylece koordineli çalışabilelim.

#### Kabul Kriterleri

1. WHEN bir oyuncu bir istasyonu başarıyla taşıdığında, THE Server SHALL güncellenmiş Layout'u aynı Oda'daki tüm Client'lara `stationMoved` olayıyla iletmelidir.
2. WHEN bir Client `stationMoved` olayını aldığında, THE Client SHALL kendi yerel GameState'ini güncellemeli ve Canvas'ı yeniden çizmelidir.
3. WHILE bir oyuncu Taşıma_Modu'ndayken, THE Server SHALL diğer oyuncuların aynı istasyonu taşımasını engellemeli ve `stationLocked` olayını ilgili Client'lara iletmelidir.
4. WHEN Taşıma_Modu sona erdiğinde (bırakma veya iptal), THE Server SHALL istasyon kilidini serbest bırakmalı ve `stationUnlocked` olayını Oda'daki tüm Client'lara iletmelidir.
5. THE Server SHALL her Oda için istasyon kilitlerini bağımsız olarak yönetmelidir.

---

### Gereksinim 7: Etkileşim Mesafesi Güncellemesi

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, istasyonu taşıdıktan sonra yeni konumda da normal etkileşimlerin çalışmasını istiyorum; böylece taşıma sonrası oyun mekaniği bozulmaz.

#### Kabul Kriterleri

1. WHEN bir istasyon yeni konuma taşındığında, THE Server SHALL o istasyonun etkileşim mesafesi hesaplamalarını yeni koordinatlarla güncellemelidir.
2. THE Server SHALL `interactHandler` içindeki tüm mesafe kontrollerini sabit koordinatlar yerine GameState'teki dinamik koordinatlardan okumalıdır.
3. WHEN bir malzeme istasyonu taşındığında, THE Server SHALL malzeme alma etkileşimini yeni konumda doğru şekilde işlemelidir.
4. WHEN bir fırın taşındığında, THE Server SHALL pişirme etkileşimini yeni konumda doğru şekilde işlemelidir.

---

### Gereksinim 8: GameState'e Layout Entegrasyonu

**Kullanıcı Hikâyesi:** Bir geliştirici olarak, istasyon konumlarının GameState içinde tutulmasını istiyorum; böylece tüm sistem tek bir doğruluk kaynağından beslensin.

#### Kabul Kriterleri

1. THE GameState SHALL her Taşınabilir_İstasyon için `x` ve `y` koordinatlarını içeren bir `stationLayout` alanı barındırmalıdır.
2. WHEN `mkGameState` çağrıldığında, THE Server SHALL `stationLayout`'u `shared/types.ts` içindeki varsayılan sabit konumlarla başlatmalıdır.
3. THE Server SHALL `stationLayout` değiştiğinde tüm bağımlı sistemlerin (etkileşim, render) güncel koordinatları kullandığını garanti etmelidir.
4. THE GameState SHALL `stationLayout` içindeki her istasyon için benzersiz bir `id` alanı içermelidir; böylece istasyonlar tip ve konumdan bağımsız olarak tanımlanabilsin.

---

### Gereksinim 9: Görsel Geri Bildirim (HUD)

**Kullanıcı Hikâyesi:** Bir oyuncu olarak, prep fazında taşıma modunun mevcut olduğunu ve nasıl kullanılacağını görmek istiyorum; hem PC hem mobil için uygun ipuçları gösterilmeli.

#### Kabul Kriterleri

1. WHILE Prep_Fazı aktifken ve cihaz PC ise, THE Client SHALL ekranda "İstasyonları düzenle: E tuşu" ipucu metnini göstermelidir.
2. WHILE Prep_Fazı aktifken ve cihaz mobil ise, THE Client SHALL ekranda "İstasyonları düzenle: AL/VER butonu" ipucu metnini göstermelidir.
3. WHILE Taşıma_Modu aktifken PC'de, THE Client SHALL "Yeni konuma git → E | İptal: Escape" durum mesajını göstermelidir.
4. WHILE Taşıma_Modu aktifken mobilde, THE Client SHALL "Yeni konuma git → AL/VER" durum mesajını ve ekranda görünür bir "İptal" butonunu göstermelidir.
5. WHEN bir istasyon başka bir oyuncu tarafından kilitlendiğinde, THE Client SHALL o istasyonun üzerinde bir kilit simgesi göstermelidir.
6. WHEN bir istasyon başarıyla taşındığında, THE Client SHALL kısa süreli bir başarı sesi çalmalıdır.

---

### Gereksinim 10: Seri Hale Getirme ve Yükleme (Round-Trip)

**Kullanıcı Hikâyesi:** Bir geliştirici olarak, Layout verilerinin doğru şekilde iletildiğini ve ayrıştırıldığını doğrulamak istiyorum; böylece veri bütünlüğü sağlanır.

#### Kabul Kriterleri

1. THE Server SHALL `stationLayout`'u JSON olarak serileştirip Socket.io üzerinden Client'a iletmelidir.
2. THE Client SHALL alınan JSON'u `stationLayout` nesnesine doğru şekilde ayrıştırmalıdır.
3. FOR ALL geçerli `stationLayout` nesneleri, serileştirme ardından ayrıştırma işlemi eşdeğer bir nesne üretmelidir (round-trip özelliği).
4. IF alınan `stationLayout` verisi beklenen şemaya uymuyorsa, THEN THE Client SHALL hatayı günlüğe kaydetmeli ve mevcut Layout'u koruyarak çökmemelidir.
