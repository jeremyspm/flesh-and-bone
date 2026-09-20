/* Flesh & Bone — 3D bone and muscle trainer.
 * One real body (Z-Anatomy meshes), three modes: Find it · Name it · Explore.
 * No build step. State lives in localStorage under `fab.v1`. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BONES, MUSCLES, HIDE, REGIONS as REGIONS0, SETS as SETS0, NEUTRAL, CLIP } from './data.js';
import { GLANDS, BRAIN, NERVES, WILLIS, NEURON, TISSUES, HEART, AIRWAY, SENSES, REPRO, LEVERS, PLACE, MORE_REGIONS, MORE_SETS, TRACES } from './data-more.js';
import { buildMeninges } from './made.js';
import { buildNeuron } from './made-neuron.js';
import { buildTissues } from './made-tissues.js';
import { buildGlia } from './made-glia.js';
import { buildConduction } from './made-heart.js';
import { buildEye } from './made-eye.js';
import { buildEar } from './made-ear.js';
const REGIONS = { ...REGIONS0, ...MORE_REGIONS }, SETS = { ...SETS0, ...MORE_SETS };

const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const hash01 = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10007) / 10007; };
const DEG = Math.PI / 180;
const DEBUG = /[?&]debug/.test(location.search);

/* ───────────── persistent state ───────────── */
const KEY = 'fab.v1';
const S = (() => {
  const d = { m:{}, best:{}, n:0, o:{ deck:'bones', mode:'find', set:{ bones:'her', muscles:'her' }, len:10, ask:'mix', sound:true } };
  try { const j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j) { Object.assign(d, j); d.o = Object.assign({ deck:'bones', mode:'find', len:10, ask:'mix', sound:true }, j.o); d.o.set = Object.assign({ bones:'her', muscles:'her' }, j.o && j.o.set); } } catch {}
  d.o.trace = d.o.trace || {};
  return d;
})();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
const mast = id => S.m[id] || (S.m[id] = { b:0, s:0, r:0, w:0, t:0 });
const LOCK = 2;

/* a deck = which models are on stage (solid, or a ghost for context) and which of them its items are bound to */
const DECK = {
  bones:  { label:'Bones',   acc:'#f2b84b', ink:'#1b1303', items:BONES,   models:{ skeletal:'solid' }, bind:['skeletal'], noun:'bone' },
  muscles:{ label:'Muscles', acc:'#ff7d68', ink:'#220804', items:MUSCLES, models:{ skeletal:'solid', muscular:'solid' }, bind:['muscular'], noun:'muscle' },
  /* her three body levers on the real skeleton: only the muscles that ARE the effort stay on stage */
  levers: { label:'Levers',  acc:'#c4f07a', ink:'#162403', items:LEVERS,  models:{ skeletal:'solid', muscular:'solid' }, bind:['skeletal', 'muscular'], noun:'part', view:[70, 4], frame:{ pad:1.3, min:.22 },
    only:{ muscular:[/head of gastrocnemius$/, 'soleus muscle', 'calcaneal tendon', /head of biceps brachii$/, 'brachialis muscle', 'sternocleidomastoid muscle', 'descending part of trapezius muscle', 'splenius capitis muscle'] } },
  glands: { label:'Glands',  acc:'#5fd4c0', ink:'#03211c', items:GLANDS,  models:{ skeletal:'ghost', glands:'solid', ovary:'solid' }, bind:['glands', 'ovary'], noun:'gland' },
  brain:  { label:'Brain',   acc:'#b9a2ff', ink:'#140b2e', items:BRAIN,   models:{ brain:'solid' }, bind:['brain'], noun:'part of the brain', home:'brain', frame:{ pad:1.3, min:.13 } },      // a 34 cm frame (right for a body) left the brain 75 px wide on a phone
  nerves: { label:'Nerves',  acc:'#ffd95e', ink:'#231a02', items:NERVES,  models:{ skeletal:'ghost', nerves:'solid' }, bind:['nerves'], noun:'nerve' },
  willis: { label:'Circle of Willis', acc:'#7fe3ff', ink:'#03222b', items:WILLIS, models:{ brain:'ghost', willis:'solid' }, bind:['willis'], noun:'artery', home:'brain', view:[12, -52], frame:{ pad:1.45, min:.08 } },   // under a ghost brain, seen from below: it is on the VENTRAL side. The accent is ice blue because a red glow on a red artery cannot be seen
  neuron: { label:'Neuron',  acc:'#ff8fd6', ink:'#2b0620', items:NEURON,  models:{ neuron:'solid', glia:'solid' }, bind:['neuron', 'glia'], noun:'part', home:'neuron', view:[0, 4], frame:{ pad:1.5, min:.09 }, schematic:'schematic · not to scale' },   // BUILT, not loaded: made-neuron.js
  tissues:{ label:'Tissues', acc:'#9be38a', ink:'#0c2407', items:TISSUES, models:{ tissues:'solid' }, bind:['tissues'], noun:'part', home:'tissues', view:[0, 12], frame:{ pad:1.5, min:.06 }, schematic:'schematic · not to scale' },   // three of her figures, built: made-tissues.js
  heart:  { label:'Heart',   acc:'#fff0b3', ink:'#2a2205', items:HEART,   models:{ heart:'solid' }, bind:['heart'], noun:'structure', home:'heart', view:[15, 4], frame:{ pad:1.45, min:.09 }, extra:'Conduction system' },   // Module 1. Chambers turn to glass when what is asked is inside them
  airway: { label:'Airway',  acc:'#a9c4ff', ink:'#0a1230', items:AIRWAY,  models:{ skeletal:'ghost', airway:'solid' }, bind:['airway'], noun:'structure', openLabel:'Glass lungs', home:'airway', view:[15, 4], frame:{ pad:1.4, min:.1 } },   // Module 1. The lobes turn to glass when a bronchus is asked
  senses: { label:'Eye & Ear', acc:'#ffc46b', ink:'#2a1a02', items:SENSES,  models:{ eye:'solid', ear:'solid' }, bind:['eye', 'ear'], noun:'part', home:'eye', view:[38, 22], frame:{ pad:1.35, min:.05 }, schematic:'schematic · not to scale' },   // Module 3. Both BUILT: made-eye.js, made-ear.js
  repro:  { label:'Reproductive', acc:'#ff9ecb', ink:'#2b0618', items:REPRO, models:{ skeletal:'ghost', female:'solid', male:'solid' }, bind:['female', 'male'], sex:{ female:'female', male:'male' }, noun:'structure', home:'rpFemale', view:[0, 10], frame:{ pad:1.5, min:.08 } },   // Module 3. Two bodies share one pelvis: only one is on stage at a time
};
const ITEM = {};
for (const d of Object.keys(DECK)) for (const it of DECK[d].items) { it.deck = d; ITEM[it.id] = it; }

/* ───────────── scene ───────────── */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.02, 40);
camera.position.set(0.9, 1.1, 4.2);
scene.add(camera);
scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x2b221c, 0.95));
const key = new THREE.DirectionalLight(0xfff1de, 2.3); key.position.set(1.4, 1.8, 2.2); camera.add(key); camera.add(key.target); key.target.position.set(0, 0, -3);
const fill = new THREE.DirectionalLight(0x9db8ff, 0.7); fill.position.set(-2, 0.4, 1); camera.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 1.1); rim.position.set(0, 1.2, -3); camera.add(rim);

// soft contact shadow under the feet
{ const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 8, 128, 128, 128); gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(cv), transparent:true, depthWrite:false }));
  fl.rotation.x = -Math.PI / 2; fl.position.y = 0.001; fl.renderOrder = -1; scene.add(fl); }

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.09;
controls.minDistance = 0.12; controls.maxDistance = 16;      // a phone's home sheet leaves ~250px of stage: the whole body needs ~11 m
controls.zoomSpeed = 0.9; controls.rotateSpeed = 0.85; controls.panSpeed = 0.8;      // (these three sat behind the comment above, switched off, from v1 until 21 Sep)
controls.touches = { ONE:THREE.TOUCH.ROTATE, TWO:THREE.TOUCH.DOLLY_PAN };
controls.target.set(0, 0.9, 0);
controls.autoRotateSpeed = 0.9;

let dirty = true;
const invalidate = () => { dirty = true; };
controls.addEventListener('change', invalidate);
controls.addEventListener('start', () => { cancelTween('cam'); controls.autoRotate = false; });

function resize() {
  const w = innerWidth, h = innerHeight;
  if (!(w > 0 && h > 0)) return;           // a tab opened in the background is 0×0: framing it would write NaN into the camera for good
  resize.w = w; resize.h = h;
  renderer.setSize(w, h, false);          // CSS sizes the canvas (100%); three must not fight it at dpr 2
  camera.aspect = w / h; camera.updateProjectionMatrix(); invalidate();
}
addEventListener('resize', () => { resize(); clearTimeout(resize.t); resize.t = setTimeout(() => G.reframe && G.reframe(), 180); });

/* ───────────── tweens ───────────── */
const tweens = [];
const easeIO = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
function tween(dur, fn, tag, done) { cancelTween(tag); tweens.push({ t0:performance.now(), dur, fn, tag, done }); invalidate(); }
function cancelTween(tag) { if (!tag) return; for (let i = tweens.length - 1; i >= 0; i--) if (tweens[i].tag === tag) tweens.splice(i, 1); }

