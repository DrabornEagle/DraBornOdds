# DraBornOdds v0.7 çalışma kaydı

- Aktif sürüm: `0.7.0`, görünür etiket `DKD_draborneagle_v0.7`, Android versionCode `1`, Expo Go / SDK 58; APK/AAB yok.
- Demo maç/oran yok; sahte veri veya sentetik oran fallback'i üretilmez.
- `DraBorn-Park-Garage-SportOdds` içinde yalnızca `dbo_` nesneleri kullanılır; diğer proje verilerine dokunulmaz.
- Spor/odds API kullanılmıyor. Geniş gerçek bülten ve oranlar public-web collector hattından Supabase'e alınır; TFF public HTML Süper Lig fikstürü ayrıca doğrudan doğrulanır.
- 17 Eylül 2026 12:56–12:58 TSİ zamanlı collector çalışması başarıyla **129 gerçek maç / 2.705 oran** topladı ve 17 güvenli ingestion batch'i halinde Supabase'e aktardı.
- Nesine/Misli/Bilyoner/Tuttur doğrudan collector'ları korunur; CAPTCHA/bot koruması aşılmaz. Son çalışmada Nesine/Bilyoner/Tuttur korumalı, Misli ayrıştırılamaz durumdaydı; çalışan `iddaa_public` hattı 129 maç sağladı.
- `dbo-ingest-odds` GitHub OIDC ile korunur; GitHub'da kalıcı service-role anahtarı yok.
- v0.7 fikstür dayanıklılığı: TFF public HTML her 30 dakikada GitHub Actions tarafından doğrulanıp yalnızca gerçek tarih/saat/takım alanlarından oluşan `dkd-live-cache` dalına yazılır. Android istemcisi ana canlı akış boş/hatalı olursa bu merkezi gerçek fikstür önbelleğine düşer.
- Merkezi fixture-cache ilk doğrulamasında **9 yaklaşan gerçek Süper Lig karşılaşması** yayınlandı. Oran uydurulmaz; cache yalnızca fikstür sağlar.
- Maçlar sekmesinin varsayılanı `Tüm yaklaşan`; filtreler listeyi boşalttığında kullanıcıya akışta bulunan gerçek maç sayısı ve `Tüm maçları göster` kurtarma düğmesi sunulur.
- Keşfet ekranında görünür animasyon katmanı güçlendirildi: canlı nabız, dönen/pulse yapan **Sinyal Tarama** alanı, gerçek market dağılımından Canlı Analiz Radarı ve risk kartlarında animasyonlu hedef barları bulunur. Hareket ayarı veya sistem Reduce Motion kapalıysa statik gösterilir.
- Profil sürüm metni hard-code değildir; Expo config'teki `version`, `versionCode` ve `extra.dkd_version` alanlarından okunur. Böylece eski `v0.2` etiketi tekrar görünmez.
- Risk motorunda ayrı olasılık/oran hedef bantları, aşırı longshot cezası ve market ailesi çeşitlilik cezası var.
- Rapor ana yüzdesi seçim tahmini gerçekleşme olasılıklarının aritmetik ortalamasıdır (`dkd_averageProbability`). Eski çarpım hesabı `Tüm Seçimler Birlikte` adıyla ayrı tutulur.
- Tam 9 seçenekli İY/MS (`1/1 ... 2/2`) yalnızca grup eksiksizse no-vig normalize edilerek analize katılır; eksik market uydurulmaz.
- Maç detayındaki Oran Hareketi son 6 saatlik gerçek `dbo_odds_history` snapshot'larını özetler; tek başına sonuç sinyali sayılmaz.
- Canlı odds istemcisi tazelik filtresi kullanır; odds history 72 saat, collector run kayıtları 30 gün saklanır.
- v0.7 final CI: locked npm install, TypeScript/domain testleri, Expo SDK 58 paket kontrolü ve Android JS export. APK üretmez.
