# DraBornOdds · v0.2 · versionCode 1

DraBornOdds artık demo fikstür kullanmaz. Expo Go 58.0.0 üzerinde çalışan uygulama, gerçek web collector verilerini `DraBorn-Park-Garage-SportOdds` Supabase projesindeki yalnızca `dbo_` ad alanından okur. Bu aşamada APK/AAB üretilmez ve web sürümü deploy edilmez.

## Gerçek veri akışı

Nesine / Misli / Bilyoner / Tuttur → bağımsız `dbo_` collector → takım/maç eşleştirme → 1X2 oran normalizasyonu → `dbo_odds_history` → `dbo_match_analysis` / `dbo_predictions` → Düşük Risk / Dengeli / Yüksek Getiri / Ultra Getiri → açıklamalı analiz raporu.

Spor verisi API’si kullanılmaz. Collector’lar herkese açık web sayfalarını doğrudan tarar; CAPTCHA, bot koruması veya erişim engeli aşılmaz. Bir kaynak doğrulanabilir yapılandırılmış 1X2 verisi vermiyorsa maç uydurulmaz ve uygulamada görünmez. Bilyoner/Tuttur gibi engel döndüren kaynaklar `blocked`, erişilip ayrıştırılamayan kaynaklar `degraded` olarak kaydedilir.

## Supabase izolasyonu

Kullanılan proje: `DraBorn-Park-Garage-SportOdds` (`xpdiwyxnnrmyvpcqwuyb`). DraBornOdds için oluşturulan bütün tablo, görünüm, indeks, politika ve fonksiyon adları `dbo_` ile ayrılmıştır. Mevcut DraBornPark/Garage tabloları değiştirilmez.

Temel tablolar: `dbo_site_collectors`, `dbo_matches`, `dbo_source_matches`, `dbo_odds_history`, `dbo_collector_runs`, `dbo_teams`, `dbo_team_aliases`, `dbo_team_stats`, `dbo_match_analysis`, `dbo_predictions`, `dbo_generated_coupons`, `dbo_user_preferences`, `dbo_app_config`.

GitHub Actions collector akışı `main` güncellemesinde ve her saatin 07/37. dakikasında çalışır. Supabase service role anahtarı GitHub’a yazılmaz; workflow kısa ömürlü GitHub OIDC kimliği alır ve `dbo-ingest-odds` Edge Function yalnızca `DrabornEagle/DraBornOdds` ana dalını kabul eder.

## Analiz matematiği

1X2 için önce kaynak oranları birleştirilir. Her seçim için `q = 1 / oran`; ardından bookmaker marjını normalize etmek için `p = q / (q1 + qX + q2)` uygulanır. Risk profilleri kesin sonuç iddiası değildir; seçimleri hedef olasılık/risk aralığına yakınlığa göre sıralar. Toplam oran seçim oranlarının çarpımıdır; birleşik piyasa olasılığı seçim olasılıklarının çarpımıdır ve bağımsızlık varsayımı taşır.

v0.2 doğrulanmamış form, sakatlık, hava, xG veya geçmiş skor üretmez. Bu alanlar için güvenilir ayrı veri hattı kurulana kadar analize katılmaz.

## Rapor snapshot’ları

Rapor oluşturulduğunda kullanılan gerçek maç/oran/olasılık verisi cihazda snapshot olarak saklanır. Böylece collector oranı daha sonra değiştirse veya maç bültenden kalksa bile geçmiş rapor değişmez. v0.1 demo kayıtları v0.2 depolamasına taşınmaz.

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
```

Son komut APK üretmez; yalnızca Expo/Android JavaScript paketinin derlenebilirliğini kontrol eder. v0.2 CI web export veya web deploy yapmaz.

Görünür sürüm: **DKD_draborneagle_v0.2** · Expo SDK 58 · Android **versionCode 1**.