/* ───────────── registry ───────────── */
const REG = [];                       // every mesh we keep
const groups = {};                    // model name → THREE.Group
const loaded = {};
const draco = new DRACOLoader().setDecoderPath('./vendor/three/jsm/libs/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);
/* a matcher is an exact lower-case base name, a RegExp on the base name, or { mat, not } on the SOURCE material name */
const matchAny = (ms, base, mat = '') => ms.some(m => typeof m === 'string' ? m === base : m instanceof RegExp ? m.test(base) : (m.mat.test(mat) && !(m.not && m.not.test(base))));

/* every 3D file the app can load, and what kind of thing its meshes are */
const MODELS = {
  skeletal:{ kind:'bone',   noun:'bone',      note:'Unpacking the skeleton…' },
  muscular:{ kind:'muscle', noun:'muscle',    note:'Wrapping it in muscle…' },
  glands:  { kind:'organ',  noun:'gland',     note:'Placing the glands…' },
  ovary:   { kind:'organ',  noun:'gland',     note:'Placing the glands…', files:['hra-ovary-l', 'hra-ovary-r'], rename:{ VH_F_left_ovary:'Ovary.l', VH_F_right_ovary:'Ovary.r' } },
  brain:   { kind:'brain',  noun:'structure', note:'Opening the skull…' },
  nerves:  { kind:'nerve',  noun:'nerve',     note:'Threading the nerves…' },
  willis:  { kind:'artery', noun:'artery',    note:'Filling the arteries…' },
  neuron:  { kind:'cell',   noun:'part',      note:'Growing a neuron…', make:buildNeuron },      // no file: the parts are generated
  tissues: { kind:'cell',   noun:'part',      note:'Building the tissues…', make:buildTissues },
  heart:   { kind:'heart',  noun:'structure', note:'Opening the chest…' },
  airway:  { kind:'airway', noun:'structure', note:'Filling the lungs…' },
  male:    { kind:'organ',  noun:'structure', note:'Placing the organs…' },
  /* The female organs are NOT Z-Anatomy (its body is male): HuBMAP CCF reference organs, Visible Human female, CC BY 4.0, files unmodified. They share one
   * frame, so ONE shift seats them all: the midpoint of the two ovaries goes to the midpoint the ovaries were given by hand in the Glands deck. */
  female:  { kind:'organ',  noun:'structure', note:'Placing the organs…', files:['hra-ovary-l', 'hra-ovary-r', 'hra-uterus', 'hra-tube-l', 'hra-tube-r'], shift:[.0131, .8541, .0275],
    hide:[/wall of uterus$/, /^cornua$/, /^ostium of uterine tube$/, /^lower uterine segment$/, /^cervicovaginal junction$/],      // sub-regions that overlap the body and the cervix
    rename:{ VH_F_left_ovary:'Ovary.l', VH_F_right_ovary:'Ovary.r', VH_F_body_of_uterus:'Body of uterus', VH_F_fundus_of_uterus:'Fundus of uterus', VH_F_cervix:'Cervix', VH_F_internal_cervical_os:'Internal os', VH_F_external_cervical_os:'External os',
      VH_F_lower_uterine_segment:'Lower uterine segment', VH_F_cornua:'Cornua', VH_F_posterior_wall_of_uterus:'Posterior wall of uterus', VH_F_anterior_wall_of_uterus:'Anterior wall of uterus', VH_F_cervicovaginal_junction:'Cervicovaginal junction',
      VH_F_abdominal_ostium_of_uterine_tube:'Ostium of uterine tube', VH_F_uterine_tube_infundibulum_L:'Infundibulum.l', VH_F_uterine_tube_infundibulum_R:'Infundibulum.r', VH_F_fibria_of_uterine_tube_L:'Fimbriae.l', VH_F_fibria_of_uterine_tube_R:'Fimbriae.r',
      VH_F_isthmus_of_fallopian_tube_L:'Isthmus of fallopian tube.l', VH_F_isthmus_of_fallopian_tube_R:'Isthmus of fallopian tube.r', VH_F_ampulla_of_uterine_tube_L:'Ampulla of fallopian tube.l', VH_F_ampulla_of_uterine_tube_R:'Ampulla of fallopian tube.r' } },
  eye:     { kind:'cell',   noun:'part',      note:'Building the eye…', make:buildEye },
  ear:     { kind:'cell',   noun:'part',      note:'Building the ear…', make:buildEar },
  glia:    { kind:'cell',   noun:'cell',      note:'Growing a neuron…', make:buildGlia },
};
const HIDE_BRAIN = [/^falx cerebri$/, /^tentorium cerebelli$/, /root of spinal nerve$/, /^nerve to /, /^central canal/];      // the dura folds stand in front of the medial cut and the cerebellum

const BONE_C = new THREE.Color('#e7dcc6'), CART_C = new THREE.Color('#9fb6c4'), TOOTH_C = new THREE.Color('#f4f0e6'), TENDON_C = new THREE.Color('#dacdb4');
const BRAIN_C = { 'LCR':'#6fb6ff', 'Nucleus':'#b48ccf', 'Nucleus (afferent fibers)':'#b48ccf', 'Nucleus (efferent fibers)':'#b48ccf', 'Brain':'#d8c2a8', 'Cerebellum':'#c9958a',
  'White matter':'#ece5d6', 'Brain-Inner':'#ece5d6', 'Nerve':'#f0d66b', 'Artery':'#d9534f', 'Vein':'#4f7fe0', 'Interlobar sulci':'#b98b84' };
const AIR_C = { 'Lung-base':'#e6a39b', 'Mucosa':'#d98f8f', 'Cartilage':'#9fb6c4', 'Diaphragm':'#a8453c' };
const HEART_C = { 'Artery':'#e2504c', 'Vein':'#4f7fe0', 'Pulmonary artery':'#5b86e6', 'Pulmonary vein':'#e2605c', 'Ligament':'#f3e9d2', 'Cartilage':'#f3e9d2', 'Lung-base':'#e9a9a2' };      // pulmonary ARTERY blue, pulmonary VEINS red: by what they carry
function colourFor(kind, base, matName) {
  const h = hash01(base.replace(/^(long|short|lateral|medial|clavicular|sternocostal|acromial|ascending|descending|transverse|superficial|deep) (head|part) of /, ''));
  if (kind === 'bone') {
    if (/cartilage/.test(base) || matName === 'Cartilage') return CART_C.clone();
    if (matName === 'Teeth') return TOOTH_C.clone();
    return BONE_C.clone().offsetHSL(0, 0, (h - .5) * .05);
  }
  if (kind === 'nerve') return new THREE.Color('#ffe27a').offsetHSL((h - .5) * .03, 0, (h - .5) * .08);
  if (kind === 'airway') return new THREE.Color(/^Bronchi/.test(matName) ? '#cfe3ee' : AIR_C[matName] || '#e7dcc6').offsetHSL(0, 0, (h - .5) * (matName === 'Lung-base' ? .12 : .04));
  if (kind === 'heart') return new THREE.Color(HEART_C[matName] || '#b5554a').offsetHSL(0, 0, (h - .5) * .05);      // all four chambers ONE colour: red left / blue right would hand over the answer
  if (kind === 'artery') return new THREE.Color('#e2504c').offsetHSL((h - .5) * .02, 0, (h - .5) * .1);
  if (kind === 'organ') return new THREE.Color('#c9a08f');                                     // an item's own colour (`c`) replaces this at bind time
  if (kind === 'brain') {                                                                       // the cortex is ONE colour on purpose: tinting by lobe would hand over the answer
    if (/^(midbrain|corpus callosum)$/.test(base)) return new THREE.Color(base === 'midbrain' ? '#d8c2a8' : '#ece5d6');   // the source files these two under "Frontal lobe"
    if (BRAIN_C[matName]) return new THREE.Color(BRAIN_C[matName]).offsetHSL(0, 0, (h - .5) * .04);
    return new THREE.Color('#d8a79d').offsetHSL((h - .5) * .012, 0, (h - .5) * (/sulc|fis/.test(base) ? .03 : .09) - (/sulc|fis/.test(base) ? .07 : 0));
  }
  if (/^(Tendon|Ligament|Trapezius)$/.test(matName) && !/muscle|extensor carpi/.test(base)) return TENDON_C.clone().offsetHSL(0, 0, (h - .5) * .04);
  return new THREE.Color().setHSL(0.004 + h * 0.03, 0.58 + hash01(base + 's') * 0.14, 0.29 + hash01(base + 'l') * 0.13);
}

async function loadModel(name, onProg) {
  if (loaded[name]) return;
  const M = MODELS[name], kind = M.kind, root = new THREE.Group();
  if (M.make) {                                   // a model we build: every part registers like a loaded mesh; `context` parts are drawn but never tappable
    for (const p of M.make()) { if (p.context) addLines(root, p); else register(root, name, kind, p); }
    groups[name] = root; scene.add(root); loaded[name] = true; return bindItems();
  }
  for (const file of M.files || [name]) { const gltf = await loader.loadAsync(`./models/${file}.glb`, e => onProg && onProg(e.loaded, e.total)); root.add(gltf.scene); }
  if (M.shift) root.position.set(...M.shift);
  root.updateMatrixWorld(true);
  const kill = [];
  root.traverse(o => {
    if (!o.isMesh) return;
    // A node with several primitives (every gyrus: an outer "lobe" skin + a "Brain-Inner" cut face) arrives as a Group whose
    // child meshes carry NO source name — the real name, and the .l/.r side, live on the parent. Walk up for it.
    let src = o; while (src && !(src.userData && src.userData.name)) src = src.parent;
    let raw = (src && src.userData.name) || o.name || ''; if (M.rename) raw = M.rename[raw] || M.rename[o.name] || (o.parent && M.rename[o.parent.name]) || raw;
    const sibs = src && src !== o ? src.children.filter(c => c.isMesh) : [o];             // …and the siblings share ONE identity: the first non-inner material
    const srcMat = c => c.userData.srcMat != null ? c.userData.srcMat : ((c.material && c.material.name) || '');            // (we overwrite materials as we go, so remember the source's)
    sibs.forEach(c => { c.userData.srcMat = srcMat(c); });
    const ownerMat = srcMat(sibs.find(c => srcMat(c) && srcMat(c) !== 'Brain-Inner') || o);
    const side = /\.l\.?$/i.test(raw) ? 'L' : /\.r\.?$/i.test(raw) ? 'R' : '';
    const orig = raw.replace(/\.[lr]\.?$/i, '').trim();
    const base = orig.toLowerCase();
    const matName = srcMat(o);
    const hide = kind === 'bone' ? matchAny(HIDE.bone, base) : kind === 'muscle' ? (HIDE.muscleMaterial.test(matName) || matchAny(HIDE.muscle, base)) : kind === 'brain' ? matchAny(HIDE_BRAIN, base) : M.hide ? matchAny(M.hide, base) : false;
    if (hide) { kill.push(o); return; }      // not removed: a hidden node may still parent a visible one
    const colour = colourFor(kind, base, matName);
    const soft = kind === 'muscle' && colour.r > .7 && colour.g > .7;
    o.material = new THREE.MeshStandardMaterial({ color:colour, roughness:kind === 'bone' ? .58 : .5, metalness:0, emissive:0x000000 });
    const clip = kind === 'muscle' && CLIP.find(c => matchAny(c.m, base));      // the rectus sheath, cut away (see data.js)
    if (clip) { o.material.clippingPlanes = [new THREE.Plane(new THREE.Vector3(side === 'R' ? -1 : 1, 0, 0), -clip.x)]; o.material.side = THREE.DoubleSide; }
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    const want = !M.shift && PLACE[base + (side ? '.' + side.toLowerCase() : '')];      // (a model moved as one set keeps its parts where they are relative to each other)          // a structure borrowed from another reference body: put it where it belongs in this one
    if (want) { const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()); o.position.add(new THREE.Vector3(...want).sub(c)); o.updateMatrixWorld(true); }
    const info = { mesh:o, base, side, mat:ownerMat || matName, model:name, kind:soft ? 'tendon' : kind, colour:colour.clone(), clipX:clip ? clip.x : 0,
      pretty:orig.replace(/ muscles?$/i, '').replace(/^\((.*)\)$/, '$1'), box:new THREE.Box3().setFromObject(o), items:[], ghost:false,
      soft:(kind === 'brain' && (ownerMat || matName) === 'LCR') || (kind === 'heart' && /lobe of/.test(base)),        // …the lungs round the heart likewise
      openable:(kind === 'heart' && /^(left|right) (atrium|ventricle)$|^ascending aorta$|^pulmonary trunk$/.test(base)) || (kind === 'airway' && /lobe of/.test(base)),      // turns to glass when the question is about what is inside it        // a ventricle is a fluid space: drawn as glass, and a tap passes through it unless it is what was asked
      men:kind === 'brain' && base === 'superior sagittal sinus' };      // on stage with the meninges only
    o.userData.info = info; REG.push(info);
  });
  const NONE = new THREE.MeshBasicMaterial({ visible:false }); kill.forEach(o => { o.material = NONE; });
  groups[name] = root; scene.add(root); loaded[name] = true;
  if (name === 'brain') makeMeninges(root);
  if (name === 'nerves') makePhrenic(root);
  if (name === 'heart') buildConduction(b => REG.find(i => i.model === 'heart' && i.base === b)).forEach(p => p.context ? menLines.push(addLines(root, p)) : register(root, 'heart', 'heart', p, { men:true }));
  bindItems();
}

