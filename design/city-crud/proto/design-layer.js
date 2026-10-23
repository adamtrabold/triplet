// City CRUD design layer (DESIGN PROTOTYPE ONLY -- never shipped). Injected into the real index.html by
// lib-cc.js after load. It draws the concepts' states with the app's own classes (.tag-*, .menu-*,
// .add-*, .sec-*, .plan-*) and tokens, so every still is the product's real type, paper and spacing;
// the only new CSS is under .cc-* below. Functions are called from ../stills/stills.js.
(function () {
  const css = `
  /* the City Label: the Hanging Tag's die with a navy printed band (a hotel label's printed panel) */
  .cc-city .tag-band { background-color: var(--navy); }
  .cc-city .tag-name.cc-cityname { font-stretch: 62%; font-weight: 700; font-size: 34px; line-height: 34px; text-transform: uppercase; letter-spacing: .02em; color: var(--navy); }
  .cc-city .tag-addr { margin-top: 4px; }
  .cc-city .tag-fields { margin-top: var(--s3); }
  .cc-seg-ico { width: 20px; height: 20px; display: block; }
  .tag-seg.cc-go { background: var(--navy); color: var(--paper); }
  .tag-seg.cc-quiet { color: var(--ink-2); }
  /* an editable name on a tag: the add tag's line voice -- the entry on its rule, pencil ink, a caret */
  .cc-edit { position: relative; border-bottom: 1px solid var(--navy); padding-bottom: 4px; }
  .cc-caret { display: inline-block; width: 2px; height: .9em; background: var(--navy); vertical-align: -0.08em; margin-left: 2px; }
  .cc-cap { font-stretch: 75%; text-transform: uppercase; font-weight: 500; font-size: 11px; line-height: 16px; letter-spacing: .12em; color: var(--ink-2); }
  .cc-help { margin-top: var(--s2); font-size: 13px; line-height: 18px; color: var(--ink-2); }
  /* delete: two printed choices, a radio dot each */
  .cc-choice { display: flex; align-items: center; gap: var(--s2); min-height: 44px; border-bottom: 1px solid var(--hair); }
  .cc-choice:last-child { border-bottom: none; }
  .cc-radio { width: 18px; height: 18px; flex: none; border-radius: 50%; border: 1.5px solid var(--navy); box-sizing: border-box; display: grid; place-items: center; }
  .cc-radio.on::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--navy); }
  .cc-choice .cc-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; line-height: 14px; letter-spacing: .1em; color: var(--navy); }
  .cc-choice .route-city { margin-left: 0; }
  .cc-choices { margin-top: var(--s3); padding-bottom: var(--s2); }
  /* an input row inside a menu (New city by your own name): 16px entry so iOS never zooms */
  .menu-row.cc-in { height: 48px; cursor: text; }
  .cc-field { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; height: 32px; padding: 0 var(--s2); background: var(--paper); border-bottom: 1.5px solid var(--navy);
    font-size: 16px; line-height: 20px; color: var(--ink); white-space: nowrap; overflow: hidden; }
  .cc-field.is-empty { color: var(--ink-2); }
  .cc-use { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; letter-spacing: .1em; color: var(--paper); background: var(--navy); border-radius: 3px; padding: 7px 10px; flex: none; }
  .cc-use.is-off { background: transparent; color: var(--ink-2); }
  .menu-row .cc-del { width: 28px; height: 28px; display: grid; place-items: center; color: var(--ink-2); flex: none; }
  .menu-row.cc-edit-row .menu-lab { text-decoration: underline; text-decoration-color: var(--hair); text-decoration-thickness: 1px; text-underline-offset: 5px; }
  .menu-cap .cc-done { margin-left: auto; color: var(--navy); }
  .cc-expand { padding: var(--s2) var(--s3) var(--s3); background: var(--paper); border-bottom: 1px solid var(--hair); }
  .cc-expand .cc-q { font-size: 13px; line-height: 18px; color: var(--ink); margin-bottom: var(--s2); display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
  .cc-expand .cc-acts { display: flex; justify-content: flex-end; gap: var(--s2); }
  .cc-btn { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; letter-spacing: .1em; padding: 9px 12px; border-radius: 3px; color: var(--navy); }
  .cc-btn.go { background: var(--navy); color: var(--paper); }
  /* the address line as a field (all concepts) */
  .add-addr.cc-addr-field { min-height: 33px; }
  .cc-addr-text { font-size: 16px; line-height: 20px; color: var(--ink-2); }
  /* move mode: the crosshair pin fixed at the map's centre + a slip */
  .cc-movepin { position: fixed; z-index: 1400; left: 50%; width: 36px; height: 48px; margin-left: -18px; pointer-events: none; }
  .cc-slip { position: fixed; z-index: 2600; left: 16px; right: 16px; background: var(--paper-raised); border: 1px solid var(--navy); box-shadow: 4px 4px 0 var(--navy); padding: var(--s3) var(--s4) var(--s3); }
  .cc-slip h3 { margin: 0 0 4px; font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 13px; letter-spacing: .1em; color: var(--navy); }
  .cc-slip p { margin: 0 0 var(--s3); font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .cc-slip .cc-acts { display: flex; justify-content: flex-end; gap: var(--s2); }
  /* C: the working city's foot (the plan foot's voice) and its empty note */
  .cc-note { padding: var(--s4) var(--gutter); font-size: 13px; line-height: 18px; color: var(--ink-2); background: var(--paper); }
  .cc-here { display: inline-flex; align-items: center; gap: 4px; margin-left: 6px; font-stretch: 75%; text-transform: uppercase; font-weight: 500; font-size: 10px; letter-spacing: .1em; color: var(--ink-2); }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const ICO = {
    pencil: '<svg class="cc-seg-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4.2L15.6 5.2a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19 4 20z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13.8 7l3.2 3.2" stroke="currentColor" stroke-width="1.8"/></svg>',
    move: '<svg class="cc-seg-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    del: '<svg class="cc-seg-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    plus: '<svg class="menu-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chev: '<svg class="add-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ring: '<svg class="menu-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>',
  };
  const NEW_STAMP = document.getElementById('addNewStamp') ? document.getElementById('addNewStamp').outerHTML.replace(' hidden', '').replace('id="addNewStamp"', '') : '';
  const W = ms => new Promise(r => setTimeout(r, ms));
  const CC = window.CC = { ICO };

  // ---- data: Philadelphia, a bucket for a roadtrip (real coordinates) ----
  CC.PHL = { label: 'Philadelphia', center: [39.9524, -75.1636], zoom: 12, geocodeSuffix: 'Philadelphia, United States', countrycodes: 'us', viewbox: '-75.28,39.87,-74.96,40.14' };
  CC.PHL_ROWS = [
    ['phl01', 'Reading Terminal Market', 'restaurant', 39.9533, -75.1590, '1136 Arch Street · Center City', false, true],
    ['phl02', 'Philadelphia Museum of Art', 'attraction', 39.9656, -75.1810, '2600 Benjamin Franklin Parkway · Fairmount', false, false],
    ['phl03', 'Longwood Gardens', 'nature', 39.8720, -75.6750, 'Longwood Road · Kennett Square', true, false],
    ['phl04', 'Hagley Museum', 'attraction', 39.7788, -75.5770, '200 Hagley Creek Road · Wilmington', false, false],
    ['phl05', 'Cape Henlopen State Park', 'nature', 38.7709, -75.1033, 'Cape Henlopen Drive · Lewes', false, false],
    ['phl06', 'Dogfish Head Brewings & Eats', 'bar', 38.7197, -75.0807, '320 Rehoboth Avenue · Rehoboth Beach', false, false],
  ];
  CC.seedPhilly = (withPlaces = true) => {
    CITIES.philadelphia = { ...CC.PHL };
    if (withPlaces) {
      const rows = CC.PHL_ROWS.map(([id, name, category, lat, lng, short, starred, visited], i) => ({ id, name, category, lat, lng, short_address: short, address: short, notes: null, starred, visited,
        city: 'philadelphia', created_at: new Date(Date.UTC(2026, 9, 20, 0, i)).toISOString() }));
      rows.forEach(r => window.__ROWS.push(r));
      locations = locations.concat(rows);
    }
    updateUI();
  };
  CC.addCityRaw = (id, cfg) => { CITIES[id] = cfg; updateUI(); };
  CC.unhideAll = () => { hiddenCities.clear(); persistHiddenCities(); updateUI(); };
  CC.hideOnly = ids => { hiddenCities.clear(); ids.forEach(i => hiddenCities.add(i)); persistHiddenCities(); updateUI(); };

  // ---- the address line as a field (shared by all concepts) ----
  // typing in ADDRESS: the line holds the typed text (16px entry), the results panel opens under ITS rule
  CC.addressTyping = (text, results) => {
    const row = document.getElementById('addAddrRow');
    row.classList.add('cc-addr-field', 'has-text');
    row.style.borderBottomColor = 'var(--navy)';
    // while it is written on, the line keeps its caption above the entry (B4's CITY NAME pattern), so
    // the address being typed is plainly on the ADDRESS line, under the empty NAME line
    document.getElementById('addAddr').innerHTML = `<span class="cc-cap" style="display:block;margin-top:8px">Address</span><span class="cc-addr-text" style="color:var(--ink)">${text}</span><span class="cc-caret"></span>`;
    const res = document.getElementById('addResults');
    const top = row.getBoundingClientRect().bottom - res.parentElement.getBoundingClientRect().top;
    res.style.setProperty('--res-top', top + 'px');
    res.innerHTML = results.map(([n, w]) => `<button type="button" class="add-res"><span class="add-res-name">${n}</span><span class="add-res-where">${w}</span></button>`).join('');
    res.hidden = false;
  };
  CC.setName = text => { const n = document.getElementById('nameInput'); n.value = text; n.dispatchEvent(new Event('input')); autoGrow(n); document.getElementById('addNameRow').classList.toggle('has-text', !!text); };
  CC.hideResults = () => { const r = document.getElementById('addResults'); r.hidden = true; };
  CC.addrShown = (text, dist, cap) => {
    const row = document.getElementById('addAddrRow');
    row.classList.add('has-text'); row.style.borderBottomColor = '';
    document.getElementById('addAddr').innerHTML = `${cap ? `<span class="cc-cap" style="display:block;margin-top:8px">${cap}</span>` : ''}${text}${dist ? `<span class="tag-dist-sep" aria-hidden="true"> · </span><span class="tag-dist" style="display:inline;padding:0;white-space:nowrap">${dist}</span>` : ''}`;
    const d = document.getElementById('addDist'); if (d) d.hidden = true;
  };
  CC.routeLine = (label, isNew) => {
    document.getElementById('addCityName').textContent = label;
    document.getElementById('addNewStamp').hidden = !isNew;
  };

  // ---- B / A: the add tag's city menu with "New city" by your own name ----
  // rows: the shipped menu (your cities + "New city · + {town}"), then an input row "+ [typed] USE"
  CC.cityMenuWithInput = (typed, opts = {}) => {
    const m = document.getElementById('addCityMenu');
    const foot = m.querySelector('.menu-foot');
    const field = `<div class="menu-row cc-in" role="presentation">${ICO.plus}<span class="cc-field${typed ? '' : ' is-empty'}">${typed || 'Name a city…'}${typed ? '<span class="cc-caret"></span>' : ''}</span><span class="cc-use${typed ? '' : ' is-off'}">Use</span></div>`;
    if (foot) foot.insertAdjacentHTML('beforeend', field);
    else m.insertAdjacentHTML('beforeend', `<div class="menu-foot"><div class="menu-cap is-mid">New city</div>${field}</div>`);
    if (opts.townFirst === false && foot) { const t = foot.querySelector('[data-newcity]'); if (t) t.remove(); }
    const r = document.getElementById('addCityBtn').getBoundingClientRect();
    m.style.maxHeight = 'none';
  };

  // ---- B: the City Label (a city's own tag), hung from the city's centre dot ----
  CC.labelHtml = ({ name, where, fields, stub, body }) => `<div class="tag cc-city" role="group" aria-label="${name}">`
    + `<div class="tag-body"><span class="tag-shadow" aria-hidden="true"><span class="tag-shape"></span></span>`
    + `<button type="button" class="tag-x" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg></button><div class="tag-stock">`
    + `<span class="tag-band" style="${texVars('phl', 'band', 160, .06)}" aria-hidden="true"></span><span class="tag-patch" aria-hidden="true"></span>`
    + `<div class="tag-in">${body || `<h2 class="tag-name cc-cityname">${name}</h2><div class="tag-addr">${where}</div>`
      + `<div class="tag-fields">${fields.map(([l, v], i) => `<span class="tag-f"><span class="tag-lab">${l}</span><span class="tag-val tag-stamp" style="--tilt:${[-1.5, 1.2, -.8][i % 3]}deg;${texVars('phl' + i, 'n', 170, .1)}">${v}</span></span>`).join('')}</div>`}</div>`
    + `<div class="tag-stub">${stub.map(s => `<span class="tag-slot"><button type="button" class="tag-seg ${s.cls || ''}">${s.ico || ''}<span>${s.t}</span></button></span>`).join('')}</div>`
    + `</div></div><span class="tag-string" aria-hidden="true"></span></div>`;
  CC.openLabel = async (latlng, html) => {
    if (map._popup) map.closePopup();
    const p = newTagPopup();
    const src = L.circleMarker(latlng, { radius: 1, opacity: 0, fillOpacity: 0, color: '#12293F', interactive: false }).addTo(map);
    p.setContent(html);
    src.bindPopup(p); src.openPopup(latlng);
    await W(1400);
    return p;
  };
  CC.setLabel = html => { const c = map._popup && map._popup.getElement(); if (!c) return; const t = c.querySelector('.tag'); t.outerHTML = html; map._popup.update && map._popup.update(); };
  CC.STUB_READ = [{ t: 'Rename', ico: ICO.pencil }, { t: 'Move', ico: ICO.move }, { t: 'Delete', ico: ICO.del }];

  // ---- the title menu, Places side, with a "New city" row before the quiet switch (B, C) ----
  CC.titleMenuNewCity = (inputText) => {
    const m = document.getElementById('titleMenu');
    const kind = m.querySelector('.menu-row[data-kind]');
    const row = inputText == null
      ? `<button type="button" class="menu-row" role="menuitem">${ICO.plus}<span class="menu-lab">New city</span><span class="menu-gap"></span></button>`
      : `<div class="menu-row cc-in" role="presentation">${ICO.plus}<span class="cc-field">${inputText}<span class="cc-caret"></span></span><span class="cc-use">Create</span></div>`;
    CC.grow(m, () => kind.insertAdjacentHTML('beforebegin', row));
  };
  // A: the title menu in edit mode -- every city a writable name + a delete x; "New city" at the foot
  // grow a body-level menu upward by what fn adds (the shipped placement re-renders; this keeps our rows)
  CC.grow = (m, fn, scrollEnd = true) => {
    const r0 = m.getBoundingClientRect(); fn();
    m.style.height = 'auto'; m.style.maxHeight = 'none';
    const h1 = m.scrollHeight + 2;
    const top = Math.max(96, Math.min(r0.top, innerHeight - 8 - h1));   // grows up as far as it must, as a tall menu does
    m.style.top = top + 'px';
    m.style.height = Math.min(h1, innerHeight - top - 8) + 'px';
    if (scrollEnd) m.scrollTop = m.scrollHeight;
  };
  CC.titleMenuEdit = (expandId, expandHtml) => {
    const m = document.getElementById('titleMenu');
    CC.grow(m, () => CC._edit(m, expandId, expandHtml));
  };
  CC._edit = (m, expandId, expandHtml) => {
    const rows = [...m.querySelectorAll('.menu-row[data-go], .menu-row[data-city], .menu-row')].filter(r => !r.hasAttribute('data-kind'));
    m.querySelectorAll('.menu-row').forEach((r, i) => {
      if (r.hasAttribute('data-kind')) return;
      const lab = r.querySelector('.menu-lab'); if (!lab) return;
      if (i === 0) { r.remove(); return; }   // "All places" leaves the menu in edit mode
      r.classList.add('cc-edit-row');
      const end = r.querySelector('.menu-end'); if (end) end.outerHTML = `<span class="cc-del">${ICO.x}</span>`;
      else r.insertAdjacentHTML('beforeend', `<span class="cc-del">${ICO.x}</span>`);
      r.querySelectorAll('.tally').forEach(t => t.remove());
    });
    m.insertAdjacentHTML('afterbegin', `<div class="menu-cap">Edit cities<span class="cc-done">Done</span></div>`);
    const kind = m.querySelector('.menu-row[data-kind]');
    kind.insertAdjacentHTML('beforebegin', `<button type="button" class="menu-row" role="menuitem">${ICO.plus}<span class="menu-lab">New city</span><span class="menu-gap"></span></button>`);
    if (expandId) {
      const target = [...m.querySelectorAll('.menu-row')].find(r => (r.textContent || '').trim().toLowerCase().startsWith(expandId.toLowerCase()));
      if (target) target.insertAdjacentHTML('afterend', expandHtml);
    }
  };

  // ---- C: the working city's foot + empty note under its section header ----
  CC.cityFoot = (cityId, { note, foot } = {}) => {
    const e = cityHeads.get(cityId); if (!e) return;
    let after = e.el;
    if (note) { after.insertAdjacentHTML('afterend', `<div class="cc-note">${note}</div>`); after = after.nextElementSibling; }
    if (foot) after.insertAdjacentHTML('afterend', `<div class="plan-foot" role="group"><button type="button" class="plan-act">Rename</button><button type="button" class="plan-act">Move centre</button><button type="button" class="plan-act">Delete city…</button></div>`);
  };

  // ---- B: move mode -- the centre pin + a slip ----
  CC.moveMode = (cityName) => {
    if (map._popup) map.closePopup();
    const mp = map.getContainer().getBoundingClientRect();
    const cy = mp.top + mp.height / 2;
    // the city's own signpost (phase 4's post, pole and board), standing fixed at the map's centre
    const b = { label: cityName, count: 6 }, w = boardW(b), h = BOARD_H(), d = boardPath(w, h, sNum(3), 'e');
    document.body.insertAdjacentHTML('beforeend', `<div class="sp-anchor" style="position:fixed;z-index:1400;left:${innerWidth / 2}px;top:${cy}px"><div class="sp-post" style="--wl:0px;--wr:${w}px;--rows:1"><span class="sp-pole"></span>`
      + `<span class="sp-board is-e" style="width:${w}px;grid-row:1"><svg class="sp-shape" width="${w + 2}" height="${h + 2}" viewBox="0 0 ${w + 2} ${h + 2}" aria-hidden="true"><path class="sp-shadow" d="${d.shadow}"/><path class="sp-fill" d="${d.fill}"/><path class="sp-line" d="${d.stroke}"/></svg>`
      + `<span class="sp-lab">${cityName}<span class="tally">6</span></span></span><span class="sp-foot"></span></div></div>`);
    const sheetTop = document.getElementById('locations').getBoundingClientRect().top;
    document.body.insertAdjacentHTML('beforeend', `<div class="cc-slip" style="bottom:${innerHeight - sheetTop + 16}px"><h3>Move ${cityName}</h3><p>Drag the map until the post stands on ${cityName}. Going to the city lands here, and distances are measured from here. Its places stay put.</p><div class="cc-acts"><span class="cc-btn">Cancel</span><span class="cc-btn go">Done</span></div></div>`);
  };
})();
