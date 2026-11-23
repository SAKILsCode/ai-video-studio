# GLOBAL_CHANNEL Component Library: Master Plan (HyperFrames, 16:9 + 9:16)

Goal: an atomic, token-driven, deterministic HTML/CSS/JS component library that Gemini Flash can assemble into scenes by reading only `flash-contract.md`, `component-catalog.md`, `scene-XX.layout.json` and `audio/timestamps.json`.
Aesthetic: clean editorial and technical (Claude Code video feel). Warm paper and deep emerald dual polarity, gold focal accents, terminal and code surfaces, crisp type, calm motion.
This plan is design only. No implementation code is written here.

---

## 1. Audit of Uploaded Files

### KEEP
| File | Keep |
|---|---|
| `DESIGN_BIBLE.md` | Dual polarity, gold/coral accent rules, bilingual font stack, iris wipe on polarity switches, production split. |
| `flash-contract.md` | Read-only core files, paused master timeline, zero `Math.random()`/`requestAnimationFrame`, preset-only motion, caption safe zone, exit-before-enter. |
| `tokens.css` | All existing variable names (treated as a frozen public API), 8px spacing scale, safe-zone tokens, radii, shadows, ink hierarchy. |
| `motion-presets.js` | Existing preset names and positional signatures (backward compatible), `window.CCMotion` global, finite-repeat waveform. |
| `scene-01.html` | Folder convention (`templates/` linking `../tokens.css`, `../components.css`, `../motion-presets.js`), `lang="bn"`, `.cc-stage--bn`. |

### FIX
| Area | Problem | Fix (batch) |
|---|---|---|
| `components.css` | Not visible in the upload; a single file cannot scale to this taxonomy. | B1: move content verbatim to `components/legacy.css`; `components.css` becomes an `@import` manifest only. |
| `tokens.css` | No 16:9 tokens beyond safe zones. No type scale, z-index scale, motion tokens, code/terminal/syntax colors, chart palette or status colors. | B1: additive tokens only. Never rename or remove. |
| Aspect handling | Everything is hard-coded 1080x1920. | B1: stage classes set `--stage-w/h` and one unified `--safe-*` set. Components size from tokens and slots, never fixed px. |
| Fonts/GSAP | Google Fonts `@import` and CDN GSAP are render-time network dependencies. | B1: flag. If the render machine is offline, vendor woff2 into `fonts/` and GSAP into `vendor/` (user decides). |
| `motion-presets.js` | (a) `sweepBridge` scales from the centre (needs left origin). (b) `irisTransition` uses `tl.call(onPeak)`, which is not seek-safe for scrubbing/frame-seeking renders. (c) Iris end scale 1.15 may not cover a 16:9 diagonal. (d) No exit presets, although the contract demands clean exits. (e) `revealWords` is uniform stagger, not timestamp-driven. (f) Distances are fixed px. | B1: fix and extend (see Section 4). Old signatures keep working. |
| `scene-01.html` | Only `cc-stage/lattice/sparkle-dust/vignette` are used; every element is a hand-styled inline `div`. No GSAP script, no master timeline, so `data-anim`/`data-delay` do nothing. Delays are hard-coded, not tied to timestamps. Hex colors are duplicated from tokens. The pill is off-centre (`left:184 + w:460` centres at 414, not 540). The bridge (`56..1024`) breaks the 64px side safe zones. Card `\n` collapses in HTML (needs `<br>` or `white-space: pre-line`). No `.cc-caption-stage`/`.cc-word`. | Rebuilt from the B6 template using components, slots and presets. |
| `scene-01.layout.json` | A pixel-coordinate export. `anim` names (`fadeUp`, `popCard`, `sweepX`) are not CCMotion presets. No `component`, no slots, no aspect, no word-to-timestamp binding, no exit timing. Copies token values (drift risk). Single `darkMode` boolean. Uploaded name uses `_layout` while the convention is `.layout`. | Layout JSON v2 (Section 5). |
| `flash-contract.md` | Lists 8 presets and no component catalog. Does not mention 16:9 slots, layout v2 or exits. `audio/timestamps.json` schema is undefined. | B6: contract v2, still under about 70 lines. |
| `DESIGN_BIBLE.md` | No technical-surface rules and no 16:9 pacing. | B6: short appendix (terminal always dark, code syntax palette, 16:9 pacing). |