const menLines = [];
function addLines(root, p) { const o = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(p.lines), new THREE.LineBasicMaterial({ color:0xffffff, transparent:true, opacity:.3 })); root.add(o); return o; }
/* A structure we BUILT (made.js), registered like a loaded mesh so every mode runs on it unchanged. Its source material is 'Schematic'. */
function register(root, model, kind, part, extra) {
  const colour = new THREE.Color(part.colour), mesh = new THREE.Mesh(part.geometry, new THREE.MeshStandardMaterial({ color:colour, roughness:.55, metalness:0, emissive:0x000000, side:THREE.DoubleSide }));
  mesh.geometry.computeBoundingBox(); root.add(mesh); mesh.updateMatrixWorld(true);
  const info = { mesh, base:part.name.toLowerCase(), side:'', mat:'Schematic', model, kind, colour:colour.clone(), clipX:0, pretty:part.name, box:new THREE.Box3().setFromObject(mesh), items:[], ghost:false, soft:!!part.soft, made:true, glassy:part.glassy || 0, anchor:part.anchor || null, ...extra };
  mesh.userData.info = info; REG.push(info); return info;
}
function makePhrenic(root) {
  const c = b => { const i = REG.find(r => r.model === 'skeletal' && r.base === b); return i && i.box.getCenter(new THREE.Vector3()); }, C4 = c('vertebra c4'), T1 = c('vertebra t1'), T9 = c('vertebra t9'); if (!C4 || !T1 || !T9) return;
  const side = s => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(s * .016, C4.y, C4.z + .012), new THREE.Vector3(s * .034, T1.y + .01, T1.z + .04), new THREE.Vector3(s * (s > 0 ? .062 : .048), (T1.y + T9.y) / 2 + .02, T1.z + .085), new THREE.Vector3(s * (s > 0 ? .066 : .055), T9.y + .015, T9.z + .1)]), 40, .0024, 8, false);
  const L = side(1).toNonIndexed(), R = side(-1).toNonIndexed(), g = new THREE.BufferGeometry(); for (const a of ['position', 'normal', 'uv']) g.setAttribute(a, new THREE.Float32BufferAttribute([...L.attributes[a].array, ...R.attributes[a].array], a === 'uv' ? 2 : 3));
  register(root, 'nerves', 'nerve', { name:'Phrenic nerve', geometry:g, colour:'#ffb347', anchor:new THREE.Vector3(.034, T1.y + .01, T1.z + .04) });
}
function makeMeninges(root) {
  const cortex = REG.filter(i => i.model === 'brain' && /lobe$|^Interlobar sulci$/.test(i.mat)), sinus = REG.find(i => i.model === 'brain' && i.base === 'superior sagittal sinus');
  const M = buildMeninges(THREE, cortex, sinus); M.parts.forEach(p => register(root, 'brain', 'brain', p, { men:true }));
  /* her MCQ: "the line labelled A separates the brain into two halves" = the longitudinal fissure. A fissure is a GAP, so it is marked with a thin plate standing in it, on stage only when asked */
  const cb = new THREE.Box3(); cortex.forEach(i => cb.union(i.box)); const cs = cb.getSize(new THREE.Vector3()), cc = cb.getCenter(new THREE.Vector3()), plate = new THREE.BoxGeometry(.0026, cs.y * .5, cs.z * .95); plate.translate(cc.x, cb.max.y - cs.y * .25 + .004, cc.z);
  register(root, 'brain', 'brain', { name:'Longitudinal fissure', geometry:plate, colour:'#ffd27a', glassy:.62, anchor:new THREE.Vector3(cc.x, cb.max.y + .005, cc.z + cs.z * .18) }, { men:'fis' });
  if (DEBUG) console.log('[fab] meninges: the sinus floor was', (M.sinusFloor * 1000).toFixed(1), 'mm above the envelope; moved out', (M.sinusLift * 1000).toFixed(1), 'mm');
}

/* (re)bind every item to the meshes of its deck's own models — cheap, and run after each model arrives */
function bindItems() {
  for (const i of REG) i.items = [];
  for (const it of Object.values(ITEM)) {
    const D = DECK[it.deck]; it.infos = []; it.alsoInfos = []; it.bases = new Set(); it.ok = false;
    if (!D.bind.every(m => loaded[m])) continue;
    const pool = REG.filter(i => D.bind.includes(i.model));
    it.infos = it.on ? pool.filter(i => i.base === it.on) : pool.filter(i => matchAny(it.m, i.base, i.mat));
    if (it.also) it.alsoInfos = pool.filter(i => matchAny(it.also, i.base, i.mat) && !it.infos.includes(i));
    it.bases = new Set(it.infos.map(i => i.base));
    it.ok = it.infos.length > 0 && !(it.on && it.p.every(x => x === .5));
    it.box = new THREE.Box3(); it.infos.forEach(i => it.box.union(i.box));
    if (!it.infos.length) console.warn('[fab] item matches nothing:', it.id);
    if (!it.on) it.infos.forEach(i => i.items.push(it));
    if (it.c && !it.on) it.infos.forEach(i => { i.colour.set(it.c); if (!glows.has(i)) i.mesh.material.color.copy(i.colour); });
  }
}
const POINTS = (base, model) => Object.values(ITEM).filter(i => i.on === base && i.ok && DECK[i.deck].bind.includes(model));
const _v = new THREE.Vector3();
function pointWorld(it, info) {
  const bb = info.mesh.geometry.boundingBox;
  return info.mesh.localToWorld(new THREE.Vector3(lerp(bb.min.x, bb.max.x, it.p[0]), lerp(bb.min.y, bb.max.y, it.p[1]), lerp(bb.min.z, bb.max.z, it.p[2])));
}

function nLocal(info, pt) { const bb = info.mesh.geometry.boundingBox, p = info.mesh.worldToLocal(pt.clone()); return [(p.x - bb.min.x) / (bb.max.x - bb.min.x), (p.y - bb.min.y) / (bb.max.y - bb.min.y), (p.z - bb.min.z) / (bb.max.z - bb.min.z)]; }

/* Sphere landmarks on one bone overlap (head / neck / greater trochanter sit within 3 cm of each other), so a
 * tap belongs to ONE of them: the sphere it is deepest inside, measured in units of that sphere's own radius.
 * Without this a tap on the neck was accepted as "greater trochanter" (caught 20 Sep by measuring the overlaps). */
function nearestSphere(info, pt, slack = 1) {
  let best = null;
  for (const it of POINTS(info.base, info.model)) { if (it.zone) continue; const k = pt.distanceTo(pointWorld(it, info)) / it.r; if (k <= slack && (!best || k < best.k)) best = { it, k }; }
  return best && best.it;
}

/* What did they just touch? — the most specific thing we can honestly say. */
function describe(info, pt) {
  let lm = null; const pts = pt ? POINTS(info.base, info.model) : [];
  if (pts.length) {
    const n = nLocal(info, pt), neutral = NEUTRAL[info.base] && NEUTRAL[info.base](n);
    if (neutral) return { ...neutral, neutral:true, item:null, her:false };
    for (const it of pts.filter(i => i.zone).sort((a, b) => (b.prio || 0) - (a.prio || 0))) if (it.zone(n)) { lm = { it, d:0 }; break; }
    if (!lm) { const s = nearestSphere(info, pt, 1.3); if (s) lm = { it:s, d:0 }; }
  }
  const own = info.items.filter(i => i.bases.size === 1)[0];
  const grp = info.items.filter(i => i.bases.size > 1).sort((a, b) => a.bases.size - b.bases.size)[0];
  const bone = own ? own.name : info.pretty;
  if (lm) return { title:lm.it.name, sub:bone, item:lm.it, her:!!lm.it.her };
  return { title:bone, sub:grp && grp.name !== bone ? grp.name : (!DECK[G.deck].bind.includes(info.model) ? MODELS[info.model].noun : ''), item:own || grp || null, her:!!((own && own.her) || (grp && grp.her)) };
}
function isCorrect(it, hit) {
  const info = hit.object.userData.info;
  if (it.on) { if (info.base !== it.on) { const a = (it.alsoOn || []).find(z => z.on === info.base); return !!a && hit.point.distanceTo(pointWorld(a, info)) <= a.r; } if (it.zone) { const n = nLocal(info, hit.point); return !(NEUTRAL[info.base] && NEUTRAL[info.base](n)) && it.zone(n); } return nearestSphere(info, hit.point) === it; }
  if (it.infos.includes(info) || it.alsoInfos.includes(info)) return true;
  return (it.accept || []).some(id => ITEM[id].infos && ITEM[id].infos.includes(info));
}

/* ───────────── look: glow · x-ray · dim ───────────── */
const glows = new Map();
function glow(infos, hex, mode = 'pulse', dur = 900) { const c = new THREE.Color(hex); for (const i of infos) glows.set(i, { c, mode, t0:performance.now(), dur }); invalidate(); }
const rest = i => { i.mesh.material.emissive.setRGB(0, 0, 0); i.mesh.material.color.copy(i.colour).multiplyScalar(i.dimK || 1); };
function unglow(infos) { for (const i of infos || [...glows.keys()]) { glows.delete(i); rest(i); } invalidate(); }
/* (the lungs round the heart are glass at .1: context, not clutter) */
/* one painter for both kinds of see-through: a deck's ghost context (the skeleton around the glands) and the x-ray round a deep target */
function paint(i) { const g = i.baseGhost || i.xr || i.peel, dimmed = (i.dimK || 1) < 1, m = i.mesh.material, was = m.transparent, glass = !!i.glassy || (i.soft && !(xray && xray.has(i) && !G.tr));
  m.transparent = !!g || glass || dimmed; m.opacity = i.baseGhost ? .11 : i.peel ? .13 : i.xr ? (i.kind === 'bone' ? .16 : .07) : glass ? (i.glassy || (i.openable ? .3 : i.kind === 'heart' ? .1 : G.tr ? .5 : .42)) : dimmed ? .3 : 1; m.depthWrite = !(g || glass || dimmed); if (was !== m.transparent) m.needsUpdate = true; i.ghost = !!g; }
let xray = null;
function setXray(keep) { xray = new Set(keep); for (const i of REG) { i.xr = !xray.has(i); paint(i); } refreshPickables(); invalidate(); }
function clearXray() { if (!xray) return; xray = null; for (const i of REG) { i.xr = false; paint(i); } refreshPickables(); invalidate(); }
/* the brain cut in half: the left hemisphere's meshes go, midline structures stay, and you look in from the left */
/* the twelve cranial nerves are long tubes (the vagus reaches the abdomen): on stage only when they are the question, or in Explore */
let nervesOn = true;
function setNerves(on) { nervesOn = on;      // no early return: a brain that loads after boot (deck switch) has never been told, and its nerves stayed on stage
  for (const i of REG) if (i.model === 'brain' && i.base.includes(' nerve (')) i.mesh.visible = on && !(cutOn && i.side === 'L'); refreshPickables(); invalidate(); }
