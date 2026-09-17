import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from '../../src/dkd-ui';
import { dkd_LiveMatchCard } from '../../src/dkd-live-card';
import { dkd_useStore } from '../../src/dkd-store';
import { dkd_risks } from '../../src/dkd-engine';
import type { dkd_Risk } from '../../src/dkd-types';

const dkd_liveCard={MatchCard:dkd_LiveMatchCard};

function dkd_AnimatedBar({dkd_value,dkd_max,dkd_color,dkd_motion}:{dkd_value:number;dkd_max:number;dkd_color:string;dkd_motion:boolean}){
  const dkd_progress=dkd_React.useRef(new dkd_RN.Animated.Value(dkd_motion?0:1)).current;
  const dkd_ratio=Math.max(.04,Math.min(1,dkd_value/Math.max(1,dkd_max)));
  dkd_React.useEffect(()=>{dkd_progress.stopAnimation();dkd_progress.setValue(dkd_motion?0:1);if(dkd_motion)dkd_RN.Animated.timing(dkd_progress,{toValue:1,duration:700,useNativeDriver:false}).start();return()=>dkd_progress.stopAnimation();},[dkd_progress,dkd_motion,dkd_value,dkd_max]);
  return <dkd_RN.View style={{height:7,borderRadius:99,backgroundColor:dkd_colors.line,overflow:'hidden'}}><dkd_RN.Animated.View style={{height:7,borderRadius:99,backgroundColor:dkd_color,width:dkd_progress.interpolate({inputRange:[0,1],outputRange:['0%',`${Math.round(dkd_ratio*100)}%`]})}}/></dkd_RN.View>;
}

function dkd_LivePulse({dkd_motion}:{dkd_motion:boolean}){
  const dkd_pulse=dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  dkd_React.useEffect(()=>{if(!dkd_motion){dkd_pulse.setValue(1);return;}const dkd_loop=dkd_RN.Animated.loop(dkd_RN.Animated.sequence([dkd_RN.Animated.timing(dkd_pulse,{toValue:1,duration:850,useNativeDriver:true}),dkd_RN.Animated.timing(dkd_pulse,{toValue:0,duration:850,useNativeDriver:true})]));dkd_loop.start();return()=>dkd_loop.stop();},[dkd_motion,dkd_pulse]);
  return <dkd_RN.View style={{width:16,height:16,alignItems:'center',justifyContent:'center'}}><dkd_RN.Animated.View style={{position:'absolute',width:16,height:16,borderRadius:8,backgroundColor:dkd_colors.lime,opacity:dkd_pulse.interpolate({inputRange:[0,1],outputRange:[.08,.24]}),transform:[{scale:dkd_pulse.interpolate({inputRange:[0,1],outputRange:[.75,1.45]})}]}}/><dkd_RN.View style={{width:7,height:7,borderRadius:4,backgroundColor:dkd_colors.lime}}/></dkd_RN.View>;
}

