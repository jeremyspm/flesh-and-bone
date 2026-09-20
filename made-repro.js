/* made-repro.js — the three reproduction figures her Module 3 QUIZZES test with an image (read from her graded keys, 21 Sep 2026), which no organ model shows.
 * All BUILT, all declared schematics, nothing lettered, nothing to scale.
 *   buildSperm()         her label-the-sperm-cell blank: acrosome · chromatin · mitochondria · tail
 *   buildTubule()        her spermatogenesis match: spermatogonium → primary → secondary spermatocyte → spermatid → spermatozoon, Sertoli cells, Leydig cells OUTSIDE the tubule
 *   buildOvarySection()  her ovulation drop-downs: the tertiary (Graafian) follicle ruptures through the ovarian wall and releases a secondary oocyte in its zona radiata; then the corpus luteum
 * LAYOUT FOLLOWS HER DRAWINGS (he asked, 21 Sep: "there may be a disconnect between the 3D models and the diagrams she will give us"). The first versions were
 * abstract — a strip of tubule wall, an ovary with the ripe follicle at the bottom and the egg leaving at the top — and matched nothing she shows. Now:
 *   tubule  = her revision-quiz figure (b): a ROUND cross-section, lumen in the middle, spermatogonia against the wall → sperm at the lumen, Leydig cells + capillary
 *             in the gap BETWEEN tubules (two neighbours are outlined)
 *   ovary   = her slide-2 ovulation figure and her fertility-quiz "ovarian cycle" figure, which share one convention: the stages IN ORDER round the edge, the
 *             vesicular follicle bulging at the surface, the egg leaving right beside it, then corpus luteum → corpus albicans; vessels fan in from the hilum */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const flat = g => { const n = g.index ? g.toNonIndexed() : g; for (const a of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(a)) n.deleteAttribute(a); return n; };
const maker = O => { const parts = []; return { parts, add(name, geoms, colour, extra = {}) { const g = mergeGeometries(geoms.map(flat)); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(O); parts.push({ name, geometry:g, colour, ...extra }); },
  lines(name, pts) { const seg = []; for (let k = 0; k + 1 < pts.length; k++) seg.push(pts[k].clone().add(O), pts[k + 1].clone().add(O)); parts.push({ name, context:true, lines:seg }); } }; };
const box = (w, h, d, x, y, z = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
const ball = (r, x, y, z = 0, sx = 1, sy = 1, sz = 1) => { const g = new THREE.SphereGeometry(r, 20, 14); g.scale(sx, sy, sz); g.translate(x, y, z); return g; };
const disc = (r, d, x, y, sx = 1, sy = 1, z = 0) => { const g = new THREE.CylinderGeometry(r, r, d, 40); g.rotateX(Math.PI / 2); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const ring = (R, t, x, y, sx = 1, sy = 1, z = 0, a0 = 0, a1 = Math.PI * 2) => { const g = new THREE.TorusGeometry(R, t, 10, 56, a1 - a0); g.rotateZ(a0); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const tube = (pts, r, seg = 40) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 8, false);
/* a flat outline ([x, y] pairs, optional holes) given thickness d, centred on z = 0 */
const ext = (pts, d, holes = []) => { const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))); for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y)))); const g = new THREE.ExtrudeGeometry(s, { depth:d, bevelEnabled:false, curveSegments:8 }); g.translate(0, 0, -d / 2); return g; };
const arc = (r, a0, a1, x = 0, y = 0, n = 40) => Array.from({ length:n + 1 }, (_, k) => { const a = a0 + (a1 - a0) * k / n; return [x + r * Math.cos(a), y + r * Math.sin(a)]; });
const circ = (r, x = 0, y = 0, n = 56) => arc(r, 0, Math.PI * 2 * (n - 1) / n, x, y, n - 1);

export function buildSperm() { const M = maker(V(.42, .78));
  M.add('Chromatin', [ball(.0115, 0, 0, 0, 1.3, .85, .85)], '#7b5cd6', { anchor:V(.004, 0, .0098) });
  const cap = new THREE.SphereGeometry(.0128, 24, 14, 0, Math.PI * 2, 0, Math.PI * .46); cap.rotateZ(Math.PI / 2); cap.scale(1.3, .88, .88);
  M.add('Acrosome', [cap], '#ff9466', { anchor:V(-.013, 0, .006) });
  M.add('Mitochondria', Array.from({ length:12 }, (_, k) => ball(.0042, .02 + k * .0034, Math.sin(k * 1.9) * .0038, Math.cos(k * 1.9) * .0038)), '#ffd400', { anchor:V(.038, 0, .0075) });
  M.add('Tail', [tube(Array.from({ length:24 }, (_, k) => V(.013 + k * .0085, k < 6 ? 0 : Math.sin((k - 6) * .75) * .008 * Math.min(1, (k - 6) / 5), 0)), .0019, 120)], '#e9e2cf', { anchor:V(.14, .004, .002) });
  return M.parts; }