let menOn = true;
function setMeninges(on) { menOn = on; for (const i of REG) if (i.men) i.mesh.visible = on === true ? i.men === true : !!on && i.men === on; for (const o of menLines) o.visible = on === true; refreshPickables(); invalidate(); }
/* open the heart: its chambers (and the two great roots) turn to glass and a tap passes through them, so the valves inside can be seen and touched */
let openOn = false;
function setOpen(on) { openOn = on; for (const i of REG) if (i.openable) { i.soft = on; paint(i); } refreshPickables(); invalidate(); }
let cutOn = false;
function setCut(on) { cutOn = on; for (const i of REG) if (i.model === 'brain' && i.side === 'L') i.mesh.visible = !on && (nervesOn || !i.base.includes(' nerve (')); refreshPickables(); invalidate(); }
/* put a deck on stage: which models show, which are ghosts, and the accent colour */
const ONLY_MODELS = new Set(Object.values(DECK).flatMap(d => Object.keys(d.only || {})));
function applyDeck() { const D = DECK[G.deck]; for (const i of REG) if (ONLY_MODELS.has(i.model)) i.mesh.visible = !(D.only && D.only[i.model]) || matchAny(D.only[i.model], i.base, i.mat); for (const m of Object.keys(groups)) groups[m].visible = m in D.models && !(D.sex && D.sex[m] && D.sex[m] !== G.sex);
  for (const i of REG) { i.baseGhost = D.models[i.model] === 'ghost'; paint(i); }
  document.body.style.setProperty('--acc', D.acc); document.body.style.setProperty('--acc-ink', D.ink); refreshPickables(); invalidate(); }
function setDim(keepFn) { for (const i of REG) { i.dimK = !keepFn || keepFn(i) ? 1 : .3; paint(i); if (!glows.has(i)) rest(i); } invalidate(); }      /* dimmed = darker AND see-through: colour alone was too quiet */
function setPeel(ms) { for (const i of REG) { const p = !!ms && matchAny(ms, i.base, i.mat); if (p !== !!i.peel) { i.peel = p; paint(i); } } refreshPickables(); invalidate(); }

let pickables = [];
function refreshPickables() { pickables = REG.filter(i => i.mesh.visible && groups[i.model].visible && !i.ghost).map(i => i.mesh); }

