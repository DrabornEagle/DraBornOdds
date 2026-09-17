# DraBornOdds · v0.5 · versionCode 1

DraBornOdds demo maç veya sahte oran kullanmaz. Expo Go 58.0.0 uygulaması gerçek futbol verisini public-web kaynaklarından toplar; ücretli spor/odds API’si kullanılmaz. TFF herkese açık sayfası Süper Lig fikstür yedeğidir. Geniş futbol bülteni ve doğrulanmış oran marketleri `DraBorn-Park-Garage-SportOdds` Supabase projesindeki yalnızca `dbo_` ad alanına alınır. APK/AAB henüz üretilmez.

## v0.5 gerçek veri akışı

Public futbol bülteni → maç/takım/tarih eşleştirme → erişilebilir oran marketlerini sınıflandırma → `dbo_odds_history` → tamamlanmış market gruplarında bookmaker marjını normalize etme → risk/getiri profiline göre olasılık + oran + veri kalitesi + market çeşitliliği sıralaması → açıklamalı analiz raporu.

17 Eylül 2026 canlı doğrulama turunda collector tek çalışmada **126 güncel karşılaşma ve 2.710 oran seçimi** ayrıştırdı. Bülten içeriği değiştikçe bu sayılar değişebilir. Oranlar 10 grupta toplandı: Maç Sonucu, Toplam Gol Alt/Üst, İlk Yarı Toplam Gol, Karşılıklı Gol, Çifte Şans, İlk Yarı Sonucu, Tek/Çift, Gol Aralığı, Doğru Skor ve İlk Yarı/Maç Sonucu.

Nesine / Misli / Bilyoner / Tuttur doğrudan collector’ları da korunur. Bir kaynak CAPTCHA/bot koruması döndürürse koruma aşılmaz. Açık bülten hattı çalışırken engellenen veya ayrıştırılamayan kaynakların sağlık durumu ayrıca saklanır.

## Risk dengesi ve market çeşitliliği

v0.5 risk motoru yalnızca “oran ne kadar yüksekse o kadar iyi” yaklaşımını kullanmaz. Düşük Risk, Dengeli, Yüksek Getiri ve Ultra Getiri için ayrı olasılık/oran hedef bantları vardır. Seçim hedef olasılıktan uzaklaştıkça, profilin oran bandını aştıkça veya aşırı longshot hâline geldikçe sıralama cezası artar. Böylece **4-5 Gol / 6+ Gol gibi çok düşük olasılıklı dev oranların Yüksek ve Ultra profiline tek başına hakim olması engellenir**.

Kupon oluşturma artık tek tek maçların en yüksek oranlı seçimini bağımsız seçmekle yetinmez. Aynı market ailesi kupona tekrar tekrar girdikçe çeşitlilik cezası uygulanır; benzer kalite ve riskte 1X2, Alt/Üst, KG, Çifte Şans, İlk Yarı, Gol Aralığı ve İY/MS gibi farklı doğrulanmış market aileleri yarışır. Aynı maç kupona yine yalnızca bir kez girebilir.

Risk kartları rapor oluşturulmadan önce o anki filtre, maç sayısı ve gerçek oranlarla her profil için **tahmini birleşik gerçekleşme olasılığı + toplam oran** önizlemesi gösterir. Rapor ekranındaki birleşik değer de “Tahmini Gerçekleşme Olasılığı” olarak gösterilir. Çok küçük fakat sıfır olmayan olasılıklar `%0,0` diye kaybolmaz; adaptif ondalık basamak kullanılır.

Bu olasılıklar gerçek oranlardan bookmaker marjı temizlenerek türetilen piyasa bazlı tahminlerdir. Kesin sonuç veya kazanç garantisi değildir; birleşik hesap seçimlerin bağımsız olduğu varsayımını kullanır.

## İY/MS ve normalize marketler

Analiz motorunun normalize edebildiği aileler: **1/X/2, tamamlanmış Alt/Üst çizgileri, İlk Yarı Alt/Üst, KG Var/Yok, Çifte Şans, İlk Yarı 1/X/2, Tek/Çift, dört seçenekli Gol Aralığı ve tam dokuz seçenekli İY/MS**.

İY/MS için `1/1, 1/X, 1/2, X/1, X/X, X/2, 2/1, 2/X, 2/2` seçeneklerinin dokuzu da mevcutsa dokuzlu grubun bookmaker marjı birlikte temizlenir ve market otomatik analize katılır. 17 Eylül doğrulamasında son 75 dakikalık canlı veride İY/MS bulunan **17 maçın 17’sinde de dokuz seçeneğin tamamı** mevcuttu. Örneğin `İY/MS 1/2`, ilk yarı ev sahibi üstün / maç sonucu deplasman üstün senaryosudur; kaynakta ayrı “ikinci yarı sonucu” marketi yoksa uygulama bunu uydurmaz.

Doğru skor gibi çok geniş veya eksik/örtüşen gruplar gerçek ham oran olarak maç detayında gösterilebilir ancak tamamlayıcı market seti doğrulanmadıkça otomatik kupon olasılığına sokulmaz.

## Oran hareketi

Maç detayındaki **Oran hareketi** sekmesi seçili karşılaşmanın son 6 saatlik `dbo_odds_history` snapshot’larını talep üzerine çeker; her market/seçim için ilk görülen oran, güncel oran, minimum, maksimum, snapshot sayısı ve yüzdesel fiyat değişimini hesaplar. Oran hareketi tek başına sonuç sinyali sayılmaz ve otomatik kupon modeline gizlice eklenmez.

Ana veri akışı yalnızca son **75 dakika** içinde collector tarafından görülmüş maç ve oranları canlı kabul eder. `dbo_odds_history` depolamasının sınırsız büyümemesi için 72 saatten eski oran snapshot’ları, collector kayıtlarında ise 30 günden eski satırlar zamanlanmış cleanup ile temizlenir.

## Supabase izolasyonu ve güvenlik

DraBornOdds nesneleri yalnızca `dbo_` ad alanındadır. GitHub Actions collector her saatin 07/37. dakikasında ve manuel çalışır. Büyük bülten güvenli ingestion batch’lerine ayrılır. GitHub’da kalıcı service-role anahtarı tutulmaz; `dbo-ingest-odds` GitHub OIDC issuer + audience + repository + main ref kontrolü yapar. `dbo_odds_history` istemciye RLS üzerinden yalnızca salt-okunur sunulur.

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

v0.5 CI; kilitli bağımlılık kurulumu, TypeScript, **18 domain/regresyon testi**, Expo SDK 58 paket uyumu ve Android JavaScript export’unu kontrol eder. Regresyon testleri özellikle aşırı longshot seçimini, market ailesi çeşitliliğini ve sıfır olmayan küçük olasılıkların `%0,0` gösterilmemesini denetler. Expo export APK üretmez.

Görünür sürüm: **DKD_draborneagle_v0.5** · Expo SDK 58 · Android **versionCode 1**.
