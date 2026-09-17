# DraBornOdds · v0.7 · versionCode 1

DraBornOdds demo maç veya sahte oran kullanmaz. Expo Go 58.0.0 uygulaması gerçek futbol verisini public-web kaynaklarından toplar; ücretli spor/odds API'si kullanılmaz. APK/AAB henüz üretilmez.

## v0.7 gerçek veri akışı

Public futbol bülteni → maç/takım/tarih eşleştirme → erişilebilir oran marketlerini sınıflandırma → `dbo_odds_history` → tamamlanmış market gruplarında bookmaker marjını normalize etme → risk/getiri profiline göre olasılık + oran + veri kalitesi + market çeşitliliği sıralaması → seçim bazlı tahminler → genel seçim ortalaması + ayrı birlikte-gerçekleşme hesabı → açıklamalı analiz raporu.

17 Eylül 2026 12:56–12:58 TSİ canlı collector doğrulamasında çalışan açık bülten hattı **129 gerçek karşılaşma ve 2.705 oran** topladı; 17 güvenli batch halinde Supabase `dbo_` tablolarına başarıyla işlendi. Bülten değiştikçe bu sayılar doğal olarak değişir.

Nesine / Misli / Bilyoner / Tuttur doğrudan collector'ları korunur. CAPTCHA/bot koruması aşılmaz. Son çalışmada Nesine, Bilyoner ve Tuttur koruma katmanında; Misli erişilebilir fakat doğrulanabilir yapı ayrıştırılamaz durumdaydı. Çalışan public bülten hattı bu kaynaklardan bağımsızdır.

## Maçlar kaybolmasın: iki katmanlı gerçek fikstür

Ana uygulama önce taze Supabase oran/bülten akışını kullanır. Bu akış cihazda boş veya geçici olarak erişilemezse uygulama artık gerçek TFF public HTML fikstürünün merkezi önbelleğine düşer. GitHub Actions TFF sayfasını yaklaşık 30 dakikada bir yeniden doğrular, tarih/saat/ev/deplasman alanlarını JSON'a dönüştürür ve `dkd-live-cache` dalında yayınlar.

Bu fallback **oran üretmez**. Yalnızca doğrulanmış gerçek fikstürü görünür tutar. Doğrulanmış oran yoksa maç kartı açılır ancak otomatik kupona eklenmez. İlk cache doğrulamasında 9 yaklaşan gerçek Süper Lig karşılaşması yayınlandı.

Maçlar sekmesi varsayılan olarak **Tüm yaklaşan** filtresiyle açılır. Bugün/Yarın, lig, arama veya favori filtresi sonucu sıfıra düşürürse uygulama gerçek akışın kaybolduğunu söylemek yerine kaç maçın mevcut olduğunu gösterir ve **Tüm maçları göster** ile filtreleri tek dokunuşta sıfırlar.

## Keşfet animasyonları

Keşfet ana ekranında hareket ayarı açıkken canlı nabız, dönen/pulse yapan **Sinyal Tarama** alanı, gerçek normalize market dağılımından **Canlı Analiz Radarı** ve dört risk kartında animasyonlu hedef barları bulunur. Bunlar sahte istatistik kullanmaz. Oran akışı yoksa radar market barları doğal olarak oluşmaz; Sinyal Tarama ve canlı nabız yine görünür şekilde çalışır.

Profildeki **Arayüz animasyonları** kapalıysa veya Android Reduce Motion etkinse hareketler statik gösterilir.

## Sürüm tek kaynaktan okunur

Profil ekranındaki sürüm metni artık hard-code değildir. `app.json` içindeki Expo `version`, Android `versionCode` ve `extra.dkd_version` doğrudan okunur. Güncel değerler **v0.7 / DKD_draborneagle_v0.7 / versionCode 1**. Böylece eski v0.2 etiketi kaynakta kalmaz.

## Analiz ve kupon olasılığı

Düşük Risk, Dengeli, Yüksek Getiri ve Ultra Getiri için ayrı olasılık/oran hedef bantları vardır. Aşırı longshot ve aynı market ailesini tekrar seçme cezaları uygulanır. Aynı maç kupona yalnızca bir kez girebilir.

Tamamlanmış 1X2, Alt/Üst, İlk Yarı Alt/Üst, KG, Çifte Şans, İlk Yarı 1/X/2, Tek/Çift, Gol Aralığı ve tam dokuz seçenekli İY/MS grupları normalize edilebilir. İY/MS `1/1 ... 2/2` yalnızca dokuz seçeneğin tamamı gerçek kaynakta mevcutsa analize girer. Eksik market uydurulmaz.

Raporun büyük **Genel Kupon Tahmini** değeri seçimlerin tahmini gerçekleşme olasılıklarının aritmetik ortalamasıdır. Bütün seçimlerin aynı anda gerçekleşmesine ait olasılık çarpımı ayrıca **Tüm Seçimler Birlikte** olarak gösterilir. Ortalama seçim güveni tüm kuponun aynı anda tutma olasılığı değildir; iki değer de kazanç garantisi değildir.

## Güvenlik ve izolasyon

DraBornOdds verileri paylaşılan Supabase projesinde yalnızca `dbo_` ad alanındadır. GitHub Actions collector kalıcı service-role anahtarı taşımaz; ingestion GitHub OIDC issuer + audience + repository + main ref kontrolleriyle korunur. Odds history istemciye RLS üzerinden salt okunur sunulur.

## Termux + Expo Go 58

Güncel sürümü telefonuna temiz ZIP kurulumu ile almak için:

```bash
pkg install -y nodejs-lts curl unzip
curl -fL "https://raw.githubusercontent.com/DrabornEagle/DraBornOdds/main/scripts/dkd-termux-install.sh?$(date +%s)" -o "$HOME/dkd-odds-install.sh"
bash "$HOME/dkd-odds-install.sh"
```

Aynı telefonda Expo Go adresi: `exp://127.0.0.1:8081`. Telefonda `git` gerekmez. Sonraki açılışlar:

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

CI; TypeScript/domain testlerini, Expo SDK 58 paket uyumunu ve Android JavaScript export'unu kontrol eder. Fixture-cache workflow'u ayrıca TFF public HTML'i doğrular. Expo export APK üretmez.

Görünür sürüm: **DKD_draborneagle_v0.7** · Expo SDK 58 · Android **versionCode 1**.
