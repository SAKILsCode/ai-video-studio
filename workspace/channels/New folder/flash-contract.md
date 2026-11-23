# GLOBAL_CHANNEL Basic Claude Copy — Motion-Only Contract v2 (For 3.8 Flash / agy)

Read ONLY this file + `audio/timestamps.json`. Assemble scenes from the library. Never invent styling.

## 1. LOAD ORDER (exact, every scene HTML, scene lives one folder deep, e.g. `episodes/` or `templates/`)
```html
<link rel="stylesheet" href="../tokens.css" />
<link rel="stylesheet" href="../components.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js"></script>
<script src="../motion-presets.js"></script>
<!-- then ONLY the extensions the scene uses, in this order: -->
<script src="../motion-presets.text.js"></script>     <!-- hookSlam quoteReveal lowerThirdIn/Out bulletsStagger captionPhrase highlightDraw -->
<script src="../motion-presets.tech.js"></script>     <!-- windowEnter typeCommand appendLines cursorBlink diffHighlight keycapPress bubbleIn typingDots toolCallPop statusTick -->
<script src="../motion-presets.diagrams.js"></script> <!-- drawPath nodeEnter nodePulse connectFlow flowSequence stepAdvance splitWipe checkTick calloutIn layersStack cycleSpin -->
<script src="../motion-presets.data.js"></script>     <!-- countUp barGrow lineDraw dataStagger -->
<script src="../motion-presets.media.js"></script>    <!-- kenBurns mediaReveal wipeTransition captionPop outroAssemble -->
```
`components.css` is a manifest; never link `components/*.css` directly.

## 2. FORBIDDEN
1. Do NOT edit `tokens.css`, `components.css`, `components/*.css`, or any `motion-presets*.js`.
2. NO inline `<style>` and NO `style=""` overrides. Only allowed inline: (a) the `<body>` size line from the template, (b) these custom props: `--depth` (filetree), `--v` (bars/progress/status meter, 0..1), `--c` (series colour), `--cols` (table grid).
3. NO `Math.random()`, `requestAnimationFrame`, `setTimeout`, `setInterval`, `Date.now()`, CSS `animation`/`transition`, or `onUpdate`/`onComplete` side effects.
4. NO hand-coded humans, organic scenes, or crude SVG clipart. Speakers go in `.cc-avatar__inner` / `.cc-speaker-cutout`; B-roll/Veo plates go in `.cc-media__el` or `.cc-plate-media`.
5. NO raw ink tokens in components; use stage vars (`--ink`, `--accent`, `--hl`, etc.).
6. NO raw GSAP tweens when a `CCMotion` preset exists.

## 3. STAGE
- Root: `<div class="cc-stage cc-stage--bn|--en cc-stage--16x9?  cc-stage--dark?">`. 9:16 is default (body `1080x1920`); add `cc-stage--16x9` for 16:9 (body `1920x1080`).
- Language: `--bn` for Bangla, `--en` for English. Bilingual: pick the dominant language.
- Polarity: Light = Alabaster (explain, compare, progress). Dark = Emerald (proof, pricing, CTA). Toggle with `.cc-stage--dark` at build time, or at runtime ONLY via `CCMotion.polarityFlip(tl, stage, at, toDark)` / `irisTransition` (max 1–2 per Short). Stage vars re-resolve automatically; never hard-code colours.
- Background layers first in stage: `.cc-lattice`, `.cc-sparkle-dust`, `.cc-vignette`.

