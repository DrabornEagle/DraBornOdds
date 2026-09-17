# DraBornOdds · v0.4 · versionCode 1

DraBornOdds demo maç veya sahte oran kullanmaz. Expo Go 58.0.0 uygulaması gerçek futbol verisini public-web kaynaklarından toplar; ücretli spor/odds API’si kullanılmaz. TFF herkese açık sayfası Süper Lig fikstür yedeğidir. Geniş futbol bülteni ve doğrulanmış oran marketleri `DraBorn-Park-Garage-SportOdds` Supabase projesindeki yalnızca `dbo_` ad alanına alınır. APK/AAB henüz üretilmez.

## v0.4 gerçek veri akışı

Public futbol bülteni → maç/takım/tarih eşleştirme → erişilebilir oran marketlerini sınıflandırma → `dbo_odds_history` → tamamlanmış market gruplarında bookmaker marjını normalize etme → `dbo_match_analysis` → Düşük Risk / Dengeli / Yüksek Getiri / Ultra Getiri → açıklamalı analiz raporu.

17 Eylül 2026 v0.4 canlı doğrulama turunda collector tek çalışmada **126 güncel karşılaşma ve 2.710 oran seçimi** ayrıştırdı. Parser kimliği **`dbo_v0.4.0`** olarak Supabase sağlık kaydına işlendi. Bülten içeriği değiştikçe bu sayılar doğal olarak değişir. Oranlar **10 market grubunda** doğrulandı: Maç Sonucu, Toplam Gol Alt/Üst, İlk Yarı Toplam Gol, Karşılıklı Gol, Çifte Şans, İlk Yarı Sonucu, Tek/Çift, Gol Aralığı, Doğru Skor ve İlk Yarı/Maç Sonucu.

Analiz motorunun olasılık ürettiği normalize aileler: **1/X/2, tamamlanmış Alt/Üst çizgileri, İlk Yarı Alt/Üst, KG Var/Yok, Çifte Şans, İlk Yarı 1/X/2, Tek/Çift ve dört seçenekli Gol Aralığı**. Doğru Skor ile İlk Yarı/Maç Sonucu gibi çok geniş marketler gerçek ham oran olarak maç detayındaki “Tüm oranlar” bölümünde gösterilir; eksik/örtüşen grup olasılığı uydurulmaz ve otomatik kupona sokulmaz.

Nesine / Misli / Bilyoner / Tuttur doğrudan collector’ları da korunur. Bir kaynak CAPTCHA/bot koruması döndürürse koruma aşılmaz. Son doğrulamada açık bülten hattı çalışırken Nesine, Bilyoner ve Tuttur koruma katmanında; Misli ise erişilebilir fakat doğrulanabilir 1X2 yapısı ayrıştırılamadığı için degraded durumdaydı. Bu durumlar kaynak değiştikçe collector sağlık kaydında güncellenir.

## Oran hareketi

v0.4 ile maç detayına **Oran hareketi** sekmesi eklendi. Uygulama seçili karşılaşmanın son 6 saatlik `dbo_odds_history` snapshot’larını talep üzerine çeker; her market/seçim için ilk görülen oran, güncel oran, minimum, maksimum, snapshot sayısı ve yüzdesel fiyat değişimini hesaplar. En çok değişen seçimler üstte gösterilir.

Bu özellik yalnızca geçmiş collector snapshot’larını özetler. Oranın düşmesi veya yükselmesi kendi başına takım haberi, sonuç olasılığı veya bahis sinyali sayılmaz. Hareket özeti otomatik kupon modeline gizlice eklenmez; model ve ham piyasa verisi ayrımı korunur.

## Analiz yaklaşımı

Tamamlayıcı market gruplarında bookmaker marjı kaldırılır. Örneğin 1X2 için `q = 1/oran`, ardından `p = q / Σq`; iki yönlü Alt/Üst, KG Var/Yok ve Tek/Çift için aynı no-vig mantığı kendi tamamlayıcı grubunda uygulanır. İlk Yarı 1/X/2 üç yönlü normalize edilir. Gol Aralığı ancak 0-1, 2-3, 4-5 ve 6+ seçeneklerinin dördü de varsa normalize edilir. Çifte şans olasılığı normalize 1X2 bileşenlerinden türetilir.

