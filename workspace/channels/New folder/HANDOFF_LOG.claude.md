# Component Library Handoff Log

Tracks exact interfaces (file paths, CSS classes, data attributes, motion presets) created in each batch so new Claude sessions stay in sync without reading full source files. See `LIBRARY_PLAN.claude.md` for batch scope.

## Batch Checklist
- [x] Batch 1: Tokens, Foundations, Core Motion (`tokens.css`, `components.css`, `components/legacy.css`, `components/foundations.css`, `motion-presets.js`, `component-catalog.md`)
- [x] Batch 2: Typography and Hooks (`components/typography.css`, `motion-presets.text.js`)
- [x] Batch 3: Technical and Product UI (`components/tech-ui.css`, `motion-presets.tech.js`)
- [x] Batch 4: Diagrams and Workflows (`components/diagrams.css`, `motion-presets.diagrams.js`)
- [x] Batch 5: Data and Evidence (`components/data.css`, `motion-presets.data.js`)
- [x] Batch 6: Media, Transitions, Outro, Contract v2, Templates (`components/media.css`, `motion-presets.media.js`, `flash-contract.md`, `DESIGN_BIBLE.md`, `templates/scene-template.*`)
- [x] Batch 7 (FINAL): Preview Kit (`preview-kit.html`)

## Completed Interfaces
<!-- Append one "### Batch N" block per finished batch: files created/edited, classes and variants, data attributes, slots, preset signatures. -->

### Batch 1
Files: `tokens.css` (additive, sections 8-15), `motion-presets.js` (fixes + new presets), `components.css` (manifest: legacy.css then foundations.css), `components/legacy.css` (old components.css, verbatim), `components/foundations.css` (new), `component-catalog.md` (created, Foundations + core motion + examples).
Import order: tokens.css, components.css, GSAP, motion-presets.js, then extension files. foundations.css loads after legacy.css and overrides `.cc-stage`, `.cc-card`, `.cc-pill`.
Stage vars (set on `.cc-stage`, polarity-aware): `--ink` `--ink-secondary` `--ink-muted` `--rule` `--accent` `--font-display` `--font-body` `--lh` `--lh-display` `--safe-w` `--safe-h`. Components must use these, never raw ink tokens. `.cc-card--white/--dark` reset the ink vars locally; `--glass/--outlined` inherit them.
Classes: `cc-stage--en` `--bn` `--16x9` `--dark` `--guides`; `cc-cam`; `cc-safe`; `cc-slot` (`--stretch` `--start`); `cc-stack` (`--v` `--h` `--wrap` `--between` `--center` `--gap-1..5`); `cc-grid` (`--cols-2/3/4` `--rows-2/3` `--gap-1..5`); `cc-surface` (`--paper` `--emerald` `--term` `--glass`); `cc-card` (`--white` `--dark` `--glass` `--outlined` `--framed`); `cc-pill` (`--emerald` `--gold` `--coral` `--mono`); `cc-badge` (`--gold` `--coral`); `cc-divider` (`--gold` `--coral`).
Slots (`data-slot`): top hero center left right lower caption full free. 9:16 left/right stack vertically; 16:9 they sit side by side. Slot geometry vars: `--sx --sw --sy --sh` (fractions of safe box). `free` children: `--col --row --span --rspan`.
Data attributes: `data-cc` (component name), `data-slot`; reserved for layout/runtime: `data-in` `data-out` `data-at` `data-word`.
Rules: slots are children of stage or cam, never nested; caption/avatar/chrome live outside `.cc-cam`; `color-mix()` requires Chromium 111+.
Presets (core, `CCMotion.name(tl,target,at,opts)`): fadeUp slideIn popIn maskReveal scaleIn | exitFade exitDown exitCard exitStagger clearBeat | cameraPush panTo focusZoom | polarityFlip(tl,stage,at,toDark) | revealWordsAt(tl,els,times,{lead,dur,byAttr}) highlightWord underlineDraw. Fixed legacy: sweepBridge (left origin), irisTransition (covers both aspects; onPeak accepts `{stage,toDark}` seek-safe). Helpers: `CCMotion.util` (list, stage, is16x9, k, dist, cssVar, stageClass, irisScale).
Tokens added: type scale `--fs-*` `--lh-*`, motion `--dur-*` `--ease-*`, z-index `--z-*`, `--stage-w/h` + unified `--safe-*`, terminal/code/syntax/diff colors, status colors, chart palette `--chart-1..6`.

