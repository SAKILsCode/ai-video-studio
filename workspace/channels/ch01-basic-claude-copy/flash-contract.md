# CH01 Basic Claude Copy — Motion-Only Contract (For 3.8 Flash / agy)

## STRICT RULES (LOW TOKEN, HIGH SMOOTHNESS)
1. DO NOT edit `tokens.css`, `components.css`, or `motion-presets.js`. Link all three read-only in every episode HTML.
2. Add `.cc-stage--bn` for Bangla episodes, `.cc-stage--16x9` for 16:9 cinema, and toggle `.cc-stage--dark` between Alabaster Paper and Deep Emerald beats.
3. NEVER hand-code complex humans, organic scenes, or crude SVG clipart. Place speaker cutouts in `.cc-speaker-cutout` / `.cc-avatar__inner` and B-roll/Veo plates in `.cc-plate-media`.
4. Always use a paused GSAP master timeline (`gsap.timeline({ paused: true })`) with **zero `Math.random()`** and **zero `requestAnimationFrame`**.
5. Call `window.CCMotion` presets instead of inventing raw GSAP tweens:
   - `CCMotion.enterCard(tl, el, t, tiltDeg)`
   - `CCMotion.sweepBridge(tl, el, t)`
   - `CCMotion.cascadeTiles(tl, els, t, stagger)`
   - `CCMotion.irisTransition(tl, irisEl, t, onPeak)` (max 1–2 major act breaks per Short)
   - `CCMotion.staggerRows(tl, els, t, stagger)`
   - `CCMotion.strikePrice(tl, strikeEl, newPriceEl, t)`
   - `CCMotion.revealWords(tl, wordEls, t, stagger)` synced 1:1 with `audio/timestamps.json`
   - `CCMotion.cameraDrift(tl, camEl, t, dur)` + `CCMotion.pulseWaveform(tl, barEls, dur)`
6. Keep captions strictly inside `.cc-caption-stage` above bottom safe zone (`310px` on 9:16), highlighting 1–2 focal words per phrase with `.cc-word--gold` or `.cc-word--emerald`.
7. Exit previous text/cards cleanly before entering the next beat (zero overlapping text).
