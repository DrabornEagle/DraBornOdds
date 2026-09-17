import { writeFile } from 'node:fs/promises';

const dkd_url='https://www.tff.org/?pageID=198';
const dkd_output=process.env.DKD_FIXTURE_CACHE_PATH||'dkd-fixtures.json';
function dkd_decodeTurkish(dkd_buffer){const dkd_map=new Map([[0xD0,0x011E],[0xDD,0x0130],[0xDE,0x015E],[0xF0,0x011F],[0xFD,0x0131],[0xFE,0x015F]]);return Array.from(new Uint8Array(dkd_buffer),dkd_byte=>String.fromCodePoint(dkd_map.get(dkd_byte)??dkd_byte)).join('');}
function dkd_iso(dkd_date,dkd_time){const [dkd_day,dkd_month,dkd_year]=dkd_date.split('.');const dkd_value=new Date(`${dkd_year}-${dkd_month}-${dkd_day}T${dkd_time}:00+03:00`);return Number.isFinite(dkd_value.getTime())?dkd_value.toISOString():null;}
const dkd_controller=new AbortController();const dkd_timer=setTimeout(()=>dkd_controller.abort(),15000);let dkd_html='';
try{const dkd_response=await fetch(dkd_url,{signal:dkd_controller.signal,headers:{Accept:'text/html,application/xhtml+xml','User-Agent':'DraBornOdds/0.7 public-fixture-cache'}});if(!dkd_response.ok)throw new Error(`TFF HTTP ${dkd_response.status}`);const dkd_type=dkd_response.headers.get('content-type')||'';dkd_html=/utf-8/i.test(dkd_type)?await dkd_response.text():dkd_decodeTurkish(await dkd_response.arrayBuffer());}finally{clearTimeout(dkd_timer);}
const dkd_text=dkd_html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#(\d+);/g,(dkd_all,dkd_code)=>String.fromCodePoint(Number(dkd_code))).replace(/\s+/g,' ').trim();
const dkd_pattern=/(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})\s+(.{2,90}?)\s+-\s+(.{2,90}?)\s+Detaylar\b/g;
const dkd_cutoff=Date.now()-6*3600000;const dkd_fixtures=[];
for(const dkd_match of dkd_text.matchAll(dkd_pattern)){const dkd_startAt=dkd_iso(dkd_match[1],dkd_match[2]);const dkd_home=dkd_match[3]?.trim(),dkd_away=dkd_match[4]?.trim();if(!dkd_startAt||!dkd_home||!dkd_away||Date.parse(dkd_startAt)<dkd_cutoff)continue;if(/[�]/.test(`${dkd_home}${dkd_away}`))throw new Error('TFF Turkish text charset could not be decoded cleanly.');dkd_fixtures.push({dkd_startAt,dkd_home,dkd_away});}
if(!dkd_fixtures.length)throw new Error('TFF public fixture page returned no current/future fixtures.');
const dkd_payload={dkd_updatedAt:new Date().toISOString(),dkd_source:'TFF public HTML pageID=198',dkd_fixtures};await writeFile(dkd_output,`${JSON.stringify(dkd_payload,null,2)}\n`,'utf8');console.log(JSON.stringify({dkd_status:'ok',dkd_output,dkd_count:dkd_fixtures.length,dkd_first:dkd_fixtures[0]},null,2));
