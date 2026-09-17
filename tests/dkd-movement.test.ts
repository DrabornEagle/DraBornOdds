import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import { dkd_summarizeMovement } from '../src/dkd-movement';
import type { dkd_MovementRow } from '../src/dkd-movement';
const dkd_rows:dkd_MovementRow[]=[
  {dbo_market_key:'match_result',dbo_selection_key:'home',dbo_line:null,dbo_decimal_odds:2.10,dbo_raw_label:'MS 1',dbo_collected_at:'2026-09-17T05:00:00Z'},
  {dbo_market_key:'match_result',dbo_selection_key:'home',dbo_line:null,dbo_decimal_odds:1.95,dbo_raw_label:'MS 1',dbo_collected_at:'2026-09-17T06:00:00Z'},
  {dbo_market_key:'match_result',dbo_selection_key:'home',dbo_line:null,dbo_decimal_odds:1.90,dbo_raw_label:'MS 1',dbo_collected_at:'2026-09-17T07:00:00Z'},
  {dbo_market_key:'total_goals',dbo_selection_key:'over',dbo_line:2.5,dbo_decimal_odds:1.70,dbo_raw_label:'2,5 Üst',dbo_collected_at:'2026-09-17T05:30:00Z'},
  {dbo_market_key:'total_goals',dbo_selection_key:'over',dbo_line:2.5,dbo_decimal_odds:1.80,dbo_raw_label:'2,5 Üst',dbo_collected_at:'2026-09-17T07:00:00Z'}
];
dkd_test('Odds movement keeps chronological open/current/min/max values',()=>{const dkd_result=dkd_summarizeMovement(dkd_rows),dkd_home=dkd_result.find(dkd_item=>dkd_item.dkd_selection==='home')!;dkd_assert.equal(dkd_home.dkd_open,2.10);dkd_assert.equal(dkd_home.dkd_current,1.90);dkd_assert.equal(dkd_home.dkd_min,1.90);dkd_assert.equal(dkd_home.dkd_max,2.10);dkd_assert.equal(dkd_home.dkd_samples,3);dkd_assert.ok(dkd_home.dkd_deltaPct<0)});
dkd_test('Odds movement ranks the largest relative move first',()=>{const dkd_result=dkd_summarizeMovement(dkd_rows);dkd_assert.equal(dkd_result[0]!.dkd_selection,'home');dkd_assert.match(dkd_result[1]!.dkd_label,/Üst/)});
dkd_test('Invalid odds or timestamps are excluded from movement summaries',()=>{const dkd_result=dkd_summarizeMovement([...dkd_rows,{...dkd_rows[0]!,dbo_decimal_odds:1,dbo_collected_at:'bad-date'}]);dkd_assert.equal(dkd_result.find(dkd_item=>dkd_item.dkd_selection==='home')!.dkd_samples,3)});
