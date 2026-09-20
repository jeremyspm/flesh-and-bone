/* data-more.js — the decks added after v1: Glands and Brain. Same item schema as data.js, plus:
 *   { mat:/…/, not:/…/ }  a matcher on the SOURCE MATERIAL name — Z-Anatomy files every gyrus and sulcus under
 *                          "Frontal lobe", "Parietal lobe"… so lobe membership is the source's call, not ours.
 *   also:[…]              meshes that are accepted as right in Find it but are not part of the item (a boundary
 *                          sulcus belongs to both lobes it separates).
 *   cut:1                 asked on the brain cut in half (the left hemisphere is hidden, seen from the left).
 *   c:'#hex'              the structure's own colour.
 * Models: glands.glb and brain.glb are cut from the Z-Anatomy source by tools/export_deck.py (same axes as the body).
 * The ovaries are NOT Z-Anatomy (its body is male): they are the HuBMAP CCF reference ovaries (Visible Human
 * female, CC BY 4.0), scaled 1:1 and placed by hand on the lateral pelvic wall — see PLACE below. */

export const GLANDS = [
  { id:'gl-pituitary', name:'Pituitary gland', alt:'Hypophysis', her:1, region:'head', az:90, c:'#ff9f6e',
    m:['adenohypophysis', 'neurohypophysis'],
    clue:{ t:'The gland that hangs under the hypothalamus and takes its orders from it.', hers:1 },
    fact:'Two lobes: the anterior makes its own hormones on the hypothalamus\'s releasing/inhibiting signals; the posterior only stores and releases ADH and oxytocin.' },
  { id:'gl-ant-pituitary', name:'Anterior pituitary', alt:'Adenohypophysis', her:1, deep:1, region:'head', az:90, c:'#ff9f6e',
    m:['adenohypophysis'],
    clue:{ t:'Reached by releasing and inhibiting hormones through the hypophyseal portal system.', hers:1 },
    fact:'Adenohypophysis — glandular. GH, TSH, ACTH, FSH, LH, prolactin. Signalled by blood (portal system), not nerves.' },
  { id:'gl-post-pituitary', name:'Posterior pituitary', alt:'Neurohypophysis', her:1, deep:1, region:'head', az:90, c:'#ffd27a',
    m:['neurohypophysis'],
    clue:{ t:'Releases oxytocin when an infant suckles — a neural stimulus.', hers:1 },
    fact:'Neurohypophysis — nervous tissue. Stores and releases ADH and oxytocin made in the hypothalamus, delivered down axons.' },
  { id:'gl-hypothalamus', name:'Hypothalamus', her:1, region:'head', az:90, c:'#c58cff',
    m:['hypothalamus'],
    clue:{ t:'Monitors the body and controls the pituitary with releasing and inhibiting hormones.', hers:1 },
    fact:'The link between nervous and endocrine systems. Makes ADH and oxytocin; GnRH and TRH are two of its releasing hormones.' },
  { id:'gl-pineal', name:'Pineal gland', alt:'Epiphysis', her:1, region:'head', az:90, c:'#7fd0ff',
    m:['pineal gland'],
    clue:{ t:'Secretes melatonin — it regulates sleep patterns.', hers:1 },
    fact:'Also called the epiphysis; attached to the epithalamus. Melatonin, your body clock.' },
  { id:'gl-thyroid', name:'Thyroid gland', her:1, region:'head', az:0, el:-10, c:'#ff6f91',
    m:['thyroid gland'],
    clue:{ t:'When blood calcium is HIGH, this gland releases calcitonin.', hers:1 },
    fact:'Butterfly on the front of the trachea. T3/T4 set metabolic rate; calcitonin lowers blood calcium (osteoblasts build bone).' },
  { id:'gl-parathyroid', name:'Parathyroid glands', her:1, deep:1, region:'head', az:180, c:'#ffe27a',
    m:[/^(inferior|superior) parathyroid gland$/],
    clue:{ t:'Their hormone stimulates osteoclasts to resorb bone and raise blood calcium.', hers:1 },
    fact:'Four tiny glands on the BACK of the thyroid. PTH raises blood calcium — the opposite of calcitonin.' },
  { id:'gl-thymus', name:'Thymus', region:'trunk', az:0, c:'#9be38a',
    m:[/^(left|right) lobe of thymus$/], fact:'Behind the sternum. Thymosin matures T lymphocytes; large in children, shrinks with age.' },
  { id:'gl-adrenal', name:'Adrenal gland', alt:'Suprarenal gland', her:1, region:'trunk', az:180, c:'#ffb347',
    m:['suprarenal gland'],
    clue:{ t:'Its medulla pours out epinephrine in fight-or-flight — sympathetic nerves, a neural stimulus.', hers:1 },
    fact:'Sits on top of each kidney. Medulla: epinephrine/norepinephrine (short-term stress). Cortex: cortisol, aldosterone (long-term stress).' },
  { id:'gl-pancreas', name:'Pancreas', her:1, region:'trunk', az:0, c:'#f7d06b',
    m:['pancreas'],
    clue:{ t:'Both exocrine (acinar cells, pancreatic juice) and endocrine (islets) in one organ.', hers:1 },
    fact:'She gives nothing for "pancreas" alone — name the cells: ALPHA cells → glucagon (raises glucose), BETA cells → insulin (lowers it).' },
  { id:'gl-ovary', name:'Ovary', her:1, region:'pelvis', az:0, c:'#ff8fc7',
    m:['ovary'],
    fact:'Oestrogen and progesterone. (This one is from a different reference body — HuBMAP\'s female Visible Human — placed by hand: the 3D body here is male.)' },
  { id:'gl-testis', name:'Testis', her:1, region:'pelvis', az:0, el:-10, c:'#8fb8ff',
    m:['testis'], fact:'Testosterone. Testosterone also closes the epiphyseal plates at the end of puberty.' },
  { id:'gl-kidney', name:'Kidney', sub:'not an endocrine gland', her:1, region:'trunk', az:180, c:'#c98a6b',
    m:['kidney'],
    clue:{ t:'Not an endocrine gland — but it contains endocrine tissue that makes erythropoietin.', hers:1 },
    fact:'Like the heart and stomach it holds endocrine tissue without being a gland. Erythropoietin → red cell production.' },
];

