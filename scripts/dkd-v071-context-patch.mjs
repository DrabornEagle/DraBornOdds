import fs from 'node:fs';

const dkd_uiPath='src/dkd-ui.tsx';
let dkd_ui=fs.readFileSync(dkd_uiPath,'utf8');
dkd_ui=dkd_ui.replace("dkd_props.dkd_label ?? 'Model olasılığı'","dkd_props.dkd_label ?? 'Piyasa olasılığı'");
dkd_ui=dkd_ui.replace('<dkd.Text dkd_size={10} dkd_color={dkd_colors.muted}>örnek model</dkd.Text>','');
fs.writeFileSync(dkd_uiPath,dkd_ui);

const dkd_contextPath='src/dkd-football-context.ts';
let dkd_context=fs.readFileSync(dkd_contextPath,'utf8');
dkd_context=dkd_context.replace('.slice(0,8);}', '.slice(0,16);}');
const dkd_marker='export function dkd_contextReason';
const dkd_at=dkd_context.indexOf(dkd_marker);
if(dkd_at<0)throw new Error('dkd_contextReason marker not found');
const dkd_tail=fs.readFileSync('scripts/dkd-v071-context-tail.txt','utf8').trim()+'\n';
dkd_context=dkd_context.slice(0,dkd_at)+dkd_tail;
fs.writeFileSync(dkd_contextPath,dkd_context);

const dkd_analysisPath='src/dkd-analysis.ts';
let dkd_analysis=fs.readFileSync(dkd_analysisPath,'utf8');
dkd_analysis=dkd_analysis.replace("import { dkd_contextReason, type dkd_MatchContext } from './dkd-football-context';","import { dkd_contextAdjustment, dkd_contextReason, type dkd_MatchContext } from './dkd-football-context';");
dkd_analysis=dkd_analysis.replace('export function dkd_analysisScore(dkd_match:dkd_Match,dkd_market:dkd_Market){','export function dkd_analysisScore(dkd_match:dkd_Match,dkd_market:dkd_Market,dkd_context?:dkd_MatchContext|null){');
dkd_analysis=dkd_analysis.replace('return Math.sqrt(dkd_probability*dkd_returnUtility)*dkd_quality*dkd_extremePenalty;','return Math.sqrt(dkd_probability*dkd_returnUtility)*dkd_quality*dkd_extremePenalty*dkd_contextAdjustment(dkd_match,dkd_market,dkd_context);');
dkd_analysis=dkd_analysis.replace('export function dkd_rankAnalysisMarkets(dkd_match:dkd_Match){\n  return [...dkd_modelMarkets(dkd_match)].sort((dkd_a,dkd_b)=>dkd_analysisScore(dkd_match,dkd_b)-dkd_analysisScore(dkd_match,dkd_a));\n}','export function dkd_rankAnalysisMarkets(dkd_match:dkd_Match,dkd_context?:dkd_MatchContext|null){\n  return [...dkd_modelMarkets(dkd_match)].sort((dkd_a,dkd_b)=>dkd_analysisScore(dkd_match,dkd_b,dkd_context)-dkd_analysisScore(dkd_match,dkd_a,dkd_context));\n}');
dkd_analysis=dkd_analysis.replace('const dkd_ranked=dkd_rankAnalysisMarkets(dkd_match);','const dkd_ranked=dkd_rankAnalysisMarkets(dkd_match,dkd_context);');
dkd_analysis=dkd_analysis.replace('const dkd_score=Math.round(dkd_analysisScore(dkd_match,dkd_market)*100);','const dkd_score=Math.round(dkd_analysisScore(dkd_match,dkd_market,dkd_context)*100);');
fs.writeFileSync(dkd_analysisPath,dkd_analysis);

const dkd_matchPath='app/match/[dkd_id].tsx';
let dkd_match=fs.readFileSync(dkd_matchPath,'utf8');
dkd_match=dkd_match.replace('dkd_ranked=dkd_rankAnalysisMarkets(dkd_match),','dkd_ranked=dkd_rankAnalysisMarkets(dkd_match,dkd_context),');
dkd_match=dkd_match.replace('dkd_subtitle="Takımların son dönem performansı, karşılaşma dengesi ve güncel oran ilişkisini kısa ve anlaşılır biçimde açıklar."','dkd_subtitle="Form, gol temposu, doğrudan eşleşmeler, lig sırası, mevcut kadro eksikleri ve dinlenme farkı bulunan veriler ölçüsünde birlikte değerlendirilir."');
fs.writeFileSync(dkd_matchPath,dkd_match);
