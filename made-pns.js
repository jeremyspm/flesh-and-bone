/* made-pns.js — the two figures of her PERIPHERAL NERVOUS SYSTEM quiz (Module 2.2, read from the graded keys 21 Sep 2026) that no whole-body nerve model shows.
 * BUILT, declared schematics, nothing lettered, nothing to scale.
 *   buildSpinalCord()   the cord in cross-section — central canal · dorsal horn · ventral horn · dorsal root (sensory) + its ganglion · ventral root (motor) · spinal nerve (mixed)
 *                       — with a withdrawal REFLEX ARC laid over it: receptor → sensory neuron → interneuron → motor neuron → effector (her essay: "name the components in order")
 *   buildNerveSection() a nerve cut across: endoneurium round each nerve fibre · perineurium round each fascicle · epineurium round the whole nerve (her drop-downs) */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const flat = g => { const n = g.index ? g.toNonIndexed() : g; for (const a of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(a)) n.deleteAttribute(a); return n; };
const maker = O => { const parts = []; return { parts, add(name, geoms, colour, extra = {}) { const g = mergeGeometries(geoms.map(flat)); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(O); parts.push({ name, geometry:g, colour, ...extra }); } }; };
const box = (w, h, d, x, y, z = 0, rot = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (rot) g.rotateZ(rot); g.translate(x, y, z); return g; };
const ball = (r, x, y, z = 0, sx = 1, sy = 1) => { const g = new THREE.SphereGeometry(r, 20, 14); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const disc = (r, d, x, y, sx = 1, sy = 1, z = 0) => { const g = new THREE.CylinderGeometry(r, r, d, 44); g.rotateX(Math.PI / 2); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const ring = (R, t, x, y, sx = 1, sy = 1, z = 0) => { const g = new THREE.TorusGeometry(R, t, 10, 56); g.scale(sx, sy, 1); g.translate(x, y, z); return g; };
const tube = (pts, r, seg = 40) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 8, false);
const slab = (pts, d, z = 0) => { const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1]))), { depth:d, bevelEnabled:false }); g.translate(0, 0, z - d / 2); return g; };

