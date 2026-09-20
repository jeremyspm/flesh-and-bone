/* Gate for "Her figure" (docs/HER-FIGURE-REFERENCE-SPEC.md). Run before a push:  node tools/check-figrefs.mjs [--live]
   - every src points at one of HIS Paper Sims, never inside this repo (her images are not ours to publish here)
   - the file exists in that sim's img/ folder on this disk (sibling repos under github/)
   - every entry says where it is from and how it differs from ours
   - with --live: every src also answers 200 on GitHub Pages */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..');
const GITHUB = process.env.FAB_GITHUB || 'C:/Users/USER/Desktop/github';
const { FIGREF } = await import(pathToFileURL(path.join(ROOT, 'data-more.js')).href);
const SIMS = { 'https://jeremyspm.github.io/hs2-paper-m1/': 'hs2-paper-m1', 'https://jeremyspm.github.io/hs2-test2/': 'hs2-test2', 'https://jeremyspm.github.io/hs2-test3/': 'hs2-test3' };
const fails = [], seen = new Set();
for (const [key, list] of Object.entries(FIGREF)) for (const f of list) {
  const sim = Object.keys(SIMS).find(s => f.src.startsWith(s + 'img/'));
  if (!sim) { fails.push(`${key}: src is not on one of his sims: ${f.src}`); continue; }
  if (f.sim !== sim) fails.push(`${key}: sim link does not match the image host`);
  const file = path.join(GITHUB, SIMS[sim], 'img', f.src.slice((sim + 'img/').length));
  if (!fs.existsSync(file)) fails.push(`${key}: not on disk: ${file}`);
  if (!f.from || f.from.length < 8) fails.push(`${key}: no "from" line`);
  if (!f.differs || f.differs.length < 20) fails.push(`${key}: no "differs" sentence`);
  seen.add(f.src);
}
if (process.argv.includes('--live')) for (const src of seen) { const r = await fetch(src, { method: 'HEAD' }); if (r.status !== 200) fails.push(`live ${r.status}: ${src}`); }
console.log(`her-figure refs: ${Object.keys(FIGREF).length} keys · ${seen.size} images${process.argv.includes('--live') ? ' · checked live' : ''}`);
if (fails.length) { console.log('FIGREF CHECK FAILED:\n  ' + fails.join('\n  ')); process.exit(1); }
