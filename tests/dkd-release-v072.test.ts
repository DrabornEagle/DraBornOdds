import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('v0.7.2 release metadata and web base path stay aligned',()=>{
  const dkd_package=JSON.parse(fs.readFileSync('package.json','utf8')) as {version:string};
  const dkd_app=JSON.parse(fs.readFileSync('app.json','utf8')) as {expo:{version:string;android:{versionCode:number};experiments:{baseUrl:string};extra:Record<string,string>}};
  assert.equal(dkd_package.version,'0.7.2');
  assert.equal(dkd_app.expo.version,'0.7.2');
  assert.equal(dkd_app.expo.android.versionCode,2);
  assert.equal(dkd_app.expo.experiments.baseUrl,'/DraBornOdds');
  assert.equal(dkd_app.expo.extra.dkd_privacy_url,'https://www.draborneagle.com/DraBornOdds/privacy');
});

test('combined selections info card is not rendered in the report',()=>{
  const dkd_report=fs.readFileSync('app/report/[dkd_id].tsx','utf8');
  assert.equal(dkd_report.includes('TÜM SEÇİMLER BİRLİKTE'),false);
  assert.equal(dkd_report.includes('Bu ayrı matematiksel hesap seçim olasılıklarını çarpar'),false);
});

test('privacy and Play-facing disclosures remain reachable',()=>{
  const dkd_profile=fs.readFileSync('app/(tabs)/profile.tsx','utf8');
  const dkd_privacy=fs.readFileSync('web-legal/privacy/index.html','utf8');
  assert.match(dkd_profile,/Gizlilik Politikası/);
  assert.match(dkd_profile,/18\+/);
  assert.match(dkd_privacy,/support@draborneagle\.com/);
  assert.match(dkd_privacy,/hesap oluşturmaz/i);
});
