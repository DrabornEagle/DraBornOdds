# DraBornOdds v0.2 çalışma kaydı

- v0.1 geri dönüş noktası: `74b4f28930d5c0d51439c155a36fbb2cbd51cff8`; yedek dal: `backup/v0.1-2026-09-17`.
- v0.2: uygulama sürümü `0.2.0`, Android versionCode `1`, Expo Go / SDK 58 hedefi korunuyor.
- Demo maç/takım/oran veri seti kaldırıldı; uygulamada sahte fallback yok.
- Supabase: `DraBorn-Park-Garage-SportOdds` projesinde yalnızca `dbo_` nesneleri oluşturuldu; diğer proje verilerine dokunulmadı.
- Core ve analysis migration’ları uygulandı; RLS/grant ve DraBornOdds FK indeksleri denetlendi.
- Nesine, Misli, Bilyoner, Tuttur public-web collector sistemi ve `dbo_odds_history` ingest hattı kuruldu.
- GitHub OIDC doğrulamalı `dbo-ingest-odds` Edge Function aktif; kalıcı service key GitHub’a konmadı.
- Maç isim eşleştirme, oran normalizasyonu, kaynak sayısı/kalite skoru, dört risk profili ve açıklama katmanı hazır.
- Uygulama Supabase canlı verisini okuyor; doğrulanamayan kaynaklar maç üretmiyor.
- Kaydedilen raporlar canlı maç/oran snapshot’ını kendi içinde saklıyor; v0.1 demo kayıtları v0.2’ye taşınmıyor.
- GitHub collector workflow’u ana dal güncellemesinde ve 30 dakikada bir çalışacak şekilde ayarlandı.
- v0.2 doğrulama workflow’u web build/deploy yapmıyor; TypeScript, domain testleri, Expo paket kontrolü ve Android JS export çalıştırıyor. APK üretilmiyor.