## 4. STRUCTURE (never violate)
```
.cc-stage
  .cc-lattice / .cc-sparkle-dust / .cc-vignette
  .cc-cam                      <- camera group (cameraPush/panTo/focusZoom/cameraDrift target)
    .cc-slot[data-slot=top|hero|center|left|right|lower|full|free]   <- children of cam
  .cc-avatar > .cc-avatar__inner   <- OUTSIDE .cc-cam
  .cc-waveform > .cc-waveform__bar <- OUTSIDE .cc-cam
  .cc-caption-stage > .cc-caption  <- OUTSIDE .cc-cam, direct child of stage
  .cc-wipe / .cc-curtain / .cc-slash / .cc-dim / iris overlay <- OUTSIDE .cc-cam, last in stage
```
- Slots are children of `.cc-stage` or `.cc-cam`. NEVER nest a `data-slot` inside another slot.
- Every component carries `data-cc="<name>"`. Layout inside a slot: `cc-stack`, `cc-grid`. `free` slot children use `--col --row --span --rspan`.
- 9:16: `left`/`right` stack vertically. 16:9: they sit side by side.
- Captions stay inside `.cc-caption-stage` (above the bottom safe zone, `310px` on 9:16). Keep key content inside `.cc-safe`. Max 1–2 focal words per phrase: `.cc-word--gold` or `.cc-word--emerald`.
- Exit every previous card/text (`exitFade` `exitDown` `exitCard` `exitStagger` `clearBeat`) BEFORE the next beat enters. Zero overlapping text.
- Component polarity: term/code/diff/filetree always dark; browser/keycap/toast/ai-bubble always light. Typed text must be ASCII.

## 5. TIMELINE (seek-safe, GSAP 3.15)
```js
const tl = gsap.timeline({ paused: true });
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
```
- One paused master timeline. Every tween is placed at an absolute time argument on `tl`. All state derives from `tl` position, so seeking to any time is deterministic.
- Use only `CCMotion.*` presets: `name(tl, target, at, opts)`. Polarity/iris use their documented signatures. `irisTransition` `onPeak` takes `{stage, toDark}`, never a function with side effects.
- Beat length 1.2s–2.5s. Do not overlap enter of beat N+1 with exit of beat N by more than `0.15s`.
- Preset names are checked with `CCMotion.<name>`; if missing, load the matching extension, never reimplement.

## 6. CAPTION WORD-TIMING BINDING
1. Source of truth: `audio/timestamps.json` (word start times, seconds).
2. Each caption phrase = one `.cc-caption` containing `.cc-word` spans, numbered `data-word="0..N-1"` per phrase, in spoken order.
3. Copy that phrase's start times into a literal `times` array (same length and order as the words) and call:
   `CCMotion.captionPhrase(tl, captionEl, phraseStart, { times, byAttr: true, prev })`
   Later phrases pass `prev` (the previous `.cc-caption`); phrases overlap in place.
4. Karaoke/pop styles: `CCMotion.captionPop(tl, el, at, { mode: "highlight|karaoke|build", times, byAttr: true })`. Generic word reveal: `CCMotion.revealWordsAt(tl, els, times, { byAttr: true })`.
5. `times.length === words.length`. No guessed timings.

## 7. PRESET CHEAT SHEET
- Core: fadeUp slideIn popIn maskReveal scaleIn | exitFade exitDown exitCard exitStagger clearBeat | cameraPush panTo focusZoom cameraDrift | polarityFlip irisTransition sweepBridge enterCard cascadeTiles staggerRows strikePrice | revealWordsAt highlightWord underlineDraw | pulseWaveform(tl, barEls, dur)
- Text: hookSlam quoteReveal lowerThirdIn lowerThirdOut bulletsStagger captionPhrase highlightDraw
- Tech: windowEnter typeCommand appendLines cursorBlink diffHighlight keycapPress bubbleIn typingDots toolCallPop statusTick
- Diagrams: drawPath nodeEnter nodePulse connectFlow flowSequence stepAdvance splitWipe checkTick calloutIn layersStack cycleSpin
- Data: countUp barGrow lineDraw dataStagger (count-up elements use `data-value` `data-from` `data-decimals` `data-prefix` `data-suffix` `data-sep` `data-digits`)
- Media: kenBurns mediaReveal wipeTransition captionPop outroAssemble
- Full option lists live in `HANDOFF_LOG.claude.md` / `component-catalog.md`; read them only if a preset is unfamiliar.

## 8. CHECKLIST BEFORE DELIVERY
- Load order exact; only used extensions linked.
- No inline styles beyond allowed; no forbidden APIs.
- Slots not nested; chrome and caption outside `.cc-cam`.
- Every caption word has `data-word`; `times` matches `timestamps.json`.
- Previous beat exited before next enters; 1–2 gold/emerald words per caption.