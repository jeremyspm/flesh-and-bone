/* made-tissues.js — three of her labelled figures, BUILT from primitives and declared schematics on screen:
 *   · a synovial joint (her six blanks: articular cartilage · epiphyseal plate · synovial fluid · ligament · joint capsule · bone)
 *   · compact bone — osteons (her cloze: Haversian canal · lacunae · osteocytes · arteries · veins · canaliculi)
 *   · skeletal muscle, bundle within bundle (her cloze: sarcolemma · endomysium · fascicle · epimysium)
 * No 3D source models these (tissue-level figures are drawings in every textbook, hers included). Each part is its own
 * named mesh, so every mode runs unchanged. Nothing is lettered. The three stand side by side in one scene; each
 * question flies to its own figure. Scale is arbitrary; the relationships — what wraps what, what sits in what — are real. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z), P = (r, y) => new THREE.Vector2(r, y), RAD = Math.PI / 180;
const flat = g => g.index ? g.toNonIndexed() : g;
const arc = (cy, R, a0, a1, n = 14) => Array.from({ length:n + 1 }, (_, k) => { const a = (a0 + (a1 - a0) * k / n) * RAD; return P(R * Math.cos(a), cy + R * Math.sin(a)); });

export function buildTissues() {
  const parts = [];
  const put = (o, name, geoms, colour, extra = {}) => { const g = mergeGeometries(geoms.map(flat)); g.translate(o.x, o.y, o.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(o); parts.push({ name, geometry:g, colour, ...extra }); };
  const lathe = (pts, phi0 = 0, len = 360, seg = 56) => new THREE.LatheGeometry(pts, seg, phi0 * RAD, len * RAD);
  const cyl = (r, y0, y1, x = 0, z = 0, seg = 28) => { const g = new THREE.CylinderGeometry(r, r, y1 - y0, seg); g.translate(x, (y0 + y1) / 2, z); return g; };
  const ball = (c, r, s = [1, 1, 1], d = 2) => { const g = new THREE.IcosahedronGeometry(r, d); g.scale(s[0], s[1], s[2]); g.translate(c.x, c.y, c.z); return g; };

  /* ───────── 1 · synovial joint: a rounded head in a shallow socket, the capsule opened at the front ───────── */
  { const O = V(-.25, 1.14), HC = .025;                                                   // HC = height of the centre both joint surfaces curve around
    const upper = [P(0, .17), P(.020, .17), P(.020, .09), P(.0235, .075), P(.033, .052), P(.040, .036), ...arc(HC, .040, 0, -90), P(0, HC - .040)];
    const lower = [P(0, HC - .052), ...arc(HC, .052, -90, -35).slice(1), P(.0495, -.014), P(.050, -.045), P(.042, -.070), P(.030, -.092), P(.022, -.112), P(.022, -.19), P(0, -.19)];
    put(O, 'Bone', [lathe(upper), lathe(lower)], '#e7dcc6', { anchor:V(0, .13, .020) });
    const shell = (R0, R1, a0, a1) => lathe([...arc(HC, R1, a0, a1), ...arc(HC, R0, a1, a0)]);
    put(O, 'Articular cartilage', [shell(.0402, .0445, -8, -90), shell(.048, .052, -36, -90)], '#6fc3f7', { anchor:V(.030, HC - .0445 * Math.sin(47 * RAD), .030) });
    put(O, 'Epiphyseal plate', [cyl(.0315, .056, .0605), cyl(.0372, -.0855, -.081)], '#6fa8dc', { anchor:V(0, .058, .0315) });
    // the fluid: a film between the two cartilages + the recess out to the capsule, which is where a finger finds it
    const recess = [P(.0438, .018), P(.050, .040), P(.0555, .030), P(.0585, .004), P(.0545, -.028), P(.0505, -.016), P(.0435, -.006), P(.047, .004)];
    put(O, 'Synovial fluid', [lathe(recess), shell(.0447, .0478, -36, -90)], '#ffe48a', { glassy:.3, anchor:V(.040, .006, .040) });
    const smooth = pts => new THREE.SplineCurve(pts).getPoints(28);                          // six control points drew a faceted lantern
    const cap = smooth([P(.0245, .083), P(.045, .063), P(.0605, .036), P(.0635, .005), P(.0585, -.034), P(.041, -.074)]), inner = cap.map((p, k) => P(p.x - (k === 0 || k === cap.length - 1 ? .0006 : .0038), p.y));
    put(O, 'Joint capsule', [lathe(cap, 62, 236)], '#c9a67a', { anchor:V(.0635 * Math.sin(100 * RAD), .005, .0635 * Math.cos(100 * RAD)) });
    put(O, 'Synovial membrane', [lathe(inner, 62, 236)], '#f09aa8', { anchor:V(0, .005, -.0597) });
    const a = 80 * RAD, strap = [P(.0215, .125), P(.026, .095), ...cap.filter((_, k) => k % 4 === 0).map(p => P(p.x + .0045, p.y)), P(.034, -.095), P(.0245, -.125)].map(p => V(p.x * Math.sin(a), p.y, p.x * Math.cos(a)));
    put(O, 'Ligament', [new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strap), 40, .0062, 10, false)], '#f6f1e4', { anchor:strap[strap.length >> 1] });
  }

  /* ───────── 2 · compact bone: three osteons standing out of the block, each a telescope of lamellae round a central canal ───────── */
  { const O = V(0, 1.06), lam = [], canal = [], lac = [], cyt = [], can = [], art = [], vein = []; let aL = null, aC = null, aK = null;
    const osteon = (x, z, k, h0, big) => { const R = [.0335, .0265, .0195, .0125].map(r => r * k), top = R.map((_, n) => h0 + n * .016 * k);
      R.forEach((r, n) => lam.push(cyl(r, 0, top[n], x, z, 48)));
      const ct = top[3] + .0006; canal.push(cyl(.0078 * k, 0, ct, x, z, 24));
      if (big) { art.push(cyl(.0021 * k, ct - .012, ct + .030, x - .003 * k, z + .001)); vein.push(cyl(.0029 * k, ct - .012, ct + .024, x + .0032 * k, z - .0008)); }      // vessels drawn in the big osteon only: they also give the close-up its frame
      R.forEach((r, n) => { const rin = n < 3 ? R[n + 1] : .0078 * k, rm = (r + rin) / 2, y = top[n], count = Math.round(rm / .0042 / (big ? 1.25 : 1));      // lacunae sit on each lamella's step, osteocyte inside, canaliculi radiating
        for (let m = 0; m < count; m++) { const t = (m + (n % 2) * .5) / count * Math.PI * 2, c = V(x + Math.cos(t) * rm, y + .0004, z + Math.sin(t) * rm), s = big ? 1.35 : 1;
          const e = ball(V(0, 0, 0), .0026 * s, [1.55, .55, .8], 1); e.rotateY(-t + Math.PI / 2); e.translate(c.x, c.y, c.z); lac.push(e);
          const o = ball(V(0, 0, 0), .00135 * s, [1.5, .9, .85], 1); o.rotateY(-t + Math.PI / 2); o.translate(c.x, c.y + .0006, c.z); cyt.push(o);
          if (big && n === 1 && m === 1) { aL = V(c.x + .0035, c.y, c.z); aC = V(c.x, c.y + .001, c.z); }
          for (const [dr, dt] of [[1, 0], [-1, 0], [.8, .5], [-.8, -.5], [.8, -.5], [-.8, .5]]) { const len = (r - rin) * .42, h = new THREE.CylinderGeometry(.00028 * s, .00028 * s, len, 5); h.rotateZ(Math.PI / 2); h.translate(len / 2 + .002 * s, 0, 0); h.rotateY(-(t + dt) + (dr < 0 ? Math.PI : 0)); h.translate(c.x, y + .0003, c.z); can.push(h);
            if (big && n === 1 && m === 1 && dr === 1 && !dt) aK = V(c.x + Math.cos(t) * (len * .7 + .002), y + .0006, c.z + Math.sin(t) * (len * .7 + .002)); } } });
      return top; };
    const block = new THREE.BoxGeometry(.19, .05, .12); block.translate(0, -.0249, 0);
    const t0 = osteon(0, .012, 1.3, .022, true); osteon(-.062, -.018, .95, .014, false); osteon(.064, -.014, 1, .017, false);
    put(O, 'Compact bone', [block], '#e2d6bd');
    put(O, 'Lamellae', lam, '#eadfc8', { anchor:V(.0335 * 1.3, .018, .012) });
    put(O, 'Central canal', canal, '#3b2a22', { anchor:V(0, t0[3] + .001, .012 + .0085) });
    put(O, 'Lacunae', lac, '#2f2622', { glassy:.62, anchor:aL });
    put(O, 'Osteocytes', cyt, '#a66bd6', { anchor:aC });
    put(O, 'Canaliculi', can, '#4a3a30', { anchor:aK });
    put(O, 'Artery', art, '#e2504c', { anchor:V(-.0039, t0[3] + .028, .013) });
    put(O, 'Vein', vein, '#4f7fe0', { anchor:V(.0042, t0[3] + .022, .0112) });
  }

  /* ───────── 3 · skeletal muscle: muscle ⊃ fascicles ⊃ fibres ⊃ myofibrils, each level pulled out of the one before ───────── */
  { const O = V(.25, .97), hex = r => [[0, 0], ...Array.from({ length:6 }, (_, k) => [Math.cos(k * 60 * RAD) * r, Math.sin(k * 60 * RAD) * r])];
    const epi = [cyl(.0535, 0, .1005, 0, 0, 56)], fas = [], peri = [], fib = [], endo = [], FX = .0, FZ = 0;
    hex(.0335).forEach(([x, z], k) => { if (!k) return; peri.push(cyl(.0163, 0, .1015, x, z)); fas.push(cyl(.0148, 0, .1025, x, z)); });
    peri.push(cyl(.0163, 0, .19, FX, FZ)); fas.push(cyl(.0148, .186, .1905, FX, FZ));                       // the middle fascicle, pulled out
    hex(.0096).forEach(([x, z], k) => { if (!k) return; endo.push(cyl(.0047, .186, .1915, FX + x, FZ + z, 18)); fib.push(cyl(.0039, .186, .1925, FX + x, FZ + z, 18)); });
    endo.push(cyl(.0047, .186, .226, FX, FZ, 18));                                                          // the middle fibre, pulled out: endomysium, then its own membrane, then what is inside it
    const myo = hex(.0024).map(([x, z]) => cyl(.00105, .186, .292, FX + x, FZ + z, 10));
    fib.push(cyl(.00385, .262, .2626, FX, FZ, 18));
    put(O, 'Epimysium', epi, '#efe3cb', { anchor:V(.0535 * Math.sin(35 * RAD), .05, .0535 * Math.cos(35 * RAD)) });
    put(O, 'Perimysium', peri, '#e0a890', { anchor:V(.0163 * Math.sin(35 * RAD), .15, .0163 * Math.cos(35 * RAD)) });
    put(O, 'Fascicle', fas, '#b5483f', { anchor:V(.0335, .1025, 0) });
    put(O, 'Endomysium', endo, '#f6d2c4', { anchor:V(0, .21, .0047) });
    put(O, 'Muscle fibre', fib, '#c45a4f', { anchor:V(.0096, .1925, 0) });
    put(O, 'Sarcolemma', [cyl(.0040, .186, .262, FX, FZ, 18)], '#d9776a', { anchor:V(0, .245, .0040) });
    put(O, 'Myofibrils', myo, '#8a2c28', { anchor:V(0, .285, .0034) });
  }
  return parts;
}
