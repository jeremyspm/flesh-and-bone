/* made-ear.js — the ear, outer to inner, BUILT and declared a schematic.
 *
 * The 3D source has the ossicles, eardrum, cochlea, vestibule and auditory tube as millimetre-sized meshes buried in the
 * temporal bone, and no ear canal, oval window, semicircular canals, utricle or saccule — so her list (Module 3 revision
 * slides 18-21) cannot be asked on it. This is the textbook figure instead, laid out left to right = outside to inside:
 *   pinna → external auditory canal (opened along its length) → tympanic membrane → malleus · incus · stapes →
 *   oval window → vestibule (glass: utricle and saccule inside) with the three semicircular canals above it and the
 *   cochlea below → vestibulocochlear nerve; the Eustachian tube drops from the middle ear toward the nasopharynx.
 * That left-to-right order IS her sound pathway (1 ear canal · 2 tympanic membrane · 3 ossicles · 4 oval window · 5 cochlea).
 * Not to scale — the middle and inner ear are drawn several times too large beside the pinna. Nothing is lettered. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

export function buildEar(O = V(.42, 1.2, 0)) {
  const parts = [];
  const flat = g => g.index ? g.toNonIndexed() : g;
  const tube = (pts, r, seg = 24, rs = 10) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, rs, false);
  const ball = (c, r, s = [1, 1, 1], d = 2) => { const g = new THREE.IcosahedronGeometry(r, d); g.scale(s[0], s[1], s[2]); g.translate(c.x, c.y, c.z); return g; };
  const add = (name, geoms, colour, extra = {}) => { const g = mergeGeometries(geoms.map(flat)); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(O); parts.push({ name, geometry:g, colour, ...extra }); };
  const BONE = '#efe4c8', LAB = '#e8cf7a';

  // ── outer ear ──
  const rim = new THREE.TorusGeometry(.046, .0105, 12, 40, Math.PI * 1.55); rim.rotateZ(Math.PI * .225); rim.scale(.8, 1.35, .55);      // the gap in the rim faces the canal
  const plate = ball(V(.004, -.004, -.004), .044, [.72, 1.25, .16], 3), lobe = ball(V(-.004, -.064, 0), .017, [.9, 1.1, .5]);
  [rim, plate, lobe].forEach(g => g.translate(-.175, 0, 0));
  add('Pinna', [rim, plate, lobe], '#e9b999', { anchor:V(-.175, .05, .01) });
  const canal = new THREE.CylinderGeometry(.0125, .0145, .105, 28, 1, true, Math.PI * .5, Math.PI * 1.25); canal.rotateZ(Math.PI / 2); canal.translate(-.108, 0, 0);      // opened along its length so the eardrum at the end can be seen
  add('External auditory canal', [canal], '#d99f86', { anchor:V(-.11, -.0125, .004) });
  const drum = new THREE.ConeGeometry(.0138, .005, 32, 1, false); drum.rotateZ(-Math.PI / 2); drum.translate(-.0535, 0, 0);
  add('Tympanic membrane', [drum], '#f6ead9', { anchor:V(-.0545, .009, .008) });

  // ── middle ear: three ossicles, eardrum to oval window ──
  const mal = [tube([V(-.0505, -.002), V(-.047, .008), V(-.041, .019)], .0021, 10), ball(V(-.040, .0215), .0052, [1, 1.15, 1])];
  const inc = [ball(V(-.0305, .0225), .0056, [1.25, 1, 1]), tube([V(-.029, .020), V(-.0245, .011), V(-.0215, .0035)], .0019, 10), tube([V(-.028, .0235), V(-.021, .0265)], .0017, 4)];
  const st = [tube([V(-.0215, .0035), V(-.014, .0085), V(-.0065, .0045)], .0012, 10), tube([V(-.0215, .0035), V(-.014, -.0025), V(-.0065, .0005)], .0012, 10), ball(V(-.0215, .0035), .0023)];
  const foot = new THREE.CylinderGeometry(.0046, .0046, .0014, 20); foot.rotateZ(Math.PI / 2); foot.scale(1, 1, .7); foot.translate(-.0062, .0025, 0); st.push(foot);
  add('Malleus', mal, BONE, { anchor:V(-.040, .0215, .0052) });
  add('Incus', inc, BONE, { anchor:V(-.0305, .0225, .0056) });
  add('Stapes', st, BONE, { anchor:V(-.014, .0085, .0012) });
  const oval = new THREE.CylinderGeometry(.0072, .0072, .0012, 24); oval.rotateZ(Math.PI / 2); oval.scale(1, 1, .72); oval.translate(-.0048, .0025, 0);
  add('Oval window', [oval], '#7cc4f2', { anchor:V(-.0048, .0092, 0) });
  add('Eustachian tube', [tube([V(-.030, -.016), V(-.012, -.030), V(.012, -.052), V(.040, -.078, .01)], .0052, 24), ball(V(.0415, -.0795, .01), .0085, [1.2, .9, 1])], '#e59a98', { anchor:V(.012, -.052, .0052) });

  // ── inner ear: the bony labyrinth (yellow), with the membranous utricle and saccule seen through the vestibule ──
  const Vc = V(.014, .004);
  add('Vestibule', [ball(Vc, .0195, [1, 1.05, .9], 3)], LAB, { glassy:.5, anchor:Vc.clone().add(V(0, -.012, .016)) });
  add('Utricle', [ball(Vc.clone().add(V(.002, .0072, 0)), .0072, [1.3, .85, .9])], '#5b9bff', { anchor:Vc.clone().add(V(.002, .0072, .007)) });
  add('Saccule', [ball(Vc.clone().add(V(-.001, -.0068, 0)), .0056)], '#3f7be0', { anchor:Vc.clone().add(V(-.001, -.0068, .0056)) });
  const ring = (rot, pos) => { const g = new THREE.TorusGeometry(.0225, .0034, 10, 40, Math.PI * 1.55); g.rotateZ(-Math.PI * .28); rot(g); g.translate(pos.x, pos.y, pos.z); return g; };
  const canals = [ring(g => g, V(.012, .034, 0)), ring(g => g.rotateY(Math.PI / 2), V(.034, .030, -.004)), ring(g => g.rotateX(Math.PI / 2), V(.036, .012, .004))];
  [V(-.004, .020, 0), V(.030, .017, .010), V(.022, .012, .018)].forEach(p => canals.push(ball(p, .0056)));                     // the ampullae, where each canal swells as it rejoins the vestibule
  add('Semicircular canals', canals, LAB, { anchor:V(.012, .0565, 0) });
  const Cc = V(.030, -.030, .004), coch = [];                                                                                  // the cochlea: two and a half turns, narrowing as it climbs toward you
  for (let turn = 0; turn < 3; turn++) { const pts = []; for (let k = 0; k <= 14; k++) { const t = (turn + k / 14) * Math.PI * 2; if (t > 2.6 * Math.PI * 2) break; const r = .0215 - .0062 * t / (Math.PI * 2); pts.push(V(Cc.x + Math.cos(t + 2.4) * r, Cc.y + Math.sin(t + 2.4) * r, Cc.z + .0058 * t / (Math.PI * 2))); }
    if (pts.length > 2) coch.push(tube(pts, [.0078, .0062, .0047][turn], 28, 12)); }
  coch.push(tube([Vc.clone().add(V(.004, -.014, 0)), V(.010, -.022, .002), V(Cc.x + Math.cos(2.4) * .0215, Cc.y + Math.sin(2.4) * .0215, Cc.z)], .0075, 8, 12));
  add('Cochlea', coch, LAB, { anchor:Cc.clone().add(V(0, 0, .022)) });
  add('Vestibulocochlear nerve', [tube([Cc.clone().add(V(.004, .002, -.006)), V(.062, -.020, -.006), V(.085, -.006, -.004), V(.125, .002, 0)], .0042, 24), tube([Vc.clone().add(V(.012, .002, -.008)), V(.050, .010, -.008), V(.085, -.004, -.004)], .0036, 20)], '#f0d66b', { anchor:V(.105, -.002, .004) });
  return parts;
}
