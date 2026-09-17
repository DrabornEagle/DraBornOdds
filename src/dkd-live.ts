import type { dkd_Match, dkd_SourceStatus, dkd_Team } from './dkd-types';

const dkd_url='https://xpdiwyxnnrmyvpcqwuyb.supabase.co';
const dkd_key='sb_publishable_cu71JQGPiRusMw_YeZzUbg_6r9r13TG';
const dkd_theSportsDb='https://www.thesportsdb.com/api/v1/json/123';
const dkd_palette=['#B6F36A','#6DBFFF','#C5A0FF','#FF8B78','#FFCE77','#73D3FF','#F59CCD','#8DB8FF'];
type dkd_DbMatch={dbo_match_key:string;dbo_league:string;dbo_country:string|null;dbo_home_team:string;dbo_away_team:string;dbo_start_at:string;dbo_last_seen_at:string};
type dkd_DbAnalysis={dbo_match_key:string;dbo_source_count:number;dbo_home_odds:number|null;dbo_draw_odds:number|null;dbo_away_odds:number|null;dbo_home_probability:number|null;dbo_draw_probability:number|null;dbo_away_probability:number|null;dbo_quality_score:number;dbo_explanation:string|null;dbo_updated_at:string};
type dkd_DbSource={dbo_source_id:string;dbo_label:string;dbo_last_status:string;dbo_last_run_at:string|null;dbo_last_success_at:string|null;dbo_last_error:string|null;dbo_last_match_count:number};
type dkd_TsdbEvent={idEvent?:string;strLeague?:string;strCountry?:string;strHomeTeam?:string;strAwayTeam?:string;dateEvent?:string;strTime?:string;strTimestamp?:string};
type dkd_TsdbEvents={events?:dkd_TsdbEvent[]|null};