/* The ovaries come from another body: where they go in this one (metres, body coordinates; +x = the body's left). */
export const PLACE = { 'ovary.l':[0.047, 0.915, -0.018], 'ovary.r':[-0.047, 0.915, -0.018] };

const LOBE = (name, not) => ({ mat:new RegExp('^' + name + '$'), not });
const CENTRAL = 'central sulcus', LATF = /^lat_fis-/, POS = 'parieto-occipital sulcus';
const CN = (n, roman, id, job) => ({ id:'br-cn' + n, kind:'cn', name:id + ' nerve', sub:'CN ' + roman, her:1, region:'brain', az:0, el:-55, c:'#ffe27a',
  m:[new RegExp('^' + id.toLowerCase() + ' nerve \\(')], fact:'Cranial nerve ' + roman + ' — ' + job });

export const BRAIN = [
  // ── the four lobes (membership = the source's own material) ──
  { id:'br-frontal', kind:'lobe', name:'Frontal lobe', her:1, region:'brain', az:70, el:15,
    m:[LOBE('Frontal lobe', /^(midbrain|corpus callosum)$/)], also:[CENTRAL, LATF],
    fact:'In front of the central sulcus. Motor cortex, Broca\'s area, prefrontal cortex (planning, personality).' },
  { id:'br-parietal', kind:'lobe', name:'Parietal lobe', her:1, region:'brain', az:110, el:30,
    m:[LOBE('Parietal lobe')], also:[CENTRAL, POS, LATF],
    fact:'Behind the central sulcus. Somatosensory cortex — general senses.' },
  { id:'br-temporal', kind:'lobe', name:'Temporal lobe', her:1, region:'brain', az:90, el:-5,
    m:[LOBE('Temporal lobe')], also:[LATF],
    fact:'Below the lateral fissure. Auditory cortex, Wernicke\'s area, memory.' },
  { id:'br-occipital', kind:'lobe', name:'Occipital lobe', her:1, region:'brain', az:160, el:5,
    m:[LOBE('Occipital lobe')], also:[POS, /^anterior occipital sulcus/],
    clue:{ t:'He fell backwards and hit the back of his head — now his vision is affected. Which lobe?', hers:1 },
    fact:'The back of the brain. Visual cortex.' },

  // ── functional areas (her 8-point match + 4-point cloze) ──
  { id:'br-motor', kind:'area', name:'Primary motor cortex', alt:'Precentral gyrus', her:1, region:'brain', az:80, el:35,
    m:['precentral gyrus'], fact:'The gyrus just IN FRONT of the central sulcus. Voluntary movement of the opposite side.' },
  { id:'br-sensory', kind:'area', name:'Somatosensory cortex', alt:'Postcentral gyrus', her:1, region:'brain', az:100, el:35,
    m:['postcentral gyrus'],
    clue:{ t:'The general senses provide its sensory input.', hers:1 },
    fact:'The gyrus just BEHIND the central sulcus. Touch, pain, temperature, proprioception.' },
  { id:'br-broca', kind:'area', name:'Broca\'s area', her:1, region:'brain', az:70, el:0,
    m:[/^(opercular|triangular) part of inferior frontal gyrus$/],
    fact:'Inferior frontal gyrus, usually the LEFT hemisphere. MOTOR speech — producing words. (Wernicke = understanding them.)' },
  { id:'br-wernicke', kind:'area', name:'Wernicke\'s area', her:1, on:'superior temporal gyrus (lateral part)', p:[0.5,0.55,0.18], zone:n => n[2] < 0.42, region:'brain', az:100, el:0,
    clue:{ t:'Sensory for speech — understanding language.', hers:1 },
    fact:'The BACK of the superior temporal gyrus, usually the left hemisphere. Sensory speech area: understanding words.' },
  { id:'br-auditory', kind:'area', name:'Primary auditory cortex', her:1, deep:1, region:'brain', az:90, el:10,
    m:['transverse temporal gyri', 'temporal plane'],
    fact:'Transverse temporal gyri — tucked inside the lateral fissure on top of the temporal lobe, which is why it needs the x-ray.' },
  { id:'br-visual', kind:'area', name:'Primary visual cortex', her:1, region:'brain', az:175, el:0,
    m:['occipital pole', 'cuneus', 'lingual gyrus', 'calcarine sulcus'],
    clue:{ t:'The functional area in the occipital lobe.', hers:1 },
    fact:'Around the calcarine sulcus at the very back of the occipital lobe.' },
  { id:'br-prefrontal', kind:'area', name:'Prefrontal cortex', her:1, region:'brain', az:20, el:10,
    m:['superior frontal gyrus', 'middle frontal gyrus', /^transverse frontopolar/, /^orbital gyri/, /^straight gyrus/],
    fact:'The front of the frontal lobe, ahead of the motor areas. Planning, judgement, personality.' },
  { id:'br-central-sulcus', name:'Central sulcus', deep:1, region:'brain', az:90, el:40, m:[CENTRAL],
    fact:'A sulcus is a furrow, a gyrus a ridge. This furrow divides frontal from parietal — motor cortex in front, sensory behind.' },
  { id:'br-insula', kind:'lobe', name:'Insula', deep:1, region:'brain', az:90, m:[/^insula /], fact:'The lobe hidden deep inside the lateral fissure.' },

  // ── regions ──
  { id:'br-cerebellum', name:'Cerebellum', her:1, region:'brain', az:160, el:-15, m:[{ mat:/^Cerebellum$/ }],
    fact:'Under the occipital lobes. Balance, posture, smooth coordinated movement.' },
  { id:'br-brainstem', kind:'stem', name:'Brainstem', her:1, cut:1, region:'brain', az:90, el:-10,
    m:['midbrain', 'pons', 'medulla oblongata', 'pyramid of medulla oblongata', 'olive', 'base of peduncle', /colliculus$/],
    fact:'Midbrain + pons + medulla oblongata, top to bottom.' },
  { id:'br-medulla', kind:'stem', name:'Medulla oblongata', her:1, cut:1, region:'brain', az:90, el:-15,
    m:['medulla oblongata', 'pyramid of medulla oblongata', 'olive'], fact:'The lowest part of the brainstem, continuous with the spinal cord. Heart rate, breathing, blood pressure centres.' },
  { id:'br-pons', kind:'stem', name:'Pons', her:1, cut:1, region:'brain', az:90, el:-10, m:['pons'], fact:'The bulge in the middle of the brainstem — a bridge between cerebrum and cerebellum.' },
  { id:'br-midbrain', kind:'stem', name:'Midbrain', her:1, cut:1, region:'brain', az:90, el:-5, m:['midbrain', 'base of peduncle', /colliculus$/], fact:'Top of the brainstem. Carries the four colliculi on its back.' },
  { id:'br-sup-colliculus', kind:'stem', name:'Superior colliculus', her:1, deep:1, cut:1, region:'brain', az:120, el:10, m:['superior colliculus'],
    clue:{ t:'Visual reflexes — turning your head to look at a light.', hers:1 }, fact:'Upper pair of bumps on the back of the midbrain: visual reflexes.' },
  { id:'br-inf-colliculus', kind:'stem', name:'Inferior colliculus', her:1, deep:1, cut:1, region:'brain', az:120, el:10, m:['inferior colliculus'],
    clue:{ t:'Auditory reflexes — turning your head toward a sound.', hers:1 }, fact:'Lower pair of bumps on the back of the midbrain: auditory reflexes.' },
  { id:'br-diencephalon', kind:'dien', name:'Diencephalon', her:1, cut:1, region:'brain', az:90, m:['thalamus', 'hypothalamus', 'pineal gland', 'habenula', 'mamillary body'],
    fact:'Thalamus + hypothalamus + epithalamus (pineal). The core between the hemispheres.' },
  { id:'br-thalamus', kind:'dien', name:'Thalamus', her:1, cut:1, region:'brain', az:90, m:['thalamus'], fact:'The relay station — almost all sensory input passes through it on the way to the cortex.' },
  { id:'br-hypothalamus', kind:'dien', name:'Hypothalamus', her:1, cut:1, region:'brain', az:90, el:-10, m:['hypothalamus'],
    fact:'Below the thalamus. Homeostasis, and the boss of the pituitary.' },
  { id:'br-pituitary', kind:'dien', name:'Pituitary gland', her:1, cut:1, region:'brain', az:90, el:-15, m:['adenohypophysis', 'neurohypophysis'], fact:'Hangs from the hypothalamus by a stalk.' },
  { id:'br-pineal', kind:'dien', name:'Pineal gland', her:1, cut:1, region:'brain', az:100, m:['pineal gland'],
    clue:{ t:'Near the back of the midbrain: your body clock and sleep.', hers:1 }, fact:'Melatonin. Part of the epithalamus.' },
  { id:'br-callosum', name:'Corpus callosum', cut:1, region:'brain', az:90, m:['corpus callosum'], fact:'The thick band of white matter joining the two hemispheres.' },
  { id:'br-lat-ventricle', kind:'csf', name:'Lateral ventricle', her:1, deep:1, region:'brain', az:70, el:10, m:['lateral ventricle'], fact:'One in each hemisphere. Their choroid plexuses make most of the CSF.' },
  { id:'br-third-ventricle', kind:'csf', name:'Third ventricle', her:1, deep:1, cut:1, region:'brain', az:90, m:['third ventricle'], fact:'The slit between the two thalami. CSF arrives from the lateral ventricles.' },
  { id:'br-aqueduct', kind:'csf', name:'Cerebral aqueduct', alt:'Aqueduct of midbrain', her:1, deep:1, cut:1, region:'brain', az:90, m:['aqueduct of midbrain'], fact:'The narrow canal through the midbrain, third → fourth ventricle.' },
  { id:'br-fourth-ventricle', kind:'csf', name:'Fourth ventricle', her:1, deep:1, cut:1, region:'brain', az:100, el:-10, m:['fourth ventricle'], fact:'Between the pons/medulla and the cerebellum. From here CSF escapes into the subarachnoid space.' },
  { id:'br-choroid', kind:'csf', name:'Choroid plexus', her:1, deep:1, region:'brain', az:70, el:10, m:['choroid plexus'],
    clue:{ t:'The structures in the ventricles that MAKE cerebrospinal fluid.', hers:1 }, fact:'Makes CSF. (Arachnoid villi absorb it back into the blood.)' },
  { id:'br-hippocampus', name:'Hippocampus', deep:1, region:'brain', az:90, el:-20, m:['hippocampus'], fact:'Deep in the temporal lobe. Forming new memories.' },
  { id:'br-amygdala', name:'Amygdala', deep:1, region:'brain', az:90, el:-20, m:['amygdaloid body'], fact:'Almond at the tip of the hippocampus. Fear and emotion.' },
  { id:'br-basal', name:'Basal nuclei', deep:1, region:'brain', az:80, el:10, m:['caudate nucleus', 'putamen', 'globus pallidus', 'lentiform nucleus'], fact:'Caudate + putamen + globus pallidus, deep in each hemisphere. Smooth out movement.' },
  { id:'br-chiasm', name:'Optic chiasm', region:'brain', az:0, el:-60, m:['optic chiasm'], fact:'Where the two optic nerves cross, just in front of the pituitary stalk.' },

  // ── the twelve cranial nerves (her ANS question keys III, VII, IX and X as the cranial parasympathetic outflow) ──
  CN(1, 'I', 'Olfactory', 'smell.'), CN(2, 'II', 'Optic', 'vision.'), CN(3, 'III', 'Oculomotor', 'most eye movements; pupil constriction (parasympathetic).'),
  CN(4, 'IV', 'Trochlear', 'one eye muscle (superior oblique).'), CN(5, 'V', 'Trigeminal', 'sensation of the face; chewing.'), CN(6, 'VI', 'Abducens', 'turns the eye outward.'),
  CN(7, 'VII', 'Facial', 'facial expression, taste; tears and saliva (parasympathetic).'), CN(8, 'VIII', 'Vestibulocochlear', 'hearing and balance.'),
  CN(9, 'IX', 'Glossopharyngeal', 'swallowing, taste; parotid saliva (parasympathetic).'), CN(10, 'X', 'Vagus', 'the wanderer — parasympathetic supply to heart, lungs and gut.'),
  CN(11, 'XI', 'Accessory', 'sternocleidomastoid and trapezius.'), CN(12, 'XII', 'Hypoglossal', 'moves the tongue.'),
];

