/* made.js — structures the 3D source does not have, BUILT here and declared as schematics on screen.
 *
 * Meninges: Z-Anatomy models the dura's folds (falx, tentorium) and the dural sinuses, but not the three layers.
 * They are concentric shells, so they are generated from the brain itself: the outer envelope of the cerebrum is
 * measured (max vertex radius per 2° of direction, from the cerebrum's centre), smoothed, and four slabs are
 * stacked on it — pia · subarachnoid space (CSF) · arachnoid · dura — each cut back further than the one below,
 * so the corner reads as a staircase: the textbook "peeled layers" figure. Thicknesses are exaggerated (the real
 * stack is ~4 mm); the app says "schematic" wherever these are asked.
 * The superior sagittal sinus is a REAL mesh, but in the source it lies level with the gyral crowns (the model gives the
 * skull and dura no thickness, so there is no room under it). It is moved straight outward — every vertex along its own
 * radius, by the same few millimetres — until its floor rests on the schematic arachnoid: inside the dura, above the
 * arachnoid, which is the relationship she asks. The arachnoid villi are then placed under it, where the dura is cut away. */

const DEG = Math.PI / 180;
const A0 = -58, A1 = 32, B0 = -42, B1 = 40, STEP = 2;          // the patch, in degrees: a = back(−)…front(+) over the top, b = right(−)…left(+)
/* t0..t1 = height above the brain's envelope (m) · aMax/bMax = where this layer's front / left edge is cut */
export const MENINGES = [
  { name:'Pia mater',          t0:.0003, t1:.0015, aMax:32,  bMax:40, colour:'#ff8fa3' },
  { name:'Subarachnoid space', t0:.0015, t1:.0052, aMax:20,  bMax:30, colour:'#58b5ff', glassy:.6 },
  { name:'Arachnoid mater',    t0:.0052, t1:.0066, aMax:8,   bMax:20, colour:'#e9eef2' },      // cool white, NOT lilac: the brain deck's glow is lilac and the layer below must not look 'lit'
  { name:'Dura mater',         t0:.0066, t1:.0114, aMax:-8,  bMax:9,  colour:'#b9ad9a' },      // thick enough to hold the sinus between its two layers
];

