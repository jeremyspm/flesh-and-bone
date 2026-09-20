/* made-eye.js — the eyeball, BUILT as a cut-away and declared a schematic.
 *
 * The 3D source has a cornea, iris, lens, retina, sclera and vitreous body, but no choroid, ciliary body, pupil, macula,
 * optic disc or canal of Schlemm — half of her list (her Module 3 revision slides 15-16: the three tunics and what is in
 * them). So the whole eye is generated: every layer is a body of revolution about the optical axis, with ONE quarter cut
 * away toward the viewer, so both cut faces show the layers in order — the textbook horizontal section, in 3D — and you
 * can look in at the retina, the macula and the optic disc. The lens is left whole. The two humors are fluid: drawn as
 * glass, and a tap passes through them unless a humor is what was asked. Not to scale (the coats are thickened so a finger
 * can hit them); the order, the attachments and what touches what are real. Nothing is lettered. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const RAD = Math.PI / 180, P = (r, y) => new THREE.Vector2(r, y);
const PHI0 = 270, LEN = 180;                                      // the whole TOP half is taken out: the cut face is the textbook horizontal section through lens, fovea and optic nerve — flat, as every one of her eye figures draws it (the first build took out one quarter only, and matched none of them)
const arc = (cy, R, a0, a1, n = 22) => Array.from({ length:n + 1 }, (_, k) => { const a = (a0 + (a1 - a0) * k / n) * RAD; return P(R * Math.sin(a), cy + R * Math.cos(a)); });      // a = angle from the FRONT pole

export function buildEye(O = new THREE.Vector3(0, 1.2, 0)) {
  const parts = [];
  const flat = g => { const n = g.index ? g.toNonIndexed() : g; if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2)); if (!n.attributes.normal) n.computeVertexNormals(); return n; };
  const cap = (pts, phi) => { const g = new THREE.ShapeGeometry(new THREE.Shape(pts)); g.rotateY(phi * RAD - Math.PI / 2); return g; };
  /* grow = degrees a part sticks out PAST both cut faces: a part buried inside another (the canal of Schlemm in the sclera) would otherwise be coplanar with it and invisible */
  const body = (pts, cut = true, grow = 0) => cut ? [new THREE.LatheGeometry([...pts, pts[0]], 72, (PHI0 - grow) * RAD, (LEN + 2 * grow) * RAD), cap(pts, PHI0 - grow), cap(pts, PHI0 + LEN + grow)] : [new THREE.LatheGeometry([...pts, pts[0]], 72)];
  const shell = (cy, r0, r1, a0, a1) => [...arc(cy, r1, a0, a1), ...arc(cy, r0, a1, a0)];
  const at = (r, a, phi, cy = 0) => new THREE.Vector3(r * Math.sin(a * RAD) * Math.sin(phi * RAD), cy + r * Math.cos(a * RAD), r * Math.sin(a * RAD) * Math.cos(phi * RAD));      // lathe space: y is the optical axis
  const fin = (name, geoms, colour, extra = {}) => { const g = mergeGeometries(geoms.map(flat)); g.rotateX(Math.PI / 2); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2).add(O); parts.push({ name, geometry:g, colour, ...extra }); };
  const CUT = PHI0 + 4;                                       // labels point at the horizontal cut face, where every layer shows

  // ── fibrous tunic ──
  fin('Sclera', body(shell(0, .090, .100, 40, 180)), '#f4f1ea', { anchor:at(.095, 120, CUT) });
  fin('Cornea', body(shell(.030, .070, .078, 0, 56)), '#bfe6ff', { glassy:.45, anchor:at(.074, 28, CUT, .030) });
  // ── vascular tunic ──
  fin('Choroid', body(shell(0, .082, .090, 58, 180)), '#7a2e2a', { anchor:at(.086, 125, CUT) });
  fin('Ciliary body', body([P(.0602, .0669), P(.0763, .0477), P(.0695, .0435), P(.0500, .0580), P(.0550, .0640)]), '#b0605a', { anchor:at(.063, 50, CUT) });
  fin('Iris', body([P(.0180, .0655), P(.0570, .0672), P(.0570, .0712), P(.0180, .0695)]), '#3f78b8', { anchor:at(.038, 90, CUT, .0690) });
  fin('Pupil', body([P(0, .0665), P(.0180, .0665), P(.0180, .0687), P(0, .0687)], false), '#07080b', { anchor:new THREE.Vector3(0, .0687, 0) });
  const lig = []; for (let phi = PHI0 + 6; phi < PHI0 + LEN; phi += 9) { const a = new THREE.Vector3(.0505 * Math.sin(phi * RAD), .0580, .0505 * Math.cos(phi * RAD)), b = new THREE.Vector3(.0378 * Math.sin(phi * RAD), .0440, .0378 * Math.cos(phi * RAD));
    for (const dy of [-.0035, .0035]) lig.push(new THREE.TubeGeometry(new THREE.LineCurve3(a, b.clone().setY(b.y + dy)), 1, .0012, 6, false)); }
  fin('Suspensory ligaments', lig, '#e9e2cf', { anchor:new THREE.Vector3(.044 * Math.sin(CUT * RAD), .051, .044 * Math.cos(CUT * RAD)) });
  fin('Canal of Schlemm', body(Array.from({ length:12 }, (_, k) => P(.0625 + .0030 * Math.cos(k * 30 * RAD), .0695 + .0030 * Math.sin(k * 30 * RAD))), true, 2.4), '#4f7fe0', { anchor:at(.0625, 90, CUT, .0695) });
  fin('Conjunctiva', body(shell(0, .1002, .1028, 42, 78)), '#ffc9c2', { anchor:at(.1015, 62, CUT) });      // her MCQ: pinkeye is an infection of it. Over the front of the sclera, not over the cornea
  // ── neural tunic ──
  fin('Retina', body(shell(0, .074, .082, 66, 180)), '#f0a868', { anchor:at(.078, 118, CUT) });
  fin('Macula lutea', body(shell(0, .0722, .0742, 171, 180), false), '#ffe14d', { anchor:new THREE.Vector3(0, -.0722, 0) });
  const dPhi = 270, dA = 163, dN = at(1, dA, dPhi), dC = dN.clone().multiplyScalar(.0730), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dN);      // beside the macula and IN the cut plane, so the section passes through the disc and the nerve as her figures do
  const disc = new THREE.CylinderGeometry(.0115, .0115, .0022, 28); disc.applyQuaternion(q); disc.translate(dC.x, dC.y, dC.z);
  fin('Optic disc', [disc], '#fff3d6', { anchor:dC.clone() });
  fin('Fovea centralis', body(shell(0, .0712, .0732, 176.6, 180), false), '#ff8a1c', { anchor:new THREE.Vector3(0, -.0712, 0) });      // the pit at the centre of the macula: her key for "only cones"
  fin('Hyaloid canal', [new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, .0262, 0), dN.clone().multiplyScalar(.0735)), 8, .0021, 10, false)], '#6fb8ff', { anchor:dN.clone().multiplyScalar(.03).add(new THREE.Vector3(0, .012, 0)) });      // her revision match: "hyaloid canal in vitreous humor"
  const nerve = new THREE.CylinderGeometry(.0125, .0115, .075, 24); nerve.translate(0, .0375, 0); nerve.applyQuaternion(q); const nC = dN.clone().multiplyScalar(.0995); nerve.translate(nC.x, nC.y, nC.z);
  fin('Optic nerve', [nerve], '#f0d66b', { anchor:dN.clone().multiplyScalar(.14) });
  // ── what is inside ──
  fin('Lens', body(Array.from({ length:33 }, (_, k) => P(.0380 * Math.sin(k / 32 * Math.PI), .0440 + .0180 * Math.cos(k / 32 * Math.PI))), false), '#fff2b8', { glassy:.72, anchor:new THREE.Vector3(.02, .0600, .02) });
  fin('Aqueous humor', body([P(0, .0995), ...arc(.030, .0695, 3, 54), P(.0568, .0714), P(.0180, .0698), P(0, .0698)]), '#9fdcff', { glassy:.28, soft:true, anchor:at(.030, 90, CUT, .083) });
  fin('Vitreous humor', body([...arc(0, .0738, 180, 67), P(.0490, .0560), P(.0385, .0425), ...Array.from({ length:11 }, (_, k) => P(.0380 * Math.sin((.5 + k / 20) * Math.PI), .0440 + .0180 * Math.cos((.5 + k / 20) * Math.PI)))]), '#d9f2ff', { glassy:.16, soft:true, anchor:at(.040, 130, CUT) });
  return parts;
}
