// Batch 2 concepts: every concept is a DECLARATION ONLY, built by the system's own maker (grid/src/system-make.js) exactly as
// `system.js build` does, into batch2/concepts/svg/<size>/<id>.svg (and a .json with what each rule decided). Nothing here draws.
// The per-category files (landmark.md, ...) say how each concept works; this file is the one place their declarations live.
//   TOOLS=<dir with node_modules/paper> node decl.js <18|24|12> [ids]      (18 first: 24 and 12 read the 18's proportions)
'use strict';
const fs = require('fs'), path = require('path');
const G = path.join(__dirname, '../../grid/src'), SYS = require(path.join(G, 'system.js'));
const OUT = path.join(__dirname, 'svg');
const S = (name, cls, spine, extra = {}) => ({ name, cls, spine, ...extra });
// a column of a group side by side: a house (a gable over a block), a lamp (hood, lantern, post)
const house = (i, pitch, deep) => [{ id: `roof${i}`, kind: 'gable', pitch, ends: 0 }, { id: `wall${i}`, kind: 'block', w: 1, deep }];
const lamp = (i, show) => [
  { id: `hood${i}`, kind: 'gable', of: `lantern${i}`, w: 5 / 3, pitch: 1 / 2, ends: 1 / 2 },
  { id: `lantern${i}`, kind: 'block', w: 3 / 5, deep: 1, join: 'cut' },
  { id: `post${i}`, kind: 'post', join: 'into', show, showOf: `lantern${i}` }];