export function buildTubule() { const M = maker(V(.505, .985)), rad = d => d * Math.PI / 180, SIX = [0, 1, 2, 3, 4, 5];
  const at = (R, deg) => [R * Math.cos(rad(deg)), R * Math.sin(rad(deg))];
  const around = (R, r, degs, z = 0) => SIX.flatMap(k => degs.map(d => ball(r, ...at(R, k * 60 + d), z)));      // the Sertoli columns stand at 0°, 60°, …; every cell sits BETWEEN two of them
  M.add('Wall of the seminiferous tubule', [ext(circ(.09), .03, [circ(.085)])], '#e8d9c0', { anchor:V(.0875, 0, .015) });
  M.add('Sertoli cells', SIX.flatMap(k => { const g = ext([[.0845, -.0058], [.0845, .0058], [.0235, .0026], [.0235, -.0026]], .012); g.translate(0, 0, -.008); g.rotateZ(rad(k * 60)); return [g, ball(.0056, ...at(.0772, k * 60), -.003)]; }), '#9be38a', { anchor:V(.05, 0, -.002) });
  M.add('Spermatogonia', around(.0775, .0066, [13, 30, 47]), '#7cc4f2', { anchor:V(...at(.0775, 30), .0066) });
  M.add('Primary spermatocytes', around(.0595, .0098, [18, 42]), '#b9a2ff', { anchor:V(...at(.0595, 18), .0098) });
  M.add('Secondary spermatocytes', around(.0432, .0066, [17, 43]), '#ff9466', { anchor:V(...at(.0432, 17), .0066) });
  M.add('Spermatids', around(.0322, .005, [11, 30, 49]), '#ffe14d', { anchor:V(...at(.0322, 30), .005) });
  M.add('Spermatozoa', SIX.flatMap(k => [20, 40].flatMap(d => { const a = rad(k * 60 + d), c = Math.cos(a), sn = Math.sin(a), h = new THREE.SphereGeometry(.0031, 14, 10); h.scale(1.4, .85, .85); h.rotateZ(a); h.translate(.0242 * c, .0242 * sn, 0);      // heads in the wall, tails trailing into the lumen
    return [h, tube([0, 1, 2, 3, 4].map(j => { const R = .0212 - j * .0034, w = Math.sin(j * 1.7) * .0013; return V(R * c - w * sn, R * sn + w * c, 0); }), .0008, 16)]; })), '#fff3d6', { anchor:V(...at(.0242, 20), .0031) });
  /* the gap BETWEEN three tubules: this one and two neighbours (outlined only). Her clue for the Leydig cells is "between the seminiferous tubules". */
  for (const d of [225, 285]) M.lines('neighbouring tubule', arc(.09, rad(d - 180 - 62), rad(d - 180 + 62), ...at(.22, d), 36).map(([x, y]) => V(x, y, 0)));
  M.add('Leydig cells', [[0, 0], [.011, .004], [-.004, .011], [.008, -.009], [-.01, -.006]].map(([x, y]) => ball(.0072, -.022 + x, -.118 + y)), '#ffb347', { anchor:V(-.022, -.118, .0072) });
  M.add('Blood capillary', [tube([V(-.084, -.084), V(-.06, -.103), V(-.047, -.126), V(-.049, -.147)], .0034)], '#c62f2b', { anchor:V(-.06, -.103, .0034) });
  return M.parts; }

