# DraBornOdds · v0.2 · versionCode 1

DraBornOdds demo maç veya sahte oran kullanmaz. Expo Go 58.0.0 üzerinde çalışan uygulama iki bağımsız gerçek veri hattı kullanır: güncel futbol fikstürü için TheSportsDB V1 açık spor API’si, doğrulanmış 1X2 oranları için `DraBorn-Park-Garage-SportOdds` Supabase projesindeki izole `dbo_` hattı. Bu aşamada APK/AAB üretilmez ve web sürümü deploy edilmez.

## Gerçek veri akışı

**Fikstür:** TheSportsDB ücretsiz V1 (`123`) → Turkish Super Lig (`idLeague=4339`) → günlük/sonraki karşılaşmalar → DraBornOdds. Fikstür kaynağı gerçek takım, tarih ve saatleri göstermek için kullanılır. Fikstürün gelmesi tek başına bahis oranı veya tahmin üretmez.

**1X2 oranı:** Nesine / Misli / Bilyoner / Tuttur → bağımsız `dbo_` collector → takım/maç eşleştirme → 1X2 oran normalizasyonu → `dbo_odds_history` → `dbo_match_analysis` / `dbo_predictions` → Düşük Risk / Dengeli / Yüksek Getiri / Ultra Getiri → açıklamalı analiz raporu.

Collector’lar yalnızca herkese açık ve otomatik erişime izin veren yanıtları işler; CAPTCHA, bot koruması veya erişim engeli aşılmaz. Bir kaynak doğrulanabilir yapılandırılmış 1X2 verisi vermiyorsa uygulama oran uydurmaz. Bu durumda gerçek fikstür yine görünür, ancak analiz ve kupona ekleme kapalı kalır. Doğrulanmış 1X2 geldiğinde aynı karşılaşmanın oran/analiz alanları otomatik açılır.

Fikstür ve oran istekleri birbirinden bağımsız yürütülür. Bir veri hattının geçici olarak başarısız olması diğer hattın kullanılmasını engellemez. Aynı tarih/takım eşleşmesinde doğrulanmış oranlı kayıt, yalnızca fikstür içeren kaydın yerini alır.

## Supabase izolasyonu

Kullanılan proje: `DraBorn-Park-Garage-SportOdds` (`xpdiwyxnnrmyvpcqwuyb`). DraBornOdds için oluşturulan bütün tablo, görünüm, indeks, politika ve fonksiyon adları `dbo_` ile ayrılmıştır. Mevcut DraBornPark/Garage tabloları değiştirilmez.

Temel tablolar: `dbo_site_collectors`, `dbo_matches`, `dbo_source_matches`, `dbo_odds_history`, `dbo_collector_runs`, `dbo_teams`, `dbo_team_aliases`, `dbo_team_stats`, `dbo_match_analysis`, `dbo_predictions`, `dbo_generated_coupons`, `dbo_user_preferences`, `dbo_app_config`.

GitHub Actions collector akışı her saatin 07/37. dakikasında otomatik, gerektiğinde `workflow_dispatch` ile manuel çalışır. Normal kod pushları collector’ı gereksiz yere tetiklemez. Supabase service role anahtarı GitHub’a yazılmaz; workflow kısa ömürlü GitHub OIDC kimliği alır ve `dbo-ingest-odds` Edge Function yalnızca `DrabornEagle/DraBornOdds` ana dalını kabul eder.

Uygulama arayüzünde sağ üstte backend/Supabase rozeti gösterilmez. Kullanıcıya teknik servis adı yerine **Fikstür akışı** ve **1X2 oran akışı** durumu gösterilir.

## Analiz matematiği

1X2 için önce doğrulanmış kaynak oranları birleştirilir. Her seçim için `q = 1 / oran`; ardından bookmaker marjını normalize etmek için `p = q / (q1 + qX + q2)` uygulanır. Risk profilleri kesin sonuç iddiası değildir; seçimleri hedef olasılık/risk aralığına yakınlığa göre sıralar. Toplam oran seçim oranlarının çarpımıdır; birleşik piyasa olasılığı seçim olasılıklarının çarpımıdır ve bağımsızlık varsayımı taşır.

v0.2 doğrulanmamış form, sakatlık, hava, xG, geçmiş skor veya eksik 1X2 oranı üretmez. Bu alanlar için güvenilir ayrı veri hattı kurulana kadar analize katılmaz.

## Rapor snapshot’ları

Rapor oluşturulduğunda kullanılan gerçek maç/oran/olasılık verisi cihazda snapshot olarak saklanır. Böylece oran daha sonra değişse veya maç bültenden kalksa bile geçmiş rapor değişmez. v0.1 demo kayıtları v0.2 depolamasına taşınmaz.

## Termux + Expo Go 58

```bash
pkg install -y nodejs-lts curl unzip
curl -fL https://raw.githubusercontent.com/DrabornEagle/DraBornOdds/main/scripts/dkd-termux-install.sh -o "$HOME/dkd-odds-install.sh"
bash "$HOME/dkd-odds-install.sh"
```

Aynı telefonda Expo Go → Enter URL: `exp://127.0.0.1:8081`. Sonraki açılış:

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
```

Son iki doğrulama farklı amaç taşır: Expo export Android JavaScript paketinin derlenebilirliğini kontrol eder ve APK üretmez; fixture smoke testi ise gerçek Turkish Super Lig veri kaynağının en az bir geçerli gelecek karşılaşması döndürdüğünü denetler. v0.2 CI web export veya web deploy yapmaz.

Görünür sürüm: **DKD_draborneagle_v0.2** · Expo SDK 58 · Android **versionCode 1**.
