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

/* ── Heart (Module 1): heart.glb (604 KB) cut from the source's cardiovascular model. "Her list" = the keys of the 363-question
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
  meninges: { model:'brain', m:[{ mat:/^Schematic$/ }], pad:1.2, min:0.05 },
  villi: { model:'brain', m:['arachnoid villi'], pad:1.15, min:0.075 },      // the villi are 5 mm across: asked from close in
};

export const MORE_SETS = {
  heart: [
    { id:'her', name:'Her list', hint:'Every heart structure that is a key in her Module 1 bank', f:i => i.her },
    { id:'inside', name:'Chambers & valves', hint:'Four chambers, four valves, papillary muscles', f:i => /chamber|valve/.test(i.kind) },
    { id:'vessels', name:'Great vessels', hint:'Aorta and its branches, pulmonary vessels, venae cavae', f:i => i.kind === 'vessel' },
    { id:'coronary', name:'Coronary', hint:'The heart\'s own supply — and the widow maker', f:i => i.kind === 'coronary' },
    { id:'cond', name:'Conduction', hint:'Schematic: SA node to Purkinje fibres', f:i => i.kind === 'cond' },
    { id:'all', name:'Everything', hint:'All of it', f:() => true },
  ],
  tissues: [
    { id:'her', name:'Her list', hint:'The blanks of her three figures. Schematics, not to scale', f:i => i.her },
    { id:'joint', name:'Synovial joint', hint:'Her six-blank label question', f:i => i.kind === 'joint' },
    { id:'bone', name:'Compact bone', hint:'The osteon: her six-blank cloze', f:i => i.kind === 'bone' },
    { id:'muscle', name:'Muscle', hint:'Muscle, fascicle, fibre and their three wrappings', f:i => i.kind === 'muscle' },
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
