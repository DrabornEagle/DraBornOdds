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
  const dkd_points=[
    dkd_contextReason(dkd_match,dkd_market,dkd_context),
    `${dkd_group} içindeki karşılıklı sonuçlar birlikte ele alındı; bookmaker marjı temizlendikten sonra ${dkd_percent(dkd_probability)} piyasa olasılığı hesaplandı.`,
    `${dkd_ranked.length} analize uygun seçim aynı maç içinde karşılaştırıldı; “${dkd_market.dkd_label}” olasılık–oran dengesinde ${dkd_rank}. sırada ve denge skoru ${dkd_score}/100.`,
    `Güncel decimal oran ${dkd_decimal(dkd_market.dkd_odds)}. Geçmiş performans bağlamı ile piyasa fiyatı farklı yönlere işaret ederse bu bir kesin sonuç olarak yorumlanmaz; seçim karar desteğidir.`
  ];
  return{dkd_rank,dkd_total:dkd_ranked.length,dkd_score,dkd_implied,dkd_probability,dkd_summary:`${dkd_market.dkd_label}: ${dkd_percent(dkd_probability)} normalize olasılık · ${dkd_decimal(dkd_market.dkd_odds)} oran · ${dkd_score}/100 denge skoru.`,dkd_points};
}