### Batch 2
Files: `components/typography.css` (new), `motion-presets.text.js` (new, load after `motion-presets.js`), `components.css` (added `@import 'components/typography.css'` last), `component-catalog.md` (appended). `tokens.css`, `flash-contract.md`, `motion-presets.js` untouched.
New stage vars (typography.css): `--hl` (gold focal) `--hl-2` (emerald focal) `--cap-lh` `--cap-lines` `--tracking-display` `--tracking-label` `--case-label` `--font-label` `--glyph-pad` (bn matra padding) `--measure`; `.cc-card--white/--dark` re-resolve `--hl --hl-2 --accent`.
Classes: `cc-title` (`--hero` `--statement` `--section`); `cc-eyebrow`; `cc-kicker`; `cc-subtitle`; `cc-hook` (`__line` `__accent`); `cc-caption-stage`; `cc-caption` (`__line`); `cc-word` (`--gold` `--emerald` `--dim`); `cc-highlight` (`--marker` `--underline`); `cc-lower-third` (`__bar` `__name` `__role`); `cc-quote` (`__mark` `__text` `__cite`); `cc-bullets` (`__item`); `cc-chapter-label`; `cc-card__label/__title/__text` (gap fix).
Overrides of legacy.css (token-sized, aspect-agnostic): `.cc-caption-stage`, `.cc-word`, `.cc-avatar(__inner)`, `.cc-waveform(__bar)`. Caption stage sits at `bottom: var(--safe-bottom)` in both aspects; place it directly in `.cc-stage`, outside `.cc-cam`.
Data attributes: none new. `data-word="N"` (reserved in B1) is now consumed by `captionPhrase` with `byAttr: true`.
CSS var animated by motion: `--draw` on `.cc-highlight` (0 to 1).
Presets (`motion-presets.text.js`, only added if name is free): hookSlam, quoteReveal, lowerThirdIn, lowerThirdOut, bulletsStagger, captionPhrase(tl,capEl,at,{times,byAttr,stagger,lead,dur,dist,prev,exitAt,exitDur,pop}), highlightDraw.
Rules: one `.cc-caption` per phrase; phrases overlap in place; later phrases pass `prev`. `.cc-quote__mark` stays empty (glyph via `::before`). `.cc-word--gold/--emerald` use `!important` (kept from legacy) so `highlightWord` will not recolour them; `.cc-word--dim` does not, so `highlightWord` can promote dim words.

### Batch 3
Files: `components/tech-ui.css` (new), `motion-presets.tech.js` (new, load after `motion-presets.js`), `components.css` (added `@import 'components/tech-ui.css'` last), `component-catalog.md` (appended). `tokens.css`, `flash-contract.md`, `motion-presets.js` untouched.
Classes: `cc-term` (`__bar` `__body` `__line` `--ok/--err/--dim` `__prompt` `__typed` `__cursor`); `cc-code` (`__tabs` `__body` `__line` `--hl` `__gutter`); `cc-tok--kw/str/num/fn/type/var/cm`; `cc-diff` (`__hunk` `__line--add/--del/--ctx`); `cc-browser` (`__chrome` `__url` `__viewport`); `cc-device` (`--phone` `--laptop` `--window`); `cc-chat` (`__bubble--user/--ai` `__typing` `__toolcall`); `cc-keycap` (`--wide` `--mod` `--accent`); `cc-keycombo`; `cc-cmd`; `cc-filetree` (`__row` `--open` `--changed`); `cc-status` (`__spinner` `__meter`); `cc-toast` (`--ok` `--warn` `--err`).
Extras not in the plan: `cc-term__typed`, `cc-code__body`. Filetree indent uses inline custom property `style="--depth:N"` (allowed: CSS custom property only).
Rules: term/code/diff/filetree always dark (local ink vars reset); browser/keycap/toast/ai-bubble always light surfaces; phone sizes from slot height (use inside a slot); code lines use `white-space: pre`, no wrap, no whitespace between gutter and code; typed text must be ASCII (width tween in `ch`).
Data attributes: none new.
CSS vars animated by motion: `--press` (keycap), `--flash` (diff line), `--done` (toolcall), `--v` (status meter, 0..1).
Presets (`motion-presets.tech.js`): windowEnter, typeCommand(tl,typedEl,at,{cps,dur}), appendLines(tl,lines|container,at,{stagger,dur,dist,lead,skip,times}), cursorBlink(tl,el,at,{dur,half,end}), diffHighlight(tl,diff|lines,at,{stagger,dist,peak}), keycapPress(tl,keys,at,{dur,hold,stagger}), bubbleIn, typingDots(tl,el,at,{dur,period,dist,hide}), toolCallPop(tl,el,at,{dur,dist,doneAt}), statusTick(tl,el,at,{dur,steps,from,to,turns,dist}).

