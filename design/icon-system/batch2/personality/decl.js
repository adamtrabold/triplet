// Batch 2 personality approaches (2026-11-03): the eight on canvas v295, each declared three ways (A contour, B the tell, C the lip),
// DECLARATIONS ONLY, built by the system's own maker (grid/src/system-make.js; the words in grid/src/system-detail.js). Spec:
// batch2/personality.md. Builds to batch2/personality/svg/<A|B|C>/18/<id>.svg.
//   TOOLS=<dir with node_modules/paper> node decl.js <A|B|C> [ids]
'use strict';
const fs = require('fs'), path = require('path');
const G = path.join(__dirname, '../../grid/src'), SYS = require(path.join(G, 'system.js'));
const S = (name, cls, spine, extra = {}) => ({ name, cls, spine, ...extra });
// the v295 eight, with a hook per root for each approach's words: x(id) returns the words that approach gives that root
const house = (i, pitch, deep, x) => [{ id: `roof${i}`, kind: 'gable', pitch, ends: 0, ...x('roof') }, { id: `wall${i}`, kind: 'block', w: 1, deep, ...x('wall') }];
const EIGHT = x => ({
  'lm-camera': S('Landmark: the camera', 'wide', [
    { id: 'finder', kind: 'block', w: 1 / 3, of: 'body', deep: 1 / 3, ...x('finder') },
    { id: 'body', kind: 'block', w: 1, deep: 2 / 3, hole: { shape: 'circle', w: 3 / 5, at: [1 / 2, 11 / 20] }, ...x('body') }]),
  'at-wheel4': S('Attraction: the wheel, 4 spokes, standing', 'square', [
    { id: 'rim', kind: 'ring', w: 1, ...x('rim') },
    { id: 'spokes', kind: 'spokes', of: 'rim', n: 4, turn: 0 },
    { id: 'legs', kind: 'splay', of: 'rim', lean: 24, past: 1 / 4, ...x('legs') },
    ...(x('base').base ? [x('base').base] : [])]),
  'venue': S('Venue: the curtain', 'square', [
    { id: 'rail', kind: 'slab', w: 1, ...x('rail') },
    { id: 'drapes', kind: 'drape', tie: 3 / 5, join: 'cut', ...x('drapes') },
    ...(x('stage').stage ? [x('stage').stage] : [])]),
  'ht-nofoot': S('Hotel: the bed', 'wide', [
    { id: 'pillow', kind: 'block', w: 1 / 3, of: 'mattress', at: 'left', deep: 1 / 2, ...x('pillow') },
    { id: 'mattress', kind: 'slab', w: 1, lines: 2, join: 'cut', ...x('mattress') },
    ...(x('foot').foot ? [x('foot').foot] : []),
    { id: 'head', kind: 'post', of: 'mattress', at: 'left', rise: true, join: 'into', ...x('head') }]),
  'sh-bag3': S('Shopping: the bag', 'tall', [
    { id: 'body', kind: 'vessel', w: 1, deep: 11 / 10, base: 7 / 8, ...x('bag') },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 3 / 5, rise: 0, into: 1 / 4 }]),
  'pk-picnic2': S('Park: the picnic table', 'wide', [
    { id: 'top', kind: 'slab', w: 1 / 2, of: 'seat', lines: 2, ...x('top') },   // D: lighter and narrower (read as a car or a hat)
    { id: 'legs', kind: 'splay', of: 'top', from: 'ends', lean: 20, to: 'bottom', ...x('tlegs') },
    { id: 'seat', kind: 'slab', w: 1, across: 'legs', at: 1 / 2 }]),
  'nb-kvarter': S('Neighborhood: the houses', 'diamond', [
    { side: [house(1, 1, 1 / 2, x), house(2, 2 / 3, 2 / 3, x), house(3, 6 / 5, 1 / 3, x)], widths: [3, 4, 3] }], { shape: true }),
  'st-walker': S('Street: the walker', 'diamond', [
    { id: 'head', kind: 'disc', w: 1 / 4, ...x('whead') },
    { id: 'body', kind: 'post', lean: 6, show: 1 / 4, join: 'cut' },
    { id: 'arms', kind: 'splay', of: 'body', from: 1 / 6, lean: [40, 34], reach: 1 / 3, ...x('arms') },
    { id: 'legs', kind: 'splay', of: 'body', from: 1, lean: [26, 38], to: 'bottom', ...x('wlegs') }], { shape: true }),
});
// each approach: the words per root (a root not named keeps its v295 declaration)
const WORDS = {
  A: {   // CONTOUR: the line between the ends is the part's own curve
    finder: { crown: { face: 'top', rise: 1 / 2 } }, body: { crown: { face: 'ends', rise: 1 } },
    legs: { taper: 3 / 2 }, drapes: { flare: 3 / 2 },
    mattress: { crown: { face: 'top', rise: 1 / 2 } }, pillow: { crown: { face: 'ends', rise: 1 / 2 } },
    bag: { belly: 1 / 3 }, tlegs: { taper: 3 / 2 }, roof: { ends: 1 / 2 },
    arms: { taper: 3 / 4 }, wlegs: { taper: 3 / 4 } },
  B: {   // THE TELL: the one detail drawn from memory
    body: { nub: [{ shape: 'block', on: 'top', at: 5 / 6, w: 1 }] }, rim: { cabins: { n: 6, d: 4 / 3, turn: 1 / 2 } },
    stage: { stage: { id: 'stage', kind: 'slab', w: 1, join: 'cut' } }, head: { nub: [{ shape: 'disc', on: 'top' }] },
    bag: { band: true }, wall: { door: [1 / 3, 1 / 2] },
    whead: { nub: [{ shape: 'brim', at: 1 / 3 }] } },
  C: {   // THE LIP: one part runs past what it meets
    finder: { lip: 'top' }, base: { base: { id: 'base', kind: 'slab', w: 1 / 2, across: 'legs', at: 1, lip: true } },
    rail: { lip: true }, head: { lip: 'top' }, bag: { band: true }, top: { lip: true }, roof: { lip: true }, wlegs: { lip: true } },
  D: {   // the director's turn 13: C as the base; B's construction details only; A's curves only of a kind the approved set has
    // (a cap face up: the coupe's foot; a post flaring into what it stands on: the coupe's stem; a gable on upright ends: the museum's)
    finder: { lip: 'top' }, body: { nub: [{ shape: 'block', on: 'top', at: 5 / 6, w: 1 }] },
    legs: { taper: 3 / 2 }, base: { base: { id: 'base', kind: 'slab', w: 1 / 2, across: 'legs', at: 1, lip: true } },
    rail: { lip: true },   // turn 14: the stage floor dropped (rod + floor read as a frame, a TV)
    mattress: { lip: true, crown: { face: 'top', rise: 1 / 2 } }, foot: { foot: { id: 'foot', kind: 'post', of: 'mattress', at: 'right', h: 1 / 6, join: 'into' } },
    bag: { band: true },
    top: { lines: 3 / 2, lip: true },
    roof: { ends: 1 / 2 }, wall: { door: [1 / 3, 1 / 2] },
    wlegs: { lip: true } },
};
const declsFor = A => EIGHT(id => WORDS[A][id] || {});
module.exports = { EIGHT, WORDS, declsFor };
if (require.main === module) {
  const A = process.argv[2], C = declsFor(A), ids = process.argv[3] ? process.argv[3].split(',') : Object.keys(C);
  const Mk = require(path.join(G, 'system-make.js')), SL = require(path.join(G, 'system-land.js')), Z = SYS.SIZES[18];
  for (const id of ids) {
    const decl = C[id], t0 = Date.now();
    try {
      const R = Mk.make(decl, { ...Z, master: null, drift: 1 / 8 }, SYS, { v264: null, land: (prims, s_) => SL.landPrims(prims, s_, { size: Z.frame, std: { stroke: null, counter: 0 } }) });
      const dir = path.join(__dirname, 'svg', A, '18'); fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="${R.d}"/></svg>\n`);
      fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify({ size: 18, meta: R.meta }));
      console.log(A, id, ((Date.now() - t0) / 1000).toFixed(0) + 's', R.meta.cls);
    } catch (e) { console.log(A, id, 'FAILED', String(e.stack).split('\n').slice(0, 4).join(' | ')); }
  }
}
