import { dkd_model } from './dkd-engine';
import type { dkd_MarketKey, dkd_Match, dkd_Team } from './dkd-types';

const dkd_teams: [string, string, string, number, number][] = [
  ['Galatasaray', 'GS', '#F5AA48', 1.92, 0.96], ['Fenerbahçe', 'FB', '#FFE17B', 1.84, 1.05],
  ['Beşiktaş', 'BJK', '#DFE6F5', 1.58, 1.18], ['Trabzonspor', 'TS', '#74C0EA', 1.48, 1.20],
  ['Arsenal', 'ARS', '#FF7F87', 1.82, 0.91], ['Chelsea', 'CHE', '#73A4FF', 1.53, 1.13],
  ['Liverpool', 'LIV', '#FF7A79', 1.95, 0.96], ['Manchester City', 'MCI', '#81D3F7', 1.91, 0.95],
  ['Real Madrid', 'RMA', '#E8DCFF', 2.05, 0.98], ['Barcelona', 'BAR', '#D394F7', 2.01, 1.05],
  ['Atlético Madrid', 'ATM', '#FF9E8D', 1.58, 0.90], ['Sevilla', 'SEV', '#F4ACB1', 1.19, 1.42],
  ['Inter', 'INT', '#7C9BFF', 1.94, 0.93], ['Milan', 'MIL', '#FF848B', 1.61, 1.16],
  ['Juventus', 'JUV', '#E7EAF3', 1.52, 0.89], ['Napoli', 'NAP', '#73D3FF', 1.74, 1.09],
  ['Bayern Münih', 'BAY', '#FF909E', 2.13, 1.03], ['Dortmund', 'BVB', '#FFE975', 1.75, 1.29],
  ['Leverkusen', 'LEV', '#E78D99', 1.88, 1.08], ['Leipzig', 'RBL', '#EDA6BE', 1.67, 1.20],
  ['Paris SG', 'PSG', '#8DB8FF', 2.08, 1.02], ['Marsilya', 'OM', '#80DBF1', 1.61, 1.30],
  ['Monaco', 'MON', '#FFABA3', 1.73, 1.24], ['Lyon', 'LYO', '#CFB6FF', 1.44, 1.38],
];
const dkd_forms: ('G' | 'B' | 'M')[][] = [ ['G','G','B','G','G'], ['G','M','G','G','B'], ['B','G','M','G','B'], ['M','B','G','M','G'], ['G','G','G','B','G'], ['M','G','B','G','M'] ];
const dkd_leagueInfo = [
  ['Süper Lig', 'Türkiye', '#FF8B78'], ['Premier Lig', 'İngiltere', '#C5A0FF'], ['La Liga', 'İspanya', '#FFCE77'],
  ['Serie A', 'İtalya', '#6DBFFF'], ['Bundesliga', 'Almanya', '#F59CCD'], ['Ligue 1', 'Fransa', '#B6F36A'],
];
export const dkd_leagues = ['Tümü', ...dkd_leagueInfo.map(dkd_item => dkd_item[0]!)];
const dkd_team = (dkd_index: number): dkd_Team => {
  const dkd_row = dkd_teams[dkd_index]!;
  return { dkd_id: `dkd_team_${dkd_index}`, dkd_name: dkd_row[0], dkd_short: dkd_row[1], dkd_color: dkd_row[2], dkd_attack: dkd_row[3], dkd_defense: dkd_row[4], dkd_form: dkd_forms[dkd_index % dkd_forms.length]! };
};
const dkd_marketLabels: [dkd_MarketKey, string, string][] = [
  ['home', 'Maç sonucu 1', 'MS 1'], ['draw', 'Maç sonucu X', 'MS X'], ['away', 'Maç sonucu 2', 'MS 2'],
  ['over', '2,5 gol üstü', '2,5 Üst'], ['under', '2,5 gol altı', '2,5 Alt'], ['btts', 'Karşılıklı gol var', 'KG Var'],
  ['homeOrDraw', 'Çifte şans 1X', '1X'], ['awayOrDraw', 'Çifte şans X2', 'X2'],
];

