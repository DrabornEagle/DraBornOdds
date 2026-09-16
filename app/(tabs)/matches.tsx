import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from '../../src/dkd-ui';
import { dkd_matches, dkd_leagues } from '../../src/dkd-data';
import { dkd_filterMatches } from '../../src/dkd-engine';
import { dkd_useStore } from '../../src/dkd-store';
import type { dkd_Period } from '../../src/dkd-types';

export default function dkd_MatchesScreen(){
  const dkd_params=dkd_Router.useLocalSearchParams<{dkd_favorites?:string}>();
  const dkd_store=dkd_useStore();
  const [dkd_period,dkd_setPeriod]=dkd_React.useState<dkd_Period>('week');
  const [dkd_league,dkd_setLeague]=dkd_React.useState('Tümü');
  const [dkd_query,dkd_setQuery]=dkd_React.useState('');
  const [dkd_onlyFavorites,dkd_setOnlyFavorites]=dkd_React.useState(false);
  dkd_React.useEffect(()=>{if(dkd_params.dkd_favorites==='1')dkd_setOnlyFavorites(true);},[dkd_params.dkd_favorites]);
  const dkd_list=dkd_React.useMemo(()=>dkd_filterMatches(dkd_matches,dkd_period,dkd_league,dkd_query).filter(dkd_match=>!dkd_onlyFavorites||dkd_store.dkd_stored.dkd_favorites.includes(dkd_match.dkd_id)),[dkd_period,dkd_league,dkd_query,dkd_onlyFavorites,dkd_store.dkd_stored.dkd_favorites]);
  return <dkd_RN.FlatList data={dkd_list} keyExtractor={dkd_item=>dkd_item.dkd_id} renderItem={({item:dkd_item})=><dkd.MatchCard dkd_match={dkd_item}/>} initialNumToRender={5} maxToRenderPerBatch={5} windowSize={5} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic" style={{flex:1,backgroundColor:dkd_colors.bg}} contentContainerStyle={{padding:20,paddingTop:14,paddingBottom:30,gap:14,width:'100%',maxWidth:760,alignSelf:'center'}}
    ListHeaderComponent={<dkd_RN.View style={{gap:18,marginBottom:6}}><dkd.Reveal><dkd.Text dkd_size={29} dkd_bold>Maç merkezi<dkd_RN.Text style={{color:dkd_colors.lime}}>.</dkd_RN.Text></dkd.Text><dkd.Text dkd_color={dkd_colors.muted} dkd_size={13}>Karşılaşmaları keşfet. Detayları yakala.</dkd.Text></dkd.Reveal>
    <dkd.Row><dkd_RN.View style={{flex:1,flexDirection:'row',alignItems:'center',backgroundColor:dkd_colors.card,borderColor:dkd_colors.line,borderWidth:1,borderRadius:15,paddingHorizontal:14,gap:8}}><dkd.Icon dkd_name="search" dkd_color={dkd_colors.muted} dkd_size={19}/><dkd_RN.TextInput accessibilityLabel="Takım veya lig ara" placeholder="Takım veya lig ara" placeholderTextColor={dkd_colors.muted} value={dkd_query} onChangeText={dkd_setQuery} style={{flex:1,color:dkd_colors.text,minHeight:50,fontSize:14}}/>{!!dkd_query&&<dkd.IconButton dkd_label="Aramayı temizle" dkd_icon="close" dkd_onPress={()=>dkd_setQuery('')}/>}</dkd_RN.View><dkd.IconButton dkd_icon="star" dkd_label={dkd_onlyFavorites?'Tüm maçları göster':'Yalnızca favoriler'} dkd_color={dkd_onlyFavorites?dkd_colors.yellow:dkd_colors.muted} dkd_active={dkd_onlyFavorites} dkd_onPress={()=>dkd_setOnlyFavorites(!dkd_onlyFavorites)}/></dkd.Row>
    <dkd.Chips dkd_options={[{dkd_id:'today',dkd_label:'Bugün'},{dkd_id:'tomorrow',dkd_label:'Yarın'},{dkd_id:'week',dkd_label:'Bu hafta'}]} dkd_value={dkd_period} dkd_onChange={dkd_value=>dkd_setPeriod(dkd_value as dkd_Period)}/>
    <dkd.Chips dkd_options={dkd_leagues.map(dkd_label=>({dkd_id:dkd_label,dkd_label}))} dkd_value={dkd_league} dkd_onChange={dkd_setLeague} dkd_color={dkd_colors.blue}/>
    <dkd.Row dkd_between><dkd.Text dkd_size={13} dkd_bold>{dkd_list.length} karşılaşma {dkd_onlyFavorites?'· Favoriler':''}</dkd.Text><dkd.Badge dkd_color={dkd_colors.muted}>ÖRNEK FİKSTÜR</dkd.Badge></dkd.Row></dkd_RN.View>}
    ListEmptyComponent={<dkd.Empty dkd_title="Bu filtrede maç yok" dkd_body="Aramanı değiştirebilir veya favorilerine yeni maçlar ekleyebilirsin." dkd_action="Filtreleri temizle" dkd_onPress={()=>{dkd_setQuery('');dkd_setLeague('Tümü');dkd_setPeriod('week');dkd_setOnlyFavorites(false);}}/>}
    ListFooterComponent={<dkd_RN.View style={{paddingTop:12}}><dkd.Notice/></dkd_RN.View>}/>;
}
