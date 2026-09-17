export type dkd_Risk = 'low' | 'balanced' | 'high' | 'ultra';
export type dkd_Period = 'today' | 'tomorrow' | 'week';
export type dkd_ModelKey = 'home' | 'draw' | 'away' | 'over' | 'under' | 'btts' | 'homeOrDraw' | 'awayOrDraw';
export type dkd_MarketKey = dkd_ModelKey | 'over25' | 'under25' | 'over35' | 'under35' | 'bttsYes' | 'bttsNo' | 'homeOrAway' | 'firstHalfHome' | 'firstHalfDraw' | 'firstHalfAway' | `dbo:${string}`;
export type dkd_Team = {
  dkd_id: string; dkd_name: string; dkd_short: string; dkd_color: string;
  dkd_attack: number; dkd_defense: number; dkd_form: ('G' | 'B' | 'M')[];
};
export type dkd_Market = {
  dkd_key: dkd_MarketKey; dkd_label: string; dkd_short: string;
  dkd_odds: number; dkd_probability: number; dkd_group?: string; dkd_line?: number | null;
  dkd_modelEligible?: boolean; dkd_sourceMarket?: string;
};
export type dkd_Match = {
  dkd_id: string; dkd_league: string; dkd_country: string; dkd_color: string;
  dkd_home: dkd_Team; dkd_away: dkd_Team; dkd_offset: number; dkd_time: string;
  dkd_startAt: string; dkd_sourceCount: number; dkd_quality: number; dkd_explanation: string;
  dkd_lastSeenAt: string; dkd_venue: string; dkd_temperature: number; dkd_weather: string;
  dkd_xgHome: number; dkd_xgAway: number; dkd_markets: dkd_Market[];
  dkd_history: { dkd_home: number; dkd_away: number }[];
  dkd_absences: [number, number]; dkd_rest: [number, number];
};
export type dkd_SourceStatus = {
  dkd_id: string; dkd_name: string; dkd_status: string; dkd_lastRunAt: string | null;
  dkd_lastSuccessAt: string | null; dkd_lastError: string | null; dkd_matchCount: number;
};
export type dkd_Pick = { dkd_matchId: string; dkd_marketKey: dkd_MarketKey };
export type dkd_Coupon = {
  dkd_id: string; dkd_createdAt: string; dkd_risk: dkd_Risk; dkd_stake: number;
  dkd_picks: dkd_Pick[]; dkd_saved: boolean; dkd_mode: 'auto' | 'manual';
  dkd_fixtureDay: string; dkd_snapshot: dkd_Match[];
};
export type dkd_Settings = { dkd_motion: boolean; dkd_haptics: boolean };
export type dkd_Stored = {
  dkd_schema: 2; dkd_favorites: string[]; dkd_coupons: dkd_Coupon[];
  dkd_settings: dkd_Settings;
};
