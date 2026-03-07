Original prompt: sa kral baksana bi hata var mı

- 2026-03-07: Local repo incelendi. `npm run lint` ve `npm run build` temiz geçti; sorun derleme değil oyun akışıydı.
- 2026-03-07: Server mantığında üç ana sorun bulundu: night sırasında `interact` exploit'i, gün biter bitmez müşteri varken `night` overlay'ine düşme, ve `charType` bilgisinin join sırasında kaybolması.
- 2026-03-07: Düzeltme uygulandı. `charType` artık player state'e yazılıyor, night sırasında etkileşim kapatıldı, müşteri oturtma sadece `day` fazında çalışıyor ve `day -> night` geçişi yalnızca aktif müşteri/kuyruk boşaldığında yapılıyor.
- 2026-03-07: Doğrulama tamamlandı. `npm run lint` ve `npm run build` tekrar temiz geçti.
- 2026-03-07: Bulaşık döngüsü eklendi. Müşteri yemeği bitirince masa kirleniyor, kirli tabaklar seat'i bloke ediyor, oyuncu kirli tabağı alıp lavaboda temizliyor ve temiz tabağı tekrar raflara koyabiliyor.
- 2026-03-07: Pişmiş yemeği ocaktan almak için artık temiz tabak gerekiyor. Oyun başında raflar temiz tabakla başlıyor.
- 2026-03-07: Gece `order` butonu gecede tek kullanıma düşürüldü. Doğrulama için yine `npm run lint` ve `npm run build` temiz geçti.
- 2026-03-07: Çöp etkileşim alanı küçültüldü (`90 -> 56`). Böylece çöpe yaklaşmadan yanlışlıkla yemek atma ihtimali azaldı. `npm run lint` ve `npm run build` tekrar temiz geçti.
- 2026-03-07: Başlangıç akışı yeniden tasarlandı. Ana menü, ayrı ayarlar girişi ve outfit bazlı lobby eklendi; emoji seçim kartları kaldırıldı.
- 2026-03-07: Ayar state'i App seviyesine taşındı. Menü ve oyun içi aynı settings değerlerini kullanıyor.
- 2026-03-07: Client render tarafında statik masa çizimi cache'e alındı, hareket frame-delta bazlı hale getirildi ve müşteri çizimi daha sade/stabil bir yürüyüş mantığıyla yeniden yazıldı.
- 2026-03-07: Server loop gerçek süre gecikmelerine karşı catch-up adımlarıyla güncellendi. `npm run lint` ve `npm run build` temiz geçti. Alternatif portta kısa production start denemesi hata vermeden timeout oldu; uzun süreli runtime testi için mevcut port işgalinin temizlenmesi gerekiyor.