/* ───────────── camera framing ───────────── */
function freeRect() {
  const W = innerWidth, H = innerHeight, st = document.body.dataset.state; let top = 8, bottom = H - 8, left = 0, right = W;
  if (st === 'play') { const p = $('#prompt'), d = $('#dock'); top = p.offsetTop + p.offsetHeight + 4; bottom = H - d.offsetHeight - 22; }
  else if (st === 'home' || st === 'results') { const p = $('#' + st); if (W >= 880) left = 24 + p.offsetWidth; else bottom = H - p.offsetHeight - 18; }
  if (bottom - top < 140) { top = 8; bottom = Math.max(160, bottom); }
  return { x:left, y:top, w:right - left, h:bottom - top };
}
function frameBox(box, az = 0, elv = 6, pad = 1.2, minSize = 0.26) {
  if (!(innerWidth > 0 && innerHeight > 0) || box.isEmpty()) return null;
  const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  const b = box.clone(); const grow = new THREE.Vector3(Math.max(0, minSize - s.x), Math.max(0, minSize - s.y), Math.max(0, minSize - s.z)).multiplyScalar(.5); b.min.sub(grow); b.max.add(grow);
  const a = az * DEG, e = elv * DEG;
  const dir = new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e));
  const rightV = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize(), upV = new THREE.Vector3().crossVectors(dir, rightV);
  let hw = 0, hh = 0, hd = 0;
  for (let i = 0; i < 8; i++) { _v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).sub(c); hw = Math.max(hw, Math.abs(_v.dot(rightV))); hh = Math.max(hh, Math.abs(_v.dot(upV))); hd = Math.max(hd, _v.dot(dir)); }
  const fr = freeRect(), H = innerHeight, W = innerWidth, k = 2 * Math.tan(camera.fov * DEG / 2) / H;
  const D = Math.max(hh * 2 * pad / (fr.h * k), hw * 2 * pad / (fr.w * k)) + hd;
  const wpp = k * D, dx = (fr.x + fr.w / 2) - W / 2, dy = (fr.y + fr.h / 2) - H / 2;
  const target = c.clone().addScaledVector(rightV, -dx * wpp).addScaledVector(upV, dy * wpp);
  return { target, pos:target.clone().addScaledVector(dir, D) };
}
const regionBox = {};
function regionFrame(name, az, elv) {
  const R = REGIONS[name] || REGIONS.whole;
  if (!regionBox[name]) { const b = new THREE.Box3(); REG.filter(i => i.model === (R.model || 'skeletal') && (!R.side || i.side === R.side || !i.side) && matchAny(R.m, i.base, i.mat)).forEach(i => b.union(i.box)); regionBox[name] = b; }
  return frameBox(regionBox[name], az, elv, R.pad || 1.15, R.min || 0.26);
}
const homeFrame = (az = 20) => { const D = DECK[G.deck], v = D.view || [az, 4]; return regionFrame(D.home || 'whole', v[0], v[1]); };      // how a deck looks at rest
const sph = new THREE.Spherical();
function flyTo(f, dur = 850) {
  if (!f || !Number.isFinite(f.pos.x + f.pos.y + f.pos.z + f.target.x + f.target.y + f.target.z)) return;
  const t0 = controls.target.clone(), s0 = new THREE.Spherical().setFromVector3(camera.position.clone().sub(t0));
  const s1 = new THREE.Spherical().setFromVector3(f.pos.clone().sub(f.target));
  let dth = s1.theta - s0.theta; dth = ((dth + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  const same = t0.distanceTo(f.target) < .02 && Math.abs(dth) < .05 && Math.abs(s1.radius - s0.radius) < .05 && Math.abs(s1.phi - s0.phi) < .05;
  if (same) return;
  tween(dur, k => { const e = easeIO(k); controls.target.lerpVectors(t0, f.target, e); sph.set(lerp(s0.radius, s1.radius, e), lerp(s0.phi, s1.phi, e), s0.theta + dth * e); camera.position.setFromSpherical(sph).add(controls.target); }, 'cam');
}

/* ───────────── screen-space helpers ───────────── */
const toScreen = p => { _v.copy(p).project(camera); return { x:(_v.x * .5 + .5) * innerWidth, y:(-_v.y * .5 + .5) * innerHeight, behind:_v.z > 1 }; };
const callout = { el:$('#callout'), p:null, timer:0,
  show(p, text, cls = '', ms = 0) { this.p = p.clone(); this.el.className = cls; this.el.firstElementChild.textContent = text; this.el.hidden = false; clearTimeout(this.timer); if (ms) this.timer = setTimeout(() => this.hide(), ms); invalidate(); },
  hide() { this.p = null; this.el.hidden = true; } };
const ring = { el:$('#ring'), p:null, show(p, cls = '') { this.p = p.clone(); this.el.className = cls; this.el.hidden = false; invalidate(); }, hide() { this.p = null; this.el.hidden = true; } };
const pins = { list:[], host:$('#pins'), add(p, n) { const e = el('div', 'pin', '<b>' + n + '</b>'); this.host.appendChild(e); this.list.push({ el:e, p:p.clone() }); invalidate(); }, clear() { this.list.length = 0; this.host.innerHTML = ''; } };
function place(o) { if (!o.p) return; const s = toScreen(o.p); o.el.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px)`; o.el.style.visibility = s.behind ? 'hidden' : 'visible'; }
function popScore(x, y, text) { const e = el('div', 'pop', esc(text)); e.style.left = x + 'px'; e.style.top = y + 'px'; document.body.appendChild(e); setTimeout(() => e.remove(), 950); }

/* ───────────── sound + haptics ───────────── */
let actx = null;
function tone(f0, f1, t, type = 'triangle', vol = .07, when = 0) {
  if (!S.o.sound) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
    const o = actx.createOscillator(), g = actx.createGain(), T = actx.currentTime + when; o.type = type; o.frequency.setValueAtTime(f0, T); o.frequency.exponentialRampToValueAtTime(f1, T + t);
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(vol, T + .012); g.gain.exponentialRampToValueAtTime(.0001, T + t); o.connect(g).connect(actx.destination); o.start(T); o.stop(T + t + .02); } catch {}
}
const sfx = { good:() => { tone(620, 640, .09); tone(930, 960, .16, 'triangle', .07, .08); }, bad:() => tone(210, 130, .22, 'sine', .11), tick:() => tone(440, 440, .04, 'sine', .03),
  done:() => [523, 659, 784, 1047].forEach((f, i) => tone(f, f, .22, 'triangle', .06, i * .09)) };
const buzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };

/* ───────────── picking ───────────── */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
/* What lies INSIDE a glass structure wins the tap — the plexus hangs in the ventricle, the nucleus sits in the soma — unless the container is what was asked. [container, how far behind its wall] */
const INSIDE = { 'choroid plexus':['lateral ventricle', .03], 'nucleus':['soma', .08], 'synaptic vesicles':['axon terminals', .09],
  'articular cartilage':['synovial fluid', .12], 'osteocytes':['lacunae', .01], 'utricle':['vestibule', .05], 'saccule':['vestibule', .05] };
function cast(x, y) { const r = canvas.getBoundingClientRect(); ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(pickables, false).filter(h => { const i = h.object.userData.info; return !(i.clipX && Math.abs(h.point.x) < i.clipX) && !(i.soft && !(xray && xray.has(i)) && G.cur && !G.cur.it.infos.includes(i)); });
  const h0 = hits[0]; if (!h0) return null; const i0 = h0.object.userData.info;
  if (!(i0.soft || i0.glassy) || (G.cur && G.cur.it.infos.includes(i0))) return h0;
  if (i0.openable) return hits.find(h => !h.object.userData.info.soft && h.distance - h0.distance < .07) || h0;      // an opened chamber: what is inside it wins
  return hits.find(h => { const w = INSIDE[h.object.userData.info.base]; return w && w[0] === i0.base && h.distance - h0.distance < w[1]; }) || h0; }
function pickAt(x, y, wantItem) {
  let hit = cast(x, y);
  const named = h => { if (!h) return false; const i = h.object.userData.info, d = describe(i, h.point);      // did the finger land ON something with a name of its own?
    if (d.neutral || !d.item) return false; return !(wantItem.on && !d.item.on && i.base === wantItem.on); };  // (the bare shaft of the bone a landmark sits on does not count as a rival)
  if (wantItem && !(hit && isCorrect(wantItem, hit)) && !named(hit)) {          // fat-finger forgiveness — only for a tap on nothing (or on unnamed context), never at a neighbour's expense: a tap on the neck is not "close enough" to the trochanter
    for (let k = 0; k < 8; k++) { const h = cast(x + Math.cos(k * Math.PI / 4) * 13, y + Math.sin(k * Math.PI / 4) * 13); if (h && isCorrect(wantItem, h)) return h; }
  }
  if (!hit) for (let k = 0; k < 8 && !hit; k++) hit = cast(x + Math.cos(k * Math.PI / 4) * 10, y + Math.sin(k * Math.PI / 4) * 10);
  return hit;
}
let down = null, pointers = 0, hoverInfo = null, hoverT = 0;
canvas.addEventListener('pointerdown', e => { pointers++; down = pointers === 1 ? { x:e.clientX, y:e.clientY, t:performance.now() } : null; });
addEventListener('pointerup', e => { pointers = Math.max(0, pointers - 1); if (!down || e.target !== canvas) { down = null; return; }
  const ok = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8 && performance.now() - down.t < 500; down = null; if (ok) G.onTap(e.clientX, e.clientY); });
addEventListener('pointercancel', () => { pointers = 0; down = null; });
canvas.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || e.buttons || performance.now() - hoverT < 60 || document.body.dataset.state !== 'play' || G.mode === 'name') return; hoverT = performance.now();
  const h = cast(e.clientX, e.clientY), info = h ? h.object.userData.info : null;
  if (info === hoverInfo) return;
  if (hoverInfo && !glows.has(hoverInfo)) hoverInfo.mesh.material.emissive.setRGB(0, 0, 0);
  hoverInfo = info; canvas.classList.toggle('hot', !!info);
  if (info && !glows.has(info)) info.mesh.material.emissive.setRGB(.09, .09, .1); invalidate();
});

/* ───────────── game ───────────── */
const ACC = () => getComputedStyle(document.body).getPropertyValue('--acc').trim() || '#f2b84b';
const G = { deck:S.o.deck, mode:S.o.mode, round:null, cur:null, tr:null, sex:'female', xHer:false, xPeel:false,

  pool(deck = this.deck, setId = S.o.set[deck], mode = this.mode) { const set = SETS[deck].find(s => s.id === setId) || SETS[deck][0]; return DECK[deck].items.filter(i => i.ok && set.f(i) && (mode !== 'find' || !(i.deep || i.nameOnly)) && (mode !== 'name' || !i.findOnly)); },

  async setDeck(deck) {
    this.deck = S.o.deck = deck; document.body.dataset.deck = deck; save();
    const need = Object.keys(DECK[deck].models).filter(m => !loaded[m]);
    if (need.length) { showLoader(MODELS[need[need.length - 1]].note); for (const m of need) await loadModel(m, loadProg); hideLoader(); }
    setCut(false); setNerves(false); setMeninges(false); setOpen(false); applyDeck(); renderHome();
  },

  start(only) {
    if (this.mode === 'trace' && !only) return this.startTrace();
    const pool = only || this.pool(); if (!pool.length) return;
    this.tr = null; pins.clear(); unglow(); clearXray(); setDim(null); callout.hide(); ring.hide(); toast();
    this.xHer = this.xPeel = false; setCut(false); setNerves(this.mode === 'explore'); setMeninges(false); setOpen(false); applyDeck();
    document.body.dataset.mode = this.mode; controls.autoRotate = false;
    if (this.mode === 'explore') { this.round = null; setState('play'); return this.explore(); }
    const len = only ? pool.length : (S.o.len === 'all' ? pool.length : Math.min(S.o.len, pool.length));
    const ranked = shuffle(pool.slice()).sort((a, b) => (mast(a.id).b - mast(b.id).b) || (mast(a.id).t - mast(b.id).t));
    const queue = shuffle(ranked.slice(0, len)).map(it => ({ it, first:true }));
    this.round = { key:[this.deck, only ? 'misses' : S.o.set[this.deck], this.mode, len].join('.'), queue, total:queue.length, done:0, score:0, streak:0, bestStreak:0, right:0, t0:performance.now(), log:[], poolIds:new Set(pool.map(i => i.id)) };
    $('#score').textContent = '0'; const sk = $('#streak'); sk.textContent = '×0'; sk.classList.remove('on');
    setState('play'); this.next();
  },

  askStyle(it) {
    if (this.mode !== 'find' || S.o.ask === 'name' || mast(it.id).r < 1) return 'name';
    const opts = ['name']; if (it.common) opts.push('common'); if (it.clue) opts.push('clue', 'clue');
    return opts[Math.random() * opts.length | 0];
  },

  next() {
    const R = this.round; unglow(); clearXray(); setPeel(null); ring.hide(); callout.hide(); toast();
    if (!R.queue.length) return this.finish();
    const q = R.queue.shift(), it = q.it; setNerves(/^br-cn/.test(it.id)); setCut(!!it.cut); setMeninges(it.men || false); setOpen(!!it.open); if (it.sex && it.sex !== this.sex) { this.sex = it.sex; applyDeck(); } this.cur = { it, first:q.first, tries:0, hinted:false, revealed:false, answered:false, style:this.askStyle(it), t0:performance.now() };
    $('#barTitle').textContent = `${innerWidth > 520 ? DECK[this.deck].label + ' · ' : ''}${this.mode === 'find' ? 'Find it' : 'Name it'} · ${Math.min(R.done + 1, R.total)} of ${R.total}${q.first ? '' : ' · again'}`;
    $('#prog i').style.width = (R.done / R.total * 100) + '%';
    const P = $('#prompt'); P.classList.remove('swap'); void P.offsetWidth; P.classList.add('swap');
    if (this.mode === 'find') {
      const st = this.cur.style, text = st === 'clue' ? it.clue.t : st === 'common' ? it.common : it.name;
      P.querySelector('.k').textContent = st === 'clue' ? (it.clue.hers ? 'Find it · clue from her quiz' : 'Find it · clue') : it.on && (it.deck === 'bones' || it.deck === 'airway') ? `On the ${it.on} · find the` : 'Find the';
      const n = P.querySelector('.n'); n.textContent = text; n.classList.toggle('long', st === 'clue');
      P.querySelector('.s').textContent = st === 'name' ? (it.sub ? `(${it.sub})` : '') : st === 'common' ? 'Tap it — what is its proper name?' : it.cut ? 'cut in half · seen from the left' : it.men ? (it.stage || 'schematic layers · thickness exaggerated') : it.open ? 'the chambers are shown as glass' : DECK[this.deck].schematic || '';
      dock(`<div class="acts"><button class="act" data-a="hint">Zoom me in</button><button class="act" data-a="show">Show me</button></div>`);
      if (it.peelNow) setPeel(it.peel);
      flyTo(regionFrame(it.region, it.az, it.el));
    } else {
      P.querySelector('.k').textContent = it.deep ? 'Name it · x-ray' : it.men ? 'Name it · ' + (it.stage ? 'schematic' : 'schematic layers') : DECK[this.deck].schematic ? 'Name it · schematic' : 'Name it';
      const n = P.querySelector('.n'); n.textContent = it.ask ? it.ask : it.on ? (it.zone && it.deck === 'brain' ? 'Which area is ringed?' : `Which part of the ${it.on}?`) : 'What is glowing?'; n.classList.remove('long'); P.querySelector('.s').textContent = '';
      dock(`<div class="opts">${this.options(it).map(o => `<button class="opt" data-id="${o.id}">${esc(o.name)}${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</button>`).join('')}</div>`);
      if (it.deep) setXray(it.infos); else if (it.peel) setPeel(it.peel);
      this.spot(it, ACC(), 'pulse');
      flyTo(this.itemFrame(it));
    }
  },

  itemFrame(it) { const F = DECK[it.deck].frame; return it.on ? regionFrame(it.region, it.az, it.el) : frameBox(it.box, it.az, it.el == null ? 6 : it.el, F ? F.pad : it.box.getSize(_v).y > 1 ? 1.12 : 1.75, F ? F.min : 0.34); },
  anchor(it) { if (!it.on && it.infos[0].anchor) return it.infos[0].anchor.clone();
    if (it.pin === 'top') { const i0 = it.infos[0]; if (!i0.topPt) { const p = i0.mesh.geometry.attributes.position, v = new THREE.Vector3(); i0.topPt = new THREE.Vector3(0, -Infinity, 0);      // an arc's bounding-box centre is nowhere near the arc: label its highest point
        for (let k = 0; k < p.count; k++) { v.set(p.getX(k), p.getY(k), p.getZ(k)); i0.mesh.localToWorld(v); if (v.y > i0.topPt.y) i0.topPt.copy(v); } } return i0.topPt.clone(); }
    if (it.on) { const side = it.infos.find(i => i.side === 'L') || it.infos[0]; return pointWorld(it, side); } const b = (it.infos.find(i => i.side !== 'R') || it.infos[0]).box; return b.getCenter(new THREE.Vector3()); },
  spot(it, hex, mode, dur) { if (it.on) { ring.show(this.anchor(it), mode === 'flash' ? 'good' : ''); } else glow(it.infos, hex, mode, dur); },

  options(it) {
    const zoneOf = r => /lower|leg|foot|femur|pelvis/.test(r) ? 'low' : /forearm|hand/.test(r) ? 'arm' : r;
    const lastWord = s => s.toLowerCase().split(' ').pop(), firstWord = s => s.toLowerCase().split(' ')[0];
    const cand = DECK[this.deck].items.filter(o => o.ok && o !== it && o.name !== it.name && (!it.strict || o.kind === it.kind) && !(o.accept || []).includes(it.id)
      && !(!it.on && !o.on && [...o.bases].some(b => it.bases.has(b))) && !(!!it.on !== !!o.on && (it.on || o.on) && (it.on ? o.bases.has(it.on) : it.bases.has(o.on))));
    const score = o => (o.kind && o.kind === it.kind ? 5 : 0) + (o.on && it.on ? (o.on === it.on ? 6 : 2) : 0) + (!!o.on === !!it.on ? 3 : 0) + (lastWord(o.name) === lastWord(it.name) ? 3 : 0) + (firstWord(o.name) === firstWord(it.name) ? 3 : 0)
      + (o.region === it.region ? 3 : zoneOf(o.region) === zoneOf(it.region) ? 1.5 : 0) + (o.name[0] === it.name[0] ? 2 : 0)      // same first letter is HER trap: cranium/carpal/clavicle/condyle
      + (Math.abs(((o.az - it.az + 540) % 360) - 180) < 60 ? 1 : 0) + (this.round.poolIds.has(o.id) ? 1.5 : 0) + Math.random() * 2.2;
    const seen = new Set([it.name]), out = [];
    for (const o of cand.sort((a, b) => score(b) - score(a))) { if (seen.has(o.name)) continue; seen.add(o.name); out.push(o); if (out.length === 3) break; }
    return shuffle([it, ...out]);
  },

  onTap(x, y) {
    if (document.body.dataset.state !== 'play') return;
    if (this.mode === 'explore') { const h = pickAt(x, y); return h ? this.inspect(h) : null; }
    if ((this.mode !== 'find' && !this.tr) || !this.cur || this.cur.answered) return;
    const c = this.cur, it = c.it, hit = pickAt(x, y, it); if (!hit) return;
    const info = hit.object.userData.info;
    if (this.tr) return this.traceTap(hit, x, y);
    if (isCorrect(it, hit)) {
      c.answered = true; const clean = c.tries === 0 && !c.revealed;
      this.spot(it, '#3ddc97', 'flash', 1100); if (it.on) setTimeout(() => ring.hide(), 900);
      callout.show(it.on ? this.anchor({ ...it, infos:[info] }) : hit.point, it.name, 'good', 1500);
      const pts = this.settle(clean); if (pts) popScore(x, y - 30, '+' + pts);
      sfx.good(); buzz(12);
      toast('good', `<b>${esc(it.name)}</b>${it.alt ? ` <span style="opacity:.7">· ${esc(it.alt)}</span>` : ''}<small>${esc(it.fact || '')}</small>`);
      setTimeout(() => this.round && this.cur === c && this.next(), clean ? 1250 : 1700);
    } else {
      if (c.revealed) return;
      const d = describe(info, hit.point);
      if (d.neutral) { callout.show(hit.point, d.title, '', 2200); sfx.tick(); return toast('info', `<b>${esc(d.title)}</b> — ${esc(d.sub)}.<small>Doesn't count against you. Tap a part that is only ${esc(it.name.toLowerCase())}.</small>`); }
      c.tries++; const peeled = c.tries === 1 && it.peel && !it.deep; if (peeled) setPeel(it.peel);
      glow([info], '#ff5d6c', 'flash', 800); callout.show(hit.point, d.title, 'bad', 1600);
      sfx.bad(); buzz([30, 40, 30]); $('#prompt').classList.remove('shake'); void $('#prompt').offsetWidth; $('#prompt').classList.add('shake');
      const rel = d.item && !it.on && !d.item.on && [...it.bases].some(b => d.item.bases.has(b));
      toast('bad', `That's the <b>${esc(d.title)}</b>${d.sub ? ` <span style="opacity:.7">· ${esc(d.sub)}</span>` : ''}<small>${c.tries >= 2 ? 'Here it is — tap it to carry on.' : peeled ? 'It lies UNDER another muscle — that one has been faded out. One more go.' : rel ? 'Close — right group, wrong part. One more go.' : 'One more go.'}</small>`);
      if (c.tries >= 2) this.reveal();
    }
  },

  reveal() { const c = this.cur, it = c.it; c.revealed = true; if (it.peel && !it.deep) setPeel(it.peel); this.spot(it, ACC(), 'pulse'); flyTo(this.itemFrame(it)); setTimeout(() => this.cur === c && !c.answered && callout.show(this.anchor(it), it.name, '', 0), 500);
    dock(`<div class="fact"><b>${esc(it.name)}</b> — ${esc(it.fact || '')}</div><div class="acts"><button class="act pri" data-a="skip">Got it · next</button></div>`); },

  settle(clean) {                       // score + mastery, once per question
    const R = this.round, c = this.cur, it = c.it, m = mast(it.id); let pts = 0;
    if (clean) { R.streak++; R.bestStreak = Math.max(R.bestStreak, R.streak); pts = Math.round((100 + Math.min(100, 10 * (R.streak - 1))) * (c.hinted ? .5 : 1)); } else { R.streak = 0; pts = c.revealed ? 0 : 40; }
    R.score += pts;
    if (c.first) { R.done++; if (clean) R.right++; R.log.push({ it, ok:clean, hinted:c.hinted }); m.s++; m.t = ++S.n; if (clean && !c.hinted) { m.r++; m.b = Math.min(3, m.b + 1); } else if (!clean) { m.w++; m.b = Math.max(0, m.b - 2); R.queue.splice(Math.min(3, R.queue.length), 0, { it, first:false }); } save(); }
    $('#score').textContent = R.score; const s = $('#streak'); s.textContent = '×' + R.streak; s.classList.toggle('on', R.streak > 1); if (clean && R.streak > 1) { s.classList.add('bump'); setTimeout(() => s.classList.remove('bump'), 220); }
    $('#prog i').style.width = (R.done / R.total * 100) + '%';
    return pts;
  },

  choose(btn) {
    const c = this.cur; if (!c || c.answered) return; c.answered = true; const it = c.it, ok = ITEM[btn.dataset.id] === it;
    document.querySelectorAll('#dock .opt').forEach(b => { b.disabled = true; if (ITEM[b.dataset.id] === it) b.classList.add('good'); }); if (!ok) btn.classList.add('bad');
    if (!ok) c.tries = 1;
    const pts = this.settle(ok); this.spot(it, ok ? '#3ddc97' : ACC(), ok ? 'flash' : 'pulse', 1200); callout.show(this.anchor(it), it.name, ok ? 'good' : '', 0);
    if (ok) { sfx.good(); buzz(12); const r = btn.getBoundingClientRect(); popScore(r.left + r.width / 2, r.top, '+' + pts); } else { sfx.bad(); buzz([30, 40, 30]); }
    const d = $('#dock'); d.insertAdjacentHTML('afterbegin', `<div class="fact">${ok ? '' : `You picked <b>${esc(ITEM[btn.dataset.id].name)}</b>. `}<b>${esc(it.name)}</b>${it.alt ? ` (${esc(it.alt)})` : ''} — ${esc(it.fact || '')}</div>`);
    d.insertAdjacentHTML('beforeend', `<div class="acts" style="margin-top:8px"><button class="act pri" data-a="skip">Next</button></div>`); syncDock();
    if (ok) setTimeout(() => this.round && this.cur === c && this.next(), 1500);
  },

  act(a) {
    const c = this.cur;
    if (a === 'skip' && this.tr) { if (c && !c.answered) { c.answered = true; this.traceLock(false); } return this.traceStep(); }
    if (a === 'skip') { if (c && !c.answered) { c.answered = true; c.revealed = true; this.settle(false); } return this.next(); }   // "Show me → Got it" is still a miss on the record
    if (!c || c.answered) return;
    if (a === 'hint' && !this.tr) { c.hinted = true; sfx.tick(); const it = c.it, b = it.on ? it.box : it.box.clone().expandByScalar(Math.max(.12, it.box.getSize(_v).length() * .45)); flyTo(frameBox(b, it.az, it.el == null ? 6 : it.el, 1.1, DECK[it.deck].frame ? DECK[it.deck].frame.min * .8 : .3)); toast('info', 'Closer. It is somewhere in view.<small>Hints halve the points for this one.</small>'); }
    if (a === 'show') { c.tries = Math.max(c.tries, 2); sfx.tick(); this.reveal(); toast(); }
  },

  finish() {
    const R = this.round; $('#prog i').style.width = '100%'; unglow(); clearXray(); setCut(false); ring.hide(); callout.hide(); toast();
    const secs = Math.round((performance.now() - R.t0) / 1000), pct = Math.round(R.right / R.total * 100), prev = S.best[R.key] || 0, best = R.score > prev; if (best) { S.best[R.key] = R.score; save(); }
    const misses = R.log.filter(l => !l.ok), verdict = pct === 100 ? 'Flawless.' : pct >= 80 ? 'Solid.' : pct >= 50 ? 'Getting there.' : 'First pass done.';
    const tip = pct === 100 ? 'Every one first time. Lengthen the round or switch the mode.' : misses.length ? `${misses.length} to tighten — they come back first next round.` : '';
    $('#results').innerHTML = `<div class="rhead"><div class="big" style="--p:${pct}"><b>${pct}%</b></div><div><h2>${verdict}</h2><p>${R.right} of ${R.total} first time. ${tip}</p></div></div>
      <div class="kpis"><div class="kpi"><b>${R.score}</b><small>${best && prev ? 'New best' : 'Score'}</small></div><div class="kpi"><b>×${R.bestStreak}</b><small>Best run</small></div><div class="kpi"><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b><small>Time</small></div></div>
      <ul class="rlist">${R.log.map(l => `<li data-peek="${l.it.id}" class="${l.ok ? '' : 'miss'}"><i>${l.ok ? '✓' : '✕'}</i>${esc(l.it.name)}${l.it.sub ? ` <span style="color:var(--tx3);font-weight:500">(${esc(l.it.sub)})</span>` : ''}<small>${mast(l.it.id).b >= LOCK ? 'locked' : l.hinted && l.ok ? 'with a hint' : ''}</small></li>`).join('')}</ul>
      <div class="acts">${misses.length ? `<button class="act pri" data-r="misses">Drill the ${misses.length} I missed</button>` : `<button class="act pri" data-r="again">Another round</button>`}</div>
      <div class="acts" style="margin-top:8px">${misses.length ? `<button class="act" data-r="again">New round</button>` : ''}<button class="act" data-r="home">Menu</button></div>`;
    this.lastMisses = misses.map(l => l.it); this.cur = null; sfx.done(); setState('results');
    controls.autoRotate = true; flyTo(homeFrame(), 1200);
  },

  /* ── Trace it: tap the structures of a pathway in flow order. One step, one mark — the shape of her ordering questions.
   *    The pathway stands alone in a glass body (x-ray on everything else); each right tap locks that structure in the accent
   *    colour with its number, so by the end the whole route is lit and the results card is the chain written out. ── */
  traces(deck = this.deck) { return (TRACES[deck] || []).map(T => ({ ...T, steps:T.steps.filter(s => ITEM[s.it] && ITEM[s.it].ok) })).filter(T => T.steps.length > 1); },
  trace(deck = this.deck) { const all = this.traces(deck); return all.find(T => T.id === S.o.trace[deck]) || all[0]; },
  startTrace() {
    const T = this.trace(); if (!T) return;
    this.round = null; this.tr = null; pins.clear(); unglow(); clearXray(); setDim(null); callout.hide(); ring.hide(); toast();
    this.xHer = this.xPeel = false; if (T.sex) this.sex = T.sex; setCut(false); setNerves(false); setMeninges(!!T.men); setOpen(!!T.open); applyDeck();
    document.body.dataset.mode = 'trace'; controls.autoRotate = false;
    this.tr = { T, i:-1, right:0, log:[], locked:new Set(), t0:performance.now() };
    if (T.xray !== false) setXray([...T.steps.map(s => s.it), ...(T.context || [])].flatMap(id => ITEM[id] && ITEM[id].ok ? ITEM[id].infos : []));
    $('#score').textContent = '0';
    setState('play'); this.traceStep();
  },
  traceFrame() { const T = this.tr.T, st = this.cur ? this.cur.step : T.steps[0]; return regionFrame(st.region || T.region, st.az == null ? T.az : st.az, st.el == null ? T.el : st.el); },
  traceStep() {
    const tr = this.tr, n = tr.T.steps.length; tr.i++; ring.hide(); callout.hide(); toast();
    if (tr.i >= n) return this.traceFinish();
    const st = tr.T.steps[tr.i], it = ITEM[st.it];
    this.cur = { it, step:st, first:true, tries:0, hinted:false, revealed:false, answered:false, style:'trace', t0:performance.now() };
    $('#barTitle').textContent = `${innerWidth > 520 ? DECK[this.deck].label + ' · ' : ''}Trace it · step ${tr.i + 1} of ${n}`;
    $('#prog i').style.width = (tr.i / n * 100) + '%';
    const P = $('#prompt'); P.classList.remove('swap'); void P.offsetWidth; P.classList.add('swap');
    P.querySelector('.k').textContent = `${tr.T.short} · step ${tr.i + 1} of ${n}`;
    const N = P.querySelector('.n'); N.textContent = st.q; N.classList.add('long');
    P.querySelector('.s').textContent = tr.log.length ? (tr.log.length > 2 ? '… → ' : '') + tr.log.slice(-2).map(l => l.it.name).join(' → ') + ' → ?' : tr.T.ask;
    dock(`<div class="acts"><button class="act" data-a="show">Show me</button></div>`);
    flyTo(this.traceFrame());
  },
  traceTap(hit, x, y) {
    const tr = this.tr, c = this.cur, it = c.it, info = hit.object.userData.info;
    if (isCorrect(it, hit)) {
      c.answered = true; const clean = c.tries === 0 && !c.revealed; this.traceLock(clean);
      sfx.good(); buzz(12); if (clean) popScore(x, y - 30, '+1');
      toast('good', `<b>${tr.i + 1} · ${esc(it.name)}</b><small>${esc(c.step.say)}</small>`);
      return setTimeout(() => this.tr === tr && this.cur === c && this.traceStep(), clean ? 1500 : 1900);
    }
    if (c.revealed) return;
    const d = describe(info, hit.point), at = tr.T.steps.findIndex(s => ITEM[s.it].infos.includes(info));
    c.tries++; if (!tr.locked.has(info)) glow([info], '#ff5d6c', 'flash', 800); callout.show(hit.point, d.title, 'bad', 1600);
    sfx.bad(); buzz([30, 40, 30]); $('#prompt').classList.remove('shake'); void $('#prompt').offsetWidth; $('#prompt').classList.add('shake');
    const where = at < 0 ? 'It is not a step on this path.' : at < tr.i ? 'Already behind you — that was step ' + (at + 1) + '.' : 'On the path, but not yet — it comes later.';
    toast('bad', `That's the <b>${esc(d.title)}</b><small>${where} ${c.tries >= 2 ? 'Here is the next step — tap it to carry on.' : 'One more go.'}</small>`);
    if (c.tries >= 2) this.reveal();
  },
  traceLock(clean) {                    // the step is settled (right, or shown): light it for good and number it
    const tr = this.tr, c = this.cur, it = c.it; if (clean) tr.right++; tr.log.push({ it, ok:clean, say:c.step.say });
    glow(it.infos, ACC(), 'solid'); it.infos.forEach(i => tr.locked.add(i)); pins.add(this.anchor(it), tr.i + 1); callout.hide();
    $('#score').textContent = tr.right; $('#prog i').style.width = ((tr.i + 1) / tr.T.steps.length * 100) + '%';
  },
  traceFinish() {
    const tr = this.tr, n = tr.T.steps.length, pct = Math.round(tr.right / n * 100), key = 'trace.' + tr.T.id, prev = S.best[key] || 0; if (tr.right > prev) { S.best[key] = tr.right; save(); }
    const secs = Math.round((performance.now() - tr.t0) / 1000), verdict = pct === 100 ? 'The whole path, in order.' : pct >= 75 ? 'Nearly the whole path.' : pct >= 40 ? 'Getting there.' : 'First pass done.';
    $('#results').innerHTML = `<div class="rhead"><div class="big" style="--p:${pct}"><b>${tr.right}/${n}</b></div><div><h2>${verdict}</h2><p>${tr.right} of ${n} steps first time, ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}. The list below is the shape of a full-mark answer: one step, one mark.</p></div></div>
      <div class="lbl" style="margin-top:16px">${esc(tr.T.name)} · ${esc(tr.T.ask)}</div>
      <ol class="chain">${tr.log.map((l, k) => `<li data-peek="${l.it.id}" class="${l.ok ? '' : 'miss'}"><i>${k + 1}</i><div><b>${esc(l.it.name)}</b><span>${esc(l.say)}</span></div></li>`).join('')}</ol>
      ${tr.T.note ? `<p class="quiet" style="font-size:12.5px;color:var(--tx3);margin:0 2px 12px">${esc(tr.T.note)}</p>` : ''}
      <div class="acts"><button class="act pri" data-r="again">Trace it again</button><button class="act" data-r="home">Menu</button></div>`;
    this.cur = null; ring.hide(); callout.hide(); toast(); sfx.done(); setState('results');
    controls.autoRotate = true; flyTo(regionFrame(tr.T.region, 60, 12), 1200);
  },

  /* explore */
  explore() {
    const P = $('#prompt'); P.querySelector('.k').textContent = 'Explore'; const n = P.querySelector('.n'); n.textContent = 'Tap anything'; n.classList.remove('long'); P.querySelector('.s').textContent = 'Drag to turn · pinch to zoom';
    $('#barTitle').textContent = `${DECK[this.deck].label} · Explore`; $('#xPeel').hidden = this.deck !== 'muscles'; $('#xCut').hidden = this.deck !== 'brain'; $('#xMen').hidden = !REG.some(i => i.men && DECK[this.deck].bind.includes(i.model)); $('#xMen').textContent = DECK[this.deck].extra || 'Meninges'; $('#xOpen').hidden = !REG.some(i => i.openable && DECK[this.deck].bind.includes(i.model)); $('#xSex').hidden = !DECK[this.deck].sex; $('#xSex').textContent = this.sex === 'female' ? 'Show male' : 'Show female'; $('#xOpen').setAttribute('aria-pressed', 'false'); $('#xOpen').textContent = DECK[this.deck].openLabel || 'Glass chambers'; $('#xCut').setAttribute('aria-pressed', 'false'); $('#xMen').setAttribute('aria-pressed', 'false'); $('#xHer').setAttribute('aria-pressed', 'false'); $('#xPeel').setAttribute('aria-pressed', 'false');
    dock(`<input id="xq" type="search" placeholder="Search this deck…" autocomplete="off" autocapitalize="off" spellcheck="false"><div id="xhits"></div><div id="xbody"><div class="xcard"><p class="quiet">Nothing selected. Tap a ${DECK[this.deck].noun} to see what it is${this.deck === 'bones' ? ' — on the femur and hip bone the landmarks are live too' : ''}, or search for it.</p></div></div>`);
    flyTo(homeFrame(this.deck === 'brain' ? 60 : 15));
  },
  inspect(hit) {
    const info = hit.object.userData.info, d = describe(info, hit.point), it = d.item; unglow();
    const same = it && !it.on ? it.infos : REG.filter(i => i.base === info.base); glow(same, ACC(), 'solid'); callout.show(hit.point, d.title, '', 0); sfx.tick();
    const tags = [d.her ? '<span class="tag her">On her list</span>' : '<span class="tag">Not on her list</span>', it && it.common ? `<span class="tag">${esc(it.common)}</span>` : '', it && it.alt ? `<span class="tag">${esc(it.alt)}</span>` : '', info.made ? '<span class="tag">Schematic</span>' : '', d.sub ? `<span class="tag">${esc(d.sub)}</span>` : ''].join('');
    this.card(`<div class="xcard"><h3>${esc(d.title)}</h3><div class="tags">${tags}</div>${it && it.fact ? `<p>${esc(it.fact)}</p>` : ''}${it && it.clue && it.clue.hers ? `<p class="quiet">Her quiz: “${esc(it.clue.t)}”</p>` : ''}</div>`);
  },
  card(html) { const b = $('#xbody'); if (b) { b.innerHTML = html; const h = $('#xhits'); if (h) h.innerHTML = ''; syncDock(); } else dock(html); },
  search(q) { q = q.trim().toLowerCase(); const hits = q.length < 2 ? [] : DECK[this.deck].items.filter(i => i.ok && [i.name, i.alt, i.common, i.sub].some(s => s && s.toLowerCase().includes(q))).slice(0, 6);
    $('#xhits').innerHTML = hits.map(i => `<button class="chip" data-peek="${i.id}">${esc(i.name)}</button>`).join('') || (q.length < 2 ? '' : '<span class="quiet" style="font-size:12.5px;color:var(--tx3)">Nothing by that name in this deck.</span>'); syncDock(); },
  /* put ONE structure on stage the way its own question would show it, fly to it and light it — from a results row or the Explore search */
  peek(id) { const it = ITEM[id]; if (!it || !it.ok) return; unglow(); clearXray(); ring.hide(); callout.hide(); controls.autoRotate = false;
    setNerves(/^br-cn/.test(it.id) || this.mode === 'explore'); setCut(!!it.cut); setMeninges(it.men || false); setOpen(!!it.open); setPeel(it.peel || null); if (it.sex && it.sex !== this.sex) { this.sex = it.sex; applyDeck(); }
    if (it.deep) setXray(it.infos); this.spot(it, ACC(), 'pulse'); callout.show(this.anchor(it), it.name, '', 0); flyTo(this.itemFrame(it));
    if (document.body.dataset.state === 'play') this.card(`<div class="xcard"><h3>${esc(it.name)}</h3><div class="tags">${it.her ? '<span class="tag her">On her list</span>' : '<span class="tag">Not on her list</span>'}${it.alt ? `<span class="tag">${esc(it.alt)}</span>` : ''}</div>${it.fact ? `<p>${esc(it.fact)}</p>` : ''}${it.clue && it.clue.hers ? `<p class="quiet">Her quiz: “${esc(it.clue.t)}”</p>` : ''}</div>`); },
  toggle(which) {
    if (which === 'her') { this.xHer = !this.xHer; $('#xHer').setAttribute('aria-pressed', this.xHer); const bind = DECK[this.deck].bind; setDim(this.xHer ? (i => !bind.includes(i.model) || i.items.some(x => x.her)) : null); }
    if (which === 'cut') { setCut(!cutOn); $('#xCut').setAttribute('aria-pressed', cutOn); unglow(); callout.hide(); flyTo(regionFrame('brain', cutOn ? 90 : 60, 8)); }
    if (which === 'men') { setMeninges(!menOn); $('#xMen').setAttribute('aria-pressed', menOn); unglow(); callout.hide(); if (this.deck === 'brain') { if (menOn) flyTo(regionFrame('meninges', 60, 35)); } else { setOpen(menOn); $('#xOpen').setAttribute('aria-pressed', openOn); } }
    if (which === 'sex') { this.sex = this.sex === 'female' ? 'male' : 'female'; applyDeck(); $('#xSex').textContent = this.sex === 'female' ? 'Show male' : 'Show female'; unglow(); callout.hide(); flyTo(regionFrame(this.sex === 'female' ? 'rpFemale' : 'rpMale', this.sex === 'female' ? 0 : 100, 8)); }
    if (which === 'open') { setOpen(!openOn); $('#xOpen').setAttribute('aria-pressed', openOn); unglow(); callout.hide(); }
    if (which === 'peel') { this.xPeel = !this.xPeel; $('#xPeel').setAttribute('aria-pressed', this.xPeel); groups.muscular.visible = !this.xPeel; unglow(); callout.hide(); refreshPickables(); invalidate(); }
  },
  reframe() { const st = document.body.dataset.state; if (st === 'home' || st === 'results') flyTo(homeFrame(), 500); else if (this.tr && this.cur) flyTo(this.cur.revealed ? this.itemFrame(this.cur.it) : this.traceFrame(), 400); else if (this.cur) flyTo(this.mode === 'find' && !this.cur.revealed ? regionFrame(this.cur.it.region, this.cur.it.az, this.cur.it.el) : this.itemFrame(this.cur.it), 400); },
};

