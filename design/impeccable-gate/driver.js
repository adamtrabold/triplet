// Runtime-layer state driver. gate.mjs injects this as the first <script> of the page
// it serves to `impeccable detect <url>`, so the detector scans the app in a given UI
// state (?state=<name>), not just the first paint.
//
// The detector scans after network idle. To make it wait for the state, this script
// opens a long-held request (/__hold) at once; the server answers it only when the
// script reports /__ready (state reached) or /__ready?fail=<why>, so "network idle"
// means "state reached + 500ms". Same fixture as the gesture harness (stub.js),
// Reykjavik, signed in as the owner.
(function () {
  var q = new URLSearchParams(location.search), S = q.get('state') || 'list', K = q.get('k') || '';
  var STATES = {
    // name: [precondition selector (absent = n/a for this build), action, ready predicate]
    list: [null, function () {}, function () { return true; }],
    popup: ['#locationsList .location-card[data-id]', function () {
      var row = document.querySelector('#locationsList .location-card[data-id] .row-main') || document.querySelector('#locationsList .location-card[data-id]');
      row.click();
    }, function () { return !!document.querySelector('.leaflet-popup .leaflet-popup-content'); }],
    sort: ['#sortBtn', function () { document.getElementById('sortBtn').click(); },
      function () { var m = document.getElementById('sortMenu'); return m && !m.hidden && m.children.length > 0; }],
    add: ['#floatingAddBtn', function () { document.getElementById('floatingAddBtn').click(); },
      function () { var f = document.getElementById('addForm'); return f && !f.hidden; }],
    // add-tag-jam phase 1: Plans is picked in the list title's menu (the quiet row, then a plan)
    plans: ['#titleBtn', function () {
        document.getElementById('titleBtn').click();
        var q = document.querySelector('#titleMenu [data-kind="plans"]'); if (q) q.click();
        var p = document.querySelector('#titleMenu [data-plan]'); if (p) p.click();
      },
      function () { return document.body.classList.contains('plan-view') && !document.body.classList.contains('plan-none') && document.getElementById('titleMenu').hidden; }],
    // add-tag-jam phase 4: every fixture city shown, then the title menu's All places -- the map
    // zooms out to the city signposts (the only state that renders them)
    signposts: ['#titleBtn', function () {
        document.getElementById('titleBtn').click();
        var a = document.querySelector('#titleMenu [data-go="__all__"]'); if (a) a.click();
      },
      function () { return document.querySelectorAll('#map .sp-board').length >= 5 && document.getElementById('titleMenu').hidden; }],
  };
  try {
    localStorage.clear();
    localStorage.setItem('triplet.citySelection', 'reykjavik');
    // cities stopped being a list filter (add-tag-jam phase 1): hide the other fixture cities so the
    // list is Reykjavik's section, as the city chip made it before (the gesture harness does the same)
    localStorage.setItem('triplet.hiddenCities', JSON.stringify(S === 'signposts' ? [] : ['la', 'copenhagen', 'malmo', 'stockholm']));
    if (S === 'plans') localStorage.setItem('gh.plans', '1'); // the plans fixture in stub.js (plans builds)
  } catch (e) {}
  var done = false;
  function report(fail) {
    if (done) return; done = true;
    fetch('/__ready?k=' + K + (fail ? '&fail=' + encodeURIComponent(fail) : ''), { cache: 'no-store' }).catch(function () {});
  }
  fetch('/__hold?k=' + K, { cache: 'no-store' }).catch(function () {});
  var st = STATES[S];
  if (!st) { report('unknown state ' + S); return; }
  var t0 = Date.now();
  function waitFor(pred, ms, then, why) {
    (function tick() {
      var ok = false; try { ok = pred(); } catch (e) {}
      if (ok) return then();
      if (Date.now() - t0 > ms) return report(why);
      setTimeout(tick, 50);
    })();
  }
  addEventListener('DOMContentLoaded', function () {
    // app ready = the fixture's 21 rows are on screen (as lib.js waits for)
    waitFor(function () { return document.querySelectorAll('#locationsList .location-card[data-id]').length >= 21; }, 15000, function () {
      if (st[0] && !document.querySelector(st[0])) return report('n/a');
      t0 = Date.now();
      try { st[1](); } catch (e) { return report('action threw: ' + e.message); }
      // settle: let flights, popups and sheet transitions finish before the scan
      waitFor(st[2], 10000, function () { setTimeout(function () { report(); }, 900); }, 'state not reached');
    }, 'app did not render the fixture');
  });
})();
