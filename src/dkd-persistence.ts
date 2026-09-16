import { dkd_summarize } from './dkd-engine';
import type { dkd_Coupon, dkd_Stored } from './dkd-types';

export const dkd_defaults: dkd_Stored = { dkd_schema: 2, dkd_favorites: [], dkd_coupons: [], dkd_settings: { dkd_motion: true, dkd_haptics: true } };
export function dkd_parseStorage(dkd_json: string | null): dkd_Stored {
  if (!dkd_json) return dkd_defaults;
  const dkd_value: unknown = JSON.parse(dkd_json);
  if (!dkd_value || typeof dkd_value !== 'object') throw new Error('Geçersiz kayıt.');
  const dkd_input = dkd_value as Partial<dkd_Stored> & {dkd_schema?:number;dkd_coupons?:unknown[];dkd_favorites?:unknown[]};
  if (dkd_input.dkd_schema !== 2 || !Array.isArray(dkd_input.dkd_coupons) || !Array.isArray(dkd_input.dkd_favorites)) return dkd_defaults;
  const dkd_seen = new Set<string>();
  const dkd_coupons = dkd_input.dkd_coupons.filter((dkd_unknown):dkd_unknown is dkd_Coupon => {
    try {
      const dkd_coupon=dkd_unknown as dkd_Coupon;
      if (!dkd_coupon || typeof dkd_coupon.dkd_id !== 'string' || dkd_seen.has(dkd_coupon.dkd_id) || !dkd_coupon.dkd_saved || !['low','balanced','high','ultra'].includes(dkd_coupon.dkd_risk) || !['auto','manual'].includes(dkd_coupon.dkd_mode) || !Number.isFinite(Date.parse(dkd_coupon.dkd_createdAt)) || typeof dkd_coupon.dkd_fixtureDay !== 'string' || !Array.isArray(dkd_coupon.dkd_snapshot) || !dkd_coupon.dkd_snapshot.length) return false;
      dkd_summarize(dkd_coupon.dkd_picks, dkd_coupon.dkd_snapshot, dkd_coupon.dkd_stake);
      dkd_seen.add(dkd_coupon.dkd_id); return true;
    } catch { return false; }
  }).slice(0, 50);
  return {
    dkd_schema: 2, dkd_coupons,
    dkd_favorites: [...new Set(dkd_input.dkd_favorites.filter((dkd_id):dkd_id is string => typeof dkd_id==='string'&&dkd_id.length>0))].slice(0,200),
    dkd_settings: { dkd_motion: dkd_input.dkd_settings?.dkd_motion !== false, dkd_haptics: dkd_input.dkd_settings?.dkd_haptics !== false },
  };
}