### Batch 4
Files: `components/diagrams.css` (new), `motion-presets.diagrams.js` (new, load after `motion-presets.js`), `components.css` (added `@import 'components/diagrams.css'` last), `component-catalog.md` (appended). `tokens.css`, `flash-contract.md`, `motion-presets.js` untouched.
Classes: `cc-flow` (`--h` `--v` `--wrap`); `cc-node` (`--primary` `--muted` `--accent` `--ghost`, `__icon` `__label` `__sub`); `cc-edge` (`--solid` `--dashed` `--arrow` `--accent`, `__svg` `__path` `__path--dashed` `__path--accent` `__head`); `cc-step` (`--active` `--done`, `__num` `__text` `__title` `__body`); `cc-timeline` (`--h` `--v`, `__item` `__dot` `__label` `__text`); `cc-split` (`--before-after` `--versus` `--wipe` `--h` `--v`, `__a` `__b` `__divider`); `cc-checklist` (`__item` `__item--todo/--done/--fail` `__tick` `__text`); `cc-matrix` (`--2x2`, `__axis` `__axis--x/--y` `__cell` `__cell--hl`); `cc-cycle` (`__ring` `__hub` `__item`); `cc-layers` (`__layer` `__layer--primary/--accent/--ghost`); `cc-callout` (`--box` `--circle` `--arrow`, `__text`).
Data attributes: `data-draw` (opt-in marker on SVG paths for `drawPath`).
Presets (`motion-presets.diagrams.js`, only added if name is free): drawPath(tl,target,at,{dur,ease,stagger,head}), nodeEnter(tl,nodes|flow|cycle,at,{dur,stagger,dist,times}), nodePulse(tl,node,at,{count,dur,peak}), connectFlow(tl,nodeA,edge,nodeB,at,{dur,edgeDur,enterA}), flowSequence(tl,flow,at,{dur,edgeDur,times}), stepAdvance(tl,steps|container,at,{gap,times,dur,keep,finish}), splitWipe(tl,split,at,{dur,ease,from,to}), checkTick(tl,checklist|items,at,{stagger,dur,times,fail}), calloutIn(tl,callout,at,{dur,stagger}), layersStack(tl,layers,at,{dur,stagger,dist,from,times}), cycleSpin(tl,cycle,at,{turns,dur,from,ease}).

### Batch 5
Files: `components/data.css` (new), `motion-presets.data.js` (new, load after `motion-presets.js`). To do: add `@import 'components/data.css'` last in `components.css`, and append the catalog section to `component-catalog.md`. `tokens.css`, `flash-contract.md`, `motion-presets.js` untouched.
Classes: `cc-kpi` (`--white` `--dark` `--gold` `--emerald` `--coral`, `__label` `__value` `__num` `__unit` `__delta--up/--down` `__note` `__spark`); `cc-metric` (`--left` `--xl` `--emerald` `--ink`, `__value` `__num` `__unit` `__label` `__sub`); `cc-progress` (`--thick` `--gold` `--emerald` `--coral` `--glow`, `__head` `__label` `__value` `__track` `__fill`); `cc-bars` (`--col` `--series`, `__bar` `__bar--hl` `__label` `__track` `__fill` `__value`); `cc-linechart` (`--spark` `--gold` `--emerald` `--coral`, `__svg` `__grid` `__line` `__area` `__dot` `__axis` `__tick`); `cc-table` (`--compare` `--zebra` `--compact` `--white` `--dark`, `__row` `__row--head/--hl` `__cell` `__cell--num/--hl/--yes/--no`); `cc-source` (`--footer` `--gold`, `__label` `__text` `__year`).
Stage vars added: `--data-up` `--data-down` (polarity-aware). Inline custom props allowed: `--v` (0..1, bars/progress), `--c` (series colour), `--cols` (table grid).
Data attributes: `data-value` `data-from` `data-decimals` `data-prefix` `data-suffix` `data-sep` `data-digits` (auto|en|bn) on count-up elements (digits auto uses Bengali numerals in `.cc-stage--bn`); `data-cc-to` (runtime cache written by barGrow). `data-draw` is not needed for lineDraw.
CSS vars animated by motion: `--v` (fills, 0..1).
Presets (only added if name is free): countUp(tl,els,at,{to,from,decimals,prefix,suffix,sep,digits,dur,ease,stagger,times}), barGrow(tl,target,at,{dur,stagger,ease,from,to,times,values}), lineDraw(tl,chart|paths,at,{dur,ease,grid,dots,lineStagger,stagger}), dataStagger(tl,target,at,{stagger,dur,dist,from:up|down|left|right|scale,sel,times}).
Rules: SVG line chart paths use `pathLength="1"` with CSS dasharray "1 2". Bar DOM order is label, track, value (also for `--col`). Count-up uses a GSAP `textContent` modifier, so it is seek-safe. Always use tabular numerals.

