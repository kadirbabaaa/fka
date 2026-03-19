# 🎮 FKA - Oyun Durumu & Yol Haritası
> **Tarih:** 19 Mart 2026 — Recep tarafından yazıldı.
> **Amaç:** Kodun eksiksiz analizi, mevcut sistemler ve geliştirme öncelikleri.

---

## 📊 MEVCUT DURUM (Büyük Resim)

Oyun **sağlam bir çekirdek döngüye** sahip. Şu an çalışan şeyle:
Gündüz servis yap → Gece upgrades/unlock seç → Yeni güne başla.

Bu döngü oyunun iskeletidir ve **doğru kurulmuş**. Üstüne eklememiz gereken şeyler bunun farkında olmadan hayata geçirilmiş olanlar ve gerçekten eksik olanlar.

---

## ✅ TAMAMEN ÇALIŞAN SİSTEMLER

### 🎮 Temel Oynanış
- **Oyuncu Hareketi:** WASD + Joystick, frame-rate bağımsız hareket (frameScale dahil)
- **Çarpışma:** Yatay duvar (WALL_Y1/Y2), kapı geçişleri (DOOR_RANGES), masa çarpışması (AABB)
- **Taşıma Sistemi:** Oyuncu tek eşya taşır, ALVER tuşuyla alır/bırakır/yerleştirir
- **Tepsi:** `TRAY:` prefix formatıyla n'e kadar eşya (MAX_TRAY_CAPACITY=4) aynı anda taşınır

### 🔥 Pişirme & Mutfak
- **Fırın (CookStation):** Malzeme bırakınca pişirme başlar, progress bar gösterir
- **Yanma:** Yemek pişince BURN_TICKS (300 tick) içinde alınmazsa ⬛ YANAR, siyah duman animasyonu
- **Temiz Tabak Zorunluluğu:** Fırından yemeği almak için CLEAN_PLATE gerekiyor
- **Bulaşık Döngüsü:** Müşteri bitirince kirli masa → oyuncu alır → lavaboda temizler → rafa koyar → yeniden kullanılır
- **5 Tarifin Tamamı Kodlu:** 🍞→🍕, 🥩→🍔, 🥬→🥗, 🥘→🍜, 🍢→🌯

### 👥 Müşteri Sistemi
- **Spawn:** Gün ortasında hız artar, oyuncu sayısına göre %60 çarpanı uygulanır
- **Koltuk Yönetimi:** 5 masa, 10 koltuk (2 kişilik masalar). Kirli masa koltuk bloğu yapar
- **Sabır Sistemi:** Müşteri sabrı tükenir → can azalır → 3 can bitmişse GAME OVER
- **Yeme Animasyonu:** Müşteri yemeği alınca EAT_TICKS (240) süre bekler, sonra bırakıp gider
- **Bahşiş:** Müşteri ayrılırken `score += tipAmount` (base 10 + 5/upgrade)
- **Kapıda Bekleme:** Dolu restorana gelen müşteriler kapı önünde sıra bekler (drawWaitList)

### 🧠 Müşteri Kişiliği (4 Karakter)
- **polite:** Normal, kibarca bekleten müşteriler. Dövünce -20 puan
- **rude:** Sinirli müşteriler. Dövülebilir (4 yumruç sonra gider)
- **recep:** Exaggerated komik tepkiler. %60 intikam şansı
- **thug:** Kıyafet: koyu. İntikam kuyruğu tetikleyebilir. Bir sonraki gün 3-5 thug gelir
- **revengeQueue:** Thug dövülünce gelecek tiklerde thug grubu gönderilir

### 💬 Diyalog Sistemi
- `shared/dialogues.ts` içinde her kişilik için: entry, waiting, eating, leaving_happy, leaving_angry, revenge diyalogları
- Konuşma baloncuğu 90 tick gösterilip kaybolur

### 🌙 Gece Sistemi (PlateUp benzeri)
- **Yemek Kilidi:** Başlangıçta `['🥗', '🍔']` açık; gece 1 yeni yemek seçilir
- **Kart Seçimi:** Kilitsiz yemekler arasından rastgele 2 seçenek sunulur, 1 tanesi açılır
- **Gizli İstasyonlar:** Kilitli yemeklerin hem raf görseli hem malzeme spritesi gizlenir (drawFloor + useGameLoop)
- **Menü Zorunluluğu:** Kart seçilmeden "Yeni Güne Başla" butonu pasif

### 🛒 Gece Mağazası
- **Ek Fırın:** Maks 4 fırına kadar satın alınabilir. Maliyetler: [80, 120, 180]
- **Müşteri Sabrı Upgrade (patience):** 3 seviye, maliyetler [50, 100, 200]
- **Kazanç Upgrade (earnings):** 2 seviye, maliyetler [100, 250]
- **Stok Max Upgrade (stockMax):** Tip mevcut ama client'ta gösterilmiyor (kodu var ama UI yok)
- **Ekstra Can:** $75 ile +1 can, max 3