async function dkd_request<T>(dkd_address:string,dkd_headers?:Record<string,string>,dkd_timeout=12000):Promise<T>{
  const dkd_controller=new AbortController();const dkd_timer=setTimeout(()=>dkd_controller.abort(),dkd_timeout);
  try{const dkd_response=await fetch(dkd_address,{headers:dkd_headers,signal:dkd_controller.signal});if(!dkd_response.ok)throw new Error(`HTTP ${dkd_response.status}`);return await dkd_response.json() as T;}finally{clearTimeout(dkd_timer);}
}
async function dkd_get<T>(dkd_path:string):Promise<T>{try{return await dkd_request<T>(`${dkd_url}/rest/v1/${dkd_path}`,{apikey:dkd_key,Authorization:`Bearer ${dkd_key}`});}catch(dkd_failure){if(dkd_failure instanceof Error&&dkd_failure.name==='AbortError')throw new Error('Canlı oran servisi zaman aşımına uğradı.');throw new Error(dkd_failure instanceof Error?`Canlı oran servisi: ${dkd_failure.message}`:'Canlı oran servisine ulaşılamadı.');}}
async function dkd_tsdbGet<T>(dkd_path:string):Promise<T>{try{return await dkd_request<T>(`${dkd_theSportsDb}/${dkd_path}`,undefined,9000);}catch(dkd_failure){if(dkd_failure instanceof Error&&dkd_failure.name==='AbortError')throw new Error('Fikstür servisi zaman aşımına uğradı.');throw new Error(dkd_failure instanceof Error?`Fikstür servisi: ${dkd_failure.message}`:'Fikstür servisine ulaşılamadı.');}}
function dkd_hash(dkd_value:string){let dkd_h=0;for(let dkd_i=0;dkd_i<dkd_value.length;dkd_i++)dkd_h=((dkd_h<<5)-dkd_h+dkd_value.charCodeAt(dkd_i))|0;return Math.abs(dkd_h);}
function dkd_short(dkd_name:string){const dkd_parts=dkd_name.trim().split(/\s+/).filter(Boolean);return(dkd_parts.length===1?dkd_parts[0]!.slice(0,3):dkd_parts.slice(0,3).map(dkd_item=>dkd_item[0]).join('')).toLocaleUpperCase('tr-TR');}
function dkd_team(dkd_name:string):dkd_Team{const dkd_color=dkd_palette[dkd_hash(dkd_name)%dkd_palette.length]!;return{dkd_id:`dkd_team_${dkd_hash(dkd_name)}`,dkd_name,dkd_short:dkd_short(dkd_name),dkd_color,dkd_attack:1,dkd_defense:1,dkd_form:[]};}
function dkd_dayKey(dkd_date:Date){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(dkd_date);}
function dkd_offset(dkd_iso:string){const dkd_today=dkd_dayKey(new Date());const dkd_target=dkd_dayKey(new Date(dkd_iso));const [dkd_ty,dkd_tm,dkd_td]=dkd_today.split('-').map(Number);const [dkd_y,dkd_m,dkd_d]=dkd_target.split('-').map(Number);return Math.round((Date.UTC(dkd_y!,dkd_m!-1,dkd_d!)-Date.UTC(dkd_ty!,dkd_tm!-1,dkd_td!))/86400000);}
function dkd_clock(dkd_iso:string){return new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(dkd_iso));}
function dkd_number(dkd_value:number|null){return typeof dkd_value==='number'&&Number.isFinite(dkd_value)?dkd_value:0;}
function dkd_errorText(dkd_failure:unknown){return dkd_failure instanceof Error?dkd_failure.message:'Bilinmeyen bağlantı hatası.';}
function dkd_eventIso(dkd_event:dkd_TsdbEvent){let dkd_raw=dkd_event.strTimestamp?.trim();if(!dkd_raw&&dkd_event.dateEvent){const dkd_time=(dkd_event.strTime?.trim()||'12:00:00').replace(/Z$/i,'');dkd_raw=`${dkd_event.dateEvent}T${dkd_time}`;}if(!dkd_raw)return null;dkd_raw=dkd_raw.replace(' ','T');if(!/(?:Z|[+-]\d\d:?\d\d)$/i.test(dkd_raw))dkd_raw+='Z';const dkd_date=new Date(dkd_raw);return Number.isFinite(dkd_date.getTime())?dkd_date.toISOString():null;}
function dkd_fixtureMatch(dkd_event:dkd_TsdbEvent):dkd_Match|null{const dkd_startAt=dkd_eventIso(dkd_event),dkd_homeName=dkd_event.strHomeTeam?.trim(),dkd_awayName=dkd_event.strAwayTeam?.trim();if(!dkd_startAt||!dkd_homeName||!dkd_awayName)return null;const dkd_league=dkd_event.strLeague?.trim()||'Turkish Super Lig',dkd_home=dkd_team(dkd_homeName),dkd_away=dkd_team(dkd_awayName);return{dkd_id:`tsdb_${dkd_event.idEvent||dkd_hash(`${dkd_homeName}_${dkd_awayName}_${dkd_startAt}`)}`,dkd_league,dkd_country:dkd_event.strCountry?.trim()||'Türkiye',dkd_color:dkd_palette[dkd_hash(dkd_league)%dkd_palette.length]!,dkd_home,dkd_away,dkd_offset:dkd_offset(dkd_startAt),dkd_time:dkd_clock(dkd_startAt),dkd_startAt,dkd_sourceCount:1,dkd_quality:.45,dkd_explanation:'Gerçek fikstür açık spor verisi kaynağından doğrulandı. Güvenilir 1X2 oranı gelene kadar analiz ve kupon seçimi açılmaz.',dkd_lastSeenAt:new Date().toISOString(),dkd_venue:'',dkd_temperature:0,dkd_weather:'',dkd_xgHome:0,dkd_xgAway:0,dkd_markets:[],dkd_history:[],dkd_absences:[0,0],dkd_rest:[0,0]};}
function dkd_mergeKey(dkd_match:dkd_Match){const dkd_clean=(dkd_value:string)=>dkd_value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');return`${dkd_dayKey(new Date(dkd_match.dkd_startAt))}_${dkd_clean(dkd_match.dkd_home.dkd_name)}_${dkd_clean(dkd_match.dkd_away.dkd_name)}`;}
export const dkd_fixtureDay=()=>dkd_dayKey(new Date());
export function dkd_dateFromIso(dkd_iso:string,dkd_long=false){const dkd_off=dkd_offset(dkd_iso);if(!dkd_long&&dkd_off===0)return'Bugün';if(!dkd_long&&dkd_off===1)return'Yarın';return new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',day:'numeric',month:'short',...(dkd_long?{weekday:'long' as const}:{})}).format(new Date(dkd_iso));}

async function dkd_fetchOddsBackend(){
  const dkd_now=new Date(Date.now()-30*60000).toISOString();
  const [dkd_matchRows,dkd_analysisRows,dkd_sourceRows]=await Promise.all([
    dkd_get<dkd_DbMatch[]>(`dbo_matches?select=dbo_match_key,dbo_league,dbo_country,dbo_home_team,dbo_away_team,dbo_start_at,dbo_last_seen_at&dbo_status=eq.scheduled&dbo_start_at=gte.${encodeURIComponent(dkd_now)}&order=dbo_start_at.asc&limit=250`),
    dkd_get<dkd_DbAnalysis[]>('dbo_match_analysis?select=dbo_match_key,dbo_source_count,dbo_home_odds,dbo_draw_odds,dbo_away_odds,dbo_home_probability,dbo_draw_probability,dbo_away_probability,dbo_quality_score,dbo_explanation,dbo_updated_at&order=dbo_updated_at.desc&limit=500'),
    dkd_get<dkd_DbSource[]>('dbo_site_collectors?select=dbo_source_id,dbo_label,dbo_last_status,dbo_last_run_at,dbo_last_success_at,dbo_last_error,dbo_last_match_count&dbo_enabled=eq.true&order=dbo_label.asc'),
  ]);
  const dkd_analysis=new Map(dkd_analysisRows.map(dkd_row=>[dkd_row.dbo_match_key,dkd_row]));const dkd_matches:dkd_Match[]=[];
  for(const dkd_row of dkd_matchRows){const dkd_a=dkd_analysis.get(dkd_row.dbo_match_key);if(!dkd_a)continue;const dkd_odds=[dkd_number(dkd_a.dbo_home_odds),dkd_number(dkd_a.dbo_draw_odds),dkd_number(dkd_a.dbo_away_odds)],dkd_probs=[dkd_number(dkd_a.dbo_home_probability),dkd_number(dkd_a.dbo_draw_probability),dkd_number(dkd_a.dbo_away_probability)];if(dkd_odds.some(dkd_value=>dkd_value<=1)||dkd_probs.some(dkd_value=>dkd_value<=0))continue;const dkd_home=dkd_team(dkd_row.dbo_home_team),dkd_away=dkd_team(dkd_row.dbo_away_team);dkd_matches.push({dkd_id:dkd_row.dbo_match_key,dkd_league:dkd_row.dbo_league||'Futbol',dkd_country:dkd_row.dbo_country||'',dkd_color:dkd_palette[dkd_hash(dkd_row.dbo_league||'Futbol')%dkd_palette.length]!,dkd_home,dkd_away,dkd_offset:dkd_offset(dkd_row.dbo_start_at),dkd_time:dkd_clock(dkd_row.dbo_start_at),dkd_startAt:dkd_row.dbo_start_at,dkd_sourceCount:dkd_a.dbo_source_count,dkd_quality:dkd_a.dbo_quality_score,dkd_explanation:dkd_a.dbo_explanation||'Güncel 1X2 oranları normalize edilerek piyasa olasılığı üretildi.',dkd_lastSeenAt:dkd_row.dbo_last_seen_at,dkd_venue:'',dkd_temperature:0,dkd_weather:'',dkd_xgHome:0,dkd_xgAway:0,dkd_markets:[{dkd_key:'home',dkd_label:'Maç sonucu 1',dkd_short:'MS 1',dkd_odds:dkd_odds[0]!,dkd_probability:dkd_probs[0]!},{dkd_key:'draw',dkd_label:'Maç sonucu X',dkd_short:'MS X',dkd_odds:dkd_odds[1]!,dkd_probability:dkd_probs[1]!},{dkd_key:'away',dkd_label:'Maç sonucu 2',dkd_short:'MS 2',dkd_odds:dkd_odds[2]!,dkd_probability:dkd_probs[2]!}],dkd_history:[],dkd_absences:[0,0],dkd_rest:[0,0]});}
  const dkd_sources:dkd_SourceStatus[]=dkd_sourceRows.map(dkd_row=>({dkd_id:dkd_row.dbo_source_id,dkd_name:dkd_row.dbo_label,dkd_status:dkd_row.dbo_last_status,dkd_lastRunAt:dkd_row.dbo_last_run_at,dkd_lastSuccessAt:dkd_row.dbo_last_success_at,dkd_lastError:dkd_row.dbo_last_error,dkd_matchCount:dkd_row.dbo_last_match_count||0}));
  return{dkd_matches,dkd_sources};
}

async function dkd_fetchFixtureDays(dkd_start:number,dkd_count:number){const dkd_paths=Array.from({length:dkd_count},(dkd_unused,dkd_index)=>{const dkd_day=dkd_dayKey(new Date(Date.now()+(dkd_start+dkd_index)*86400000));return`eventsday.php?d=${dkd_day}&s=Soccer&l=4339`;});const dkd_responses=await Promise.allSettled(dkd_paths.map(dkd_path=>dkd_tsdbGet<dkd_TsdbEvents>(dkd_path)));return dkd_responses.flatMap(dkd_result=>dkd_result.status==='fulfilled'?(dkd_result.value.events||[]):[]);}
async function dkd_fetchFixtureFallback(){
  const dkd_startedAt=new Date().toISOString();
  const dkd_events=await dkd_fetchFixtureDays(0,8);
  if(dkd_events.length<3)dkd_events.push(...await dkd_fetchFixtureDays(8,7));
  if(!dkd_events.length){const dkd_league=await dkd_tsdbGet<dkd_TsdbEvents>('eventsnextleague.php?id=4339');dkd_events.push(...(dkd_league.events||[]));}
  const dkd_seen=new Set<string>(),dkd_matches:dkd_Match[]=[];const dkd_cutoff=Date.now()-6*3600000;
  for(const dkd_event of dkd_events){const dkd_match=dkd_fixtureMatch(dkd_event);if(!dkd_match||new Date(dkd_match.dkd_startAt).getTime()<dkd_cutoff||dkd_seen.has(dkd_match.dkd_id))continue;dkd_seen.add(dkd_match.dkd_id);dkd_matches.push(dkd_match);}
  dkd_matches.sort((dkd_a,dkd_b)=>new Date(dkd_a.dkd_startAt).getTime()-new Date(dkd_b.dkd_startAt).getTime());
  const dkd_source:dkd_SourceStatus={dkd_id:'thesportsdb',dkd_name:'Açık Süper Lig fikstür kaynağı',dkd_status:dkd_matches.length?'ok':'degraded',dkd_lastRunAt:dkd_startedAt,dkd_lastSuccessAt:dkd_matches.length?dkd_startedAt:null,dkd_lastError:dkd_matches.length?null:'Güncel Süper Lig fikstürü döndürülmedi.',dkd_matchCount:dkd_matches.length};
  return{dkd_matches,dkd_source};
}

export async function dkd_fetchLive(){
  const [dkd_backendResult,dkd_fixtureResult]=await Promise.allSettled([dkd_fetchOddsBackend(),dkd_fetchFixtureFallback()]);
  const dkd_backend=dkd_backendResult.status==='fulfilled'?dkd_backendResult.value:{dkd_matches:[],dkd_sources:[] as dkd_SourceStatus[]};
  const dkd_fixture=dkd_fixtureResult.status==='fulfilled'?dkd_fixtureResult.value:{dkd_matches:[],dkd_source:null};
  if(dkd_backendResult.status==='rejected'&&dkd_fixtureResult.status==='rejected')throw new Error(`${dkd_errorText(dkd_backendResult.reason)} ${dkd_errorText(dkd_fixtureResult.reason)}`);
  const dkd_byKey=new Map<string,dkd_Match>();
  for(const dkd_match of dkd_fixture.dkd_matches)dkd_byKey.set(dkd_mergeKey(dkd_match),dkd_match);
  for(const dkd_match of dkd_backend.dkd_matches)dkd_byKey.set(dkd_mergeKey(dkd_match),dkd_match);
  const dkd_matches=[...dkd_byKey.values()].sort((dkd_a,dkd_b)=>new Date(dkd_a.dkd_startAt).getTime()-new Date(dkd_b.dkd_startAt).getTime());
  const dkd_sources=dkd_fixture.dkd_source?[dkd_fixture.dkd_source,...dkd_backend.dkd_sources]:dkd_backend.dkd_sources;
  return{dkd_matches,dkd_sources,dkd_loadedAt:new Date().toISOString()};
}
