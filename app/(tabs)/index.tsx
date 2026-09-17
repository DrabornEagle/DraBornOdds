import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from '../../src/dkd-ui';
import { dkd_LiveMatchCard } from '../../src/dkd-live-card';
import { dkd_useStore } from '../../src/dkd-store';
import { dkd_risks } from '../../src/dkd-engine';
import type { dkd_Risk } from '../../src/dkd-types';

function dkd_AnimatedBar({dkd_value,dkd_max,dkd_color,dkd_motion}:{dkd_value:number;dkd_max:number;dkd_color:string;dkd_motion:boolean}){
  const dkd_progress=dkd_React.useRef(new dkd_RN.Animated.Value(dkd_motion?0:1)).current;
  const dkd_ratio=Math.max(.04,Math.min(1,dkd_value/Math.max(1,dkd_max)));
  dkd_React.useEffect(()=>{dkd_progress.stopAnimation();dkd_progress.setValue(dkd_motion?0:1);if(dkd_motion)dkd_RN.Animated.timing(dkd_progress,{toValue:1,duration:720,useNativeDriver:false}).start();return()=>dkd_progress.stopAnimation();},[dkd_progress,dkd_motion,dkd_value,dkd_max]);
  return <dkd_RN.View style={{height:7,borderRadius:99,backgroundColor:dkd_colors.line,overflow:'hidden'}}><dkd_RN.Animated.View style={{height:7,borderRadius:99,backgroundColor:dkd_color,width:dkd_progress.interpolate({inputRange:[0,1],outputRange:['0%',`${Math.round(dkd_ratio*100)}%`]})}}/></dkd_RN.View>;
}

function dkd_LivePulse({dkd_motion}:{dkd_motion:boolean}){
  const dkd_value=dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  dkd_React.useEffect(()=>{if(!dkd_motion){dkd_value.setValue(1);return;}const dkd_loop=dkd_RN.Animated.loop(dkd_RN.Animated.sequence([dkd_RN.Animated.timing(dkd_value,{toValue:1,duration:780,useNativeDriver:true}),dkd_RN.Animated.timing(dkd_value,{toValue:0,duration:780,useNativeDriver:true})]));dkd_loop.start();return()=>dkd_loop.stop();},[dkd_motion,dkd_value]);
  return <dkd_RN.View style={{width:16,height:16,alignItems:'center',justifyContent:'center'}}><dkd_RN.Animated.View style={{position:'absolute',width:16,height:16,borderRadius:8,backgroundColor:dkd_colors.lime,opacity:dkd_value.interpolate({inputRange:[0,1],outputRange:[.07,.25]}),transform:[{scale:dkd_value.interpolate({inputRange:[0,1],outputRange:[.75,1.5]})}]}}/><dkd_RN.View style={{width:7,height:7,borderRadius:4,backgroundColor:dkd_colors.lime}}/></dkd_RN.View>;
}

