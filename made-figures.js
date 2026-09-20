/* made-figures.js — the label-the-figure questions of her banks that are about LAYERS or GRAPHS, which no whole-organ model can
 * show (you cannot see a tunic, a layer of the uterus wall or a P wave on an organ). All BUILT, all declared schematics:
 *   buildVessels()    artery · vein (with a valve) · capillary, walls pulled apart into the three tunics   — her 7-point M1 match
 *   buildHeartWall()  fibrous + parietal pericardium · pericardial cavity · epicardium · myocardium · endocardium — her M1 cloze keys
 *   buildUterusWall() perimetrium · myometrium · endometrium (basal + functional layer, with their arteries)   — her M3 slide 2, DRAWN AS HER FIGURE DRAWS IT:
 *                     side-on, outside of the uterus on the LEFT and the cavity on the RIGHT, the arteries in red (uterine → arcuate → radial → straight → spiral)
 *   buildECG()        P · PR segment · Q · R · S · ST segment · T                                             — her ECG label + two matches
 *   buildSpirogram()  the breathing trace with the four volumes and four capacities as bars                   — her lung-volume keys
 * Nothing is lettered; nothing is to scale. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z), P = (r, y) => new THREE.Vector2(r, y);
const flat = g => g.index ? g.toNonIndexed() : g;
const maker = O => { const parts = []; return { parts, add(name, geoms, colour, extra = {}) { const g = mergeGeometries(geoms.map(flat)); g.translate(O.x, O.y, O.z); if (extra.anchor) extra.anchor = extra.anchor.clone().add(O); parts.push({ name, geometry:g, colour, ...extra }); }, lines(name, pts) { parts.push({ name, context:true, lines:pts.map(p => p.clone().add(O)) }); } }; };
const box = (w, h, d, x, y, z = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
const cyl = (r, y0, y1, x = 0, z = 0, seg = 28) => { const g = new THREE.CylinderGeometry(r, r, y1 - y0, seg); g.translate(x, (y0 + y1) / 2, z); return g; };
const ringWall = (r0, r1, y0, y1, x = 0, z = 0) => { const g = new THREE.LatheGeometry([P(r0, y0), P(r1, y0), P(r1, y1), P(r0, y1), P(r0, y0)], 40); g.translate(x, 0, z); return g; };
const tube = (pts, r, seg = 24, rs = 8) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, rs, false);

/* a stack of layers, top = outermost. Every lower layer is wider, so each one's top shows as a step as well as a stripe on the front */
function stack(O, layers, W = .17, D = .07) { const M = maker(O), n = layers.length; let y = 0;
  layers.forEach((L, k) => { const w = W * (.5 + .5 * k / (n - 1)), g = [box(w, L.h, D, w / 2, y - L.h / 2)]; (L.deco || []).forEach(d => g.push(d(y - L.h, L.h, w, D)));
    M.add(L.name, g, L.colour, { glassy:L.glassy || 0, anchor:V(w - W * .22 / (n - 1) - .004, y, D * .3) }); y -= L.h; });
  return M.parts; }

export function buildHeartWall() { return stack(V(.05, .66), [
  { name:'Fibrous pericardium', h:.007, colour:'#d9cfbf' }, { name:'Parietal pericardium', h:.005, colour:'#f3b9a6' }, { name:'Pericardial cavity', h:.006, colour:'#9fdcff', glassy:.45 },
  { name:'Epicardium', h:.006, colour:'#ffd27a' }, { name:'Myocardium', h:.034, colour:'#b5483f' }, { name:'Endocardium', h:.005, colour:'#f6e3d2' } ]); }

