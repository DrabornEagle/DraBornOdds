from pathlib import Path
import json,re

p=Path('src/dkd-engine.ts');s=p.read_text()
s=s.replace("export const dkd_risks:Record<dkd_Risk,{dkd_name:string;dkd_subtitle:string;dkd_color:string;dkd_target:number;dkd_icon:string}>={low:{dkd_name:'Düşük risk',dkd_subtitle:'En yüksek veri güveni',dkd_color:'#B6F36A',dkd_target:.78,dkd_icon:'shield'},balanced:{dkd_name:'Dengeli',dkd_subtitle:'Güven ve oran dengesi',dkd_color:'#6DBFFF',dkd_target:.60,dkd_icon:'balance'},high:{dkd_name:'Yüksek getiri',dkd_subtitle:'Daha yüksek oran odağı',dkd_color:'#C5A0FF',dkd_target:.43,dkd_icon:'trend'},ultra:{dkd_name:'Ultra getiri',dkd_subtitle:'En yüksek belirsizlik',dkd_color:'#FF8B78',dkd_target:.28,dkd_icon:'bolt'}};", "export const dkd_risks:Record<dkd_Risk,{dkd_name:string;dkd_subtitle:string;dkd_color:string;dkd_target:number;dkd_icon:string}>={low:{dkd_name:'Düşük risk',dkd_subtitle:'Yüksek olasılık · sınırlı oran',dkd_color:'#B6F36A',dkd_target:.74,dkd_icon:'shield'},balanced:{dkd_name:'Dengeli',dkd_subtitle:'Olasılık ve getiri dengesi',dkd_color:'#6DBFFF',dkd_target:.52,dkd_icon:'balance'},high:{dkd_name:'Yüksek getiri',dkd_subtitle:'Orta olasılık · yüksek getiri',dkd_color:'#C5A0FF',dkd_target:.34,dkd_icon:'trend'},ultra:{dkd_name:'Ultra getiri',dkd_subtitle:'Düşük olasılık · kontrollü yüksek oran',dkd_color:'#FF8B78',dkd_target:.22,dkd_icon:'bolt'}};")
pattern=r"function dkd_marketRank\(.*?\nexport function dkd_generate\(.*?\nexport function dkd_summarize"
replacement="""const dkd_profileBands:Record<dkd_Risk,{dkd_pMin:number;dkd_pMax:number;dkd_oMin:number;dkd_oMax:number;dkd_pTarget:number;dkd_oTarget:number;dkd_diversity:number}>={low:{dkd_pMin:.56,dkd_pMax:.94,dkd_oMin:1.05,dkd_oMax:2.20,dkd_pTarget:.74,dkd_oTarget:1.38,dkd_diversity:.12},balanced:{dkd_pMin:.38,dkd_pMax:.74,dkd_oMin:1.28,dkd_oMax:3.00,dkd_pTarget:.52,dkd_oTarget:1.95,dkd_diversity:.28},high:{dkd_pMin:.22,dkd_pMax:.54,dkd_oMin:1.65,dkd_oMax:4.80,dkd_pTarget:.34,dkd_oTarget:2.75,dkd_diversity:.38},ultra:{dkd_pMin:.10,dkd_pMax:.40,dkd_oMin:2.20,dkd_oMax:7.50,dkd_pTarget:.22,dkd_oTarget:4.00,dkd_diversity:.46}};
function dkd_outside(dkd_value:number,dkd_min:number,dkd_max:number){return dkd_value<dkd_min?dkd_min-dkd_value:dkd_value>dkd_max?dkd_value-dkd_max:0;}
function dkd_marketRank(dkd_match:dkd_Match,dkd_market:dkd_Market,dkd_risk:dkd_Risk){const dkd_p=Math.max(.005,Math.min(.995,dkd_market.dkd_probability)),dkd_o=Math.max(1.01,dkd_market.dkd_odds),dkd_q=Math.max(.15,Math.min(1,dkd_match.dkd_quality)),dkd_b=dkd_profileBands[dkd_risk],dkd_pDistance=Math.abs(dkd_p-dkd_b.dkd_pTarget),dkd_oDistance=Math.abs(Math.log(dkd_o/dkd_b.dkd_oTarget)),dkd_pBand=dkd_outside(dkd_p,dkd_b.dkd_pMin,dkd_b.dkd_pMax),dkd_oBand=dkd_o<dkd_b.dkd_oMin?Math.log(dkd_b.dkd_oMin/dkd_o):dkd_o>dkd_b.dkd_oMax?Math.log(dkd_o/dkd_b.dkd_oMax):0,dkd_extreme=dkd_o>dkd_b.dkd_oMax*1.55?Math.log(dkd_o/(dkd_b.dkd_oMax*1.55))*4:0,dkd_sources=Math.min(4,Math.max(1,dkd_match.dkd_sourceCount));return dkd_pDistance*.92+dkd_oDistance*.34+dkd_pBand*4.8+dkd_oBand*2.2+dkd_extreme-dkd_q*.42-dkd_sources*.025;}
export function dkd_generate(dkd_matches:dkd_Match[],dkd_count:number,dkd_risk:dkd_Risk,dkd_seed=0):dkd_Pick[]{if(!Number.isInteger(dkd_count)||dkd_count<1||dkd_count>6)throw new Error('1–6 maç seçebilirsin.');const dkd_ready=dkd_matches.map(dkd_match=>({dkd_match,dkd_markets:dkd_modelMarkets(dkd_match)})).filter(dkd_item=>dkd_item.dkd_markets.length>0);if(dkd_ready.length<dkd_count)throw new Error(`Normalize edilebilir doğrulanmış oranları olan ${dkd_ready.length} maç var. Oran akışı güncellendiğinde analiz otomatik genişler.`);const dkd_candidates=dkd_ready.flatMap((dkd_item,dkd_matchIndex)=>dkd_item.dkd_markets.map((dkd_market,dkd_marketIndex)=>({dkd_match:dkd_item.dkd_match,dkd_market,dkd_base:dkd_marketRank(dkd_item.dkd_match,dkd_market,dkd_risk),dkd_noise:dkd_seed?(Math.sin((dkd_matchIndex+1)*12.9898+(dkd_marketIndex+1)*4.1414+dkd_seed*78.233)+1)*.025:0}))),dkd_used=new Set<string>(),dkd_groups=new Map<string,number>(),dkd_selected:typeof dkd_candidates=[];while(dkd_selected.length<dkd_count){let dkd_best:typeof dkd_candidates[number]|undefined,dkd_bestScore=Infinity;for(const dkd_candidate of dkd_candidates){if(dkd_used.has(dkd_candidate.dkd_match.dkd_id))continue;const dkd_group=dkd_candidate.dkd_market.dkd_group||'Diğer',dkd_repeat=dkd_groups.get(dkd_group)??0,dkd_diversity=dkd_repeat*dkd_profileBands[dkd_risk].dkd_diversity+(dkd_repeat>=2?1.35:0),dkd_score=dkd_candidate.dkd_base+dkd_diversity+dkd_candidate.dkd_noise;if(dkd_score<dkd_bestScore){dkd_bestScore=dkd_score;dkd_best=dkd_candidate;}}if(!dkd_best)break;dkd_selected.push(dkd_best);dkd_used.add(dkd_best.dkd_match.dkd_id);const dkd_group=dkd_best.dkd_market.dkd_group||'Diğer';dkd_groups.set(dkd_group,(dkd_groups.get(dkd_group)??0)+1);}if(dkd_selected.length<dkd_count)throw new Error('Seçilen risk profili için yeterli farklı maç bulunamadı.');return dkd_selected.map(dkd_item=>({dkd_matchId:dkd_item.dkd_match.dkd_id,dkd_marketKey:dkd_item.dkd_market.dkd_key}));}
export function dkd_summarize"""
s2,n=re.subn(pattern,replacement,s,flags=re.S)
if n!=1: raise SystemExit(f'engine rank block replacement count={n}')
s=s2.replace("export const dkd_percent=(dkd_value:number)=>`%${(dkd_value*100).toFixed(1).replace('.',',')}`;", "export const dkd_percent=(dkd_value:number)=>{const dkd_pct=Math.max(0,dkd_value*100),dkd_digits=dkd_pct>=1?1:dkd_pct>=.1?2:dkd_pct>=.01?3:4;return`%${dkd_pct.toFixed(dkd_digits).replace('.',',')}`;};")
s=s.replace('Birleşik piyasa olasılığı:', 'Piyasa bazlı tahmini gerçekleşme olasılığı:')
p.write_text(s)