function dkd_SignalField({dkd_motion,dkd_matches,dkd_oddsReady}:{dkd_motion:boolean;dkd_matches:number;dkd_oddsReady:number}){
  const dkd_spin=dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  const dkd_pulse=dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  dkd_React.useEffect(()=>{
    dkd_spin.stopAnimation();dkd_pulse.stopAnimation();
    if(!dkd_motion){dkd_spin.setValue(.12);dkd_pulse.setValue(1);return;}
    dkd_spin.setValue(0);dkd_pulse.setValue(0);
    const dkd_spinLoop=dkd_RN.Animated.loop(dkd_RN.Animated.timing(dkd_spin,{toValue:1,duration:4200,useNativeDriver:true}));
    const dkd_pulseLoop=dkd_RN.Animated.loop(dkd_RN.Animated.sequence([dkd_RN.Animated.timing(dkd_pulse,{toValue:1,duration:900,useNativeDriver:true}),dkd_RN.Animated.timing(dkd_pulse,{toValue:0,duration:900,useNativeDriver:true})]));
    dkd_spinLoop.start();dkd_pulseLoop.start();return()=>{dkd_spinLoop.stop();dkd_pulseLoop.stop();};
  },[dkd_motion,dkd_spin,dkd_pulse]);
  return <dkd.Card dkd_style={{padding:0,overflow:'hidden',borderColor:'#334A5D'}}>
    <dkd_RN.View style={{height:154,alignItems:'center',justifyContent:'center'}}>
      <dkd_RN.View style={{position:'absolute',width:230,height:230,borderRadius:115,backgroundColor:'#0D1728',opacity:.65}}/>
      {[124,88,52].map((dkd_size,dkd_index)=><dkd_RN.View key={dkd_size} style={{position:'absolute',width:dkd_size,height:dkd_size,borderRadius:dkd_size/2,borderWidth:1,borderColor:dkd_index===0?'#35506B':dkd_index===1?'#334958':'#3E5744'}}/>)}
      <dkd_RN.Animated.View style={{position:'absolute',width:124,height:124,transform:[{rotate:dkd_spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']})}]}}><dkd_RN.View style={{position:'absolute',top:-4,left:57,width:10,height:10,borderRadius:5,backgroundColor:dkd_colors.blue}}/><dkd_RN.View style={{position:'absolute',bottom:10,right:7,width:7,height:7,borderRadius:4,backgroundColor:dkd_colors.purple}}/></dkd_RN.Animated.View>
      <dkd_RN.Animated.View style={{width:42,height:42,borderRadius:21,backgroundColor:dkd_colors.lime,alignItems:'center',justifyContent:'center',opacity:dkd_pulse.interpolate({inputRange:[0,1],outputRange:[.72,1]}),transform:[{scale:dkd_pulse.interpolate({inputRange:[0,1],outputRange:[.9,1.08]})}]}}><dkd.Icon dkd_name="bolt" dkd_size={23} dkd_color={dkd_colors.bg}/></dkd_RN.Animated.View>
      <dkd_RN.View style={{position:'absolute',left:14,top:13}}><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted} dkd_bold>SİNYAL TARAMA</dkd.Text><dkd.Text dkd_size={18} dkd_bold dkd_color={dkd_colors.lime}>AKTİF</dkd.Text></dkd_RN.View>
      <dkd_RN.View style={{position:'absolute',right:14,bottom:13,alignItems:'flex-end'}}><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted}>{dkd_matches} fikstür</dkd.Text><dkd.Text dkd_size={11} dkd_bold dkd_color={dkd_oddsReady?dkd_colors.lime:dkd_colors.yellow}>{dkd_oddsReady?`${dkd_oddsReady} oranlı maç`:'oran doğrulaması sürüyor'}</dkd.Text></dkd_RN.View>
    </dkd_RN.View>
  </dkd.Card>;
}

const dkd_widgets={AnimatedBar:dkd_AnimatedBar,LivePulse:dkd_LivePulse,SignalField:dkd_SignalField};

export default function dkd_HomeScreen(){
  const dkd_store=dkd_useStore();
  const dkd_matches=dkd_store.dkd_matches;
  const dkd_leagues=new Set(dkd_matches.map(dkd_match=>dkd_match.dkd_league)).size;
  const dkd_oddsReady=dkd_matches.filter(dkd_match=>dkd_match.dkd_markets.length>=3).length;
  const dkd_marketCount=dkd_matches.reduce((dkd_sum,dkd_match)=>dkd_sum+dkd_match.dkd_markets.filter(dkd_market=>dkd_market.dkd_modelEligible!==false).length,0);
  const dkd_fixtureReady=dkd_matches.length>0;
  const dkd_focus=[...dkd_matches].sort((dkd_a,dkd_b)=>(dkd_b.dkd_markets.length>0?1:0)-(dkd_a.dkd_markets.length>0?1:0)||dkd_b.dkd_quality-dkd_a.dkd_quality||new Date(dkd_a.dkd_startAt).getTime()-new Date(dkd_b.dkd_startAt).getTime());
  const dkd_groupMap=new Map<string,number>();for(const dkd_match of dkd_matches)for(const dkd_market of dkd_match.dkd_markets)if(dkd_market.dkd_modelEligible!==false){const dkd_group=dkd_market.dkd_group||'Diğer';dkd_groupMap.set(dkd_group,(dkd_groupMap.get(dkd_group)??0)+1);}
  const dkd_groupColors=[dkd_colors.lime,dkd_colors.blue,dkd_colors.purple,dkd_colors.yellow,dkd_colors.coral];
  const dkd_groups=[...dkd_groupMap.entries()].sort((dkd_a,dkd_b)=>dkd_b[1]-dkd_a[1]).slice(0,5);
  const dkd_groupMax=Math.max(1,...dkd_groups.map(dkd_item=>dkd_item[1]));
  return <dkd.Page>
    <dkd.Reveal><dkd.Row><dkd_widgets.LivePulse dkd_motion={dkd_store.dkd_motion}/><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted} dkd_bold dkd_style={{letterSpacing:1.4}}>CANLI VERİ MERKEZİ</dkd.Text></dkd.Row><dkd.Text dkd_size={32} dkd_bold dkd_style={{marginTop:10,lineHeight:39}}>Oyunu gör.{'\n'}<dkd_RN.Text style={{color:dkd_colors.lime}}>Veriyi konuştur.</dkd_RN.Text></dkd.Text><dkd.Text dkd_size={14} dkd_color={dkd_colors.muted} dkd_style={{marginTop:9}}>Güncel futbol bülteni ve doğrulanmış market oranları taranır. Analiz motoru mevcut marketleri birlikte değerlendirerek risk profiline uygun seçimleri sıralar.</dkd.Text></dkd.Reveal>
    <dkd_widgets.SignalField dkd_motion={dkd_store.dkd_motion} dkd_matches={dkd_matches.length} dkd_oddsReady={dkd_oddsReady}/>
    <dkd.Row dkd_gap={9}>{[{v:String(dkd_matches.length),l:'Maç',c:dkd_colors.blue,i:'ball'},{v:String(dkd_oddsReady),l:'Oranlı maç',c:dkd_colors.lime,i:'chart'},{v:String(dkd_marketCount),l:'Analiz seçimi',c:dkd_colors.purple,i:'trophy'}].map(dkd_item=><dkd.Card key={dkd_item.l} dkd_style={{flex:1,padding:12,gap:5,borderRadius:16}}><dkd.Icon dkd_name={dkd_item.i} dkd_size={18} dkd_color={dkd_item.c}/><dkd.Text dkd_size={24} dkd_bold>{dkd_item.v}</dkd.Text><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted}>{dkd_item.l}</dkd.Text></dkd.Card>)}</dkd.Row>
    {!!dkd_groups.length&&<><dkd.Section dkd_title="Canlı analiz radarı" dkd_subtitle="Normalize edilmiş seçimlerin market ailelerine göre güncel dağılımı."/><dkd.Card dkd_style={{gap:13}}>{dkd_groups.map((dkd_item,dkd_index)=>{const dkd_color=dkd_groupColors[dkd_index]??dkd_colors.lime;return <dkd_RN.View key={dkd_item[0]} style={{gap:6}}><dkd.Row dkd_between><dkd.Text dkd_size={11} dkd_bold>{dkd_item[0]}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_color} dkd_bold>{dkd_item[1]}</dkd.Text></dkd.Row><dkd_widgets.AnimatedBar dkd_value={dkd_item[1]} dkd_max={dkd_groupMax} dkd_color={dkd_color} dkd_motion={dkd_store.dkd_motion}/></dkd_RN.View>;})}</dkd.Card></>}
    {dkd_store.dkd_liveState==='error'?<dkd.Empty dkd_title="Canlı veri alınamadı" dkd_body={dkd_store.dkd_liveError||'Bağlantıyı kontrol edip yeniden deneyebilirsin.'} dkd_icon="refresh" dkd_action="Yeniden dene" dkd_onPress={()=>dkd_store.dkd_refreshLive()}/>:!dkd_matches.length?<dkd.Empty dkd_title="Güncel bülten yükleniyor" dkd_body="Fikstür ve oran kaynakları yenileniyor. Doğrulanmamış maç veya sahte oran gösterilmez." dkd_icon="clock" dkd_action="Veriyi yenile" dkd_onPress={()=>dkd_store.dkd_refreshLive()}/>:<><dkd.Section dkd_title={dkd_oddsReady?'Analiz için hazır':'Güncel fikstür'} dkd_subtitle={dkd_oddsReady?`${dkd_oddsReady} oranlı maçta ${dkd_marketCount} doğrulanmış analiz seçimi taranıyor.`:'Güncel karşılaşmalar hazır; oran hattı ayrıca doğrulanıyor.'} dkd_action="Tüm maçlar" dkd_onPress={()=>dkd_Router.router.push('/matches')}/>{dkd_focus.slice(0,3).map((dkd_match,dkd_i)=><dkd_liveCard.MatchCard key={dkd_match.dkd_id} dkd_match={dkd_match} dkd_featured={dkd_i===0}/>)}</>}
    <dkd.Section dkd_title="Ritmini seç" dkd_subtitle={dkd_oddsReady?'Her profil veri kalitesi, tahmini gerçekleşme ve oranı farklı bantlarda dengeler.':'Analiz profilleri doğrulanmış oranı bulunan maçlarda çalışır.'}/><dkd_RN.View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{(Object.keys(dkd_risks) as dkd_Risk[]).map(dkd_key=>{const dkd_risk=dkd_risks[dkd_key];return <dkd_RN.Pressable key={dkd_key} accessibilityRole="button" accessibilityLabel={`${dkd_risk.dkd_name} analiz`} onPress={()=>dkd_Router.router.push({pathname:'/builder',params:{dkd_profile:dkd_key}})} style={{width:'48%',flexGrow:1,backgroundColor:dkd_colors.card,borderWidth:1,borderColor:dkd_colors.line,borderRadius:19,padding:16,gap:10}}><dkd.Icon dkd_name={dkd_risk.dkd_icon} dkd_color={dkd_risk.dkd_color}/><dkd.Text dkd_bold dkd_color={dkd_risk.dkd_color}>{dkd_risk.dkd_name}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_risk.dkd_subtitle}</dkd.Text><dkd_widgets.AnimatedBar dkd_value={Math.round(dkd_risk.dkd_target*100)} dkd_max={100} dkd_color={dkd_risk.dkd_color} dkd_motion={dkd_store.dkd_motion}/></dkd_RN.Pressable>;})}</dkd_RN.View>
    <dkd.Section dkd_title="Veri durumu" dkd_subtitle={`${dkd_leagues} lig/organizasyon · fikstür ve oran akışları bağımsız doğrulanır.`}/>
    <dkd.Card dkd_style={{padding:14,borderRadius:16}}><dkd.Row dkd_between><dkd.Row><dkd.Icon dkd_name="calendar" dkd_size={18} dkd_color={dkd_colors.blue}/><dkd.Text dkd_bold>Bülten akışı</dkd.Text></dkd.Row><dkd.Badge dkd_color={dkd_fixtureReady?dkd_colors.lime:dkd_colors.yellow}>{dkd_fixtureReady?'GÜNCEL':'YENİLENİYOR'}</dkd.Badge></dkd.Row><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_fixtureReady?`${dkd_matches.length} gerçek karşılaşma yüklendi.`:'Güncel karşılaşmalar kontrol ediliyor.'}</dkd.Text></dkd.Card>
    <dkd.Card dkd_style={{padding:14,borderRadius:16}}><dkd.Row dkd_between><dkd.Row><dkd.Icon dkd_name="chart" dkd_size={18} dkd_color={dkd_colors.lime}/><dkd.Text dkd_bold>Oran & market akışı</dkd.Text></dkd.Row><dkd.Badge dkd_color={dkd_oddsReady?dkd_colors.lime:dkd_colors.yellow}>{dkd_oddsReady?'HAZIR':'BEKLENİYOR'}</dkd.Badge></dkd.Row><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_oddsReady?`${dkd_oddsReady} maç · ${dkd_marketCount} normalize seçim analize hazır.`:'Doğrulanmış oranlar geldiğinde analiz otomatik açılır.'}</dkd.Text></dkd.Card>
    <dkd.Button dkd_label="Canlı veriyi yenile" dkd_icon="refresh" dkd_variant="secondary" dkd_onPress={()=>dkd_store.dkd_refreshLive()}/><dkd.Notice dkd_text="Ana rapordaki Genel Kupon Tahmini, seçilen maçların tahmini gerçekleşme oranlarının aritmetik ortalamasıdır. Tüm seçimlerin aynı anda gerçekleşmesine ait çarpım hesabı raporda ayrı gösterilir. Hiçbir seçim kazanç garantisi değildir."/><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted} dkd_style={{textAlign:'center'}}>DraBornEagle ekosistemi · DKD_draborneagle_v0.7</dkd.Text>
  </dkd.Page>;
}
