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
  // ── her brain-terminology match and lab MCQs: the vocabulary, asked as "tap any one of them" (findOnly: glowing ALL of them in Name it would mean nothing) ──
  { id:'br-gyrus', kind:'vocab', name:'A gyrus', her:1, findOnly:1, region:'brain', az:80, el:25, m:[{ mat:/lobe$/, not:/^(midbrain|corpus callosum)$|^(?!.*gyr).*(sulc|fis)/ }],
    clue:{ t:'A ridge on the surface of the brain. (Tap any one.)', hers:1 }, fact:'Gyrus = ridge (plural gyri). Sulcus = furrow. The folding packs more cortex into the skull.' },
  { id:'br-sulcus', kind:'vocab', name:'A sulcus', her:1, nameOnly:1, region:'brain', az:80, el:25, m:[/sulc/, /^lat_fis/, { mat:/^Interlobar sulci$/ }],
    clue:{ t:'A furrow on the surface of the brain.', hers:1 }, fact:'(A furrow is too thin for a finger — 3 % reach — so the furrows are lit and YOU name them.) Sulcus = furrow (plural sulci); a deep one is a fissure. The central sulcus and the lateral fissure are the two you must know.' },
  { id:'br-grey', kind:'vocab', name:'Grey matter', sub:'the cerebral cortex', her:1, findOnly:1, region:'brain', az:60, el:20, m:[{ mat:/lobe$/, not:/^(midbrain|corpus callosum)$/ }],
    clue:{ t:'The tissue made of neuronal cell bodies — the surface layer of the cerebrum. (Tap anywhere on it.)', hers:1 }, fact:'Grey = neuron cell bodies (unmyelinated). The cerebral cortex is grey matter — and the seat of the conscious mind.' },
  { id:'br-white', kind:'vocab', name:'White matter', her:1, cut:1, region:'brain', az:90, m:['white matter of telencephalon', 'corpus callosum'],
    clue:{ t:'The tissue that consists of myelinated axons.', hers:1 }, fact:'White = myelinated axons (myelin is fatty, hence white), deep to the cortex. The corpus callosum is the biggest single band of it. In the cerebellum it branches like a tree: the arbor vitae.' },
  { id:'br-fissure', kind:'vocab', name:'Longitudinal fissure', her:1, men:'fis', stage:'a fissure is a gap — it is marked here with a thin plate', region:'brain', az:10, el:55, m:['longitudinal fissure'],
    clue:{ t:'The line that separates the brain into two halves.', hers:1 }, fact:'The deep groove between the left and right cerebral hemispheres. The falx cerebri (a fold of dura) hangs in it; the corpus callosum bridges its floor.' },
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
  // ── meninges + where CSF goes back to blood. The four layers and the villi are BUILT (made.js) — declared schematic wherever asked ──
  { id:'br-dura', kind:'men', name:'Dura mater', her:1, men:1, region:'meninges', az:60, el:35, m:['dura mater'],
    clue:{ t:'Tough fibrous connective tissue forming a double membrane — the outermost of the three.', hers:1 },
    fact:'Outermost, against the skull. Tough and DOUBLE (periosteal + meningeal layers); the dural venous sinuses run between the two. (Schematic layer.)' },
  { id:'br-arachnoid', kind:'men', name:'Arachnoid mater', her:1, men:1, region:'meninges', az:60, el:35, m:['arachnoid mater'],
    clue:{ t:'The cobweb-like middle layer; its granulations reabsorb CSF into the bloodstream.', hers:1 },
    fact:'The middle layer. Web-like trabeculae cross the CSF-filled space beneath it; its villi poke up into the sagittal sinus. (Schematic layer.)' },
  { id:'br-subarachnoid', kind:'men', name:'Subarachnoid space', her:1, men:1, region:'meninges', az:60, el:35, m:['subarachnoid space'],
    clue:{ t:'Cerebrospinal fluid circulates in this space (and in the central canal).', hers:1 },
    fact:'Between arachnoid and pia, full of CSF — the cushion the brain floats in. A bleed here = a sudden severe headache with vomiting. (Schematic layer.)' },
  { id:'br-pia', kind:'men', name:'Pia mater', her:1, men:1, region:'meninges', az:60, el:35, m:['pia mater'],
    clue:{ t:'The delicate innermost membrane that follows the convolutions of the brain.', hers:1 },
    fact:'Innermost — stuck to the brain surface, the shiny covering you see in the lab. Rich in blood vessels; follows them into the choroid plexuses. (Schematic layer.)' },
  { id:'br-villi', kind:'men', name:'Arachnoid villi', alt:'arachnoid granulations', her:1, men:1, region:'villi', az:70, el:30, m:['arachnoid villi'],
    clue:{ t:'The structures that absorb CSF into the sagittal sinus.', hers:1 },
    fact:'Tufts of arachnoid pushing through the dura into the superior sagittal sinus: CSF goes back into venous blood here. (Schematic, placed under the real sinus.)' },
  { id:'br-sss', kind:'men', name:'Superior sagittal sinus', her:1, men:1, pin:'top', region:'villi', az:70, el:30, m:['superior sagittal sinus'],
    fact:'A dural venous sinus running front to back along the top of the brain, between the two layers of the dura. The villi empty CSF into it. (Real mesh, moved out 7 mm so it sits inside the schematic dura.)' },
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
  { id:'nv-phrenic', name:'Phrenic nerve', her:1, region:'upper', az:20, c:'#ffb347', m:['phrenic nerve'],
    clue:{ t:'The major nerve of the cervical plexus.', hers:1 },
    fact:'C3, C4, C5 — to the diaphragm, so a high neck injury stops breathing. SCHEMATIC: the 3D source has no phrenic nerve, so its course is drawn here (orange) from the neck, past the heart, to the diaphragm.' },
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

/* ── Circle of Willis: willis.glb (132 KB, 18 vessels cut from the source's cardiovascular curves), under a ghost brain, from below.
 *    Her MCQ lists the ring as: anterior communicating, anterior cerebral, internal carotid, posterior communicating, posterior
 *    cerebral and basilar arteries — "carotid arteries from the anterior side join up with vertebral arteries from the posterior
 *    side", on the VENTRAL side of the brain; berry aneurysms form here. The middle cerebral artery is not in her list. ── */
const WL = (id, name, extra) => ({ id:'wl-' + id, name, region:'willis', az:0, el:-62, m:[name.toLowerCase()], ...extra });
export const WILLIS = [
  WL('acom', 'Anterior communicating artery', { her:1,
    fact:'The short bridge between the two anterior cerebral arteries — it closes the FRONT of the ring. The commonest site of a berry aneurysm.' }),
  WL('aca', 'Anterior cerebral artery', { her:1,
    fact:'Runs forward and up between the hemispheres: medial surface of the frontal and parietal lobes (leg area of the motor cortex).' }),
  WL('ica', 'Internal carotid artery', { her:1, region:'willisAll', az:25, el:-25,
    clue:{ t:'The arteries that feed the circle from the ANTERIOR side.', hers:1 },
    fact:'Up the front of the neck and through the skull base. Each one feeds the ring and continues as the middle cerebral artery.' }),
  WL('pcom', 'Posterior communicating artery', { her:1,
    fact:'Joins the carotid (front) system to the posterior cerebral artery (back) on each side — the SIDES of the ring. This link is why one blocked artery can be compensated for.' }),
  WL('pca', 'Posterior cerebral artery', { her:1,
    fact:'The two end branches of the basilar artery — the BACK of the ring. Occipital lobe: a stroke here affects vision.' }),
  WL('basilar', 'Basilar artery', { her:1,
    fact:'Formed where the two vertebral arteries join; runs up the front of the pons and splits into the posterior cerebral arteries.' }),
  WL('vertebral', 'Vertebral artery', { her:1, region:'willisAll', az:160, el:-15,
    clue:{ t:'The arteries that join the circle from the POSTERIOR side.', hers:1 },
    fact:'Up through the cervical vertebrae on each side, in through the foramen magnum; the two join to make the basilar artery.' }),
  { id:'wl-mca', name:'Middle cerebral artery', region:'willis', az:0, el:-62, m:[/^middle cerebral artery/, /^insular branches of middle cerebral artery/],
    fact:'The biggest branch of the internal carotid: the lateral surface of the hemisphere — face and arm motor/sensory cortex, Broca and Wernicke. NOT part of the ring, but the artery most often blocked in a stroke.' },
];

/* ── Neuron: BUILT (made-neuron.js), a declared schematic. Parts and clues are her ten-point match ("Link the definitions to the
 *    terms"): soma · Schwann cell · node of Ranvier · dendrites · axons · axon hillock · presynaptic membrane · postsynaptic membrane ·
 *    axon terminals (+ action potential, which is a process, not a place — it is the Trace). The synaptic cleft is a key in her cloze. ── */
const NR = (id, name, region, m, extra) => ({ id:'nr-' + id, name, region, az:0, el:4, m, ...extra });
export const NEURON = [
  NR('dendrites', 'Dendrites', 'nrTop', ['dendrites'], { her:1,
    clue:{ t:'A short branched extension of a nerve cell.', hers:1 }, fact:'Short and branched — the receiving end. They carry the signal TOWARD the soma.' }),
  NR('soma', 'Soma', 'nrTop', ['soma'], { her:1, alt:'cell body',
    clue:{ t:'Contains a nucleus, mitochondria and endoplasmic reticulum.', hers:1 }, fact:'The cell body. Grey matter is grey because it is made of these (white matter = myelinated axons).' }),
  NR('nucleus', 'Nucleus', 'nrTop', ['nucleus'], { fact:'Inside the soma. Mature neurons do not divide, which is why damage is so often permanent.' }),
  NR('hillock', 'Axon hillock', 'nrTop', ['axon hillock'], { her:1,
    clue:{ t:'The region where nerve impulses are generated.', hers:1 }, fact:'The cone where the axon leaves the soma: the action potential starts here.' }),
  NR('axon', 'Axon', 'nrAxon', ['axon'], { her:1, also:['node of ranvier'],
    clue:{ t:'Usually long and single — it conducts impulses AWAY from the soma.', hers:1 }, fact:'One per neuron, and it can be a metre long. Away from the soma, toward the terminals.' }),
  NR('schwann', 'Schwann cell', 'nrAxon', ['schwann cell', 'schwann cell nucleus'], { her:1, alt:'myelin sheath',
    clue:{ t:'Contains a nucleus and produces the myelin sheath in the PNS.', hers:1 }, fact:'Wraps the axon in myelin in the PNS. In the CNS the same job is done by oligodendrocytes.' }),
  NR('node', 'Node of Ranvier', 'nrAxon', ['node of ranvier'], { her:1,
    clue:{ t:'A periodic gap in the insulating myelin sheath on the axon.', hers:1 }, fact:'The bare axon between two Schwann cells. The impulse leaps node to node — saltatory conduction, which is why myelinated axons are fast.' }),
  NR('terminals', 'Axon terminals', 'nrEnd', ['axon terminals'], { her:1, alt:'telodendria',
    clue:{ t:'Button-like endings of axons through which they make synaptic contact with other cells.', hers:1 }, fact:'When the impulse arrives, calcium channels open here. (The big one beside them is one terminal, enlarged.)' }),
  NR('presyn', 'Presynaptic membrane', 'synapse', ['presynaptic membrane'], { her:1, el:10,
    clue:{ t:'Releases neurotransmitters through exocytosis.', hers:1 }, fact:'The terminal\'s face at the synapse. Calcium in → vesicles fuse with it → neurotransmitter out (exocytosis).' }),
  NR('cleft', 'Synaptic cleft', 'synapse', ['synaptic cleft'], { her:1, el:10,
    clue:{ t:'The gap the neurotransmitter diffuses across.', hers:1 }, fact:'The fluid-filled gap between the two cells. Neurotransmitter crosses it by diffusion.' }),
  NR('postsyn', 'Postsynaptic membrane', 'synapse', ['postsynaptic membrane', 'receptors'], { her:1, el:10,
    clue:{ t:'Neurotransmitter receptors are present here.', hers:1 }, fact:'The receiving cell\'s membrane. Its receptors bind the neurotransmitter, which excites or inhibits the cell.' }),
  NR('vesicles', 'Synaptic vesicles', 'synapse', ['synaptic vesicles'], { el:10, fact:'Little bags of neurotransmitter waiting in the terminal — acetylcholine at parasympathetic endings and neuromuscular end-plates.' }),
];

/* ── Neuroglia: BUILT (made-glia.js), in the Neuron deck. Clues are her six-point match, word for word in substance
 *    ("Make use of the given information to find the matching pairs"). CNS group on top, PNS group below. ── */
const NG = (id, name, region, m, clue, fact, extra) => ({ id:'ng-' + id, kind:'glia', name, her:1, region, az:0, el:4, m, clue:{ t:clue, hers:1 }, fact, ...extra });
NEURON.push(
  NG('astro', 'Astrocytes', 'gliaCNS', ['astrocyte'], 'Structural and supporting; communicates between the nervous system and the blood, in the CNS.',
    'Star-shaped, with end-feet on the capillaries: they help form the blood-brain barrier (with the ependymal cells, in her cloze).'),
  NG('oligo', 'Oligodendrocytes', 'gliaCNS', ['oligodendrocyte'], 'Myelination of axons in the CNS.',
    'ONE cell wraps segments of SEVERAL axons — that is how you tell it from a Schwann cell. White matter of the CNS.'),
  NG('micro', 'Microglia', 'gliaCNS', ['microglia'], 'Transform into phagocytes — they clean up nervous system debris, in the CNS.',
    'Small, with thorny processes. The immune defence of the CNS: they phagocytose bacteria, viruses and debris.'),
  NG('epen', 'Ependymal cells', 'gliaCNS', ['ependymal cells', 'ependymal nuclei'], 'Secrete and move CSF through the ventricles and central canal, in the CNS.',
    'Ciliated cells lining the ventricles. Specialised ones (the choroid plexuses) make CSF; the cilia keep it moving.'),
  NG('sat', 'Satellite cells', 'gliaPNS', ['satellite cells'], 'Structural support and communication, in the PNS.',
    'Flattened cells surrounding neuron cell bodies in a ganglion — the PNS counterpart of the astrocyte.'),
  NG('schwann', 'Schwann cells', 'gliaPNS', ['schwann cells', 'schwann cell nuclei'], 'Myelination of axons in the PNS.',
    'Each one wraps ONE segment of ONE axon; the gaps between them are the nodes of Ranvier.'),
);

