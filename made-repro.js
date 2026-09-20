/* made-repro.js — the three reproduction figures her Module 3 QUIZZES test with an image (read from her graded keys, 21 Sep 2026), which no organ model shows.
 * All BUILT, all declared schematics, nothing lettered, nothing to scale.
 *   buildSperm()         her label-the-sperm-cell blank: acrosome · chromatin · mitochondria · tail
 *   buildTubule()        her spermatogenesis match: spermatogonium → primary → secondary spermatocyte → spermatid → spermatozoon, Sertoli cells, Leydig cells OUTSIDE the tubule
 *   buildOvarySection()  her ovulation drop-downs: the tertiary (Graafian) follicle ruptures through the ovarian wall and releases a secondary oocyte in its zona radiata; then the corpus luteum */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const flat = g => { const n = g.index ? g.toNonIndexed() : g; for (const a of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(a)) n.deleteAttribute(a); return n; };
const maker = O => { const parts = []; return { parts, add(name, geoms, colour, extra = {}) { const g = mergeGeometries(geoms.map(flat)); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(O); parts.push({ name, geometry:g, colour, ...extra }); } }; };
const box = (w, h, d, x, y, z = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
const ball = (r, x, y, z = 0, sx = 1, sy = 1, sz = 1) => { const g = new THREE.SphereGeometry(r, 20, 14); g.scale(sx, sy, sz); g.translate(x, y, z); return g; };
const disc = (r, d, x, y, sx = 1, sy = 1, z = 0) => { const g = new THREE.CylinderGeometry(r, r, d, 40); g.rotateX(Math.PI / 2); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const ring = (R, t, x, y, sx = 1, sy = 1, z = 0, a0 = 0, a1 = Math.PI * 2) => { const g = new THREE.TorusGeometry(R, t, 10, 56, a1 - a0); g.rotateZ(a0); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const tube = (pts, r, seg = 40) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 8, false);

export function buildSperm() { const M = maker(V(.42, .78));
  M.add('Chromatin', [ball(.0115, 0, 0, 0, 1.3, .85, .85)], '#7b5cd6', { anchor:V(.004, 0, .0098) });
  const cap = new THREE.SphereGeometry(.0128, 24, 14, 0, Math.PI * 2, 0, Math.PI * .46); cap.rotateZ(Math.PI / 2); cap.scale(1.3, .88, .88);
  M.add('Acrosome', [cap], '#ff9466', { anchor:V(-.013, 0, .006) });
  M.add('Mitochondria', Array.from({ length:12 }, (_, k) => ball(.0042, .02 + k * .0034, Math.sin(k * 1.9) * .0038, Math.cos(k * 1.9) * .0038)), '#ffd400', { anchor:V(.038, 0, .0075) });
  M.add('Tail', [tube(Array.from({ length:24 }, (_, k) => V(.013 + k * .0085, k < 6 ? 0 : Math.sin((k - 6) * .75) * .008 * Math.min(1, (k - 6) / 5), 0)), .0019, 120)], '#e9e2cf', { anchor:V(.14, .004, .002) });
  return M.parts; }

export function buildTubule() { const M = maker(V(.42, .9)), row = (n, x0, x1, y, r, z = 0) => Array.from({ length:n }, (_, k) => ball(r, x0 + (x1 - x0) * k / (n - 1), y + (k % 2) * r * .35, z));
  M.add('Wall of the seminiferous tubule', [box(.17, .004, .03, .08, -.004)], '#e8d9c0');
  M.add('Sertoli cells', [box(.013, .094, .018, .034, .045, -.008), box(.013, .094, .018, .118, .045, -.008), ball(.0075, .034, .016, -.001), ball(.0075, .118, .016, -.001)], '#9be38a', { anchor:V(.034, .07, .001) });
  M.add('Spermatogonia', row(6, .006, .156, .0085, .0085), '#7cc4f2', { anchor:V(.066, .0085, .0085) });
  M.add('Primary spermatocytes', row(4, .012, .15, .033, .0118), '#b9a2ff', { anchor:V(.058, .033, .0118) });
  M.add('Secondary spermatocytes', row(5, .008, .152, .058, .008), '#ff9466', { anchor:V(.08, .058, .008) });
  M.add('Spermatids', row(7, .006, .154, .076, .0056), '#ffe14d', { anchor:V(.08, .078, .0056) });
  M.add('Spermatozoa', Array.from({ length:5 }, (_, k) => { const x = .02 + k * .03; return [ball(.0034, x, .09, 0, .8, 1.3), tube([V(x, .094), V(x + .003, .106), V(x - .002, .118), V(x + .002, .13)], .0009, 16)]; }).flat(), '#fff3d6', { anchor:V(.08, .092, .0034) });
  M.add('Leydig cells', [[.05, -.02], [.064, -.027], [.078, -.019], [.066, -.013]].map(([x, y]) => ball(.0078, x, y)), '#ffb347', { anchor:V(.064, -.02, .0078) });
  M.add('Blood capillary', [tube([V(.0, -.034), V(.05, -.04), V(.11, -.033), V(.16, -.04)], .0034)], '#c62f2b');
  return M.parts; }

export function buildOvarySection() { const M = maker(V(.54, .95)), D = .02, sx = 1.45, R = .06;
  M.add('Stroma of the ovary', [disc(R - .004, D, 0, 0, sx, 1)], '#f3c6b8');
  M.add('Ovarian wall', [ring(R, .0042, 0, 0, sx, 1, 0, Math.PI * .56, Math.PI * 2.44)], '#d9776a', { anchor:V(-R * sx, 0, .0042) });      // open at the top, where the follicle has ruptured
  const foll = (r, x, y, c) => [disc(r, D + .006, x, y), disc(r * .42, D + .012, x, y)];
  M.add('Primary follicle', [...foll(.0085, -.062, -.012), ...foll(.0085, -.05, -.032)], '#ffd27a', { anchor:V(-.062, -.012, D / 2 + .006) });
  M.add('Secondary follicle', foll(.0135, -.018, -.036), '#ffb38a', { anchor:V(-.018, -.036, D / 2 + .006) });
  M.add('Tertiary follicle', [ring(.0245, .0045, .032, -.018, 1, 1, D / 2), disc(.021, D + .004, .032, -.018)], '#8fd3ff', { anchor:V(.032 + .0245, -.018, D / 2 + .0045) });
  M.add('Oocyte in the tertiary follicle', [disc(.0062, D + .012, .043, -.024)], '#fff06a');
  M.add('Secondary oocyte', [ball(.0072, 0, R + .02)], '#fff06a', { anchor:V(0, R + .02, .0072) });
  M.add('Zona radiata', [ring(.0105, .0026, 0, R + .02)], '#ff9466', { anchor:V(.0105, R + .02, .0026) });
  M.add('Corpus luteum', [disc(.02, D + .008, .052, .022, 1.1, .9), ...[0, 1, 2, 3, 4].map(k => disc(.0058, D + .012, .052 + Math.cos(k * 1.256) * .0105, .022 + Math.sin(k * 1.256) * .009))], '#ffd400', { anchor:V(.052, .022, D / 2 + .006) });
  M.add('Corpus albicans', [disc(.0115, D + .006, -.04, .028, 1.15, .85)], '#efe9dd', { anchor:V(-.04, .028, D / 2 + .003) });
  return M.parts; }
