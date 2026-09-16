import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { StatusBar as dkd_StatusBar } from 'expo-status-bar';
import { dkd_Provider, dkd_useStore } from '../src/dkd-store';
import { dkd, dkd_colors } from '../src/dkd-ui';

const dkd_expo = { StatusBar: dkd_StatusBar };
function dkd_appShell() {
  const dkd_store=dkd_useStore();
  if(!dkd_store.dkd_loaded) return <dkd_RN.View style={{flex:1,backgroundColor:dkd_colors.bg,alignItems:'center',justifyContent:'center',gap:18}}><dkd.Icon dkd_name="bolt" dkd_size={52} dkd_color={dkd_colors.lime}/><dkd.Text dkd_size={27} dkd_bold>DraBornOdds</dkd.Text><dkd_RN.ActivityIndicator color={dkd_colors.lime}/><dkd.Text dkd_color={dkd_colors.muted}>Maç merkeziniz hazırlanıyor</dkd.Text></dkd_RN.View>;
  return <dkd_RN.View style={{flex:1,backgroundColor:dkd_colors.bg}}>
    <dkd_expo.StatusBar style="light"/>
    <dkd_Router.Stack screenOptions={{headerStyle:{backgroundColor:dkd_colors.bg},headerTintColor:dkd_colors.text,headerShadowVisible:false,contentStyle:{backgroundColor:dkd_colors.bg},animation:dkd_store.dkd_motion?'slide_from_right':'none',headerTitleStyle:{fontSize:18,fontWeight:'700'}}}>
      <dkd_Router.Stack.Screen name="(tabs)" options={{title:'DraBornOdds',headerTitle:()=> <dkd.Row dkd_gap={8}><dkd_RN.View style={{width:32,height:34,backgroundColor:dkd_colors.lime,borderRadius:10,alignItems:'center',justifyContent:'center'}}><dkd.Icon dkd_name="bolt" dkd_color={dkd_colors.bg} dkd_size={22}/></dkd_RN.View><dkd.Text dkd_size={21} dkd_bold>DraBorn<dkd_RN.Text style={{color:dkd_colors.lime}}>Odds</dkd_RN.Text></dkd.Text></dkd.Row>,headerRight:()=> <dkd_RN.View style={{marginRight:4}}><dkd.Badge dkd_color={dkd_colors.lime}>DEMO</dkd.Badge></dkd_RN.View>}}/>
      <dkd_Router.Stack.Screen name="match/[dkd_id]" options={{title:'Maç analizi'}}/>
      <dkd_Router.Stack.Screen name="report/[dkd_id]" options={{title:'Kupon raporu'}}/>
      <dkd_Router.Stack.Screen name="method" options={{title:'Analiz nasıl çalışır?'}}/>
      <dkd_Router.Stack.Screen name="+not-found" options={{title:'Sayfa bulunamadı'}}/>
    </dkd_Router.Stack>
    <dkd.Toast/>
  </dkd_RN.View>;
}
const dkd_root = {Provider:dkd_Provider,Shell:dkd_appShell};
export default function dkd_RootLayout(){return <dkd_root.Provider><dkd_root.Shell/></dkd_root.Provider>;}
