# Flesh & Bone

A 3D bone and muscle trainer. One real body you can turn and zoom; three modes.

- **Find it** — a name, a common name or a clue; you tap the structure on the body. Two misses and it
  lights up; tap it to carry on. The miss comes back three questions later.
- **Name it** — a structure glows, you pick the name from four. Deep muscles (diaphragm, erector
  spinae, vastus intermedius, rotator cuff) are asked here only, with the body x-rayed around them.
- **Explore** — no questions. Tap anything; landmarks on the femur and hip bone are live too.

Built September 2026 because the only anatomy games on the web are Flash-era. No build step, no account, no network at runtime: open `index.html` from any static host.

## "Her list"

The default scope is every bone and muscle that is an **answer** somewhere in the HS2 (722.541)
Module 2 quiz bank — 471 questions, keys read by hand. It comes to about 32 bones, 10 landmarks and
30 muscles, not "200". Items carry `her:1` in [data.js](data.js); clues with `hers:1` are paraphrased
from her own questions ("the only bone that does not articulate with any other"). Distractors in
Name-it copy her habit of same-first-letter traps (cranium / carpal / clavicle / condyle).

## How it is put together

```
index.html   shell + all CSS
app.js       scene, picking, camera framing, the three modes, scoring, persistence (localStorage fab.v1)
data.js      what is asked: items → mesh-name matchers, clues, camera angles, landmark geometry
models/      skeletal.glb (1.9 MB) · muscular.glb (5 MB) — Z-Anatomy exports, Draco-compressed
vendor/three three 0.183 + GLTFLoader / DRACOLoader / OrbitControls + the Draco decoder
```

Things that are not obvious from the code:

- **Items match the ORIGINAL node names.** three's GLTFLoader renames nodes (`Eighth rib.l` →
  `Eighth_ribl`) but keeps the source name in `userData.name`; everything matches against that.
  An item that matches no mesh logs a console warning and is dropped from every pool.
- **Landmarks are measured, not eyeballed.** Left and right bones are one mesh mirrored, so a point in
  the mesh's own 0..1 bounding-box coordinates lands on both. Head of femur = a least-squares sphere
  fit (r 24.7 mm); trochanters and condyles = vertex-cluster centroids; ilium / ischium / pubis = the
  Voronoi cells of their three centroids; iliac crest = within 1.6 cm of the top-edge profile. The
  acetabulum is deliberately **neutral** — all three bones meet in it, so a tap there is explained
  and not counted.
- **The rectus sheath is cut away.** In the model, as in life, the oblique aponeuroses run in front of
  rectus abdominis to the midline, so the six-pack was 0 % tappable. `CLIP` in data.js clips the two
  oblique meshes inside |x| < 8.6 cm — for the eye (a material clipping plane) and for the tap (the
  raycast skips clipped hits). Textbook figures do the same.
- **Hidden on purpose:** fasciae, bursae, tendon sheaths, retinacula, platysma, temporoparietalis and
  the iliotibial tract — each one wraps something that is being asked.
- **Every findable item was checked for reach.** For each item the page sampled its vertices from the
  camera angle in data.js and ray-cast back: the share that comes back as the item itself is how much
  of it a finger can hit. Angles were chosen from that scan (soleus 95°, gluteus medius 130°,
  brachialis 90°, serratus anterior 30°); anything unreachable is `deep:1`.
- **Rendering is on demand.** Nothing draws unless the camera, a tween or a glow is moving. If a phone
  cannot hold ~30 fps while animating, the pixel ratio steps down (twice at most).
- **A tab born hidden is 0×0.** Framing a camera against that writes NaN into it for good, so framing
  refuses a zero viewport and the loop re-frames when a real size arrives.

`window.FB` exposes the internals for poking; `?debug` logs each tap as mesh-local 0..1 coordinates,
which is how a new landmark gets its numbers.

## Progress

The ring on each deck is how many of her list are **locked**: right first time, twice running. A miss
takes two steps back. Rounds deal the least-locked, least-recently-seen first. Nothing is due and
nothing expires — deliberately no streaks or backlog.

## Licence & credit