/* ───────────── UI plumbing ───────────── */
function setState(s) { document.body.dataset.state = s; requestAnimationFrame(syncDock); }
function dock(html) { $('#dock').innerHTML = html; syncDock(); }
function syncDock() { document.body.style.setProperty('--dockH', $('#dock').offsetHeight + 'px'); }
let toastT = 0;
function toast(cls, html) { const t = $('#toast'); clearTimeout(toastT); if (!cls) { t.classList.remove('on'); return; } t.className = cls + ' on'; t.innerHTML = html; if (cls === 'info') toastT = setTimeout(() => t.classList.remove('on'), 2600); }
function showLoader(msg) { const l = $('#loader'); l.querySelector('p').textContent = msg; $('#loadBar').style.width = '6%'; l.classList.remove('out'); }
function hideLoader() { $('#loader').classList.add('out'); }
function loadProg(got, total) { const t = total || (got > 3e6 ? 5.2e6 : 2e6); $('#loadBar').style.width = clamp(got / t * 100, 6, 98) + '%'; $('#loadNote').textContent = (got / 1e6).toFixed(1) + ' MB'; }

const MODES = [['find', 'Find it', 'A name or a clue — you tap it on the body.'], ['name', 'Name it', 'It glows — you pick the name from four. Her test\'s own shape; deep muscles live here.'],
  ['trace', 'Trace it', 'A pathway, in flow order: tap where it starts, then each place it goes next. One step, one mark — her ordering questions.'], ['explore', 'Explore', 'No questions. Tap anything to see what it is.']];
