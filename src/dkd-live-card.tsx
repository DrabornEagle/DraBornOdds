import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from './dkd-ui';
import { dkd_dateFromIso } from './dkd-live';
import { dkd_modelMarkets } from './dkd-engine';
import { dkd_useStore } from './dkd-store';
import type { dkd_Match } from './dkd-types';

export function dkd_LiveMatchCard(dkd_props:{dkd_match:dkd_Match;dkd_featured?:boolean}){
  const dkd_match=dkd_props.dkd_match;
  const dkd_store=dkd_useStore();
  const dkd_pickMarkets=dkd_modelMarkets(dkd_match);
  if(dkd_pickMarkets.length>0)return <dkd.MatchCard dkd_match={{...dkd_match,dkd_markets:dkd_pickMarkets}} dkd_featured={dkd_props.dkd_featured}/>;
  const dkd_favorite=dkd_store.dkd_stored.dkd_favorites.includes(dkd_match.dkd_id);
  return <dkd.Card dkd_style={{borderColor:dkd_props.dkd_featured?'#435A39':dkd_colors.line}}>
    <dkd.Row dkd_between><dkd.Row dkd_gap={7}><dkd_RN.View style={{width:6,height:6,borderRadius:3,backgroundColor:dkd_match.dkd_color}}/><dkd.Text dkd_size={12} dkd_color={dkd_match.dkd_color} dkd_bold>{dkd_match.dkd_league}</dkd.Text></dkd.Row><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_dateFromIso(dkd_match.dkd_startAt)} · {dkd_match.dkd_time}</dkd.Text></dkd.Row>
    <dkd.Row><dkd_RN.Pressable accessibilityRole="button" accessibilityLabel={`${dkd_match.dkd_home.dkd_name} – ${dkd_match.dkd_away.dkd_name} fikstür detayı`} onPress={()=>dkd_Router.router.push(`/match/${dkd_match.dkd_id}`)} style={{flex:1,gap:12}}>{[dkd_match.dkd_home,dkd_match.dkd_away].map(dkd_team=><dkd.Row key={dkd_team.dkd_id}><dkd.Crest dkd_team={dkd_team} dkd_size={35}/><dkd.Text dkd_bold dkd_style={{flex:1}}>{dkd_team.dkd_name}</dkd.Text></dkd.Row>)}</dkd_RN.Pressable><dkd.IconButton dkd_label={dkd_favorite?'Favoriden çıkar':'Favorilere ekle'} dkd_icon="star" dkd_active={dkd_favorite} dkd_color={dkd_favorite?dkd_colors.yellow:dkd_colors.muted} dkd_onPress={()=>dkd_store.dkd_toggleFavorite(dkd_match.dkd_id)}/></dkd.Row>
    <dkd_RN.View style={{backgroundColor:dkd_colors.raised,borderRadius:13,padding:12,gap:5}}><dkd.Row dkd_gap={7}><dkd.Icon dkd_name="check" dkd_size={16} dkd_color={dkd_colors.blue}/><dkd.Text dkd_size={12} dkd_bold dkd_color={dkd_colors.blue}>GERÇEK FİKSTÜR DOĞRULANDI</dkd.Text></dkd.Row><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>Normalize edilebilir tam oran grubu henüz doğrulanmadı. Eksik market tahmini yapılmaz; veri tamamlanınca analiz otomatik açılır.</dkd.Text></dkd_RN.View>
    <dkd_RN.Pressable accessibilityRole="button" accessibilityLabel="Fikstür detayını aç" onPress={()=>dkd_Router.router.push(`/match/${dkd_match.dkd_id}`)} style={{minHeight:36,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><dkd.Row dkd_gap={6}><dkd.Icon dkd_name="calendar" dkd_size={14} dkd_color={dkd_colors.lime}/><dkd.Text dkd_size={12} dkd_color={dkd_colors.lime}>Karşılaşma detayını aç</dkd.Text></dkd.Row><dkd.Icon dkd_name="arrow" dkd_size={16} dkd_color={dkd_colors.lime}/></dkd_RN.Pressable>
  </dkd.Card>;
}
