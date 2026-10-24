// g7ba THE JOINS, as code (director, turn 156, gap 1: "Nothing in the spec carries the family's character (flares, caps, the
// separated gable, Joins, the cap rule) into a new kind of join"). The five kinds and their values are in src/proportions.js
// (PROP.joins); this is the one drawing of OVERHANG + HOLDS on a slab or mass (the capital), used by the museum (beam and plinth,
// picks7 structMuseum: byte for byte its old path) and by any new icon (the re-run bed's mattress at its foot leg).
//
// heldSlab(o): a slab or mass from x0 to x1, its FAR face at yFar and its NEAR face (toward the posts) at yNear. o.left / o.right:
// the outer post at that end, { x: the post's outside edge, w: its width, over: how far the slab passes it }, or null when the
// slab ends there square (it ends ON a post that runs on past it, or nothing holds that end). Past each held end the near face
// drops dp toward the far face, and the post flares fr into the slab on its outside, one curve (handle k of the overhang); on its
// inside the flare runs flat to the post's inner edge, which meets the near face square (a counter's corner, or the engine's
// flare round where the inside is open).
'use strict';
const { D } = require('./engine.js');
const f = v => +v.toFixed(3);
function heldSlab({ x0, x1, yFar, yNear, left = null, right = null, dp, fr, k = 0.5, meta = { root: 'SLAB' } }) {
  const dir = Math.sign(yNear - yFar), yd = yNear - dir * dp, yk = yNear - dir * dp * 0.1, yf = yNear + dir * fr;
  let s = `M${f(x0)} ${f(yFar)}H${f(x1)}`;
  // right.open: the post's inside opens to the outside (not a counter), so it takes the engine's flare round there too; the slab
  // closes straight up the post's outside edge, so nothing of it reaches the post's inner face
  if (right && right.open) s += `V${f(yd)}C${f(x1 - right.over * k)} ${f(yd)} ${f(right.x)} ${f(yk)} ${f(right.x)} ${f(yf)}V${f(yNear)}`;
  else if (right) s += `V${f(yd)}C${f(x1 - right.over * k)} ${f(yd)} ${f(right.x)} ${f(yk)} ${f(right.x)} ${f(yf)}H${f(right.x - right.w)}V${f(yNear)}`;
  else s += `V${f(yNear)}`;
  if (left) s += `H${f(left.x + left.w)}V${f(yf)}H${f(left.x)}C${f(left.x)} ${f(yk)} ${f(x0 + left.over * k)} ${f(yd)} ${f(x0)} ${f(yd)}Z`;
  else s += `H${f(x0)}Z`;
  return { ...D(s), ...meta };
}
module.exports = { heldSlab };