### Batch 6A
Files created: `components/media.css`, `motion-presets.media.js`. Modified: `components.css` (added `@import "./components/media.css";` last), `component-catalog.md` (appended 6A section), `HANDOFF_LOG.claude.md`.
Classes: `cc-media` (`--full` `--over` `--framed` `--rim` `--pip` `--tl/--tr/--bl/--br` `--round` `--contain` `--ar-16x9/--ar-9x16/--ar-4x3/--ar-1x1`, `__el` `__scrim` `__scrim--top/--bottom/--even` `__tag` `__tag--tr/--bl/--br` `__credit`); `cc-media-split` (`--h` `--v` `--flush`); `cc-subtitles` (`--plate` `--on-media` `--top` `--lift`, `__line` `__word`).
Transitions: `cc-tx--emerald/--deep/--paper/--ink/--gold/--coral` (shared colour); `cc-wipe` (`--edge`, `__panel`); `cc-curtain` (`--edge`, `__panel--a/--b`); `cc-slash` (`--edge`, `__band`); `cc-dim` (`--vignette`).
Outro: `cc-outro` (`__brand` `__mark` `__name` `__rule` `__signoff`, use with `cc-slot` + `data-slot="full"`); `cc-cta` (`--subscribe` `--follow` `--emerald` `--white` `--ghost`, `__icon` `__text` `__label` `__handle`); `cc-next` (`--white` `--row`, `__thumb` `__play` `__dur` `__meta` `__eyebrow` `__title` `__sub`).
Data attributes: `data-kb` (in|out|left|right|up|down|drift, default for `kenBurns`); `data-dir` (wipe left|right|up|down, curtain h|v, slash left|right). `data-word` is reused by `captionPop` with `byAttr: true`.
Presets (`motion-presets.media.js`, only added if name is free): kenBurns(tl,target,at,{dir,from,to,pan,origin,dur,ease,stagger,reverse}), mediaReveal(tl,target,at,{mode:mask|fade|scale|slide,dir,dur,ease,dist,stagger,settle,outAt,outDur}), wipeTransition(tl,overlay,at,{kind,dir,dur,coverDur,revealDur,hold,ease,ease2,peak,skew,onPeak}) + static `wipeTransition.peak(at,opts)`, captionPop(tl,target,at,{mode:highlight|karaoke|build,times,byAttr,lead,stagger,dur,hold,stay,dist,exitAt,exitDur,prev}), outroAssemble(tl,outro,at,{order,gap,dur,dist,pulses,exitAt,exitDur}).

### Batch 6B
Files overwritten: `flash-contract.md` (Contract v2), `DESIGN_BIBLE.md` (v2), `HANDOFF_LOG.claude.md`. Files created: `templates/scene-template.html`, `templates/scene-template.layout.json`.
Load order (scenes one folder deep): `../tokens.css`, `../components.css`, GSAP 3.15.0 (cdnjs), `../motion-presets.js`, then only used `../motion-presets.{text,tech,diagrams,data,media}.js`.
Contract v2: no inline `<style>`/`style=""` except the template `<body>` size line and custom props `--depth --v --c --cols`; slots never nested; caption/avatar/waveform/transition overlays outside `.cc-cam`; `data-cc` on every component.
Seek-safe: one paused `gsap.timeline`, exposed as `window.__timelines["main"]`; absolute times, presets only; no random, rAF, timeouts, `onUpdate` side effects, or CSS animation; polarity changes only via `polarityFlip`/`irisTransition`.
Captions: `.cc-caption` per phrase with `.cc-word[data-word=N]`; `captionPhrase(tl,el,at,{times,byAttr:true,prev})`, `times.length` equals word count, copied from `audio/timestamps.json`.
Template: 9:16 default (16:9 = body 1920x1080 + `cc-stage--16x9`); stage `#stage`, camera `#cam`; layout JSON keeps the scene-01 schema plus `contractVersion`, `stageClasses`, `scripts`, per-element `slot`/`cc`/`variant`/`inCam`/`wordTimes`/`exitAt`.

### Batch 7
Files: `preview-kit.html` (new, root-level; loads `tokens.css`, `components.css`, GSAP 3.15.0, then `motion-presets.js` and `.text/.tech/.diagrams/.data/.media.js`). `HANDOFF_LOG.claude.md` updated.
Controls: aspect 16:9/9:16 (stage auto-scales to viewport), Light/Dark, EN/BN, Safe guides, Play/Pause, Replay, 0-100% scrubber (`tl.progress()`, seek-safety check). Toggles rebuild the scene and keep progress.
Tabs: 1 Foundations, 2 Typography, 3 Tech UI, 4 Diagrams, 5 Data, 6 Media & Outro. Each rebuilds a paused timeline exposed as `window.__timelines.main`, using guarded `CCMotion.*` calls.
Error banner: shown only for a failed stylesheet or script, a missing stage-var probe (`--chart-1`, `--ink`, `--hl`, `--data-up`), a missing `CCMotion` preset, or a thrown preset error. Viewer chrome uses its own `<style>`; scene content follows Contract v2 (the only inline style is custom props `--v` and `--cols`).