export function buildUterusWall() { const M = maker(V(.19, .9)), D = .03, Z = D / 2 + .0022, H = x => .065 - .02 * x / .11, YS = [-.62, 0, .62];
  /* a wedge of wall seen from the side, as her slide draws it: taller on the outside (left), shorter at the cavity (right) */
  const slab = (x0, x1) => { const s = new THREE.Shape([new THREE.Vector2(x0, -H(x0)), new THREE.Vector2(x1, -H(x1)), new THREE.Vector2(x1, H(x1)), new THREE.Vector2(x0, H(x0))]), g = new THREE.ExtrudeGeometry(s, { depth:D, bevelEnabled:false }); g.translate(0, 0, -D / 2); return g; };
  const lift = g => (g.translate(0, 0, Z), g);
  M.add('Perimetrium', [slab(0, .006)], '#f3e3c4', { anchor:V(.003, .03, D / 2) });
  M.add('Myometrium', [slab(.006, .07)], '#eeb093', { anchor:V(.05, .044, D / 2) });
  M.add('Basal layer', [slab(.07, .084)], '#d3bd62', { anchor:V(.077, .04, D / 2) });
  M.add('Functional layer', [slab(.084, .11)], '#f1e4a0', { anchor:V(.098, .036, D / 2) });
  M.add('Uterine artery', [lift(tube([V(-.03, .075), V(-.022, .05), V(-.027, .02), V(-.023, -.015), V(-.026, -.05), V(-.02, -.078)], .0024, 48))], '#e0342f', { anchor:V(-.025, .035, Z + .0024) });
  M.add('Arcuate artery', [tube([V(.024, .058), V(.019, .03), V(.023, 0), V(.019, -.03), V(.024, -.057)], .0019, 40), ...[.04, -.002, -.043].map(y => tube([V(-.024, y + .004), V(-.002, y), V(.02, y + .002)], .0014, 12))].map(lift), '#e0342f', { anchor:V(.021, .015, Z + .0019) });
  M.add('Radial arteries', YS.map(k => lift(tube([V(.021, k * H(.02) * .78), V(.045, k * H(.045) * .8 + .003), V(.07, k * H(.07) * .8)], .0015, 16))), '#e0342f', { anchor:V(.045, .003, Z + .0015) });
  M.add('Straight arteries', YS.flatMap(k => { const y = k * H(.07) * .8; return [tube([V(.07, y), V(.077, y + .006), V(.083, y + .0075)], .0011, 10), tube([V(.07, y), V(.077, y - .006), V(.083, y - .0075)], .0011, 10)].map(lift); }), '#e0342f', { anchor:V(.077, .006, Z + .0011) });
  M.add('Spiral arteries', YS.map(k => { const y = k * H(.07) * .8; return lift(tube(Array.from({ length:41 }, (_, t) => V(.07 + .038 * t / 40, y + Math.sin(t * .75) * .0042 * Math.max(0, Math.min(1, (t - 14) / 5)), Math.cos(t * .75) * .0016 * Math.max(0, Math.min(1, (t - 14) / 5)))), .0012, 96, 6)); }), '#e0342f', { anchor:V(.096, .0042, Z + .0012) });
  return M.parts; }

export function buildVessels() { const M = maker(V(-.16, .56)), T = { e:'#e8dcc0', m:'#d9776a', i:'#f6d2c4' };
  // artery: thick muscular media, small round lumen
  M.add('Tunica externa of artery', [ringWall(.0205, .0245, 0, .07, -.05)], T.e, { anchor:V(-.05, .04, .0245) });
  M.add('Tunica media of artery', [ringWall(.0115, .0205, 0, .105, -.05)], T.m, { anchor:V(-.05, .09, .0205) });
  M.add('Tunica interna of artery', [ringWall(.0092, .0115, 0, .135, -.05)], T.i, { anchor:V(-.05, .125, .0115) });
  M.add('Blood in the artery', [cyl(.0091, 0, .1355, -.05)], '#c62f2b');
  // vein: thin media, wide lumen, and a valve
  M.add('Tunica externa of vein', [ringWall(.0225, .0255, 0, .07, .05)], T.e, { anchor:V(.05, .04, .0255) });
  M.add('Tunica media of vein', [ringWall(.0195, .0225, 0, .105, .05)], T.m, { anchor:V(.05, .09, .0225) });
  M.add('Tunica interna of vein', [ringWall(.0178, .0195, 0, .135, .05)], T.i, { anchor:V(.05, .125, .0195) });
  M.add('Blood in the vein', [cyl(.0177, 0, .1335, .05)], '#3f63c4');
  const cusp = s => { const g = new THREE.SphereGeometry(.0172, 20, 12, 0, Math.PI, 0, Math.PI / 2); g.scale(1, 1.1, .55); g.rotateZ(Math.PI); g.rotateY(s > 0 ? 0 : Math.PI); g.translate(.05, .156, s * .0035); return g; };
  M.add('Valve', [cusp(1), cusp(-1)], '#fff3d6', { anchor:V(.05, .158, .01) });
  // capillary bed: one cell thick, joining the two
  const cap = [tube([V(-.05, 0), V(-.045, -.03), V(-.015, -.055), V(.015, -.055), V(.045, -.03), V(.05, 0)], .0032, 40)];
  [[-.03, .03], [-.012, .012], [.01, -.01]].forEach(([a, b]) => cap.push(tube([V(a, -.047), V((a + b) / 2, -.075), V(b, -.05)], .0022, 16)));
  M.add('Capillary', cap, '#c77bd0', { anchor:V(0, -.0555, .0032) });
  return M.parts; }

