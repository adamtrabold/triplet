// RIGHT SIZE: the app's cells, as real inline SVGs at true CSS size. Used by the board, the local sheet and the grey measure.
//   v280: the last board's builds (svg/back/build.json) placed the way the app would place them (the 24 drawing in its box);
//   now: svg/right/build.json, each size drawn 1:1 in its own box.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const NOW = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'right', 'build.json'), 'utf8'));
const V280 = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const NAVY = '#12293F', PAPER = '#F2EBDD', ORANGE = '#EE7434', CREAM = '#FAF5EA';
const BADGE = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const RIM = { v280: { 18: 1.5, 24: 2.5 }, now: { 18: 4 / 3, 24: 2 } };
const P = (d, col = NAVY) => `<path fill="${col}" fill-rule="evenodd" d="${d}"/>`;
// the glyph: v280 = its 24-unit drawing in the box (as badgeHtml() scales it); now = the box's own drawing, 1:1
const glyph = (set, n, size, col) => set === 'now'
  ? `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;left:0;top:0;overflow:visible">${P(NOW[n].sizes[size].d, col)}</svg>`
  : `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="position:absolute;left:0;top:0">${P(V280[n].sizes[size === 18 ? 18 : size === 12 ? 12 : 24].d, col)}</svg>`;
// a badge: ring `ring` px across, glyph box `size` centred in it (row/pin: 24 ring, 18 box; selected: 32, 24 inverted)
function badge(set, n, size, scale = 1) {
  const ring = size === 18 ? 24 : 32, rim = RIM[set][size], o = (ring - size) / 2, sel = size === 24;
  const fill = sel ? NAVY : PAPER, gcol = sel ? PAPER : NAVY;
  return `<div style="width:${ring * scale}px;height:${ring * scale}px;flex:none"><div style="width:${ring}px;height:${ring}px;position:relative;transform:scale(${scale});transform-origin:0 0"><svg width="${ring}" height="${ring}" viewBox="0 0 ${ring} ${ring}" style="position:absolute;left:0;top:0"><circle cx="${ring / 2}" cy="${ring / 2}" r="${ring / 2 - rim / 2}" fill="${fill}" stroke="${NAVY}" stroke-width="${rim}"/></svg><div style="position:absolute;left:${o}px;top:${o}px;width:${size}px;height:${size}px">${glyph(set, n, size, gcol)}</div></div></div>`;
}
const chip = (set, n, scale = 1) => `<div style="width:${12 * scale}px;height:${12 * scale}px;flex:none"><div style="width:12px;height:12px;position:relative;transform:scale(${scale});transform-origin:0 0">${glyph(set, n, 12)}</div></div>`;
// the star, bare in its 18 box, 1:1 (v280: its 24-slot drawing centred on the box, as drawn)
function star(set, scale = 1) {
  const inner = set === 'now' ? `<svg width="18" height="18" viewBox="0 0 18 18" style="position:absolute;left:0;top:0">${P(NOW.star.sizes[18].d)}</svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" style="position:absolute;left:-3px;top:-3px">${P(V280.star.sizes[24].d)}</svg>`;
  return `<div style="width:${18 * scale}px;height:${18 * scale}px;flex:none"><div style="width:18px;height:18px;position:relative;transform:scale(${scale});transform-origin:0 0">${inner}</div></div>`;
}
// the + in its 60px orange button: v280 = its 24 slot centred on the mark; now = drawn 1:1 in the 60 box
function plus(set, scale = 1) {
  const inner = set === 'now' ? `<svg width="60" height="60" viewBox="0 0 60 60" style="position:absolute;left:0;top:0"><circle cx="30" cy="30" r="30" fill="${ORANGE}"/>${P(NOW.plus.sizes[60].d, CREAM)}</svg>`
    : (() => { const c = 12 + 1 / 12, bx = 30 - c; return `<svg width="60" height="60" viewBox="0 0 60 60" style="position:absolute;left:0;top:0"><circle cx="30" cy="30" r="30" fill="${ORANGE}"/></svg><svg width="24" height="24" viewBox="0 0 24 24" style="position:absolute;left:${bx}px;top:${bx}px">${P(V280.plus.sizes[24].d, CREAM)}</svg>`; })();
  return `<div style="width:${60 * scale}px;height:${60 * scale}px;flex:none"><div style="width:60px;height:60px;position:relative;transform:scale(${scale});transform-origin:0 0">${inner}</div></div>`;
}
module.exports = { badge, chip, star, plus, BADGE, NAVY, PAPER, NOW, V280, RIM };