/* dorsal (posterior) is UP, like her figure. Everything is drawn on the RIGHT side of the cord; the left half of the butterfly is there for shape. */
export function buildSpinalCord() { const M = maker(V(.52, 1.28)), D = .018, zF = D / 2 + .004;
  M.add('White matter of the spinal cord', [disc(.05, D, 0, 0, 1.2, 1)], '#f1ead8');
  const horn = s => [[0, .006], [s * .012, .012], [s * .022, .034], [s * .03, .038], [s * .033, .03], [s * .026, .008], [s * .034, -.014], [s * .03, -.03], [s * .018, -.032], [s * .01, -.012], [0, -.006]];
  M.add('Grey commissure', [slab([[-.012, .007], [.012, .007], [.012, -.007], [-.012, -.007]], D + .004), slab(horn(-1).map(p => [p[0], p[1]]).reverse(), D + .004)], '#b9a79a');      // the left half + the bridge: shape only
  M.add('Dorsal horn', [slab([[.006, .006], [.012, .012], [.022, .034], [.03, .038], [.033, .03], [.026, .008], [.02, .002]], D + .006)], '#8f7bd6', { anchor:V(.026, .03, zF) });
  M.add('Ventral horn', [slab([[.006, -.006], [.02, .002], [.026, .008], [.034, -.014], [.03, -.03], [.018, -.032], [.01, -.012]].reverse(), D + .006)], '#d9776a', { anchor:V(.026, -.02, zF) });
  M.add('Central canal', [disc(.0042, D + .01, 0, 0)], '#6db7ee', { anchor:V(0, 0, D / 2 + .005) });
  /* the three coverings, deepest first — her meninges label question is asked on a spinal cord figure (pia L · arachnoid K · dura J). C-shaped: open on the right, where the roots leave. Drawn far thicker than life: at phone size a true-to-scale pia is 3 px wide and no finger can hit it */
  const cee = (r0, r1) => { const A0 = 58 * Math.PI / 180, A1 = 308 * Math.PI / 180, n = 60, at = (r, k) => { const a = A0 + (A1 - A0) * k / n; return [r * 1.2 * Math.cos(a), r * Math.sin(a)]; };
    return slab([...Array.from({ length:n + 1 }, (_, k) => at(r1, k)), ...Array.from({ length:n + 1 }, (_, k) => at(r0, n - k))], D); };
  M.add('Pia mater of the cord', [cee(.0505, .0575)], '#f29bb0', { anchor:V(-.0648, 0, D / 2) });
  M.add('Subarachnoid space of the cord', [cee(.0575, .0695)], '#9fdcff', { glassy:.45, anchor:V(-.0762, .004, D / 2) });
  M.add('Arachnoid mater of the cord', [cee(.0695, .0765)], '#c3aef0', { anchor:V(-.0876, 0, D / 2) });
  M.add('Dura mater of the cord', [cee(.078, .087)], '#c9bea6', { anchor:V(-.099, 0, D / 2) });
  // roots: dorsal (sensory, with its ganglion) and ventral (motor) join into the spinal nerve (mixed)
  M.add('Dorsal root', [tube([V(.03, .036), V(.06, .05), V(.095, .045), V(.125, .02)], .0048)], '#7cc4f2', { anchor:V(.07, .051, .0048) });
  M.add('Dorsal root ganglion', [ball(.0115, .098, .043, 0, 1.35, 1)], '#4f9fe0', { anchor:V(.098, .043, .0115) });
  M.add('Ventral root', [tube([V(.03, -.03), V(.06, -.04), V(.095, -.025), V(.125, .0)], .0048)], '#ff9466', { anchor:V(.07, -.039, .0048) });
  M.add('Spinal nerve', [tube([V(.123, .012), V(.145, .01), V(.175, .008)], .0078, 12)], '#ffe27a', { anchor:V(.15, .01, .0078) });
  // the reflex arc, in front of the section (z proud), thin and bright
  const z = zF + .004;
  M.add('Receptor', [box(.03, .008, .012, .235, .05, z), ...[0, 1, 2].map(k => box(.0016, .012, .004, .226 + k * .009, .042, z))], '#f6c6a8', { anchor:V(.235, .054, z + .006) });
  M.add('Sensory neuron', [tube([V(.235, .044, z), V(.2, .03, z), V(.17, .014, z), V(.125, .024, z), V(.098, .045, z), V(.06, .052, z), V(.03, .034, z)], .0017, 80), ball(.0048, .098, .045, z)], '#2f7fe0', { anchor:V(.2, .03, z + .002) });
  M.add('Interneuron', [ball(.0042, .02, .012, z), tube([V(.028, .03, z), V(.02, .012, z), V(.022, -.012, z)], .0015, 20)], '#7dff9c', { anchor:V(.02, .012, z + .0042) });
  M.add('Motor neuron', [ball(.0052, .024, -.018, z), tube([V(.024, -.018, z), V(.06, -.042, z), V(.095, -.027, z), V(.125, -.002, z), V(.17, .002, z), V(.2, -.02, z), V(.232, -.04, z)], .0017, 80)], '#e2504c', { anchor:V(.2, -.02, z + .002) });
  M.add('Effector', [ball(.014, .245, -.05, z, 1.6, .7)], '#b5483f', { anchor:V(.245, -.05, z + .014) });
  return M.parts; }

export function buildNerveSection() { const M = maker(V(.52, 1.02)), D = .02, F = [[-.018, .012, .021], [.022, .014, .017], [.002, -.022, .019]];
  M.add('Epineurium', [disc(.054, D, 0, 0), ring(.054, .004, 0, 0, 1, 1, D / 2)], '#f0d9b5', { anchor:V(-.04, -.03, D / 2 + .002) });
  M.add('Blood vessels of the nerve', [disc(.0045, D + .006, -.036, -.022), disc(.0036, D + .006, .038, -.02)], '#c62f2b');
  M.add('Perineurium', F.map(([x, y, r]) => ring(r, .0028, x, y, 1, 1, D / 2 + .002)), '#c77bd0', { anchor:V(F[0][0] - F[0][2], F[0][1], D / 2 + .005) });
  M.add('Fascicle', F.map(([x, y, r]) => disc(r - .002, D + .004, x, y)), '#f7e7c8', { anchor:V(F[1][0], F[1][1] + .01, D / 2 + .002) });
  const ax = [], my = [], en = []; F.forEach(([x, y, r]) => { for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + x * 40, px = x + Math.cos(a) * r * .56, py = y + Math.sin(a) * r * .56; en.push(disc(.006, D + .007, px, py)); my.push(disc(.0038, D + .01, px, py)); ax.push(disc(.0019, D + .013, px, py)); } });
  M.add('Nerve fibre', ax, '#fff06a', { anchor:V(F[1][0] + F[1][2] * .56, F[1][1], D / 2 + .007) });
  M.add('Myelin sheath of the nerve fibre', my, '#ffffff');
  M.add('Endoneurium', en, '#7dff9c', { anchor:V(F[2][0] + F[2][2] * .56 + .005, F[2][1], D / 2 + .004) });
  return M.parts; }