### Open assumptions (confirm before B6)
1. `audio/timestamps.json` is assumed to be `{ "words": [ { "w": "...", "start": 0.00, "end": 0.00 } ] }`. If yours differs, paste a sample and B6 will adapt.
2. Rendering has internet access for Google Fonts/GSAP CDN. If not, add the vendoring step to B1.

---

## 2. Target File Structure

    ch01-basic-claude-copy/
      tokens.css                  (additive edits only)
      components.css              (manifest: @import list only)
      components/
        legacy.css                (old components.css, untouched)
        foundations.css
        typography.css
        tech-ui.css
        diagrams.css
        data.css
        media.css
      motion-presets.js           (core: existing + fixes + exits + camera + text)
      motion-presets.text.js      (typography/hook motion)
      motion-presets.tech.js      (terminal/code/chat/keycap motion)
      motion-presets.diagrams.js  (node/edge/flow/split/checklist motion)
      motion-presets.data.js      (charts/KPI/table motion)
      motion-presets.media.js     (b-roll/transition/outro motion)
      component-catalog.md        (Flash-facing index, one line per component)
      flash-contract.md           (v2)
      DESIGN_BIBLE.md             (appendix)
      HANDOFF_LOG.claude.md
      LIBRARY_PLAN.claude.md
      preview-kit.html
      templates/
        scene-template.html
        scene-template.layout.json
        scene-01.html  scene-01.layout.json
      audio/timestamps.json

Rules: each extension JS file only adds to `window.CCMotion` and never replaces core entries. Every category CSS file is pure token consumer (no raw hex, no hard-coded px sizes except borders and hairlines).

---

## 3. Component Taxonomy

Naming: block `cc-name`, element `cc-name__part`, modifier `cc-name--variant`. Every component has `data-cc="name"`. Components are atomic; compositions are made in the scene using slots, never by new CSS.
Aspect: every component must work in both aspects via `.cc-stage--16x9` (default is 9:16). "Both" means no per-aspect markup, only token-driven sizing.

### 3.1 Foundations (`components/foundations.css`)
| Component | Variants / parts | Notes |
|---|---|---|
| `cc-stage` | `--bn`, `--en`, `--16x9`, `--dark` | Sets `--stage-w/h`, active `--safe-*`, polarity surface. Existing, extended. |
| `cc-cam` | | Camera wrapper for drift/push. Everything animated lives inside. |
| `cc-safe` | | Inset box equal to the safe area. Default parent of slots. |
| `cc-grid` | `--cols-2/3/4`, `--rows-2/3` | Token gap, auto-fit tiles. |
| `cc-slot` | `data-slot`: `top, hero, left, right, center, lower, caption, full` | Named regions; per-aspect geometry resolved in CSS. The main replacement for x/y/w/h. |
| `cc-stack` | `--v`, `--h`, `--gap-1..5` | Flow layout using the 8px scale. |
| `cc-surface` | `--paper`, `--emerald`, `--term`, `--glass` | Backgrounds only. |
| `cc-card` | `--white`, `--dark`, `--glass`, `--outlined` | Existing look (10px white border) becomes `--framed`. |
| `cc-pill` | `--emerald`, `--gold`, `--coral`, `--mono` | Context and urgency pills. |
| `cc-divider`, `cc-badge` | `--gold`, `--coral` | Hairlines, small labels. |
| `cc-lattice`, `cc-vignette`, `cc-sparkle-dust` | | Existing, kept. |