export function buildMeninges(THREE, cortex, sinus) {
  const box = new THREE.Box3(); cortex.forEach(i => box.union(i.box));
  const c = box.getCenter(new THREE.Vector3()), v = new THREE.Vector3();
  const na = Math.round((A1 - A0) / STEP) + 1, nb = Math.round((B1 - B0) / STEP) + 1, at = (i, j) => i * nb + j;
  let R = new Float32Array(na * nb);

  // 1 · the envelope: the farthest cortex vertex in each direction
  const angles = p => { const d = v.copy(p).sub(c), r = d.length(); return { r, a:Math.atan2(d.z, d.y) / DEG, b:Math.asin(d.x / r) / DEG }; };
  for (const info of cortex) { const pos = info.mesh.geometry.attributes.position; info.mesh.updateMatrixWorld(true);
    for (let k = 0; k < pos.count; k++) { v.set(pos.getX(k), pos.getY(k), pos.getZ(k)).applyMatrix4(info.mesh.matrixWorld); const q = angles(v);
      const i = Math.round((q.a - A0) / STEP), j = Math.round((q.b - B0) / STEP); if (i < 0 || j < 0 || i >= na || j >= nb) continue;
      if (q.r > R[at(i, j)]) R[at(i, j)] = q.r; } }
  const pass = fn => { const out = new Float32Array(R.length); for (let i = 0; i < na; i++) for (let j = 0; j < nb; j++) { const n = [];
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const x = i + di, y = j + dj; if (x >= 0 && y >= 0 && x < na && y < nb && R[at(x, y)] > 0) n.push(R[at(x, y)]); }
      out[at(i, j)] = n.length ? fn(n, R[at(i, j)]) : 0; } R = out; };
  for (let k = 0; k < 4; k++) pass((n, self) => self > 0 ? self : Math.max(...n));      // directions no vertex fell in
  pass(n => Math.max(...n));                                                          // bridge the sulci and the longitudinal fissure
  pass(n => n.reduce((s, x) => s + x, 0) / n.length); pass(n => n.reduce((s, x) => s + x, 0) / n.length);

  const dir = (a, b) => new THREE.Vector3(Math.sin(b * DEG), Math.cos(b * DEG) * Math.cos(a * DEG), Math.cos(b * DEG) * Math.sin(a * DEG));
  const pt = (i, j, t) => dir(A0 + i * STEP, B0 + j * STEP).multiplyScalar(R[at(i, j)] + t).add(c);

  // 2 · the real sinus: measure how far its floor is above the envelope, then move it out so that floor rests on the arachnoid
  const arachTop = MENINGES[2].t1, k = 1, sv = []; let floor = Infinity, lift = 0;
  if (sinus) { const pos = sinus.mesh.geometry.attributes.position, M = sinus.mesh.matrixWorld, Mi = M.clone().invert(); sinus.mesh.updateMatrixWorld(true);
    const scan = fn => { for (let n = 0; n < pos.count; n++) { v.set(pos.getX(n), pos.getY(n), pos.getZ(n)).applyMatrix4(M); fn(n); } };
    scan(() => { const q = angles(v), i = Math.round((q.a - A0) / STEP), j = Math.round((q.b - B0) / STEP); if (i >= 0 && j >= 0 && i < na && j < nb && q.a > -30 && q.a < 12) floor = Math.min(floor, q.r - R[at(i, j)]); });
    if (Number.isFinite(floor)) { lift = Math.max(0, arachTop + .0005 - floor);
      scan(n => { const d = v.clone().sub(c), r = d.length(); v.copy(c).addScaledVector(d, (r + lift) / r).applyMatrix4(Mi); pos.setXYZ(n, v.x, v.y, v.z); });
      pos.needsUpdate = true; sinus.mesh.geometry.computeBoundingBox(); sinus.mesh.geometry.computeBoundingSphere(); sinus.box.setFromObject(sinus.mesh); }
    scan(() => { const q = angles(v), i = Math.round((q.a - A0) / STEP), j = Math.round((q.b - B0) / STEP); if (i >= 0 && j >= 0 && i < na && j < nb) sv.push({ a:q.a, x:v.x, lift:q.r - R[at(i, j)] }); }); }

  // 3 · the slabs
  const out = [];
  for (const L of MENINGES) { const P = [], N = [], t0 = L.t0 * k, t1 = L.t1 * k;
    const inL = (i, j) => i >= 0 && j >= 0 && i < na - 1 && j < nb - 1 && A0 + (i + .5) * STEP <= L.aMax && B0 + (j + .5) * STEP <= L.bMax;
    const tri = (p, q, r, n) => { for (const x of [p, q, r]) P.push(x.x, x.y, x.z); if (!n) n = new THREE.Vector3().crossVectors(q.clone().sub(p), r.clone().sub(p)).normalize(); for (let m = 0; m < 3; m++) N.push(n.x, n.y, n.z); };
    const quad = (p, q, r, s, n) => { tri(p, q, r, n); tri(p, r, s, n); };
    for (let i = 0; i < na - 1; i++) for (let j = 0; j < nb - 1; j++) { if (!inL(i, j)) continue;
      const n = dir(A0 + (i + .5) * STEP, B0 + (j + .5) * STEP);
      quad(pt(i, j, t1), pt(i + 1, j, t1), pt(i + 1, j + 1, t1), pt(i, j + 1, t1), n);                               // top
      quad(pt(i, j, t0), pt(i, j + 1, t0), pt(i + 1, j + 1, t0), pt(i + 1, j, t0), n.clone().negate());             // underside
      for (const [di, dj, e] of [[1, 0, [[i + 1, j], [i + 1, j + 1]]], [-1, 0, [[i, j + 1], [i, j]]], [0, 1, [[i + 1, j + 1], [i, j + 1]]], [0, -1, [[i, j], [i + 1, j]]]])
        if (!inL(i + di, j + dj)) quad(pt(e[0][0], e[0][1], t0), pt(e[1][0], e[1][1], t0), pt(e[1][0], e[1][1], t1), pt(e[0][0], e[0][1], t1));   // a cut edge: the wall that shows the layer's thickness
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    const up = MENINGES[MENINGES.indexOf(L) + 1];                                          // where a label can point: the middle of the band the layer above leaves bare
    const aa = up ? (up.aMax + L.aMax) / 2 : -30, ab = up ? 12 : -12, ai = Math.round((aa - A0) / STEP), aj = Math.round((ab - B0) / STEP);
    out.push({ name:L.name, geometry:g, colour:L.colour, glassy:L.glassy || 0, anchor:pt(ai, aj, t1) });
  }

  // 4 · arachnoid granulations: tufts of arachnoid pushing up into the sinus, where the dura is cut away and the arachnoid shows
  if (sv.length) { const P = [], N = [], rg = .0027, a0 = MENINGES[3].aMax + 2.2, a1 = MENINGES[2].aMax - 2.2, n = 6;
    const ball = new THREE.IcosahedronGeometry(rg, 2).toNonIndexed(), stalkR = .0009;
    for (let m = 0; m < n; m++) { const a = a0 + (a1 - a0) * m / (n - 1), near = sv.filter(s => Math.abs(s.a - a) < 2.5); if (!near.length) continue;
      const x = near.reduce((s, q) => s + q.x, 0) / near.length + (m % 2 ? .0022 : -.0022), lift = Math.min(...near.map(q => q.lift));
      const i = (a - A0) / STEP, r0 = R[at(Math.round(i), Math.round(-B0 / STEP))] || .08;                       // the envelope's radius on the midline here
      const b = Math.asin(clamp((x - c.x) / r0, -1, 1)) / DEG, j = (b - B0) / STEP, base = R[at(Math.round(i), Math.round(j))];
      const d = dir(a, b), top = Math.max(arachTop * k + rg * .75, lift + rg * .35), centre = d.clone().multiplyScalar(base + top).add(c);
      const bp = ball.attributes.position, bn = ball.attributes.normal;
      for (let q = 0; q < bp.count; q++) { P.push(bp.getX(q) + centre.x, bp.getY(q) + centre.y, bp.getZ(q) + centre.z); N.push(bn.getX(q), bn.getY(q), bn.getZ(q)); }
      const stalk = new THREE.CylinderGeometry(stalkR, stalkR * 1.6, top - arachTop * k + .0006, 8).toNonIndexed(), sp = stalk.attributes.position, sn = stalk.attributes.normal;
      const rot = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d), mid = d.clone().multiplyScalar(base + (top + arachTop * k) / 2).add(c);
      for (let q = 0; q < sp.count; q++) { v.set(sp.getX(q), sp.getY(q), sp.getZ(q)).applyQuaternion(rot).add(mid); P.push(v.x, v.y, v.z); v.set(sn.getX(q), sn.getY(q), sn.getZ(q)).applyQuaternion(rot); N.push(v.x, v.y, v.z); } }
    if (P.length) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
      out.push({ name:'Arachnoid villi', geometry:g, colour:'#fff3c4', glassy:0 }); } }
  return { parts:out, sinusFloor:floor, sinusLift:lift };
}
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
