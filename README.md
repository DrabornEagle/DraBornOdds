# DraBornOdds · v0.6 · versionCode 1

DraBornOdds demo maç veya sahte oran kullanmaz. Expo Go 58.0.0 uygulaması gerçek futbol verisini public-web kaynaklarından toplar; ücretli spor/odds API’si kullanılmaz. TFF herkese açık sayfası Süper Lig fikstür yedeğidir. Geniş futbol bülteni ve doğrulanmış oran marketleri `DraBorn-Park-Garage-SportOdds` Supabase projesindeki yalnızca `dbo_` ad alanına alınır. APK/AAB henüz üretilmez.

## v0.6 gerçek veri akışı

Public futbol bülteni → maç/takım/tarih eşleştirme → erişilebilir oran marketlerini sınıflandırma → `dbo_odds_history` → tamamlanmış market gruplarında bookmaker marjını normalize etme → risk/getiri profiline göre olasılık + oran + veri kalitesi + market çeşitliliği sıralaması → seçim bazlı tahminler → genel seçim ortalaması + ayrı birlikte-gerçekleşme hesabı → açıklamalı analiz raporu.

17 Eylül 2026 canlı doğrulamasında **126 güncel karşılaşmanın 126’sında taze oran** ve toplam **2.710 güncel oran satırı** bulunuyor. Piyasa kapsamı Maç Sonucu, Toplam Gol Alt/Üst, İlk Yarı Toplam Gol, Karşılıklı Gol, Çifte Şans, İlk Yarı Sonucu, Tek/Çift, Gol Aralığı, Doğru Skor ve İlk Yarı/Maç Sonucu gruplarını içeriyor. Bülten değiştikçe sayılar doğal olarak değişebilir.

Nesine / Misli / Bilyoner / Tuttur doğrudan collector’ları korunur. CAPTCHA/bot koruması aşılmaz. Açık bülten hattı çalışırken engellenen veya ayrıştırılamayan kaynakların sağlık durumu ayrıca saklanır.

## Genel kupon tahmini: seçim ortalaması

v0.6 raporundaki büyük **Genel Kupon Tahmini** değeri, kupondaki seçimlerin normalize tahmini gerçekleşme yüzdelerinin aritmetik ortalamasıdır. Beş seçim varsa beş yüzde toplanıp 5’e bölünür. Böylece örneğin tek tek seçimler yaklaşık %30 bandındayken ana raporda anlamsız biçimde %0,12 gibi görünen bir “genel güven” etiketi kullanılmaz.

Matematiksel olarak bütün seçimlerin aynı anda gerçekleşmesi farklı bir sorudur. Bu nedenle eski çarpım hesabı silinmedi: raporda **Tüm Seçimler Birlikte** adıyla ikinci ve açıkça ayrılmış bir metrik olarak gösterilir. Bu değer seçim olasılıklarının çarpımıdır, bağımsızlık varsayar ve maç sayısı arttıkça doğal olarak çok hızlı küçülür. Genel seçim ortalaması tüm kuponun aynı anda tutma olasılığı değildir.

Builder risk kartları da artık profil önizlemesinde `Ort. %... · Oran ...` gösterir. Paylaşım metni ortalama güven ile birlikte-gerçekleşme hesabını ayrı satırlarda taşır. Her iki değer de karar desteğidir; sonuç veya kazanç garantisi değildir.

## Keşfet: animasyonlu veri görünümü

Keşfet ana ekranına hafif React Native animasyonlarıyla **Canlı Analiz Radarı** eklendi. Güncel normalize market aileleri gerçek uygulama verisinden sayılır, en yoğun beş aile animasyonlu yatay çubuklarla gösterilir. Canlı veri başlığında düşük maliyetli nabız animasyonu bulunur. Risk kartlarında profil hedef güven seviyelerini görselleştiren animasyonlu mini çubuklar vardır. Kullanıcının uygulama içi hareket/animasyon ayarı kapalıysa bu animasyonlar statik gösterilir.

Grafikler dekoratif sahte veri kullanmaz; o anda cihazda bulunan gerçek normalize market dağılımından hesaplanır.

## Risk dengesi ve market çeşitliliği

Düşük Risk, Dengeli, Yüksek Getiri ve Ultra Getiri için ayrı olasılık/oran hedef bantları vardır. Seçim hedef olasılıktan uzaklaştıkça, profilin oran bandını aştıkça veya aşırı longshot hâline geldikçe sıralama cezası artar. Böylece **4-5 Gol / 6+ Gol gibi çok düşük olasılıklı dev oranların Yüksek ve Ultra profiline tek başına hakim olması engellenir**.

Aynı market ailesi kupona tekrar tekrar girdikçe çeşitlilik cezası uygulanır; benzer kalite ve riskte 1X2, Alt/Üst, KG, Çifte Şans, İlk Yarı, Gol Aralığı ve İY/MS gibi farklı doğrulanmış market aileleri yarışır. Aynı maç kupona yalnızca bir kez girebilir.

## İY/MS ve normalize marketler

Analiz motorunun normalize edebildiği aileler: **1/X/2, tamamlanmış Alt/Üst çizgileri, İlk Yarı Alt/Üst, KG Var/Yok, Çifte Şans, İlk Yarı 1/X/2, Tek/Çift, dört seçenekli Gol Aralığı ve tam dokuz seçenekli İY/MS**.

İY/MS için `1/1, 1/X, 1/2, X/1, X/X, X/2, 2/1, 2/X, 2/2` seçeneklerinin dokuzu da mevcutsa dokuzlu grubun bookmaker marjı birlikte temizlenir ve market otomatik analize katılır. Güncel doğrulamada **17 maçta eksiksiz dokuzlu İY/MS** bulunuyor. `İY/MS 1/2`, ilk yarı ev sahibi üstün / maç sonucu deplasman üstün senaryosudur; ayrı “ikinci yarı sonucu” marketi değildir ve kaynakta bulunmayan market uydurulmaz.

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

v0.6 CI; kilitli bağımlılık kurulumu, TypeScript, domain/regresyon testleri, Expo SDK 58 paket uyumu ve Android JavaScript export’unu kontrol eder. Regresyonlar seçim ortalamasının doğru hesaplanmasını, birlikte-gerçekleşme metriğinin ayrı korunmasını, aşırı longshot seçimini, market çeşitliliğini ve küçük yüzdelerin görünürlüğünü denetler. Expo export APK üretmez.

Görünür sürüm: **DKD_draborneagle_v0.6** · Expo SDK 58 · Android **versionCode 1**.