### 🎨 Görsel & Renderer Sistemi
- `drawFloor.ts`: Zemin, duvarlar, kapılar, raflar, lavabo, çöp kutusu (hepsi Canvas API)
- `drawCookStation.ts`: 3D görünüm, duman parçacıkları, progress ring, yanma barı
- `drawCustomer.ts`: 4 farklı vücut şekli, renk, yürüyüş animasyonu, konuşma balonu
- `drawPlayer.ts`: 8 farklı karakter tipi, elde tuttuğu eşya overlay'i, şapkalar
- `drawTable.ts`: Masa, sandalye, kirli tabak
- `drawCounter.ts`: Servis tezgahı
- `drawHoldingStation.ts`: Tabak bekleme rafları
- **Floor Cache:** `OffscreenCanvas` ile zemin 1 kez çizilip bitmap kopyalanır (FPS optimizasyonu)
- **Cache geçersizliği:** unlockedDishes değişince floor cache otomatik yenileniyor

### 🌐 Multiplayer & Altyapı
- **Socket.io** ile gerçek zamanlı senkronizasyon
- **LOBBY** odası: Herkese tek oda sistemi
- **RoomManager:** State ve interval'ları yönetir
- **Sesler:** `socket.emit("sound", ...)` ile client'a sound trigger gönderilir
- **Bahşiş Animasyonu:** `tipCollected` + `punchEffect` emit'leri, floating text ve parçacık efektleri
- **Ses Chat:** WebRTC tabanlı voice chat (useVoiceChat hook), kanallar arası ses

### 🛡️ Geliştirici Araçları
- **Şifreli Erişim:** Klavyeden "admin" yazınca veya dükkan adına 4 kez tıklayınca açılır
- **Hemen Gece Yap:** Müşterileri temizleyip dayTimer=1'e çeker
- **Ölümsüzlük:** Müşteri sabrı bitse de can gitmez

---

## ⚠️ EKSİK VEYA YANLIŞ VARSAYTIĞIM AMA ASLINDA VAR OLAN:

| Söylediğim | Gerçek Durum |
|---|---|
| "Tabaklama zorunluluğu yok" | ✅ VAR. CLEAN_PLATE olmadan fırından yemek alınamaz |
| "Yanma yok" | ✅ VAR. BURN_TICKS (300), siyah duman, BURNED_FOOD |
| "Bulaşık sistemi yok" | ✅ VAR. Kirli masa → lavabo → temiz tabak döngüsü tam çalışıyor |
| "Tepsi yok" | ✅ VAR. TRAY: prefix sistemi, 4 eşyaya kadar tepsi |

---

## ❌ GERÇEKTEN EKSİK OLAN SİSTEMLER

### 🎯 Tasarım Kararları
- **Malzeme Sonsuzdur:** Stok bitmez. Oyuncunun odağı kaynak taşımak değil, pişirme + servis + temizlik ritmidir.
- **Gece Sipariş Yok:** Stok sonsuz olduğu için gece yenileme gereksinimi kalmadı. `order` event placeholder temizlenebilir.

### 🏆 Kritik Eksikler (Oyunun Temeline Dokunuyor)

#### 1. Çok Aşamalı Yemek / Birleştirme (Combining)
**Durum:** Şu an tüm yemekler "Malzeme → Fırın → Yemek" tek adımlı.  
PlateUp hissinin asıl kaynağı: Hamburgeri yapmak için Ekmek + Pişmiş Et + Marul birleşimi.  
**Etki:** Oyun derin değil, herkes aynı şeyi yapıyor, iş bölümü yok.  
**Öncelik:** 🔴 Yüksek

#### 3. Hazırlık Tezgahı / Doğrama (Prep Station)
**Durum:** Doğrama tahtası, malzemeleri kesmek/hazırlamak yok.  
Karakter serisi Overcooked/PlateUp'ta en kritik "2. el" görevidir.  
**Etki:** Aşçı/garson/hazırlıkçı rol ayrımı yok, oyun kaosu düşük.  
**Öncelik:** 🟡 Orta

#### 4. Kalıcı İlerleme / Meta-Progression
**Durum:** Game Over olunca score %80'e düşüyor ama hiç bir şey kaydedilmiyor. Her oyun sıfırdan başlıyor.  
**Öneri:** LocalStorage ile basit bir "En Yüksek Skor" veya "Açılan Rozetler" sistemi.  
**Öncelik:** 🟡 Orta

> **⚠️ NOT:** `stockMax` upgrade ve `order` gece siparişi mekaniği **kasıtlı olarak kullanılmıyor.** Malzeme sonsuz. Bu bilinçli bir tasarım kararı — oyuncunun odağı pişirme + servis + temizlik ritminde olsun diye.

### 🎨 Görsel & UX Eksikler

#### 7. Mobil Ekran Boyutu Ölçekleme
**Durum:** Canvas sabit 1280x720 px. Mobilde ekranın tamamı kullanılmıyor, kenarlarda boşluklar oluşuyor.  
**Öneri:** `canvas.style.width/height` ile ekrana sıkıştırma (letter-boxing veya fill).  
**Öncelik:** 🔴 Yüksek (mobilden oynayanlar var)