/* ── Tissues: three of her figures, BUILT (made-tissues.js), declared schematics.
 *    Synovial joint — her six blanks: articular cartilage · epiphyseal plate · synovial fluid · ligament · joint capsule · bone
 *      (her MCQ: A = "hyaline cartilage; facilitates smooth frictionless movement"; D = "joint capsule strengthened by a ligament").
 *    Compact bone — her cloze keys: Haversian canal · lacunae · osteocytes · arteries · veins · canaliculi.
 *    Skeletal muscle — her cloze keys: sarcolemma · endomysium · fascicle · epimysium. ── */
const TS = (id, kind, name, region, az, el, m, extra) => ({ id:'ts-' + id, kind, name, region, az, el, m, ...extra });
export const TISSUES = [
  TS('cartilage', 'joint', 'Articular cartilage', 'tsJoint', 0, 4, ['articular cartilage'], { her:1, alt:'hyaline cartilage',
    clue:{ t:'Hyaline cartilage on the bone ends — it facilitates smooth, frictionless movement.', hers:1 }, fact:'Hyaline cartilage capping both bone ends. It is what wears away in osteoarthritis, exposing the vascular bone beneath.' }),
  TS('plate', 'joint', 'Epiphyseal plate', 'tsJoint', 0, 4, ['epiphyseal plate'], { her:1, alt:'growth plate',
    fact:'The band of hyaline cartilage across the end of a growing long bone — where it lengthens. Testosterone and oestrogen close it at the end of puberty.' }),
  TS('fluid', 'joint', 'Synovial fluid', 'tsJoint', 0, 4, ['synovial fluid'], { her:1,
    fact:'Fills the joint cavity and lubricates the joint. It is secreted by the synovial membrane — not by the cartilage.' }),
  TS('ligament', 'joint', 'Ligament', 'tsJoint', 50, 4, ['ligament'], { her:1,
    clue:{ t:'The band that strengthens the joint capsule, bone to bone.', hers:1 }, fact:'Bone to BONE (a tendon is muscle to bone). It reinforces the capsule.' }),
  TS('capsule', 'joint', 'Joint capsule', 'tsJoint', 105, 4, ['joint capsule'], { her:1,
    fact:'The fibrous sleeve enclosing the whole joint, strengthened by ligaments. Opened at the front here so you can see inside.' }),
  TS('jbone', 'joint', 'Bone', 'tsJoint', 0, 4, ['bone'], { her:1, fact:'The two articulating bones. A synovial joint (diarthrosis) is freely movable.' }),
  TS('membrane', 'joint', 'Synovial membrane', 'tsJoint', 0, 4, ['synovial membrane'], {
    fact:'The inner lining of the capsule. IT secretes the synovial fluid — the wrong option in her MCQ gives that job to the cartilage.' }),

  TS('osteon', 'bone', 'Osteon', 'tsBone', 20, 38, ['lamellae', 'central canal'], { her:1, alt:'Haversian system',
    fact:'The unit of compact bone: lamellae in concentric circles around a central canal.' }),
  TS('canal', 'bone', 'Central canal', 'tsBone', 20, 50, ['central canal'], { her:1, alt:'Haversian canal',
    clue:{ t:'The canal at the centre of each osteon, which the lamellae circle.', hers:1 }, fact:'Haversian canal. It carries the arteries, veins (and nerves) that supply the osteon.' }),
  TS('lamellae', 'bone', 'Lamellae', 'tsBone', 20, 38, ['lamellae'], { fact:'Concentric rings of bone matrix — a very orderly tissue. Drawn here as a telescope so each ring shows.' }),
  TS('lacunae', 'bone', 'Lacunae', 'tsOsteon', 20, 55, ['lacunae'], { her:1,
    clue:{ t:'The small spaces in which the bone cells are found.', hers:1 }, fact:'Little spaces between the lamellae. Each one holds an osteocyte.' }),
  TS('osteocytes', 'bone', 'Osteocytes', 'tsOsteon', 20, 55, ['osteocytes'], { her:1,
    clue:{ t:'The bone cells, sitting in their spaces, tasked with maintaining bone tissue.', hers:1 }, fact:'Mature bone cells, one in each lacuna. (Osteoblasts build, osteoclasts resorb, osteocytes maintain.)' }),
  TS('canaliculi', 'bone', 'Canaliculi', 'tsOsteon', 20, 55, ['canaliculi'], { her:1,
    clue:{ t:'The small canals in the lamellae that keep the bone tissue connected and perfused.', hers:1 }, fact:'Hair-fine canals joining lacuna to lacuna and to the central canal, so every osteocyte is fed.' }),
  TS('artery', 'bone', 'Artery', 'tsOsteon', 20, 30, ['artery'], { her:1, sub:'in the central canal',
    fact:'In the Haversian canal: brings nutrients and oxygen to the osteocytes.' }),
  TS('vein', 'bone', 'Vein', 'tsOsteon', 20, 30, ['vein'], { her:1, sub:'in the central canal', fact:'In the Haversian canal: takes waste away.' }),

  TS('epimysium', 'muscle', 'Epimysium', 'tsMuscle', 0, 22, ['epimysium'], { her:1,
    clue:{ t:'The sheath that holds the various fascicles together — around the whole muscle.', hers:1 }, fact:'EPI = upon: the outer wrapping of the whole muscle.' }),
  TS('perimysium', 'muscle', 'Perimysium', 'tsMuscle', 0, 22, ['perimysium'], { fact:'PERI = around: the wrapping of each fascicle.' }),
  TS('fascicle', 'muscle', 'Fascicle', 'tsMuscle', 0, 40, ['fascicle'], { her:1, also:['perimysium'],
    clue:{ t:'A bundle of muscle fibres held together.', hers:1 }, fact:'A bundle of muscle fibres. Many fascicles make the muscle. (One is pulled out here.)' }),
  TS('endomysium', 'muscle', 'Endomysium', 'tsFibre', 0, 25, ['endomysium'], { her:1,
    clue:{ t:'The fine sheath that holds the individual muscle fibres together within a fascicle.', hers:1 }, fact:'ENDO = within: the wrapping of each single muscle fibre.' }),
  TS('fibre', 'muscle', 'Muscle fibre', 'tsFibre', 0, 50, ['muscle fibre'], { alt:'muscle cell', also:['sarcolemma'], fact:'One muscle CELL — long, cylindrical, many nuclei. It is packed with myofibrils.' }),
  TS('sarcolemma', 'muscle', 'Sarcolemma', 'tsFibre', 0, 15, ['sarcolemma'], { her:1,
    clue:{ t:'The cell membrane that surrounds a skeletal muscle fibre.', hers:1 }, fact:'The muscle fibre\'s own cell membrane — inside the endomysium.' }),
  TS('myofibrils', 'muscle', 'Myofibrils', 'tsFibre', 0, 15, ['myofibrils'], { fact:'The contractile threads inside the fibre, made of sarcomeres (actin + myosin) end to end.' }),
];

/* ── Layers (Module 1), BUILT in made-figures.js and bound into the Tissues deck. Her 7-point match on the vessel figure: Artery · Vein ·
 *    Capillary · Valve · Tunica externa · Tunica media · Tunica interna. Her cloze keys on the heart wall: "epicardium or visceral
 *    pericardium" · myocardium · endocardium; her lab MCQ keys the visceral pericardium against parietal pericardium / the two pleurae. ── */
const WA = (id, kind, name, region, az, el, m, extra) => ({ id:'wl2-' + id, kind, name, her:1, region, az, el, m, ...extra });
TISSUES.push(
  WA('artery', 'vessel', 'Artery', 'wlVessels', 0, 25, [/ of artery$/, 'blood in the artery'], { fact:'Carries blood AWAY from the heart, under pressure: the THICKEST tunica media, a small round lumen, no valves.' }),
  WA('vein', 'vessel', 'Vein', 'wlVessels', 0, 25, [/ of vein$/, 'blood in the vein'], { fact:'Carries blood TOWARD the heart at low pressure: the thinnest tunica media, a wide lumen — and valves to stop backflow.' }),
  WA('capillary', 'vessel', 'Capillary', 'wlVessels', 0, 10, ['capillary'], { fact:'One cell thick — endothelium only (a tunica interna and nothing else), so exchange can happen. Continuous in the brain, fenestrated in the kidney, sinusoidal in bone marrow.' }),
  WA('valve', 'vessel', 'Valve', 'wlVessels', 0, 35, ['valve'], { clue:{ t:'Found in veins, to prevent the backflow of blood.', hers:1 }, fact:'Folds of the tunica interna. Arteries do not need them; veins (especially in the legs) do.' }),
  WA('externa', 'vessel', 'Tunica externa', 'wlVessels', 0, 25, [/^tunica externa/], { alt:'tunica adventitia', fact:'The OUTER coat: collagen fibres that anchor and protect the vessel.' }),
  WA('media', 'vessel', 'Tunica media', 'wlVessels', 0, 25, [/^tunica media/], { clue:{ t:'Of the blood vessel wall components, the one most critical in regulating systemic blood pressure.', hers:1 }, fact:'The MIDDLE coat: smooth muscle and elastin. Vasoconstriction and vasodilation happen here.' }),
  WA('interna', 'vessel', 'Tunica interna', 'wlVessels', 0, 25, [/^tunica interna/], { alt:'tunica intima', fact:'The INNER coat: endothelium, slick so blood does not clot on it. It is the only coat a capillary has.' }),
  WA('fibrous', 'hwall', 'Fibrous pericardium', 'wlHeart', 0, 25, ['fibrous pericardium'], { her:0, fact:'The tough outer bag: anchors the heart and stops it over-filling.' }),
  WA('parietal', 'hwall', 'Parietal pericardium', 'wlHeart', 0, 25, ['parietal pericardium'], { fact:'The serous layer lining the inside of the fibrous bag.' }),
  WA('cavity', 'hwall', 'Pericardial cavity', 'wlHeart', 0, 25, ['pericardial cavity'], { her:0, fact:'The slit between the parietal and visceral layers, with a film of serous fluid so the beating heart slides without friction.' }),
  WA('epi', 'hwall', 'Epicardium', 'wlHeart', 0, 25, ['epicardium'], { alt:'visceral pericardium', clue:{ t:'The membrane that covers the heart and gives it a shiny appearance.', hers:1 }, fact:'Epicardium = VISCERAL pericardium: the same layer, two names — her cloze accepts either. It is the outer layer of the heart wall itself.' }),
  WA('myo', 'hwall', 'Myocardium', 'wlHeart', 0, 25, ['myocardium'], { clue:{ t:'The heart muscle — the layer the coronary arteries supply.', hers:1 }, fact:'The thick MIDDLE layer: cardiac muscle, branched cells joined by intercalated discs with gap junctions. Thickest in the left ventricle.' }),
  WA('endo', 'hwall', 'Endocardium', 'wlHeart', 0, 25, ['endocardium'], { clue:{ t:'The smooth inner lining of the heart chambers and valves.', hers:1 }, fact:'The INNER layer: endothelium, continuous with the lining of the blood vessels.' }),
);

/* ── Heart (Module 1): heart.glb (832 KB) cut from the source's cardiovascular model. "Her list" = the keys of the 363-question
 *    M1 bank, read by hand: her four valve labels (pulmonary semilunar, tricuspid, aortic semilunar, mitral), her numbered-diagram
 *    matches (aortic arch, left ventricle, right atrium, aorta, pulmonary artery, left pulmonary vein, SVC, IVC, brachiocephalic
 *    artery, left common carotid, pulmonary veins, papillary muscle), her MCQ keys (right subclavian; jugular → subclavian vein) and
 *    her cloze keys (LAD = the widow maker; coronary sinus → right atrium; papillary muscles). `open:1` = asked with glass chambers.
 *    The conduction system is BUILT (made-heart.js): her labelled figure, twice, and her ordering question, twice. ── */
