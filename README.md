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

## Added 21 Sep: Circle of Willis

- `models/willis.glb` (132 KB): the 18 vessels of the ring and its feeders, cut from the source's cardiovascular CURVE objects by
  `tools/export_deck.py willis`. Shown under a **ghost brain** (`models:{ brain:'ghost', willis:'solid' }`), seen from below with
  the frontal lobes at the top — her MCQ keys the circle as being on the **ventral** side. "Her list" = the vessels her question
  names (anterior communicating, anterior cerebral, internal carotid, posterior communicating, posterior cerebral, basilar; carotids
  from the front, vertebrals from the back). The middle cerebral artery is in "Everything" only: not part of the ring.
- A deck may set `view:[az, el]` (how it looks at rest — this one from below) and `frame:{ pad, min }` (its Name-it framing).
- **The accent is ice blue on purpose**: the first build used a red accent and the glow on a red artery was invisible.
- Reach at 375×812, each from its own angle: 75–91 % (posterior communicating lowest: two 2 cm links).
- **Bug fixed in passing (it was live in the Brain deck):** `setNerves` / `setCut` returned early when the flag already had the
  wanted value, so a brain that loaded AFTER boot (open on Bones, switch to Brain) never heard "nerves off" and the twelve cranial
  nerves stayed on stage in every question. The stage toggles no longer trust their own memory.
- Six decks: on a phone the deck cards are one swipeable row, which gives ~150 px of stage back.

## Added 21 Sep: Neuron (a built schematic) and the impulse trace

- [made-neuron.js](made-neuron.js) builds a neuron and one synapse from three.js primitives: soma (glass, nucleus inside), seven
  forking dendrite trunks (seeded, so it is the same neuron every load), axon hillock, axon, five Schwann cells with nuclei, the
  nodes of Ranvier as the bare axon between them, four terminal buttons, and ONE terminal repeated enlarged beside them as the
  synapse: vesicles, presynaptic membrane, cleft (glass), receptors on the postsynaptic membrane, the next cell. 15 named meshes,
  ~34k triangles, 50 ms to build, no download. `MODELS.neuron.make` instead of a file; parts go through `register()`.
- The parts are **her ten-point match** and every clue is her own definition of that part. The tenth term, *action potential*,
  is a process, not a place: it is the **Trace** (dendrites -> soma -> hillock -> axon -> node of Ranvier -> terminals ->
  presynaptic membrane -> cleft -> postsynaptic membrane), each line in her words. `xray:false` on a trace = nothing is ghosted.
- One cell, one colour: soma, dendrites, hillock, axon, nodes and terminals share a colour so the boundaries are shape, not paint.
  Nothing is lettered (her figure letters its parts its own way). The prompt and help say **schematic - not to scale**.
- "What is inside glass wins the tap" is now a table (`INSIDE`: plexus in ventricle, nucleus in soma, vesicles in terminal) and
  has an exception that matters: **not when the container is what was asked** (a tap on the soma over its nucleus is the soma).
- Reach at 375x812: dendrites 91, soma 85, nucleus 97, hillock 41 (its top is inside the soma), Schwann 92, node 68, terminals 90,
  presynaptic 61, cleft 56, postsynaptic 31 (its face is under the cleft; the rim and edge are what you tap). The axon's own mesh is
  8 % because it runs inside the Schwann cells - the nodes are `also`-accepted for it, and the bare ends are tappable.

## Added 21 Sep: Tissues - three of her labelled figures, built

- [made-tissues.js](made-tissues.js): a **synovial joint** (lathe-turned bone ends, cartilage shells, glass synovial fluid, the capsule
  opened 124 degrees at the front with the synovial membrane as its inner surface, a ligament strap, epiphyseal plates), **compact bone**
  (three osteons as telescopes of lamellae round a central canal; lacunae as glass pits with an osteocyte inside, canaliculi radiating;
  artery + vein in the big one) and **skeletal muscle** pulled apart level by level (epimysium > perimysium/fascicle > endomysium/fibre >
  sarcolemma > myofibrils). 23 named meshes, ~39k triangles, ~70 ms, no download. The three stand side by side; each question flies to
  its own figure (regions `tsJoint`, `tsBone`, `tsOsteon`, `tsMuscle`, `tsFibre`).