Akıllı analiz motoru her oranlı maçtaki **yalnızca normalize edilebilir** marketleri tarar ve veri kalite skoru + piyasa olasılığı + oran seviyesi + seçilen risk profili bileşimini sıralar. Düşük risk profili daha yüksek olasılık/kaliteye; yüksek ve ultra profiller daha yüksek oran ve belirsizliğe daha fazla ağırlık verir. Bu sıralama istatistiksel karar desteğidir; kesin sonuç veya kazanç garantisi değildir.

Maç detayında geniş oran seti ve oran hareketi talep üzerine yüklenir; böylece ana ekran her karşılaşmanın yüzlerce ham/geçmiş oranını gereksiz yere indirmez. Analiz için oranı olmayan TFF fikstürleri görünür kalır ancak kupona alınmaz. Rapor oluşturulduğunda kullanılan maç/oran/olasılık snapshot’ı cihazda saklanır.

Uygulama ana veri akışında yalnızca son **75 dakika** içinde collector tarafından görülmüş maç ve oranları canlı kabul eder. Böylece bültenden düşmüş veya eski kalmış oranların aktif analizde uzun süre görünmesi engellenir; collector normalde 30 dakikada bir çalıştığı için bir geçici çalışma kaçırılsa bile veri hattı gereksiz yere kapanmaz.

## Supabase izolasyonu, saklama ve güvenlik

Proje: `DraBorn-Park-Garage-SportOdds` (`xpdiwyxnnrmyvpcqwuyb`). DraBornOdds nesneleri `dbo_` ile izoledir. Temel tablolar: `dbo_site_collectors`, `dbo_matches`, `dbo_source_matches`, `dbo_odds_history`, `dbo_collector_runs`, `dbo_teams`, `dbo_team_aliases`, `dbo_team_stats`, `dbo_match_analysis`, `dbo_predictions`, `dbo_generated_coupons`, `dbo_user_preferences`, `dbo_app_config`.

GitHub Actions collector her saatin 07/37. dakikasında ve manuel çalışır; collector veya workflow kodu değiştiğinde parser hemen doğrulanır. Büyük bülten Edge Function kaynak limitine takılmaması için 10 maçlık ingestion batch’lerine bölünür. Batch’ler toplam kaynak maç sayısını da taşır; bu nedenle `dbo_site_collectors.dbo_last_match_count` son küçük batch’i değil gerçek toplamı gösterir. Son doğrulamada `iddaa_public` sağlık kaydı **126 maç** olarak doğru biçimde saklandı.

Oran geçmişinin sınırsız büyüyerek Supabase depolamasını tüketmemesi için `dbo_v04_odds_history_retention` migration’ı eklendi. `pg_cron` her saatin 23. dakikasında `dbo_cleanup_history()` çalıştırır; **72 saatten eski oran snapshot’larını** ve **30 günden eski collector run kayıtlarını** temizler. Temizleme için `dbo_collected_at` zaman indeksi vardır. Fonksiyon `anon` ve `authenticated` rollerine açık değildir; yalnızca `postgres`/`service_role` çalıştırabilir. İlk manuel doğrulamada 72 saat sınırının dışında kalan oran satırı 0 olarak kontrol edildi.

`dbo_odds_history` istemci tarafında yalnızca SELECT için RLS ile `anon`/`authenticated` erişimine açıktır; oran hareketi ekranı publishable key ile salt-okunur sorgu yapar. GitHub’da kalıcı service-role anahtarı tutulmaz. Kısa ömürlü GitHub OIDC kimliği kullanılır ve `dbo-ingest-odds` yalnızca `DrabornEagle/DraBornOdds` reposunun `main` ref’ini kabul eder. Edge Function’ın platform JWT kontrolü özel GitHub OIDC doğrulaması kullanıldığı için kapalıdır; fonksiyon kendi içinde issuer + audience + repository + ref denetimini yapar.

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

CI; kilitli bağımlılık kurulumu, TypeScript, domain testleri, oran hareketi özet testleri, Expo SDK 58 paket uyumu ve Android JavaScript export’unu kontrol eder. Expo export APK üretmez; Android paketinin Expo Go/Metro tarafında derlenebilirliğini doğrular. TFF smoke gerçek fikstür HTML’ini, public bulletin smoke ise geniş oran ayrıştırıcısını doğrular.

Görünür sürüm: **DKD_draborneagle_v0.4** · Expo SDK 58 · Android **versionCode 1**.
