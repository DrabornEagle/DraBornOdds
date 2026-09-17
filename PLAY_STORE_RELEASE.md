# DraBornOdds v0.7.2 — Google Play release checklist

Bu dosya yayın öncesi teknik/politika kontrol listesidir; hukuki onay yerine geçmez. Play Console beyanları yayınlanan AAB'nin gerçek davranışıyla aynı olmalıdır.

## Herkese açık bağlantılar

- Privacy: https://www.draborneagle.com/DraBornOdds/privacy
- Terms: https://www.draborneagle.com/DraBornOdds/terms
- Data safety summary: https://www.draborneagle.com/DraBornOdds/data-safety
- Support: https://www.draborneagle.com/DraBornOdds/support

## v0.7.2 veri davranışı

- Kullanıcı hesabı / giriş sistemi yok.
- Ad, e-posta, telefon, açık adres veya kullanıcı profili istenmiyor.
- Konum, rehber, kamera ve mikrofon çekirdek işlevde istenmiyor.
- Kart / banka / bahis hesabı bilgisi alınmıyor.
- Favoriler, tercihler ve kaydedilen raporlar cihaz veya tarayıcı yerel deposunda tutuluyor.
- Canlı fikstür/oran verisi HTTPS üzerinden Supabase `dbo_` alanından ve herkese açık spor kaynaklarından okunuyor.
- Reklam SDK'sı ve üçüncü taraf kullanıcı analitiği SDK'sı v0.7.2'de yok.
- Profil ekranında yerel verileri silme işlevi var.

## Play Console

- App content > Privacy policy alanına privacy bağlantısını gir.
- Data safety formunu yayınlanan AAB ve tüm SDK'larla birebir aynı doldur.
- Uygulama hesabı olmadığı sürece account deletion akışı uygulanmaz; ileride hesap özelliği eklenirse uygulama içi ve harici hesap silme akışı yayından önce eklenmeli.
- Target audience / content rating sorularını oran ve spor analizi içeriğini saklamadan doğru beyan et.
- DraBornOdds gerçek para yatırma, çekme veya bahis işlemi sunmamalı; gerçek para bahsine yönlendiren CTA, WebView veya bahis hesabı bağlantısı eklenmeden önce Google Play'in güncel Real-Money Gambling policy'si ve Türkiye için gerekli lisans/uygunluk şartları yeniden incelenmeli.
- Ürün içinde 18+ ve sorumlu kullanım açıklaması korunmalı.

## Sürüm

- App version: 0.7.2
- Android versionCode: 2
- Expo SDK: 58
- Web base path: /DraBornOdds