p=Path('src/dkd-live.ts');s=p.read_text()
anchor="  return dkd_out.filter(dkd_market=>dkd_market.dkd_probability>0&&dkd_market.dkd_odds>1)}"
hf="""  const dkd_hfSelections=['1_1','1_x','1_2','x_1','x_x','x_2','2_1','2_x','2_2'],dkd_hfRows=dkd_hfSelections.map(dkd_selection=>dkd_group('half_full',null,dkd_selection));if(dkd_hfRows.every(dkd_value=>dkd_value.length)){const dkd_odds=dkd_hfRows.map(dkd_avg),dkd_probs=dkd_noVig(dkd_odds);for(let dkd_i=0;dkd_i<dkd_hfSelections.length;dkd_i++){const dkd_selection=dkd_hfSelections[dkd_i]!,dkd_parts=dkd_selection.split('_').map(dkd_part=>dkd_part.toLocaleUpperCase('tr-TR')),dkd_label=`İY/MS ${dkd_parts[0]}/${dkd_parts[1]}`;dkd_out.push(dkd_mv(dkd_dynamicKey('half_full',dkd_selection),dkd_label,dkd_label,dkd_odds[dkd_i]!,dkd_probs[dkd_i]??0,'İY / Maç sonucu',null,'half_full'))}}
"""+anchor
if anchor not in s: raise SystemExit('half_full anchor missing')
s=s.replace(anchor,hf,1)
s=s.replace("['match_result','double_chance','total_goals','first_half_total','both_teams_score','first_half_result','odd_even','goal_range'].includes", "['match_result','double_chance','total_goals','first_half_total','both_teams_score','first_half_result','odd_even','goal_range','half_full'].includes")
s=s.replace("dkd_names=['match_result','total_goals','both_teams_score','double_chance','first_half_result','first_half_total','odd_even','goal_range']", "dkd_names=['match_result','total_goals','both_teams_score','double_chance','first_half_result','first_half_total','odd_even','goal_range','half_full']")
s=s.replace('DraBornOdds/0.3 public-fixture-reader','DraBornOdds/0.5 public-fixture-reader')
p.write_text(s)

