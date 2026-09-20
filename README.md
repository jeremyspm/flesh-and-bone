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
