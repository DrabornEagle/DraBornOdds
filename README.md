# DraBornOdds · v0.1

**Expo Go 58 için Türkçe spor analizi ve kupon arayüzü demosu.** Koyu lacivert, limon yeşili, mavi, mor ve mercan renkleri; hafif animasyonlar, etkileşimli maç kartları ve açıklanabilir kupon senaryoları.

Veritabanı, Supabase, API anahtarı, üyelik, ödeme ve canlı veri bağlantısı yok. APK/AAB veya EAS derlemesi yapılmaz. Takım isimleri dışındaki fikstür, oran, form, geçmiş, saha ve hava verileri **kurgusaldır**. Kazanç garantisi veya gerçek maç tahmini sunulmaz.

## Telefonda hızlı kurulum · Termux

Expo Go uygulamanda **Supported SDKs: 58** görünmeli. Kaynak ZIP olarak kurulur; Git, Python veya bilgisayar gerekmez. Daha önce aynı klasör varsa tarihli yedeği korunur.

```bash
pkg install -y nodejs-lts curl unzip
curl -fL https://raw.githubusercontent.com/DrabornEagle/DraBornOdds/main/scripts/dkd-termux-install.sh -o "$HOME/dkd-odds-install.sh"
bash "$HOME/dkd-odds-install.sh"
```

Metro hazır olduğunda aynı telefonda Expo Go → URL gir / Enter URL:

```text
exp://127.0.0.1:8081
```

Expo Go giriş isterse Expo hesabına giriş yap. Termux'u kapatma; Xiaomi pil yönetiminde Termux için arka plan çalışmasına izin ver. İlk paket indirme internet ister; maç/analiz verileri uygulamanın içindedir. Expo Go geliştirme oturumunda Metro bağlantısı gerekir.

Sonraki açılışlar:

```bash
cd ~/projects/DraBornOdds
npm start -- --port 8081
```

Başka cihazdan aynı Wi-Fi üzerinden denemek için `npm run start:lan`; Expo Go'da terminalin gösterdiği QR/URL kullanılır. `127.0.0.1` yalnızca Metro ile Expo Go **aynı telefondayken** kullanılır.

## Neler var?

| Ekran | Çalışan özellikler |
|---|---|
| Keşfet | Hareketli saha, günün odağı, risk profili kısayolları, favori maç |
| Maçlar | 36 demo maç / 6 lig, Türkçe arama, tarih ve lig filtreleri, favoriler |
| Maç analizi | 1/X/2 olasılıkları, xG, form, demo hava/saha, örnek geçmiş, 8 market, oran seçimi |
| Kupon | Akıllı veya elle seçim, 1–6 maç, en az 50 TL, 4 risk profili, alternatif üretimi |
| Kupon raporu | Seçim gerekçeleri, birleşik olasılık, toplam oran, brüt/net dönüş, duyarlılık aralığı |
| Kayıtlar | Cihazda 50 rapora kadar saklama, filtre, yeniden açma, silme |
| Profil | Animasyon/titreşim ayarları, cihazdaki verileri sıfırlama |
| Model notları | Formüller, kullanılan/kullanılmayan veriler ve varsayımlar |

Bir maç kuponda yalnızca bir kez yer alır. Aynı maçtan başka market seçilirse önceki seçim değiştirilir. Alt sınırdan küçük veya geçersiz TL tutarı ve yetersiz maç filtresi açıklayıcı hata verir. Kupon oluşturma/saklama, gerçek bahis oynamaz.

## SDK 58 ve kurulum notu