const HT = (id, kind, name, az, el, m, extra) => ({ id:'ht-' + id, kind, name, region:'heart', az, el, m, ...extra });
const COND = { her:1, men:1, open:1, stage:'schematic · placed on the real heart · chambers shown as glass' };
export const HEART = [
  HT('ra', 'chamber', 'Right atrium', 330, 5, ['right atrium'], { her:1, fact:'Receives deoxygenated blood from the superior and inferior venae cavae and the coronary sinus.' }),
  HT('rv', 'chamber', 'Right ventricle', 10, 0, ['right ventricle'], { her:1,
    clue:{ t:'The pumping force that drives the blood through the PULMONARY circulation.', hers:1 }, fact:'Most of the FRONT of the heart. Pumps to the lungs only, so its wall is thinner than the left.' }),
  HT('la', 'chamber', 'Left atrium', 180, 10, ['left atrium'], { her:1, fact:'On the BACK of the heart. Receives oxygenated blood from the four pulmonary veins — where the pulmonary circulation ends.' }),
  HT('lv', 'chamber', 'Left ventricle', 60, 0, ['left ventricle'], { her:1,
    clue:{ t:'The pumping force that drives the blood through the SYSTEMIC circulation.', hers:1 }, fact:'Forms the apex. The thickest wall: it pumps to the whole body. Stroke volume and cardiac output are measured from HERE.' }),

  HT('tricuspid', 'valve', 'Tricuspid valve', 20, 0, [/leaflet of right atrioventricular valve$/], { her:1, open:1, alt:'right atrioventricular valve',
    fact:'Between right atrium and right ventricle. Three cusps, anchored by chordae tendineae to the papillary muscles.' }),
  HT('mitral', 'valve', 'Mitral valve', 100, 0, [/leaflet of left atrioventricular valve$/], { her:1, open:1, alt:'bicuspid · left atrioventricular valve',
    clue:{ t:'The left atrioventricular valve — thicker than the right, made of two flaps or cusps.', hers:1 }, fact:'Between left atrium and left ventricle. Two cusps. If it leaks, blood returns to the left atrium when the ventricles contract: a murmur.' }),
  HT('pulm-valve', 'valve', 'Pulmonary semilunar valve', 20, 10, [/leaflet of pulmonary valve$/], { her:1, open:1,
    clue:{ t:'Between the right ventricle and the pulmonary artery: it stops blood on its way to the lungs from returning to the right ventricle.', hers:1 }, fact:'Three half-moon cusps at the root of the pulmonary trunk.' }),
  HT('aortic-valve', 'valve', 'Aortic semilunar valve', 40, 10, [/^(left coronary|right coronary|non-coronary) leaflet$/], { her:1, open:1,
    fact:'Three half-moon cusps at the root of the aorta. The coronary arteries open (the ostia) just above two of them.' }),
  HT('papillary', 'valve', 'Papillary muscles', 30, -5, [/papillary muscle of/], { her:1, open:1,
    clue:{ t:'The atrioventricular valves are anchored by chordae tendineae to these, in the wall of the heart.', hers:1 }, fact:'They pull on the chordae tendineae so the AV valves cannot blow back into the atria when the ventricles contract.' }),

  // ── asked on the SECTION (the heart cut open like her figure): the walls between chambers are where the two hollow chambers touch ──
  { id:'ht-ivs', kind:'wall', name:'Interventricular septum', her:1, section:1, between:['left ventricle', 'right ventricle'], t:.007, region:'heart', az:10, el:0, ask:'The heart is cut open. Which wall is ringed?',
    clue:{ t:'The larger partition between the two sides of the heart.', hers:1 }, fact:'The thick muscular wall between the two VENTRICLES. The bundle branches run down either side of it.' },
  { id:'ht-ias', kind:'wall', name:'Interatrial septum', her:1, section:1, between:['left atrium', 'right atrium'], t:.006, region:'heart', az:10, el:10, ask:'The heart is cut open. Which wall is ringed?',
    clue:{ t:'The thin-walled upper part of the septum that separates the two sides of the heart.', hers:1 }, fact:'Between the two ATRIA. It carries the fossa ovalis — what is left of the fetal foramen ovale (her MCQ: the hole between right and left atrium).' },
  { id:'ht-apex', kind:'wall', name:'Apex of the heart', her:1, on:'left ventricle', p:[.657, .534, 1], r:.02, region:'heart', az:20, el:-10, ask:'Which part of the heart is ringed?',
    fact:'The pointed tip, formed by the LEFT ventricle, pointing down and to the left. (Measured: the lowest vertex of the left-ventricle mesh.) The base is the top, where the great vessels are.' },
  HT('aorta', 'vessel', 'Aorta', 20, 5, ['ascending aorta', 'aortic arch', 'thoracic aorta'], { her:1, region:'heartTop', fact:'Leaves the LEFT ventricle: ascending aorta, the arch, then down the back of the chest. Where the systemic circulation starts.' }),
  HT('arch', 'vessel', 'Aortic arch', 20, 10, ['aortic arch'], { her:1, region:'heartTop', fact:'Three branches, in order: brachiocephalic, left common carotid, left subclavian. Baroreceptors here sense blood pressure.' }),
  HT('brachio', 'vessel', 'Brachiocephalic artery', 10, 5, ['brachiocephalic trunk'], { her:1, region:'heartTop', alt:'brachiocephalic trunk', fact:'FIRST branch of the arch. Splits into the right common carotid and the right subclavian.' }),
  HT('lcc', 'vessel', 'Left common carotid artery', 10, 5, ['left common carotid artery'], { her:1, region:'heartTop', fact:'SECOND branch of the arch, straight off it (the right one comes from the brachiocephalic).' }),
  HT('lsub', 'vessel', 'Left subclavian artery', 10, 5, ['left subclavian artery'], { region:'heartTop', fact:'THIRD branch of the arch.' }),
  HT('rsub', 'vessel', 'Right subclavian artery', 10, 5, ['right subclavian artery'], { her:1, region:'heartTop', fact:'From the brachiocephalic artery, out under the right clavicle to the arm.' }),
  HT('rcc', 'vessel', 'Right common carotid artery', 10, 5, ['right common carotid artery'], { region:'heartTop', fact:'From the brachiocephalic artery, up the right side of the neck.' }),
  HT('pa', 'vessel', 'Pulmonary artery', 20, 10, ['pulmonary trunk', 'bifurcation of pulmonary trunk', 'left pulmonary artery', 'right pulmonary artery'], { her:1, alt:'pulmonary trunk',
    fact:'Leaves the RIGHT ventricle for the lungs. An artery because it leaves the heart — yet it carries DEOXYGENATED blood (so it is blue here).' }),
  HT('pv', 'vessel', 'Pulmonary veins', 180, 10, [/pulmonary vein$/], { her:1, fact:'FOUR of them, from the lungs into the left atrium. Veins because they return to the heart — yet they carry OXYGENATED blood (red here).' }),
  HT('svc', 'vessel', 'Superior vena cava', 340, 5, ['superior vena cava'], { her:1, region:'heartTop', fact:'Drains the head, neck and arms into the right atrium. The SA node sits where it joins the atrium.' }),
  HT('ivc', 'vessel', 'Inferior vena cava', 200, -10, ['inferior vena cava (thoracic part)'], { her:1, fact:'Drains everything below the diaphragm into the right atrium.' }),
  HT('jugular', 'vessel', 'Internal jugular vein', 10, 5, ['internal jugular vein'], { her:1, region:'heartTop',
    clue:{ t:'The vein that drains the head down the neck and returns blood to the subclavian vein.', hers:1 }, fact:'Joins the subclavian vein to make the brachiocephalic vein.' }),
  HT('subv', 'vessel', 'Subclavian vein', 10, 5, [/^(left|right) subclavian vein$/], { her:1, region:'heartTop', fact:'From the arm. Jugular + subclavian = brachiocephalic vein; the two brachiocephalic veins = the superior vena cava.' }),
  HT('bcv', 'vessel', 'Brachiocephalic vein', 10, 5, [/^(left|right) brachiocephalic vein$/], { region:'heartTop', fact:'One each side (there is only ONE brachiocephalic artery). The two join to form the superior vena cava.' }),

  HT('coronary', 'coronary', 'Coronary arteries', 30, 0, [/^(left|right) coronary artery$/, 'anterior interventricular artery', 'circumflex artery of heart', 'marginal artery'], { her:1,
    clue:{ t:'The vessels that supply blood to the myocardium.', hers:1 }, fact:'First branches of the aorta, from the ostia just above the aortic valve. Blocked → myocardial infarction.' }),
  HT('lad', 'coronary', 'Left anterior descending artery', 40, 0, ['anterior interventricular artery'], { her:1, alt:'LAD · anterior interventricular artery',
    clue:{ t:'The "widow maker" — the coronary artery most often involved in a myocardial infarction.', hers:1 }, fact:'Runs down the FRONT of the heart in the groove between the two ventricles.' }),
  HT('lca', 'coronary', 'Left coronary artery', 60, 10, ['left coronary artery'], { deep:1, fact:'Short, and tucked behind the pulmonary trunk (so it is asked in Name it, x-rayed). Splits into the left anterior descending and the circumflex.' }),
  HT('rca', 'coronary', 'Right coronary artery', 340, 0, ['right coronary artery'], { fact:'Runs in the groove between right atrium and right ventricle, round to the back.' }),
  HT('cx', 'coronary', 'Circumflex artery', 100, 5, ['circumflex artery of heart'], { fact:'Curls round the LEFT side of the heart in the atrioventricular groove.' }),
  HT('cs', 'coronary', 'Coronary sinus', 180, -5, ['coronary sinus'], { her:1,
    clue:{ t:'The vessel that returns the blood of the heart wall itself — to the right atrium.', hers:1 }, fact:'A large vein on the BACK of the heart collecting the cardiac veins; it empties into the right atrium.' }),

  HT('sa', 'cond', 'SA node', 330, 10, ['sa node'], { ...COND, alt:'sinoatrial node',
    clue:{ t:'The pacemaker of the heart — where the electrical impulse is generated.', hers:1 }, fact:'In the right atrium where the superior vena cava enters. It fires; the impulse spreads through both atria (the P wave).' }),
  HT('av', 'cond', 'AV node', 20, 5, ['av node'], { ...COND, alt:'atrioventricular node',
    clue:{ t:'Where the impulse is briefly delayed on its way from the atria to the ventricles.', hers:1 }, fact:'In the floor of the right atrium by the septum. The delay (the PR segment) lets the ventricles fill first.' }),
  HT('his', 'cond', 'Bundle of His', 20, 0, ['bundle of his'], { ...COND, alt:'atrioventricular bundle', fact:'The only electrical bridge from atria to ventricles; runs into the top of the interventricular septum.' }),
  HT('branches', 'cond', 'Bundle branches', 20, -5, ['bundle branches'], { ...COND, fact:'Right and left, down either side of the interventricular septum toward the apex.' }),
  HT('purkinje', 'cond', 'Purkinje fibres', 20, -5, ['purkinje fibres'], { ...COND, fact:'From the apex UP through the ventricular walls, so the ventricles contract from the apex upward (the QRS complex).' }),

  HT('lungs', 'context', 'Lungs', 10, 5, [/lobe of (left|right) lung$/], { region:'heartAll', fact:'Where the pulmonary circulation drops its carbon dioxide and picks up oxygen. (Drawn as glass here: a tap passes through unless the lungs are what was asked.)' }),
];

/* ── The ECG (Module 1), BUILT, bound into the Heart deck. Her label figure: A = P wave · B = Q · C = R · D = S · E = T wave. Her two matches give the
 *    meaning of each part; the clues below are those lines. ── */
