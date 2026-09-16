import * as dkd_Router from 'expo-router';
import * as dkd_RN from 'react-native';
import { useSafeAreaInsets as dkd_useInsets } from 'react-native-safe-area-context';
import { dkd, dkd_colors } from '../../src/dkd-ui';
import { dkd_useStore } from '../../src/dkd-store';

export default function dkd_TabsLayout(){
  const dkd_insets=dkd_useInsets();
  const dkd_store=dkd_useStore();
  return <dkd_Router.Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:dkd_colors.lime,tabBarInactiveTintColor:dkd_colors.muted,tabBarStyle:{backgroundColor:'#11182A',borderTopColor:dkd_colors.line,borderTopWidth:1,height:66+dkd_insets.bottom,paddingTop:8,paddingBottom:Math.max(dkd_insets.bottom,7)},tabBarLabelStyle:{fontSize:10,fontWeight:'600',marginTop:3},tabBarHideOnKeyboard:true,sceneStyle:{backgroundColor:dkd_colors.bg},animation:dkd_store.dkd_motion?'fade':'none'}}>
    <dkd_Router.Tabs.Screen name="index" options={{title:'Keşfet',tabBarIcon:({color:dkd_color})=><dkd.Icon dkd_name="home" dkd_color={typeof dkd_color==='string'?dkd_color:dkd_colors.muted}/>}}/>
    <dkd_Router.Tabs.Screen name="matches" options={{title:'Maçlar',tabBarIcon:({color:dkd_color})=><dkd.Icon dkd_name="ball" dkd_color={typeof dkd_color==='string'?dkd_color:dkd_colors.muted}/>}}/>
    <dkd_Router.Tabs.Screen name="builder" options={{title:'Kupon',tabBarBadge:dkd_store.dkd_draft.length||undefined,tabBarBadgeStyle:{backgroundColor:dkd_colors.coral,color:dkd_colors.bg},tabBarIcon:()=><dkd_RN.View style={{width:44,height:34,backgroundColor:dkd_colors.lime,borderRadius:12,alignItems:'center',justifyContent:'center'}}><dkd.Icon dkd_name="plus" dkd_color={dkd_colors.bg}/></dkd_RN.View>}}/>
    <dkd_Router.Tabs.Screen name="saved" options={{title:'Kayıtlar',tabBarIcon:({color:dkd_color})=><dkd.Icon dkd_name="bookmark" dkd_color={typeof dkd_color==='string'?dkd_color:dkd_colors.muted}/>}}/>
    <dkd_Router.Tabs.Screen name="profile" options={{title:'Profil',tabBarIcon:({color:dkd_color})=><dkd.Icon dkd_name="user" dkd_color={typeof dkd_color==='string'?dkd_color:dkd_colors.muted}/>}}/>
  </dkd_Router.Tabs>;
}
