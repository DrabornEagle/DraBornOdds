const dkd_base='https://www.thesportsdb.com/api/v1/json/123';
const dkd_league='4339';

async function dkd_get(dkd_path){
  const dkd_controller=new AbortController();
  const dkd_timer=setTimeout(()=>dkd_controller.abort(),12000);
  try{
    const dkd_response=await fetch(`${dkd_base}/${dkd_path}`,{signal:dkd_controller.signal,headers:{Accept:'application/json'}});
    if(!dkd_response.ok)throw new Error(`HTTP ${dkd_response.status}`);
    return await dkd_response.json();
  }finally{clearTimeout(dkd_timer);}
}
function dkd_valid(dkd_event){return !!(dkd_event?.idEvent&&dkd_event?.strHomeTeam&&dkd_event?.strAwayTeam&&(dkd_event?.dateEvent||dkd_event?.strTimestamp));}

let dkd_events=[];
const dkd_next=await dkd_get(`eventsnextleague.php?id=${dkd_league}`);
dkd_events.push(...(Array.isArray(dkd_next.events)?dkd_next.events:[]));
if(!dkd_events.some(dkd_valid)){
  for(let dkd_offset=0;dkd_offset<15&&!dkd_events.some(dkd_valid);dkd_offset++){
    const dkd_day=new Date(Date.now()+dkd_offset*86400000).toISOString().slice(0,10);
    const dkd_payload=await dkd_get(`eventsday.php?d=${dkd_day}&s=Soccer&l=${dkd_league}`);
    dkd_events.push(...(Array.isArray(dkd_payload.events)?dkd_payload.events:[]));
  }
}
const dkd_match=dkd_events.find(dkd_valid);
if(!dkd_match)throw new Error('TheSportsDB Turkish Super Lig endpoint returned no valid future fixture.');
console.log(JSON.stringify({dkd_status:'ok',dkd_eventId:dkd_match.idEvent,dkd_date:dkd_match.dateEvent||dkd_match.strTimestamp,dkd_home:dkd_match.strHomeTeam,dkd_away:dkd_match.strAwayTeam,dkd_league:dkd_match.strLeague||'Turkish Super Lig'},null,2));