const EC = (id, name, m, clue, fact, extra) => ({ id:'ecg-' + id, kind:'ecg', name, her:1, region:'ecg', az:0, el:0, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
HEART.push(
  EC('p', 'P wave', ['p wave'], 'Atrial depolarisation: the SA node fires and the impulse spreads through the right and left atria, which contract.', 'The first small bump. Blood is in the atria, moving through the AV valves.'),
  EC('pr', 'PR segment', ['pr segment'], 'The impulse travels to the AV node, where it is briefly delayed.', 'The flat stretch after the P wave: the delay lets the ventricles finish filling.'),
  EC('qrs', 'QRS complex', ['q wave', 'r wave', 's wave'], 'Ventricular depolarisation: down the bundle of His, the bundle branches and the Purkinje fibres — the ventricles contract.', 'The big spike. (Atrial repolarisation is hidden inside it.) Blood moves out through the semilunar valves.'),
  EC('q', 'Q wave', ['q wave'], null, 'The small dip BEFORE the tall spike.'),
  EC('r', 'R wave', ['r wave'], null, 'The tall spike itself. Heart rate is counted from R to R.'),
  EC('s', 'S wave', ['s wave'], null, 'The dip AFTER the tall spike.'),
  EC('st', 'ST segment', ['st segment'], 'The ventricles are fully depolarised and actively contracting.', 'The flat stretch between the spike and the last wave. Raised or sunk in a myocardial infarction.'),
  EC('t', 'T wave', ['t wave'], 'Ventricular repolarisation: the ventricular muscle relaxes so the ventricles can refill.', 'The last, broad bump.'),
);

/* ── Airway (Module 1): airway.glb (604 KB) = the source's respiratory model + pharynx, palate, epiglottis, tongue (digestive),
 *    larynx cartilages + hyoid (skeletal), diaphragm (muscular). Her figure keys: Nostril · Nasal cavity · Larynx · Oropharynx ·
 *    Right primary bronchus · Middle lobe of right lung · Palate · Trachea · Left primary bronchus · Left lung · Diaphragm, and
 *    "Location of Carina". Nostril and nasal cavity are spaces the source does not model; alveoli and bronchioles likewise. ── */
const AW = (id, kind, name, region, az, el, m, extra) => ({ id:'aw-' + id, kind, name, region, az, el, m, ...extra });
export const AIRWAY = [
  AW('nasoph', 'upper', 'Nasopharynx', 'awUpper', 90, 0, ['nasopharynx'], { fact:'Behind the nasal cavity, above the soft palate. Air only. The auditory (Eustachian) tubes open here.' }),
  AW('oroph', 'upper', 'Oropharynx', 'awUpper', 90, 0, ['oropharynx'], { her:1, fact:'Behind the mouth, from the soft palate down to the epiglottis. Shared by air and food.' }),
  AW('laryngoph', 'upper', 'Laryngopharynx', 'awUpper', 90, 0, ['laryngopharynx'], { fact:'Behind the larynx. Here the two paths divide: air forward into the larynx, food back into the oesophagus.' }),
  AW('palate', 'upper', 'Palate', 'awUpper', 90, 0, ['soft palate', 'uvula of palate'], { her:1, sub:'soft palate + uvula',
    fact:'Separates the nasal cavity from the mouth. The soft palate and uvula lift to close the nasopharynx when you swallow. (The hard palate is bone.)' }),
  AW('epiglottis', 'upper', 'Epiglottis', 'awUpper', 120, 5, ['epiglottis'], { deep:1, fact:'(Hidden inside the throat, so it is asked x-rayed.) The elastic-cartilage flap that tips over the larynx when you swallow, so food goes down the oesophagus.' }),
  AW('larynx', 'upper', 'Larynx', 'awUpper', 30, 0, ['thyroid cartilage', 'cricoid cartilage'], { her:1, also:['epiglottis'], alt:'voice box',
    clue:{ t:'The structure that helps to maintain a patent — open — airway.', hers:1 }, fact:'Thyroid cartilage (the Adam\'s apple) over the cricoid ring. Holds the airway open, routes air and food, and houses the vocal cords.' }),
  AW('trachea', 'tree', 'Trachea', 'awTree', 0, 5, ['trachea'], { her:1,
    fact:'The windpipe. Its cartilage rings are C-shaped — open at the back, joined by the trachealis muscle — and it is lined with ciliated, pseudostratified epithelium: the mucociliary escalator.' }),
  { id:'aw-carina', kind:'tree', name:'Carina', her:1, on:'trachea', p:[.5, .02, .16], r:.013,      // measured: the centroid of the trachea mesh's lowest 3 % of vertices is (.50, .01, .14)
    region:'awTree', az:0, el:5,
    clue:{ t:'The most sensitive area of the trachea and larynx for triggering the cough reflex.', hers:1 },
    fact:'The ridge where the trachea divides into the two primary bronchi.' },
  AW('rmain', 'tree', 'Right primary bronchus', 'awTree', 0, 5, ['right main bronchus'], { her:1, open:1, alt:'right main bronchus',
    fact:'Wider, shorter and more vertical than the left — so an inhaled object usually goes RIGHT.' }),
  AW('lmain', 'tree', 'Left primary bronchus', 'awTree', 0, 5, ['left main bronchus'], { her:1, open:1, alt:'left main bronchus', fact:'Longer and more horizontal: it has to pass under the aortic arch to reach the left lung.' }),
  AW('lobar', 'tree', 'Lobar bronchi', 'awTree', 0, 5, [/lobar bronchus$/, 'intermediate bronchus'], { open:1, alt:'secondary bronchi', fact:'One to each LOBE: three on the right, two on the left.' }),
  AW('segmental', 'tree', 'Segmental bronchi', 'awTree', 0, 5, [/segmental bronchus/], { open:1, alt:'tertiary bronchi',
    fact:'One to each bronchopulmonary segment. Beyond them come the bronchioles (no cartilage, cuboidal epithelium) and the alveoli — too small for this model.' }),
  AW('rlung', 'lung', 'Right lung', 'airway', 330, 5, [/lobe of right lung$/], { fact:'THREE lobes: superior, middle, inferior.' }),
  AW('llung', 'lung', 'Left lung', 'airway', 30, 5, [/lobe of left lung$/], { her:1, fact:'TWO lobes — it gives up room to the heart (the cardiac notch).' }),
  AW('rmid', 'lung', 'Middle lobe of right lung', 'airway', 340, 0, ['middle lobe of right lung'], { her:1, fact:'Only the right lung has a middle lobe.' }),
  AW('rsup', 'lung', 'Superior lobe of right lung', 'airway', 340, 10, ['superior lobe of right lung'], { fact:'The top lobe of the three.' }),
  AW('rinf', 'lung', 'Inferior lobe of right lung', 'airway', 200, 0, ['inferior lobe of right lung'], { fact:'The biggest part of the BACK of the lung.' }),
  AW('lsup', 'lung', 'Superior lobe of left lung', 'airway', 20, 10, ['superior lobe of left lung'], { fact:'Carries the lingula, the left lung\'s counterpart of a middle lobe.' }),
  AW('linf', 'lung', 'Inferior lobe of left lung', 'airway', 160, 0, ['inferior lobe of left lung'], { fact:'Most of the back of the left lung.' }),
  AW('diaphragm', 'lung', 'Diaphragm', 'airway', 0, -20, ['diaphragm'], { her:1,
    clue:{ t:'In the bell-jar model of ventilation, the rubber sheet at the bottom stands for this.', hers:1 }, fact:'The main muscle of inspiration: it contracts and flattens, the thoracic volume rises, pressure falls, air flows in.' }),
];

/* ── Lung volumes (Module 1), BUILT, bound into the Airway deck. Her keys: tidal volume · inspiratory and expiratory reserve volume · residual volume ·
 *    vital capacity · total lung capacity · "inspirational capacity". The four VOLUMES are one column; each CAPACITY is a bar spanning the volumes it sums. ── */
const SP = (id, name, fact, extra) => ({ id:'sp-' + id, kind:'spiro', name, her:1, region:'spiro', az:0, el:0, m:[name.toLowerCase()], fact, ...extra });
AIRWAY.push(
  SP('tv', 'Tidal volume', 'The air moved in ONE quiet breath (about 500 mL): the small waves.'),
  SP('irv', 'Inspiratory reserve volume', 'The EXTRA air you can still force IN after a normal breath in.'),
  SP('erv', 'Expiratory reserve volume', 'The extra air you can still force OUT after a normal breath out.'),
  SP('rv', 'Residual volume', 'What stays in the lungs even after a maximal breath out — it cannot be measured with a spirometer. It keeps the alveoli open.'),
  SP('ic', 'Inspiratory capacity', 'Tidal volume + inspiratory reserve volume: everything you can breathe in from a resting breath out.', { alt:'she writes "inspirational capacity"' }),
  SP('frc', 'Functional residual capacity', 'Expiratory reserve volume + residual volume: what is in the lungs at the end of a quiet breath out.', { her:0 }),
  SP('vc', 'Vital capacity', 'IRV + TV + ERV: the most air you can move in one breath, maximal in to maximal out.'),
  SP('tlc', 'Total lung capacity', 'All four volumes together: vital capacity + residual volume.'),
);

/* ── Eye & Ear (Module 3): both BUILT (made-eye.js, made-ear.js). The parts and the clues are HER Module 3 revision deck
 *    ("2019 Revision mod 3 22 slide2.pptx", slides 15-21, read 21 Sep 2026): the three tunics and what is in each; outer, middle
 *    and inner ear; her numbered sound path (1 ear canal · 2 tympanic membrane · 3 ossicles · 4 oval window · 5 cochlea).
 *    Her Canvas quizzes on these were not yet sat on 21 Sep, so `her:1` here means "on her revision slides". ── */
const SE = (id, kind, name, region, az, el, m, clue, fact, extra) => ({ id:'se-' + id, kind, name, her:1, region, az, el, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
export const SENSES = [
  SE('cornea', 'eye', 'Cornea', 'eye', 38, 22, ['cornea'], 'Clear — it does about 80 % of the refraction (bending of the light).', 'Fibrous tunic, the transparent front. Most of the focusing happens here, not in the lens.'),
  SE('sclera', 'eye', 'Sclera', 'eye', 38, 22, ['sclera'], 'White — the protective container.', 'Fibrous tunic: the white of the eye. The eye muscles attach to it.'),
  SE('choroid', 'eye', 'Choroid', 'eye', 38, 22, ['choroid'], 'The layer of blood vessels.', 'Vascular tunic, between sclera and retina. Dark pigment stops light reflecting around inside the eye.'),
  SE('ciliary', 'eye', 'Ciliary body', 'eyeFront', 38, 22, ['ciliary body'], 'Its muscle contracts to make the lens more biconvex; it also produces the aqueous humor.', 'Vascular tunic: ciliary muscle + ciliary processes + the suspensory ligaments that hold the lens.'),
  SE('ligaments', 'eye', 'Suspensory ligaments', 'eyeFront', 38, 22, ['suspensory ligaments'], 'They pull the lens flat when the ciliary muscle relaxes.', 'Fine fibres from the ciliary body to the edge of the lens. Distant object: muscle relaxed, ligaments tight, lens flat.'),
  SE('iris', 'eye', 'Iris', 'eyeFront', 38, 22, ['iris'], 'The coloured part — it dilates and constricts the pupil.', 'Vascular tunic. Dilator muscle = sympathetic (more light in); sphincter muscle = parasympathetic (less light in).'),
  SE('pupil', 'eye', 'Pupil', 'eyeFront', 20, 12, ['pupil'], 'Dilates in poor light, constricts in bright light.', 'Not a structure — the HOLE in the iris that the light goes through.'),
  SE('lens', 'eye', 'Lens', 'eyeFront', 38, 22, ['lens'], 'Biconvex and flexible — about 20 % of the refraction; it accommodates to focus the image on the retina.', 'Near object: ciliary muscle contracts, lens bulges. Cloudy lens = cataract.'),
  SE('retina', 'eye', 'Retina', 'eye', 38, 22, ['retina'], 'The neural tunic: photoreceptors (rods and cones), bipolar cells and ganglion cells.', 'Rods = dim light, no colour (scotopic). Cones = bright light, colour (photopic).'),
  SE('macula', 'eye', 'Macula lutea', 'eye', 30, 30, ['macula lutea'], null, 'The yellow spot straight behind the lens, with the fovea centralis at its centre. Macular degeneration (dry or wet) destroys it.'),
  SE('fovea', 'eye', 'Fovea centralis', 'eye', 30, 30, ['fovea centralis'], 'The small pit in the retina where only cones are found and where sharp vision happens.', 'The centre of the macula lutea. Her options list both — the fovea is the one with ONLY cones.'),
  SE('conjunctiva', 'eye', 'Conjunctiva', 'eyeFront', 38, 22, ['conjunctiva'], 'Pinkeye is an infection of it.', 'The thin membrane over the front of the sclera and the inside of the eyelids — not over the cornea. Conjunctivitis; treated with chloramphenicol when bacterial.'),
  SE('hyaloid', 'eye', 'Hyaloid canal', 'eye', 38, 22, ['hyaloid canal'], 'A canal in the vitreous humor.', 'Runs from the back of the lens to the optic disc: what is left of the fetal hyaloid artery. SCHEMATIC, drawn straighter and wider than life.'),
  SE('disc', 'eye', 'Optic disc', 'eye', 30, 30, ['optic disc'], 'No cones or rods — the nerve fibres leave the eye here.', 'The blind spot. It lies to the NASAL side of the macula.', { alt:'blind spot' }),
  SE('optic-nerve', 'eye', 'Optic nerve', 'eye', 150, 10, ['optic nerve'], null, 'Cranial nerve II: the ganglion-cell axons, leaving at the optic disc for the optic chiasm and the visual cortex in the occipital lobe.', { sub:'CN II' }),
  SE('aqueous', 'eye', 'Aqueous humor', 'eyeFront', 38, 22, ['aqueous humor'], 'A watery fluid found in the anterior chamber of the eyeball.', 'Made by the ciliary body, drained by the canal of Schlemm. If it cannot drain, pressure rises: glaucoma.'),
  SE('vitreous', 'eye', 'Vitreous humor', 'eye', 38, 22, ['vitreous humor'], 'Fills the POSTERIOR segment of the eye.', 'A clear gel behind the lens; it holds the retina against the choroid.'),
  SE('schlemm', 'eye', 'Canal of Schlemm', 'eyeFront', 38, 22, ['canal of schlemm'], 'Drains the aqueous fluid.', 'A ring-shaped channel at the junction of cornea and sclera (through the trabecular mesh). Blocked → glaucoma.'),

  SE('pinna', 'ear', 'Pinna', 'ear', 0, 5, ['pinna'], 'Collects the sound.', 'External ear: the flap of elastic cartilage and skin.', { alt:'auricle' }),
  SE('canal', 'ear', 'External auditory canal', 'ear', 0, 12, ['external auditory canal'], 'With ceruminous glands, which make the brown wax.', 'External ear. Ear wax here is a REVERSIBLE cause of conduction deafness. (Opened along its length so you can see the eardrum.)', { alt:'ear canal' }),
  SE('drum', 'ear', 'Tympanic membrane', 'earMid', 0, 12, ['tympanic membrane'], null, 'The eardrum: the boundary between external and middle ear. Sound waves make it vibrate. Perforated → conduction deafness.', { alt:'eardrum' }),
  SE('ossicles', 'ear', 'Ossicles', 'earMid', 0, 8, ['malleus', 'incus', 'stapes'], 'They transfer sound from the tympanic membrane to the oval window — and amplify it.', 'Malleus, incus, stapes: three tiny bones with synovial joints. Otosclerosis or arthritis of them = conduction deafness.'),
  SE('malleus', 'ear', 'Malleus', 'earMid', 0, 8, ['malleus'], null, 'The hammer: its handle is fixed to the eardrum. FIRST of the three.'),
  SE('incus', 'ear', 'Incus', 'earMid', 0, 8, ['incus'], null, 'The anvil: the MIDDLE one.'),
  SE('stapes', 'ear', 'Stapes', 'earMid', 0, 8, ['stapes'], null, 'The stirrup: its footplate sits in the oval window. LAST of the three — and the smallest bone in the body.'),
  SE('oval', 'ear', 'Oval window', 'earMid', 0, 8, ['oval window'], null, 'The membrane-covered opening into the inner ear that the stapes pushes on: vibration in air becomes waves in fluid (perilymph).'),
  SE('tube', 'ear', 'Eustachian tube', 'ear', 0, 5, ['eustachian tube'], 'Connects the middle ear to the nasopharynx, to equalise pressure.', 'Also the road by which a throat infection reaches the middle ear.', { alt:'pharyngotympanic (auditory) tube' }),
  SE('cochlea', 'ear', 'Cochlea', 'earIn', 0, 8, ['cochlea'], 'Houses the organ of Corti, whose hair cells transduce mechanical waves into electrical impulses.', 'Three chambers: scala vestibuli and scala tympani (perilymph) either side of the scala media (endolymph) with the organ of Corti. Damage here = sensorineural deafness.'),
  SE('vestibule', 'ear', 'Vestibule', 'earIn', 0, 8, ['vestibule'], null, 'The middle chamber of the bony labyrinth, between the cochlea and the semicircular canals. It holds the utricle and the saccule.'),
  SE('utricle', 'ear', 'Utricle', 'earIn', 0, 8, ['utricle'], null, 'Membranous sac in the vestibule, with otoliths in its macula: head position and straight-line movement.'),
  SE('saccule', 'ear', 'Saccule', 'earIn', 0, 8, ['saccule'], null, 'The smaller membranous sac in the vestibule, also with otoliths in its macula.'),
  SE('canals', 'ear', 'Semicircular canals', 'earIn', 0, 8, ['semicircular canals'], 'For balance and spatial orientation.', 'Three, at right angles to one another, each with an ampulla: they sense ROTATION of the head. With the utricle and saccule they make the vestibular apparatus.', { alt:'semicircular ducts' }),
  SE('nerve8', 'ear', 'Vestibulocochlear nerve', 'earIn', 0, 8, ['vestibulocochlear nerve'], 'Takes the electrical impulses to the auditory cortex in the temporal lobe.', 'Cranial nerve VIII: a cochlear part (hearing) and a vestibular part (balance).', { sub:'CN VIII', alt:'auditory nerve' }),
];

/* ── Reproductive (Module 3). MALE = male.glb (72 KB) from the source body. FEMALE = HuBMAP CCF reference organs (CC BY 4.0), one
 *    shared shift (see MODELS.female). Parts and clues: her Module 3 revision deck, slide 2 (female parts and functions) and slide 5
 *    (male glands with their share of the semen, and the duct sequence). `sex` decides which body is on stage for the question. ── */
const RP = (id, sex, name, az, el, m, clue, fact, extra) => ({ id:'rp-' + id, kind:sex, sex, name, her:1, region:sex === 'female' ? 'rpFemale' : 'rpMale', az, el, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
export const REPRO = [
  RP('ovary', 'female', 'Ovary', 0, 10, ['ovary'], 'Produces the eggs — and the hormones oestrogen and progesterone.', 'Follicular phase → ovulation → luteal phase, under FSH and LH from the pituitary.', { c:'#ff8fc7' }),
  RP('fimbriae', 'female', 'Fimbriae', 0, 10, ['fimbriae'], 'They stroke over the ovary to catch the secondary oocyte.', 'The fingers on the end of the infundibulum. The tube is NOT attached to the ovary: the egg has to be caught.', { c:'#ffd27a' }),
  RP('tube', 'female', 'Fallopian tube', 0, 10, ['infundibulum', 'fimbriae', 'ampulla of fallopian tube', 'isthmus of fallopian tube'], 'Cilia on its inside help the egg or embryo move toward the uterus — and it is where fertilisation happens.', 'Uterine tube: infundibulum with fimbriae → ampulla → isthmus → uterus. An embryo that implants here is an ectopic pregnancy.', { alt:'uterine tube' }),
  RP('infundibulum', 'female', 'Infundibulum', 0, 10, ['infundibulum'], null, 'The funnel at the ovarian end of the tube; the fimbriae hang from it.', { her:0, c:'#ffb38a' }),
  RP('ampulla', 'female', 'Ampulla of the tube', 0, 10, ['ampulla of fallopian tube'], null, 'The wide middle stretch — where fertilisation usually takes place.', { her:0, c:'#f59aa6' }),
  RP('isthmus', 'female', 'Isthmus of the tube', 0, 10, ['isthmus of fallopian tube'], null, 'The narrow stretch that enters the uterus.', { her:0, c:'#e57f98' }),
  RP('uterus', 'female', 'Uterus', 0, 10, ['body of uterus', 'fundus of uterus', 'cervix'], 'It houses the embryo.', 'Three layers, inside out: endometrium (its functional layer is shed in menstruation, the basal layer rebuilds it), myometrium (smooth muscle), perimetrium. The layers are not separate in this model.'),
  RP('fundus', 'female', 'Fundus of the uterus', 0, 20, ['fundus of uterus'], null, 'The dome above the openings of the two tubes.', { her:0, c:'#d9708a' }),
  RP('body', 'female', 'Body of the uterus', 0, 5, ['body of uterus'], null, 'The main part, where the embryo implants.', { her:0, c:'#c9607c' }),
  RP('cervix', 'female', 'Cervix', 0, -10, ['cervix', 'internal os', 'external os'], null, 'The neck of the uterus, opening into the vagina (the vagina is not in this model).', { c:'#b9a2ff' }),

  RP('testis', 'male', 'Testis', 100, 0, ['testis'], 'Makes the sperm (in the seminiferous tubules, under FSH) and testosterone (Leydig cells, under LH) — about 5–10 % of the semen.', 'Sertoli cells in the tubules make inhibin. Kept outside the body because sperm need it cooler than 37 °C.', { c:'#8fb8ff' }),
  RP('epididymis', 'male', 'Epididymis', 100, 0, ['epididymis'], null, 'Coiled on the back of the testis: sperm mature and are stored here. FIRST duct after the rete testis.', { c:'#ffd27a' }),
  RP('vas', 'male', 'Vas deferens', 100, 5, ['ductus deferens'], null, 'Ductus deferens: up from the epididymis, over the bladder, to its ampulla behind it. This is what a vasectomy cuts.', { alt:'ductus deferens', c:'#9be38a' }),
  RP('seminal', 'male', 'Seminal vesicles', 160, 5, ['seminal gland'], 'The glands that give about 60 % of the semen — alkaline, with fructose and prostaglandins.', 'Behind the bladder. Their duct joins the vas deferens to make the ejaculatory duct.', { alt:'seminal glands', c:'#ffb347' }),
  RP('ejac', 'male', 'Ejaculatory duct', 160, 0, ['ejaculatory duct'], null, 'Vas deferens + the seminal vesicle\'s duct. It runs through the prostate into the urethra.', { deep:1, c:'#ff8f6e' }),
  RP('prostate', 'male', 'Prostate', 120, 0, ['prostate'], 'The gland that gives about 30 % of the semen — acidic, with citric acid and PSA.', 'Round the urethra just under the bladder, which is why an enlarged prostate obstructs urine.', { c:'#c58cff' }),
  RP('urethra', 'male', 'Urethra', 100, -5, ['urethra'], null, 'The last duct, shared with urine: prostatic → membranous → penile. (It runs INSIDE the corpus spongiosum, so a tap on that counts.)', { also:['corpus spongiosum of penis', 'glans penis'], c:'#f7d06b' }),
  RP('cavernosum', 'male', 'Corpus cavernosum', 100, 0, ['corpus cavernosum of penis'], 'In an erection, blood flow increases into these — and squashes the veins that would drain them.', 'Parasympathetic → nitric oxide → the deep artery dilates → the corpora cavernosa fill.', { c:'#e57f98' }),
  RP('spongiosum', 'male', 'Corpus spongiosum', 100, -10, ['corpus spongiosum of penis', 'glans penis'], null, 'Surrounds the urethra and ends as the glans; it stays softer so the urethra is not squeezed shut.', { her:0, c:'#f59aa6' }),
  RP('bladder', 'male', 'Urinary bladder', 100, 5, ['urinary bladder'], null, 'Not reproductive — it is here because the vas deferens loops over it and the prostate sits under it.', { her:0, c:'#d9c27a' }),
];

/* ── Levers (Module 2, focus row ms-levers: 15 questions, 8 of them drop-down passages). Her three worked examples, word for word:
 *    "Contracting neck muscles to pull the head back … first class … the atlanto-occipital joint, seen as the FULCRUM, is in the middle. The load is the HEAD."
 *    "Standing on our toes by contracting the gastrocnemius … second class … the body, seen as the LOAD, is in the middle. The fulcrum is the JOINT IN THE BALL OF THE FOOT."
 *    "Contracting the biceps to flex the arm at the elbow … third class … the biceps, seen as the EFFORT, is in the middle. The fulcrum is the ELBOW JOINT."  (the hand is the load)
 *    Her match: 1st = power (and changes direction), 2nd = a STRENGTH advantage, 3rd = a SPEED advantage. Bones = the lever arm. MA = effort arm ÷ load arm.
 *    Nine role items are all named Fulcrum / Load / Effort on purpose: Name it becomes her drop-down (three options). ── */
const SKULL = [/^(frontal|parietal|occipital|temporal|sphenoid|ethmoid|zygomatic|nasal|lacrimal) bone$/, 'maxilla', 'mandible'];
const NECK = ['descending part of trapezius muscle', 'splenius capitis muscle', 'sternocleidomastoid muscle'], CALF = [/head of gastrocnemius$/, 'soleus muscle', 'calcaneal tendon'];
const BALL = [/metatarsal bone$/, /phalanx of .* of foot$/], HAND = [/^(capitate|hamate|lunate|pisiform|scaphoid|trapezium|trapezoid|triquetrum) bone$/, /metacarpal bone$/, /phalanx of .* of hand$/], BICEPS = [/head of biceps brachii$/, 'brachialis muscle'];
const LV = (id, kind, name, sub, region, az, el, extra) => ({ id:'lv-' + id, kind, strict:1, name, sub, her:1, region, az, el, ask:kind === 'role' ? sub[0].toUpperCase() + sub.slice(1) + ' — what is the glowing part?' : 'Which class of lever is this?', ...extra });
export const LEVERS = [
  LV('1f', 'role', 'Fulcrum', 'nodding the head', 'head', 180, -5, { m:['atlas (c1)'], also:['axis (c2)'], peel:NECK, peelNow:1,
    clue:{ t:'Pulling the head back: the atlanto-occipital joint is in the MIDDLE of this lever. Tap it — what is it seen as?', hers:1 }, fact:'The atlanto-occipital joint (skull on the atlas) is the FULCRUM, and it sits in the middle → FIRST class. FLE: 1 = Fulcrum in the middle.' }),
  LV('1l', 'role', 'Load', 'nodding the head', 'head', 90, 0, { m:SKULL,
    clue:{ t:'Pulling the head back with the neck muscles: tap the LOAD.', hers:1 }, fact:'The load is the HEAD (its weight sits in front of the joint). Her drop-down offers head / neck / cervical vertebrae — it is the head.' }),
  LV('1e', 'role', 'Effort', 'nodding the head', 'head', 110, 0, { m:NECK,
    clue:{ t:'Pulling the head back: tap the EFFORT.', hers:1 }, fact:'The neck muscles are the effort (posterior ones pull the head back; sternocleidomastoid and the upper fibres of trapezius tilt it at the same joint). Muscles are always the effort.' }),
  LV('2f', 'role', 'Fulcrum', 'standing on tiptoe', 'leg', 90, 0, { m:BALL,
    clue:{ t:'Standing on our toes: tap the FULCRUM.', hers:1 }, fact:'The JOINT IN THE BALL OF THE FOOT (metatarsal heads on the toes). Her drop-down offers ankle joint / joint in the ball of the foot / Achilles tendon — not the ankle.' }),
  LV('2l', 'role', 'Load', 'standing on tiptoe', 'leg', 90, 0, { m:['tibia', 'talus', 'fibula'],
    clue:{ t:'Standing on our toes: the body is in the MIDDLE of this lever. Tap where its weight comes down — what is it seen as?', hers:1 }, fact:'Body weight comes down the tibia onto the talus: the LOAD, and it is in the middle → SECOND class. FLE: 2 = Load in the middle.' }),
  LV('2e', 'role', 'Effort', 'standing on tiptoe', 'leg', 110, 0, { m:CALF,
    clue:{ t:'Standing on our toes: tap the EFFORT.', hers:1 }, fact:'Gastrocnemius (with soleus) pulling up on the heel through the Achilles tendon.' }),
  { ...LV('3f', 'role', 'Fulcrum', 'flexing the elbow', 'arm', 20, 0, {}), on:'humerus', p:[.5, .03, .5], r:.04, alsoOn:[{ on:'ulna', p:[.5, .96, .5], r:.04 }, { on:'radius', p:[.5, .97, .5], r:.035 }],
    clue:{ t:'Contracting the biceps to flex the arm: tap the FULCRUM.', hers:1 }, fact:'The ELBOW JOINT. Her drop-down offers wrist joint / triceps muscle / biceps muscle / elbow joint.' },
  LV('3e', 'role', 'Effort', 'flexing the elbow', 'arm', 20, 0, { m:BICEPS,
    clue:{ t:'Flexing the arm at the elbow: the biceps is in the MIDDLE of this lever. Tap it — what is it seen as?', hers:1 }, fact:'The biceps is the EFFORT, and it inserts between the elbow and the hand → THIRD class. FLE: 3 = Effort in the middle.' }),
  LV('3l', 'role', 'Load', 'flexing the elbow', 'arm', 20, 0, { m:HAND,
    clue:{ t:'Flexing the arm at the elbow: tap the LOAD.', hers:1 }, fact:'The hand (and whatever it holds). The bones of the forearm are the LEVER ARM — her answer to "what part of the lever system represents bones".' }),
  LV('c1', 'class', 'First-class lever', 'fulcrum in the middle', 'head', 90, 0, { m:['atlas (c1)', ...SKULL, ...NECK],
    clue:{ t:'The lever with the FULCRUM in the middle. Tap any part of it.', hers:1 }, fact:'Nodding the head on the atlanto-occipital joint. Like a see-saw or scissors: it can change the direction of a force; moving the fulcrum closer to the LOAD makes the load easier to move (more mechanical advantage).' }),
  LV('c2', 'class', 'Second-class lever', 'load in the middle', 'leg', 90, 0, { m:[...BALL, 'tibia', 'talus', 'fibula', ...CALF],
    clue:{ t:'The lever that gives a STRENGTH advantage — the load is in the middle. Tap any part of it.', hers:1 }, fact:'Standing on tiptoe (like a wheelbarrow). The effort arm is longer than the load arm, so mechanical advantage is greater than 1: strength.' }),
  LV('c3', 'class', 'Third-class lever', 'effort in the middle', 'arm', 20, 0, { m:['humerus', 'radius', 'ulna', ...HAND, ...BICEPS],
    clue:{ t:'The lever that gives a SPEED advantage — the effort is in the middle. Tap any part of it.', hers:1 }, fact:'Flexing the elbow with the biceps (like tweezers). Mechanical advantage is LESS than 1 (her example: 3 ÷ 30 = 0.1) — it does not make the work easier, it makes it fast and wide-ranging. Most levers in the body are third class.' }),
];

/* ── The uterus wall (Module 3), BUILT, on stage with the female organs. Her revision slide 2: perimetrium · myometrium (smooth muscle) · endometrium,
 *    whose FUNCTIONAL layer (spiral arteries) is shed in menstruation while the BASAL layer (straight arteries) stays and rebuilds it. ── */
const UW = (id, name, m, clue, fact, extra) => ({ id:'uw-' + id, kind:'uwall', sex:'female', name, her:1, region:'uterwall', az:0, el:25, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
REPRO.push(
  UW('peri', 'Perimetrium', ['perimetrium'], null, 'The thin OUTER serous coat of the uterus (peri = around).'),
  UW('myo', 'Myometrium', ['myometrium'], 'The layer of smooth muscle.', 'The thick MIDDLE layer: it contracts in labour (oxytocin) and in menstrual cramps.'),
  UW('endo', 'Endometrium', ['functional layer', 'basal layer'], null, 'The INNER lining, where the embryo implants. Two layers: functional on top of basal.'),
  UW('func', 'Functional layer', ['functional layer'], 'The layer with SPIRAL arteries, shed during menstruation.', 'Stratum functionalis: built up in the proliferative phase (oestrogen), made secretory by progesterone, shed when progesterone falls.'),
  UW('basal', 'Basal layer', ['basal layer'], 'The layer with STRAIGHT arteries: it stays intact and forms the new functional layer.', 'Stratum basalis: never shed.'),
);

/* ── The cut-open figures (made-sections.js). Every name below is one her banks or slides use; the wording of `hers` clues is hers. ── */
const LB = (id, name, m, clue, fact, extra) => ({ id:'lb-' + id, kind:'longbone', name, her:1, region:'tsLong', az:0, el:8, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
TISSUES.push(
  LB('diaphysis', 'Diaphysis', ['compact bone of the shaft', 'medullary cavity', 'periosteum'], 'The shaft of a long bone.', 'Her skeleton match keys "tibial diaphysis" and "ulnar diaphysis". In endochondral ossification the bone collar forms round it and the PRIMARY ossification centre is in it.'),
  LB('epiphysis', 'Epiphysis', ['spongy bone', 'articular cartilage'], 'The end of a long bone. A "head" is a distinct one, separated from the shaft by a narrowed neck.', 'Spongy bone inside, articular cartilage on the joint surface. The SECONDARY ossification centres appear here.'),
  LB('medullary', 'Medullary cavity', ['medullary cavity'], 'The hollow of the shaft. In endochondral ossification it forms as the secondary ossification centres appear.', 'Holds yellow (fatty) marrow in adults. Lined by endosteum.'),
  LB('compact', 'Compact bone', ['compact bone of the shaft'], null, 'The dense wall of the shaft, built of osteons — the other figure in this deck is one block of it, magnified.', { her:0 }),
  LB('spongy', 'Spongy bone', ['spongy bone'], 'Formed when the periosteal bud invades the internal cavities.', 'Trabeculae with red marrow in the gaps: light, but strong along the lines of stress.'),
  LB('periosteum', 'Periosteum', ['periosteum'], null, 'The fibrous membrane round the outside of the bone (not over the articular cartilage). The periosteal bud grows in from it; appositional growth — growth in THICKNESS — happens under it.', { her:0 }),
);
const AWL = (id, name, region, m, clue, fact, extra) => ({ id:'awl-' + id, kind:'awall', name, her:1, region, az:0, el:0, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
AIRWAY.push(
  AWL('cring', 'C-shaped cartilage ring', 'awTrachea', ['c-shaped cartilage ring'], 'Hyaline cartilage that keeps the trachea open and gives it shape — open at the back.', 'Looks like white teeth when the trachea is cut lengthwise. The carina, epiglottis, trachea and bronchi have cartilage in their walls; bronchioles have none.'),
  AWL('trachealis', 'Trachealis muscle', 'awTrachea', ['trachealis muscle'], 'Connects the two free sides of the C-shaped cartilage rings, at the posterior side of the trachea.', 'When it contracts it narrows the trachea, so air is expelled with more force and clears the mucus during coughing. Being soft, it also lets food pass down the oesophagus behind it.'),
  AWL('lining', 'Ciliated epithelium', 'awTrachea', ['ciliated epithelium of the trachea', 'cilia'], 'The lining of the trachea: pseudostratified columnar epithelium — part of the mucociliary escalator.', 'Goblet cells make mucus that traps particles; the cilia sweep it upwards. The escalator does NOT include the squamous cells of the alveoli.', { alt:'pseudostratified columnar epithelium' }),
  AWL('cilia', 'Cilia', 'awTrachea', ['cilia'], 'The faint hairs on the lumen side of the duct, sweeping trapped particles upwards.', 'Her image question keys them as label B. Smoking paralyses them.'),
  AWL('bmuscle', 'Smooth muscle', 'awBronchiole', ['smooth muscle of the bronchiole'], 'In asthma it constricts, so less air reaches the alveoli.', 'A bronchiole has NO cartilage, so nothing holds it open when this ring of muscle tightens.', { sub:'of the bronchiole' }),
  AWL('cuboidal', 'Cuboidal epithelium', 'awBronchiole', ['cuboidal epithelium of the bronchiole'], 'The lining of a bronchiolus: cartilage absent.', 'Her slide match: trachea and bronchus = pseudostratified columnar + cartilage · bronchiolus = cuboidal, no cartilage · alveoli = mainly squamous.', { sub:'of the bronchiole' }),
  AWL('type1', 'Alveolar cell type 1', 'awAlveolus', ['alveolar cell type 1'], 'Squamous epithelium: allows rapid diffusion of respiratory gases.', 'The thin wall of the alveolus — a short distance for gases to diffuse during EXTERNAL respiration (her T/F says "internal": false).', { az:0, el:0 }),
  AWL('type2', 'Alveolar cell type 2', 'awAlveolus', ['alveolar cell type 2'], 'Cuboidal epithelium: the cell type that produces surfactant.', 'Surfactant is a lipoprotein that lowers surface tension so the alveoli stay open. Premature babies lack it: neonatal respiratory distress syndrome.'),
  AWL('capillary', 'Pulmonary capillary', 'awAlveolus', ['pulmonary capillary'], null, 'A single layer of endothelium (simple squamous). Blood arrives low in oxygen and leaves oxygenated.', { her:0 }),
  AWL('membrane', 'Respiratory membrane', 'awAlveolus', ['respiratory membrane'], null, 'The alveolar wall + the fused basement membranes + the capillary endothelium. Her T/F: it is NOT "alveolar cells and surfactant".'),
);
const SX = (id, kind, name, region, m, clue, fact, extra) => ({ id:'sx-' + id, kind, name, her:1, region, az:0, el:0, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
SENSES.push(
  SX('vestibuli', 'cochlea', 'Scala vestibuli', 'seCochlea', ['scala vestibuli'], 'The superior chamber of the cochlea, with perilymph.', 'Starts at the oval window, where the stapes pushes on the perilymph.'),
  SX('media', 'cochlea', 'Scala media', 'seCochlea', ['scala media'], 'The middle chamber — the cochlear duct, with endolymph. It houses the organ of Corti.', 'Her colour code: perilymph yellow, endolymph blue.', { alt:'cochlear duct' }),
  SX('tympani', 'cochlea', 'Scala tympani', 'seCochlea', ['scala tympani'], 'The inferior chamber of the cochlea, with perilymph.', 'Ends at the round window, which bulges out as the oval window is pushed in.'),
  SX('reissner', 'cochlea', "Reissner's membrane", 'seCochlea', ["reissner's membrane"], null, 'The thin roof of the scala media, between it and the scala vestibuli. Her slide lists it with the basilar and tectorial membranes.', { alt:'vestibular membrane' }),
  SX('basilar', 'cochlea', 'Basilar membrane', 'seCochlea', ['basilar membrane'], 'Movement of perilymph and endolymph results in its displacement.', 'The floor of the scala media; the organ of Corti sits on it. Where along the cochlea it moves most depends on the pitch (frequency).'),
  SX('tectorial', 'cochlea', 'Tectorial membrane', 'seCochlea', ['tectorial membrane'], null, 'The stiff flap over the hair cells. When the basilar membrane moves, the hairs bend against it. Loud noise drives them into it too violently — hair cells are lost for good.'),
  SX('corti', 'cochlea', 'Organ of Corti', 'seCochlea', ['organ of corti', 'hair cells'], 'In the scala media: where mechanical waves are transduced to electrical impulses.', 'The hearing organ itself: hair cells and their supporting cells on the basilar membrane.'),
  SX('hair', 'cochlea', 'Hair cells', 'seCochlea', ['hair cells'], 'Mechanoreceptors: bending them transduces sound to electrical stimuli.', 'Their stereocilia touch the tectorial membrane. Impulses leave along the cochlear part of the vestibulocochlear nerve (VIII) to the auditory cortex in the temporal lobe.'),
  SX('pigment', 'retina', 'Pigment layer', 'seRetina', ['pigment layer'], 'Prevents light reflection in the eye.', 'The outermost layer of the retina, against the choroid. Light has already passed through every other layer by the time it gets here.'),
  SX('rods', 'retina', 'Rods', 'seRetina', ['rods'], 'Photoreceptors for scotopic, achromatic vision.', 'Dim light, black and white, mostly round the edge of the retina. None at the optic disc.'),
  SX('cones', 'retina', 'Cones', 'seRetina', ['cones'], 'Photoreceptors for photopic, chromatic vision.', 'Bright light and colour. The fovea has ONLY cones — sharpest vision.'),
  SX('bipolar', 'retina', 'Bipolar cells', 'seRetina', ['bipolar cells'], null, 'The middle neurons of the retina: they pass the signal from the photoreceptors to the ganglion cells.'),
  SX('ganglion', 'retina', 'Ganglion cells', 'seRetina', ['ganglion cells', 'optic nerve fibres'], null, 'The last neurons of the retina. Their axons run over the inner surface and leave together as the optic nerve — at the optic disc, which therefore has no rods or cones: the blind spot.'),
);
GLANDS.push(
  { id:'gl-cortex', kind:'adrenalcut', name:'Adrenal cortex', her:1, region:'glAdrenal', az:0, el:0, m:['adrenal cortex'], clue:{ t:'The outer part of the adrenal gland: aldosterone and cortisol come from here.', hers:0 },
    fact:'Steroid hormones, under HORMONAL control: aldosterone (keeps blood sodium — her MCQ), cortisol (raises blood glucose; long-term therapy suppresses the immune system), and a trickle of gonadocorticoids — insignificant next to the gonads. SCHEMATIC: a gland cut open, beside the body.' },
  { id:'gl-medulla', kind:'adrenalcut', name:'Adrenal medulla', her:1, region:'glAdrenal', az:0, el:0, m:['adrenal medulla'], clue:{ t:'Sympathetic nerves stimulate it to release epinephrine: the fight and flight reflex — a neural stimulus.', hers:1 },
    fact:'The core of the gland: really a sympathetic ganglion that secretes into the blood. Epinephrine and norepinephrine — her example of NEURAL stimulation of an endocrine gland.' },
);

/* ── Read from her GRADED Module 3 quizzes (captured 21 Sep 2026): the three figures she tests with an image that no organ model shows (made-repro.js). ── */
const RX = (id, kind, sex, name, region, m, clue, fact, extra) => ({ id:'rx-' + id, kind, sex, name, her:1, region, az:0, el:0, m, clue:clue ? { t:clue, hers:1 } : undefined, fact, ...extra });
REPRO.push(
  RX('acrosome', 'sperm', 'male', 'Acrosome', 'rpSperm', ['acrosome'], 'The enzyme-filled cap that covers the head of the sperm.', 'Its enzymes digest a way through the zona radiata round the egg. Her label figure keys it; so does her fertilisation drop-down.'),
  RX('chromatin', 'sperm', 'male', 'Chromatin', 'rpSperm', ['chromatin'], 'In the head of the sperm: only 23 chromosomes.', 'The nucleus — haploid. Her label figure calls it chromatin.', { alt:'nucleus of the sperm' }),
  RX('mito', 'sperm', 'male', 'Mitochondria', 'rpSperm', ['mitochondria'], 'Found in the mid piece: they make the ATP for motility.', 'Wound round the start of the tail. Mitochondrial DNA is inherited only from the mother: the sperm\'s stay outside the egg.'),
  RX('tail', 'sperm', 'male', 'Tail', 'rpSperm', ['tail'], 'To propel the sperm cell.', 'A flagellum. Sperm with short, double or crooked tails have problems with motility.', { alt:'flagellum' }),
  RX('gonia', 'tubule', 'male', 'Spermatogonia', 'rpTubule', ['spermatogonia'], 'Diploid cells that divide mitotically to form diploid primary spermatocytes — the stem cells of the testis.', 'Against the wall of the tubule. Because they keep dividing by MITOSIS, males make gametes throughout life.', { alt:'spermatogonium' }),
  RX('primary', 'tubule', 'male', 'Primary spermatocytes', 'rpTubule', ['primary spermatocytes'], 'Diploid cells that go through Meiosis I to form haploid secondary spermatocytes.', 'The biggest cells in the wall. Her sequence: spermatogonium → diploid spermatocyte → haploid spermatocyte → spermatid → spermatozoon.'),
  RX('secondary', 'tubule', 'male', 'Secondary spermatocytes', 'rpTubule', ['secondary spermatocytes'], 'Haploid cells that go through Meiosis II to form haploid spermatids.', 'Short-lived, so seldom seen on a slide.'),
  RX('spermatids', 'tubule', 'male', 'Spermatids', 'rpTubule', ['spermatids'], 'A haploid male gamete before spermiogenesis.', 'Round cells near the lumen. SPERMIOGENESIS reshapes them into spermatozoa; spermatoGENESIS is the whole process from spermatogonia.'),
  RX('zoa', 'tubule', 'male', 'Spermatozoa', 'rpTubule', ['spermatozoa'], null, 'Released tail-first into the lumen of the tubule, then on to the epididymis to mature.', { her:0, alt:'sperm' }),
  RX('sertoli', 'tubule', 'male', 'Sertoli cells', 'rpTubule', ['sertoli cells'], 'They nurture the sperm cells and make the hormone inhibin.', 'Tall cells from the wall to the lumen. FSH acts on them; their inhibin suppresses FSH from the anterior pituitary.'),
  RX('leydig', 'tubule', 'male', 'Leydig cells', 'rpTubule', ['leydig cells'], 'Between the seminiferous tubules: they make the hormone testosterone.', 'OUTSIDE the tubule, next to the capillaries. LH acts on them.'),
  RX('pfollicle', 'ovarysec', 'female', 'Primary follicle', 'rpOvary', ['primary follicle'], null, 'Holds a PRIMARY oocyte: diploid, arrested in prophase I since before birth. Oogonia → primary oocytes happens during fetal development.', { her:0 }),
  RX('sfollicle', 'ovarysec', 'female', 'Secondary follicle', 'rpOvary', ['secondary follicle'], null, 'Growing under FSH; the developing follicle releases estrogen.', { her:0 }),
  RX('tfollicle', 'ovarysec', 'female', 'Tertiary follicle', 'rpOvary', ['tertiary follicle', 'oocyte in the tertiary follicle'], 'The fluid-filled Graafian follicle that ruptures at ovulation.', 'Ovulation is triggered by the LH peak. It releases a secondary oocyte arrested in metaphase of Meiosis II.', { alt:'Graafian follicle' }),
  RX('oocyte', 'ovarysec', 'female', 'Secondary oocyte', 'rpOvary', ['secondary oocyte', 'zona radiata'], 'A haploid female gamete that is released from the tertiary follicle.', 'Caught by the fimbriae and swept into the Fallopian tube. Meiosis II is only completed if fertilisation occurs.'),
  RX('zona', 'ovarysec', 'female', 'Zona radiata', 'rpOvary', ['zona radiata'], 'The layer round the egg that the sperm must get through.', 'Her drop-down keys it. The acrosome\'s enzymes open the way; calcium then blocks other sperm.', { alt:'corona radiata' }),
  RX('owall', 'ovarysec', 'female', 'Ovarian wall', 'rpOvary', ['ovarian wall'], 'It ruptures at ovulation to let the secondary oocyte out.', 'Drawn open at the top, where the follicle has just burst.'),
  RX('luteum', 'ovarysec', 'female', 'Corpus luteum', 'rpOvary', ['corpus luteum'], 'What is left of the follicle after ovulation: it releases progesterone and estrogen.', 'Progesterone keeps the endometrium. No pregnancy → it degenerates into the corpus albicans and menstruation follows; hCG from an embryo keeps it alive.'),
  RX('albicans', 'ovarysec', 'female', 'Corpus albicans', 'rpOvary', ['corpus albicans'], null, 'The white scar a corpus luteum leaves behind.', { her:0 }),
);

export const MORE_REGIONS = {
  brain: { model:'brain', m:[{ mat:/lobe$|^Cerebellum$|^Brain$|^Interlobar sulci$|^Insula$/ }], pad:1.12, min:0.05 },
  willis: { model:'willis', m:[/communicating artery$/, 'posterior cerebral artery', 'basilar artery', /^middle cerebral artery \(m1/], pad:1.35, min:0.05 },
  willisAll: { model:'willis', m:[/./], pad:1.1, min:0.05 },
  neuron:  { model:'neuron', m:[/./], pad:1.06, min:0.05 },
  nrTop:   { model:'neuron', m:['soma', 'dendrites', 'axon hillock'], pad:1.08, min:0.05 },
  nrAxon:  { model:'neuron', m:['axon', 'schwann cell', 'axon hillock'], pad:1.12, min:0.05 },
  nrEnd:   { model:'neuron', m:['axon terminals', 'postsynaptic cell'], pad:1.2, min:0.05 },
  synapse: { model:'neuron', m:[/synaptic|^receptors$|^postsynaptic cell$/], pad:1.7, min:0.05 },
  tissues:  { model:'tissues', m:[/./], pad:1.04, min:0.05 },
  tsJoint:  { model:'tissues', m:['bone', 'joint capsule', 'ligament'], pad:1.08, min:0.05 },
  tsBone:   { model:'tissues', m:['compact bone', 'lamellae', 'artery'], pad:1.15, min:0.05 },
  tsOsteon: { model:'tissues', m:['artery', 'vein'], pad:2.3, min:0.05 },      // the big middle osteon, from close in: a lacuna is 7 mm
  tsMuscle: { model:'tissues', m:['epimysium', 'perimysium', 'myofibrils'], pad:1.08, min:0.05 },
  tsFibre:  { model:'tissues', m:['sarcolemma', 'myofibrils', 'muscle fibre'], pad:1.25, min:0.05 },
  gliaCNS: { model:'glia', m:['capillary', 'cerebrospinal fluid'], pad:1.06, min:0.05 },
  gliaPNS: { model:'glia', m:['cell body (ganglion)', 'axon (pns)', 'satellite cells'], pad:1.12, min:0.05 },
  heart:    { model:'heart', m:[/^(left|right) (atrium|ventricle)$/, 'ascending aorta', 'pulmonary trunk', 'superior vena cava', 'aortic arch'], pad:1.12, min:0.05 },
  heartTop: { model:'heart', m:['aortic arch', 'brachiocephalic trunk', /subclavian|common carotid|brachiocephalic vein/, 'superior vena cava', 'right atrium'], pad:1.05, min:0.05 },
  heartAll: { model:'heart', m:[/lobe of/, 'aortic arch'], pad:1.05, min:0.05 },
  airway:  { model:'airway', m:[/lobe of/, 'trachea', 'diaphragm'], pad:1.08, min:0.05 },
  awUpper: { model:'airway', m:[/pharynx$/, 'soft palate', 'thyroid cartilage', 'cricoid cartilage', 'epiglottis'], pad:1.25, min:0.05 },
  awTree:  { model:'airway', m:['trachea', /bronchus/], pad:1.1, min:0.05 },
  eye:      { model:'eye', m:[/./], pad:1.1, min:0.05 },
  eyeFront: { model:'eye', m:['cornea', 'lens', 'ciliary body'], pad:1.05, min:0.05 },
  ear:      { model:'ear', m:[/./], pad:1.06, min:0.05 },
  earMid:   { model:'ear', m:['tympanic membrane', 'malleus', 'incus', 'stapes', 'oval window'], pad:1.5, min:0.05 },
  earIn:    { model:'ear', m:['vestibule', 'cochlea', 'semicircular canals', 'vestibulocochlear nerve'], pad:1.12, min:0.05 },
  rpFemale: { model:'female', m:[/./], pad:1.25, min:0.05 },
  rpSperm:  { model:'sperm', m:[/./], pad:1.12, min:0.05 },
  rpTubule: { model:'tubule', m:[/./], pad:1.12, min:0.05 },
  rpOvary:  { model:'ovarysec', m:[/./], pad:1.15, min:0.05 },
  rpMale:   { model:'male', m:[/./], pad:1.12, min:0.05 },
  arm:      { m:['humerus', 'radius', 'ulna', /metacarpal/, /of hand$/], side:'L', pad:1.08 },
  tsLong:    { model:'longbone', m:[/./], pad:1.1, min:0.05 },
  glAdrenal: { model:'adrenalcut', m:[/./], pad:1.5, min:0.05 },
  awTrachea: { model:'awwall', m:['c-shaped cartilage ring', 'oesophagus'], pad:1.15, min:0.05 },
  awBronchiole:{ model:'awwall', m:['smooth muscle of the bronchiole'], pad:1.6, min:0.05 },
  awAlveolus:{ model:'awwall', m:['alveolar cell type 1', 'pulmonary capillary'], pad:1.4, min:0.05 },
  seCochlea: { model:'cochlea', m:[/./], pad:1.1, min:0.05 },
  seRetina:  { model:'retina', m:[/./], pad:1.15, min:0.05 },
  wlVessels: { model:'walls', m:[/ of (artery|vein)$/, 'capillary', 'valve'], pad:1.12, min:0.05 },
  wlHeart:   { model:'walls', m:[/cardium$/, 'pericardial cavity'], pad:1.25, min:0.05 },
  ecg:       { model:'ecg', m:[/./], pad:1.08, min:0.05 },
  spiro:     { model:'spiro', m:[/./], pad:1.08, min:0.05 },
  uterwall:  { model:'uterwall', m:[/./], pad:1.3, min:0.05 },
  meninges: { model:'brain', m:[{ mat:/^Schematic$/ }], pad:1.2, min:0.05 },
  villi: { model:'brain', m:['arachnoid villi'], pad:1.15, min:0.075 },      // the villi are 5 mm across: asked from close in
};

export const MORE_SETS = {
  levers: [
    { id:'her', name:'Her three levers', hint:'What is in the middle? F = 1st, L = 2nd, E = 3rd', f:() => true },
    { id:'role', name:'Fulcrum · load · effort', hint:'Tap the part — or name the glowing part', f:i => i.kind === 'role' },
    { id:'class', name:'Which class?', hint:'First (power / direction) · second (strength) · third (speed)', f:i => i.kind === 'class' },
  ],
  repro: [
    { id:'her', name:'Her list', hint:'The parts on her Module 3 revision slides (no vagina, ligaments or bulbo-urethral glands in the 3D sources)', f:i => i.her },
    { id:'female', name:'Female', hint:'HuBMAP reference organs, placed as one set in this pelvis', f:i => i.sex === 'female' && i.kind === 'female' },
    { id:'male', name:'Male', hint:'Testis, ducts and glands — with their share of the semen', f:i => i.sex === 'male' && i.kind === 'male' },
    { id:'sperm', name:'Sperm & tubule', hint:'Her sperm-cell label figure and her spermatogenesis match (Leydig cells sit OUTSIDE the tubule)', f:i => i.kind === 'sperm' || i.kind === 'tubule' },
    { id:'ovarysec', name:'Inside the ovary', hint:'Her ovulation drop-downs: tertiary follicle → ovarian wall ruptures → secondary oocyte → corpus luteum', f:i => i.kind === 'ovarysec' },
    { id:'uwall', name:'Uterus wall', hint:'Perimetrium, myometrium, and the two layers of the endometrium', f:i => i.kind === 'uwall' },
  ],
  senses: [
    { id:'her', name:'Her list', hint:'The parts on her Module 3 revision slides. Schematics, not to scale', f:i => i.her },
    { id:'eye', name:'Eye', hint:'Three tunics, the lens, two humors', f:i => i.kind === 'eye' },
    { id:'ear', name:'Ear', hint:'Outer, middle and inner ear', f:i => i.kind === 'ear' },
    { id:'cochlea', name:'Inside the cochlea', hint:'Her slide 21: three chambers, three membranes, the organ of Corti', f:i => i.kind === 'cochlea' },
    { id:'retina', name:'Layers of the retina', hint:'Light comes in from the left: ganglion → bipolar → rods and cones → pigment layer', f:i => i.kind === 'retina' },
  ],
  airway: [
    { id:'her', name:'Her list', hint:'Her airway figure (nostril and nasal cavity are not in the 3D source)', f:i => i.her },
    { id:'upper', name:'Pharynx & larynx', hint:'Above the trachea', f:i => i.kind === 'upper' },
    { id:'tree', name:'Bronchial tree', hint:'Trachea, carina, bronchi — the lobes turn to glass', f:i => i.kind === 'tree' },
    { id:'lung', name:'Lungs', hint:'Five lobes and the diaphragm', f:i => i.kind === 'lung' },
    { id:'awall', name:'Airway walls', hint:'Module 1 histology: trachea in cross-section · a bronchiole · an alveolus', f:i => i.kind === 'awall' },
    { id:'spiro', name:'Lung volumes', hint:'Four volumes in one column; each capacity spans the volumes it adds up', f:i => i.kind === 'spiro' },
    { id:'all', name:'Everything', hint:'All of it', f:() => true },
  ],
  heart: [
    { id:'her', name:'Her list', hint:'Every heart structure that is a key in her Module 1 bank', f:i => i.her },
    { id:'inside', name:'Chambers & valves', hint:'Four chambers, four valves, papillary muscles', f:i => /chamber|valve|wall/.test(i.kind) },
    { id:'vessels', name:'Great vessels', hint:'Aorta and its branches, pulmonary vessels, venae cavae', f:i => i.kind === 'vessel' },
    { id:'coronary', name:'Coronary', hint:'The heart\'s own supply — and the widow maker', f:i => i.kind === 'coronary' },
    { id:'cond', name:'Conduction', hint:'Schematic: SA node to Purkinje fibres', f:i => i.kind === 'cond' },
    { id:'ecg', name:'ECG', hint:'Her label figure (P · Q · R · S · T) and what each part means', f:i => i.kind === 'ecg' },
    { id:'all', name:'Everything', hint:'All of it', f:() => true },
  ],
  tissues: [
    { id:'her', name:'Her list', hint:'The blanks of her three figures. Schematics, not to scale', f:i => i.her },
    { id:'joint', name:'Synovial joint', hint:'Her six-blank label question', f:i => i.kind === 'joint' },
    { id:'bone', name:'Compact bone', hint:'The osteon: her six-blank cloze', f:i => i.kind === 'bone' },
    { id:'muscle', name:'Muscle', hint:'Muscle, fascicle, fibre and their three wrappings', f:i => i.kind === 'muscle' },
    { id:'vessel', name:'Vessel wall', hint:'Module 1: artery, vein, capillary, valve and the three tunics — her 7-point match', f:i => i.kind === 'vessel' },
    { id:'hwall', name:'Heart wall', hint:'Module 1: pericardium to endocardium', f:i => i.kind === 'hwall' },
    { id:'longbone', name:'Long bone', hint:'Cut open: the nouns of her ossification and bone-growth questions', f:i => i.kind === 'longbone' || i.id === 'ts-plate' || i.id === 'ts-cartilage' },
    { id:'all', name:'Everything', hint:'All of it', f:() => true },
  ],
  neuron: [
    { id:'her', name:'Her list', hint:'Her neuron match + her six neuroglia. Schematics, not to scale', f:i => i.her },
    { id:'neuron', name:'Neuron', hint:'Her ten-point match', f:i => i.kind !== 'glia' && i.her },
    { id:'glia', name:'Neuroglia', hint:'Her six-point match: which cell does what', f:i => i.kind === 'glia' },
    { id:'all', name:'Everything', hint:'Adds the nucleus and the vesicles', f:() => true },
  ],
  willis: [
    { id:'her', name:'Her list', hint:'On the ventral side of the brain. Berry aneurysms form here → haemorrhagic stroke', f:i => i.her },
    { id:'all', name:'Everything', hint:'Adds the middle cerebral artery', f:() => true },
  ],
  nerves: [
    { id:'her', name:'Her list', hint:'Her plexus question: phrenic (cervical) · femoral (lumbar) · sciatic (sacral) — plus ulnar and vagus', f:i => i.her },
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
    { id:'men',    name:'Meninges & CSF',    hint:'Schematic layers — dura, arachnoid, pia — and the CSF spaces', f:i => i.kind === 'men' || i.kind === 'csf' },
    { id:'cn',     name:'Cranial nerves',    hint:'All twelve, from below', f:i => /^br-cn/.test(i.id) },
    { id:'all',    name:'Everything',        hint:'All of it', f:() => true },
  ],
};

/* ── Trace it: pathways tapped in flow order. A step = an item id + the question that asks for it + `say`, the line that
 *    step earns in a written answer. Steps come from HER wording only (focus row ns-csf: "from the choroid plexus through
 *    all four ventricles, into the subarachnoid space, back through the arachnoid granulations into venous blood"; her MCQ
 *    keys "choroid plexuses; arachnoidal villi … into the sagittal sinus"). The foramina and apertures between the
 *    ventricles are not steps she asks, so they are not steps here. `context` = on stage and tappable, but not a step. ── */
export const TRACES = {
  repro: [
    { id:'tr-sperm', name:'The sperm\'s path', short:'Trace the sperm', ask:'from where it is made to the outside', sex:'male', xray:false, region:'rpMale', az:100, el:0,
      hint:'Her duct sequence: testis → epididymis → vas deferens → ejaculatory duct → urethra',
      note:'Her slide gives: rete testis → epididymis → vas deferens → ampulla → ejaculatory duct → urethra (prostatic → membranous → penile). The rete testis and the ampulla are not separate structures in the 3D model, so they ride in the lines, not as taps.',
      steps:[
        { it:'rp-testis',     q:'Where are sperm MADE?', say:'Testis: seminiferous tubules (FSH) → rete testis.' },
        { it:'rp-epididymis', q:'Which duct first — where they mature and are stored?', say:'Epididymis.' },
        { it:'rp-vas',        q:'Then up and over the bladder in which duct?', say:'Vas (ductus) deferens → its ampulla, behind the bladder.', el:5 },
        { it:'rp-seminal',    q:'Which glands add about 60 % of the semen here?', say:'Seminal vesicles: alkaline, fructose, prostaglandins.', az:160, el:5 },
        { it:'rp-prostate',   q:'The duct now runs through which gland, which adds about 30 %?', say:'Ejaculatory duct, through the prostate: acidic, citric acid, PSA.', az:120 },
        { it:'rp-urethra',    q:'…and out through?', say:'Urethra: prostatic → membranous → penile.', el:-5 },
      ] },
    { id:'tr-egg', name:'The egg\'s path', short:'Trace the egg', ask:'from the ovary to where an embryo is housed', sex:'female', xray:false, region:'rpFemale', az:0, el:10,
      hint:'Ovary → fimbriae → fallopian tube → uterus',
      note:'From her female parts-and-functions slide. The female organs are HuBMAP reference organs placed in this pelvis as one set.',
      steps:[
        { it:'rp-ovary',    q:'Where is the secondary oocyte released from?', say:'Ovary, at ovulation (the LH peak).' },
        { it:'rp-fimbriae', q:'What catches it?', say:'Fimbriae on the infundibulum stroke over the ovary and catch it.' },
        { it:'rp-ampulla',  q:'Where is it usually fertilised?', say:'In the fallopian tube (its ampulla); cilia move it along.' },
        { it:'rp-isthmus',  q:'Through which narrow stretch next?', say:'The isthmus of the tube.' },
        { it:'rp-uterus',   q:'…to be housed where?', say:'Uterus: the embryo implants in the endometrium.' },
      ] },
  ],
  senses: [
    { id:'tr-sound', name:'Sound to the cochlea', short:'Trace the sound', ask:'from the air to the hair cells', xray:false, region:'ear', az:0, el:8,
      hint:'Her numbered path: ear canal → tympanic membrane → ossicles → oval window → cochlea',
      note:'The five middle steps are numbered exactly so on her revision slide 19; pinna and nerve are the ends she gives in the text around it.',
      steps:[
        { it:'se-pinna',    q:'What COLLECTS the sound?', say:'Pinna (auricle) collects the sound waves.' },
        { it:'se-canal',    q:'Down which passage?', say:'External auditory canal.' },
        { it:'se-drum',     q:'What do the waves set vibrating?', say:'Tympanic membrane vibrates.', region:'earMid' },
        { it:'se-ossicles', q:'What carries the vibration across the middle ear — and amplifies it?', say:'Ossicles — malleus, incus, stapes — transmit and amplify.', region:'earMid' },
        { it:'se-oval',     q:'Onto which opening does the stapes push?', say:'Oval window: vibration passes into the fluid of the inner ear.', region:'earMid' },
        { it:'se-cochlea',  q:'Where is it turned into nerve impulses?', say:'Cochlea: hair cells of the organ of Corti transduce the waves into electrical impulses.', region:'earIn' },
        { it:'se-nerve8',   q:'…carried to the brain by?', say:'Vestibulocochlear nerve (VIII) → auditory cortex in the temporal lobe.', region:'earIn' },
      ] },
    { id:'tr-light', name:'Light to the retina', short:'Trace the light', ask:'from the front of the eye to the brain', xray:false, region:'eye', az:38, el:22,
      hint:'Cornea → aqueous humor → pupil → lens → vitreous humor → retina → optic nerve',
      note:'Standard order through the refractive media; the percentages are from her slide 16 (cornea 80 %, lens 20 %).',
      steps:[
        { it:'se-cornea',      q:'What does light pass through FIRST — and bend most at?', say:'Cornea — about 80 % of the refraction.', region:'eyeFront' },
        { it:'se-aqueous',     q:'Then which fluid?', say:'Aqueous humor, in the anterior segment.', region:'eyeFront' },
        { it:'se-pupil',       q:'Through which opening?', say:'Pupil — its size is set by the iris.', region:'eyeFront', az:20, el:12 },
        { it:'se-lens',        q:'What fine-focuses it?', say:'Lens — about 20 % of the refraction, and accommodation.', region:'eyeFront' },
        { it:'se-vitreous',    q:'Then which gel?', say:'Vitreous humor, in the posterior segment.' },
        { it:'se-retina',      q:'Where is it turned into nerve impulses?', say:'Retina: rods and cones transduce light; bipolar then ganglion cells carry it on.' },
        { it:'se-optic-nerve', q:'…and leaves the eye by?', say:'Optic nerve (II), from the optic disc → visual cortex in the occipital lobe.', az:150, el:10 },
      ] },
  ],
  airway: [
    { id:'tr-air', name:'A breath in', short:'Trace the air', ask:'from the back of the nose to the segments of the lung', open:1, xray:false, region:'awTree', az:0, el:5,
      hint:'Pharynx → larynx → trachea → bronchial tree',
      note:'Standard anatomical order — she has no ordering question on this in the Module 1 bank. The nasal cavity before it and the bronchioles and alveoli after it are not in the 3D source.',
      steps:[
        { it:'aw-nasoph',    region:'awUpper', az:90, el:0, q:'Air has come through the nasal cavity. Which part of the pharynx first?', say:'Nasopharynx (air only).' },
        { it:'aw-oroph',     region:'awUpper', az:90, el:0, q:'Then?', say:'Oropharynx (shared with food).' },
        { it:'aw-laryngoph', region:'awUpper', az:90, el:0, q:'Then?', say:'Laryngopharynx — where air and food part ways.' },
        { it:'aw-larynx',    region:'awUpper', az:30, el:0, q:'Forward into which structure, which keeps the airway open?', say:'Larynx.' },
        { it:'aw-trachea',   q:'Down which tube?', say:'Trachea, to the carina.' },
        { it:'aw-rmain',     q:'Into a primary bronchus — tap the one an inhaled peanut usually takes.', say:'Primary (main) bronchus — the right is wider and more vertical.' },
        { it:'aw-lobar',     q:'Which bronchi next — one to each lobe?', say:'Lobar (secondary) bronchi.' },
        { it:'aw-segmental', q:'And then?', say:'Segmental (tertiary) bronchi → bronchioles → alveoli, where gas exchange happens.' },
      ] },
  ],
  heart: [
    { id:'tr-blood', name:'Blood through the heart', short:'Trace the blood', ask:'from the vena cava to the aorta', open:1, xray:false, region:'heart', az:20, el:5,
      hint:'Her thirteen-step sequence: right side → lungs → left side',
      note:'The order and the names are her own fill-in-the-blanks sequence. Chambers are drawn as glass so the valves can be tapped.',
      steps:[
        { it:'ht-svc',          q:'Deoxygenated blood returns from the head and arms. Through which vessel?', say:'Superior vena cava (the inferior vena cava and the coronary sinus arrive at the same place).', region:'heartTop', az:340 },
        { it:'ht-ra',           q:'Into which chamber?', say:'Right atrium.', az:330 },
        { it:'ht-tricuspid',    q:'Through which valve?', say:'Right atrioventricular (tricuspid) valve.' },
        { it:'ht-rv',           q:'Into which chamber?', say:'Right ventricle.', az:10 },
        { it:'ht-pulm-valve',   q:'Out through which valve?', say:'Pulmonary (semilunar) valve.', el:10 },
        { it:'ht-pa',           q:'Into which vessel?', say:'Pulmonary trunk → pulmonary arteries.', el:10 },
        { it:'ht-lungs',        q:'…to where?', say:'The lungs: carbon dioxide out, oxygen in.', region:'heartAll', az:10 },
        { it:'ht-pv',           q:'Back to the heart through which vessels?', say:'The four pulmonary veins.', az:180, el:10 },
        { it:'ht-la',           q:'Into which chamber?', say:'Left atrium.', az:180, el:10 },
        { it:'ht-mitral',       q:'Through which valve?', say:'Mitral (bicuspid, left atrioventricular) valve.', az:100 },
        { it:'ht-lv',           q:'Into which chamber?', say:'Left ventricle.', az:60 },
        { it:'ht-aortic-valve', q:'Out through which valve?', say:'Aortic (semilunar) valve.', az:40, el:10 },
        { it:'ht-aorta',        q:'Into which vessel — and so to the body?', say:'Aorta.', region:'heartTop' },
      ] },
    { id:'tr-conduction', name:'The heartbeat\'s impulse', short:'Trace the impulse', ask:'from the pacemaker to the ventricular muscle', open:1, men:1, xray:false, region:'heart', az:20, el:2,
      hint:'SA node → AV node → bundle of His → bundle branches → Purkinje fibres',
      note:'The conduction system is a schematic built onto the real heart (the 3D source has none). The order is her ordering question; the ECG lines are from her ECG matches.',
      steps:[
        { it:'ht-sa',       q:'Where does the impulse START — the pacemaker?', say:'SA node fires; the impulse spreads through the right and left atria, which depolarise and contract — the P wave.', az:330, el:10 },
        { it:'ht-av',       q:'Where is it briefly delayed?', say:'AV node — the brief delay is the PR segment.' },
        { it:'ht-his',      q:'Down which bundle does it enter the ventricles?', say:'Bundle of His (atrioventricular bundle).' },
        { it:'ht-branches', q:'Then along what, either side of the septum?', say:'Right and left bundle branches.', el:-5 },
        { it:'ht-purkinje', q:'…and out through the ventricular walls by what?', say:'Purkinje fibres — ventricular depolarisation and contraction: the QRS complex.', el:-5 },
      ] },
  ],
  neuron: [
    { id:'tr-impulse', name:'A nerve impulse', short:'Trace the impulse', ask:'from where the signal arrives to the next cell', xray:false, region:'neuron', az:0, el:4,
      hint:'Dendrites → soma → axon → terminals → across the synapse',
      note:'A schematic neuron, not to scale; one terminal is repeated enlarged to show the synapse. Each line is her own definition of that part.',
      steps:[
        { it:'nr-dendrites', region:'nrTop',  q:'Where does the signal ARRIVE?', say:'Dendrites — short branched extensions — receive the signal and carry it toward the cell body.' },
        { it:'nr-soma',      region:'nrTop',  q:'Where does it travel to?', say:'To the soma (cell body): nucleus, mitochondria, endoplasmic reticulum.' },
        { it:'nr-hillock',   region:'nrTop',  q:'Where is the nerve impulse GENERATED?', say:'At the axon hillock the action potential is generated — a rapid sequence of voltage changes across the membrane.' },
        { it:'nr-axon',      region:'nrAxon', q:'Which long, single process carries it away from the soma?', say:'Along the axon, which conducts impulses AWAY from the soma.' },
        { it:'nr-node',      region:'nrAxon', q:'On a myelinated axon the impulse LEAPS. From where to where?', say:'It leaps from one node of Ranvier to the next (saltatory conduction): the myelin insulates in between, so it is fast.' },
        { it:'nr-terminals', region:'nrEnd',  q:'Where does the axon end?', say:'At the axon terminals (telodendria), where calcium channels open as the impulse arrives.' },
        { it:'nr-presyn',    region:'synapse', el:10, q:'Which membrane releases the neurotransmitter?', say:'The presynaptic membrane releases neurotransmitter from its vesicles by exocytosis.' },
        { it:'nr-cleft',     region:'synapse', el:10, q:'What does the neurotransmitter diffuse across?', say:'It diffuses across the synaptic cleft.' },
        { it:'nr-postsyn',   region:'synapse', el:10, q:'Where does it bind?', say:'It binds to receptors on the postsynaptic membrane, exciting or inhibiting the next cell.' },
      ] },
  ],
  brain: [
    { id:'tr-csf', name:'CSF pathway', short:'Trace the CSF', ask:'from where it is made to where it re-enters the blood', men:1, region:'brain', az:75, el:14,
      hint:'Made → four ventricles → subarachnoid space → back into blood',
      note:'Dura, arachnoid, pia, subarachnoid space and the villi are schematic layers built on this brain (thickness exaggerated); the ventricles, choroid plexus and sagittal sinus are real meshes.',
      context:['br-dura', 'br-arachnoid', 'br-pia'],
      steps:[
        { it:'br-choroid',          q:'Where is cerebrospinal fluid MADE?', say:'Made by the choroid plexuses — modified ependymal cells filtering blood plasma, in the ventricles.' },
        { it:'br-lat-ventricle',    q:'Which chambers does it fill first — one in each hemisphere?', say:'It fills the two lateral ventricles, one in each cerebral hemisphere.' },
        { it:'br-third-ventricle',  q:'Where does it flow next?', say:'Into the third ventricle, the slit between the two halves of the thalamus (diencephalon).' },
        { it:'br-aqueduct',         q:'Then through which narrow channel?', say:'Down the cerebral aqueduct, through the midbrain.' },
        { it:'br-fourth-ventricle', q:'Into which chamber — the one nearest the cerebellum?', say:'Into the fourth ventricle, between the pons/medulla and the cerebellum.' },
        { it:'br-subarachnoid',     q:'It leaves the ventricles. Which space does it circulate in, around the brain and cord?', say:'Out into the subarachnoid space (and the central canal) — it surrounds and cushions the brain and spinal cord.', region:'meninges', az:60, el:35 },
        { it:'br-villi',            q:'Which structures reabsorb it?', say:'Reabsorbed by the arachnoid villi (granulations).', region:'villi', az:70, el:30 },
        { it:'br-sss',              q:'…into which vessel — back into the blood?', say:'Into the superior sagittal sinus — a dural venous sinus — and so back into venous blood.', region:'villi', az:70, el:30 },
      ] },
  ],
};
