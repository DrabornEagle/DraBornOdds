import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_SVG from 'react-native-svg';
import * as dkd_Router from 'expo-router';
import { useSafeAreaInsets as dkd_useInsets } from 'react-native-safe-area-context';
import { dkd_useStore } from './dkd-store';
import { dkd_date } from './dkd-data';
import { dkd_decimal, dkd_percent } from './dkd-engine';
import type { dkd_Match, dkd_Team } from './dkd-types';

type dkd_ViewStyle = dkd_React.ComponentProps<typeof dkd_RN.View>['style'];

export const dkd_colors = { bg:'#0B1020', card:'#151C2F', raised:'#1D263C', line:'#29334C', text:'#F3F5FC', muted:'#9AA8C2', lime:'#B6F36A', blue:'#6DBFFF', purple:'#C5A0FF', coral:'#FF8B78', yellow:'#FFCE77' };
const dkd_paths: Record<string,string> = {
  home:'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  ball:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5 4 3-1.5 4h-5L8 11Zm0-5v5m9 3-5 0m2 8-3.5-4M6 19l3.5-4M3 11h5',
  ticket:'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4Zm13 0v3m0 3v2m0 3v3',
  user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  arrow:'M4 12h15m-6-6 6 6-6 6', chevron:'m9 5 7 7-7 7', back:'m15 5-7 7 7 7',
  search:'M20 20 15.5 15.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  star:'m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.5l-5.7 3 1.1-6.3L2.8 9.7l6.4-.9Z',
  bookmark:'M6 3h12v18l-6-4-6 4Z', check:'m5 12 4 4L20 5', plus:'M12 5v14M5 12h14', minus:'M5 12h14',
  bolt:'m13 2-9 12h7l-1 8 10-13h-8Z', shield:'m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6',
  balance:'M12 3v18M6 21h12M4 7h16M5 7l-3 7h6Zm14 0-3 7h6Z',
  trend:'m3 17 6-6 4 4 8-10m-6 0h6v6', chart:'M4 20V10m6 10V4m6 16v-7m6 7V2',
  calendar:'M5 5h14v16H5ZM8 2v6m8-6v6M5 11h14',
  pin:'M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Zm3-13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  cloud:'M6 18a5 5 0 0 1 0-10 7 7 0 0 1 13 2 4 4 0 0 1-1 8Z',
  close:'m6 6 12 12M6 18 18 6', share:'M12 16V2m-5 5 5-5 5 5M5 12v9h14v-9',
  trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
  info:'M12 11v6m0-10v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  refresh:'M20 7a9 9 0 1 0 1 9M20 2v6h-6', clock:'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  spark:'m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z',
  filter:'M4 6h16M7 12h10m-7 6h4', trophy:'M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 3v6m-4 0h8',
};
function dkd_icon(dkd_props: {dkd_name:string; dkd_size?:number; dkd_color?:string; dkd_fill?:boolean}) {
  return <dkd_SVG.Svg width={dkd_props.dkd_size ?? 22} height={dkd_props.dkd_size ?? 22} viewBox="0 0 24 24" accessible={false}>
    <dkd_SVG.Path d={dkd_paths[dkd_props.dkd_name] ?? dkd_paths.spark} fill={dkd_props.dkd_fill ? dkd_props.dkd_color ?? dkd_colors.lime : 'none'} stroke={dkd_props.dkd_color ?? dkd_colors.text} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" />
  </dkd_SVG.Svg>;
}
function dkd_text(dkd_props: {children:dkd_React.ReactNode; dkd_size?:number; dkd_color?:string; dkd_bold?:boolean; dkd_style?:dkd_RN.StyleProp<dkd_RN.TextStyle>; dkd_lines?:number; dkd_selectable?:boolean}) {
  return <dkd_RN.Text selectable={dkd_props.dkd_selectable ?? false} numberOfLines={dkd_props.dkd_lines} style={[{fontSize:dkd_props.dkd_size ?? 15, color:dkd_props.dkd_color ?? dkd_colors.text, fontWeight:dkd_props.dkd_bold?'700':'400', lineHeight:(dkd_props.dkd_size ?? 15)*1.4},dkd_props.dkd_style]}>{dkd_props.children}</dkd_RN.Text>;
}
function dkd_row(dkd_props: {children:dkd_React.ReactNode; dkd_style?:dkd_ViewStyle; dkd_between?:boolean; dkd_gap?:number}) {
  return <dkd_RN.View style={[{flexDirection:'row',alignItems:'center',gap:dkd_props.dkd_gap ?? 10,...(dkd_props.dkd_between?{justifyContent:'space-between' as const}:{})},dkd_props.dkd_style]}>{dkd_props.children}</dkd_RN.View>;
}
function dkd_card(dkd_props: {children:dkd_React.ReactNode; dkd_style?:dkd_ViewStyle; dkd_color?:string}) {
  return <dkd_RN.View style={[{backgroundColor:dkd_props.dkd_color ?? dkd_colors.card,padding:18,borderRadius:22,borderWidth:1,borderColor:dkd_colors.line,gap:14},dkd_props.dkd_style]}>{dkd_props.children}</dkd_RN.View>;
}
function dkd_badge(dkd_props: {children:dkd_React.ReactNode; dkd_color?:string; dkd_icon?:string}) {
  const dkd_color = dkd_props.dkd_color ?? dkd_colors.lime;
  return <dkd_RN.View style={{flexDirection:'row',alignSelf:'flex-start',alignItems:'center',gap:5,backgroundColor:dkd_color+'16',borderRadius:7,paddingHorizontal:9,paddingVertical:5}}>
    {dkd_props.dkd_icon && dkd_icon({dkd_name:dkd_props.dkd_icon,dkd_color,dkd_size:12})}
    <dkd_RN.Text style={{fontSize:11,fontWeight:'800',letterSpacing:0.5,color:dkd_color}}>{dkd_props.children}</dkd_RN.Text>
  </dkd_RN.View>;
}

