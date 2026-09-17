import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Haptics from 'expo-haptics';
import { dkd_readStorage, dkd_writeStorage } from './dkd-storage';
import { dkd_defaults, dkd_parseStorage } from './dkd-persistence';
import { dkd_fetchLive, dkd_fixtureDay, dkd_isPlayable } from './dkd-live';
import { dkd_fetchFixtureCache } from './dkd-fixture-cache';
import { dkd_summarize } from './dkd-engine';
import type { dkd_Coupon, dkd_Match, dkd_Pick, dkd_Risk, dkd_SourceStatus, dkd_Stored } from './dkd-types';

function dkd_useStateStore() {
  const [dkd_stored, dkd_setStored] = dkd_React.useState<dkd_Stored>(dkd_defaults);
  const [dkd_loaded, dkd_setLoaded] = dkd_React.useState(false);
  const [dkd_matches, dkd_setMatches] = dkd_React.useState<dkd_Match[]>([]);
  const [dkd_sources, dkd_setSources] = dkd_React.useState<dkd_SourceStatus[]>([]);
  const [dkd_liveState, dkd_setLiveState] = dkd_React.useState<'loading'|'ready'|'error'>('loading');
  const [dkd_liveError, dkd_setLiveError] = dkd_React.useState('');
  const [dkd_liveLoadedAt, dkd_setLiveLoadedAt] = dkd_React.useState('');
  const [dkd_draft, dkd_setDraft] = dkd_React.useState<dkd_Pick[]>([]);
  const [dkd_reports, dkd_setReports] = dkd_React.useState<dkd_Coupon[]>([]);
  const [dkd_toast, dkd_setToast] = dkd_React.useState('');
  const [dkd_reduceMotion, dkd_setReduceMotion] = dkd_React.useState(false);
  const dkd_writeQueue = dkd_React.useRef(Promise.resolve());
  const dkd_toastTimer = dkd_React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dkd_notify = dkd_React.useCallback((dkd_message: string) => {clearTimeout(dkd_toastTimer.current);dkd_setToast(dkd_message);dkd_toastTimer.current=setTimeout(()=>dkd_setToast(''),3200);},[]);
  const dkd_refreshLive=dkd_React.useCallback(async(dkd_silent=false)=>{
    if(!dkd_silent)dkd_setLiveState('loading');
    const dkd_accept=(dkd_newMatches:dkd_Match[],dkd_newSources:dkd_SourceStatus[],dkd_loadedAt:string)=>{const dkd_playable=dkd_newMatches.filter(dkd_match=>dkd_isPlayable(dkd_match));dkd_setMatches(dkd_playable);dkd_setSources(dkd_newSources);dkd_setLiveLoadedAt(dkd_loadedAt);dkd_setLiveError('');dkd_setLiveState('ready');dkd_setDraft(dkd_prev=>dkd_prev.filter(dkd_pick=>dkd_playable.some(dkd_match=>dkd_match.dkd_id===dkd_pick.dkd_matchId)));};
    try{
      const dkd_live=await dkd_fetchLive();
      if(dkd_live.dkd_matches.length){dkd_accept(dkd_live.dkd_matches,dkd_live.dkd_sources,dkd_live.dkd_loadedAt);return;}
      try{const dkd_cache=await dkd_fetchFixtureCache();dkd_accept(dkd_cache.dkd_matches,[dkd_cache.dkd_source,...dkd_live.dkd_sources],dkd_cache.dkd_loadedAt);return;}catch{dkd_accept([],dkd_live.dkd_sources,dkd_live.dkd_loadedAt);return;}
    }catch(dkd_failure){
      try{const dkd_cache=await dkd_fetchFixtureCache();dkd_accept(dkd_cache.dkd_matches,[dkd_cache.dkd_source],dkd_cache.dkd_loadedAt);return;}catch(dkd_cacheFailure){const dkd_primary=dkd_failure instanceof Error?dkd_failure.message:'Canlı veri alınamadı.';const dkd_cache=dkd_cacheFailure instanceof Error?dkd_cacheFailure.message:'Fikstür önbelleği alınamadı.';dkd_setLiveError(`${dkd_primary} ${dkd_cache}`);dkd_setLiveState('error');}
    }
  },[]);
  dkd_React.useEffect(()=>{let dkd_active=true;dkd_readStorage().then(dkd_json=>{if(dkd_active)dkd_setStored(dkd_parseStorage(dkd_json));}).catch(()=>{if(dkd_active)dkd_notify('Cihazdaki kayıtlar okunamadı; yerel tercihler sıfırlandı.');}).finally(()=>{if(dkd_active)dkd_setLoaded(true);});dkd_refreshLive().catch(()=>{});const dkd_pruneTimer=setInterval(()=>{dkd_setMatches(dkd_prev=>dkd_prev.filter(dkd_match=>dkd_isPlayable(dkd_match)));},10000);const dkd_refreshTimer=setInterval(()=>{dkd_refreshLive(true).catch(()=>{});},60000);const dkd_appState=dkd_RN.AppState.addEventListener('change',dkd_state=>{if(dkd_state==='active')dkd_refreshLive(true).catch(()=>{});});dkd_RN.AccessibilityInfo.isReduceMotionEnabled().then(dkd_value=>{if(dkd_active)dkd_setReduceMotion(dkd_value);}).catch(()=>{});const dkd_subscription=dkd_RN.AccessibilityInfo.addEventListener('reduceMotionChanged',dkd_setReduceMotion);return()=>{dkd_active=false;clearInterval(dkd_pruneTimer);clearInterval(dkd_refreshTimer);dkd_appState.remove();dkd_subscription.remove();clearTimeout(dkd_toastTimer.current);};},[dkd_notify,dkd_refreshLive]);
  dkd_React.useEffect(()=>{if(!dkd_loaded)return;const dkd_json=JSON.stringify(dkd_stored);dkd_writeQueue.current=dkd_writeQueue.current.then(()=>dkd_writeStorage(dkd_json)).catch(()=>dkd_notify('Cihaza kaydedilemedi. Bu oturumda kullanmaya devam edebilirsin.'));},[dkd_stored,dkd_loaded,dkd_notify]);
  const dkd_haptic=()=>{if(dkd_stored.dkd_settings.dkd_haptics&&process.env.EXPO_OS!=='web')dkd_Haptics.selectionAsync().catch(()=>{});};
  const dkd_toggleFavorite=(dkd_id:string)=>{dkd_haptic();dkd_setStored(dkd_prev=>({...dkd_prev,dkd_favorites:dkd_prev.dkd_favorites.includes(dkd_id)?dkd_prev.dkd_favorites.filter(dkd_item=>dkd_item!==dkd_id):[...dkd_prev.dkd_favorites,dkd_id]}));};
  const dkd_select=(dkd_pick:dkd_Pick)=>{const dkd_target=dkd_matches.find(dkd_match=>dkd_match.dkd_id===dkd_pick.dkd_matchId);if(!dkd_target||!dkd_isPlayable(dkd_target)){dkd_notify('Bu karşılaşmanın başlama saati geçti; artık kupona eklenemez.');dkd_refreshLive(true).catch(()=>{});return;}const dkd_existing=dkd_draft.find(dkd_item=>dkd_item.dkd_matchId===dkd_pick.dkd_matchId);if(dkd_existing?.dkd_marketKey===dkd_pick.dkd_marketKey){dkd_setDraft(dkd_prev=>dkd_prev.filter(dkd_item=>dkd_item.dkd_matchId!==dkd_pick.dkd_matchId));dkd_notify('Seçim kupondan çıkarıldı.');return;}if(!dkd_existing&&dkd_draft.length>=6){dkd_notify('Bir kupona en fazla 6 farklı maç ekleyebilirsin.');return;}dkd_setDraft(dkd_prev=>[...dkd_prev.filter(dkd_item=>dkd_item.dkd_matchId!==dkd_pick.dkd_matchId),dkd_pick]);dkd_haptic();dkd_notify(dkd_existing?'Bu maçın kupon seçimi değiştirildi.':'Kupona eklendi.');};
  const dkd_createReport=(dkd_picks:dkd_Pick[],dkd_stake:number,dkd_risk:dkd_Risk,dkd_mode:'auto'|'manual')=>{dkd_summarize(dkd_picks,dkd_matches,dkd_stake);const dkd_ids=new Set(dkd_picks.map(dkd_pick=>dkd_pick.dkd_matchId));const dkd_snapshot=dkd_matches.filter(dkd_match=>dkd_ids.has(dkd_match.dkd_id));const dkd_coupon:dkd_Coupon={dkd_id:`dkd_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,dkd_createdAt:new Date().toISOString(),dkd_risk,dkd_stake,dkd_picks:[...dkd_picks],dkd_saved:false,dkd_mode,dkd_fixtureDay:dkd_fixtureDay(),dkd_snapshot};dkd_setReports(dkd_prev=>[dkd_coupon,...dkd_prev].slice(0,20));dkd_haptic();return dkd_coupon.dkd_id;};
  const dkd_saveReport=(dkd_coupon:dkd_Coupon)=>{if(dkd_stored.dkd_coupons.some(dkd_item=>dkd_item.dkd_id===dkd_coupon.dkd_id)){dkd_notify('Bu rapor zaten kayıtlı.');return;}if(dkd_stored.dkd_coupons.length>=50){dkd_notify('50 kayıt sınırına ulaştın. Önce eski bir raporu sil.');return;}dkd_setStored(dkd_prev=>({...dkd_prev,dkd_coupons:[{...dkd_coupon,dkd_saved:true},...dkd_prev.dkd_coupons]}));dkd_notify('Rapor cihazına kaydedildi.');dkd_haptic();};
  return{dkd_stored,dkd_setStored,dkd_loaded,dkd_matches,dkd_sources,dkd_liveState,dkd_liveError,dkd_liveLoadedAt,dkd_refreshLive,dkd_draft,dkd_setDraft,dkd_reports,dkd_toast,dkd_notify,dkd_haptic,dkd_toggleFavorite,dkd_select,dkd_createReport,dkd_saveReport,dkd_motion:dkd_stored.dkd_settings.dkd_motion&&!dkd_reduceMotion,dkd_deleteReport:(dkd_id:string)=>{dkd_setStored(dkd_prev=>({...dkd_prev,dkd_coupons:dkd_prev.dkd_coupons.filter(dkd_item=>dkd_item.dkd_id!==dkd_id)}));dkd_notify('Kayıt silindi.');},dkd_reset:()=>{dkd_setStored(dkd_defaults);dkd_setDraft([]);dkd_setReports([]);dkd_notify('Yerel kayıtlar sıfırlandı.');}};
}
const dkd_Context=dkd_React.createContext<ReturnType<typeof dkd_useStateStore>|null>(null);
export function dkd_Provider(dkd_props:{children:dkd_React.ReactNode}){const dkd_state=dkd_useStateStore();return <dkd_Context.Provider value={dkd_state}>{dkd_props.children}</dkd_Context.Provider>;}
export function dkd_useStore(){const dkd_value=dkd_React.use(dkd_Context);if(!dkd_value)throw new Error('DraBornOdds sağlayıcısı bulunamadı.');return dkd_value;}
