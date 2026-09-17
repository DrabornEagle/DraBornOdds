import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from './dkd-ui';
import { dkd_dateFromIso } from './dkd-live';
import { dkd_decimal, dkd_modelMarkets } from './dkd-engine';
import { dkd_rankAnalysisMarkets } from './dkd-analysis';
import { dkd_TeamLogo } from './dkd-team-logo';
import { dkd_useStore } from './dkd-store';
import type { dkd_Market, dkd_Match } from './dkd-types';

const dkd_marketColors=[dkd_colors.lime,dkd_colors.purple,dkd_colors.blue];

function dkd_TeamSide({dkd_match,dkd_side}:{dkd_match:dkd_Match;dkd_side:'home'|'away'}){
  const dkd_team=dkd_side==='home'?dkd_match.dkd_home:dkd_match.dkd_away;
  return <dkd_RN.View style={{flex:1,alignItems:'center',gap:8,minWidth:0}}>{dkd_React.createElement(dkd_TeamLogo,{dkd_team,dkd_size:52})}<dkd.Text dkd_size={13} dkd_bold dkd_lines={2} dkd_style={{textAlign:'center'}}>{dkd_team.dkd_name}</dkd.Text></dkd_RN.View>;
}

function dkd_MarketButton({dkd_match,dkd_market,dkd_index}:{dkd_match:dkd_Match;dkd_market:dkd_Market;dkd_index:number}){
  const dkd_store=dkd_useStore();
  const dkd_selected=dkd_store.dkd_draft.some(dkd_pick=>dkd_pick.dkd_matchId===dkd_match.dkd_id&&dkd_pick.dkd_marketKey===dkd_market.dkd_key);
  const dkd_color=dkd_marketColors[dkd_index%dkd_marketColors.length]??dkd_colors.lime;
  return <dkd_RN.Pressable accessibilityRole="button" accessibilityState={{selected:dkd_selected}} accessibilityLabel={`${dkd_market.dkd_label} ${dkd_decimal(dkd_market.dkd_odds)} analize ekle`} onPress={()=>dkd_store.dkd_select({dkd_matchId:dkd_match.dkd_id,dkd_marketKey:dkd_market.dkd_key})} style={{flex:1,minHeight:60,borderRadius:16,paddingHorizontal:11,paddingVertical:9,backgroundColor:dkd_selected?dkd_color:dkd_color+'12',borderWidth:1,borderColor:dkd_selected?dkd_color:dkd_color+'42',justifyContent:'center',gap:2}}><dkd.Text dkd_size={10} dkd_color={dkd_selected?dkd_colors.bg:dkd_color} dkd_bold>{dkd_market.dkd_short}</dkd.Text><dkd.Text dkd_size={17} dkd_color={dkd_selected?dkd_colors.bg:dkd_colors.text} dkd_bold>{dkd_decimal(dkd_market.dkd_odds)}</dkd.Text></dkd_RN.Pressable>;
}