p=Path('app/(tabs)/builder.tsx');s=p.read_text()
s=s.replace('dkd_risks, dkd_validateStake, dkd_decimal, dkd_money','dkd_risks, dkd_validateStake, dkd_decimal, dkd_money, dkd_summarize, dkd_percent')
old="const dkd_item=dkd_risks[dkd_key],dkd_active=dkd_risk===dkd_key;return <dkd_RN.Pressable"
new="const dkd_item=dkd_risks[dkd_key],dkd_active=dkd_risk===dkd_key;let dkd_preview='';try{const dkd_previewStake=dkd_validateStake(dkd_stake),dkd_previewPicks=dkd_generate(dkd_available,dkd_count,dkd_key),dkd_previewSummary=dkd_summarize(dkd_previewPicks,dkd_available,dkd_previewStake);dkd_preview=`Tahmini ${dkd_percent(dkd_previewSummary.dkd_probability)} · oran ${dkd_decimal(dkd_previewSummary.dkd_odds)}`;}catch{}return <dkd_RN.Pressable"
if old not in s: raise SystemExit('builder profile block missing')
s=s.replace(old,new,1)
s=s.replace('<dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_item.dkd_subtitle}</dkd.Text></dkd_RN.Pressable>','<dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{dkd_item.dkd_subtitle}</dkd.Text>{!!dkd_preview&&<dkd.Text dkd_size={11} dkd_bold dkd_color={dkd_item.dkd_color}>{dkd_preview}</dkd.Text>}</dkd_RN.Pressable>',1)
s=s.replace('Maç sonucu, alt/üst, karşılıklı gol, çifte şans, ilk yarı, tek/çift ve tam gol aralığı marketleri veri kalitesiyle birlikte taranır.','Maç sonucu, alt/üst, karşılıklı gol, çifte şans, ilk yarı, tek/çift, gol aralığı ve tam 9 seçenek varsa İY/MS marketleri birlikte taranır.')
p.write_text(s)

p=Path('app/report/[dkd_id].tsx');s=p.read_text()
s=s.replace('BİRLEŞİK PİYASA OLASILIĞI','TAHMİNİ GERÇEKLEŞME OLASILIĞI')
s=s.replace('{dkd_percent(dkd_summary.dkd_probability)}</dkd.Text><dkd.Row dkd_between>','{dkd_percent(dkd_summary.dkd_probability)}</dkd.Text><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>Piyasa oranlarından marj temizlenerek hesaplanan birleşik tahmin · duyarlılık {dkd_percent(dkd_summary.dkd_lower)} – {dkd_percent(dkd_summary.dkd_upper)}</dkd.Text><dkd.Row dkd_between>',1)
s=s.replace('Normalize olasılık</dkd.Text>','Tahmini gerçekleşme</dkd.Text>')
p.write_text(s)

