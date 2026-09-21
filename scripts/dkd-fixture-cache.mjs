import { writeFile } from 'node:fs/promises';

const dkd_url='https://www.tff.org/?pageID=198';
const dkd_output=process.env.DKD_FIXTURE_CACHE_PATH||'dkd-fixtures.json';
const dkd_softFail=process.env.DKD_FIXTURE_SOFT_FAIL==='1';
const dkd_sleep=(dkd_ms)=>new Promise(dkd_resolve=>setTimeout(dkd_resolve,dkd_ms));

function dkd_decodeTurkish(dkd_buffer){
  const dkd_map=new Map([[0xD0,0x011E],[0xDD,0x0130],[0xDE,0x015E],[0xF0,0x011F],[0xFD,0x0131],[0xFE,0x015F]]);
  return Array.from(new Uint8Array(dkd_buffer),dkd_byte=>String.fromCodePoint(dkd_map.get(dkd_byte)??dkd_byte)).join('');
}
function dkd_iso(dkd_date,dkd_time){
  const [dkd_day,dkd_month,dkd_year]=dkd_date.split('.');
  const dkd_value=new Date(`${dkd_year}-${dkd_month}-${dkd_day}T${dkd_time}:00+03:00`);
  return Number.isFinite(dkd_value.getTime())?dkd_value.toISOString():null;
}
async function dkd_fetchHtml(){
  let dkd_lastError;
  for(let dkd_attempt=1;dkd_attempt<=3;dkd_attempt++){
    const dkd_controller=new AbortController();
    const dkd_timer=setTimeout(()=>dkd_controller.abort(),15000);
    try{
      const dkd_response=await fetch(dkd_url,{signal:dkd_controller.signal,headers:{Accept:'text/html,application/xhtml+xml','User-Agent':'DraBornOdds/0.7 public-fixture-cache'}});
      if(!dkd_response.ok)throw new Error(`TFF HTTP ${dkd_response.status}`);
      const dkd_type=dkd_response.headers.get('content-type')||'';
      return /utf-8/i.test(dkd_type)?await dkd_response.text():dkd_decodeTurkish(await dkd_response.arrayBuffer());
    }catch(dkd_error){
      dkd_lastError=dkd_error;
      if(dkd_attempt<3)await dkd_sleep(dkd_attempt*1500);
    }finally{
      clearTimeout(dkd_timer);
    }
  }
  throw dkd_lastError instanceof Error?dkd_lastError:new Error('TFF fixture request failed.');
}
async function dkd_main(){
  const dkd_html=await dkd_fetchHtml();
  const dkd_text=dkd_html
    .replace(/<script\b[\s\S]*?<\/script>/gi,' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;|&#160;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/&#(\d+);/g,(dkd_all,dkd_code)=>String.fromCodePoint(Number(dkd_code)))
    .replace(/\s+/g,' ')
    .trim();
  const dkd_pattern=/(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})\s+(.{2,90}?)\s+-\s+(.{2,90}?)\s+Detaylar\b/g;
  const dkd_cutoff=Date.now()-6*3600000;
  const dkd_fixtures=[];
  for(const dkd_match of dkd_text.matchAll(dkd_pattern)){
    const dkd_startAt=dkd_iso(dkd_match[1],dkd_match[2]);
    const dkd_home=dkd_match[3]?.trim();
    const dkd_away=dkd_match[4]?.trim();
    if(!dkd_startAt||!dkd_home||!dkd_away||Date.parse(dkd_startAt)<dkd_cutoff)continue;
    if(/[�]/.test(`${dkd_home}${dkd_away}`))throw new Error('TFF Turkish text charset could not be decoded cleanly.');
    dkd_fixtures.push({dkd_startAt,dkd_home,dkd_away});
  }
  if(!dkd_fixtures.length)throw new Error('TFF public fixture page returned no current/future fixtures.');
  const dkd_payload={dkd_updatedAt:new Date().toISOString(),dkd_source:'TFF public HTML pageID=198',dkd_fixtures};
  await writeFile(dkd_output,`${JSON.stringify(dkd_payload,null,2)}\n`,'utf8');
  console.log(JSON.stringify({dkd_status:'ok',dkd_output,dkd_count:dkd_fixtures.length,dkd_first:dkd_fixtures[0]},null,2));
}
try{
  await dkd_main();
}catch(dkd_error){
  const dkd_message=dkd_error instanceof Error?dkd_error.message:String(dkd_error);
  if(!dkd_softFail)throw dkd_error;
  console.warn(`::warning::TFF fixture refresh skipped; previous verified cache is preserved. ${dkd_message}`);
  console.log(JSON.stringify({dkd_status:'stale',dkd_preserved:true,dkd_reason:dkd_message},null,2));
}