function dkd_FootballFlow({dkd_motion,dkd_matches,dkd_oddsReady}:{dkd_motion:boolean;dkd_matches:number;dkd_oddsReady:number}){
  const dkd_ball=dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  const dkd_glow=dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  dkd_React.useEffect(()=>{dkd_ball.stopAnimation();dkd_glow.stopAnimation();if(!dkd_motion){dkd_ball.setValue(.55);dkd_glow.setValue(1);return;}dkd_ball.setValue(0);const dkd_ballLoop=dkd_RN.Animated.loop(dkd_RN.Animated.sequence([dkd_RN.Animated.timing(dkd_ball,{toValue:1,duration:2500,useNativeDriver:true}),dkd_RN.Animated.timing(dkd_ball,{toValue:0,duration:2500,useNativeDriver:true})]));const dkd_glowLoop=dkd_RN.Animated.loop(dkd_RN.Animated.sequence([dkd_RN.Animated.timing(dkd_glow,{toValue:1,duration:700,useNativeDriver:true}),dkd_RN.Animated.timing(dkd_glow,{toValue:0,duration:700,useNativeDriver:true})]));dkd_ballLoop.start();dkd_glowLoop.start();return()=>{dkd_ballLoop.stop();dkd_glowLoop.stop();};},[dkd_motion,dkd_ball,dkd_glow]);
  const dkd_players=[{l:'16%',t:'30%',c:dkd_colors.blue},{l:'29%',t:'69%',c:dkd_colors.blue},{l:'43%',t:'23%',c:dkd_colors.blue},{l:'62%',t:'67%',c:dkd_colors.purple},{l:'75%',t:'28%',c:dkd_colors.purple},{l:'86%',t:'58%',c:dkd_colors.purple}] as const;
  return <dkd_RN.View style={{height:174,borderRadius:24,overflow:'hidden',backgroundColor:'#10251F',borderWidth:1,borderColor:'#315448'}}>
    <dkd_RN.View style={{position:'absolute',left:14,right:14,top:15,bottom:15,borderRadius:7,borderWidth:1,borderColor:'#527768'}}/>
    <dkd_RN.View style={{position:'absolute',left:'50%',top:15,bottom:15,width:1,backgroundColor:'#527768'}}/><dkd_RN.View style={{position:'absolute',left:'50%',top:57,marginLeft:-30,width:60,height:60,borderRadius:30,borderWidth:1,borderColor:'#527768'}}/>
    <dkd_RN.View style={{position:'absolute',left:14,top:51,width:38,height:72,borderWidth:1,borderLeftWidth:0,borderColor:'#527768'}}/><dkd_RN.View style={{position:'absolute',right:14,top:51,width:38,height:72,borderWidth:1,borderRightWidth:0,borderColor:'#527768'}}/>
    {dkd_players.map((dkd_player,dkd_index)=><dkd_RN.Animated.View key={dkd_index} style={{position:'absolute',left:dkd_player.l,top:dkd_player.t,width:11,height:11,borderRadius:6,backgroundColor:dkd_player.c,opacity:dkd_glow.interpolate({inputRange:[0,1],outputRange:[.58,1]}),transform:[{scale:dkd_glow.interpolate({inputRange:[0,1],outputRange:[.86,1.14]})}]}}/>)}
    <dkd_RN.View style={{position:'absolute',left:'18%',top:'61%',width:'62%',height:1,backgroundColor:dkd_colors.lime+'55',transform:[{rotate:'-12deg'}]}}/>
    <dkd_RN.Animated.View style={{position:'absolute',left:'19%',top:'55%',width:34,height:34,borderRadius:17,backgroundColor:'#F7F9FF',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:dkd_colors.lime,transform:[{translateX:dkd_ball.interpolate({inputRange:[0,.5,1],outputRange:[0,88,190]})},{translateY:dkd_ball.interpolate({inputRange:[0,.5,1],outputRange:[24,-18,5]})},{rotate:dkd_ball.interpolate({inputRange:[0,1],outputRange:['0deg','720deg']})}]}}><dkd.Icon dkd_name="ball" dkd_size={23} dkd_color="#182522"/></dkd_RN.Animated.View>
    <dkd_RN.View style={{position:'absolute',left:13,top:11,backgroundColor:'#091611D9',borderRadius:11,paddingHorizontal:10,paddingVertical:7}}><dkd.Text dkd_size={9} dkd_color={dkd_colors.muted} dkd_bold>CANLI MAÇ AKIŞI</dkd.Text><dkd.Text dkd_size={14} dkd_color={dkd_colors.lime} dkd_bold>ANALİZ EDİLİYOR</dkd.Text></dkd_RN.View>
    <dkd_RN.View style={{position:'absolute',right:13,bottom:10,alignItems:'flex-end',backgroundColor:'#091611D9',borderRadius:11,paddingHorizontal:10,paddingVertical:7}}><dkd.Text dkd_size={10} dkd_color={dkd_colors.text}>{dkd_matches} maç</dkd.Text><dkd.Text dkd_size={10} dkd_color={dkd_oddsReady?dkd_colors.lime:dkd_colors.yellow} dkd_bold>{dkd_oddsReady} oranlı maç hazır</dkd.Text></dkd_RN.View>
  </dkd_RN.View>;
}

const dkd_widgets={AnimatedBar:dkd_AnimatedBar,LivePulse:dkd_LivePulse,FootballFlow:dkd_FootballFlow};