p=Path('app/method.tsx');s=p.read_text().replace('v0.2 ANALİZ MOTORU','v0.5 ANALİZ MOTORU')
s=s.replace('Motor mevcut piyasa olasılıklarını hedef risk aralıklarına yakınlığına göre sıralar; veri kalitesi ve kaynak sayısı açıklamada görünür kalır.','Motor her profil için olasılık ve oran bantlarını birlikte kullanır; aşırı düşük olasılıklı dev oranların Yüksek/Ultra profiline tek başına hakim olmasına ceza verir. Aynı kuponda market ailesi tekrarına çeşitlilik cezası uygulanır; veri kalitesi ve kaynak sayısı görünür kalır.')
s=s.replace('v0.2 çekirdeği doğrulanmış 1X2 oranlarını kullanır.','v0.5 çekirdeği yalnızca matematiksel olarak tamamlanmış ve normalize edilebilen marketleri kullanır.')
p.write_text(s)

p=Path('app/(tabs)/index.tsx');s=p.read_text().replace('DKD_draborneagle_v0.4','DKD_draborneagle_v0.5').replace('Ham doğru skor ve İY/MS oranları maç detayında ayrıca gösterilir.','Doğru skor ham olarak gösterilir; tam 9 seçenek bulunan İY/MS marketi normalize edilerek analiz motoruna da katılır.')
p.write_text(s)

p=Path('tests/dkd-engine.test.ts');s=p.read_text().replace('dkd_model, dkd_shareText','dkd_model, dkd_percent, dkd_shareText')
extra="""
dkd_test('High and ultra profiles do not chase absurd longshots',()=>{const dkd_base=dkd_make(70),dkd_wide={...dkd_base,dkd_markets:[{dkd_key:'dbo:goal_range|6plus|' as const,dkd_label:'6+ Gol',dkd_short:'6+ Gol',dkd_odds:12.55,dkd_probability:.064,dkd_group:'Gol aralığı',dkd_modelEligible:true},{dkd_key:'dbo:half_full|x_1|' as const,dkd_label:'İY/MS X/1',dkd_short:'İY/MS X/1',dkd_odds:3.15,dkd_probability:.29,dkd_group:'İY / Maç sonucu',dkd_modelEligible:true},{dkd_key:'home' as const,dkd_label:'Maç sonucu 1',dkd_short:'MS 1',dkd_odds:2.70,dkd_probability:.34,dkd_group:'Maç sonucu',dkd_modelEligible:true}]};for(const dkd_risk of ['high','ultra'] as const){const dkd_pick=dkd_generate([dkd_wide],1,dkd_risk)[0]!;dkd_assert.notEqual(dkd_pick.dkd_marketKey,'dbo:goal_range|6plus|');}});
dkd_test('Coupon generator diversifies market families when comparable choices exist',()=>{const dkd_wide=Array.from({length:5},(dkd_unused,dkd_i)=>{const dkd_base=dkd_make(80+dkd_i);return{...dkd_base,dkd_markets:[{dkd_key:'home' as const,dkd_label:'MS 1',dkd_short:'MS 1',dkd_odds:2.7,dkd_probability:.34,dkd_group:'Maç sonucu'},{dkd_key:`dbo:half_full|x_1|${dkd_i}` as const,dkd_label:'İY/MS X/1',dkd_short:'İY/MS X/1',dkd_odds:3.1,dkd_probability:.29,dkd_group:'İY / Maç sonucu'},{dkd_key:`dbo:goal_range|2-3|${dkd_i}` as const,dkd_label:'2-3 Gol',dkd_short:'2-3 Gol',dkd_odds:3.35,dkd_probability:.27,dkd_group:'Gol aralığı'}]};});const dkd_picks=dkd_generate(dkd_wide,5,'high'),dkd_groups=new Set(dkd_picks.map(dkd_pick=>dkd_getMarket(dkd_wide.find(dkd_match=>dkd_match.dkd_id===dkd_pick.dkd_matchId)!,dkd_pick.dkd_marketKey).dkd_group));dkd_assert.ok(dkd_groups.size>=2);});
dkd_test('Tiny non-zero coupon probabilities are never displayed as zero',()=>{dkd_assert.notEqual(dkd_percent(.000004),'%0,0');dkd_assert.match(dkd_percent(.000004),/%0,0004/);});
"""
if 'High and ultra profiles do not chase absurd longshots' not in s:s+=extra
p.write_text(s)

