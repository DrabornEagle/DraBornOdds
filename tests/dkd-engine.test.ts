import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import { dkd_matches, dkd_fixtureDay } from '../src/dkd-data';
import { dkd_filterMatches, dkd_generate, dkd_getMarket, dkd_model, dkd_summarize, dkd_validateStake, dkd_shareText } from '../src/dkd-engine';
import { dkd_defaults, dkd_parseStorage } from '../src/dkd-persistence';
import type { dkd_Coupon, dkd_Risk } from '../src/dkd-types';

dkd_test('Probability distributions normalize and complementary markets agree',()=>{
  for(const dkd_match of dkd_matches){
    const dkd_prob=dkd_model(dkd_match.dkd_xgHome,dkd_match.dkd_xgAway);
    dkd_assert.ok(Math.abs(dkd_prob.home+dkd_prob.draw+dkd_prob.away-1)<1e-10);
    dkd_assert.ok(Math.abs(dkd_prob.over+dkd_prob.under-1)<1e-10);
    dkd_assert.equal(dkd_prob.homeOrDraw,dkd_prob.home+dkd_prob.draw);
    dkd_assert.equal(dkd_prob.awayOrDraw,dkd_prob.away+dkd_prob.draw);
    for(const dkd_p of Object.values(dkd_prob))dkd_assert.ok(dkd_p>0&&dkd_p<1);
  }
});
dkd_test('Symmetric expected goals produce symmetric home/away probabilities',()=>{
  const dkd_prob=dkd_model(1.5,1.5);dkd_assert.ok(Math.abs(dkd_prob.home-dkd_prob.away)<1e-12);
});
dkd_test('Demo dataset has unique IDs, valid rivals and plausible odds',()=>{
  dkd_assert.equal(new Set(dkd_matches.map(dkd_item=>dkd_item.dkd_id)).size,36);
  for(const dkd_match of dkd_matches){dkd_assert.notEqual(dkd_match.dkd_home.dkd_id,dkd_match.dkd_away.dkd_id);dkd_assert.equal(dkd_match.dkd_markets.length,8);for(const dkd_market of dkd_match.dkd_markets)dkd_assert.ok(Number.isFinite(dkd_market.dkd_odds)&&dkd_market.dkd_odds>=1.05);}
});
dkd_test('Date, league, Turkish case-insensitive search and zero-result filters',()=>{
  dkd_assert.equal(dkd_filterMatches(dkd_matches,'today').length,12);
  dkd_assert.equal(dkd_filterMatches(dkd_matches,'tomorrow').length,12);
  dkd_assert.equal(dkd_filterMatches(dkd_matches,'week','Süper Lig').length,6);
  dkd_assert.ok(dkd_filterMatches(dkd_matches,'week','Tümü','BEŞİKTAŞ').length>0);
  dkd_assert.equal(dkd_filterMatches(dkd_matches,'week','Tümü','bulunamayan').length,0);
});
dkd_test('All risk profiles support 1–6 distinct matches and only available markets',()=>{
  for(const dkd_risk of ['low','balanced','high','ultra'] as dkd_Risk[])for(let dkd_n=1;dkd_n<=6;dkd_n++){
    const dkd_picks=dkd_generate(dkd_matches,dkd_n,dkd_risk);
    dkd_assert.equal(dkd_picks.length,dkd_n);dkd_assert.equal(new Set(dkd_picks.map(dkd_pick=>dkd_pick.dkd_matchId)).size,dkd_n);
    for(const dkd_pick of dkd_picks)dkd_assert.ok(dkd_getMarket(dkd_matches.find(dkd_match=>dkd_match.dkd_id===dkd_pick.dkd_matchId)!,dkd_pick.dkd_marketKey));
  }
});
dkd_test('Risk profiles reduce probability and increase odds across the same count',()=>{
  const dkd_results=(['low','balanced','high','ultra'] as dkd_Risk[]).map(dkd_risk=>dkd_summarize(dkd_generate(dkd_matches,3,dkd_risk),dkd_matches,100));
  for(let dkd_i=1;dkd_i<dkd_results.length;dkd_i++){dkd_assert.ok(dkd_results[dkd_i]!.dkd_probability<dkd_results[dkd_i-1]!.dkd_probability);dkd_assert.ok(dkd_results[dkd_i]!.dkd_odds>dkd_results[dkd_i-1]!.dkd_odds);}
});
dkd_test('Insufficient fixtures and invalid counts produce useful errors',()=>{
  dkd_assert.throws(()=>dkd_generate(dkd_matches.slice(0,2),3,'low'),/2 maç/);
  for(const dkd_count of [0,7,1.5,NaN])dkd_assert.throws(()=>dkd_generate(dkd_matches,dkd_count,'low'));
});
dkd_test('Alternative generation remains valid and differs for different seeds',()=>{
  const dkd_results=new Set(Array.from({length:8},(dkd_unused,dkd_i)=>JSON.stringify(dkd_generate(dkd_matches,3,'balanced',dkd_i))));dkd_assert.ok(dkd_results.size>1);
});
dkd_test('TL input accepts comma decimals and bounds; rejects malformed values',()=>{
  for(const [dkd_input,dkd_expected] of [['50',50],['100,50',100.5],['50.01',50.01],['100000',100000]] as const)dkd_assert.equal(dkd_validateStake(dkd_input),dkd_expected);
  for(const dkd_input of ['', '49.99','100000.01','NaN','Infinity','1e3','0x32','100,123','-50','hello',Infinity,NaN,50.001])dkd_assert.throws(()=>dkd_validateStake(dkd_input));
});
dkd_test('Combined odds, probability, gross/net and sensitivity use multiplicative math',()=>{
  const dkd_picks=dkd_generate(dkd_matches,3,'balanced');const dkd_result=dkd_summarize(dkd_picks,dkd_matches,100);
  const dkd_odds=dkd_result.dkd_rows.reduce((dkd_total,dkd_row)=>dkd_total*dkd_row.dkd_market.dkd_odds,1);
  dkd_assert.equal(dkd_result.dkd_gross,Math.round(dkd_odds*10000)/100);
  dkd_assert.ok(Math.abs(dkd_result.dkd_net-(dkd_result.dkd_gross-100))<0.001);
  dkd_assert.ok(dkd_result.dkd_lower<dkd_result.dkd_probability&&dkd_result.dkd_probability<dkd_result.dkd_upper);
  dkd_assert.ok(dkd_result.dkd_probability<Math.min(...dkd_result.dkd_rows.map(dkd_row=>dkd_row.dkd_market.dkd_probability)));
});
dkd_test('Empty, duplicated, unknown and oversized coupon selections are rejected',()=>{
  const dkd_picks=dkd_generate(dkd_matches,2,'balanced');
  for(const dkd_invalid of [[],[dkd_picks[0]!,dkd_picks[0]!],[{dkd_matchId:'missing',dkd_marketKey:'home' as const}],Array(7).fill(dkd_picks[0])])dkd_assert.throws(()=>dkd_summarize(dkd_invalid,dkd_matches,100));
});
const dkd_coupon:dkd_Coupon={dkd_id:'dkd_test',dkd_createdAt:new Date().toISOString(),dkd_risk:'balanced',dkd_stake:100,dkd_picks:dkd_generate(dkd_matches,3,'balanced'),dkd_saved:true,dkd_mode:'auto',dkd_fixtureDay};
dkd_test('Saved reports and preferences survive serialization without a database',()=>{
  const dkd_roundTrip=dkd_parseStorage(JSON.stringify({...dkd_defaults,dkd_coupons:[dkd_coupon],dkd_favorites:[dkd_matches[0]!.dkd_id],dkd_settings:{dkd_motion:false,dkd_haptics:false}}));
  dkd_assert.deepEqual(dkd_roundTrip.dkd_coupons,[dkd_coupon]);dkd_assert.equal(dkd_roundTrip.dkd_settings.dkd_motion,false);dkd_assert.deepEqual(dkd_roundTrip.dkd_favorites,[dkd_matches[0]!.dkd_id]);
});
dkd_test('Storage handles missing, damaged, unsupported and invalid report data',()=>{
  dkd_assert.deepEqual(dkd_parseStorage(null),dkd_defaults);dkd_assert.throws(()=>dkd_parseStorage('{broken'));dkd_assert.throws(()=>dkd_parseStorage('{"dkd_schema":9}'));
  const dkd_clean=dkd_parseStorage(JSON.stringify({...dkd_defaults,dkd_favorites:['bad',dkd_matches[0]!.dkd_id,dkd_matches[0]!.dkd_id],dkd_coupons:[null,{...dkd_coupon,dkd_stake:-20},dkd_coupon,dkd_coupon]}));
  dkd_assert.equal(dkd_clean.dkd_coupons.length,1);dkd_assert.equal(dkd_clean.dkd_favorites.length,1);
});
dkd_test('Shared report preserves demo and independence context',()=>{
  const dkd_text=dkd_shareText(dkd_coupon,dkd_matches);dkd_assert.match(dkd_text,/DEMO RAPOR/);dkd_assert.match(dkd_text,/kurgusaldır/);dkd_assert.match(dkd_text,/bağımsızlık/);dkd_assert.match(dkd_text,/brüt/);
});