### 3.2 Typography and Hooks (`components/typography.css`)
| Component | Variants / parts | Notes |
|---|---|---|
| `cc-title` | `--hero`, `--section`, `--statement` | Auto-scales via type tokens per aspect. |
| `cc-eyebrow`, `cc-kicker`, `cc-subtitle` | | Small label above, deck below. |
| `cc-hook` | `__line`, `__accent` | Cold-open statement (big claim plus one gold phrase). |
| `cc-caption-stage` / `cc-caption` | `__line` | Caption zone locked above bottom safe area. |
| `cc-word` | `--gold`, `--emerald`, `--dim` | One per spoken word; the target of timestamp reveal. |
| `cc-highlight` | `--marker`, `--underline` | Draw-on emphasis behind or under a word. |
| `cc-lower-third` | `__name`, `__role`, `__bar` | Speaker/source identity. |
| `cc-quote` | `__text`, `__cite`, `__mark` | Pull quote / testimonial. |
| `cc-bullets` | `__item` | 3-5 items max, staggerable. |
| `cc-avatar`, `cc-waveform` | `__inner`, `__bar` | Existing persistent speaker, kept. |
| `cc-chapter-label` | | "Part 2 of 5" style progress tag. |

### 3.3 Technical and Product UI (`components/tech-ui.css`)
| Component | Variants / parts | Notes |
|---|---|---|
| `cc-term` | `__bar`, `__body`, `__line`, `__prompt`, `__cursor`, `--ok`, `--err`, `--dim` | Terminal/CLI window. Always dark regardless of stage polarity. |
| `cc-code` | `__tabs`, `__gutter`, `__line`, `--hl`, `.cc-tok--kw/str/num/fn/cm/var` | Code editor with syntax tokens. |
| `cc-diff` | `__line--add`, `--del`, `--ctx`, `__hunk` | Unified diff block. |
| `cc-browser` | `__chrome`, `__url`, `__viewport` | Browser frame around screenshot/B-roll. |
| `cc-device` | `--phone`, `--laptop`, `--window` | Generic app/device frames. |
| `cc-chat` | `__bubble--user`, `--ai`, `__typing`, `__toolcall` | Chat thread and tool-call chips. |
| `cc-keycap` | `--wide`, `--mod`, `--accent`; `cc-keycombo` | Single key and combos (e.g. Cmd+K). |
| `cc-cmd` | | Inline `/command` or `file.ext` chip. |
| `cc-filetree` | `__row`, `--open`, `--changed` | Project tree. |
| `cc-status` | `__spinner`, `__meter` | "Thinking..." line, token/progress meter (steps, no random). |
| `cc-toast` | `--ok`, `--warn`, `--err` | Notification/permission prompt. |

### 3.4 Diagrams and Workflows (`components/diagrams.css`)
| Component | Variants / parts | Notes |
|---|---|---|
| `cc-node` | `--primary`, `--muted`, `--accent`, `--ghost`; `__icon`, `__label`, `__sub` | Architecture box/service. |
| `cc-edge` | `--solid`, `--dashed`, `--arrow`; SVG `data-draw` | Connector paths, drawable. |
| `cc-flow` | `--h`, `--v`, `--wrap` | Container for node/step sequences. |
| `cc-step` | `__num`, `__title`, `__body`, `--active`, `--done` | Numbered workflow step. |
| `cc-timeline` | `__rail`, `__dot`, `__item` | Roadmap/history. |
| `cc-split` | `--before-after`, `--versus`, `--wipe`; `__a`, `__b`, `__divider` | Before/after and comparison. |
| `cc-checklist` | `__item--todo/--done/--fail`, `__tick` | Animated tick states. |
| `cc-matrix` | `--2x2`; `__axis`, `__cell` | Quadrant frameworks. |
| `cc-cycle`, `cc-layers` | | Loop diagram and stacked-layer architecture. |
| `cc-callout` | `--arrow`, `--circle`, `--box` | Annotations over any component. |
| `cc-bridge` | | Existing gold ribbon, kept. |
| `cc-tiles` | `__tile`, `--milestone` | Existing tile grid, kept. |

