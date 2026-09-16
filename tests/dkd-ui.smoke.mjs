import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { JSDOM as dkd_JSDOM, VirtualConsole as dkd_VirtualConsole } from 'jsdom';

// Runs the actual production web bundle in a simulated DOM. No browser/network.
// This verifies screen behavior, not pixels or Android native rendering.
const dkd_html = dkd_fs.readFileSync('dist/index.html', 'utf8');
const dkd_script = /<script[^>]+src="([^"]+)"/.exec(dkd_html)?.[1];
dkd_assert.ok(dkd_script, 'Run npm run export:web before the UI smoke test.');
const dkd_bundle = dkd_fs.readFileSync(dkd_path.join('dist', dkd_script.replace(/^\//, '')), 'utf8');

async function dkd_wait(dkd_check, dkd_description) {
  const dkd_deadline = Date.now() + 6000;
  while (Date.now() < dkd_deadline) {
    if (dkd_check()) return;
    await new Promise(dkd_resolve => setTimeout(dkd_resolve, 30));
  }
  throw new Error('UI timeout: ' + dkd_description);
}
async function dkd_open(dkd_route = '/', dkd_saved = null) {
  const dkd_errors = [];
  const dkd_console = new dkd_VirtualConsole();
  dkd_console.on('jsdomError', dkd_error => { if(!dkd_error.message.includes('Not implemented:')) dkd_errors.push(dkd_error.message); });
  dkd_console.on('error', (...dkd_messages) => dkd_errors.push(dkd_messages.map(String).join(' ')));
  const dkd_dom = new dkd_JSDOM(dkd_html, {
    url: 'http://localhost:8081' + dkd_route, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: dkd_console,
    beforeParse(dkd_window) {
      dkd_window.matchMedia = dkd_query => ({matches:dkd_query.includes('prefers-reduced-motion'),media:dkd_query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
      dkd_window.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
      dkd_window.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
      dkd_window.scrollTo = () => {};
      dkd_window.HTMLElement.prototype.scrollTo = () => {};
      dkd_window.HTMLElement.prototype.scrollIntoView = () => {};
      dkd_window.setImmediate = (dkd_callback, ...dkd_args) => dkd_window.setTimeout(dkd_callback, 0, ...dkd_args);
      dkd_window.clearImmediate = dkd_window.clearTimeout.bind(dkd_window);
      dkd_window.TextEncoder = TextEncoder;
      dkd_window.TextDecoder = TextDecoder;
      if(dkd_saved) dkd_window.localStorage.setItem('dkd-drabornodds-demo', dkd_saved);
    },
  });
  dkd_dom.window.eval(dkd_bundle);
  await dkd_wait(() => { const dkd_text = dkd_dom.window.document.getElementById('root')?.textContent || ''; return (dkd_text.length > 25 && !dkd_text.includes('Maç merkeziniz hazırlanıyor')) || dkd_errors.length; }, 'app boot: ' + dkd_route);
  dkd_assert.deepEqual(dkd_errors, []);
  return { dkd_dom, dkd_errors, dkd_document:dkd_dom.window.document };
}
function dkd_button(dkd_document, dkd_label) {
  const dkd_node = [...dkd_document.querySelectorAll('[role="button"],button,a')].find(dkd_element => (dkd_element.getAttribute('aria-label') || dkd_element.textContent).trim() === dkd_label);
  dkd_assert.ok(dkd_node, 'Button not found: ' + dkd_label);
  dkd_node.click();
}

dkd_test('Home → builder → report → save → reload restores the actual saved report', async () => {
  const {dkd_dom,dkd_document,dkd_errors} = await dkd_open();
  try {
    dkd_assert.match(dkd_document.body.textContent, /Veriyi konuştur/);
    dkd_button(dkd_document,'Kuponumu oluştur');
    await dkd_wait(() => dkd_document.body.textContent.includes('Oyun planını kur.'), 'builder');
    dkd_button(dkd_document,'Kupon raporunu oluştur');
    await dkd_wait(() => dkd_document.body.textContent.includes('Oyun planın hazır.'), 'report');
    dkd_assert.match(dkd_document.body.textContent,/OLASI BRÜT DÖNÜŞ/);
    dkd_button(dkd_document,'Raporu cihazıma kaydet');
    await dkd_wait(() => dkd_document.body.textContent.includes('Rapor cihazında kayıtlı'), 'saved feedback');
    await dkd_wait(() => JSON.parse(dkd_dom.window.localStorage.getItem('dkd-drabornodds-demo') || '{}').dkd_coupons?.length === 1, 'storage write');
    const dkd_saved = dkd_dom.window.localStorage.getItem('dkd-drabornodds-demo');
    const dkd_reopened = await dkd_open('/saved',dkd_saved);
    try {
      await dkd_wait(() => dkd_reopened.dkd_document.body.textContent.includes('3 maçlık oyun planı'), 'restored report');
      dkd_button(dkd_reopened.dkd_document,'Raporu aç');
      await dkd_wait(() => dkd_reopened.dkd_document.body.textContent.includes('Oyun planın hazır.'), 'reopened report');
      dkd_assert.deepEqual(dkd_reopened.dkd_errors,[]);
    } finally {dkd_reopened.dkd_dom.window.close();}
    dkd_assert.deepEqual(dkd_errors,[]);
  } finally { dkd_dom.window.close(); }
});

dkd_test('Match details, stats, odds selection and manual coupon are interactive', async () => {
  const {dkd_dom,dkd_document,dkd_errors} = await dkd_open('/match/dkd_match_1');
  try {
    await dkd_wait(() => dkd_document.body.textContent.includes('MODELİN ODAĞI'),'match details');
    dkd_button(dkd_document,'İstatistik');
    await dkd_wait(() => dkd_document.body.textContent.includes('Rakamların anlattıkları'),'statistics');
    dkd_button(dkd_document,'Oranlar');
    await dkd_wait(() => dkd_document.body.textContent.includes('Seçim marketleri'),'markets');
    const dkd_market=[...dkd_document.querySelectorAll('[role="button"]')].find(dkd_node=>dkd_node.getAttribute('aria-label')?.startsWith('Maç sonucu 1 '));
    dkd_assert.ok(dkd_market);dkd_market.click();
    await dkd_wait(() => dkd_document.body.textContent.includes('Kuponuma git · 1 maç'),'selection added');
    dkd_button(dkd_document,'Kuponuma git · 1 maç');
    await dkd_wait(() => dkd_document.body.textContent.includes('Senin seçtiklerin'),'manual builder');
    dkd_button(dkd_document,'Kupon raporunu oluştur');
    await dkd_wait(() => dkd_document.body.textContent.includes('KENDİ SEÇİMLERİN'),'manual report');
    dkd_assert.deepEqual(dkd_errors,[]);
  } finally {dkd_dom.window.close();}
});

dkd_test('Every main screen and invalid deep link renders without runtime errors', async () => {
  for(const [dkd_route,dkd_text] of [['/matches','Maç merkezi'],['/saved','Oyun defterin'],['/profile','Senin alanın'],['/method','Sayıların arkasında'],['/match/missing','Maç bulunamadı'],['/report/missing','Rapor bulunamadı']]) {
    const dkd_app=await dkd_open(dkd_route);
    try {await dkd_wait(()=>dkd_app.dkd_document.body.textContent.includes(dkd_text),dkd_route);dkd_assert.deepEqual(dkd_app.dkd_errors,[]);}
    finally {dkd_app.dkd_dom.window.close();}
  }
});
