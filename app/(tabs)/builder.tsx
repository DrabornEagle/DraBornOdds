import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from '../../src/dkd-ui';
import { dkd_matches, dkd_leagues } from '../../src/dkd-data';
import { dkd_filterMatches, dkd_generate, dkd_getMarket, dkd_risks, dkd_validateStake, dkd_decimal, dkd_money } from '../../src/dkd-engine';
import { dkd_useStore } from '../../src/dkd-store';
import type { dkd_Period, dkd_Risk } from '../../src/dkd-types';

export default function dkd_BuilderScreen(){
  const dkd_store=dkd_useStore();
  const dkd_params=dkd_Router.useLocalSearchParams<{dkd_profile?:string;dkd_mode?:string}>();
  const [dkd_mode,dkd_setMode]=dkd_React.useState('auto');
  const [dkd_count,dkd_setCount]=dkd_React.useState(3);
  const [dkd_stake,dkd_setStake]=dkd_React.useState('100');
  const [dkd_risk,dkd_setRisk]=dkd_React.useState<dkd_Risk>('balanced');
  const [dkd_period,dkd_setPeriod]=dkd_React.useState<dkd_Period>('week');
  const [dkd_league,dkd_setLeague]=dkd_React.useState('Tümü');
  const [dkd_error,dkd_setError]=dkd_React.useState('');
  const [dkd_busy,dkd_setBusy]=dkd_React.useState(false);
  const dkd_timer=dkd_React.useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const dkd_seed=dkd_React.useRef(0);
  const dkd_available=dkd_filterMatches(dkd_matches,dkd_period,dkd_league);
  dkd_React.useEffect(()=>{if(dkd_params.dkd_profile&&Object.hasOwn(dkd_risks,dkd_params.dkd_profile)){dkd_setRisk(dkd_params.dkd_profile as dkd_Risk);dkd_setMode('auto');}if(dkd_params.dkd_mode==='manual')dkd_setMode('manual');},[dkd_params.dkd_profile,dkd_params.dkd_mode]);
  dkd_Router.useFocusEffect(dkd_React.useCallback(()=>()=>{clearTimeout(dkd_timer.current);dkd_setBusy(false);},[]));
  const dkd_submit=(dkd_random=false)=>{
    if(dkd_busy)return;
    try {
      const dkd_amount=dkd_validateStake(dkd_stake);
      const dkd_picks=dkd_mode==='auto'?dkd_generate(dkd_available,dkd_count,dkd_risk,dkd_random?++dkd_seed.current:0):[...dkd_store.dkd_draft];
      if(!dkd_picks.length)throw new Error('Önce Maçlar ekranından en az bir oran seç.');
      dkd_setError('');dkd_setBusy(true);dkd_RN.Keyboard.dismiss();
      dkd_timer.current=setTimeout(()=>{
        try {const dkd_id=dkd_store.dkd_createReport(dkd_picks,dkd_amount,dkd_risk,dkd_mode==='auto'?'auto':'manual');dkd_setBusy(false);dkd_Router.router.push(`/report/${dkd_id}`);}
        catch(dkd_failure){dkd_setError(dkd_failure instanceof Error?dkd_failure.message:'Rapor oluşturulamadı.');dkd_setBusy(false);}
      },dkd_store.dkd_motion?650:0);
    } catch(dkd_failure){dkd_setError(dkd_failure instanceof Error?dkd_failure.message:'Seçimleri kontrol et.');}
  };
  return <dkd.Page>
    <dkd.Reveal><dkd.Badge dkd_icon="spark">KUPON ATÖLYESİ</dkd.Badge><dkd.Text dkd_size={29} dkd_bold dkd_style={{marginTop:10}}>Oyun planını kur.</dkd.Text><dkd.Text dkd_color={dkd_colors.muted} dkd_size={13}>Tercihlerini belirle. Arkasındaki hesabı gör.</dkd.Text></dkd.Reveal>
    <dkd.Chips dkd_options={[{dkd_id:'auto',dkd_label:'Akıllı seçim'},{dkd_id:'manual',dkd_label:`Seçtiklerim (${dkd_store.dkd_draft.length})`}]} dkd_value={dkd_mode} dkd_onChange={dkd_value=>{dkd_setMode(dkd_value);dkd_setError('');}}/>
    {dkd_mode==='auto'?<>
      <dkd.Card><dkd.Row dkd_between><dkd.Row><dkd.Badge dkd_color={dkd_colors.blue}>01</dkd.Badge><dkd.Text dkd_bold>Kaç maç olsun?</dkd.Text></dkd.Row><dkd.Text dkd_color={dkd_colors.blue} dkd_bold>{dkd_count} maç</dkd.Text></dkd.Row>
      <dkd.Row dkd_gap={7}>{[1,2,3,4,5,6].map(dkd_number=><dkd_RN.Pressable key={dkd_number} accessibilityRole="button" accessibilityLabel={`${dkd_number} maç seç`} accessibilityState={{selected:dkd_number===dkd_count}} onPress={()=>dkd_setCount(dkd_number)} style={{flex:1,minHeight:46,backgroundColor:dkd_number===dkd_count?dkd_colors.blue:dkd_colors.raised,borderRadius:12,alignItems:'center',justifyContent:'center'}}><dkd.Text dkd_bold dkd_size={18} dkd_color={dkd_number===dkd_count?dkd_colors.bg:dkd_colors.muted}>{dkd_number}</dkd.Text></dkd_RN.Pressable>)}</dkd.Row><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>Maç sayısı arttıkça kuponun tamamının tutma olasılığı düşer.</dkd.Text></dkd.Card>
      <dkd.Card><dkd.Row><dkd.Badge dkd_color={dkd_colors.purple}>02</dkd.Badge><dkd.Text dkd_bold>Hangi karşılaşmalar?</dkd.Text></dkd.Row><dkd.Chips dkd_options={[{dkd_id:'today',dkd_label:'Bugün'},{dkd_id:'tomorrow',dkd_label:'Yarın'},{dkd_id:'week',dkd_label:'Bu hafta'}]} dkd_value={dkd_period} dkd_onChange={dkd_value=>dkd_setPeriod(dkd_value as dkd_Period)} dkd_color={dkd_colors.purple}/><dkd.Chips dkd_options={dkd_leagues.map(dkd_label=>({dkd_id:dkd_label,dkd_label}))} dkd_value={dkd_league} dkd_onChange={dkd_setLeague} dkd_color={dkd_colors.blue}/><dkd.Text dkd_size={12} dkd_color={dkd_colors.muted}>{dkd_available.length} örnek maç bu filtrelere uygun.</dkd.Text></dkd.Card>
    </>:<>
      <dkd.Section dkd_title="Senin seçtiklerin" dkd_subtitle="Her karşılaşmadan tek seçim, en fazla 6 maç."/>
      {!dkd_store.dkd_draft.length?<dkd.Empty dkd_title="Kuponun seni bekliyor" dkd_body="Maç merkezinde bir orana dokun. Seçimlerini burada bir araya getirelim." dkd_icon="ticket" dkd_action="Maçları keşfet" dkd_onPress={()=>dkd_Router.router.push('/matches')}/>:dkd_store.dkd_draft.map(dkd_pick=>{
        const dkd_match=dkd_matches.find(dkd_item=>dkd_item.dkd_id===dkd_pick.dkd_matchId)!;const dkd_market=dkd_getMarket(dkd_match,dkd_pick.dkd_marketKey);
        return <dkd.Card key={dkd_pick.dkd_matchId}><dkd.Row><dkd_RN.View style={{flex:1,gap:5}}><dkd.Text dkd_bold dkd_size={14}>{dkd_match.dkd_home.dkd_name} – {dkd_match.dkd_away.dkd_name}</dkd.Text><dkd.Text dkd_size={13} dkd_color={dkd_colors.lime}>{dkd_market.dkd_label} · {dkd_decimal(dkd_market.dkd_odds)}</dkd.Text></dkd_RN.View><dkd.IconButton dkd_icon="close" dkd_label={`${dkd_match.dkd_home.dkd_short} seçimini çıkar`} dkd_onPress={()=>dkd_store.dkd_select(dkd_pick)}/></dkd.Row></dkd.Card>;
      })}
    </>}
    <dkd.Card><dkd.Row><dkd.Badge dkd_color={dkd_colors.yellow}>{dkd_mode==='auto'?'03':'01'}</dkd.Badge><dkd.Text dkd_bold>Senaryo tutarın</dkd.Text></dkd.Row>
      <dkd.Row dkd_style={{backgroundColor:dkd_colors.bg,borderRadius:15,paddingHorizontal:16,borderWidth:1,borderColor:dkd_colors.line}}><dkd_RN.TextInput accessibilityLabel="Senaryo tutarı TL" value={dkd_stake} onChangeText={dkd_setStake} keyboardType="decimal-pad" maxLength={10} selectTextOnFocus placeholder="En az 50" placeholderTextColor={dkd_colors.muted} style={{flex:1,minHeight:70,color:dkd_colors.text,fontSize:32,fontWeight:'700'}}/><dkd.Text dkd_size={21} dkd_color={dkd_colors.muted} dkd_bold>TL</dkd.Text></dkd.Row>
      <dkd.Chips dkd_options={[50,100,250,500].map(dkd_amount=>({dkd_id:String(dkd_amount),dkd_label:dkd_money(dkd_amount)}))} dkd_value={dkd_stake} dkd_onChange={dkd_setStake} dkd_color={dkd_colors.yellow}/><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>En az 50 TL · Yalnızca hesaplama için kullanılır. Para yatırılmaz.</dkd.Text>
    </dkd.Card>
    {dkd_mode==='auto'&&<><dkd.Section dkd_title="Risk tercihin" dkd_subtitle="Düşük risk de kayıp ihtimalini ortadan kaldırmaz."/><dkd_RN.View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{(Object.keys(dkd_risks) as dkd_Risk[]).map(dkd_key=>{const dkd_item=dkd_risks[dkd_key];const dkd_active=dkd_risk===dkd_key;return <dkd_RN.Pressable key={dkd_key} accessibilityRole="button" accessibilityLabel={dkd_item.dkd_name} accessibilityState={{selected:dkd_active}} onPress={()=>dkd_setRisk(dkd_key)} style={{width:'48%',flexGrow:1,backgroundColor:dkd_active?dkd_item.dkd_color+'17':dkd_colors.card,borderWidth:1,borderColor:dkd_active?dkd_item.dkd_color:dkd_colors.line,borderRadius:18,padding:15,gap:9}}><dkd.Row dkd_between><dkd.Icon dkd_name={dkd_item.dkd_icon} dkd_color={dkd_item.dkd_color}/>{dkd_active&&<dkd.Icon dkd_name="check" dkd_color={dkd_item.dkd_color} dkd_size={17}/>}</dkd.Row><dkd.Text dkd_color={dkd_item.dkd_color} dkd_bold>{dkd_item.dkd_name}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_item.dkd_subtitle}</dkd.Text></dkd_RN.Pressable>;})}</dkd_RN.View></>}
    {!!dkd_error&&<dkd.Card dkd_style={{borderColor:dkd_colors.coral}}><dkd.Text dkd_color={dkd_colors.coral} dkd_selectable>{dkd_error}</dkd.Text></dkd.Card>}
    {dkd_busy&&<dkd.Row><dkd_RN.ActivityIndicator color={dkd_colors.lime}/><dkd.Text dkd_color={dkd_colors.lime}>Demo senaryosu hesaplanıyor…</dkd.Text></dkd.Row>}
    <dkd.Button dkd_label={dkd_busy?'Rapor hazırlanıyor…':'Kupon raporunu oluştur'} dkd_icon="spark" dkd_disabled={dkd_busy} dkd_onPress={()=>dkd_submit()}/>
    {dkd_mode==='auto'&&<dkd.Button dkd_label="Beni şaşırt · alternatif oluştur" dkd_icon="refresh" dkd_variant="secondary" dkd_disabled={dkd_busy} dkd_onPress={()=>dkd_submit(true)}/>}
    <dkd.Notice/>
  </dkd.Page>;
}
