import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { dkd, dkd_colors } from '../../src/dkd-ui';
import { dkd_useStore } from '../../src/dkd-store';
import { dkd_matches } from '../../src/dkd-data';
import { dkd_decimal, dkd_money, dkd_percent, dkd_risks, dkd_summarize } from '../../src/dkd-engine';

export default function dkd_SavedScreen(){
  const dkd_store=dkd_useStore();const [dkd_filter,dkd_setFilter]=dkd_React.useState('all');const [dkd_deleteId,dkd_setDeleteId]=dkd_React.useState('');
  const dkd_list=dkd_store.dkd_stored.dkd_coupons.filter(dkd_coupon=>dkd_filter==='all'||dkd_coupon.dkd_risk===dkd_filter);
  return <dkd.Page><dkd.Reveal><dkd.Text dkd_size={29} dkd_bold>Oyun defterin<dkd_RN.Text style={{color:dkd_colors.purple}}>.</dkd_RN.Text></dkd.Text><dkd.Text dkd_color={dkd_colors.muted} dkd_size={13}>Kaydettiğin senaryolar, tek bir yerde.</dkd.Text></dkd.Reveal>
    <dkd.Card dkd_style={{borderColor:'#443758'}}><dkd.Row dkd_between><dkd_RN.View><dkd.Text dkd_size={35} dkd_color={dkd_colors.purple} dkd_bold>{dkd_store.dkd_stored.dkd_coupons.length.toString().padStart(2,'0')}</dkd.Text><dkd.Text dkd_size={13} dkd_color={dkd_colors.muted}>Kaydedilen demo rapor</dkd.Text></dkd_RN.View><dkd.Icon dkd_name="bookmark" dkd_size={42} dkd_color={dkd_colors.purple}/></dkd.Row><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>Kayıtlar bu cihazda saklanır. Gerçek oynanmış kupon veya sonuç takibi içermez.</dkd.Text></dkd.Card>
    <dkd.Chips dkd_options={[{dkd_id:'all',dkd_label:'Tümü'},...Object.entries(dkd_risks).map(([dkd_id,dkd_item])=>({dkd_id,dkd_label:dkd_item.dkd_name}))]} dkd_value={dkd_filter} dkd_onChange={dkd_setFilter} dkd_color={dkd_colors.purple}/>
    {!dkd_list.length?<dkd.Empty dkd_title="Henüz bir rapor yok" dkd_body="Kupon atölyesinde bir senaryo oluştur, raporunu kaydet ve daha sonra yeniden incele." dkd_icon="ticket" dkd_action="İlk kuponumu hazırla" dkd_onPress={()=>dkd_Router.router.push('/builder')}/>:dkd_list.map(dkd_coupon=>{
      const dkd_summary=dkd_summarize(dkd_coupon.dkd_picks,dkd_matches,dkd_coupon.dkd_stake);const dkd_risk=dkd_risks[dkd_coupon.dkd_risk];
      return <dkd.Card key={dkd_coupon.dkd_id}><dkd.Row dkd_between><dkd.Badge dkd_color={dkd_risk.dkd_color}>{dkd_coupon.dkd_mode==='manual'?'KENDİ SEÇİMİM':dkd_risk.dkd_name.toLocaleUpperCase('tr-TR')}</dkd.Badge><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>{new Date(dkd_coupon.dkd_createdAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}</dkd.Text></dkd.Row><dkd.Text dkd_size={19} dkd_bold>{dkd_coupon.dkd_picks.length} maçlık oyun planı</dkd.Text><dkd.Row dkd_between><dkd_RN.View><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>Toplam oran</dkd.Text><dkd.Text dkd_size={25} dkd_bold>{dkd_decimal(dkd_summary.dkd_odds)}</dkd.Text></dkd_RN.View><dkd_RN.View><dkd.Text dkd_size={11} dkd_color={dkd_colors.muted}>Örnek olasılık</dkd.Text><dkd.Text dkd_size={23} dkd_bold dkd_color={dkd_risk.dkd_color}>{dkd_percent(dkd_summary.dkd_probability)}</dkd.Text></dkd_RN.View></dkd.Row><dkd.Text dkd_size={12} dkd_color={dkd_colors.muted}>{dkd_money(dkd_coupon.dkd_stake)} senaryo · {dkd_money(dkd_summary.dkd_gross)} olası brüt dönüş</dkd.Text><dkd.Row><dkd.Button dkd_label="Raporu aç" dkd_icon="arrow" dkd_variant="secondary" dkd_style={{flex:1}} dkd_onPress={()=>dkd_Router.router.push(`/report/${dkd_coupon.dkd_id}`)}/><dkd.IconButton dkd_icon="trash" dkd_label="Bu raporu sil" dkd_color={dkd_colors.coral} dkd_onPress={()=>dkd_setDeleteId(dkd_coupon.dkd_id)}/></dkd.Row></dkd.Card>;
    })}
    <dkd.Notice/><dkd.Confirm dkd_visible={!!dkd_deleteId} dkd_title="Rapor silinsin mi?" dkd_body="Bu demo rapor cihazındaki kayıtlardan kaldırılacak." dkd_onCancel={()=>dkd_setDeleteId('')} dkd_onConfirm={()=>{dkd_store.dkd_deleteReport(dkd_deleteId);dkd_setDeleteId('');}}/>
  </dkd.Page>;
}
