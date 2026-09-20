/* made-sections.js — the CUT-OPEN figures: what her questions ask about that sits inside something, where no whole-organ model can show it.
 * All BUILT, all declared schematics, nothing lettered, nothing to scale. Each is a flat section slab facing the viewer, like the textbook figure it stands for.
 *   buildLongBone()    a long bone in frontal section: diaphysis · epiphyses · epiphyseal plate · medullary cavity · compact + spongy bone · periosteum   — the nouns of her ossification questions (M2)
 *   buildAdrenal()     the adrenal gland cut open: cortex round the medulla                                                                            — "adrenal cortex" / "adrenal gland medulla" (M2)
 *   buildAirwayWall()  trachea in cross-section (C-shaped cartilage, trachealis, ciliated lining) · a bronchiole · an alveolus with its capillary        — her M1 histology slides
 *   buildCochlea()     one turn of the cochlea: three scalae, Reissner's + basilar + tectorial membranes, organ of Corti, hair cells                     — her M3 slide 21
 *   buildRetina()      the cell layers of the retina, light coming in from the left: ganglion → bipolar → rods and cones → pigment layer                 — her M3 slide 16 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const flat = g => { const n = g.index ? g.toNonIndexed() : g; for (const a of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(a)) n.deleteAttribute(a); return n; };
const maker = O => { const parts = []; return { parts, add(name, geoms, colour, extra = {}) { const g = mergeGeometries(geoms.map(flat)); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(O); parts.push({ name, geometry:g, colour, ...extra }); }, lines(name, pts) { parts.push({ name, context:true, lines:pts.map(p => p.clone().add(O)) }); } }; };
const box = (w, h, d, x, y, z = 0, rot = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (rot) g.rotateZ(rot); g.translate(x, y, z); return g; };
const disc = (r, d, x, y, sx = 1, sy = 1, z = 0) => { const g = new THREE.CylinderGeometry(r, r, d, 40); g.rotateX(Math.PI / 2); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };      // a coin facing the viewer
const ball = (r, x, y, z = 0, sx = 1, sy = 1) => { const g = new THREE.SphereGeometry(r, 18, 12); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const rod = (r, x0, x1, y, z = 0) => { const g = new THREE.CylinderGeometry(r, r, Math.abs(x1 - x0), 10); g.rotateZ(Math.PI / 2); g.translate((x0 + x1) / 2, y, z); return g; };      // lying along x
const arc = (R, tube, a0, a1, x = 0, y = 0, z = 0, sy = 1) => { const g = new THREE.TorusGeometry(R, tube, 10, 48, a1 - a0); g.rotateZ(a0); g.scale(1, sy, 1); g.translate(x, y, z); return g; };      // angles in radians, 0 = +x, anticlockwise
const tube = (pts, r, seg = 24) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 8, false);
const slab = (pts, d, z = 0) => { const s = new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1]))), g = new THREE.ExtrudeGeometry(s, { depth:d, bevelEnabled:false }); g.translate(0, 0, z - d / 2); return g; };
const onCircle = (R, a0, a1, n = 24) => Array.from({ length:n + 1 }, (_, k) => { const a = (a0 + (a1 - a0) * k / n) * Math.PI / 180; return [Math.cos(a) * R, Math.sin(a) * R]; });
const shrink = (pts, k) => { const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]); return pts.map(p => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k]); };

export function buildLongBone() { const M = maker(V(.36, .47)), D = .026;
  M.add('Spongy bone', [disc(.04, D, 0, .27, 1, .8), disc(.037, D, 0, .035, 1, .78), ...[[-.018, .278], [.012, .262], [.02, .29], [-.004, .252], [-.015, .03], [.014, .045], [.002, .02]].map(([x, y]) => disc(.0042, D + .004, x, y))], '#d9a066', { anchor:V(.012, .262, D / 2 + .002) });
  M.add('Epiphyseal plate', [box(.062, .0045, D + .006, 0, .238), box(.058, .0045, D + .006, 0, .064)], '#7cc4f2', { anchor:V(.02, .238, D / 2 + .003) });
  M.add('Compact bone of the shaft', [box(.0085, .168, D, -.0185, .151), box(.0085, .168, D, .0185, .151)], '#efe6d2', { anchor:V(.0185, .16, D / 2) });
  M.add('Medullary cavity', [box(.0285, .166, D - .006, 0, .151)], '#f2c14e', { anchor:V(0, .15, D / 2 - .003) });
  M.add('Periosteum', [box(.0045, .17, D + .004, -.0252, .151), box(.0045, .17, D + .004, .0252, .151)], '#c77bd0', { anchor:V(.0245, .12, D / 2 + .002) });
  M.add('Articular cartilage', [arc(.041, .0045, Math.PI * .12, Math.PI * .88, 0, .27, 0, .8), arc(.038, .0045, Math.PI * 1.12, Math.PI * 1.88, 0, .035, 0, .78)], '#9fb6c4', { anchor:V(0, .27 + .041 * .8, .0045) });
  M.lines('long bone regions', [V(-.06, .238, 0), V(-.085, .238, 0), V(-.06, .064, 0), V(-.085, .064, 0)]);      // ticks where epiphysis meets diaphysis
  return M.parts; }

export function buildAdrenal() { const M = maker(V(.45, 1.12)), tri = [[-.05, -.022], [-.03, -.03], [.03, -.03], [.05, -.022], [.03, .012], [.008, .04], [-.008, .04], [-.03, .012]];
  M.add('Capsule of the adrenal gland', [slab(tri, .018)], '#e8d9c0');
  M.add('Adrenal cortex', [slab(shrink(tri, .9), .022)], '#f0c75e', { anchor:V(-.03, -.018, .011) });
  M.add('Adrenal medulla', [slab(shrink(tri, .42).map(p => [p[0], p[1] - .004]), .026)], '#8f2f3a', { anchor:V(0, -.004, .013) });
  return M.parts; }

export function buildAirwayWall() { const M = maker(V(-.56, 1.2)), PI = Math.PI, gap = .2 * PI;
  // 1 · the trachea, looking down it: anterior at the top, the open side of the C at the back
  M.add('C-shaped cartilage ring', [arc(.046, .0075, -PI / 2 + gap, 1.5 * PI - gap)], '#9fb6c4', { anchor:V(0, .046, .0075) });
  M.add('Trachealis muscle', [arc(.046, .005, -PI / 2 - gap, -PI / 2 + gap)], '#b5483f', { anchor:V(0, -.046, .005) });
  M.add('Ciliated epithelium of the trachea', [arc(.0345, .0042, 0, 2 * PI)], '#f4a9b8', { anchor:V(.0345, 0, .0042) });
  M.add('Cilia', Array.from({ length:44 }, (_, k) => { const a = k / 44 * 2 * PI, g = new THREE.CylinderGeometry(.0007, .0007, .008, 5); g.rotateZ(a - PI / 2); g.translate(Math.cos(a) * .0268, Math.sin(a) * .0268, 0); return g; }), '#fff3d6', { anchor:V(-.0268, 0, .001) });
  M.add('Oesophagus', [arc(.017, .006, 0, 2 * PI, 0, -.076, 0, .55)], '#c9a08f');
  // 2 · a bronchiole: no cartilage at all — smooth muscle round a cuboidal lining
  M.add('Smooth muscle of the bronchiole', [arc(.021, .0045, 0, 2 * PI, .13, 0)], '#d9776a', { anchor:V(.13, .021, .0045) });
  M.add('Cuboidal epithelium of the bronchiole', [arc(.0135, .0032, 0, 2 * PI, .13, 0)], '#f6d2c4', { anchor:V(.13 + .0135, 0, .0032) });
  // 3 · an alveolus, opened toward you, hugged by its capillary
  const cup = new THREE.SphereGeometry(.03, 32, 18, PI, PI); cup.translate(.245, 0, 0);
  M.add('Alveolar cell type 1', [cup], '#f6d2c4', { anchor:V(.245, .012, -.027) });
  M.add('Alveolar cell type 2', [[-.014, .02], [.017, -.012], [-.004, -.024]].map(([x, y]) => ball(.0062, .245 + x, y, -Math.sqrt(Math.max(0, .0009 - x * x - y * y)) + .004, 1.15, .9)), '#ffd27a', { anchor:V(.245 - .014, .02, -.012) });
  M.add('Respiratory membrane', [arc(.0312, .0016, -.35 * PI, .45 * PI, .245, 0)], '#7dff9c', { anchor:V(.245 + .0312, 0, .0016) });
  M.add('Pulmonary capillary', [arc(.0385, .0058, -.35 * PI, .45 * PI, .245, 0)], '#c62f2b', { anchor:V(.245 + .0385, .004, .0058) });
  return M.parts; }

export function buildCochlea() { const M = maker(V(.42, .94)), R = .052, D = .02, P1 = [-.03, -.003], aR = 48, aB = -4;
  M.add('Bony wall of the cochlea', [disc(.061, D - .006, 0, 0)], '#e7dcc6');
  M.add('Scala vestibuli', [slab(shrink([...onCircle(R, aR, 184), P1], .93), D)], '#f2dc7a', { anchor:V(-.008, .03, D / 2) });
  M.add('Scala tympani', [slab(shrink([...onCircle(R, 184, 360 + aB), P1], .93), D)], '#e9c95c', { anchor:V(0, -.03, D / 2) });
  M.add('Scala media', [slab(shrink([P1, ...onCircle(R, aB, aR, 10)], .9), D)], '#6db7ee', { anchor:V(.038, .01, D / 2) });
  const out = a => [Math.cos(a * Math.PI / 180) * R, Math.sin(a * Math.PI / 180) * R], oB = out(aB), oR = out(aR), len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]), mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  M.add("Reissner's membrane", [box(len(P1, oR), .0032, D + .005, ...mid(P1, oR), 0, ang(P1, oR))], '#c9a0ff', { anchor:V(...mid(P1, oR), D / 2 + .003) });
  M.add('Basilar membrane', [box(len(P1, oB), .0036, D + .005, ...mid(P1, oB), 0, ang(P1, oB))], '#ffb347', { anchor:V(.03, -.004, D / 2 + .003) });
  M.add('Organ of Corti', [box(.02, .0058, D + .008, .014, .0012)], '#ff8a5c', { anchor:V(.014, .002, D / 2 + .004) });
  M.add('Hair cells', [0, 1, 2, 3].flatMap(k => [box(.0026, .0062, D + .011, .007 + k * .0046, .0068), box(.0007, .003, D + .011, .007 + k * .0046, .0112)]), '#fff06a', { anchor:V(.0116, .008, D / 2 + .006) });
  M.add('Tectorial membrane', [box(.022, .003, D + .009, .015, .0146, 0, .06)], '#7dff9c', { anchor:V(.018, .0148, D / 2 + .005) });
  M.add('Cochlear nerve', [tube([V(.014, -.001, D / 2 + .004), V(-.015, -.009, D / 2 + .005), V(-.05, -.004, D / 2 + .004), V(-.085, .004, D / 2)], .0024)], '#ffe27a', { anchor:V(-.06, -.002, D / 2 + .006) });
  return M.parts; }

export function buildRetina() { const M = maker(V(0, .93)), ys = [-.05, -.03, -.01, .01, .03, .05], cone = [2, 4];
  M.add('Pigment layer', [box(.011, .128, .03, .062, 0)], '#4a3527', { anchor:V(.0565, .02, .015) });
  const rodG = [], coneG = [];
  ys.forEach((y, k) => { if (cone.includes(k)) { const c = new THREE.ConeGeometry(.0058, .02, 14); c.rotateZ(-Math.PI / 2); c.translate(.045, y, 0); coneG.push(c, ball(.0062, .028, y), rod(.0011, .012, .022, y)); } else rodG.push(rod(.003, .03, .056, y), ball(.0058, .025, y), rod(.0011, .012, .02, y)); });
  M.add('Rods', rodG, '#b9a2ff', { anchor:V(.043, .05, .003) });
  M.add('Cones', coneG, '#ff9466', { anchor:V(.045, -.01, .005) });
  M.add('Bipolar cells', [-.04, -.013, .013, .04].flatMap(y => [ball(.0066, -.004, y), rod(.0011, -.022, .012, y)]), '#7cc4f2', { anchor:V(-.004, .013, .0066) });
  M.add('Ganglion cells', [-.03, 0, .03].map(y => ball(.0092, -.034, y)), '#ffe14d', { anchor:V(-.034, 0, .0092) });
  M.add('Optic nerve fibres', [-.03, 0, .03].map((y, k) => flat(tube([V(-.043, y), V(-.054 - k * .004, y - .012), V(-.056 - k * .004, -.06), V(-.058 - k * .004, -.085)], .0016))), '#ffe27a', { anchor:V(-.06, -.07, .0016) });
  M.lines('light', [V(-.13, .02, 0), V(-.075, .02, 0), V(-.075, .02, 0), V(-.085, .027, 0), V(-.075, .02, 0), V(-.085, .013, 0), V(-.13, -.02, 0), V(-.075, -.02, 0), V(-.075, -.02, 0), V(-.085, -.013, 0), V(-.075, -.02, 0), V(-.085, -.027, 0)]);      // two arrows: light comes in on the ganglion side
  return M.parts; }
