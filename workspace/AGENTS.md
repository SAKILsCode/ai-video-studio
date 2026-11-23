# AI Video Studio — Master Operating Rules (Vendor-Neutral)

You are the execution engineer inside a modular, multi-channel AI video studio.
Always read the active theme folder (`themes/<theme-name>/`) before writing code or scripts.

## 1. Core 7-Step Pipeline
1. Idea (`themes/<theme>/ideas.md`) -> 2. Verified Research (`claims.md`) ->
3. Dual Script (`voice_script.txt` + `subtitle_script.txt`) -> 4. Voice & Word Sync ->
5. Scene Plan & Visual Build -> 6. Automated QA & Browser Preview -> 7. Render & `publish.md`

## 2. Truth, Claims & Parity Rules (Zero Hallucinations)
- Every factual statistic or claim in a script MUST map to a verified `Claim ID` (`C1`, `C2`, ...) in the episode's `claims.md` with a primary source URL and checked date.
- Never include unverified numbers. Log popular unverified myths under `Intentionally Excluded` in `claims.md`.
- **Voice-vs-Visual Unit Parity:** Before rendering, confirm every number and unit spoken in `voice_script.txt` matches the exact number and unit rendered on screen (e.g., never say "million dollars" while showing "1M+ tokens").

## 3. Dual-Script 1:1 Word Parity & Pronunciation
- Maintain two matched files per episode:
  - `voice_script.txt`: Spells all numbers in words (`2024` -> `two thousand twenty-four`, `4K` -> `four K`) and uses phonetic spellings for tricky terms.
  - `subtitle_script.txt`: Clean on-screen spelling and normal digits.
- Both files MUST have the exact same number of lines and words per line so word-level timestamps align 1:1.
- Log recurring pronunciation fixes in `engine/respell.json`.

## 4. Mandatory Two-Gate Studio Loop
- **Gate 1 (Before Coding):** Always present a line-by-line `scene-plan.md` synced to spoken phrases and wait for human approval before generating HyperFrames HTML/GSAP code.
- **Gate 2 (Before Final Render):** Run `npx hyperframes check --json` and `npx hyperframes preview` for human timestamp review. Fix only flagged timestamps; never rebuild approved scenes.

## 5. Universal Visual & Media Rules
- **No Overlapping Headline Crossfades:** Enforce clean exit-before-enter choreography or directional transitions so outgoing and incoming titles never collide mid-fade.
- **Zero Raw App Screenshots:** When showing software, chats, or websites, inspect the reference and rebuild the UI cleanly in HTML/CSS.
- **Zero Text Inside AI Video:** Any clip generated in Google Flow (Omni Flash / Veo) must be 100% text-free and label-free. All titles, leader lines, and data labels are rendered by HyperFrames.
- **Canvas-Matched Blend Modes:** Composite pure `#000000` sketch/Manim layers with `mix-blend-mode: screen` on dark themes, and pure `#FFFFFF` layers with `mix-blend-mode: multiply` on light paper themes.
- **Minimum Font Legibility:** Never render micro-badges or labels smaller than `16px` (`18px` preferred) at 1080p.
- **Media Credits:** Every external photo, microscopy clip, stock B-roll, or AI clip placed in `media/` MUST be logged in `media/credits.md`. Never use `NC` (Non-Commercial) or `ND` (No-Derivatives) assets on monetized videos.

## 6. Audio Standards
- Follow the active theme's `profile.json` preset (`editorial-kinetic`, `story-ambient`, or `pure-focus`).
- Target narration loudness: `-16 LUFS`. Background music (when enabled): `-28` to `-30 LUFS`.
- SFX Gain Ceiling: keep micro-SFX at least `-15 dB` below voice level.

## 7. Compounding Memory (Video -> Lesson -> Skill)
- After every finished video, append 1-2 concrete visual/pacing takeaways to the active theme's `motion-skill.md` and update `ideas.md`.
