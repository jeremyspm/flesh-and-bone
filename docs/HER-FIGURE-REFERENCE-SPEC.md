# Spec — "Her figure" beside every built figure

Written 21 Sep 2026, not built. His idea: the small in-depth views (airway walls, tissues, layers) will never look
like the diagram she actually shows, so put HER diagram one tap away from ours, as a reference to both.

## 1. What the student gets

- On any built figure, and on any real-mesh view she has a label figure for, a chip: **Her figure**.
- Tap → a bottom sheet (phone) / right-hand panel (wide screens) with her image, pinch-zoom, and three lines under it:
  where it is from ("Module 1 quiz · Blood vessel walls"), one sentence on how hers differs from ours
  ("hers is a microscope photo: artery = thick round wall, vein = thin and collapsed"), and a link
  **Answer her question on it →** into the Paper Sim.
- Header on the sheet, always: `HER FIGURE · from her quiz, not ours`. Ours keeps `schematic · not to scale`.

## 2. The rule that stops it leaking answers

Most of her figures are LABELLED. So:
- **Explore:** chip always available.
- **Find it / Name it / Trace it:** chip hidden while a question is unanswered; it appears on the answer card
  ("see it on her figure"). A figure marked `labelled:false` (letters or numbers only, e.g. her A-G heart wall,
  her A-H lung volumes) MAY show during the question — off by default, one flag.

## 3. Where the images live (the part to decide with him)

Her figures are third-party images (medizzy, OpenStax, Wikipedia, textbook scans). The trainer is a PUBLIC repo;
the Paper Sims are `noindex` study-group pages that already host them:
`https://jeremyspm.github.io/hs2-paper-m1/img/…`, `…/hs2-test2/img/…`, and `…/hs2-test3/img/…` once Module 3 is built.
- **A (recommended): hot-link.** The trainer stores URLs only and loads the image from the sim on tap
  (same origin, plain `<img>`, no CORS). No image enters the public repo.
- **B (fallback): link out only.** The chip opens the sim at that question; the trainer never displays the image.
- Never copy her images into `flesh-and-bone`. Never redraw them.
Module 3 figures are not hosted anywhere yet → this feature ships for M1/M2 first and picks up M3 when `hs2-test3` exists
(her SLIDE figures — ovulation, uterus-wall arteries — come from the revision pptx; host them through the sim's slide layer).

## 4. Data — one map, nothing else changes

`data-more.js`: `export const FIGREF = { <region or item id>: [ { src, from, differs, sim, labelled } ] }`.
Keyed by REGION for built figures (`rpOvary`, `awTrachea`, `wlHeart`, `spiro`, `pnCord`, `eye` …), by item id only when
one item has its own figure. No change to `REG`, `ITEM`, `cast`, captions, `focusFigure`, or scoring.
Seed list (already matched this session; the README table "Figures checked against HER drawings" is the source):

| ours | hers |
|---|---|
| synovial joint | hs2-test2 `HS2IMG-8818604.png` |
| compact bone · muscle levels | hs2-test2 `HS2IMG-8820770.png` · `HS2IMG-8820771.png` |
| heart wall · vessel walls | hs2-paper-m1 `HS2IMG-b001f5f56a6c4221.png` · `HS2IMG-f3b230e2b4ffb2ea.jpg` |
| heart cut open · conduction | hs2-paper-m1 `HS2IMG-af9241e369a824f0.png` · `HS2IMG-01d343b6dfbb8ce4.jpg` |
| lung volumes | hs2-paper-m1 `HS2IMG-c85b6ba9f489a86e.png` |
| trachea wall | hs2-paper-m1 `HS2IMG-07448c35c77d9686.png` (a dissection photo) · `HS2IMG-6506af99ba45febf.png` (section) |
| spinal cord + meninges · cord label · nerve | hs2-test2 `HS2IMG-EXT-15f41cb601de.jpg` · `HS2DATA-979fe9b65a13352c.png` · `HS2DATA-2de7f5a6fd8badb2.png` |
| skeleton · muscles · glands · Willis · brain areas | hs2-test2 `HS2IMG-8819819.png` · `HS2IMG-4720419.png` · `HS2IMG-EXT-520535e61b34.jpg` · `HS2DATA-bc2946b06d8be8aa.jpg` · `HS2IMG-8819609.png` |
| Module 3 (after hs2-test3): ovary · eye ×2 · cochlea ×2 · tubule · female · male · sperm | bank hashes `e3645ba4…` · `9d23a8f4…` `870f1dc6…` · `5af5aaa0…` `efb1926a…` · `d37cc11e…` · `1c930989…` · `73c63731…` · `d84b6f38…` |

A built figure she has NO picture of (retina layers, adrenal, long bone, bronchiole, alveolus?) gets `none:'she has not shown a figure for this'`
and the chip says so instead of vanishing — check each against the M1 bank first.

## 5. UI, kept out of the way

- Chip sits in the existing info card's tag row (Explore) and on the answer card (modes). No new permanent chrome.
- Sheet: one `<dialog>`-style element, `max-height: 70dvh`, image `object-fit: contain`, `loading="lazy"`, fetched only on tap.
  Two images for one figure → swipe / dots. Fails soft: "Her figure would not load — open the Paper Sim".
- Wide screens (≥ 900 px): optional pinned side panel so both are visible at once. Phone: sheet only.
- 375 px: no horizontal scroll, sheet closes by swipe-down, Esc and backdrop; focus returns to the chip.

## 6. Gates

`tools/check-figrefs.mjs` (run before every push): every `src` exists in the sibling sim's `img/` on disk AND answers 200 live;
every built-figure region has a ref or an explicit `none`; every `sim` link resolves; no `src` points inside this repo.

## 7. Order of work (about one short session)

1. Ask him A or B (§3). 2. `FIGREF` + the gate, M1/M2 only. 3. Chip + sheet, Explore first, then the answer card.
4. Drive at 375 × 812: chip never present on an unanswered question; sheet opens, zooms, closes; no console errors.
5. README section + help-page paragraph ("ours teaches where it is; hers is what the test shows"). 6. M3 refs when `hs2-test3` is live.

Out of scope on purpose: tapping hotspots ON her image (that is the Paper Sim's job), and any redraw of her figures.