// Deliberately synthetic fixtures. No network source or live sports claim.
export const dkd_matches: dkd_Match[] = Array.from({ length: 36 }, (dkd_unused, dkd_index) => {
  const dkd_leagueIndex = dkd_index % 6;
  const dkd_round = Math.floor(dkd_index / 12);
  const dkd_pair = Math.floor(dkd_index / 6) % 2;
  const dkd_base = dkd_leagueIndex * 4;
  const dkd_home = dkd_team(dkd_base + dkd_pair * 2);
  const dkd_away = dkd_team(dkd_base + ((dkd_pair * 2 + 1 + dkd_round) % 4));
  const dkd_actualAway = dkd_away.dkd_id === dkd_home.dkd_id ? dkd_team(dkd_base + ((dkd_pair * 2 + 3) % 4)) : dkd_away;
  const dkd_homeForm = dkd_home.dkd_form.filter(dkd_result => dkd_result === 'G').length * 0.035;
  const dkd_xgHome = Math.round((dkd_home.dkd_attack * dkd_actualAway.dkd_defense * 1.12 + dkd_homeForm) * 100) / 100;
  const dkd_xgAway = Math.round(dkd_actualAway.dkd_attack * dkd_home.dkd_defense * 0.85 * 100) / 100;
  const dkd_probabilities = dkd_model(dkd_xgHome, dkd_xgAway);
  const dkd_info = dkd_leagueInfo[dkd_leagueIndex]!;
  return {
    dkd_id: `dkd_match_${dkd_index + 1}`, dkd_league: dkd_info[0]!, dkd_country: dkd_info[1]!, dkd_color: dkd_info[2]!,
    dkd_home, dkd_away: dkd_actualAway, dkd_offset: dkd_round === 2 ? 3 + dkd_index % 3 : dkd_round,
    dkd_time: `${18 + dkd_index % 5}:${dkd_index % 2 ? '30' : '00'}`,
    dkd_venue: `${dkd_home.dkd_name} Stadyumu`, dkd_temperature: 16 + dkd_index % 12,
    dkd_weather: dkd_index % 4 === 0 ? 'Parçalı bulutlu' : dkd_index % 4 === 1 ? 'Açık' : dkd_index % 4 === 2 ? 'Hafif yağmurlu' : 'Bulutlu',
    dkd_xgHome, dkd_xgAway,
    dkd_markets: dkd_marketLabels.map(([dkd_key, dkd_label, dkd_short]) => ({ dkd_key, dkd_label, dkd_short, dkd_probability: dkd_probabilities[dkd_key], dkd_odds: Math.max(1.05, Math.round(100 / (dkd_probabilities[dkd_key] * 1.065)) / 100) })),
    dkd_history: Array.from({length: 5}, (dkd_empty, dkd_h) => ({dkd_home: (dkd_index + dkd_h * 2) % 4, dkd_away: (dkd_index + dkd_h) % 3})),
    dkd_absences: [dkd_index % 3, (dkd_index + 1) % 4], dkd_rest: [3 + dkd_index % 4, 3 + (dkd_index + 1) % 4],
  };
});

export const dkd_fixtureDay = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' });
export function dkd_date(dkd_offset: number, dkd_long = false): string {
  const dkd_today = new Date();
  const dkd_istanbul = new Date(dkd_today.toLocaleString('en-US', {timeZone:'Europe/Istanbul'}));
  dkd_istanbul.setDate(dkd_istanbul.getDate() + dkd_offset);
  if (!dkd_long && dkd_offset < 2) return dkd_offset === 0 ? 'Bugün' : 'Yarın';
  return dkd_istanbul.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', ...(dkd_long ? { weekday: 'long' as const } : {}) });
}