function renderHome() {
  const deckCard = d => { const her = DECK[d].items.filter(i => i.her && (i.ok || !DECK[d].bind.every(m => loaded[m]))), seen = her.some(i => S.m[i.id] && S.m[i.id].s), locked = her.filter(i => S.m[i.id] && S.m[i.id].b >= LOCK).length, p = her.length ? locked / her.length * 100 : 0;
    return `<button class="deck" data-deck="${d}" aria-pressed="${G.deck === d}"><span class="donut" style="--p:${p};--dc:${DECK[d].acc}"><span>${seen ? locked : '–'}</span></span><span><b>${DECK[d].label}</b><small>${seen ? `${locked} of ${her.length} locked` : `${her.length} on her list · not started`}</small></span></button>`; };
  $('#decks').innerHTML = Object.keys(DECK).map(deckCard).join(''); const on = $('#decks [aria-pressed=true]'); if (on && on.scrollIntoView) on.scrollIntoView({ block:'nearest', inline:'nearest' });
  const trs = G.traces(), tracing = G.mode === 'trace' && trs.length > 0; if (G.mode === 'trace' && !tracing) G.mode = 'find';      // a deck with no pathway falls back to Find it
  $('#modes').innerHTML = MODES.map(m => `<button data-mode="${m[0]}" aria-pressed="${G.mode === m[0]}"${m[0] === 'trace' && !trs.length ? ' disabled title="No pathway in this deck yet — Brain has the CSF one"' : ''}>${m[1]}</button>`).join('');
  $('#modeNote').textContent = MODES.find(m => m[0] === G.mode)[2];
  const sets = SETS[G.deck]; if (!sets.some(s => s.id === S.o.set[G.deck])) S.o.set[G.deck] = sets[0].id;
  $('#setHint').parentElement.firstChild.textContent = tracing ? 'Pathway ' : 'What to drill ';
  if (!tracing) $('#sets').innerHTML = sets.map(s => `<button class="chip" data-set="${s.id}" aria-pressed="${S.o.set[G.deck] === s.id}">${s.name}<b>${G.pool(G.deck, s.id).length}</b></button>`).join('');
  $('#setHint').textContent = sets.find(s => s.id === S.o.set[G.deck]).hint;
  const T = tracing && G.trace(); if (T) { $('#sets').innerHTML = trs.map(t => `<button class="chip" data-trace="${t.id}" aria-pressed="${t.id === T.id}">${esc(t.name)}<b>${t.steps.length}</b></button>`).join(''); $('#setHint').textContent = T.hint; }
  $('#lens').innerHTML = [10, 20, 'all'].map(n => `<button data-len="${n}" aria-pressed="${String(S.o.len) === String(n)}">${n === 'all' ? 'All' : n}</button>`).join('');
  $('#asks').innerHTML = [['name', 'Names'], ['mix', 'Mix']].map(a => `<button data-ask="${a[0]}" aria-pressed="${S.o.ask === a[0]}" title="${a[0] === 'mix' ? 'Once you have a name right, it may come back as a common name or one of her clues' : 'Always the proper name'}">${a[1]}</button>`).join('');
  const n = T ? T.steps.length : G.pool().length, ex = G.mode === 'explore';
  $('#go').textContent = ex ? 'Open the body' : T ? `Start · ${n} steps` : n ? `Start · ${S.o.len === 'all' ? n : Math.min(S.o.len, n)} questions` : 'Nothing in this set for this mode';
  $('#go').disabled = !ex && !n; $('#lens').parentElement.parentElement.style.display = ex || T ? 'none' : '';
  const best = S.best[[G.deck, S.o.set[G.deck], G.mode, S.o.len === 'all' ? n : Math.min(S.o.len, n)].join('.')]; $('#foot2').textContent = T ? (S.best['trace.' + T.id] ? `Best: ${S.best['trace.' + T.id]} of ${n} first time` : '') : best ? `Best here: ${best}` : '';
  $('#btnSound').style.opacity = S.o.sound ? 1 : .4;
  requestAnimationFrame(() => G.reframe());
}
$('#home').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.deck) return G.setDeck(b.dataset.deck);
  if (b.dataset.mode) { G.mode = S.o.mode = b.dataset.mode; save(); return renderHome(); }
  if (b.dataset.set) { S.o.set[G.deck] = b.dataset.set; save(); return renderHome(); }
  if (b.dataset.trace) { S.o.trace[G.deck] = b.dataset.trace; save(); return renderHome(); }
  if (b.dataset.len) { S.o.len = b.dataset.len === 'all' ? 'all' : +b.dataset.len; save(); return renderHome(); }
  if (b.dataset.ask) { S.o.ask = b.dataset.ask; save(); return renderHome(); }
  if (b.id === 'go') { tone(1, 1, .01, 'sine', .0001); return G.start(); }
  if (b.id === 'homeHelp') $('#help').classList.add('on');
});
$('#dock').addEventListener('input', e => { if (e.target.id === 'xq') G.search(e.target.value); });
$('#dock').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.peek) return G.peek(b.dataset.peek); if (b.dataset.id) G.choose(b); else if (b.dataset.a) G.act(b.dataset.a); });
$('#results').addEventListener('click', e => { const li = e.target.closest('li[data-peek]'); if (li) return G.peek(li.dataset.peek); const b = e.target.closest('button'); if (!b) return; const r = b.dataset.r; if (r === 'home') goHome(); else if (r === 'misses') G.start(G.lastMisses); else if (r === 'again') G.start(); });
function goHome() { G.round = null; G.cur = null; G.tr = null; pins.clear(); unglow(); clearXray(); setPeel(null); setDim(null); ring.hide(); callout.hide(); toast(); setCut(false); setNerves(false); setMeninges(false); setOpen(false); applyDeck(); setState('home'); controls.autoRotate = true; renderHome(); }
$('#btnHome').onclick = goHome;
$('#btnHelp').onclick = () => $('#help').classList.add('on');
$('#helpClose').onclick = () => $('#help').classList.remove('on');
$('#help').addEventListener('click', e => { if (e.target.id === 'help') $('#help').classList.remove('on'); });
$('#btnSound').onclick = () => { S.o.sound = !S.o.sound; save(); $('#btnSound').style.opacity = S.o.sound ? 1 : .4; if (S.o.sound) sfx.tick(); };
$('#xHer').onclick = () => G.toggle('her'); $('#xPeel').onclick = () => G.toggle('peel'); $('#xCut').onclick = () => G.toggle('cut'); $('#xMen').onclick = () => G.toggle('men'); $('#xOpen').onclick = () => G.toggle('open'); $('#xSex').onclick = () => G.toggle('sex');
addEventListener('keydown', e => { if (document.body.dataset.state !== 'play') return; if (e.key === 'Escape') goHome(); if (G.mode === 'name' && /^[1-4]$/.test(e.key)) { const b = document.querySelectorAll('#dock .opt')[+e.key - 1]; if (b && !b.disabled) G.choose(b); } if ((e.key === 'Enter' || e.key === ' ') && $('#dock [data-a=skip]')) { e.preventDefault(); G.act('skip'); } });