- Expo: **58.0.0-preview.2** (SDK 58 beta), React Native: **0.88.0-rc.0**, React: **19.2.3**.
- Expo Go Android 58.0.0 / SDK 58 hedeflenmiştir. Eski SDK 55–57'ye düşürülmez.
- Native paketler kurulu Expo paketinin `bundledNativeModules.json` eşlemesine göre seçildi; `package-lock.json` repoya dahildir.
- SDK 58 beta / React Native RC nedeniyle bazı paketlerin peer aralıkları henüz RC sürümünü kapsamıyor. `.npmrc` içindeki `legacy-peer-deps=true` npm çözümleyicisinin bu metadata çakışmasını aşar; native sürümler ayrıca Expo ile kontrol edilir. `expo.install.exclude` veya runtime sürümünü gizleyen bir ayar yoktur.
- Node **22.13+ (22.x), 24.3+ (24.x) veya 26+** kullan. Tercih: Node 24 LTS. `expo@latest` çalıştırma; bu komut SDK 58 beta yerine başka bir SDK kurabilir.
- [SDK 58 beta duyurusu](https://expo.dev/changelog/sdk-58-beta) · [Resmî Expo paket eşlemeleri](https://github.com/expo/expo/blob/main/packages/expo/bundledNativeModules.json)

## Veri ve mimari

`src/dkd-data.ts` demo kaynağı, `src/dkd-engine.ts` saf hesaplamalar, `src/dkd-store.tsx` uygulama durumu, `src/dkd-ui.tsx` ortak arayüzdür. Ekranlar `app/` içinde Expo Router ile ayrılmıştır. Uygulamaya ait adlar `dkd_` / `dkd.` düzenindedir; framework tarafından zorunlu adlar bundan muaftır.

Android'de kayıtlar `expo-file-system` ile uygulama alanındaki küçük bir JSON dosyasına yazılır. Web'de localStorage kullanılır. SQL/SQLite/AsyncStorage/Supabase kullanılmaz. Kayıt şeması doğrulanır; bozuk raporlar yüklenmez. Yalnızca kaydedilmiş raporlar, favoriler ve ayarlar kalıcıdır. Taslak ve kaydedilmeyen raporlar yeniden açılışta temizlenir. Birden çok cihaz senkronizasyonu yoktur.

Demo tarihleri uygulama açıldığı günün Türkiye takvimine göre oluşturulur. Eski raporların örnek oranları değişmez; sonraki gün açıldığında maç ayrıntılarının tarihinin göreli olduğu açıklanır. Sonuç kazanıldı/kaybedildi şeklinde uydurulmaz.

Modelin brüt dönüşü: **tutar × oranların çarpımı**. Birleşik olasılık: **tekil olasılıkların çarpımı**, bağımsızlık varsayımıyla. ±7 yüzde puanlık aralık yalnızca duyarlılık örneğidir; doğrulanmış güven aralığı değildir. Hava, eksikler ve geçmiş skorlar bu sürümde hesapta kullanılmaz.

## Geliştirici doğrulaması

```bash
npm ci
npm run typecheck
npm test
npm run check:sdk
npm run export:android
npm run export:web
npm run test:ui
```

`export:android` yalnızca JavaScript/Hermes varlıklarını paketler; APK üretmez. Arayüz testi gerçek web paketini JSDOM'da çalıştırarak gezinme/kupon/kayıt akışlarını doğrular. Piksel doğruluğu, Android native render, cihaz titreşimi ve Android paylaşım penceresi bu testle doğrulanmış sayılmaz. Fiziksel cihaz kontrolü Expo Go'da yapılmalıdır.

GitHub Actions her `main` yüklemesinde TypeScript, hesaplama testleri, SDK kontrolü, Android/web JavaScript paketleme ve arayüz senaryo testlerini çalıştırır. Yayın, mağaza gönderimi, APK veya Supabase işlemi yoktur.

## Expo Go deneme listesi

1. Ana sayfa ve alt sekmeler açılıyor mu; Android geri tuşu önceki ekrana dönüyor mu?
2. Maç arama/lig/tarih/favori filtresi; boş sonuç ekranı çalışıyor mu?
3. Maç detayında genel bakış, istatistik ve oranlar sekmeleri açılıyor mu?
4. Aynı maçtan iki market seçildiğinde tek seçim kalıyor mu?
5. 1 ve 6 maç, dört risk profili, 49 TL hata ve 50 TL başarı durumlarını dene.
6. Raporu kaydet; Expo Go'yu kapat/aç, kayıtlar ve favoriler kalıyor mu?
7. Paylaşım, kayıt silme, vazgeçme ve tüm demo verilerini sıfırlama çalışıyor mu?
8. Animasyonu kapat; telefonun hareketi azalt ve büyük yazı ayarlarında kontrol et.

Görünür sürüm: **DKD_draborneagle_v0.1**. Gerçek Supabase/veri entegrasyonu demo onayından sonraki ayrı aşamadır.
