// Stills of every new state on the real page (stubbed backend), at 1x (390x844 phone,
// 1280x800 rail), 3x full screens, and 4x crops of the details.
//   VENDOR=<dir> node stills.js      -> design/plans-build/stills/
const { open, launch, FIX } = require('./harness');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'stills');
fs.mkdirSync(OUT, { recursive: true });
const W = ms => new Promise(r => setTimeout(r, ms));
const base = { plans: FIX.plans, stops: FIX.stops, visited: ['mir'] };

async function toPlans(page, planId) {
  await page.evaluate(() => { document.getElementById('toggleFiltersBtn').click(); }); await W(400);
  await page.evaluate(() => document.querySelector('#listSwitch [data-view="plans"]').click()); await W(800);
  if (planId) { await page.evaluate(id => document.querySelector(`#planLedger [data-plan="${id}"]`).click(), planId); await W(800); }
}
const closePanel = async page => { await page.evaluate(() => { if (document.getElementById('filtersPanel').classList.contains('visible')) document.getElementById('toggleFiltersBtn').click(); }); await W(450); };
const shot = (page, name, clip) => page.screenshot({ path: path.join(OUT, name + '.png'), ...(clip ? { clip } : {}) });
const rect = (page, sel, pad = 0) => page.evaluate(([sel, pad]) => { const b = document.querySelector(sel).getBoundingClientRect(); return { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: Math.min(innerWidth, b.width + pad * 2), height: b.height + pad * 2 }; }, [sel, pad]);

// each scene: (page) => sets the state; shots at 1x and 3x (+ optional 4x crops)
const scenes = [
  ['01-places-panel', {}, async p => { await p.evaluate(() => document.getElementById('toggleFiltersBtn').click()); await W(450); }, [['switch', '.seg-wrap', 0]]],
  ['02-plans-panel', {}, async p => { await toPlans(p); }, [['ledger', '#planLedger', 0], ['switch', '.seg-wrap', 0]]],
  ['03-following', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => frameActivePlan({ animate: false })); await W(500); },
    [['rows', '#locationsList', 0], ['header', '#locationsHeader', 0]]],
  ['04-map-numbers', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => map.setView([55.6912, 12.5500], 16, { animate: false })); await W(500); }, [['pins', '#map', 0]]],
  ['04b-clusters', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => map.setView([55.6912, 12.5500], 13, { animate: false })); await W(500); }, []],
  ['05-popup-stop', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => document.querySelector('.location-card[data-id="jae"]').click()); await W(1600); },
    [['popup', '.leaflet-popup-content-wrapper', 6], ['rows', '#locationsList', 0]]],
  ['06-shape-popup', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => document.querySelector('.location-card[data-shape-id="9001"]').click()); await W(1600); },
    [['popup', '.leaflet-popup-content-wrapper', 6]]],
  ['07-plan-menu', {}, async p => { await toPlans(p); await p.evaluate(() => document.querySelector('#planLedger .plan-more').click()); await W(300); }, [['ledger', '#planLedger', 0]]],
  ['08-rename', {}, async p => { await toPlans(p); await p.evaluate(() => { document.querySelector('#planLedger .plan-more').click(); }); await W(200); await p.evaluate(() => document.querySelector('#planLedger [data-act="rename"]').click()); await W(300); }, [['ledger', '#planLedger', 0]]],
  ['09-create', { plans: [], stops: [] }, async p => { await toPlans(p); await p.evaluate(() => document.querySelector('#planLedger [data-act="new"]').click()); await W(200); await p.keyboard.type('Nørrebro afternoon'); await W(200); }, [['ledger', '#planLedger', 0]]],
  ['10-no-plans', { plans: [], stops: [] }, async p => { await toPlans(p); }, []],
  ['11-zero-stops', {}, async p => { await toPlans(p, 'p-empty'); await closePanel(p); }, []],
  ['12-long-name', {}, async p => { await toPlans(p, 'p-long'); }, [['header', '#locationsHeader', 0], ['ledger', '#planLedger', 0]]],
  ['13-spanning', {}, async p => { await toPlans(p, 'p-mc'); await closePanel(p); }, []],
  ['14-collapsed', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => document.getElementById('collapseBtn').click()); await W(600); }, [['band', '#locationsHeader', 0]]],
  ['15-signed-out', { signedOut: true }, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => document.querySelector('#planLedger [data-act="new"]').click()); await W(400); }, []],
  ['16-tables-missing', { missing: true }, async p => { await toPlans(p); }, [['ledger', '#filtersPanel', 0]]],
  ['17-highlighted-next', {}, async p => { await toPlans(p); await closePanel(p); await p.evaluate(() => { setHighlighted('jae'); }); await W(300); }, [['rows', '#locationsList', 0]]],
  ['18-rail', { w: 1280, h: 800, touch: false }, async p => { await toPlans(p); }, [['rail', '#locations', 0]]],
  ['19-rail-following', { w: 1280, h: 800, touch: false }, async p => { await toPlans(p); await closePanel(p); await W(600); }, []],
];

(async () => {
  const b = await launch();
  const log = [];
  for (const [name, opts, setup, crops] of scenes) {
    for (const dsf of [1, 3]) {
      const { ctx, page, errors } = await open(b, { ...base, ...opts, dsf });
      await setup(page);
      await shot(page, `${name}@${dsf}x`);
      if (dsf === 3) {
        // ~4x crops: re-open at 4x for the detail regions
      }
      log.push([name, dsf, errors.length]);
      await ctx.close();
    }
    if (crops.length) {
      const { ctx, page } = await open(b, { ...base, ...opts, dsf: 4 });
      await setup(page);
      for (const [cn, sel, pad] of crops) { try { await shot(page, `${name}-${cn}@4x`, await rect(page, sel, pad)); } catch (e) { log.push([name + '-' + cn, 'crop failed', e.message.slice(0, 60)]); } }
      await ctx.close();
    }
  }
  console.log(JSON.stringify(log));
  await b.close();
})();
