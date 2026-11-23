# GLOBAL_CHANNEL: BASIC CLAUDE COPY — MASTER DESIGN BIBLE v2 (Web Gemini Gem)

## 1. Visual Identity
High-trust, dual-polarity editorial motion graphics at broadcast flagship quality. Works for Bangla, English, and bilingual educational, tech, science, and course explainers, in 9:16 Shorts and 16:9 cinema. Calm, structured, and confident: paper-like clarity, emerald authority, gold focus.

## 2. Color Grammar (Dual Polarity)
- **Light (`.cc-stage`)** for explanations, comparisons, progress, and data. Alabaster paper (`#F6F8F4` → `#E3E8DF`), faint emerald lattice, charcoal ink (`#101A16`).
- **Dark (`.cc-stage--dark`)** for proofs, breakdowns, pricing, and urgency/CTA. Deep emerald (`#0D593E` → `#022317`), faint gold lattice, white ink.
- **Polarity rule:** switch only on a major act change, via `polarityFlip` or `irisTransition` (max 1–2 per Short). Components read stage vars (`--ink`, `--accent`, `--hl`, `--hl-2`), never raw colours.
- **Accents:** Amber Gold (`#E5A93C` / `#F4BE52`) for focal words, bridges, and milestones. Emerald for secondary focal words. Coral (`#E5484D`) only for strikethroughs, `REC`, and urgency pills.
- Always-dark components: terminal, code, diff, filetree. Always-light: browser, keycap, toast, AI bubble.

## 3. Typography
- **`.cc-stage--en`:** Space Grotesk (display), Plus Jakarta Sans (body), JetBrains Mono (tags, numbers, code).
- **`.cc-stage--bn`:** Hind Siliguri (display, captions), Noto Sans Bengali (body); line-height `1.28–1.42` and `--glyph-pad` for matra clearance. Count-ups use Bengali numerals via `data-digits="auto"`.
- Type sizes come from `--fs-*` / `--lh-*` tokens. Tabular numerals for all numbers. Focal words: 1–2 per caption phrase.

## 4. Pacing & Motion
- Micro-beats of 1.2s–2.5s; one idea per beat; exit before enter, zero overlapping text.
- Persistent chrome (avatar, waveform, context pill) stays outside the camera group.
- Signature gold-rimmed circular iris wipe on major polarity switches only.
- Captions are word-timed from `audio/timestamps.json`.
- All motion is a paused, seek-safe GSAP timeline built from `CCMotion` presets.

## 5. Safe-Zone Discipline
- 9:16 canvas `1080x1920`; 16:9 canvas `1920x1080`. Unified `--safe-*` tokens and `.cc-safe` define the content box.
- Captions sit in `.cc-caption-stage`, above the `310px` bottom safe zone on 9:16.
- Layout uses slots (`top hero center left right lower caption full free`); `left`/`right` stack on 9:16 and sit side by side on 16:9. Slots are never nested.
- Caption, avatar, waveform, and transition overlays live outside `.cc-cam`, so camera moves never shift them.
- `.cc-stage--guides` shows the safe boxes while debugging.

## 6. Component Families (1 line per batch)
- **B1 Foundations:** stage, cam, safe, slot, stack, grid, surface, card, pill, badge, divider + core motion (fade, slide, pop, mask, exit, camera, polarity, iris).
- **B2 Typography & Hooks:** title, eyebrow, kicker, subtitle, hook, caption/word, highlight, lower-third, quote, bullets, chapter label (`motion-presets.text.js`).
- **B3 Tech & Product UI:** terminal, code, diff, browser, device, chat, keycap, command, filetree, status, toast (`motion-presets.tech.js`).
- **B4 Diagrams & Workflows:** flow, node, edge, step, timeline, split, checklist, matrix, cycle, layers, callout (`motion-presets.diagrams.js`).
- **B5 Data & Evidence:** kpi, metric, progress, bars, linechart, table, source (`motion-presets.data.js`).
- **B6 Media, Transitions, Outro:** media, media-split, subtitles, wipe/curtain/slash/dim, outro, cta, next-up (`motion-presets.media.js`), plus Contract v2 and scene templates.

## 7. Production Split
- **Web Gemini (Art Director):** script, `shot-manifest.md`, image/Flow prompts, visual snapshot audit, layout JSON.
- **User (Supervisor):** tests look and feel in `preview-kit.html`, runs `tts_cache.py`.
- **3.8 Flash (`agy`):** reads ONLY `flash-contract.md` + `audio/timestamps.json`, then assembles scenes from `templates/scene-template.html` with `.cc-*` components and `CCMotion` presets.