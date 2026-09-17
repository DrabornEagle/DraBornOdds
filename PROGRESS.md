# DraBornOdds v0.5 çalışma kaydı

- v0.1 geri dönüş noktası: `74b4f28930d5c0d51439c155a36fbb2cbd51cff8`; yedek dal: `backup/v0.1-2026-09-17`.
- v0.2: `0.2.0`, Android versionCode `1`, Expo Go / SDK 58; APK/AAB yok.
- Demo maç/oran tamamen kaldırıldı; sahte veri veya sentetik fallback yok.
- `DraBorn-Park-Garage-SportOdds` içinde yalnızca `dbo_` nesneleri kullanılıyor; diğer proje verilerine dokunulmuyor.
- API kullanılmıyor. TFF `pageID=198` public HTML, Süper Lig fikstür yedeği olarak scraping ile okunuyor.
- Geniş public futbol bülteni collector’ı eklendi. 17.09.2026 canlı smoke: **157 maç / 1.543 oran seçimi**.
- Aktif market kapsamı: 1X2, 2.5/3.5 Alt-Üst, Çifte Şans, KG Var-Yok, İlk Yarı 1X2. Generic `dbo_market_key + dbo_selection_key + dbo_line` şeması daha fazla markete hazır.
- Nesine/Misli/Bilyoner/Tuttur doğrudan collector’ları korunuyor; CAPTCHA/bot koruması aşılmıyor.
- `dbo-ingest-odds` Edge Function GitHub OIDC ile korunuyor; GitHub’da service-role anahtarı yok.
- Edge ingest çoklu marketleri toplu yazar, 1X2 no-vig analizini ve market genişliğine duyarlı kalite skorunu üretir. Büyük bülten workflow’da güvenli batch’lere bölünür.
- Uygulama Supabase’den çoklu marketleri okuyor; tamamlayıcı gruplarda no-vig olasılık, çifte şansta normalize 1X2 bileşimi kullanılıyor.
- Akıllı kupon motoru yalnızca 1X2 değil tüm doğrulanmış marketleri veri kalitesi + olasılık + oran + risk profiline göre sıralıyor. Aynı maç kupona bir kez girer.
- Maç detayında market grupları ayrı listeleniyor; oran/olasılık/veri kalitesi görünür. Fixture-only maç analiz dışı kalır.
- Ana sayfa artık toplam maç, oranlı maç ve doğrulanmış market seçim sayısını gösterir. Sağ üst backend/Supabase rozeti kaldırılmıştır.
- Builder, filtre içindeki gerçek analiz edilebilir maç ve market sayısını gösterir; “0 1X2” eski mesajları kaldırılmıştır.
- Domain testlerine wide-market low-risk seçimi ve fixture-only dışlama regresyonları eklendi.
- TFF fixture smoke ve public bulletin smoke GitHub Actions üzerinde gerçek kaynak erişimini doğrular.
- Collector her saatin 07/37. dakikasında ve manuel çalışır; collector parser değişince ayrıca hemen çalışır.
- Ana CI: npm locked install, TypeScript, domain tests, Expo SDK check, Android JS export. Web deploy yok.
- Sonuçlar kesinlik/kazanç garantisi olarak sunulmaz; oran-temelli piyasa olasılığı ve veri kalite sıralamasıdır.

- v0.5: risk profillerine olasılık/oran bantları ve aşırı longshot cezası eklendi; benzer seçimlerde market ailesi çeşitliliği uygulanıyor.
- Tam 9 seçenekli İY/MS marketi artık no-vig normalize edilerek otomatik analize girebilir; eksik grup uydurulmaz.
- Builder her risk profili için önceden tahmini birleşik olasılık + toplam oran gösterir; çok küçük olasılıklar %0,0 diye yuvarlanmaz.