export function dkd_LiveMatchCard({dkd_match,dkd_featured}:{dkd_match:dkd_Match;dkd_featured?:boolean}){
  const dkd_store=dkd_useStore();
  const dkd_markets=dkd_modelMarkets(dkd_match);
  const dkd_display=dkd_markets.length?dkd_rankAnalysisMarkets(dkd_match).slice(0,3):[];
  const dkd_favorite=dkd_store.dkd_stored.dkd_favorites.includes(dkd_match.dkd_id);
  const dkd_accent=dkd_match.dkd_color||dkd_colors.lime;
  return <dkd_RN.View style={{borderRadius:24,overflow:'hidden',backgroundColor:dkd_colors.card,borderWidth:1,borderColor:dkd_featured?dkd_accent+'90':dkd_colors.line}}>
    <dkd_RN.View style={{height:4,backgroundColor:dkd_accent}}/>
    <dkd_RN.View pointerEvents="none" style={{position:'absolute',width:170,height:170,borderRadius:85,right:-70,top:-60,backgroundColor:dkd_accent+'0D'}}/>
    <dkd_RN.View style={{padding:16,gap:15}}>
      <dkd.Row dkd_between><dkd.Badge dkd_color={dkd_accent} dkd_icon="ball">{dkd_match.dkd_league.toLocaleUpperCase('tr-TR')}</dkd.Badge><dkd.Row dkd_gap={8}><dkd_RN.View style={{alignItems:'flex-end'}}><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted}>{dkd_dateFromIso(dkd_match.dkd_startAt)}</dkd.Text><dkd.Text dkd_size={13} dkd_bold>{dkd_match.dkd_time}</dkd.Text></dkd_RN.View><dkd.IconButton dkd_label={dkd_favorite?'Favoriden çıkar':'Favorilere ekle'} dkd_icon="star" dkd_active={dkd_favorite} dkd_color={dkd_favorite?dkd_colors.yellow:dkd_colors.muted} dkd_onPress={()=>dkd_store.dkd_toggleFavorite(dkd_match.dkd_id)}/></dkd.Row></dkd.Row>
      <dkd_RN.Pressable accessibilityRole="button" accessibilityLabel={`${dkd_match.dkd_home.dkd_name} – ${dkd_match.dkd_away.dkd_name} maç analizini aç`} onPress={()=>dkd_Router.router.push(`/match/${dkd_match.dkd_id}`)} style={{flexDirection:'row',alignItems:'center',gap:10}}>{dkd_React.createElement(dkd_TeamSide,{dkd_match,dkd_side:'home'})}<dkd_RN.View style={{alignItems:'center',gap:4}}><dkd_RN.View style={{width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center',backgroundColor:dkd_accent+'18',borderWidth:1,borderColor:dkd_accent+'40'}}><dkd.Text dkd_size={11} dkd_bold dkd_color={dkd_accent}>VS</dkd.Text></dkd_RN.View><dkd.Text dkd_size={9} dkd_color={dkd_colors.muted}>MAÇ</dkd.Text></dkd_RN.View>{dkd_React.createElement(dkd_TeamSide,{dkd_match,dkd_side:'away'})}</dkd_RN.Pressable>
      {!!dkd_display.length?<><dkd.Row dkd_between><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted} dkd_bold>ANALİZ MOTORUNUN ÖNE ÇIKARDIKLARI</dkd.Text><dkd.Text dkd_size={10} dkd_color={dkd_colors.lime}>{dkd_markets.length} seçim</dkd.Text></dkd.Row><dkd.Row dkd_gap={8}>{dkd_display.map((dkd_market,dkd_index)=>dkd_React.createElement(dkd_MarketButton,{key:dkd_market.dkd_key,dkd_match,dkd_market,dkd_index}))}</dkd.Row></>:<dkd_RN.View style={{borderRadius:16,padding:13,backgroundColor:dkd_colors.blue+'0E',borderWidth:1,borderColor:dkd_colors.blue+'30'}}><dkd.Row dkd_gap={8}><dkd.Icon dkd_name="clock" dkd_size={16} dkd_color={dkd_colors.blue}/><dkd_RN.View style={{flex:1}}><dkd.Text dkd_size={11} dkd_bold dkd_color={dkd_colors.blue}>FİKSTÜR HAZIR · ORAN BEKLENİYOR</dkd.Text><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted}>Karşılaşma gerçek fikstürde doğrulandı. Eksik oran üretilmeden analiz hattı beklemede.</dkd.Text></dkd_RN.View></dkd.Row></dkd_RN.View>}
      <dkd_RN.Pressable accessibilityRole="button" onPress={()=>dkd_Router.router.push(`/match/${dkd_match.dkd_id}`)} style={{minHeight:42,borderRadius:13,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:dkd_accent+'0D'}}><dkd.Row dkd_gap={7}><dkd.Icon dkd_name="chart" dkd_size={15} dkd_color={dkd_accent}/><dkd.Text dkd_size={12} dkd_bold dkd_color={dkd_accent}>{dkd_display.length?'Neden bu oranlar?':'Karşılaşma detayları'}</dkd.Text></dkd.Row><dkd.Icon dkd_name="arrow" dkd_size={17} dkd_color={dkd_accent}/></dkd_RN.Pressable>
    </dkd_RN.View>
  </dkd_RN.View>;
}