### 3.5 Data and Evidence (`components/data.css`)
| Component | Variants / parts | Notes |
|---|---|---|
| `cc-kpi` | `__value`, `__label`, `__delta--up/--down`, `__spark` | Big-number stat. |
| `cc-counter` | `--mono`, `--currency` | Roll-up number (value set by deterministic tween). |
| `cc-chart-bar` | `--h`, `--v`, `__bar`, `__label`, `__value` | Bar chart from CSS vars `--v`. |
| `cc-chart-line` | `__path`, `__point`, `__area` | SVG line/area, `data-draw`. |
| `cc-chart-donut` | `__seg`, `__center` | SVG donut and ring progress. |
| `cc-progress` | `--bar`, `--ring`, `--steps` | Completion indicators. |
| `cc-sparkline` | | Inline tiny trend. |
| `cc-table` | `__row`, `__cell`, `--compare`, `__col--hl` | Rows and comparison with a highlighted column. |
| `cc-price` | `__old`, `__strike`, `__new`, `__unit` | Pricing/strike (pairs with `strikePrice`). |
| `cc-rank` | `__row`, `__bar`, `__pos` | Leaderboard. |
| `cc-legend` | | Chart key. |
| `cc-citation` | `__source`, `__year`, `__link` | Source chip and footnote. |
| `cc-evidence` | `__shot`, `__cite` | Screenshot or excerpt plus citation. |

### 3.6 Media and Transitions (`components/media.css`)
| Component | Variants / parts | Notes |
|---|---|---|
| `cc-plate-media` | `--cover`, `--contain` | B-roll/Veo plate; existing, kept. |
| `cc-speaker-cutout` | | Existing, kept. |
| `cc-frame` | `--polaroid`, `--film`, `--rounded`, `--pip` | Media framing. |
| `cc-pip` | `--tl/--tr/--bl/--br` | Picture-in-picture. |
| `cc-broll-caption` | | Source/credit line over B-roll. |
| `cc-iris` | | Gold-rimmed iris; sized to cover the diagonal for the active aspect. |
| `cc-wipe` | `--l/--r/--u/--d` | Directional wipe panel. |
| `cc-cover` | | Solid slide-cover transition panel. |
| `cc-flash` | | White/gold flash frame. |
| `cc-chapter-card` | | Act title card between sections. |
| `cc-outro` | `__title`, `__sub` | End card layout. |
| `cc-cta` | `__button`, `__url`, `__handle`, `__qr` | Call to action; QR is a media slot only. |
| `cc-logo-lockup` | | Brand mark and name. |
| `cc-countdown` | `--urgent` | Urgency timer (stepped, deterministic). |

---

## 4. Motion Primitives (`motion-presets*.js`)

Conventions:
- Signature for new presets is `CCMotion.name(tl, target, at, opts)` and returns `tl`. Existing presets keep positional args.
- Must be seek-safe (scrubbing backwards gives identical frames). Use tweens, `className` tweens and `tl.set`, never `tl.call` for visual state.
- Exits use `to(..., { immediateRender: false })` so they never overwrite earlier entrances.
- No randomness, no rAF, no infinite repeats. Distances come from `opts.dist` and default to aspect-aware values.

### Core (`motion-presets.js`)
| Group | Presets |
|---|---|
| Existing (keep) | `enterCard`, `sweepBridge` (fix: left origin), `cascadeTiles`, `irisTransition` (fix: coverage and seek-safe onPeak), `staggerRows`, `strikePrice`, `revealWords`, `cameraDrift`, `pulseWaveform` |
| Entrances (new) | `fadeUp`, `slideIn(dir)`, `popIn`, `maskReveal`, `scaleIn` |
| Exits (new) | `exitFade`, `exitDown`, `exitCard`, `exitStagger`, `clearBeat(els)` (exit everything in a beat in one call) |
| Camera (new) | `cameraPush`, `panTo`, `focusZoom` |
| Polarity (new) | `polarityFlip(tl, stageEl, at, toDark)` via `className` tween (replaces `onPeak`) |
| Text (core) | `revealWordsAt(tl, wordEls, timesArray, opts)` bound to timestamps, `highlightWord`, `underlineDraw` |

