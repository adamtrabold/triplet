// Batch 2 jam sketches (visual designer, turn 2). Each sketch is a DECLARATION ONLY, built by the system's own maker
// (grid/src/system-make.js), exactly as system.js build does, into batch2/sketches/svg/<size>/<id>.svg. Nothing here draws.
//   TOOLS=<dir with node_modules/paper, clipper-lib> node sketch.js <18|24|12> [ids]
'use strict';
const fs = require('fs'), path = require('path');
const G = path.join(__dirname, '../../grid/src'), SYS = require(path.join(G, 'system.js'));
const OUT = path.join(__dirname, 'svg');
const S = (name, cls, spine, extra = {}) => ({ name, cls, spine, ...extra });
const SK = {
  // ---- Landmark
  'lm-obelisk': S('Landmark: obelisk on a step', 'tall', [
    { id: 'tip', kind: 'gable', of: 'shaft', pitch: 1, ends: 0 },
    { id: 'shaft', kind: 'slab', w: 1 / 3, of: 'step', lines: 5 },
    { id: 'step', kind: 'slab', w: 1, join: 'cut' }]),
  'lm-needle': S('Landmark: needle on a plinth', 'tall', [
    { id: 'tip', kind: 'gable', of: 'shaft', pitch: 1.6, ends: 0 },
    { id: 'shaft', kind: 'slab', w: 1 / 2, of: 'base', lines: 5 },
    { id: 'base', kind: 'slab', w: 1, lines: 2, join: 'cut' }]),
  'lm-viewer': S('Landmark: coin-op viewer (turn 1 L1)', 'tall', [
    { id: 'head', kind: 'block', w: 1, deep: 1 / 2 },
    { id: 'post', kind: 'post', join: 'into', show: 1, showOf: 'head' },
    { id: 'foot', kind: 'cap', w: 3 / 4, face: 'up', join: 'into' }]),
  // ---- Attraction
  'at-bigtop': S('Attraction: big top, flaps tied open', 'square', [
    { id: 'roof', kind: 'gable', of: 'rail', pitch: 2 / 3, ends: 0 },
    { id: 'rail', kind: 'slab', w: 1, join: 'cut' },
    { id: 'drapes', kind: 'drape', tie: 2 / 5, join: 'cut' }]),
  'at-wheel4': S('Attraction: wheel, 4 spokes, tall stand', 'square', [
    { id: 'rim', kind: 'ring', w: 1 },
    { id: 'spokes', kind: 'spokes', of: 'rim', n: 4, turn: 0 },
    { id: 'legs', kind: 'splay', of: 'rim', lean: 24, past: 1 / 4 }]),
  // ---- Venue
  'vn-stage': S('Venue: curtain at the stage lip', 'square', [
    { id: 'rail', kind: 'slab', w: 1 },
    { id: 'drapes', kind: 'drape', tie: 1 / 2, join: 'cut' },
    { id: 'stage', kind: 'slab', w: 1, join: 'cut' }]),
  'vn-spot': S('Venue: the light on the stage', 'square', [
    { id: 'beam', kind: 'gable', of: 'stage', w: 2 / 3, pitch: 1.4, ends: 0 },
    { id: 'stage', kind: 'slab', w: 1, join: 'cut' }]),
  // ---- Hotel
  'ht-nofoot': S('Hotel: bed, foot taken away', 'wide', [
    { id: 'pillow', kind: 'block', w: 1 / 3, of: 'mattress', at: 'left', deep: 1 / 2 },
    { id: 'mattress', kind: 'slab', w: 1, lines: 2, join: 'cut' },
    { id: 'head', kind: 'post', of: 'mattress', at: 'left', rise: true, join: 'into' }]),
  'ht-board': S('Hotel: bed, foot board, no legs', 'wide', [
    { id: 'pillow', kind: 'block', w: 1 / 3, of: 'mattress', at: 'left', deep: 1 / 2 },
    { id: 'mattress', kind: 'slab', w: 1, lines: 2, join: 'cut' },
    { id: 'foot', kind: 'post', of: 'mattress', at: 'right', h: 0, join: 'into' },
    { id: 'head', kind: 'post', of: 'mattress', at: 'left', rise: true, join: 'into' }]),
  // ---- Shopping
  'sh-tote': S('Shopping: tote, handle stands up', 'tall', [
    { id: 'body', kind: 'block', w: 1, deep: 4 / 5 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 1 / 2, rise: 1 }]),
  'sh-carrier': S('Shopping: carrier, deep body', 'tall', [
    { id: 'body', kind: 'block', w: 1, deep: 6 / 5 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 3 / 5, rise: 0, into: 1 / 4 }]),
  // ---- Park
  'pk-picnic': S('Park: picnic table, end on', 'wide', [
    { id: 'top', kind: 'slab', w: 3 / 5, of: 'seat' },
    { id: 'legs1', kind: 'row', n: 2, h: 1 / 3, join: 'held' },
    { id: 'seat', kind: 'slab', w: 1, join: 'held' },
    { id: 'legs2', kind: 'row', n: 2, h: 1 / 4, join: 'held' }]),
  'pk-lawn': S('Park: sun over the lawn', 'wide', [
    { id: 'sun', kind: 'disc', w: 1 / 3 },
    { id: 'lawn', kind: 'cap', w: 1, face: 'up', join: 'cut' }]),
  // ---- Neighbourhood (shapes)
  'nb-square': S('Neighborhood: blocks round a square', 'diamond', [
    { id: 'blocks', kind: 'blocks', w: 1, cols: 3, rows: 3, open: [[1, 1]], turn: 45 }], { shape: true }),
  'nb-four': S('Neighborhood: four blocks', 'diamond', [
    { id: 'blocks', kind: 'blocks', w: 1, cols: 2, rows: 2, turn: 45 }], { shape: true }),
  // ---- Street (shapes)
  'st-corridor': S('Street: the corridor', 'diamond', [
    { id: 'blocks', kind: 'blocks', w: 1, cols: [1, 1], rows: 3, avenue: 'c1', wide: 3, turn: 45 }], { shape: true }),
  'st-lamp': S('Street: the street lamp', 'diamond', [
    { id: 'hood', kind: 'gable', of: 'lantern', w: 1, pitch: 1 / 2, ends: 1 / 2 },
    { id: 'lantern', kind: 'block', w: 1 / 3, deep: 1, join: 'cut' },
    { id: 'post', kind: 'post', join: 'into' }], { shape: true }),
};
module.exports = { SK };
if (require.main === module) {
  const size = +process.argv[2], ids = process.argv[3] ? process.argv[3].split(',') : Object.keys(SK);
  const Mk = require(path.join(G, 'system-make.js')), SL = require(path.join(G, 'system-land.js')), Z = SYS.SIZES[size];
  for (const id of ids) {
    const decl = SK[id], t0 = Date.now();
    try {
      const R = Mk.make(decl, { ...Z, master: null, drift: 1 / 8 }, SYS, { v264: null, land: (prims, s_) => SL.landPrims(prims, s_, { size: Z.frame, std: { stroke: null, counter: 0 } }) });
      let d = R.d; if (Z.close) d = SL.closeSmall(d, Z.counter / Z.k).d;
      const dir = path.join(OUT, String(size)); fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${Z.frame}" height="${Z.frame}"><path fill-rule="evenodd" d="${d}"/></svg>\n`);
      console.log(size, id, ((Date.now() - t0) / 1000).toFixed(0) + 's', R.meta.cls);
    } catch (e) { console.log(size, id, 'FAILED', String(e.stack).split('\n').slice(0, 3).join(' | ')); }
  }
}