/* ── Nerves: the big named peripheral nerves, inside a ghost skeleton. nerves.glb (358 KB) = the source's CURVE objects.
 *    The PHRENIC nerve (cervical plexus → diaphragm) is the one her plexus question keys that the source does not model. ── */
const NV = (id, name, region, az, extra) => ({ id:'nv-' + id, name, region, az, c:'#ffe27a', m:[name.toLowerCase()], ...extra });
export const NERVES = [
  NV('sciatic', 'Sciatic nerve', 'lower', 180, { her:1,
    clue:{ t:'The nerve that could be damaged by an injection into the gluteus maximus.', hers:1 },
    fact:'The major nerve of the SACRAL plexus and the thickest nerve in the body; down the back of the thigh, then splits into tibial and common fibular.' }),
  NV('femoral', 'Femoral nerve', 'lower', 0, { her:1,
    clue:{ t:'The major nerve of the lumbar plexus.', hers:1 },
    fact:'Major nerve of the LUMBAR plexus. Front of the thigh — supplies the quadriceps.' }),
  NV('ulnar', 'Ulnar nerve', 'upper', 160, { her:1,
    clue:{ t:'The "funny bone" is really this nerve, running over the medial epicondyle of the humerus.', hers:1 },
    fact:'Brachial plexus. Little-finger side of the arm; unprotected behind the medial epicondyle.' }),
  { id:'nv-vagus', name:'Vagus nerve', sub:'CN X', her:1, region:'upper', az:25, c:'#ffe27a', m:[/^vagus nerve \(/],
    clue:{ t:'Cranial nerve X — the cranial parasympathetic outflow to the heart, lungs and gut.', hers:1 },
    fact:'"The wanderer": leaves the skull and runs down through the neck and chest to the abdomen. Parasympathetic (with III, VII, IX).' },
  { id:'nv-brachial-plexus', name:'Brachial plexus', region:'upper', az:0, c:'#ffc857', m:[/brachial plexus$/],
    fact:'Roots → trunks → divisions → cords, C5–T1, passing under the clavicle to the arm. Gives the median, ulnar, radial, axillary and musculocutaneous nerves.' },
  NV('median', 'Median nerve', 'upper', 0, { fact:'Brachial plexus. Down the middle of the forearm, through the carpal tunnel.' }),
  NV('radial', 'Radial nerve', 'upper', 180, { fact:'Brachial plexus. Spirals round the back of the humerus — extensors of the arm and forearm.' }),
  NV('axillary', 'Axillary nerve', 'upper', 160, { fact:'Brachial plexus. Wraps the neck of the humerus to the deltoid — the nerve to keep clear of in a deltoid injection.' }),
  NV('musculocutaneous', 'Musculocutaneous nerve', 'upper', 0, { fact:'Brachial plexus. Biceps brachii and brachialis.' }),
  NV('tibial', 'Tibial nerve', 'lower', 180, { fact:'The larger branch of the sciatic nerve, down the back of the leg to the sole.' }),
  NV('common-fibular', 'Common fibular nerve', 'lower', 150, { fact:'The smaller branch of the sciatic nerve; winds round the neck of the fibula.' }),
  NV('obturator', 'Obturator nerve', 'lower', 0, { fact:'Lumbar plexus. Through the obturator foramen to the adductors of the thigh.' }),
  NV('pudendal', 'Pudendal nerve', 'pelvis', 180, { fact:'Sacral plexus (S2–S4). The perineum.' }),
  { id:'nv-intercostal', name:'Intercostal nerves', region:'trunk', az:30, c:'#ffe27a', m:['intercostal nerves'], fact:'Run under each rib — the thoracic spinal nerves; they do not form a plexus.' },
];

export const MORE_REGIONS = {
  brain: { model:'brain', m:[{ mat:/lobe$|^Cerebellum$|^Brain$|^Interlobar sulci$|^Insula$/ }], pad:1.12, min:0.05 },
};

export const MORE_SETS = {
  nerves: [
    { id:'her', name:'Her list', hint:'Sciatic · femoral · ulnar · vagus (the phrenic nerve is not in the 3D source)', f:i => i.her },
    { id:'all', name:'Everything', hint:'All of it', f:() => true },
  ],
  glands: [
    { id:'her', name:'Her list', hint:'The glands on her label-the-glands figure, and their hormones', f:i => i.her },
    { id:'all', name:'Everything', hint:'All of it', f:() => true },
  ],
  brain: [
    { id:'her',    name:'Her list',          hint:'Lobes, functional areas and the regions she asks', f:i => i.her && !/^br-cn/.test(i.id) },
    { id:'areas',  name:'Lobes & areas',     hint:'The outside of the brain', f:i => /^br-(frontal|parietal|temporal|occipital|motor|sensory|broca|wernicke|auditory|visual|prefrontal|central-sulcus|insula)$/.test(i.id) },
    { id:'inside', name:'Inside (cut)',      hint:'Brainstem, diencephalon, ventricles', f:i => !!i.cut || /ventricle|choroid|hippocampus|amygdala|basal|cerebellum/.test(i.id) },
    { id:'cn',     name:'Cranial nerves',    hint:'All twelve, from below', f:i => /^br-cn/.test(i.id) },
    { id:'all',    name:'Everything',        hint:'All of it', f:() => true },
  ],
};