- The parts are the blanks of HER figures: joint = her six-blank label question; bone = her six-key cloze; muscle = her four-key cloze.
  The synovial membrane is in "Everything" because it is the wrong option in her MCQ (it, not the cartilage, secretes the fluid).
- `Fascicle` also accepts the perimysium and `Muscle fibre` also accepts the sarcolemma: tapping the wrapped bundle IS finding the bundle.
- Reach at 375x812 (own + accepted meshes): 17-99 %. The low ones are honest: bone 17 % (most of its vertices lie under cartilage; the
  shafts are the target), sarcolemma 19 % (a 3.6 cm band on a pulled-out fibre, framed close), canaliculi 22 % (hair-thin, but dozens).

## Added 21 Sep: the six neuroglia (in the Neuron deck)

- [made-glia.js](made-glia.js), model `glia`, bound into the Neuron deck beside the neuron (a deck may bind several models). Each cell
  is drawn by the ONE feature that tells it apart, because that is what her figure question tests: astrocyte = end-feet on a capillary;
  oligodendrocyte = one cell wrapping three different axons; microglia = small and thorny; ependymal cells = a ciliated row on a CSF
  space; satellite cells = a ring round a ganglion cell body; Schwann cells = one segment of one axon each. CNS group on top, PNS below.
- Clues are her six-point match ("which cell does what"), so with Ask-by = Mix the FUNCTION is the prompt and the cell is the answer.
- Context meshes (capillary, axons, CSF, ganglion cell body) are tappable in Explore and never asked. 18/18 neuron-deck items pass by tap.

## Added 21 Sep: Heart (Module 1) - real heart, glass chambers, a built conduction system, two traces

- `models/heart.glb` (604 KB, `tools/export_deck.py heart`): four chambers, valve leaflets, papillary muscles, the aorta and its arch
  branches, pulmonary trunk/arteries/veins, venae cavae, jugular/subclavian/brachiocephalic veins, coronaries + coronary sinus, and
  the lung lobes as context. "Her list" = the heart keys of the 363-question Module 1 bank, read by hand (see the header in data-more.js).
- **Glass chambers** (`openable` + `setOpen`): when what is asked lies INSIDE (a valve, the papillary muscles: `open:1`) the four
  chambers and the two great roots become glass and a tap passes through them; what is inside an opened chamber wins the tap. The
  lungs are permanently glass at .1 and pass taps unless they are the question (they are one step of the blood trace).
- **All four chambers are ONE colour**: red-left / blue-right would hand over the answer. Vessels are coloured by what they carry, so
  the pulmonary ARTERY is blue and the pulmonary VEINS red - which is itself one of her favourite traps.
- **The conduction system is BUILT** ([made-heart.js](made-heart.js)) - the source has none. Placed by measurement on this heart's own
  meshes: SA node at the lowest ring of the SVC, AV node between the two AV valves, His down the first fifth of the AV-node-to-apex
  line, a branch each side of it, Purkinje fibres from each branch's foot up the inside of that ventricle's free wall. On stage only
  when asked (`men:1`, the same switch as the meninges), declared schematic in the prompt.
- **Two traces**: blood through the heart in the thirteen steps of her fill-in-the-blanks sequence (her valve names), and the impulse
  SA -> AV -> His -> bundle branches -> Purkinje (her ordering question; the ECG lines are from her ECG matches).
- Find it 34/34 + Name it 35/35 by real taps at 375x812; the left coronary trunk hides behind the pulmonary trunk, so it is `deep:1`.

**Gate trap found here: `node --check file.js` is a FALSE PASS for these ES modules** (exit 0 on a file with a swallowed brace - a `//`
comment added mid-line ate the rest of the line and the app would not boot). Use `node --input-type=module --check < file.js`.

## Added 21 Sep: Airway (Module 1)