export function buildECG() { const M = maker(V(.24, 1.24)), r = .0042, seg = (name, f, x0, x1, colour, extra) => { const pts = Array.from({ length:17 }, (_, k) => { const x = x0 + (x1 - x0) * k / 16; return V(x, f((x - x0) / (x1 - x0)), 0); }); M.add(name, [tube(pts, r, 32)], colour, { anchor:pts[8].clone().add(V(0, 0, r)), ...extra }); };
  const bump = h => t => Math.sin(t * Math.PI) * h, flatline = () => 0, tri = h => t => (t < .5 ? t * 2 : 2 - t * 2) * h, C = '#7dff9c';
  seg('Baseline (before)', flatline, 0, .04, '#3f7d50'); seg('P wave', bump(.02), .04, .095, C); seg('PR segment', flatline, .095, .13, C);
  seg('Q wave', tri(-.013), .13, .142, C); seg('R wave', tri(.095), .142, .166, C); seg('S wave', tri(-.024), .166, .182, C);
  seg('ST segment', flatline, .182, .222, C); seg('T wave', bump(.032), .222, .295, C); seg('Baseline (after)', flatline, .295, .35, '#3f7d50');
  const grid = []; for (let x = 0; x <= .3501; x += .025) grid.push(V(x, -.04, -.004), V(x, .11, -.004)); for (let y = -.04; y <= .1101; y += .025) grid.push(V(0, y, -.004), V(.35, y, -.004));
  M.lines('ecg paper', grid); return M.parts; }

export function buildSpirogram() { const M = maker(V(.27, 1.12)), S = .03, L = { rv:1.2, frc:2.4, tv:2.9, tlc:6.0 }, y = l => l * S;
  /* quiet breathing (tidal volume, on top of the FRC) · one maximal breath in (to total lung capacity) · one maximal breath out (down to residual volume) · quiet breathing again */
  const ease = u => Math.sin(Math.PI / 2 * u) ** 2, tidal = ph => (L.frc + L.tv) / 2 - Math.cos(ph * Math.PI * 2) * (L.tv - L.frc) / 2;
  const level = t => t < .4 ? tidal(t / .4 * 3) : t < .55 ? L.frc + (L.tlc - L.frc) * ease((t - .4) / .15) : t < .75 ? L.tlc - (L.tlc - L.rv) * ease((t - .55) / .2) : t < .82 ? L.rv + (L.frc - L.rv) * ease((t - .75) / .07) : tidal((t - .82) / .18 * 1.5);
  const pts = []; for (let k = 0; k <= 160; k++) pts.push(V(k / 160 * .2, y(level(k / 160)), 0));
  M.add('Breathing trace', [tube(pts, .0026, 300, 6)], '#eaf2ff');
  const bar = (name, l0, l1, col, colour, extra = {}) => M.add(name, [box(.024, y(l1) - y(l0) - .0016, .014, .225 + col * .032, (y(l0) + y(l1)) / 2)], colour, { anchor:V(.225 + col * .032, (y(l0) + y(l1)) / 2, .007), ...extra });
  bar('Inspiratory reserve volume', L.tv, L.tlc, 0, '#7cc4f2'); bar('Tidal volume', L.frc, L.tv, 0, '#ffe14d'); bar('Expiratory reserve volume', L.rv, L.frc, 0, '#9be38a'); bar('Residual volume', 0, L.rv, 0, '#ff9466');
  bar('Inspiratory capacity', L.frc, L.tlc, 1, '#b9a2ff'); bar('Functional residual capacity', 0, L.frc, 1, '#ffb38a'); bar('Vital capacity', L.rv, L.tlc, 2, '#5fd4c0'); bar('Total lung capacity', 0, L.tlc, 3, '#f3f4f8');
  const lv = []; for (const l of [0, L.rv, L.frc, L.tv, L.tlc]) lv.push(V(0, y(l), -.003), V(.34, y(l), -.003)); M.lines('levels', lv); return M.parts; }
