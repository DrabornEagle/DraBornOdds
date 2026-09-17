import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import type { dkd_Team } from './dkd-types';
import { dkd_fetchTeamContext } from './dkd-football-context';

const dkd_logoCache=new Map<string,string|null>();
const dkd_logoPending=new Map<string,Promise<string|null>>();
type dkd_LogoManifest={dkd_logos?:Record<string,string>};
let dkd_manifestPromise:Promise<dkd_LogoManifest|null>|null=null;
async function dkd_manifest(){if(dkd_manifestPromise)return dkd_manifestPromise;dkd_manifestPromise=(async()=>{try{const dkd_response=await fetch(`https://raw.githubusercontent.com/DrabornEagle/DraBornOdds/main/assets/dkd-team-logos.json?dkd=${Date.now()}`,{headers:{Accept:'application/json'}});if(!dkd_response.ok)return null;return await dkd_response.json() as dkd_LogoManifest;}catch{return null;}})();return dkd_manifestPromise;}
const dkd_aliases:Record<string,string>={
  kasimpasa:'Kasımpaşa S.K.',konyaspor:'Konyaspor',corum:'Çorum F.K.',alanyaspor:'Alanyaspor',kocaelispor:'Kocaelispor',gaziantep:'Gaziantep F.K.',trabzonspor:'Trabzonspor',galatasaray:'Galatasaray S.K. (football)',istanbulbasaksehir:'İstanbul Başakşehir F.K.',basaksehir:'İstanbul Başakşehir F.K.',genclerbirligi:'Gençlerbirliği S.K.',fenerbahce:'Fenerbahçe S.K. (football)',eyupspor:'Eyüpspor',erzurumspor:'Erzurumspor F.K.',samsunspor:'Samsunspor',amed:'Amed S.F.K.',besiktas:'Beşiktaş J.K.',goztepe:'Göztepe S.K.',rizespor:'Çaykur Rizespor',stadetunisien:'Stade Tunisien',clubafricain:'Club Africain'
};
type dkd_WikiResponse={query?:{pages?:Record<string,{thumbnail?:{source?:string}}>}};
type dkd_WikiSearch={pages?:Array<{key?:string;title?:string;thumbnail?:{url?:string}}>};

function dkd_plain(dkd_value:string){return dkd_value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ç/g,'c').replace(/ö/g,'o').replace(/ü/g,'u').replace(/[^a-z0-9]+/g,' ').trim();}
function dkd_clubKey(dkd_value:string){return dkd_plain(dkd_value).replace(/\b(tumosan|corendon|arca|caykur|ikas|rams|futbol|kulubu|sportif|faaliyetler|as|a s|fk|fc|sk)\b/g,' ').replace(/\s+/g,'').trim();}
function dkd_source(dkd_body:dkd_WikiResponse){const dkd_pages=Object.values(dkd_body.query?.pages??{});return dkd_pages.find(dkd_page=>dkd_page.thumbnail?.source)?.thumbnail?.source??null;}
async function dkd_json(dkd_url:string){const dkd_controller=new AbortController(),dkd_timer=setTimeout(()=>dkd_controller.abort(),7000);try{const dkd_response=await fetch(dkd_url,{signal:dkd_controller.signal,headers:{Accept:'application/json'}});if(!dkd_response.ok)return null;return await dkd_response.json() as unknown;}catch{return null;}finally{clearTimeout(dkd_timer);}}
async function dkd_wikiTitle(dkd_language:string,dkd_title:string){const dkd_url=`https://${dkd_language}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(dkd_title)}&prop=pageimages&piprop=thumbnail&pithumbsize=320&redirects=1&format=json&origin=*`;const dkd_body=await dkd_json(dkd_url) as dkd_WikiResponse|null;return dkd_body?dkd_source(dkd_body):null;}
async function dkd_wikiSearch(dkd_language:string,dkd_query:string){const dkd_modern=await dkd_json(`https://${dkd_language}.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(dkd_query)}&limit=3`) as dkd_WikiSearch|null;const dkd_modernUrl=dkd_modern?.pages?.find(dkd_page=>dkd_page.thumbnail?.url)?.thumbnail?.url;if(dkd_modernUrl)return dkd_modernUrl.startsWith('//')?`https:${dkd_modernUrl}`:dkd_modernUrl;const dkd_url=`https://${dkd_language}.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrlimit=3&gsrsearch=${encodeURIComponent(dkd_query)}&prop=pageimages&piprop=thumbnail&pithumbsize=320&format=json&origin=*`;const dkd_body=await dkd_json(dkd_url) as dkd_WikiResponse|null;return dkd_body?dkd_source(dkd_body):null;}

