/* made-heart.js — the cardiac conduction system, BUILT onto the real heart and declared a schematic.
 *
 * Z-Anatomy models the chambers, valves, papillary muscles, great vessels and coronaries, but no conduction system —
 * and she asks it twice as a labelled figure and twice as an ordering question (SA node → AV node → bundle of His →
 * right and left bundle branches → Purkinje fibres). Its parts are PLACED BY MEASUREMENT on this heart's own meshes:
 *   SA node        where the superior vena cava meets the right atrium (the lowest ring of the SVC)
 *   AV node        in the septum between the two atrioventricular valves, just above them
 *   bundle of His  from the AV node down the first fifth of the line to the apex (the top of the interventricular septum)
 *   bundle branches one each side of that line, offset toward its own ventricle, down to near the apex
 *   Purkinje fibres from the foot of each branch up the inside of that ventricle's free wall
 * Shown only when asked, with the chambers drawn as glass. Right order, right places, schematic shapes. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function buildConduction(get) {                                  // get(base) → registry entry of that mesh, or undefined
  const need = ['right atrium', 'left atrium', 'right ventricle', 'left ventricle', 'superior vena cava'].map(get); if (need.some(x => !x)) return [];
  const [RA, LA, RV, LV, SVC] = need, v = new THREE.Vector3();
  const verts = info => { const p = info.mesh.geometry.attributes.position, out = []; info.mesh.updateMatrixWorld(true); for (let k = 0; k < p.count; k++) out.push(new THREE.Vector3(p.getX(k), p.getY(k), p.getZ(k)).applyMatrix4(info.mesh.matrixWorld)); return out; };
  const mean = pts => pts.reduce((s, p) => s.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
  const centre = info => info.box.getCenter(new THREE.Vector3());
  const tube = (pts, r, seg = 16) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 8, false);
  const blob = (c, r, s) => { const g = new THREE.IcosahedronGeometry(r, 2); g.scale(s[0], s[1], s[2]); g.translate(c.x, c.y, c.z); return g; };
  const merged = gs => mergeGeometries(gs.map(g => g.index ? g.toNonIndexed() : g));

  const svc = verts(SVC).sort((a, b) => a.y - b.y), foot = mean(svc.slice(0, Math.max(8, svc.length * .08 | 0)));           // the ring where the SVC opens into the atrium
  const SA = foot.clone().lerp(centre(RA), .22);
  const leaf = b => { const i = get(b); return i ? centre(i) : null; }, T = leaf('septal leaflet of right atrioventricular valve') || centre(RV).lerp(centre(RA), .5), M = leaf('posterior leaflet of left atrioventricular valve') || centre(LV).lerp(centre(LA), .5);
  const AV = T.clone().lerp(M, .42).add(v.set(0, .007, -.003));
  const lv = verts(LV), apex = lv.reduce((a, p) => p.y < a.y ? p : a, lv[0]).clone().lerp(centre(LV), .12);                 // just inside the tip
  const n = centre(RV).sub(centre(LV)).setY(0).normalize();                                                                // from the left ventricle toward the right one, across the septum
  const H = AV.clone().lerp(apex, .2), down = t => AV.clone().lerp(apex, t);
  const branch = s => [H, down(.35).addScaledVector(n, s * .0045), down(.6).addScaledVector(n, s * .006), down(.84).addScaledVector(n, s * .0065)];
  const R = branch(1), L = branch(-1);
  const purk = (info, from, s) => { const c = centre(info), pts = verts(info), h = info.box.max.y - info.box.min.y, out = [];
    [.2, .38, .56, .72].forEach((f, k) => { const y = info.box.min.y + h * f, band = pts.filter(p => Math.abs(p.y - y) < h * .05); if (!band.length) return;
      for (const side of [-1, 1]) { const want = n.clone().multiplyScalar(s).add(new THREE.Vector3(-n.z, 0, n.x).multiplyScalar(side * .8)).normalize();                // out through the free wall, a little to the front and to the back
        const far = band.reduce((a, p) => p.clone().sub(c).dot(want) > a.clone().sub(c).dot(want) ? p : a, band[0]), end = far.clone().lerp(c, .2);
        const mid = from.clone().lerp(end, .5).addScaledVector(want, .006); out.push(tube([from, mid, end], .0008, 10));
        const twig = end.clone().add(new THREE.Vector3(0, h * .07, 0)).lerp(c, .08); out.push(tube([mid, mid.clone().lerp(twig, .6).addScaledVector(want, .003), twig], .0006, 6)); } });
    return out; };
  const Y = '#ffe14d';
  return [
    { name:'SA node', geometry:merged([blob(SA, .005, [1, 1.6, 1])]), colour:Y, anchor:SA.clone() },
    { name:'AV node', geometry:merged([blob(AV, .0052, [1.3, 1, 1])]), colour:Y, anchor:AV.clone() },
    { name:'Bundle of His', geometry:merged([tube([AV, AV.clone().lerp(H, .5), H], .0019, 8)]), colour:Y, anchor:AV.clone().lerp(H, .6) },
    { name:'Bundle branches', geometry:merged([tube(R, .0014, 20), tube(L, .0014, 20)]), colour:Y, anchor:R[2].clone() },
    { name:'Purkinje fibres', geometry:merged([...purk(RV, R[3], 1), ...purk(LV, L[3], -1)]), colour:Y, anchor:null },
    { name:'internodal', context:true, lines:[SA, SA.clone().lerp(AV, .5).add(new THREE.Vector3(0, .004, .006)), SA.clone().lerp(AV, .5).add(new THREE.Vector3(0, .004, .006)), AV] },
  ];
}