export default function dkd_HomeScreen(){
  const dkd_store=dkd_useStore(),dkd_matches=dkd_store.dkd_matches;
  const dkd_leagues=new Set(dkd_matches.map(dkd_match=>dkd_match.dkd_league)).size;
  const dkd_oddsReady=dkd_matches.filter(dkd_match=>dkd_modelReady(dkd_match.dkd_markets)).length;
  const dkd_marketCount=dkd_matches.reduce((dkd_sum,dkd_match)=>dkd_sum+dkd_match.dkd_markets.filter(dkd_market=>dkd_market.dkd_modelEligible!==false).length,0);
  const dkd_focus=[...dkd_matches].sort((dkd_a,dkd_b)=>(dkd_b.dkd_markets.length>0?1:0)-(dkd_a.dkd_markets.length>0?1:0)||dkd_b.dkd_quality-dkd_a.dkd_quality||new Date(dkd_a.dkd_startAt).getTime()-new Date(dkd_b.dkd_startAt).getTime());
  const dkd_groups=new Map<string,number>();for(const dkd_match of dkd_matches)for(const dkd_market of dkd_match.dkd_markets)if(dkd_market.dkd_modelEligible!==false){const dkd_name=dkd_market.dkd_group||'Diğer';dkd_groups.set(dkd_name,(dkd_groups.get(dkd_name)??0)+1);}
  const dkd_groupRows=[...dkd_groups.entries()].sort((dkd_a,dkd_b)=>dkd_b[1]-dkd_a[1]).slice(0,5),dkd_groupMax=Math.max(1,...dkd_groupRows.map(dkd_row=>dkd_row[1]));
  const dkd_groupColors=[dkd_colors.lime,dkd_colors.blue,dkd_colors.purple,dkd_colors.yellow,dkd_colors.coral];
  return <dkd.Page>
    <dkd.Reveal><dkd.Row><dkd_widgets.LivePulse dkd_motion={dkd_store.dkd_motion}/><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted} dkd_bold dkd_style={{letterSpacing:1.4}}>CANLI FUTBOL ANALİZİ</dkd.Text></dkd.Row><dkd.Text dkd_size={32} dkd_bold dkd_style={{marginTop:10,lineHeight:39}}>Oyunu gör.{'\n'}<dkd_RN.Text style={{color:dkd_colors.lime}}>Veriyi konuştur.</dkd_RN.Text></dkd.Text><dkd.Text dkd_size={14} dkd_color={dkd_colors.muted} dkd_style={{marginTop:9}}>Gerçek fikstür ve doğrulanmış oranlar aynı maç üzerinde eşleştirilir. Analiz motoru olasılık ile oran seviyesini birlikte değerlendirip öne çıkan marketleri açıklar.</dkd.Text></dkd.Reveal>
    <dkd_widgets.FootballFlow dkd_motion={dkd_store.dkd_motion} dkd_matches={dkd_matches.length} dkd_oddsReady={dkd_oddsReady}/>
    <dkd.Row dkd_gap={9}>{[{v:String(dkd_matches.length),l:'Maç',c:dkd_colors.blue,i:'ball'},{v:String(dkd_oddsReady),l:'Oranlı maç',c:dkd_colors.lime,i:'chart'},{v:String(dkd_marketCount),l:'Analiz seçimi',c:dkd_colors.purple,i:'trophy'}].map(dkd_item=><dkd.Card key={dkd_item.l} dkd_style={{flex:1,padding:12,gap:5,borderRadius:16,borderColor:dkd_item.c+'35'}}><dkd.Icon dkd_name={dkd_item.i} dkd_size={18} dkd_color={dkd_item.c}/><dkd.Text dkd_size={24} dkd_bold>{dkd_item.v}</dkd.Text><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted}>{dkd_item.l}</dkd.Text></dkd.Card>)}</dkd.Row>
    {!!dkd_groupRows.length&&<><dkd.Section dkd_title="Canlı analiz dağılımı" dkd_subtitle="Doğrulanmış market ailelerinin güncel yoğunluğu."/><dkd.Card dkd_style={{gap:13}}>{dkd_groupRows.map((dkd_item,dkd_index)=>{const dkd_color=dkd_groupColors[dkd_index]??dkd_colors.lime;return <dkd_RN.View key={dkd_item[0]} style={{gap:6}}><dkd.Row dkd_between><dkd.Text dkd_size={11} dkd_bold>{dkd_item[0]}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_color} dkd_bold>{dkd_item[1]}</dkd.Text></dkd.Row><dkd_widgets.AnimatedBar dkd_value={dkd_item[1]} dkd_max={dkd_groupMax} dkd_color={dkd_color} dkd_motion={dkd_store.dkd_motion}/></dkd_RN.View>;})}</dkd.Card></>}
    {dkd_store.dkd_liveState==='error'?<dkd.Empty dkd_title="Canlı veri alınamadı" dkd_body={dkd_store.dkd_liveError||'Bağlantıyı kontrol edip yeniden deneyebilirsin.'} dkd_icon="refresh" dkd_action="Yeniden dene" dkd_onPress={()=>dkd_store.dkd_refreshLive()}/>:!dkd_matches.length?<dkd.Empty dkd_title="Güncel bülten yükleniyor" dkd_body="Fikstür ve oran kaynakları yenileniyor. Doğrulanmamış maç veya sahte oran gösterilmez." dkd_icon="clock" dkd_action="Veriyi yenile" dkd_onPress={()=>dkd_store.dkd_refreshLive()}/>:<><dkd.Section dkd_title={dkd_oddsReady?'Öne çıkan maçlar':'Güncel fikstür'} dkd_subtitle={dkd_oddsReady?`${dkd_oddsReady} oranlı maçta ${dkd_marketCount} seçim analiz ediliyor.`:'Karşılaşmalar hazır; oran doğrulaması ayrı akışta sürüyor.'} dkd_action="Tüm maçlar" dkd_onPress={()=>dkd_Router.router.push('/matches')}/>{dkd_focus.slice(0,3).map((dkd_match,dkd_index)=><dkd_LiveMatchCard key={dkd_match.dkd_id} dkd_match={dkd_match} dkd_featured={dkd_index===0}/>)}</>}
    <dkd.Section dkd_title="Analiz ritmini seç" dkd_subtitle={dkd_oddsReady?'Risk profili, olasılık ve oran dengesini farklı bantlarda değerlendirir.':'Profiller doğrulanmış oranı bulunan maçlarda çalışır.'}/><dkd_RN.View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{(Object.keys(dkd_risks) as dkd_Risk[]).map(dkd_key=>{const dkd_risk=dkd_risks[dkd_key];return <dkd_RN.Pressable key={dkd_key} accessibilityRole="button" onPress={()=>dkd_Router.router.push({pathname:'/builder',params:{dkd_profile:dkd_key}})} style={{width:'48%',flexGrow:1,backgroundColor:dkd_colors.card,borderWidth:1,borderColor:dkd_risk.dkd_color+'35',borderRadius:19,padding:16,gap:10}}><dkd.Icon dkd_name={dkd_risk.dkd_icon} dkd_color={dkd_risk.dkd_color}/><dkd.Text dkd_bold dkd_color={dkd_risk.dkd_color}>{dkd_risk.dkd_name}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_risk.dkd_subtitle}</dkd.Text><dkd_widgets.AnimatedBar dkd_value={Math.round(dkd_risk.dkd_target*100)} dkd_max={100} dkd_color={dkd_risk.dkd_color} dkd_motion={dkd_store.dkd_motion}/></dkd_RN.Pressable>;})}</dkd_RN.View>
    <dkd.Section dkd_title="Canlı kapsam" dkd_subtitle={`${dkd_leagues} lig/organizasyon · ${dkd_matches.length} gerçek karşılaşma · eksik oran üretilmez.`}/>
  </dkd.Page>;
}

function dkd_modelReady(dkd_markets:{dkd_modelEligible?:boolean;dkd_probability:number;dkd_odds:number}[]){return dkd_markets.filter(dkd_market=>dkd_market.dkd_modelEligible!==false&&dkd_market.dkd_probability>0&&dkd_market.dkd_odds>1).length>=3;}
