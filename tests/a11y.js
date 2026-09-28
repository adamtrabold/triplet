// a11y tree diff: popup (starred+visited and not) + add form open, main vs proto. env PROTO.
const { launch, openProto } = require('./lib');
(async () => { const b = await launch(); const out = {};
  for (const [tag, file] of [['main', require('./lib').BASE_FILE], ['proto', require('./lib').FILE]]) for (const st of [false, true]) {
    const { ctx, page } = await openProto(b, { dsf: 1, file }); const cdp = await ctx.newCDPSession(page);
    await page.evaluate(async st => { const loc = locations[0]; Object.assign(loc, { starred: st, visited: st }); map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI(); markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 400));
      document.getElementById('addForm').classList.add('show'); document.getElementById('controls').classList.add('show'); }, st);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree'); const byId = new Map(nodes.map(n => [n.nodeId, n]));
    const inside = async sel => { const { root } = await cdp.send('DOM.getDocument', { depth: -1 }); const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel }); const { nodes: sub } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false }); return nodeId; };
    const flat = n => (!n.ignored ? [`${n.role && n.role.value}:${n.name && n.name.value}${(n.properties || []).filter(p => ['pressed', 'checked'].includes(p.name)).map(p => '[' + p.name + '=' + p.value.value + ']').join('')}`] : []);
    const pick = nodes.filter(n => !n.ignored).map(n => flat(n)[0]).filter(s => !/^(generic|none|InlineTextBox|StaticText|image|graphics-|Canvas):?/.test(s));
    out[tag + (st ? ' starred+visited' : ' plain')] = pick; await ctx.close(); }
  const ms = (a, b2) => { const c = [...b2]; const miss = []; a.forEach(x => { const i = c.indexOf(x); if (i < 0) miss.push(x); else c.splice(i, 1); }); return { onlyMain: miss, onlyProto: c }; };
  const res = { plain: ms(out['main plain'], out['proto plain']), starredVisited: ms(out['main starred+visited'], out['proto starred+visited']), switchOrCheckbox: Object.values(out).flat().filter(x => /^(checkbox|switch)/.test(x)).length, sample: out['proto starred+visited'].filter(x => /star|visit|direction|label/i.test(x)) };
  console.log(JSON.stringify(res, null, 1)); require('fs').writeFileSync(require('./lib').outPath('a11y.json'), JSON.stringify({ res, out }, null, 1)); 
  const okA = !res.plain.onlyMain.length && !res.plain.onlyProto.length && !res.starredVisited.onlyMain.length && !res.starredVisited.onlyProto.length && res.switchOrCheckbox === 0;
  console.log(okA ? 'ALL PASS' : 'FAIL'); await b.close(); process.exitCode = okA ? 0 : 1; })();
