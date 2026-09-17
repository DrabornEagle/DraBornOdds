import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import type { dkd_Team } from './dkd-types';

const dkd_logoCache=new Map<string,string|null>();
const dkd_logoPending=new Map<string,Promise<string|null>>();

type dkd_WikiResponse={query?:{pages?:Record<string,{thumbnail?:{source?:string}}>}};

async function dkd_wikiLogo(dkd_language:string,dkd_query:string){
  const dkd_url=`https://${dkd_language}.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch=${encodeURIComponent(dkd_query)}&prop=pageimages&piprop=thumbnail&pithumbsize=240&format=json&origin=*`;
  const dkd_controller=new AbortController();
  const dkd_timer=setTimeout(()=>dkd_controller.abort(),6500);
  try{
    const dkd_response=await fetch(dkd_url,{signal:dkd_controller.signal,headers:{Accept:'application/json'}});
    if(!dkd_response.ok)return null;
    const dkd_body=await dkd_response.json() as dkd_WikiResponse;
    const dkd_pages=Object.values(dkd_body.query?.pages??{});
    return dkd_pages.find(dkd_page=>dkd_page.thumbnail?.source)?.thumbnail?.source??null;
  }catch{return null;}finally{clearTimeout(dkd_timer);}
}

async function dkd_resolveLogo(dkd_team:dkd_Team){
  const dkd_key=dkd_team.dkd_name.trim().toLocaleLowerCase('tr-TR');
  if(dkd_logoCache.has(dkd_key))return dkd_logoCache.get(dkd_key)??null;
  const dkd_existing=dkd_logoPending.get(dkd_key);if(dkd_existing)return dkd_existing;
  const dkd_request=(async()=>{
    const dkd_queries=[`${dkd_team.dkd_name} football club`,`${dkd_team.dkd_name} futbol kulübü`,dkd_team.dkd_name];
    for(const dkd_query of dkd_queries){
      const dkd_logo=await dkd_wikiLogo('en',dkd_query)??await dkd_wikiLogo('tr',dkd_query);
      if(dkd_logo){dkd_logoCache.set(dkd_key,dkd_logo);dkd_logoPending.delete(dkd_key);return dkd_logo;}
    }
    dkd_logoCache.set(dkd_key,null);dkd_logoPending.delete(dkd_key);return null;
  })();
  dkd_logoPending.set(dkd_key,dkd_request);return dkd_request;
}

export function dkd_TeamLogo({dkd_team,dkd_size=48}:{dkd_team:dkd_Team;dkd_size?:number}){
  const [dkd_logo,dkd_setLogo]=dkd_React.useState<string|null>(()=>dkd_logoCache.get(dkd_team.dkd_name.trim().toLocaleLowerCase('tr-TR'))??null);
  const [dkd_failed,dkd_setFailed]=dkd_React.useState(false);
  dkd_React.useEffect(()=>{let dkd_active=true;dkd_setFailed(false);dkd_resolveLogo(dkd_team).then(dkd_value=>{if(dkd_active)dkd_setLogo(dkd_value)});return()=>{dkd_active=false};},[dkd_team.dkd_id,dkd_team.dkd_name]);
  const dkd_radius=Math.max(14,dkd_size*.32);
  return <dkd_RN.View style={{width:dkd_size,height:dkd_size,borderRadius:dkd_radius,backgroundColor:'#F7F9FF',borderWidth:2,borderColor:dkd_team.dkd_color+'80',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
    {!!dkd_logo&&!dkd_failed?<dkd_RN.Image source={{uri:dkd_logo}} resizeMode="contain" onError={()=>dkd_setFailed(true)} style={{width:dkd_size*.82,height:dkd_size*.82}}/>:<dkd_RN.Text style={{fontSize:Math.max(10,dkd_size*.24),fontWeight:'900',color:dkd_team.dkd_color}}>{dkd_team.dkd_short}</dkd_RN.Text>}
  </dkd_RN.View>;
}
