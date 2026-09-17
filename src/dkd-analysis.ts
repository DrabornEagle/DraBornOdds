import { dkd_decimal, dkd_modelMarkets, dkd_percent } from './dkd-engine';
import { dkd_contextReason, type dkd_MatchContext } from './dkd-football-context';
import type { dkd_Market, dkd_Match } from './dkd-types';

export type dkd_AnalysisInsight={
  dkd_rank:number;
  dkd_total:number;
  dkd_score:number;
  dkd_implied:number;
  dkd_probability:number;
  dkd_summary:string;
  dkd_points:string[];
};

export function dkd_analysisScore(dkd_match:dkd_Match,dkd_market:dkd_Market){
  const dkd_probability=Math.max(.001,Math.min(.999,dkd_market.dkd_probability));
  const dkd_odds=Math.max(1.001,dkd_market.dkd_odds);
  const dkd_returnUtility=Math.max(.015,Math.min(1,Math.log(dkd_odds)/Math.log(6)));
  const dkd_quality=.72+.28*Math.max(0,Math.min(1,dkd_match.dkd_quality));
  const dkd_extremePenalty=dkd_odds>8?.72:dkd_odds>5?.86:1;
  return Math.sqrt(dkd_probability*dkd_returnUtility)*dkd_quality*dkd_extremePenalty;
}

export function dkd_rankAnalysisMarkets(dkd_match:dkd_Match){
  return [...dkd_modelMarkets(dkd_match)].sort((dkd_a,dkd_b)=>dkd_analysisScore(dkd_match,dkd_b)-dkd_analysisScore(dkd_match,dkd_a));
}

export function dkd_marketInsight(dkd_match:dkd_Match,dkd_market:dkd_Market,dkd_context?:dkd_MatchContext|null):dkd_AnalysisInsight{
  const dkd_ranked=dkd_rankAnalysisMarkets(dkd_match);
  const dkd_rank=Math.max(1,dkd_ranked.findIndex(dkd_item=>dkd_item.dkd_key===dkd_market.dkd_key)+1);
  const dkd_probability=Math.max(0,Math.min(1,dkd_market.dkd_probability));
  const dkd_implied=Math.min(1,1/Math.max(1.001,dkd_market.dkd_odds));
  const dkd_score=Math.round(dkd_analysisScore(dkd_match,dkd_market)*100);
  const dkd_group=dkd_market.dkd_group||'Piyasa';
  const dkd_sameGroup=dkd_ranked.filter(dkd_item=>dkd_item.dkd_group===dkd_market.dkd_group);
  const dkd_groupBest=[...dkd_sameGroup].sort((dkd_left,dkd_right)=>dkd_right.dkd_probability-dkd_left.dkd_probability)[0];
  const dkd_marketSentence=dkd_groupBest&&dkd_groupBest.dkd_key!==dkd_market.dkd_key
    ?`${dkd_group} grubunda en yüksek piyasa olasılığı ${dkd_groupBest.dkd_short} için ${dkd_percent(dkd_groupBest.dkd_probability)}; buna rağmen ${dkd_market.dkd_short} ${dkd_decimal(dkd_market.dkd_odds)} oranıyla olasılık–oran dengesi açısından üst sıralara çıkıyor.`
    :`${dkd_market.dkd_short}, ${dkd_group.toLocaleLowerCase('tr-TR')} grubunda ${dkd_percent(dkd_probability)} normalize olasılık ve ${dkd_decimal(dkd_market.dkd_odds)} oranıyla güçlü bir olasılık–oran dengesi oluşturuyor.`;
  const dkd_points=[
    dkd_contextReason(dkd_match,dkd_market,dkd_context),
    dkd_marketSentence,
    `Aynı maçtaki ${dkd_ranked.length} uygun seçenek birlikte karşılaştırıldı; bu seçim ${dkd_rank}. sırada ve denge skoru ${dkd_score}/100.`,
    `Özet: ${dkd_market.dkd_label} için fiyatlanan olasılık ${dkd_percent(dkd_probability)} ve güncel oran ${dkd_decimal(dkd_market.dkd_odds)}. Bu değer, karşılaşma bağlamıyla birlikte analiz sırasını belirliyor.`
  ];
  return{dkd_rank,dkd_total:dkd_ranked.length,dkd_score,dkd_implied,dkd_probability,dkd_summary:`${dkd_market.dkd_label}: ${dkd_percent(dkd_probability)} normalize olasılık · ${dkd_decimal(dkd_market.dkd_odds)} oran · ${dkd_score}/100 denge skoru.`,dkd_points};
}
