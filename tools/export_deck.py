# Cut a small per-deck GLB out of the Z-Anatomy source, with the SAME export settings as the big models
# (export_apply, Y-up, Draco 6), so every deck still shares the body's coordinate space.
#   blender.exe -b <Startup.blend> --python tools/export_deck.py -- <deck> <out.glb>
# Read-only on the .blend (nothing is saved). Dev-time tool; not shipped to the browser.
import bpy, re, sys

deck, out = sys.argv[sys.argv.index('--') + 1:][:2]

CRANIAL = r'^(olfactory|optic|oculomotor|trochlear|trigeminal|abducens|facial|vestibulocochlear|glossopharyngeal|vagus|accessory|hypoglossal) nerve \('
DECKS = {
    # name regexes are matched against the object name with its .l/.r suffix removed, case-insensitive
    'glands': dict(names=[r'^(adenohypophysis|neurohypophysis|pineal gland|thyroid gland|hypothalamus|pancreas|testis|kidney|suprarenal gland)$',
                          r'^(inferior|superior) parathyroid gland$', r'^(left|right) lobe of thymus$']),
    'brain':  dict(paths=[r'Central nervous system'], names=[CRANIAL, r'^(olfactory bulb|olfactory tract|optic chiasm|optic tract)$',
                          r'^(adenohypophysis|neurohypophysis|pineal gland)$', r'^superior sagittal sinus$'],      # the sinus is where CSF goes back to blood (Trace it)
                   drop=[r'^spinal dura$', r'spinal cord', r'(spino|spinal|cortico|reticulo|vestibulo|tecto|rubro)[a-z]*(spinal|thalamic|cerebellar|tectal)? tract', r'tract$',
                         r'fasciculus', r'horn of spinal', r'funiculus', r'^cauda equina$', r'nucleus of accessory nerve']),
    'nerves': dict(names=[r'^(sciatic|femoral|tibial|common fibular|obturator|pudendal|median|ulnar|radial|axillary|musculocutaneous) nerve$',
                          r'^intercostal nerves$', r'brachial plexus$', r'^vagus nerve \(']),
    # Module 1. The heart with its great vessels, valves and coronaries; the lung lobes ride along as context for the blood-flow trace.
    'heart':  dict(names=[r'^(left|right) (atrium|ventricle)$', r'papillary muscle of', r'leaflet', r'^(ascending aorta|aortic arch|thoracic aorta|brachiocephalic trunk)$',
                          r'^(left|right) (common carotid|subclavian) artery$', r'^(pulmonary trunk|bifurcation of pulmonary trunk|left pulmonary artery|right pulmonary artery)$',
                          r'^(left|right) (superior|inferior) pulmonary vein$', r'^superior vena cava$', r'^inferior vena cava \(thoracic part\)$', r'^(left|right) brachiocephalic vein$',
                          r'^internal jugular vein$', r'^(left|right) subclavian vein$', r'^(left|right) coronary artery$', r'^anterior interventricular artery$',
                          r'^circumflex artery of heart$', r'^marginal artery$', r'^coronary sinus$', r'^(great|middle) cardiac vein$', r'lobe of (left|right) lung$']),
    # Module 1. The airway from the pharynx down, the lungs, and the diaphragm under them.
    'airway': dict(names=[r'lobe of (left|right) lung$', r'^trachea$', r'bronchus', r'^(naso|oro|laryngo)pharynx$', r'^(soft palate|uvula of palate|epiglottis|tongue)$',
                          r'^(thyroid|cricoid) cartilage$', r'^hyoid', r'^diaphragm$']),
    # Module 3. The male organs (the source body is male) + bladder and urethra, which the sperm path ends in.
    'male':   dict(names=[r'^(testis|epididymis|ductus deferens|ejaculatory duct|seminal gland|prostate|glans penis)$', r'^corpus (cavernosum|spongiosum) of penis$',
                          r'^(urethra|urinary bladder)$']),
    # Module 2. Her sagittal skull figure circles two of these: "they are both a sinus" (a cavity within a bone). Shown inside a glass skull.
    'sinuses': dict(names=[r'^sinus of (frontal|sphenoid) bone$']),
    'willis': dict(names=[r'^(anterior|posterior) communicating artery$', r'^(anterior|middle|posterior) cerebral artery', r'^internal carotid artery$',
                          r'^vertebral artery$', r'^basilar artery$', r'^insular branches of middle cerebral artery']),
}
spec = DECKS[deck]
rx = lambda pats: [re.compile(p, re.I) for p in pats]
names, paths, drop = rx(spec.get('names', [])), rx(spec.get('paths', [])), rx(spec.get('drop', []))

where = {}
def walk(coll, path):
    p = path + [coll.name]
    for o in coll.objects:
        where.setdefault(o.name, []).append(' > '.join(p))
    for c in coll.children:
        walk(c, p)
for c in bpy.context.scene.collection.children:
    walk(c, [])

picked = []
for o in bpy.data.objects:
    if o.type not in ('MESH', 'CURVE'):
        continue                                            # nerves and vessels are CURVE objects; export_apply turns them into tubes
    if o.type == 'MESH' and len(o.data.vertices) < 5:
        continue                                            # 2-vertex meshes are label anchors (the parathyroids are 9 vertices - keep them)
    base = re.sub(r'\.[lr]$', '', o.name, flags=re.I).strip()
    if any(d.search(base) for d in drop):
        continue
    if any(n.search(base) for n in names) or any(p.search(w) for p in paths for w in where.get(o.name, [])):
        picked.append(o)

# objects in excluded / hidden collections cannot be selected: link them into a fresh, visible collection first
tmp = bpy.data.collections.new('EXPORT_TMP')
bpy.context.scene.collection.children.link(tmp)
bpy.ops.object.select_all(action='DESELECT')
for o in picked:
    if o.name not in tmp.objects:
        tmp.objects.link(o)
    o.hide_viewport = False
    o.hide_render = False
    try:
        o.hide_set(False)
    except RuntimeError:
        pass
bpy.context.view_layer.update()
ok = 0
for o in picked:
    try:
        o.select_set(True); ok += 1
    except RuntimeError as e:
        print('cannot select', o.name, e)
bpy.context.view_layer.objects.active = picked[0]
print('DECK', deck, 'picked', len(picked), 'selected', ok)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_apply=True, export_yup=True,
                          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6)
print('DONE ->', out)
