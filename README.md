# DraBornOdds · v0.2 · versionCode 1

DraBornOdds demo maç veya sahte oran kullanmaz. Expo Go 58.0.0 uygulaması gerçek futbol verisini public-web scraping ile toplar; spor/odds API’si kullanılmaz. TFF herkese açık sayfası Süper Lig fikstür yedeğidir. Geniş futbol bülteni ve doğrulanmış oran marketleri `DraBorn-Park-Garage-SportOdds` Supabase projesindeki yalnızca `dbo_` ad alanına alınır. APK/AAB henüz üretilmez.

## Geniş gerçek veri akışı

Public futbol bülteni → maç/takım/tarih eşleştirme → tüm erişilebilir market seçimlerini normalize etme → `dbo_odds_history` → market bazlı marj temizleme → `dbo_match_analysis` → Düşük Risk / Dengeli / Yüksek Getiri / Ultra Getiri → açıklamalı kupon raporu.

17 Eylül 2026 canlı doğrulama turunda collector tek çalışmada **157 yaklaşan maç ve 1.543 doğrulanabilir oran seçimi** ayrıştırdı. Bu sayı bülten değiştikçe doğal olarak değişir. Şu an doğrudan kullanılan market grupları: **Maç Sonucu 1/X/2, 2.5 ve 3.5 Alt/Üst, Çifte Şans, Karşılıklı Gol Var/Yok ve İlk Yarı 1/X/2**. `dbo_odds_history` şeması market anahtarı + seçim anahtarı + line şeklinde geneldir; yeni public marketler aynı tabloya eklenebilir.

Nesine / Misli / Bilyoner / Tuttur doğrudan collector’ları da korunur. Bir kaynak CAPTCHA/bot koruması döndürürse koruma aşılmaz. Doğrudan siteler erişim vermediğinde açık bülten hattı çalışmaya devam eder; hiçbir eksik oran uydurulmaz.

## Analiz yaklaşımı

Tamamlayıcı market gruplarında bookmaker marjı kaldırılır. Örneğin 1X2 için `q = 1/oran`, ardından `p = q / Σq`; Alt/Üst ve KG Var/Yok için aynı no-vig mantığı kendi tamamlayıcı grubunda uygulanır. Çifte şans olasılığı normalize 1X2 bileşenlerinden türetilir.

Akıllı kupon motoru artık yalnızca 1X2 seçmez. Her oranlı maçtaki doğrulanmış marketleri tarar ve **veri kalite skoru + market olasılığı + oran seviyesi + seçilen risk profili** bileşimini sıralar. Düşük risk profili daha yüksek olasılık/kaliteye, yüksek ve ultra profiller daha yüksek oran ve belirsizliğe daha fazla ağırlık verir. Bu sıralama istatistiksel karar desteğidir; kesin sonuç veya kazanç garantisi değildir.

Maç detayında marketler ayrı gruplarda gösterilir. Analiz için oranı olmayan TFF fikstürleri görünür kalır ancak kupona alınmaz. Rapor oluşturulduğunda kullanılan maç/oran/olasılık snapshot’ı cihazda saklanır.

## Supabase izolasyonu ve güvenlik

Proje: `DraBorn-Park-Garage-SportOdds` (`xpdiwyxnnrmyvpcqwuyb`). DraBornOdds nesneleri `dbo_` ile izoledir. Temel tablolar: `dbo_site_collectors`, `dbo_matches`, `dbo_source_matches`, `dbo_odds_history`, `dbo_collector_runs`, `dbo_teams`, `dbo_team_aliases`, `dbo_team_stats`, `dbo_match_analysis`, `dbo_predictions`, `dbo_generated_coupons`, `dbo_user_preferences`, `dbo_app_config`.

GitHub Actions collector her saatin 07/37. dakikasında ve manuel çalışır; collector kodu değiştiğinde de yeni parser hemen doğrulanır. Büyük bülten Edge Function kaynak limitine takılmaması için küçük ingestion batch’lerine bölünür. GitHub’da kalıcı service-role anahtarı tutulmaz; kısa ömürlü GitHub OIDC kimliği kullanılır ve `dbo-ingest-odds` yalnızca `DrabornEagle/DraBornOdds` `main` ref’ini kabul eder.

## Termux + Expo Go 58

```bash
pkg install -y nodejs-lts curl unzip
curl -fL "https://raw.githubusercontent.com/DrabornEagle/DraBornOdds/main/scripts/dkd-termux-install.sh?$(date +%s)" -o "$HOME/dkd-odds-install.sh"
bash "$HOME/dkd-odds-install.sh"
```

Aynı telefonda Expo Go URL: `exp://127.0.0.1:8081`. Kurulum ZIP tabanlıdır; telefonda `git` gerekmez. Sonraki açılış:

```bash
cd ~/projects/DraBornOdds
npm start -- --port 8081 --clear
```

## Doğrulama

```bash
npm ci
npm run typecheck
npm test
npx expo install --check
npx expo export --platform android --output-dir dist-android
node scripts/dkd-fixture-smoke.mjs
node collectors/dkd_collect.mjs iddaa_public
```

Expo export APK üretmez; Android JavaScript paketinin derlenebilirliğini doğrular. TFF smoke gerçek fikstür HTML’ini, public bulletin smoke ise geniş oran ayrıştırıcısını doğrular.

Görünür sürüm: **DKD_draborneagle_v0.2** · Expo SDK 58 · Android **versionCode 1**.