const D = SYS.DECL;
const C = {
  // ---- Landmark
  'lm-needle': S('Landmark: the needle on its plinth', 'tall', [
    { id: 'tip', kind: 'gable', of: 'shaft', pitch: 3 / 4, ends: 0 },   // visual 11-02: 1.6 read as a pencil; a low pyramidion
    { id: 'shaft', kind: 'slab', w: 1 / 2, of: 'base', lines: 6 },
    { id: 'base', kind: 'slab', w: 1, lines: 2, join: 'cut' }]),
  'lm-camera': S('Landmark: the camera', 'wide', [
    { id: 'finder', kind: 'block', w: 1 / 3, of: 'body', deep: 1 / 3 },
    { id: 'body', kind: 'block', w: 1, deep: 2 / 3, hole: { shape: 'circle', w: 3 / 5, at: [1 / 2, 11 / 20] } }]),
  // ---- Attraction
  // 11-03: the Landmark second, replacing the needle: the fountain at the middle of the square
  'lm-fountain': S('Landmark: the fountain', 'square', [
    // 11-03: a jet disc over one bowl read as an "i" (info): two tiers instead, no disc
    { id: 'bowl1', kind: 'cap', w: 1 / 3, face: 'down' },
    { id: 'stem1', kind: 'post', join: 'into', show: 2, showOf: 'bowl1' },
    { id: 'bowl2', kind: 'cap', w: 2 / 3, face: 'down', join: 'into' },
    { id: 'stem2', kind: 'post', join: 'into', show: 2, showOf: 'bowl1' },
    { id: 'basin', kind: 'cap', w: 1, face: 'down', join: 'into' }]),
  'at-bunting': S('Attraction: bunting between two poles', 'square', [
    { id: 'line', kind: 'slab', w: 1 },
    { side: [[{ id: 'flag1', kind: 'gable', face: 'down', pitch: 2.4, ends: 0 }], [{ id: 'flag2', kind: 'gable', face: 'down', pitch: 2.4, ends: 0 }], [{ id: 'flag3', kind: 'gable', face: 'down', pitch: 2.4, ends: 0 }]], widths: [3, 4, 3], w: 3 / 4, join: 'cut' }]),   // visual 11-02: no poles (they made a frame: a valance), pennants a cut under the line
  'at-wheel4': S('Attraction: the wheel, 4 spokes, standing', 'square', [
    { id: 'rim', kind: 'ring', w: 1 },
    { id: 'spokes', kind: 'spokes', of: 'rim', n: 4, turn: 0 },
    { id: 'legs', kind: 'splay', of: 'rim', lean: 24, past: 1 / 4 }]),
  'attraction': D.attraction,
  // ---- Venue
  'vn-stage': S('Venue: the curtain at the stage lip', 'square', [
    { id: 'rail', kind: 'slab', w: 1 },
    { id: 'drapes', kind: 'drape', tie: 1 / 2, join: 'cut' },
    { id: 'stage', kind: 'slab', w: 1, join: 'cut' }]),
  'venue': D.venue,
  // ---- Hotel
  'ht-nofoot': S('Hotel: the bed, its foot taken away', 'wide', [
    { id: 'pillow', kind: 'block', w: 1 / 3, of: 'mattress', at: 'left', deep: 1 / 2 },
    { id: 'mattress', kind: 'slab', w: 1, lines: 2, join: 'cut' },
    { id: 'head', kind: 'post', of: 'mattress', at: 'left', rise: true, join: 'into' }]),
  'ht-board': S('Hotel: the bed with a foot board, no legs', 'wide', [
    { id: 'pillow', kind: 'block', w: 1 / 3, of: 'mattress', at: 'left', deep: 1 / 2 },
    { id: 'mattress', kind: 'slab', w: 1, lines: 2, join: 'cut' },
    { id: 'foot', kind: 'post', of: 'mattress', at: 'right', h: 0, join: 'into' },
    { id: 'head', kind: 'post', of: 'mattress', at: 'left', rise: true, join: 'into' }]),
  // ---- Shopping
  'shopping': D.shopping,
  'sh-carrier': S('Shopping: the carrier, a deeper body', 'tall', [
    { id: 'body', kind: 'block', w: 1, deep: 6 / 5 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 3 / 5, rise: 0, into: 1 / 4 }]),
  // 11-03 (director turn 9, fix 5): a container is a vessel, taller than wide and tapering, never a block under an arch (a padlock)
  'sh-bag': S('Shopping: the bag, a vessel on a flat base', 'tall', [
    { id: 'body', kind: 'vessel', w: 1, deep: 6 / 5, base: 4 / 5 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 3 / 5, rise: 0, into: 1 / 4 }]),
  'sh-bag2': S('Shopping: the bag, a vessel on a flat base, a gentler taper', 'tall', [
    { id: 'body', kind: 'vessel', w: 1, deep: 1, base: 7 / 8 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 3 / 5, rise: 0, into: 1 / 4 }]),
  'sh-bag3': S('Shopping: the bag, a vessel on a flat base, taller than wide, a gentle taper', 'tall', [
    { id: 'body', kind: 'vessel', w: 1, deep: 11 / 10, base: 7 / 8 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 3 / 5, rise: 0, into: 1 / 4 }]),
  'sh-bag-cup': S('Shopping: the bag, the cup\'s own vessel', 'tall', [
    { id: 'body', kind: 'vessel', w: 1, deep: 6 / 5 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 3 / 5, rise: 0, into: 1 / 4 }]),
  // ---- Park
  'pk-picnic': S('Park: the picnic table, end on', 'wide', [
    { id: 'top', kind: 'slab', w: 3 / 5, of: 'seat' },
    { id: 'legs1', kind: 'row', n: 2, h: 1 / 3, join: 'held' },
    { id: 'seat', kind: 'slab', w: 1, join: 'held' },
    { id: 'legs2', kind: 'row', n: 2, h: 1 / 4, join: 'held' }]),
  // 11-03 (director turn 7, rule 2): the table's legs splay from the top's two ends; the seat lies across them
  'pk-picnic2': S('Park: the picnic table, end on, legs splayed', 'wide', [
    // 11-03 (director turn 11): the top is the solid the table is (Solids are shapes): two lines, as the mattress is
    { id: 'top', kind: 'slab', w: 1 / 2, of: 'seat', lines: 2 },
    { id: 'legs', kind: 'splay', of: 'top', from: 'ends', lean: 20, to: 'bottom' },
    { id: 'seat', kind: 'slab', w: 1, across: 'legs', at: 1 / 2 }]),
  'pk-swing': S('Park: the swing', 'square', [
    { id: 'bar', kind: 'slab', w: 1 },
    { id: 'frame', kind: 'splay', of: 'bar', from: 'ends', lean: 12, to: 'bottom' },
    { id: 'ropes', kind: 'row', n: 2, w: 1 / 4, h: 2 / 3, join: 'held' },   // visual 11-02: 2/5 read as a stool; a small seat, long ropes
    { id: 'seat', kind: 'slab', w: 1 / 4, of: 'bar', join: 'held' }]),
  // ---- Neighbourhood (shapes, in the diamond)
  'nb-kvarter': S('Neighborhood: the kvarter, three uneven houses on one base', 'diamond', [
    { side: [house(1, 1, 1 / 2), house(2, 2 / 3, 2 / 3), house(3, 6 / 5, 1 / 3)], widths: [3, 4, 3] }], { shape: true }),   // visual 11-02: no base (it read as a separate bar)
  'nb-roofs': S('Neighborhood: two roofs at the diamond\'s own pitch', 'diamond', [
    { side: [house(1, 1, 1 / 3), house(2, 1, 1 / 3)] }], { shape: true }),
  'nb-windows': S('Neighborhood: the lit windows', 'diamond', [
    { id: 'roof', kind: 'slab', w: 1 },
    { id: 'facade', kind: 'block', w: 1, deep: 1, join: 'cut', hole: { shape: 'block', n: [2, 2] } }], { shape: true }),
  // ---- Street (shapes, in the diamond)
  'street': D.street,
  // 11-03 (rule 3): the walker with arms, every part of the figure at the figure's post width
  'st-walker': S('Street: the walker, with arms', 'diamond', [
    { id: 'head', kind: 'disc', w: 1 / 4 },
    { id: 'body', kind: 'post', lean: 6, show: 1 / 4, join: 'cut' },
    { id: 'arms', kind: 'splay', of: 'body', from: 1 / 6, lean: [40, 34], reach: 1 / 3 },
    { id: 'legs', kind: 'splay', of: 'body', from: 1, lean: [26, 38], to: 'bottom' }], { shape: true }),
  // 11-03: the Street second, replacing the lamp: a terrace seen from across the street, its doors counted
  'st-terrace': S('Street: the terrace, a row of doors', 'diamond', [
    { id: 'cornice', kind: 'slab', w: 1 },
    { id: 'facade', kind: 'block', w: 1, deep: 1 / 2, join: 'cut', hole: { shape: 'block', n: [3, 1] } }], { shape: true }),
  'st-lamp': S('Street: the street lamp', 'diamond', [
    { id: 'hood', kind: 'gable', of: 'lantern', w: 1, pitch: 1 / 2, ends: 1 / 2 },
    { id: 'lantern', kind: 'block', w: 1 / 3, deep: 1, join: 'cut' },
    { id: 'post', kind: 'post', join: 'into' }], { shape: true }),
  'st-lamps': S('Street: three lamps, receding', 'diamond', [
    { side: [lamp(1, 3), lamp(2, 3), lamp(3, 3)], widths: [4, 3, 2] }], { shape: true }),
};
module.exports = { C };
if (require.main === module) {
  const size = +process.argv[2], ids = process.argv[3] ? process.argv[3].split(',') : Object.keys(C);
  const Mk = require(path.join(G, 'system-make.js')), SL = require(path.join(G, 'system-land.js')), Z = SYS.SIZES[size];
  for (const id of ids) {
    const decl = C[id], t0 = Date.now();
    try {
      const mf = path.join(OUT, '18', `${id}.json`), master = size !== 18 && fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')).meta.read || null : null;
      const R = Mk.make(decl, { ...Z, master, drift: 1 / 8 }, SYS, { v264: null, land: (prims, s_) => SL.landPrims(prims, s_, { size: Z.frame, std: { stroke: null, counter: 0 } }) });
      let d = R.d; if (Z.close) d = SL.closeSmall(d, Z.counter / Z.k).d;
      const dir = path.join(OUT, String(size)); fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${Z.frame}" height="${Z.frame}"><path fill-rule="evenodd" d="${d}"/></svg>\n`);
      fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify({ size, d, meta: R.meta, s: (Date.now() - t0) / 1000 }));
      console.log(size, id, ((Date.now() - t0) / 1000).toFixed(0) + 's', R.meta.cls);
    } catch (e) { console.log(size, id, 'FAILED', String(e.stack).split('\n').slice(0, 4).join(' | ')); }
  }
}