async function dkd_resolveLogo(dkd_team:dkd_Team){
  const dkd_cacheKey=dkd_team.dkd_name.trim().toLocaleLowerCase('tr-TR');
  if(dkd_logoCache.has(dkd_cacheKey))return dkd_logoCache.get(dkd_cacheKey)??null;
  const dkd_existing=dkd_logoPending.get(dkd_cacheKey);if(dkd_existing)return dkd_existing;
  const dkd_request=(async()=>{
    try{
      const dkd_cachedManifest=await dkd_manifest(),dkd_manifestLogo=dkd_cachedManifest?.dkd_logos?.[dkd_cacheKey]??dkd_cachedManifest?.dkd_logos?.[dkd_clubKey(dkd_team.dkd_name)];if(dkd_manifestLogo){dkd_logoCache.set(dkd_cacheKey,dkd_manifestLogo);return dkd_manifestLogo;}
      const dkd_context=await dkd_fetchTeamContext(dkd_team);if(dkd_context.dkd_logoUrl){dkd_logoCache.set(dkd_cacheKey,dkd_context.dkd_logoUrl);return dkd_context.dkd_logoUrl;}
      const dkd_key=dkd_clubKey(dkd_team.dkd_name),dkd_alias=dkd_aliases[dkd_key];
      if(dkd_alias){for(const dkd_language of ['en','tr']){const dkd_logo=await dkd_wikiTitle(dkd_language,dkd_alias);if(dkd_logo){dkd_logoCache.set(dkd_cacheKey,dkd_logo);return dkd_logo;}}}
      const dkd_clean=dkd_plain(dkd_team.dkd_name).replace(/\b(tumosan|corendon|arca|caykur|ikas|rams|a s)\b/g,' ').replace(/\s+/g,' ').trim(),dkd_queries=[`${dkd_clean} football club`,`${dkd_clean} futbol kulübü`,dkd_clean];
      for(const dkd_query of dkd_queries){for(const dkd_language of ['en','tr']){const dkd_logo=await dkd_wikiSearch(dkd_language,dkd_query);if(dkd_logo){dkd_logoCache.set(dkd_cacheKey,dkd_logo);return dkd_logo;}}}
      dkd_logoCache.set(dkd_cacheKey,null);return null;
    }finally{dkd_logoPending.delete(dkd_cacheKey);}
  })();
  dkd_logoPending.set(dkd_cacheKey,dkd_request);return dkd_request;
}

export function dkd_TeamLogo({dkd_team,dkd_size=48}:{dkd_team:dkd_Team;dkd_size?:number}){
  const dkd_key=dkd_team.dkd_name.trim().toLocaleLowerCase('tr-TR');
  const [dkd_logo,dkd_setLogo]=dkd_React.useState<string|null>(()=>dkd_logoCache.get(dkd_key)??null),[dkd_failed,dkd_setFailed]=dkd_React.useState(false);
  dkd_React.useEffect(()=>{let dkd_active=true;dkd_setFailed(false);dkd_resolveLogo(dkd_team).then(dkd_value=>{if(dkd_active)dkd_setLogo(dkd_value)});return()=>{dkd_active=false};},[dkd_team.dkd_id,dkd_team.dkd_name]);
  const dkd_radius=Math.max(14,dkd_size*.32);
  return <dkd_RN.View style={{width:dkd_size,height:dkd_size,borderRadius:dkd_radius,backgroundColor:'#F7F9FF',borderWidth:2,borderColor:dkd_team.dkd_color+'80',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
    {!!dkd_logo&&!dkd_failed?<dkd_RN.Image source={{uri:dkd_logo}} resizeMode="contain" onError={()=>dkd_setFailed(true)} style={{width:dkd_size*.9,height:dkd_size*.9}}/>:<dkd_RN.Text style={{fontSize:Math.max(10,dkd_size*.24),fontWeight:'900',color:dkd_team.dkd_color}}>{dkd_team.dkd_short}</dkd_RN.Text>}
  </dkd_RN.View>;
}
