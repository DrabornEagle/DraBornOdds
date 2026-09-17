const dkd_url='https://www.tff.org/?pageID=198';

const dkd_controller=new AbortController();
const dkd_timer=setTimeout(()=>dkd_controller.abort(),15000);
let dkd_html='';
try{
  const dkd_response=await fetch(dkd_url,{signal:dkd_controller.signal,headers:{Accept:'text/html,application/xhtml+xml','User-Agent':'DraBornOdds/0.2 public-fixture-smoke'}});
  if(!dkd_response.ok)throw new Error(`TFF HTTP ${dkd_response.status}`);
  dkd_html=await dkd_response.text();
}finally{clearTimeout(dkd_timer);}

const dkd_text=dkd_html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#(\d+);/g,(dkd_all,dkd_code)=>String.fromCodePoint(Number(dkd_code))).replace(/\s+/g,' ').trim();
const dkd_pattern=/(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})\s+(.{2,90}?)\s+-\s+(.{2,90}?)\s+Detaylar\b/g;
const dkd_rows=[...dkd_text.matchAll(dkd_pattern)].map(dkd_match=>({dkd_date:dkd_match[1],dkd_time:dkd_match[2],dkd_home:dkd_match[3]?.trim(),dkd_away:dkd_match[4]?.trim()}));
if(!dkd_rows.length)throw new Error('TFF public fixture page returned no parseable dated fixtures.');
const dkd_future=dkd_rows.find(dkd_row=>{const [dkd_day,dkd_month,dkd_year]=dkd_row.dkd_date.split('.');return new Date(`${dkd_year}-${dkd_month}-${dkd_day}T${dkd_row.dkd_time}:00+03:00`).getTime()>Date.now()-6*3600000;});
if(!dkd_future)throw new Error('TFF public fixture page returned no current/future fixture.');
console.log(JSON.stringify({dkd_status:'ok',dkd_source:'TFF public HTML',dkd_count:dkd_rows.length,...dkd_future},null,2));
