import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Haptics from 'expo-haptics';
import { dkd_readStorage, dkd_writeStorage } from './dkd-storage';
import { dkd_defaults, dkd_parseStorage } from './dkd-persistence';
import { dkd_fixtureDay, dkd_matches } from './dkd-data';
import { dkd_summarize } from './dkd-engine';
import type { dkd_Coupon, dkd_Pick, dkd_Risk, dkd_Stored } from './dkd-types';

function dkd_useStateStore() {
  const [dkd_stored, dkd_setStored] = dkd_React.useState<dkd_Stored>(dkd_defaults);
  const [dkd_loaded, dkd_setLoaded] = dkd_React.useState(false);
  const [dkd_draft, dkd_setDraft] = dkd_React.useState<dkd_Pick[]>([]);
  const [dkd_reports, dkd_setReports] = dkd_React.useState<dkd_Coupon[]>([]);
  const [dkd_toast, dkd_setToast] = dkd_React.useState('');
  const [dkd_reduceMotion, dkd_setReduceMotion] = dkd_React.useState(false);
  const dkd_writeQueue = dkd_React.useRef(Promise.resolve());
  const dkd_toastTimer = dkd_React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dkd_notify = dkd_React.useCallback((dkd_message: string) => {
    clearTimeout(dkd_toastTimer.current);
    dkd_setToast(dkd_message);
    dkd_toastTimer.current = setTimeout(() => dkd_setToast(''), 3200);
  }, []);
  dkd_React.useEffect(() => {
    let dkd_active = true;
    dkd_readStorage().then(dkd_json => { if (dkd_active) dkd_setStored(dkd_parseStorage(dkd_json)); })
      .catch(() => { if (dkd_active) dkd_notify('Cihazdaki kayıtlar okunamadı. Demo yeniden açıldı.'); })
      .finally(() => { if (dkd_active) dkd_setLoaded(true); });
    dkd_RN.AccessibilityInfo.isReduceMotionEnabled().then(dkd_value => { if (dkd_active) dkd_setReduceMotion(dkd_value); }).catch(() => {});
    const dkd_subscription = dkd_RN.AccessibilityInfo.addEventListener('reduceMotionChanged', dkd_setReduceMotion);
    return () => { dkd_active = false; dkd_subscription.remove(); clearTimeout(dkd_toastTimer.current); };
  }, [dkd_notify]);
  dkd_React.useEffect(() => {
    if (!dkd_loaded) return;
    const dkd_json = JSON.stringify(dkd_stored);
    dkd_writeQueue.current = dkd_writeQueue.current.then(() => dkd_writeStorage(dkd_json)).catch(() => dkd_notify('Cihaza kaydedilemedi. Bu oturumda kullanmaya devam edebilirsin.'));
  }, [dkd_stored, dkd_loaded, dkd_notify]);
  const dkd_haptic = () => {
    if (dkd_stored.dkd_settings.dkd_haptics && process.env.EXPO_OS !== 'web') dkd_Haptics.selectionAsync().catch(() => {});
  };
  const dkd_toggleFavorite = (dkd_id: string) => {
    dkd_haptic();
    dkd_setStored(dkd_prev => ({...dkd_prev, dkd_favorites: dkd_prev.dkd_favorites.includes(dkd_id) ? dkd_prev.dkd_favorites.filter(dkd_item => dkd_item !== dkd_id) : [...dkd_prev.dkd_favorites, dkd_id]}));
  };
  const dkd_select = (dkd_pick: dkd_Pick) => {
    const dkd_existing = dkd_draft.find(dkd_item => dkd_item.dkd_matchId === dkd_pick.dkd_matchId);
    if (dkd_existing?.dkd_marketKey === dkd_pick.dkd_marketKey) {
      dkd_setDraft(dkd_prev => dkd_prev.filter(dkd_item => dkd_item.dkd_matchId !== dkd_pick.dkd_matchId));
      dkd_notify('Seçim kupondan çıkarıldı.'); return;
    }
    if (!dkd_existing && dkd_draft.length >= 6) { dkd_notify('Bir kupona en fazla 6 farklı maç ekleyebilirsin.'); return; }
    dkd_setDraft(dkd_prev => [...dkd_prev.filter(dkd_item => dkd_item.dkd_matchId !== dkd_pick.dkd_matchId), dkd_pick]);
    dkd_haptic(); dkd_notify(dkd_existing ? 'Bu maçın kupon seçimi değiştirildi.' : 'Kupona eklendi. Kupon sekmesinden inceleyebilirsin.');
  };
  const dkd_createReport = (dkd_picks: dkd_Pick[], dkd_stake: number, dkd_risk: dkd_Risk, dkd_mode: 'auto' | 'manual') => {
    dkd_summarize(dkd_picks, dkd_matches, dkd_stake);
    const dkd_coupon: dkd_Coupon = { dkd_id: `dkd_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, dkd_createdAt: new Date().toISOString(), dkd_risk, dkd_stake, dkd_picks: [...dkd_picks], dkd_saved: false, dkd_mode, dkd_fixtureDay };
    dkd_setReports(dkd_prev => [dkd_coupon, ...dkd_prev].slice(0, 20));
    dkd_haptic(); return dkd_coupon.dkd_id;
  };
  const dkd_saveReport = (dkd_coupon: dkd_Coupon) => {
    if (dkd_stored.dkd_coupons.some(dkd_item => dkd_item.dkd_id === dkd_coupon.dkd_id)) { dkd_notify('Bu rapor zaten kayıtlı.'); return; }
    if (dkd_stored.dkd_coupons.length >= 50) { dkd_notify('50 kayıt sınırına ulaştın. Önce eski bir raporu sil.'); return; }
    dkd_setStored(dkd_prev => ({...dkd_prev, dkd_coupons: [{...dkd_coupon, dkd_saved: true}, ...dkd_prev.dkd_coupons]}));
    dkd_notify('Rapor cihazına kaydedildi.'); dkd_haptic();
  };
  return {
    dkd_stored, dkd_setStored, dkd_loaded, dkd_draft, dkd_setDraft, dkd_reports,
    dkd_toast, dkd_notify, dkd_haptic, dkd_toggleFavorite, dkd_select, dkd_createReport, dkd_saveReport,
    dkd_motion: dkd_stored.dkd_settings.dkd_motion && !dkd_reduceMotion,
    dkd_deleteReport: (dkd_id: string) => { dkd_setStored(dkd_prev => ({...dkd_prev, dkd_coupons: dkd_prev.dkd_coupons.filter(dkd_item => dkd_item.dkd_id !== dkd_id)})); dkd_notify('Kayıt silindi.'); },
    dkd_reset: () => { dkd_setStored(dkd_defaults); dkd_setDraft([]); dkd_setReports([]); dkd_notify('Demo kayıtları sıfırlandı.'); },
  };
}
const dkd_Context = dkd_React.createContext<ReturnType<typeof dkd_useStateStore> | null>(null);
export function dkd_Provider(dkd_props: { children: dkd_React.ReactNode }) {
  const dkd_state = dkd_useStateStore();
  return <dkd_Context.Provider value={dkd_state}>{dkd_props.children}</dkd_Context.Provider>;
}
export function dkd_useStore() {
  const dkd_value = dkd_React.use(dkd_Context);
  if (!dkd_value) throw new Error('DraBornOdds sağlayıcısı bulunamadı.');
  return dkd_value;
}