for f in ['package.json','package-lock.json']:
    p=Path(f);d=json.loads(p.read_text());d['version']='0.5.0'
    if f=='package-lock.json' and '' in d.get('packages',{}):d['packages']['']['version']='0.5.0'
    p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=Path('app.json');d=json.loads(p.read_text());d['expo']['version']='0.5.0';d['expo']['extra']['dkd_version']='DKD_draborneagle_v0.5';p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=Path('.github/workflows/dkd-demo-check.yml');s=p.read_text().replace('DraBornOdds v0.4 checks','DraBornOdds v0.5 checks').replace('group: dkd-v04-','group: dkd-v05-');p.write_text(s)
p=Path('README.md');s=p.read_text().replace('# DraBornOdds · v0.4 · versionCode 1','# DraBornOdds · v0.5 · versionCode 1').replace('Görünür sürüm: **DKD_draborneagle_v0.4**','Görünür sürüm: **DKD_draborneagle_v0.5**')
note="""
## v0.5 risk dengesi ve market çeşitliliği

Risk motoru artık yalnızca daha yüksek oranı ödüllendirmez. Her profil için ayrı olasılık/oran bandı vardır; profil bandının çok dışındaki uç oranlar cezalandırılır. Böylece Yüksek Getiri ve Ultra Getiri kuponlarının 4-5 Gol / 6+ Gol gibi tek bir düşük olasılıklı market ailesine yığılması engellenir. Kupon oluşturulurken benzer skorlu seçenekler arasında market ailesi çeşitliliği de hesaba katılır.

İY/MS marketinin dokuz karşılıklı dışlayan seçeneğinin tamamı (1/1, 1/X, 1/2, X/1, X/X, X/2, 2/1, 2/X, 2/2) mevcutsa bookmaker marjı dokuzlu grup üzerinden temizlenir ve market otomatik analize katılır. Eksik İY/MS grubu yine uydurulmaz. Ayrı bir “ikinci yarı sonucu” verisi kaynakta yoksa üretilmez.

Builder risk kartları, seçili maç sayısı ve filtre için her profilin o an üreteceği **tahmini birleşik gerçekleşme olasılığını ve toplam oranını** rapordan önce gösterir. Rapor ekranında çok küçük ama sıfır olmayan olasılıklar artık `%0,0` diye yuvarlanmaz; adaptif basamakla gösterilir. Bu değerler gerçek oranlardan türetilen piyasa bazlı tahminlerdir, sonuç garantisi değildir.

"""
if '## v0.5 risk dengesi ve market çeşitliliği' not in s:s.replace('## Oran hareketi',note+'## Oran hareketi')
s=s.replace('Doğru Skor ile İlk Yarı/Maç Sonucu gibi çok geniş marketler gerçek ham oran olarak maç detayındaki “Tüm oranlar” bölümünde gösterilir; eksik/örtüşen grup olasılığı uydurulmaz ve otomatik kupona sokulmaz.','Doğru Skor gerçek ham oran olarak maç detayında gösterilir. İlk Yarı/Maç Sonucu ise dokuz seçeneğin tamamı varsa no-vig normalize edilerek otomatik analize katılır; eksik grup olasılığı uydurulmaz.')
p.write_text(s)
p=Path('PROGRESS.md');s=p.read_text().replace('# DraBornOdds v0.2 çalışma kaydı','# DraBornOdds v0.5 çalışma kaydı')
add='\n- v0.5: risk profillerine olasılık/oran bantları ve aşırı longshot cezası eklendi; benzer seçimlerde market ailesi çeşitliliği uygulanıyor.\n- Tam 9 seçenekli İY/MS marketi artık no-vig normalize edilerek otomatik analize girebilir; eksik grup uydurulmaz.\n- Builder her risk profili için önceden tahmini birleşik olasılık + toplam oran gösterir; çok küçük olasılıklar %0,0 diye yuvarlanmaz.\n'
if 'v0.5: risk profillerine' not in s:s+=add
p.write_text(s)
