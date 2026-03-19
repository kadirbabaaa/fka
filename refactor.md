# Refactor Planı

Bağımlılıklara dokunmadan, adım adım kod şişkinliğini azaltma planı.

---

## Adım 1 — `rendererUtils.ts` oluştur
**Dosyalar:** `drawPlayer.ts`, `drawCustomer.ts`
**Sorun:** `stk()`, `adjustColor()`/`adj()` fonksiyonları iki dosyada kopyalanmış. Gölge çizimi de tekrar ediyor.
**Yapılacak:**
- `src/renderer/rendererUtils.ts` oluştur
- `stk()`, `adjustColor()`, `drawShadowEllipse()` buraya taşı
- Her iki dosyada import ile kullan
**Tahmini kazanç:** ~60 satır

---

## Adım 2 — `BaseModal` bileşeni oluştur
**Dosyalar:** `SettingsModal.tsx`, `CosmeticsModal.tsx`, `PatchNotesModal.tsx`
**Sorun:** Overlay, backdrop, kapatma butonu, border yapısı üç dosyada tekrar ediyor.
**Yapılacak:**
- `src/components/BaseModal.tsx` oluştur
- `onClose`, `children`, opsiyonel `maxWidth` prop'ları al
- Üç modal bileşenini bu wrapper'ı kullanacak şekilde güncelle
**Tahmini kazanç:** ~120 satır

---

## Adım 3 — `useGameLoop.ts` bölünmesi
**Dosya:** `useGameLoop.ts` (600+ satır)
**Sorun:** Rendering, collision, audio, floating text, punch efektleri tek hook'ta.
**Yapılacak:**
- `usePlayerMovement.ts` → hareket + çarpışma logic'i
- `useGameEffects.ts` → floating text + punch particles
- `useProximityAudio.ts` → mesafe bazlı ses
- `useGameLoop.ts` sadece render döngüsünü yönetsin, diğerlerini çağırsın
**Tahmini kazanç:** ~300 satır (okunabilirlik)

---

## Adım 4 — `GameScreen.tsx` state temizliği
**Dosya:** `GameScreen.tsx`
**Sorun:** 20+ useState tek bileşende, HUD state'i ile UI state'i karışık.
**Yapılacak:**
- `useGameState.ts` hook'u → gameStateRef'ten poll eden tüm state'leri topla
- `useDevMode.ts` hook'u → dev mode logic'ini ayır
- `GameScreen.tsx` sadece layout ve event handler'ları tutsun
**Tahmini kazanç:** ~80 satır, çok daha okunabilir bileşen

---

## Adım 5 — `drawFloor.ts` helper'ları
**Dosya:** `drawFloor.ts` (300+ satır)
**Sorun:** Tezgah, lavabo, çöp kutusu çizimlerinde tekrar eden gölge + gradient + parlama pattern'i.
**Yapılacak:**
- `drawWorkstation()` helper → tezgah tabanı çizimi (gölge + gradient + parlama) tek fonksiyon
- Her istasyon çiziminde bu helper'ı kullan
**Tahmini kazanç:** ~80 satır

---

## Durum

| Adım | Durum |
|------|-------|
| 1 — rendererUtils | ✅ Tamamlandı |
| 2 — BaseModal | ✅ Tamamlandı |
| 3 — useGameLoop bölünmesi | ✅ Tamamlandı |
| 4 — GameScreen state | ✅ Tamamlandı |
| 5 — drawFloor helpers | ✅ Tamamlandı |
