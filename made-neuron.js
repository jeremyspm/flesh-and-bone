/* made-neuron.js — a neuron and one synapse, BUILT from primitives and declared a schematic on screen.
 *
 * No 3D source models a cell, and every textbook figure of one is a schematic too — hers included — so a clean
 * procedural one is the honest representation. Every part is its own named mesh, so Find it / Name it / Trace it
 * run on it unchanged. The parts are HER ten-point match: soma · dendrites · axon hillock · axon · Schwann cell ·
 * node of Ranvier · axon terminals · presynaptic membrane · postsynaptic membrane (+ the synaptic cleft from her
 * cloze). Nothing is lettered: her figure letters its parts its own way, and a second lettering would contradict it.
 * Laid out top-to-bottom (dendrites up, terminals down) so it fills a phone held upright, and so the impulse runs
 * down the screen. One terminal is repeated ENLARGED beside it, joined by two faint lines: the synapse.
 * Units are the scene's metres, but the scale is arbitrary (a 40 cm neuron) — only the relationships are real. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

export function buildNeuron() {
  const rnd = rng(11), parts = [];
  const tube = (pts, r, seg = 20) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 10, false);
  const ball = (c, r, s = [1, 1, 1], detail = 3) => { const g = new THREE.IcosahedronGeometry(r, detail); g.scale(s[0], s[1], s[2]); g.translate(c.x, c.y, c.z); return g; };
  const disc = (c, r, h, seg = 40) => { const g = new THREE.CylinderGeometry(r, r, h, seg); g.translate(c.x, c.y, c.z); return g; };
  const add = (name, geoms, colour, extra = {}) => parts.push({ name, geometry:mergeGeometries(geoms.map(g => g.index ? g.toNonIndexed() : g)), colour, ...extra });
  const CELL = '#e9c88f';                                     // soma, dendrites, hillock, axon, nodes, terminals: ONE cell, one colour — the boundaries are shape, not paint

  // ── soma + nucleus ──
  const S = V(0, 1.30), sr = .036;
  add('Soma', [ball(S, sr, [1.05, .94, .86], 4)], CELL, { glassy:.7 });
  add('Nucleus', [ball(S.clone().add(V(.003, .002, 0)), .0145, [1, 1, .95]), ball(S.clone().add(V(.007, .005, .006)), .0045)], '#7d55ad');

  // ── dendrites: seven trunks off the upper and lateral soma, each forking twice ──
  const den = []; let denTip = null;
  const grow = (from, dir, len, r, depth) => {
    const bend = V((rnd() - .5) * .6, (rnd() - .5) * .6, (rnd() - .5) * .5), mid = from.clone().addScaledVector(dir, len * .5).addScaledVector(bend, len * .22), end = from.clone().addScaledVector(dir, len).addScaledVector(bend, len * .12);
    den.push(tube([from, mid, end], r, 12), ball(end, r * 1.02, [1, 1, 1], 1)); if (!denTip && depth === 2) denTip = end.clone();
    if (!depth) return; const n = depth === 2 ? 2 + (rnd() > .6 ? 1 : 0) : 2, d1 = end.clone().sub(mid).normalize();
    for (let k = 0; k < n; k++) { const a = ((k - (n - 1) / 2) * (.75 + rnd() * .3)), z = (rnd() - .5) * .9, c = Math.cos(a), s = Math.sin(a);
      grow(end, V(d1.x * c - d1.y * s, d1.x * s + d1.y * c, d1.z + z * .5).normalize(), len * (.62 + rnd() * .16), r * .62, depth - 1); } };
  [200, 160, 125, 92, 58, 22, -18].forEach((deg, k) => { const a = deg * Math.PI / 180, dir = V(Math.cos(a), Math.sin(a), (k % 2 ? .25 : -.25)).normalize();
    grow(S.clone().add(V(dir.x * sr * .9, dir.y * sr * .82, dir.z * sr * .7)), dir, .062 + rnd() * .022, .0058, 2); });
  add('Dendrites', den, CELL, { anchor:denTip });

  // ── axon hillock: the cone where the axon leaves the soma ──
  const hill = new THREE.CylinderGeometry(.019, .0062, .036, 24); hill.translate(0, 1.30 - sr * .94 - .012, 0);
  add('Axon hillock', [hill], CELL);

  // ── axon, Schwann cells, nodes of Ranvier ──
  const path = new THREE.CatmullRomCurve3([V(0, 1.245), V(.007, 1.19), V(-.006, 1.12), V(.004, 1.06), V(0, 1.004)]), sub = (a, b, n = 8) => Array.from({ length:n + 1 }, (_, k) => path.getPointAt(a + (b - a) * k / n));
  add('Axon', [tube(sub(0, 1, 40), .0052, 80)], CELL, { anchor:path.getPointAt(.985) });
  const N = 5, u0 = .075, u1 = .985, du = (u1 - u0) / N, gap = .27, SR = .0105, ru = SR / path.getLength(), sch = [], nuc = [], nodes = []; let schMid = null, nodeMid = null;      // gap = the share of each period left BARE: the node
  for (let k = 0; k < N; k++) { const a = u0 + k * du, b = a + du * (1 - gap), pts = sub(a + ru, b - ru);      // the rounded ends stop AT a and b, so the gap stays a gap
    sch.push(tube(pts, SR, 16), ball(pts[0], SR), ball(pts[pts.length - 1], SR));
    const m = path.getPointAt((a + b) / 2), side = k % 2 ? -1 : 1; nuc.push(ball(m.clone().add(V(side * SR * .95, 0, .003)), .0046, [.8, 1.5, 1]));
    if (k === 2) schMid = m.clone().add(V(0, 0, SR));
    if (k < N - 1) { nodes.push(tube(sub(b - ru * .5, a + du + ru * .5, 4), .0058, 6)); if (k === 1) nodeMid = path.getPointAt(b + du * gap / 2).add(V(0, 0, .0057)); } }
  add('Schwann cell', sch, '#9db6ea', { anchor:schMid });
  add('Schwann cell nucleus', nuc, '#5a6fb4');
  add('Node of Ranvier', nodes, CELL, { anchor:nodeMid });

  // ── axon terminals: the axon breaks into branches, each ending in a button ──
  const E = path.getPointAt(1), term = [], ends = [];
  [-62, -24, 20, 58].forEach((deg, k) => { const a = deg * Math.PI / 180, end = E.clone().add(V(Math.sin(a) * .05, -Math.cos(a) * .046, k % 2 ? .012 : -.012)), mid = E.clone().add(V(Math.sin(a) * .018, -.022, 0));
    term.push(tube([E, mid, end], .0029, 12), ball(end, .0074)); ends.push(end); });
  // …and ONE of them again, enlarged: the synapse
  const C = V(.128, .985), bulbR = .04, bulbBottom = C.y - bulbR * .9;
  term.push(ball(C, bulbR, [1, .9, .9], 4), tube([C.clone().add(V(-.004, bulbR * .8, 0)), C.clone().add(V(-.012, bulbR * 1.5, 0)), C.clone().add(V(-.03, bulbR * 2.05, 0))], .012, 12));
  add('Axon terminals', term, CELL, { glassy:.55, anchor:ends[0].clone() });
  const ves = []; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2 + rnd(), rr = .008 + rnd() * .017; ves.push(ball(C.clone().add(V(Math.cos(a) * rr, -.004 - rnd() * .022, Math.sin(a) * rr * .8)), .0056, [1, 1, 1], 2)); }
  add('Synaptic vesicles', ves, '#ffe27a');
  const preY = bulbBottom + .001, clH = .015, postH = .009;
  add('Presynaptic membrane', [disc(V(C.x, preY, 0), .0315, .0075)], '#ff9466', { anchor:V(C.x + .0315, preY, 0) });
  add('Synaptic cleft', [disc(V(C.x, preY - .00375 - clH / 2, 0), .034, clH)], '#58b5ff', { glassy:.4, anchor:V(C.x + .034, preY - .00375 - clH / 2, 0) });
  const postY = preY - .00375 - clH - postH / 2, rec = [];
  add('Postsynaptic membrane', [disc(V(C.x, postY, 0), .041, postH)], '#78cf8a', { anchor:V(C.x + .041, postY, 0) });
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, rr = k % 2 ? .024 : .012; rec.push(disc(V(C.x + Math.cos(a) * rr, postY + postH / 2 + .0035, Math.sin(a) * rr), .003, .007, 10)); }
  add('Receptors', rec, '#3f9a58');
  const cell = new THREE.BoxGeometry(.118, .04, .07, 1, 1, 1); cell.translate(C.x, postY - postH / 2 - .02, 0);
  add('Postsynaptic cell', [cell], '#a99a8c');

  // two faint lines from the small button to its enlarged twin — drawn, not tappable
  const from = ends[3], lines = [from.clone().add(V(0, .0074, 0)), C.clone().add(V(-.02, bulbR * .78, 0)), from.clone().add(V(0, -.0074, 0)), V(C.x - bulbR * .92, C.y - .012, 0)];
  parts.push({ name:'enlarged', context:true, lines });
  return parts;
}