/* ───────────── loop ───────────── */
function frame(now) {
  requestAnimationFrame(frame);
  if ((innerWidth !== resize.w || innerHeight !== resize.h) && innerWidth > 0 && innerHeight > 0) { resize(); G.reframe(); }   // a size change that never sent a resize event (a tab born hidden)
  for (let i = tweens.length - 1; i >= 0; i--) { const t = tweens[i], k = clamp((now - t.t0) / t.dur, 0, 1); t.fn(k); dirty = true; if (k >= 1) { tweens.splice(tweens.indexOf(t), 1); t.done && t.done(); } }
  controls.update();
  if (glows.size) { dirty = true;                       // a glow TINTS the surface as well as lighting it: emissive alone vanishes on ivory bone
    for (const [info, g] of glows) { const age = now - g.t0, m = info.mesh.material;
      const k = g.mode === 'pulse' ? .62 + .3 * Math.sin(now / 170) : g.mode === 'flash' ? Math.max(0, 1 - age / g.dur) : .7;
      m.emissive.copy(g.c).multiplyScalar(k * .42); m.color.copy(info.colour).multiplyScalar(info.dimK || 1).lerp(g.c, k * .78);
      if (g.mode === 'flash' && age > g.dur) { glows.delete(info); rest(info); } } }
  if (!dirty) return; dirty = false;
  renderer.render(scene, camera); place(callout); place(ring); pins.list.forEach(place);
  // the muscle body is 1.9 M triangles: if a phone cannot hold ~30 fps while animating, trade sharpness for smoothness (twice at most)
  const dt = now - perf.last; perf.last = now;
  if (dt < 200) { perf.t += dt; if (++perf.n >= 45) { if (perf.t / perf.n > 34 && perf.downs < 2 && renderer.getPixelRatio() > 1) { renderer.setPixelRatio(Math.max(1, renderer.getPixelRatio() - .5)); perf.downs++; resize(); } perf.n = perf.t = 0; } }
}
const perf = { last:0, t:0, n:0, downs:0 };

/* ───────────── boot ───────────── */
(async function boot() {
  resize();
  if (!DECK[G.deck]) G.deck = S.o.deck = 'bones';
  try { for (const m of Object.keys(DECK[G.deck].models)) { $('#loader p').textContent = MODELS[m].note; await loadModel(m, loadProg); } }
  catch (err) { console.error(err); $('#loader p').textContent = 'The 3D model did not load.'; $('#loadNote').textContent = location.protocol === 'file:' ? 'Open it through a web server (or the live site) — browsers block 3D files on file://.' : String(err.message || err); return; }
  document.body.dataset.deck = G.deck; setNerves(false); setMeninges(false); applyDeck(); setState('home'); renderHome();
  const f = homeFrame(); if (f) { controls.target.copy(f.target); camera.position.copy(f.pos); } controls.autoRotate = true;
  requestAnimationFrame(frame); setTimeout(hideLoader, 150);
})();

/* debug + calibration: ?debug logs every tap as mesh-local 0..1 coordinates */
window.FB = { S, G, REG, ITEM, DECK, TRACES, THREE, setCut, setMeninges, setOpen, setPeel, pins, setXray, clearXray, applyDeck, camera, controls, scene, groups, flyTo, frameBox, regionFrame, pointWorld, cast, toScreen, invalidate,
  local(hit) { const i = hit.object.userData.info, bb = i.mesh.geometry.boundingBox, p = i.mesh.worldToLocal(hit.point.clone()); return { base:i.base, side:i.side, p:[(p.x - bb.min.x) / (bb.max.x - bb.min.x), (p.y - bb.min.y) / (bb.max.y - bb.min.y), (p.z - bb.min.z) / (bb.max.z - bb.min.z)].map(x => +x.toFixed(3)) }; } };
if (DEBUG) canvas.addEventListener('click', e => { const h = cast(e.clientX, e.clientY); if (h) console.log('[fab]', JSON.stringify(window.FB.local(h))); });
