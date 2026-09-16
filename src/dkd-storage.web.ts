export async function dkd_readStorage():Promise<string|null>{return typeof localStorage==='undefined'?null:localStorage.getItem('dkd-drabornodds-v02');}
export async function dkd_writeStorage(dkd_value:string):Promise<void>{if(typeof localStorage!=='undefined')localStorage.setItem('dkd-drabornodds-v02',dkd_value);}
