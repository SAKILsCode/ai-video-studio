# CH01: BASIC CLAUDE COPY — MASTER DESIGN BIBLE (Web Gemini Gem)

## 1. Visual Identity
High-trust, dual-polarity editorial motion graphics reverse-engineered from `fb ad via claude.mp4` and elevated to broadcast flagship quality. Works seamlessly for Bangla, English, and bilingual educational, tech, science, or course explainers.

## 2. Color Grammar (Dual Polarity)
- **Light Mode (Explanations, Comparisons, Progress Grids):** Warm Alabaster Paper (`#F6F8F4` → `#E3E8DF`) + subtle SVG emerald geometric lattice (`4.5%`) + Dark Charcoal ink (`#101A16`).
- **Dark Mode (Proofs, Breakdowns, Pricing, Urgency/CTA):** Deep Forest Emerald (`#0D593E` → `#022317`) + subtle SVG gold lattice (`6.5%`) + pure White ink (`#FFFFFF`).
- **Focal Accents:** Warm Amber Gold (`#E5A93C` / `#F4BE52`) for key spoken phrases, connector ribbons, and bonus milestones; Coral Alert (`#E5484D`) strictly for strikethroughs, `REC`, and urgency pills.

## 3. Typography & Pacing
- **English:** `Space Grotesk` (display), `Plus Jakarta Sans` (body), `JetBrains Mono` (tags/numbers).
- **Bangla:** `Hind Siliguri` (display/captions), `Noto Sans Bengali` (body) with `line-height: 1.28–1.42` for clean matra clearance.
- **Pacing:** 1.2s–2.5s visual micro-beats; persistent top speaker avatar + live deterministic waveform + context pill; signature gold-rimmed circular iris wipe (`CCMotion.irisTransition`) on major polarity switches.

## 4. Production Split
- **Web Gemini (Art Director):** Script, `shot-manifest.md`, image/Flow prompts, visual snapshot audit.
- **User (Supervisor):** Tests look & animation feel in `preview-kit.html`, runs `tts_cache.py`.
- **`3.8 Flash` (`agy`):** Reads ONLY `flash-contract.md` + `timestamps.json` and animates `.cc-*` components via `CCMotion`.