### Extension files
| File | Presets |
|---|---|
| `.text.js` | `hookSlam`, `quoteReveal`, `lowerThirdIn/Out`, `bulletsStagger`, `captionPhrase` (exit old phrase, reveal next) |
| `.tech.js` | `typeCommand` (clip/steps, deterministic), `appendLines`, `cursorBlink` (finite steps), `diffHighlight`, `keycapPress`, `bubbleIn`, `typingDots`, `toolCallPop`, `statusTick`, `windowEnter` |
| `.diagrams.js` | `drawPath` (stroke-dashoffset), `nodeEnter`, `nodePulse`, `connectFlow` (node, edge, node), `stepAdvance`, `splitWipe` (before/after reveal), `checkTick`, `calloutIn`, `layersStack`, `cycleSpin` (finite) |
| `.data.js` | `counterRoll` (tween to `onUpdate` textContent, deterministic), `barGrow`, `lineDraw`, `donutSweep`, `progressFill`, `kpiPop`, `tableRowsIn`, `highlightColumn`, `rankSort` (position tween), `citationIn` |
| `.media.js` | `kenBurns`, `frameIn`, `pipIn`, `wipeTransition`, `slideCover`, `flashCut`, `chapterCardIn/Out`, `outroSequence`, `ctaPulse` (finite), `countdownStep` |

---

## 5. Flash-Safe Naming and Layout JSON Rules

### Naming
1. Class names follow `cc-block__part--modifier`, lowercase, hyphenated. Never invent a `cc-*` class that is not in `component-catalog.md`.
2. Element ids are `<component>_<nn>` in snake/lowercase (`card_01`, `term_01`, `kpi_02`). Unique per scene.
3. Hooks are data attributes: `data-cc` (component), `data-slot` (region), `data-in` / `data-out` (preset names), `data-at` (seconds), `data-word` (timestamp index).
4. Scene files: `templates/scene-XX.html` and `templates/scene-XX.layout.json` (dot, not underscore).
5. Colors, fonts, sizes, shadows come only from tokens or component classes. No hex, no `font-family`, no inline `style` except CSS custom properties (e.g. `style="--v:72"` for chart values).
6. Every `<html>` links, in order: `tokens.css`, `components.css`, GSAP, `motion-presets.js`, then only the extension files it uses.
7. Timeline is `gsap.timeline({ paused: true })`; it is the only timeline and is exposed as `window.__tl` for the renderer.

### Layout JSON v2 (field rules, no code)
- Top level: `channelId`, `sceneName`, `aspect` (`"9x16"` or `"16x9"`), `lang` (`bn`/`en`), `audioRef`, `beats[]`.
- Beat: `id`, `start`, `end`, `polarity` (`light`/`dark`), `transitionIn` (preset name or null), `elements[]`.
- Element: `id`, `component`, `variant[]`, `slot`, `props` (text, number, src placeholder), `words[]` (timestamp indices for caption/hook text), `in {preset, at, opts}`, `out {preset, at, opts}`.
- No `x/y/w/h` unless `slot` is `"free"`; then use grid units (`col`, `row`, `span`) only, never raw pixels.
- No `tokens` block, no colors, no fonts. Polarity and variants cover all styling needs.
- Presets must exist in `CCMotion`; `at` values come from `timestamps.json`, not hand-guessed delays.
- Limits for Flash: at most 4 beats per scene, at most 12 elements per beat, at most 1 iris per Short, and every element in beat N has an `out` before beat N+1 starts.
- Text elements keep line breaks as `\n` in JSON; the component renders them with `white-space: pre-line`.

---

## 6. Execution Batches

Session protocol (every batch):
1. Paste only: this batch's section, `HANDOFF_LOG.claude.md`, and `tokens.css`. Do not paste earlier category files; use the log instead.
2. Output only the files listed; do not regenerate files from earlier batches except the listed edits.
3. Size cap: about 350 lines CSS and about 250 lines JS per batch, with no explanatory prose beyond a brief summary.
4. End by outputting (a) a `### Batch N` block for HANDOFF_LOG under `## Completed Interfaces` (files, classes, variants, data attributes, slots, preset signatures) and (b) the new lines for `component-catalog.md`. Then tick the checklist.

