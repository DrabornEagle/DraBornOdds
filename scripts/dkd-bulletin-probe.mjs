const dkd_urls=['https://www.iddaatahmin11.com/iddaa-programi.html','https://www.iddaaorantahmin.com/iddaa-bulteni'];
function dkd_decode(dkd_value){return dkd_value.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&#(\d+);/g,(dkd_all,dkd_code)=>String.fromCodePoint(Number(dkd_code))).replace(/\s+/g,' ').trim();}
for(const dkd_url of dkd_urls){
  const dkd_response=await fetch(dkd_url,{headers:{Accept:'text/html,application/xhtml+xml','User-Agent':'DraBornOdds/0.2 public-bulletin-reader'}});
  const dkd_html=await dkd_response.text();
  const dkd_rawRows=[...dkd_html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(dkd_match=>dkd_match[1]);
  const dkd_rows=dkd_rawRows.map(dkd_row=>[...dkd_row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(dkd_cell=>dkd_decode(dkd_cell[1]))).filter(dkd_cells=>dkd_cells.length>=8);
  const dkd_linkRow=dkd_rawRows.find(dkd_row=>/\+\d+/.test(dkd_decode(dkd_row)));
  const dkd_links=dkd_linkRow?[...dkd_linkRow.matchAll(/href=["']([^"']+)["']/gi)].map(dkd_match=>dkd_match[1]):[];
  const dkd_dataAttrs=dkd_linkRow?[...dkd_linkRow.matchAll(/\b(data-[\w-]+)=["']([^"']*)["']/gi)].map(dkd_match=>[dkd_match[1],dkd_match[2]]):[];
  const dkd_scripts=[...dkd_html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(dkd_match=>dkd_match[1]).filter(dkd_script=>/3221681|3203892|showOdds|odds|oran/i.test(dkd_script)).slice(0,3).map(dkd_script=>dkd_script.replace(/\s+/g,' ').slice(0,2500));
  console.log(JSON.stringify({dkd_url,dkd_status:dkd_response.status,dkd_bytes:dkd_html.length,dkd_rows:dkd_rows.length,dkd_links:dkd_links.slice(-20),dkd_dataAttrs:dkd_dataAttrs.slice(-30),dkd_rawExpandedRow:dkd_linkRow?.replace(/\s+/g,' ').slice(0,6000)??null,dkd_scripts,dkd_samples:dkd_rows.slice(0,3)},null,2));
}