function dkd_button(dkd_props: {dkd_label:string; dkd_onPress:()=>void; dkd_icon?:string; dkd_variant?:'primary'|'secondary'|'ghost'|'danger'; dkd_disabled?:boolean; dkd_small?:boolean; dkd_style?:dkd_ViewStyle; dkd_color?:string; dkd_testID?:string}) {
  const dkd_store = dkd_useStore();
  const dkd_scale = dkd_React.useRef(new dkd_RN.Animated.Value(1)).current;
  const dkd_primary = !dkd_props.dkd_variant || dkd_props.dkd_variant === 'primary';
  const dkd_color = dkd_primary ? dkd_colors.bg : dkd_props.dkd_color ?? (dkd_props.dkd_variant==='danger'?dkd_colors.coral:dkd_colors.text);
  const dkd_animate = (dkd_value:number) => {if(dkd_store.dkd_motion) dkd_RN.Animated.spring(dkd_scale,{toValue:dkd_value,useNativeDriver:true,speed:35,bounciness:3}).start();};
  return <dkd_RN.Animated.View style={[{transform:[{scale:dkd_scale}]},dkd_props.dkd_style]}>
    <dkd_RN.Pressable accessibilityRole="button" accessibilityLabel={dkd_props.dkd_label} accessibilityState={{disabled:dkd_props.dkd_disabled}} testID={dkd_props.dkd_testID} disabled={dkd_props.dkd_disabled} onPressIn={()=>dkd_animate(0.97)} onPressOut={()=>dkd_animate(1)} onPress={dkd_props.dkd_onPress} style={{minHeight:dkd_props.dkd_small?44:54,paddingHorizontal:dkd_props.dkd_small?14:20,paddingVertical:12,borderRadius:15,flexDirection:'row',gap:9,alignItems:'center',justifyContent:'center',backgroundColor:dkd_primary?dkd_colors.lime:dkd_props.dkd_variant==='ghost'?'transparent':dkd_colors.raised,opacity:dkd_props.dkd_disabled?0.45:1}}>
      {dkd_props.dkd_icon && dkd_icon({dkd_name:dkd_props.dkd_icon,dkd_color,dkd_size:20})}
      {dkd_text({children:dkd_props.dkd_label,dkd_size:dkd_props.dkd_small?13:15,dkd_bold:true,dkd_color})}
    </dkd_RN.Pressable>
  </dkd_RN.Animated.View>;
}
function dkd_iconButton(dkd_props:{dkd_icon:string;dkd_label:string;dkd_onPress:()=>void;dkd_color?:string;dkd_active?:boolean}) {
  return <dkd_RN.Pressable accessibilityRole="button" accessibilityLabel={dkd_props.dkd_label} accessibilityState={{selected:dkd_props.dkd_active}} onPress={dkd_props.dkd_onPress} style={({pressed:dkd_pressed})=>({width:44,height:44,borderRadius:14,backgroundColor:dkd_pressed?dkd_colors.line:dkd_colors.raised,alignItems:'center',justifyContent:'center'})}>
    {dkd_icon({dkd_name:dkd_props.dkd_icon,dkd_color:dkd_props.dkd_color ?? dkd_colors.muted,dkd_fill:dkd_props.dkd_active})}
  </dkd_RN.Pressable>;
}
function dkd_reveal(dkd_props:{children:dkd_React.ReactNode;dkd_delay?:number;dkd_style?:dkd_ViewStyle}) {
  const {dkd_motion} = dkd_useStore();
  const dkd_value = dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  dkd_React.useEffect(()=>{
    if (!dkd_motion) {dkd_value.setValue(1);return;}
    const dkd_animation=dkd_RN.Animated.timing(dkd_value,{toValue:1,duration:420,delay:dkd_props.dkd_delay ?? 0,useNativeDriver:true});
    dkd_animation.start();return()=>dkd_animation.stop();
  },[dkd_motion,dkd_props.dkd_delay,dkd_value]);
  return <dkd_RN.Animated.View style={[{opacity:dkd_value,transform:[{translateY:dkd_value.interpolate({inputRange:[0,1],outputRange:[16,0]})}]},dkd_props.dkd_style]}>{dkd_props.children}</dkd_RN.Animated.View>;
}
function dkd_page(dkd_props:{children:dkd_React.ReactNode;dkd_bottom?:number}) {
  const dkd_insets = dkd_useInsets();
  return <dkd_RN.ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{flex:1,backgroundColor:dkd_colors.bg}} contentContainerStyle={{padding:20,paddingTop:14,paddingBottom:dkd_props.dkd_bottom ?? 30+dkd_insets.bottom,gap:22,width:'100%',maxWidth:760,alignSelf:'center'}}>{dkd_props.children}</dkd_RN.ScrollView>;
}
function dkd_section(dkd_props:{dkd_title:string;dkd_subtitle?:string;dkd_action?:string;dkd_onPress?:()=>void}) {
  return <dkd_RN.View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8}}>
    <dkd_RN.View style={{flex:1}}>{dkd_text({children:dkd_props.dkd_title,dkd_size:20,dkd_bold:true})}{dkd_props.dkd_subtitle&&dkd_text({children:dkd_props.dkd_subtitle,dkd_size:12,dkd_color:dkd_colors.muted,dkd_style:{marginTop:3}})}</dkd_RN.View>
    {dkd_props.dkd_action&&<dkd_RN.Pressable accessibilityRole="button" onPress={dkd_props.dkd_onPress} style={{minHeight:44,justifyContent:'center'}}>{dkd_text({children:dkd_props.dkd_action+'  ›',dkd_color:dkd_colors.lime,dkd_size:13,dkd_bold:true})}</dkd_RN.Pressable>}
  </dkd_RN.View>;
}
function dkd_chips(dkd_props:{dkd_options:{dkd_id:string;dkd_label:string}[];dkd_value:string;dkd_onChange:(dkd_value:string)=>void;dkd_color?:string}) {
  return <dkd_RN.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>
    {dkd_props.dkd_options.map(dkd_option=>{
      const dkd_active=dkd_option.dkd_id===dkd_props.dkd_value;
      return <dkd_RN.Pressable key={dkd_option.dkd_id} accessibilityRole="button" accessibilityState={{selected:dkd_active}} onPress={()=>dkd_props.dkd_onChange(dkd_option.dkd_id)} style={{minHeight:44,borderRadius:13,paddingHorizontal:16,justifyContent:'center',backgroundColor:dkd_active?(dkd_props.dkd_color ?? dkd_colors.lime):dkd_colors.card,borderWidth:1,borderColor:dkd_active?(dkd_props.dkd_color ?? dkd_colors.lime):dkd_colors.line}}>{dkd_text({children:dkd_option.dkd_label,dkd_size:13,dkd_bold:true,dkd_color:dkd_active?dkd_colors.bg:dkd_colors.muted})}</dkd_RN.Pressable>;
    })}
  </dkd_RN.ScrollView>;
}
function dkd_crest(dkd_props:{dkd_team:dkd_Team;dkd_size?:number}) {
  const dkd_size=dkd_props.dkd_size ?? 46;
  return <dkd_RN.View style={{width:dkd_size,height:dkd_size,borderRadius:dkd_size*0.3,backgroundColor:dkd_props.dkd_team.dkd_color+'19',borderWidth:1,borderColor:dkd_props.dkd_team.dkd_color+'50',alignItems:'center',justifyContent:'center'}}>
    {dkd_text({children:dkd_props.dkd_team.dkd_short,dkd_size:dkd_size*0.25,dkd_bold:true,dkd_color:dkd_props.dkd_team.dkd_color})}
  </dkd_RN.View>;
}
function dkd_form(dkd_props:{dkd_results:dkd_Team['dkd_form']}) {
  return <dkd_RN.View accessibilityLabel={'Son beş maç: '+dkd_props.dkd_results.join(', ')} style={{flexDirection:'row',gap:5}}>{dkd_props.dkd_results.map((dkd_result,dkd_index)=>{
    const dkd_color=dkd_result==='G'?dkd_colors.lime:dkd_result==='B'?dkd_colors.blue:dkd_colors.coral;
    return <dkd_RN.View key={dkd_index} style={{width:24,height:25,borderRadius:6,backgroundColor:dkd_color+'20',alignItems:'center',justifyContent:'center'}}>{dkd_text({children:dkd_result,dkd_size:11,dkd_color,dkd_bold:true})}</dkd_RN.View>;
  })}</dkd_RN.View>;
}
function dkd_matchCard(dkd_props:{dkd_match:dkd_Match;dkd_featured?:boolean}) {
  const dkd_match=dkd_props.dkd_match;
  const dkd_store=dkd_useStore();
  const dkd_favorite=dkd_store.dkd_stored.dkd_favorites.includes(dkd_match.dkd_id);
  return <dkd.Card dkd_style={{borderColor:dkd_props.dkd_featured?'#435A39':dkd_colors.line}}>
    <dkd.Row dkd_between><dkd.Row dkd_gap={7}><dkd_RN.View style={{width:6,height:6,borderRadius:3,backgroundColor:dkd_match.dkd_color}}/><dkd.Text dkd_size={12} dkd_color={dkd_match.dkd_color} dkd_bold>{dkd_match.dkd_league}</dkd.Text></dkd.Row><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_date(dkd_match.dkd_offset)} · {dkd_match.dkd_time}</dkd.Text></dkd.Row>
    <dkd.Row>
      <dkd_RN.Pressable accessibilityRole="button" accessibilityLabel={`${dkd_match.dkd_home.dkd_name} – ${dkd_match.dkd_away.dkd_name} maç analizi`} onPress={()=>dkd_Router.router.push(`/match/${dkd_match.dkd_id}`)} style={{flex:1,gap:12}}>
        {[dkd_match.dkd_home,dkd_match.dkd_away].map(dkd_team=><dkd.Row key={dkd_team.dkd_id}><dkd.Crest dkd_team={dkd_team} dkd_size={35}/><dkd.Text dkd_bold dkd_style={{flex:1}}>{dkd_team.dkd_name}</dkd.Text></dkd.Row>)}
      </dkd_RN.Pressable>
      <dkd.IconButton dkd_label={dkd_favorite?'Favoriden çıkar':'Favorilere ekle'} dkd_icon="star" dkd_active={dkd_favorite} dkd_color={dkd_favorite?dkd_colors.yellow:dkd_colors.muted} dkd_onPress={()=>dkd_store.dkd_toggleFavorite(dkd_match.dkd_id)}/>
    </dkd.Row>
    <dkd.Row dkd_gap={7}>{dkd_match.dkd_markets.slice(0,3).map(dkd_market=>{
      const dkd_selected=dkd_store.dkd_draft.some(dkd_pick=>dkd_pick.dkd_matchId===dkd_match.dkd_id&&dkd_pick.dkd_marketKey===dkd_market.dkd_key);
      return <dkd_RN.Pressable key={dkd_market.dkd_key} accessibilityRole="button" accessibilityLabel={`${dkd_match.dkd_home.dkd_short} ${dkd_market.dkd_short} ${dkd_decimal(dkd_market.dkd_odds)} kupona seç`} accessibilityState={{selected:dkd_selected}} onPress={()=>dkd_store.dkd_select({dkd_matchId:dkd_match.dkd_id,dkd_marketKey:dkd_market.dkd_key})} style={{flex:1,padding:11,minHeight:48,borderRadius:12,backgroundColor:dkd_selected?dkd_colors.lime:dkd_colors.raised,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:3}}>
        <dkd.Text dkd_size={11} dkd_color={dkd_selected?dkd_colors.bg:dkd_colors.muted}>{dkd_market.dkd_short}</dkd.Text><dkd.Text dkd_size={15} dkd_bold dkd_color={dkd_selected?dkd_colors.bg:dkd_colors.text}>{dkd_decimal(dkd_market.dkd_odds)}</dkd.Text>
      </dkd_RN.Pressable>;
    })}</dkd.Row>
    <dkd_RN.Pressable accessibilityRole="button" accessibilityLabel="Detaylı maç raporunu aç" onPress={()=>dkd_Router.router.push(`/match/${dkd_match.dkd_id}`)} style={{minHeight:36,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><dkd.Row dkd_gap={6}><dkd.Icon dkd_name="chart" dkd_size={14} dkd_color={dkd_colors.lime}/><dkd.Text dkd_size={12} dkd_color={dkd_colors.lime}>Maç raporunu keşfet</dkd.Text></dkd.Row><dkd.Icon dkd_name="arrow" dkd_size={16} dkd_color={dkd_colors.lime}/></dkd_RN.Pressable>
  </dkd.Card>;
}
function dkd_ring(dkd_props:{dkd_value:number;dkd_size?:number;dkd_color?:string;dkd_label?:string}) {
  const dkd_size=dkd_props.dkd_size ?? 100;
  const dkd_color=dkd_props.dkd_color ?? dkd_colors.lime;
  return <dkd_RN.View accessibilityLabel={`${dkd_props.dkd_label ?? 'Model olasılığı'} ${dkd_percent(dkd_props.dkd_value)}`} style={{width:dkd_size,height:dkd_size,alignItems:'center',justifyContent:'center'}}>
    <dkd_SVG.Svg width={dkd_size} height={dkd_size} viewBox="0 0 100 100" style={{position:'absolute'}}><dkd_SVG.Circle cx="50" cy="50" r="43" stroke={dkd_colors.line} strokeWidth="7" fill="none"/><dkd_SVG.Circle cx="50" cy="50" r="43" stroke={dkd_color} strokeWidth="7" fill="none" strokeDasharray={`${Math.max(0,Math.min(1,dkd_props.dkd_value))*270.18} 270.18`} strokeLinecap="round" rotation="-90" origin="50, 50"/></dkd_SVG.Svg>
    <dkd.Text dkd_size={dkd_size*0.23} dkd_bold dkd_color={dkd_color}>%{Math.round(dkd_props.dkd_value*100)}</dkd.Text><dkd.Text dkd_size={10} dkd_color={dkd_colors.muted}>örnek model</dkd.Text>
  </dkd_RN.View>;
}
function dkd_pitch() {
  const {dkd_motion}=dkd_useStore();
  const dkd_value=dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  dkd_Router.useFocusEffect(dkd_React.useCallback(()=>{if(!dkd_motion){dkd_value.setValue(0);return;}const dkd_loop=dkd_RN.Animated.loop(dkd_RN.Animated.sequence([dkd_RN.Animated.timing(dkd_value,{toValue:1,duration:2800,useNativeDriver:true}),dkd_RN.Animated.timing(dkd_value,{toValue:0,duration:2800,useNativeDriver:true})]));dkd_loop.start();return()=>dkd_loop.stop();},[dkd_motion,dkd_value]));
  return <dkd_RN.View accessible={false} style={{height:122,overflow:'hidden',borderRadius:18,backgroundColor:'#192B2A',borderWidth:1,borderColor:'#334F40'}}>
    <dkd_SVG.Svg width="100%" height="100%" viewBox="0 0 340 122"><dkd_SVG.Rect x="14" y="10" width="312" height="102" rx="4" stroke="#5E7953" fill="none"/><dkd_SVG.Path d="M170 10v102M14 33h39v56H14m312-56h-39v56h39M14 47h15v28H14m312-28h-15v28h15" stroke="#5E7953" fill="none"/><dkd_SVG.Circle cx="170" cy="61" r="25" stroke="#5E7953" fill="none"/><dkd_SVG.Path d="M50 85 102 62 153 77 220 32 281 57" stroke="#B6F36A" strokeDasharray="4 5" strokeWidth="1.5" fill="none"/>{[[50,85],[102,62],[153,77],[220,32],[281,57]].map(([dkd_x,dkd_y],dkd_i)=><dkd_SVG.Circle key={dkd_i} cx={dkd_x} cy={dkd_y} r={dkd_i===3?6:4} fill="#B6F36A"/>)}</dkd_SVG.Svg>
    <dkd_RN.Animated.View style={{position:'absolute',left:'46%',top:35,transform:[{translateX:dkd_value.interpolate({inputRange:[0,1],outputRange:[-40,32]})},{translateY:dkd_value.interpolate({inputRange:[0,1],outputRange:[25,-4]})}],width:28,height:28,borderRadius:14,backgroundColor:dkd_colors.lime,alignItems:'center',justifyContent:'center'}}><dkd.Icon dkd_name="ball" dkd_color={dkd_colors.bg} dkd_size={20}/></dkd_RN.Animated.View>
    <dkd_RN.View style={{position:'absolute',right:10,bottom:9,backgroundColor:dkd_colors.card,borderRadius:7,padding:6}}><dkd.Text dkd_size={10} dkd_color={dkd_colors.lime}>36 maç · 6 lig</dkd.Text></dkd_RN.View>
  </dkd_RN.View>;
}
function dkd_empty(dkd_props:{dkd_title:string;dkd_body:string;dkd_icon?:string;dkd_action?:string;dkd_onPress?:()=>void}) {
  return <dkd.Card dkd_style={{alignItems:'center',paddingVertical:32}}><dkd.Icon dkd_name={dkd_props.dkd_icon ?? 'search'} dkd_color={dkd_colors.lime} dkd_size={38}/><dkd.Text dkd_size={20} dkd_bold>{dkd_props.dkd_title}</dkd.Text><dkd.Text dkd_color={dkd_colors.muted} dkd_style={{textAlign:'center'}}>{dkd_props.dkd_body}</dkd.Text>{dkd_props.dkd_action&&dkd_props.dkd_onPress&&<dkd.Button dkd_label={dkd_props.dkd_action} dkd_onPress={dkd_props.dkd_onPress}/>}</dkd.Card>;
}
function dkd_notice(dkd_props:{dkd_text?:string}) {return <dkd.Row dkd_style={{alignItems:'flex-start',paddingHorizontal:2}}><dkd.Icon dkd_name="info" dkd_size={17} dkd_color={dkd_colors.muted}/><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted} dkd_style={{flex:1}}>{dkd_props.dkd_text ?? 'Demo veriler • Fikstür, oranlar ve istatistikler kurgusaldır. Gerçek maç tahmini veya kazanç garantisi değildir.'}</dkd.Text></dkd.Row>;}
function dkd_toast() {const {dkd_toast}=dkd_useStore();const dkd_insets=dkd_useInsets();if(!dkd_toast)return null;return <dkd_RN.View pointerEvents="none" accessibilityLiveRegion="polite" style={{position:'absolute',bottom:86+dkd_insets.bottom,left:20,right:20,alignItems:'center'}}><dkd_RN.View style={{maxWidth:600,backgroundColor:dkd_colors.lime,borderRadius:16,padding:16}}><dkd.Text dkd_size={13} dkd_color={dkd_colors.bg} dkd_bold>{dkd_toast}</dkd.Text></dkd_RN.View></dkd_RN.View>;}
function dkd_confirm(dkd_props:{dkd_visible:boolean;dkd_title:string;dkd_body:string;dkd_onCancel:()=>void;dkd_onConfirm:()=>void}) {return <dkd_RN.Modal visible={dkd_props.dkd_visible} transparent animationType="fade" onRequestClose={dkd_props.dkd_onCancel}><dkd_RN.View style={{flex:1,backgroundColor:'#000000B0',justifyContent:'center',padding:24}}><dkd.Card dkd_style={{maxWidth:500,width:'100%',alignSelf:'center'}}><dkd.Text dkd_size={22} dkd_bold>{dkd_props.dkd_title}</dkd.Text><dkd.Text dkd_color={dkd_colors.muted}>{dkd_props.dkd_body}</dkd.Text><dkd.Button dkd_label="Vazgeç" dkd_variant="secondary" dkd_onPress={dkd_props.dkd_onCancel}/><dkd.Button dkd_label="Evet, sil" dkd_variant="danger" dkd_icon="trash" dkd_onPress={dkd_props.dkd_onConfirm}/></dkd.Card></dkd_RN.View></dkd_RN.Modal>;}

export const dkd = {Icon:dkd_icon,Text:dkd_text,Row:dkd_row,Card:dkd_card,Badge:dkd_badge,Button:dkd_button,IconButton:dkd_iconButton,Reveal:dkd_reveal,Page:dkd_page,Section:dkd_section,Chips:dkd_chips,Crest:dkd_crest,Form:dkd_form,MatchCard:dkd_matchCard,Ring:dkd_ring,Pitch:dkd_pitch,Empty:dkd_empty,Notice:dkd_notice,Toast:dkd_toast,Confirm:dkd_confirm};