### Batch 1: Tokens, Foundations, Core Motion
Files:
- `tokens.css` (additive: type scale per aspect, motion duration/ease tokens, z-index scale, unified `--safe-*`, terminal/syntax/chart/status colors)
- `components.css` (manifest of `@import`s)
- `components/legacy.css` (current `components.css`, verbatim)
- `components/foundations.css`
- `motion-presets.js` (fixes plus entrances, exits, camera, polarityFlip, revealWordsAt, highlightWord, underlineDraw)
- `component-catalog.md` (created; foundations section)

Done when: 9:16 and 16:9 stages render with correct safe zones, all slot names resolve, old presets behave as before, `sweepBridge` grows from the left, iris covers both aspects.
Keep light: no typography or tech components yet.

### Batch 2: Typography and Hooks
Files: `components/typography.css`, `motion-presets.text.js`, `component-catalog.md` (append).
Covers: titles, eyebrow/kicker, hook, captions and words, highlight, lower third, quote, bullets, chapter label, plus bilingual line-height rules.
Done when: Bangla and English caption lines clear matras, one phrase is exited before the next is revealed, and all text is token-sized in both aspects.

### Batch 3: Technical and Product UI
Files: `components/tech-ui.css`, `motion-presets.tech.js`, `component-catalog.md` (append).
Covers: term, code (plus syntax tokens), diff, browser, device, chat, keycap, cmd chip, filetree, status, toast.
Done when: terminal and code stay dark on light stages, typing and cursor motion are step-based with finite repeats, and chat/keycap work at both aspects.

### Batch 4: Diagrams and Workflows
Files: `components/diagrams.css`, `motion-presets.diagrams.js`, `component-catalog.md` (append).
Covers: node, edge, flow, step, timeline, split, checklist, matrix, cycle, layers, callout (bridge/tiles preserved).
Done when: flows reflow horizontal in 16:9 and vertical in 9:16 without markup changes; `drawPath` works on any SVG path with `data-draw`.

### Batch 5: Data and Evidence
Files: `components/data.css`, `motion-presets.data.js`, `component-catalog.md` (append).
Covers: kpi, counter, bar/line/donut charts, progress, sparkline, table, price, rank, legend, citation, evidence.
Done when: charts are driven by CSS vars and SVG attributes only (no chart library), `counterRoll` gives identical output on any seek, and the series palette is colorblind-distinct.

### Batch 6: Media, Transitions, Outro, Contract v2, Templates
Files:
- `components/media.css`
- `motion-presets.media.js`
- `component-catalog.md` (append; then verify it is complete and single-line-per-component)
- `flash-contract.md` (v2, about 70 lines max, references catalog and layout v2)
- `DESIGN_BIBLE.md` (short technical-surface and 16:9 pacing appendix)
- `templates/scene-template.html`
- `templates/scene-template.layout.json`

Done when: the template renders in both aspects, the contract fits in one read, and `timestamps.json` schema is pinned (confirm assumption from Section 1).

### Batch 7 (FINAL): Preview Kit
Files: `preview-kit.html` (update only).
Covers: gallery of every component by category with a 9:16 / 16:9 toggle, Light/Dark toggle, per-component "play" buttons driving a paused timeline scrubber, safe-zone overlay, and a live list of each preset. Read the finished `component-catalog.md` and `HANDOFF_LOG.claude.md` only.
Done when: every catalog entry appears and animates, and no console errors or missing classes appear.

---

## 7. Definition of Done
- All catalog components render in both aspects with zero hard-coded colors or sizes.
- Every preset is deterministic and seek-safe.
- Flash can build a scene from `flash-contract.md`, `component-catalog.md`, layout v2 and `timestamps.json` alone.
- `scene-01` can be rebuilt from the template using only library components.