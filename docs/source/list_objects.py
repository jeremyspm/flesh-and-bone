# Read-only: list every mesh object in the Z-Anatomy source with its collection path and size.
import bpy, os, sys
out = sys.argv[sys.argv.index('--') + 1]
parents = {}
def walk(coll, path):
    p = path + [coll.name]
    for o in coll.objects:
        parents.setdefault(o.name, []).append(' > '.join(p))
    for c in coll.children:
        walk(c, p)
for c in bpy.context.scene.collection.children:
    walk(c, [])
rows = []
for o in bpy.data.objects:
    if o.type != 'MESH':
        continue
    rows.append('%s\t%d\t%s' % (o.name, len(o.data.vertices), ' || '.join(parents.get(o.name, ['(unlinked)']))))
rows.sort(key=str.lower)
with open(out, 'w', encoding='utf-8') as f:
    f.write('# name <tab> vertices <tab> collection path(s)\n' + '\n'.join(rows) + '\n')
print('WROTE', len(rows), 'mesh objects ->', out)
