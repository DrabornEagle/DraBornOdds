import type { dkd_Match, dkd_SourceStatus, dkd_Team } from './dkd-types';

const dkd_cacheUrl='https://raw.githubusercontent.com/DrabornEagle/DraBornOdds/dkd-live-cache/data/dkd-fixtures.json';
const dkd_palette=['#B6F36A','#6DBFFF','#C5A0FF','#FF8B78','#FFCE77','#73D3FF','#F59CCD','#8DB8FF'];
type dkd_CacheFixture={dkd_startAt:string;dkd_home:string;dkd_away:string};
type dkd_CachePayload={dkd_updatedAt:string;dkd_source:string;dkd_fixtures:dkd_CacheFixture[]};

function dkd_hash(dkd_value:string){let dkd_hashValue=0;for(let dkd_index=0;dkd_index<dkd_value.length;dkd_index++)dkd_hashValue=((dkd_hashValue<<5)-dkd_hashValue+dkd_value.charCodeAt(dkd_index))|0;return Math.abs(dkd_hashValue);}
function dkd_short(dkd_name:string){const dkd_parts=dkd_name.trim().split(/\s+/).filter(Boolean);return(dkd_parts.length===1?dkd_parts[0]!.slice(0,3):dkd_parts.slice(0,3).map(dkd_part=>dkd_part[0]).join('')).toLocaleUpperCase('tr-TR');}
function dkd_team(dkd_name:string):dkd_Team{return{dkd_id:`dkd_cache_team_${dkd_hash(dkd_name)}`,dkd_name,dkd_short:dkd_short(dkd_name),dkd_color:dkd_palette[dkd_hash(dkd_name)%dkd_palette.length]!,dkd_attack:1,dkd_defense:1,dkd_form:[]};}
function dkd_dayKey(dkd_date:Date){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(dkd_date);}
function dkd_offset(dkd_iso:string){const dkd_today=dkd_dayKey(new Date()),dkd_target=dkd_dayKey(new Date(dkd_iso)),[dkd_ty,dkd_tm,dkd_td]=dkd_today.split('-').map(Number),[dkd_y,dkd_m,dkd_d]=dkd_target.split('-').map(Number);return Math.round((Date.UTC(dkd_y!,dkd_m!-1,dkd_d!)-Date.UTC(dkd_ty!,dkd_tm!-1,dkd_td!))/86400000);}
function dkd_clock(dkd_iso:string){return new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(dkd_iso));}
function dkd_match(dkd_fixture:dkd_CacheFixture):dkd_Match{const dkd_league='Trendyol Süper Lig',dkd_home=dkd_team(dkd_fixture.dkd_home),dkd_away=dkd_team(dkd_fixture.dkd_away);return{dkd_id:`tff_cache_${dkd_hash(`${dkd_fixture.dkd_home}_${dkd_fixture.dkd_away}_${dkd_fixture.dkd_startAt}`)}`,dkd_league,dkd_country:'Türkiye',dkd_color:dkd_palette[dkd_hash(dkd_league)%dkd_palette.length]!,dkd_home,dkd_away,dkd_offset:dkd_offset(dkd_fixture.dkd_startAt),dkd_time:dkd_clock(dkd_fixture.dkd_startAt),dkd_startAt:dkd_fixture.dkd_startAt,dkd_sourceCount:1,dkd_quality:.55,dkd_explanation:'Gerçek fikstür TFF herkese açık sayfasından merkezi olarak doğrulanıp önbelleklendi. Doğrulanmış oran gelene kadar analiz seçimi açılmaz.',dkd_lastSeenAt:new Date().toISOString(),dkd_venue:'',dkd_temperature:0,dkd_weather:'',dkd_xgHome:0,dkd_xgAway:0,dkd_markets:[],dkd_history:[],dkd_absences:[0,0],dkd_rest:[0,0]};}

export async function dkd_fetchFixtureCache(){
  const dkd_controller=new AbortController();const dkd_timer=setTimeout(()=>dkd_controller.abort(),8000);
  try{
    const dkd_response=await fetch(`${dkd_cacheUrl}?dkd_t=${Date.now()}`,{signal:dkd_controller.signal,headers:{Accept:'application/json'}});
    if(!dkd_response.ok)throw new Error(`Fikstür önbelleği HTTP ${dkd_response.status}`);
    const dkd_payload=await dkd_response.json() as dkd_CachePayload;
    if(!dkd_payload||!Array.isArray(dkd_payload.dkd_fixtures))throw new Error('Fikstür önbelleği biçimi geçersiz.');
    const dkd_cutoff=Date.now()-6*3600000;
    const dkd_matches=dkd_payload.dkd_fixtures.filter(dkd_fixture=>typeof dkd_fixture.dkd_home==='string'&&typeof dkd_fixture.dkd_away==='string'&&Number.isFinite(Date.parse(dkd_fixture.dkd_startAt))&&Date.parse(dkd_fixture.dkd_startAt)>=dkd_cutoff).map(dkd_match).sort((dkd_a,dkd_b)=>Date.parse(dkd_a.dkd_startAt)-Date.parse(dkd_b.dkd_startAt));
    if(!dkd_matches.length)throw new Error('Önbellekte yaklaşan gerçek fikstür yok.');
    const dkd_source:dkd_SourceStatus={dkd_id:'tff_public_cache',dkd_name:'TFF · merkezi fikstür önbelleği',dkd_status:'ok',dkd_lastRunAt:dkd_payload.dkd_updatedAt||new Date().toISOString(),dkd_lastSuccessAt:dkd_payload.dkd_updatedAt||new Date().toISOString(),dkd_lastError:null,dkd_matchCount:dkd_matches.length};
    return{dkd_matches,dkd_source,dkd_loadedAt:new Date().toISOString()};
  }finally{clearTimeout(dkd_timer);}
}