- `models/airway.glb` (832 KB): the respiratory model + pharynx, soft palate, uvula, epiglottis, tongue (from digestive), thyroid and
  cricoid cartilage + hyoid (skeletal) and the diaphragm (muscular), in a ghost skeleton. Her figure keys are the list: larynx,
  oropharynx, palate, trachea, right/left primary bronchus, middle lobe of right lung, left lung, diaphragm, and the carina
  (a measured point: the centroid of the trachea mesh's lowest 3 % of vertices). **Nostril, nasal cavity, bronchioles and alveoli are
  not in the source** and the deck says so rather than faking them.
- The lobes reuse the heart's glass switch (`openable`): when a bronchus is asked they turn to glass and pass the tap.
- Trace "A breath in": pharynx -> larynx -> trachea -> primary -> lobar -> segmental bronchi. Declared in its note as standard
  anatomical order: she has NO ordering question on this in the Module 1 bank.
- Find it 19/19 + Name it 20/20 by real taps at 375x812; the epiglottis is inside the throat, so it is `deep:1`.

## Added 21 Sep: Eye & Ear (Module 3) - both built, from HER revision slides

- Source of the list: her Module 3 revision deck ("2019 Revision mod 3 22 slide2.pptx", posted 20 Sep; slides 15-21), read as text.
  Her Canvas quizzes on these had not been sat yet, so `her:1` in this deck means "on her revision slides", and the header says so.
- [made-eye.js](made-eye.js): the source lacks the choroid, ciliary body, pupil, macula, optic disc and canal of Schlemm, so the whole
  eye is generated. Every coat is a body of revolution about the optical axis with ONE quarter removed toward the viewer
  (`PHI0`/`LEN`), and each body gets flat caps on both cut planes (`ShapeGeometry` of its own profile) - LatheGeometry leaves them open.
  So the two cut faces show sclera > choroid > retina in order and you look in at the macula and optic disc. The lens is whole.
  The humors are `soft` (fluid: glass, and a tap passes through unless a humor was asked). **The coats are 8-10 mm thick on a 10 cm
  eye** - the first build used 4 mm and the reach scan put the choroid at 4 %: a phone finger cannot hit a 7 px strip.
  `grow` lets a part stand proud of the cut faces: the canal of Schlemm lies INSIDE the sclera's profile, so its caps were coplanar
  with the sclera's and it could not be seen or tapped at all.
- [made-ear.js](made-ear.js): left to right = outside to inside = her numbered sound path. The canal is opened along its length so
  the eardrum shows; the vestibule is glass with utricle and saccule inside (`INSIDE`); three canals with ampullae; a 2.6-turn cochlea.
- Traces: sound (her slide 19 numbering) and light through the refractive media (her 80 % / 20 % split).
- 30/30 Find it + 30/30 Name it + both traces by real taps at 375x812.

**Second trap of the day, same family as the false `node --check`: a `//` comment inserted MID-LINE by a search-and-replace comments out
the rest of that line.** It broke the app once (a swallowed brace) and silently dropped a statement twice (valid syntax, so no parser
can catch it) - one of them had been live since v1: `controls.zoomSpeed/rotateSpeed/panSpeed` sat behind a comment. Rule: a
replacement never ends in `// ...` unless it replaces a whole line; and the files were scanned for code after `//`.

## Added 21 Sep: Reproductive (Module 3) - two bodies, one pelvis

- **Male** = `models/male.glb` (72 KB, `tools/export_deck.py male`): the source body's own organs + bladder and urethra.
  **Female** = HuBMAP CCF 3D reference organs (Visible Human female, **CC BY 4.0**, files unmodified, downloaded 21 Sep with his OK
  from `cdn.humanatlas.io/digital-objects/ref-organ/<organ>/v1.2/assets/`): `hra-uterus.glb` (980 KB), `hra-tube-l/r.glb`, and
  the two ovaries already in the repo. The HuBMAP organs share one frame, so `MODELS.female.shift` moves them as ONE set: the
  midpoint of the two ovaries goes to the midpoint the Glands deck gave them by hand. Relative positions real, pelvic position
  approximate - the help sheet says exactly that. (`PLACE` is skipped for a shifted model: it had pulled the ovaries out of the set.)
  `MODELS.x.hide` drops the uterus sub-regions that overlap its body (walls, cornua, lower segment).
- Only one body is on stage at a time (`DECK.repro.sex` + `G.sex`): the question's `sex` decides, Explore has a Show male/female switch.
- Her list = her Module 3 revision slides 2 and 5. Not in either source, and said so: vagina, uterine ligaments, the three uterine
  layers, bulbo-urethral glands. The urethra runs inside the corpus spongiosum (1 % reach), so the spongiosum is `also`-accepted.
- Traces: the sperm's path (her duct sequence, with the glands' shares of the semen) and the egg's path.
- 19/19 Find it, 13/13 Name it (her list), both traces by real taps at 375x812.