#### 8. Oyuncu Geri Bildirimi / Efektler
**Durum:** Yanlış aksyon yaptığında (kilitli malzeme, kirli tabak taşıma) sadece ses. Görsel feedback yok.  
**Öneri:** Kırmızı X veya sallama animasyonu eşya üstünde.  
**Öncelik:** 🟢 Düşük

#### 9. Servis Tezgahında Yemek Görseli
**Durum:** Counter'lara yemek bırakılabilir ama drawCounter.ts'de sadece tezgah çiziliyor, üstündeki yemek emoji gösterilmiyor.  
**Öncelik:** 🟡 Orta (görsel bug)

### 🌐 Multiplayer & Teknik Eksikler

#### 10. Müşteri Sabır Barı Görsel Sorunu
**Durum:** Müşteri sabrı azaldıkça renk değişimi var ama sabır barı bazen çok küçük görünüyor mobilde.  
**Öncelik:** 🟢 Düşük

---

## 🗺️ ÖNERİLEN GELİŞTİRME SIRASI

### Aşama 1 — Çekirdek Mekaniği Tamamla (1-2 Gün)
1. **Counter Üstü Yemek Görseli:** drawCounter.ts içine `holdingStation.items[0]` çizimi ekle. (Görsel bug)
2. **Mobil Ekran Düzeltme:** Canvas'ı ekrana tam sığdır.
3. **Placeholder Temizliği:** `order` event boş kodu temizle, `stockMax` upgrade'i kaldır.

### Aşama 2 — Derinlik Ekle (3-5 Gün)
4. **Hazırlık Tezgahı (Prep Station):** Yeni istasyon tipi. Malzemeyi bırakınca oyuncu 3 saniye "doğruyor" mekaniği.
5. **Kombine / Çok Aşamalı Yemek:** Fırın çıktısı + başka malzeme = final yemek. Örn: 🥗 = Pişmiş Sebze + Salad Bowl.
6. **Mutfak Düzeni Seçimi (Layout Presets):** Gece 3 farklı istasyon yerleşiminden biri seçilir.

### Aşama 3 — Cila & Büyüme (Sonraki Sürüm)
7. **Mobil Tam Ekran Düzeltme**
8. **Layout Presets (Mutfak Düzeni Seçimi):** 3 farklı istasyon yerleşimi, gece seçilir
9. **Meta-Progression:** LocalStorage ile en yüksek skor ve "açılan rozetler"

---

## 📁 DOSYA HARİTASI

```
c:\fka\
├── server.ts             ← Tüm oyun logic'i (756 satır). Ana sunucu.
├── shared/
│   ├── types.ts          ← Tüm tipler, sabitler, RECIPE_DEFS, UPGRADE_DEFS
│   └── dialogues.ts      ← Diyalog metinleri (kişilik bazlı)
├── src/
│   ├── components/
│   │   ├── GameScreen.tsx      ← Ana oyun HUD, menü seçimi, dev araçlar
│   │   ├── UpgradeShop.tsx     ← Gece mağaza UI
│   │   ├── WelcomeScreen.tsx   ← Giriş ekranı
│   │   ├── CharacterSelect.tsx ← Karakter seçimi
│   │   ├── PatchNotesModal.tsx ← Yama notları
│   │   ├── SettingsPanel.tsx   ← Oyun içi ayarlar
│   │   ├── CosmeticsModal.tsx  ← Kozmetik seçimi
│   │   └── Joystick.tsx        ← Mobil joystick
│   ├── renderer/
│   │   ├── drawFloor.ts        ← Zemin, duvarlar, raflar (cached)
│   │   ├── drawCookStation.ts  ← Fırın (3D + duman + progress ring)
│   │   ├── drawCustomer.ts     ← Müşteri figürleri
│   │   ├── drawPlayer.ts       ← Oyuncu figürü
│   │   ├── drawTable.ts        ← Masa & sandalyeler
│   │   ├── drawCounter.ts      ← Servis tezgahı
│   │   ├── drawStation.ts      ← Malzeme istasyon sprite
│   │   └── drawHoldingStation.ts ← Tabak rafları
│   └── hooks/
│       ├── useGameLoop.ts      ← Render döngüsü, hareket, etkileşim (550 satır)
│       ├── useSocket.ts        ← Socket bağlantısı
│       ├── useKeyboard.ts      ← Klavye olayları
│       ├── useSettings.ts      ← Ayar state'i
│       └── useVoiceChat.ts     ← WebRTC ses chat
```

---

## 🎯 SONUÇ

Oyun hayal ettiğimizden daha iyi bir temele sahip. Tabaklama, yanma, bulaşık, kişilik sistemi, tepsi mekaniği gibi şeyler **zaten var ve çalışıyor.**

**Asıl eksik:** Stokların tükenmesi + gece sipariş → butun resource loop kopuk halde. Bu düzeldikten sonra oyunun "neden yemek yapalım, neden taşıyalım" akışı çok daha anlamlı hissettiriyor.

**Mobil ekran boyutu** da acil, çünkü oyunumuzu telefonda test eden var.

Kanka bu analize göre yolumuzu net gördük. Önce **Stok sistemi** sonra **Counter görsel**, sonra **Prep Station** — bu sırayla gidelim?
