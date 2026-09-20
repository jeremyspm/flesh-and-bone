/* made-glia.js — the six neuroglia of her matching question, BUILT and declared a schematic.
 * Each is drawn by the ONE thing that tells it from the others, because that is what a figure question tests:
 *   astrocyte       star-shaped, with end-feet on a capillary (blood ↔ nervous tissue)            CNS
 *   oligodendrocyte one cell, several arms, each wrapping a segment of a DIFFERENT axon           CNS
 *   microglia       small, with thorny processes (the phagocyte)                                  CNS
 *   ependymal cells a ciliated row lining a CSF-filled cavity                                     CNS
 *   satellite cells flattened cells hugging a neuron's cell body in a ganglion                    PNS
 *   Schwann cells   each wraps ONE segment of ONE axon                                            PNS
 * The CNS group is on top, the PNS group below it. Context (capillary, axons, the ganglion cell body, the CSF) is tappable
 * in Explore but never asked. Stands to the right of the neuron in the same deck. Not to scale, nothing lettered. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

export function buildGlia() {
  const rnd = rng(5), parts = [], O = V(.62, 1.21);
  const tube = (pts, r, seg = 14) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 8, false);
  const ball = (c, r, s = [1, 1, 1], d = 2) => { const g = new THREE.IcosahedronGeometry(r, d); g.scale(s[0], s[1], s[2]); g.translate(c.x, c.y, c.z); return g; };
  const add = (name, geoms, colour, extra = {}) => { const g = mergeGeometries(geoms.map(x => x.index ? x.toNonIndexed() : x)); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(O); parts.push({ name, geometry:g, colour, ...extra }); };
  const arm = (from, to, r, wob = .25) => { const d = to.clone().sub(from), n = V(-d.y, d.x, (rnd() - .5) * d.length()).normalize(); return tube([from, from.clone().addScaledVector(d, .5).addScaledVector(n, d.length() * wob * (rnd() - .5)), to], r, 10); };

  // ── CNS ── a capillary across the top; the astrocyte hangs from it
  const capPts = [V(-.17, .205), V(-.06, .19), V(.06, .198), V(.17, .18)], cap = new THREE.CatmullRomCurve3(capPts);
  add('Capillary', [tube(capPts, .0115, 30)], '#d9534f');
  const A = V(-.055, .105), astro = [ball(A, .0155, [1.1, 1, .9], 3)];
  [.22, .42, .62].forEach(u => { const foot = cap.getPointAt(u).add(V(0, -.0105, .002)); astro.push(arm(A, foot, .0034, .18), ball(foot, .0068, [1.5, .55, 1.2])); });      // end-feet ON the capillary
  [[-.075, .0], [-.105, .05], [-.11, .12], [.0, .035], [.045, .06], [.03, .13]].forEach(([x, y], k) => { const to = V(x, y, k % 2 ? .02 : -.02); astro.push(arm(A, to, .003), arm(to, to.clone().add(V((rnd() - .5) * .03, -.02 - rnd() * .015, 0)), .0017), arm(to, to.clone().add(V((rnd() - .5) * .04, .012, .01)), .0017)); });
  add('Astrocyte', astro, '#f2b84b', { anchor:A.clone().add(V(0, 0, .0155)) });

  // three CNS axons, and ONE oligodendrocyte reaching all three
  const ys = [.045, .005, -.035], ax = ys.map((y, k) => tube([V(.0, y, 0), V(.06, y + .004, 0), V(.12, y - .003, 0), V(.185, y, 0)], .0028, 24));
  add('Axons (CNS)', ax, '#e9c88f');
  const Og = V(.158, .098, .012), seg = [.085, .125, .07], oligo = [ball(Og, .0125, [1, 1, .9], 3)];
  ys.forEach((y, k) => { const c = V(seg[k], y + (k === 1 ? -.001 : .002), 0); const m = new THREE.CapsuleGeometry(.0074, .04, 6, 14); m.rotateZ(Math.PI / 2); m.translate(c.x, c.y, c.z); oligo.push(m, arm(Og, c.clone().add(V(.012, .0074, .004 + k * .004)), .0024, .3)); });
  add('Oligodendrocyte', oligo, '#9db6ea', { anchor:Og.clone().add(V(0, 0, .0125)) });

  // microglia: small body, thorny processes
  const M = V(-.125, -.02), mg = [ball(M, .0078, [1.7, 1, .9])];
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + .3, to = M.clone().add(V(Math.cos(a) * (.03 + rnd() * .012), Math.sin(a) * (.026 + rnd() * .012), (rnd() - .5) * .02)); mg.push(arm(M, to, .0017, .5));
    for (let t = 1; t <= 3; t++) { const p = M.clone().lerp(to, t / 3.4), th = a + (t % 2 ? 1.2 : -1.2); mg.push(tube([p, p.clone().add(V(Math.cos(th) * .0075, Math.sin(th) * .0075, 0))], .0008, 3)); } }
  add('Microglia', mg, '#c58cff', { anchor:M.clone().add(V(0, 0, .0078)) });

  // ependymal cells: a ciliated row lining a CSF-filled cavity
  const ep = [], nuc = [], W = .038, y0 = -.118;
  for (let k = 0; k < 9; k++) { const x = -.172 + k * (W + .005) + W / 2, b = new THREE.BoxGeometry(W, .032, .034); b.translate(x, y0, 0); ep.push(b); nuc.push(ball(V(x, y0 + .003, .0172), .0062, [1, 1, .35]));
    for (let c = 0; c < 6; c++) { const cx = x - W / 2 + .004 + c * (W - .008) / 5, tip = V(cx + .004 * Math.sin(c + k), y0 - .016 - .013, .004 * (c % 2 ? 1 : -1)); ep.push(tube([V(cx, y0 - .016, 0), V(cx + .002, y0 - .023, 0), tip], .0007, 4)); } }
  add('Ependymal cells', ep, '#7fd1c3', { anchor:V(0, y0, .017) });
  add('Ependymal nuclei', nuc, '#3f8f86');
  const csf = new THREE.BoxGeometry(.39, .05, .05); csf.translate(.005, y0 - .016 - .0255, 0);
  add('Cerebrospinal fluid', [csf], '#58b5ff', { glassy:.32 });

  // ── PNS ── a ganglion cell body wrapped in satellite cells; its fibre wrapped, segment by segment, in Schwann cells
  const Gn = V(-.10, -.285), gr = .03, sat = [];
  add('Cell body (ganglion)', [ball(Gn, gr, [1, 1, .9], 3), ball(Gn.clone().add(V(0, 0, gr * .62)), .011, [1, 1, .5])], '#e9c88f');
  for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, c = Gn.clone().add(V(Math.cos(a) * gr * 1.04, Math.sin(a) * gr * 1.04, .008)), g = new THREE.IcosahedronGeometry(.0085, 2); g.scale(1.45, .42, 1.1); g.rotateZ(a + Math.PI / 2); g.translate(c.x, c.y, c.z); sat.push(g); }
  add('Satellite cells', sat, '#5fd4c0', { anchor:Gn.clone().add(V(gr * 1.04, 0, .014)) });
  const fibre = [V(Gn.x + gr * .95, Gn.y, 0), V(.0, -.283, 0), V(.09, -.29, 0), V(.19, -.284, 0)], fc = new THREE.CatmullRomCurve3(fibre), sch = [], sn = [];
  add('Axon (PNS)', [tube(fibre, .0034, 30)], '#e9c88f');
  [[.2, .44], [.5, .74], [.8, .99]].forEach(([a, b], k) => { const pts = Array.from({ length:7 }, (_, n) => fc.getPointAt(a + (b - a) * n / 6)); sch.push(tube(pts, .0095, 10), ball(pts[0], .0095), ball(pts[6], .0095)); sn.push(ball(fc.getPointAt((a + b) / 2).add(V(0, (k % 2 ? -1 : 1) * .0092, .002)), .0042, [1.5, .8, 1])); });
  add('Schwann cells', sch, '#9db6ea', { anchor:fc.getPointAt(.62).add(V(0, 0, .0095)) });
  add('Schwann cell nuclei', sn, '#5a6fb4');
  return parts;
}