export function buildOvarySection() { const M = maker(V(.54, .95)), D = .016, A = .088, B = .055, W = .0065, TAU = Math.PI * 2;
  /* an egg-shaped outline, plumper on the right (her slide figure); `inset` walks the same outline w metres inside it */
  const egg = t => [A * Math.cos(t), B * Math.sin(t) * (1 + .22 * Math.cos(t))];
  const inset = (t, w) => { const [x, y] = egg(t), [x1, y1] = egg(t + 1e-4), dx = x1 - x, dy = y1 - y, l = Math.hypot(dx, dy); return [x - w * dy / l, y + w * dx / l]; };
  const run = (a0, a1, w, n = 90) => Array.from({ length:n + 1 }, (_, k) => inset(a0 + (a1 - a0) * k / n, w));
  const TG = -.95, [gx, gy] = egg(TG), [ix, iy] = inset(TG, 1), nx = gx - ix, ny = gy - iy;      // the ovulation site on the outline, and the outward direction there
  M.add('Stroma of the ovary', [ext(run(0, TAU * 89 / 90, W / 2, 89), D)], '#b9545f', { anchor:V(-.05, .004, D / 2) });
  M.add('Ovarian wall', [ext([...run(TG + .2, TG - .2 + TAU, 0), ...run(TG - .2 + TAU, TG + .2, W)], D + .008)], '#d8b98a', { anchor:V(-A, 0, D / 2 + .004) });      // open where the follicle has burst
  M.add('Artery inside the ovary', [tube([V(-.108, .006), V(-.07, .007), V(-.04, .002), V(-.012, .007), V(.014, .003)], .0015), tube([V(-.04, .002), V(-.028, .01), V(-.02, .0115)], .001, 12), tube([V(-.012, .007), V(.004, .013), V(.016, .0125)], .001, 12)].map(g => (g.translate(0, 0, D / 2 + .0015), g)), '#e0443f');
  M.add('Vein inside the ovary', [tube([V(-.108, -.003), V(-.07, -.004), V(-.04, -.009), V(-.01, -.004), V(.018, -.008)], .0015), tube([V(-.04, -.009), V(-.03, -.0165), V(-.018, -.0175)], .001, 12), tube([V(-.01, -.004), V(.006, -.0115), V(.02, -.0125)], .001, 12)].map(g => (g.translate(0, 0, D / 2 + .0015), g)), '#5b7be0');
  /* the stages, clockwise from the top left — the order her figures draw them in */
  const PF = [[-.04, .024, .006], [-.026, .031, .0072], [-.012, .025, .006], [.002, .034, .0078]];
  M.add('Primary follicle', PF.map(([x, y, r]) => disc(r, D + .006, x, y)), '#f7b3c2', { anchor:V(.002, .034, D / 2 + .003) });
  M.add('Oocyte in a primary follicle', PF.map(([x, y, r]) => disc(r * .45, D + .012, x, y)), '#fff1d0');
  M.add('Secondary follicle', [disc(.0125, D + .006, .025, .03), ring(.0084, .0016, .025, .03, 1, 1, D / 2 + .0035)], '#f7b3c2', { anchor:V(.025 + .0105, .03, D / 2 + .003) });
  M.add('Oocyte in the secondary follicle', [disc(.0048, D + .013, .025, .03)], '#fff1d0');
  const tx = .0613, ty = .0159;
  M.add('Tertiary follicle', [disc(.022, D + .006, tx, ty), disc(.0086, D + .014, tx - .0095, ty - .0075)], '#f7b3c2', { anchor:V(tx + .019, ty + .004, D / 2 + .003) });
  M.add('Antrum of the tertiary follicle', [disc(.0152, D + .01, tx + .0022, ty + .002)], '#8fb8e8', { anchor:V(tx + .006, ty + .006, D / 2 + .005) });
  M.add('Oocyte in the tertiary follicle', [disc(.0056, D + .018, tx - .0095, ty - .0075)], '#fff1d0');
  const rx = gx - .025 * nx, ry = gy - .025 * ny, ph = Math.atan2(ny, nx), ox = gx + .016 * nx, oy = gy + .016 * ny;
  M.add('Ruptured follicle', [ext([...arc(.018, ph + .6, ph - .6 + TAU, rx, ry), ...arc(.0115, ph - .6 + TAU, ph + .6, rx, ry)], D + .006)], '#f7b3c2', { anchor:V(rx - .0148 * nx, ry - .0148 * ny, D / 2 + .003) });
  M.add('Follicular fluid', [disc(.0112, D + .003, rx, ry), ext([[rx - ny * .006, ry + nx * .006], [ox - .012 * nx - ny * .003, oy - .012 * ny + nx * .003], [ox - .012 * nx + ny * .003, oy - .012 * ny - nx * .003], [rx + ny * .006, ry - nx * .006]], D + .003)], '#a9cdf2');
  M.add('Secondary oocyte', [ball(.0072, ox, oy)], '#ffe9a8', { anchor:V(ox, oy, .0072) });
  M.add('Zona radiata', [ring(.0105, .0026, ox, oy)], '#ff9466', { anchor:V(ox + .0105, oy, .0026) });
  const lx = .004, ly = -.0295;
  M.add('Corpus luteum', [disc(.0105, D + .006, lx, ly), ...Array.from({ length:8 }, (_, k) => disc(.0052, D + .01, lx + Math.cos(k * TAU / 8) * .0098, ly + Math.sin(k * TAU / 8) * .0098))], '#ffd84d', { anchor:V(lx + .0098, ly, D / 2 + .005) });
  M.add('Centre of the corpus luteum', [disc(.0042, D + .014, lx, ly)], '#c9707a');
  M.add('Corpus albicans', [disc(.006, D + .006, -.034, -.024), ...Array.from({ length:5 }, (_, k) => disc(.0046, D + .009, -.034 + Math.cos(k * TAU / 5 + .5) * .0054, -.024 + Math.sin(k * TAU / 5 + .5) * .0054))], '#f4efe6', { anchor:V(-.034, -.024, D / 2 + .0045) });
  return M.parts; }