Meshes: **[Z-Anatomy](https://www.z-anatomy.com/)** (derived from BodyParts3D), used under
**[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)** — recoloured, regrouped and
partly hidden here; the credit line in the help sheet is the licence requirement, do not remove it.
Rendering: [three.js](https://threejs.org/) (MIT). A study aid, not a clinical reference.

## Decks added 20 Sep (evening): Glands and Brain

- **Glands** — her label-the-glands figure in 3D: pituitary (both lobes), hypothalamus, pineal, thyroid, parathyroids,
  thymus, adrenals, pancreas, ovaries, testes, plus the kidney as the "not a gland, but makes erythropoietin" item. The
  skeleton is a ghost for context (unpickable). `models/glands.glb` is 159 KB, cut from the Z-Anatomy source by
  `tools/export_deck.py` (Blender, headless) with the same export settings as the big models, so it sits in the body exactly.
- **The ovaries are not Z-Anatomy** (its body is male). They are the HuBMAP CCF 3D reference ovaries — Visible Human
  female, **CC BY 4.0**, files unmodified (`models/hra-ovary-*.glb`, 9 KB each) — and are **placed by hand** on the
  lateral pelvic wall (`PLACE` in data-more.js). Right organ, approximate position; the app says so in the fact line and help.
- **Brain** — `models/brain.glb` (1.9 MB): cortex, cerebellum, brainstem, diencephalon, ventricles, deep nuclei and all
  twelve cranial nerves. Lobe membership is the source's own: Z-Anatomy files every gyrus and sulcus under a material named
  for its lobe, so items match on `{ mat }`. Boundary furrows (central sulcus, lateral fissure, parieto-occipital sulcus)
  are `also`-accepted for both lobes they divide. The cortex is one colour on purpose — tinting lobes would leak the answer.
  Wernicke's area is a zone on the back 42 % of the superior temporal gyrus (checked: its vertices average 4 cm behind the rest).
- **The cut**: hemispheres are separate `.l`/`.r` meshes, so hiding every left-side mesh and looking from the left IS a
  mid-sagittal section. Items flagged `cut:1` are asked that way. Ventricles are drawn as glass and a tap passes through
  them unless a ventricle is what was asked (otherwise the third ventricle hides the thalamus).
- **The multi-primitive trap, met for real**: every gyrus is a node with two primitives (outer skin + a "Brain-Inner" face).
  three turns that into a Group whose child meshes carry no source name and no side — the loader now walks up to the parent
  for the name and gives both siblings the outer material's identity.
- Cranial nerves are long tubes (the vagus reaches the abdomen): on stage only when they are the question, or in Explore.

`docs/source/` lists every object in the Z-Anatomy source; note it is MESH objects only — the source also has 951 CURVE
objects (nerves, vessels), all of which are already in the exported models (checked by name).
- **Nerves** (added the same night) — `models/nerves.glb`, 358 KB: sciatic, femoral, tibial, common fibular, obturator, pudendal,
  median, ulnar, radial, axillary, musculocutaneous, intercostal nerves, the brachial plexus and the vagus, in a ghost skeleton.
  They are CURVE objects in the source; `tools/export_deck.py` exports curves as tubes. Her plexus question keys phrenic, femoral
  and sciatic — **the phrenic nerve is the one the source does not model**, and the deck's hint says so.

## Added 21 Sep: the meninges (built, not loaded) and Trace it

- **The meninges are a declared schematic** ([made.js](made.js)). Z-Anatomy has the dural sinuses and folds but not the three
  layers. They are concentric shells, so they are generated from the brain itself: the cerebrum's outer envelope is measured
  (farthest cortex vertex per 2° of direction, max-filtered to bridge the sulci, blurred), and four slabs are stacked on it —
  pia · subarachnoid space · arachnoid · dura — each cut back further than the one below, so one corner reads as a staircase.
  Thickness is exaggerated (~11 mm for a real ~4 mm) and the app says "schematic" in the prompt, the facts, Explore and help.
  A built mesh goes through `register()` and gets a normal registry entry (source material `Schematic`), so every mode runs
  on it unchanged. They are on stage only when asked (`men:1`), like the cranial nerves.
- **The superior sagittal sinus was level with the gyral crowns** in the source (floor −0.3 mm against the envelope: the model
  gives skull and dura no thickness). It is a real mesh moved straight outward, every vertex along its own radius by the same
  ~7 mm, until its floor rests on the schematic arachnoid — inside the dura, above the arachnoid, villi pushing into it. The
  fact line says it was moved. `brain.glb` was re-exported with it (`tools/export_deck.py`).
- **Trace it** — a fourth mode. A pathway (`TRACES` in data-more.js) is an ordered list of item ids; you tap where it starts,
  then each place it goes next. The pathway stands alone in a glass brain (x-ray on everything else), each right tap locks
  the structure in the accent colour with a numbered pin, a wrong tap says whether that structure is behind you, ahead of
  you or not on the path, and two misses show the step. The results card is the chain written out — one step, one line:
  the shape of her ordering answers. The CSF path's eight steps use her wording only; the foramina and apertures are not
  steps she asks, so they are not steps here.
- **What is inside glass wins the tap**: the choroid plexus hangs inside the lateral ventricle, which is drawn as glass while
  tracing. `cast()` prefers a hit on the plexus up to 3 cm behind a hit on the ventricle's wall (`INSIDE`).
- **A deck can set its own Name-it frame** (`DECK.brain.frame`): the 34 cm minimum that suits a body left the brain 75 px
  wide on a phone.
- `docs/autoplayer.js` has a `'trace'` mode: every step ray-cast and tapped, step 3 missed twice on purpose.
  Reach at 375×812: dura 91 %, arachnoid 40 %, subarachnoid 29 %, pia 26 %, villi 67 %, sinus 15 % (a 4 mm tube, framed close).
