/* Round autoplayer — paste into the page (DevTools console or the JS tool) to prove a deck end to end
 * without a human: real ray-cast taps, one deliberate two-miss reveal, the re-queue, the results log.
 * It drives G.next() itself because requestAnimationFrame may be frozen in a hidden pane.
 * Usage:  await fabAutoplay('bones')   → { log:[…], right, total, logged, state }
 *         await fabAutoplay('brain', 'trace')  → walks the deck's pathway: every step tapped for real, step 3 missed twice on purpose */
window.fabAutoplay = async (deck = 'bones', mode = 'find') => {
  const { G, ITEM, THREE } = FB, v = new THREE.Vector3(), log = [];
  if (!(innerWidth > 0)) return 'viewport is 0x0 — set a size first';
  await G.setDeck(deck); G.mode = mode; FB.S.o.len = 10; G.start();
  const aim = it => { const f = mode === 'trace' ? G.traceFrame() : mode === 'find' ? FB.regionFrame(it.region, it.az, it.el) : G.itemFrame(it); if (!f) return;
    FB.controls.target.copy(f.target); FB.camera.position.copy(f.pos); FB.camera.lookAt(f.target); FB.camera.updateMatrixWorld(true); };
  const findPt = it => { if (it.on && !it.zone) {                       // a point landmark (the carina, the head of the femur): aim INSIDE its sphere, not anywhere on the bone
      for (const info of it.infos) { const w = FB.pointWorld(it, info); for (let k = 0; k < 60; k++) { const q = w.clone().add(new THREE.Vector3(Math.sin(k * 2.4), Math.cos(k * 1.7), Math.sin(k * .9 + 1)).multiplyScalar(it.r * (k / 60)));
          const s = FB.toScreen(q), e = document.elementFromPoint(s.x, s.y); if (!e || e.id !== 'c') continue; const h = FB.cast(s.x, s.y); if (h && h.object.userData.info === info && h.point.distanceTo(w) <= it.r * .95) return s; } } return null; }
    for (const info of it.infos) { const p = info.mesh.geometry.attributes.position, step = Math.max(1, p.count / 400 | 0);      // dense enough to find a part that only shows on a cut face
      for (let k = 0; k < p.count; k += step) { v.set(p.getX(k), p.getY(k), p.getZ(k));
        if (it.zone) { const bb = info.mesh.geometry.boundingBox; if (!it.zone([(v.x - bb.min.x) / (bb.max.x - bb.min.x), (v.y - bb.min.y) / (bb.max.y - bb.min.y), (v.z - bb.min.z) / (bb.max.z - bb.min.z)])) continue; }
        if (!info.mesh.visible) break;
        info.mesh.localToWorld(v); const s = FB.toScreen(v);
        if (!(s.x > 5 && s.y > 5 && s.x < innerWidth - 5 && s.y < innerHeight - 5)) continue;
        const e = document.elementFromPoint(s.x, s.y); if (!e || e.id !== 'c') continue;
        const h = FB.cast(s.x, s.y); if (h && it.infos.includes(h.object.userData.info)) return s; } } return null; };
  if (mode === 'trace') {                                  // Trace it: each step tapped in order; on step 3 a LATER step is tapped twice → reveal → carry on
    let guard = 0, missed = false; const tr = G.tr; if (!tr) return 'this deck has no pathway';
    while (document.body.dataset.state === 'play' && G.tr === tr && guard++ < 40) { const c = G.cur; if (!c) break; if (c.answered) { G.traceStep(); continue; }
      aim(c.it);
      if (!missed && tr.i === 2) { const later = ITEM[tr.T.steps[tr.i + 2].it], w = findPt(later); missed = true;
        if (w) { G.onTap(w.x, w.y); G.onTap(w.x, w.y); log.push(c.it.id + ': tapped ' + later.id + ' twice → revealed=' + c.revealed); G.act('skip'); continue; } log.push('decoy ' + later.id + ' not reachable from here'); }
      const pt = findPt(c.it); if (!pt) { log.push(c.it.id + ':NO-REACHABLE-POINT'); G.act('show'); G.act('skip'); continue; }
      G.onTap(pt.x, pt.y); log.push((tr.i + 1) + ' ' + c.it.id + ':' + (c.answered ? 'ok' : 'MISS')); }
    return { state:document.body.dataset.state, log, right:tr.right, total:tr.T.steps.length, logged:tr.log.length, pins:FB.pins.list.length, chain:[...document.querySelectorAll('#results .chain li b')].map(b => b.textContent) };
  }
  if (mode === 'name') {                                   // Name it: answer right except the 2nd question
    let n = 0; while (document.body.dataset.state === 'play' && n++ < 30) { const c = G.cur; if (!c || c.answered) { G.next(); continue; }
      const btns = [...document.querySelectorAll('#dock .opt')], right = btns.find(b => ITEM[b.dataset.id] === c.it), wrong = btns.find(b => ITEM[b.dataset.id] !== c.it);
      const pick = n === 2 ? wrong : right; G.choose(pick); log.push(c.it.id + (c.first ? '' : '(again)') + ':' + (pick === right ? 'ok' : 'wrong-on-purpose')); }
  } else {
    let guard = 0, missed = false; const decoy = Object.values(ITEM).find(i => i.deck === deck && i.ok && !i.on && !i.deep);
    while (document.body.dataset.state === 'play' && guard++ < 40) { const c = G.cur; if (!c || c.answered) { G.next(); continue; }
      aim(c.it);
      if (!missed && c.it !== decoy && ![...c.it.bases || []].some(b => decoy.bases.has(b))) { aim(decoy); const w = findPt(decoy);
        if (w) { G.onTap(w.x, w.y); G.onTap(w.x, w.y); log.push(c.it.id + ': two wrong taps → revealed=' + c.revealed); missed = true; G.act('skip'); continue; } aim(c.it); }
      const pt = findPt(c.it); if (!pt) { log.push(c.it.id + ':NO-REACHABLE-POINT'); G.act('show'); G.act('skip'); continue; }
      G.onTap(pt.x, pt.y); log.push(c.it.id + (c.first ? '' : '(again)') + ':' + (c.answered ? 'ok' : 'MISS')); }
  }
  const R = G.round; return { state:document.body.dataset.state, log, right:R && R.right, total:R && R.total, logged:R && R.log.length, score:R && R.score };
};
