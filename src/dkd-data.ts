export function dkd_date(dkd_offset:number,dkd_long=false):string{
  const dkd_now=new Date();
  const dkd_istanbul=new Date(dkd_now.toLocaleString('en-US',{timeZone:'Europe/Istanbul'}));
  dkd_istanbul.setDate(dkd_istanbul.getDate()+dkd_offset);
  if(!dkd_long&&dkd_offset===0)return'Bugün';
  if(!dkd_long&&dkd_offset===1)return'Yarın';
  return dkd_istanbul.toLocaleDateString('tr-TR',{day:'numeric',month:'short',...(dkd_long?{weekday:'long' as const}:{})});
}
