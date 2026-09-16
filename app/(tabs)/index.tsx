import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from '../../src/dkd-ui';
import { dkd_matches, dkd_date } from '../../src/dkd-data';
import { dkd_useStore } from '../../src/dkd-store';
import { dkd_risks } from '../../src/dkd-engine';
import type { dkd_Risk } from '../../src/dkd-types';

export default function dkd_HomeScreen(){
  const dkd_store=dkd_useStore();
  return <dkd.Page>
    <dkd.Reveal><dkd.Row dkd_between><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted} dkd_bold dkd_style={{letterSpacing:1.4}}>MAÇ GÜNÜNE HAZIRSIN</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_date(0,true)}</dkd.Text></dkd.Row><dkd.Text dkd_size={32} dkd_bold dkd_style={{marginTop:10,lineHeight:39}}>Oyunu gör.{'\n'}<dkd_RN.Text style={{color:dkd_colors.lime}}>Veriyi konuştur.</dkd_RN.Text></dkd.Text><dkd.Text dkd_size={14} dkd_color={dkd_colors.muted} dkd_style={{marginTop:9}}>Maçları keşfet, olasılıkları incele,{ '\n'}kendi kupon senaryonu oluştur.</dkd.Text></dkd.Reveal>
    <dkd.Reveal dkd_delay={80}><dkd.Card dkd_color="#162527" dkd_style={{borderColor:'#365142',gap:16}}>
      <dkd.Row dkd_between><dkd.Badge dkd_icon="spark">AKILLI KUPON ATÖLYESİ</dkd.Badge><dkd.Icon dkd_name="arrow" dkd_color={dkd_colors.lime}/></dkd.Row>
      <dkd.Text dkd_size={24} dkd_bold>Senin seçimin.{'\n'}Senin oyun planın.</dkd.Text>
      <dkd.Text dkd_size={13} dkd_color="#B5C9C3">Maç sayısını ve risk profilini seç. Demo model, nedenleriyle birlikte kuponunu hazırlasın.</dkd.Text>
      <dkd.Pitch/>
      <dkd.Button dkd_label="Kuponumu oluştur" dkd_icon="bolt" dkd_onPress={()=>dkd_Router.router.push('/builder')}/>
    </dkd.Card></dkd.Reveal>
    <dkd.Reveal dkd_delay={130}><dkd.Row dkd_gap={9}>{[{dkd_value:'36',dkd_label:'Örnek maç',dkd_color:dkd_colors.blue,dkd_icon:'ball'},{dkd_value:'6',dkd_label:'Farklı lig',dkd_color:dkd_colors.purple,dkd_icon:'trophy'},{dkd_value:'4',dkd_label:'Risk profili',dkd_color:dkd_colors.coral,dkd_icon:'chart'}].map(dkd_item=><dkd.Card key={dkd_item.dkd_label} dkd_style={{flex:1,padding:12,gap:5,borderRadius:16}}><dkd.Icon dkd_name={dkd_item.dkd_icon} dkd_size={18} dkd_color={dkd_item.dkd_color}/><dkd.Text dkd_size={25} dkd_bold>{dkd_item.dkd_value}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_item.dkd_label}</dkd.Text></dkd.Card>)}</dkd.Row></dkd.Reveal>
    <dkd.Section dkd_title="Günün odağı" dkd_subtitle="Büyük karşılaşmalar, küçük detaylar." dkd_action="Tüm maçlar" dkd_onPress={()=>dkd_Router.router.push('/matches')}/>
    <dkd.MatchCard dkd_match={dkd_matches[0]!} dkd_featured/>
    <dkd.MatchCard dkd_match={dkd_matches[1]!}/>
    <dkd.Section dkd_title="Ritmini seç" dkd_subtitle="Her profilin risk seviyesi farklıdır."/>
    <dkd_RN.View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{(Object.keys(dkd_risks) as dkd_Risk[]).map(dkd_key=>{const dkd_risk=dkd_risks[dkd_key];return <dkd_RN.Pressable key={dkd_key} accessibilityRole="button" accessibilityLabel={`${dkd_risk.dkd_name} kupon hazırla`} onPress={()=>dkd_Router.router.push({pathname:'/builder',params:{dkd_profile:dkd_key}})} style={{width:'48%',flexGrow:1,backgroundColor:dkd_colors.card,borderWidth:1,borderColor:dkd_colors.line,borderRadius:19,padding:16,gap:10}}><dkd.Icon dkd_name={dkd_risk.dkd_icon} dkd_color={dkd_risk.dkd_color}/><dkd.Text dkd_bold dkd_color={dkd_risk.dkd_color}>{dkd_risk.dkd_name}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_risk.dkd_subtitle}</dkd.Text></dkd_RN.Pressable>;})}</dkd_RN.View>
    {dkd_store.dkd_stored.dkd_favorites.length>0&&<><dkd.Section dkd_title="Takip listen" dkd_action="Favoriler" dkd_onPress={()=>dkd_Router.router.push({pathname:'/matches',params:{dkd_favorites:'1'}})}/><dkd.MatchCard dkd_match={dkd_matches.find(dkd_item=>dkd_item.dkd_id===dkd_store.dkd_stored.dkd_favorites[0])!}/></>}
    <dkd.Card dkd_style={{borderColor:'#3C3454'}}><dkd.Row><dkd.Icon dkd_name="info" dkd_color={dkd_colors.purple}/><dkd.Text dkd_bold>Bir yüzdeden daha fazlası.</dkd.Text></dkd.Row><dkd.Text dkd_size={13} dkd_color={dkd_colors.muted}>Olasılık, kesinlik değildir. Modelin hangi verileri kullandığını ve nerede sınırlı kaldığını incele.</dkd.Text><dkd.Button dkd_label="Modelin içini keşfet" dkd_variant="secondary" dkd_icon="arrow" dkd_onPress={()=>dkd_Router.router.push('/method')}/></dkd.Card>
    <dkd.Notice/>
    <dkd.Text dkd_size={10} dkd_color={dkd_colors.muted} dkd_style={{textAlign:'center'}}>DraBornEagle ekosistemi · DKD_draborneagle_v0.1</dkd.Text>
  </dkd.Page>;
}
