#!/usr/bin/env python3
"""
AI Video Studio Bootstrap Script
Creates the persistent Core Engine skeleton, master AGENTS.md rulebook,
starter project templates, and all 8 modular Channel Theme Packs.
Safe to re-run: never overwrites existing files.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def write_if_missing(rel_path: str, content: str) -> bool:
    path = ROOT / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        print(f"  [SKIP] Exists: {rel_path}")
        return False
    path.write_text(content, encoding="utf-8")
    print(f"  [OK]   Created: {rel_path}")
    return True


def write_json_if_missing(rel_path: str, data: dict) -> bool:
    formatted = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    return write_if_missing(rel_path, formatted)


AGENTS_MD = """# AI Video Studio — Master Operating Rules (Vendor-Neutral)

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
"""

GEMINI_MD = (
    "Before doing any task, read `AGENTS.md` in this root folder and the active "
    "channel files inside `themes/`. Follow every rule strictly.\n"
)

CREDITS_MD = """# Media Licenses & Attribution Log

> **Rule:** Every external image, video clip, microscopy file, or AI visual placed inside `media/` MUST be logged below before final render. Copy the Attribution column directly into `publish.md`.

| Filename | Type | Source / Platform | Creator / Author | License | Attribution Text for Description | Realistic AI Disclosure Needed? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `sample_photo.jpg` | Photo | Wikimedia Commons | Author Name | CC BY-SA 4.0 | Photo by Author Name via Wikimedia Commons (CC BY-SA 4.0) | No |
| `sample_flow.mp4` | AI Clip | Google Flow | Generated | N/A | N/A | Yes (if photorealistic) / No (if 2D cartoon) |

## Pre-Publish License Check
- [ ] Public Domain / CC0 / Pexels: Safe for commercial YouTube.
- [ ] CC BY / CC BY-SA (Wikimedia, WEHI CC BY 4.0, open-access journals): Author + license included in YouTube description.
- [ ] Non-Commercial (`NC`) or No-Derivatives (`ND`): **DO NOT USE** on monetized channels.
- [ ] YouTube AI Disclosure: Check "Altered or synthetic content" in YouTube Studio if any row is marked `Yes`.
"""

CLAIMS_MD = """# Verified Research & Claims Log

> **Rule:** Every statistic, date, mechanism, or quote in `voice_script.txt` MUST cite a `Claim ID` from the table below.

| Claim ID | Exact Verified Fact | Primary Source URL | Checked Date | Strict Scope (What Source Actually Proves) |
| :--- | :--- | :--- | :--- | :--- |
| `C1` | [Verified statement with exact unit] | [Official URL / Paper / Report] | YYYY-MM-DD | [Do not extrapolate beyond this] |

## Intentionally Excluded (Unverified Myths / Weak Sources)
- [List any popular claim you checked and deliberately cut because no primary source confirmed it.]
"""

IDEAS_TEMPLATE = """# Channel Idea Queue — {title}

## Why Previous Videos Worked (Update After Every Release)
- Clear hook in sentence 1 (zero slow greetings).
- Every claim verified in `claims.md` with primary sources.
- Visuals locked to exact spoken words (`W(line, word)`).

## Hook Rotation Rule
- Odd IDs (#01, #03, #05): Start with a **Story / Paradox**.
- Even IDs (#02, #04, #06): Start with a **Shocking Verified Number**.

> **Warning:** Numbers drafted here are **UNVERIFIED** until logged in an episode's `claims.md`.

## Ordered Backlog
| ID | Status | Format | Hook Type | Topic | Why People Will Watch (1 Line) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 00 | `queued` | Reel (9:16) | Stat | 30-Second Studio Test | End-to-end test of voice sync, theme design, and render. |
| 01 | `queued` | Reel (9:16) | Story | [Write Idea #1 Here] | [2-second scroll-stopper] |
| 02 | `queued` | Long (16:9) | Stat | [Write Idea #2 Here] | [Core insight or twist] |
"""

THEMES = [
    {
        "slug": "01-paper-card-explainer",
        "title": "Paper Card Explainer (Tech & Concept Tutorials)",
        "profile": {
            "theme_id": "01-paper-card-explainer",
            "renderer": "hyperframes",
            "aspect_ratios": ["16:9", "9:16"],
            "pacing_mode": "kinetic",
            "audio_preset": "editorial-kinetic",
            "lufs_voice": -16,
            "lufs_bgm": -30,
            "sfx_cap_db_below_voice": 15,
            "captions": "always-on-karaoke",
            "character_tier": "tier-0-or-1-avatar",
            "automation_fit": ["mode-a-studio", "mode-b-auto"],
        },
        "design": """# DESIGN.md — 01 Paper Card Explainer

## Palette
- Canvas: Warm dotted paper `#FBFAF7` (subtle dot grid `#E5E0F2`)
- Card Surface: Pure white `#FFFFFF`, border-radius `20px`, soft shadow
- Primary Text: Deep ink `#14121A`
- Single Brand Accent: Vibrant Purple `#690AFF` (soft tint `#EDE7FA`)

## Typography
- English Headings/UI: `Montserrat` (Bold / SemiBold)
- Bangla Body/Subtitles: `Noto Sans Bengali`
- Minimum badge/caption font size: `18px` at 1080p

## Layout & Safe Zones
- 9:16 Reels: Keep bottom `260px` clear for platform UI; place karaoke subtitle pill cleanly above safe zone.
- 16:9 YouTube: Centered rounded white cards with generous outer padding (`72px`).
- Active spoken word highlights in `#690AFF` inside the bottom subtitle pill.
""",
        "voice": """# voice-script.md — 01 Paper Card Explainer

- Language: Bangla / English code-switched (or pure English per channel).
- Tone: Friendly, polite, teacher-like (in Bangla, always use respectful `আপনি`).
- Clarity: Explain complex ideas using everyday relatable analogies (e.g., rickshaw, notebook, kitchen).
- Structure: 3-second Hook -> 3-second Name/Title Intro -> Step-by-Step Main Body -> Clean Follow/Subscribe Card.
- TTS Safety: Spell every number as words in `voice_script.txt`; keep digits and English spelling in `subtitle_script.txt` with exact 1:1 word count per line.
""",
        "motion": """# motion-skill.md — 01 Paper Card Explainer

## Motion Rules
- Fresh visual layout on almost every spoken sentence; never hold a static slide for long.
- Every card/icon pops in on the exact spoken word that names it.
- Clean exit-before-enter transitions (zero overlapping headlines mid-crossfade).
- Rebuild all apps/UIs in HTML/CSS with camera push-in, cursor click ripples, and live character typing.
- Numbers count up smoothly from zero; 2D avatars include eyes and subtle blinking.
- Micro-SFX: whoosh (scene change), pop (item reveal), tick (cursor click), keyboard clack (typing).

## Video -> Lesson -> Skill Log
- [Lesson 00]: Enforced exit-before-enter choreography to prevent headline collision during crossfades.
""",
    },
    {
        "slug": "02-editorial-semantic",
        "title": "Editorial Semantic (High-Contrast Tech & Systems)",
        "profile": {
            "theme_id": "02-editorial-semantic",
            "renderer": "hyperframes",
            "aspect_ratios": ["9:16", "16:9"],
            "pacing_mode": "kinetic",
            "audio_preset": "editorial-kinetic",
            "lufs_voice": -16,
            "lufs_bgm": -30,
            "sfx_cap_db_below_voice": 15,
            "captions": "selective",
            "character_tier": "tier-0-svg-mascot",
            "automation_fit": ["mode-a-studio", "mode-b-auto"],
        },
        "design": """# DESIGN.md — 02 Editorial Semantic

## Palette (Semantic Color Shifting)
- Canvas: Warm cream editorial paper `#FAF8F4`
- Dark Cards / Monitors: Charcoal `#0E1117`
- Semantic Red (Problem / Waste / Critical): `#E11D48`
- Semantic Blue (Solution / Architecture / Code): `#2563EB`
- Semantic Green (Success / Stable / Verified): `#10B981`
- CTA Brand Accent: `#7C3AED` (reserved for closing CTA)

## Typography
- Headlines: High-contrast Serif upright + Italic accent words (e.g., `Georgia` / `Playfair Display`)
- Technical/Metrics: Monospace (`Liberation Mono` / `JetBrains Mono`)
- Minimum label size: `18px` at 1080p

## Signature Elements
- Top expanding `step-pill-header` (`01 - THE PROBLEM`, `02`, `03`, `04`).
- Bookend metaphor card (`CRITICAL` in opening hook -> `STABLE` in closing payoff).
""",
        "voice": """# voice-script.md — 02 Editorial Semantic

- Language: Crisp, punchy English (or sharp Bangla/English tech commentary).
- Tone: Confident analyst—fast thesis, clear problem breakdown, concrete numbers, crisp payoff.
- Bookend Rule: Open with a vivid failure metric/state and explicitly resolve that same metric at the end.
- Parity Check: Double-check all technical units (`tokens`, `ms`, `%`, `$`) between `voice_script.txt` and on-screen JSON props.
""",
        "motion": """# motion-skill.md — 02 Editorial Semantic

## Motion Rules
- Use Tier-0 coded SVG micro-mascot with 5 GSAP expression states (`idle`, `happy`, `worried`, `skeptical`, `pointing`).
- Reusable blocks: `status-monitor`, `node-roundtrip-graph`, `capacity-burn-bar`, `sandbox-checklist`, `interactive-cta-outro`.
- Keep SFX subtle and cohesive (never arcade-loud; capped `-15 dB` below voice).

## Video -> Lesson -> Skill Log
- [Lesson 00]: Enforced strict unit-parity check and `-15 dB` SFX cap after auditing vocal/SFX balance.
""",
    },
    {
        "slug": "03-dark-saas-architecture",
        "title": "Dark SaaS Architecture (Living System Diagrams)",
        "profile": {
            "theme_id": "03-dark-saas-architecture",
            "renderer": "hyperframes",
            "aspect_ratios": ["9:16", "16:9"],
            "pacing_mode": "pedagogical",
            "audio_preset": "pure-focus",
            "lufs_voice": -16,
            "lufs_bgm": None,
            "sfx_cap_db_below_voice": 18,
            "captions": "off",
            "character_tier": "none",
            "automation_fit": ["mode-a-studio", "mode-b-auto"],
        },
        "design": """# DESIGN.md — 03 Dark SaaS Architecture

## Palette
- Canvas: Midnight `#060913` with subtle radial indigo spotlight
- Glass Cards: `#0F1629` with `1px solid rgba(255,255,255,0.12)`
- Active Connectors / Packets: Neon Cobalt `#38BDF8` / `#3B82F6`
- Chaos / Bottleneck State: Coral Red `#F43F5E`
- Approved / Connected State: Emerald `#22C55E`

## Typography & Legibility
- Clean Sans-Serif + Monospace for schemas/queries.
- Strict minimum font size: `18px` for micro-badges (prevents YouTube compression blur on 9:16 mobile).
- Captions OFF: rely on 1-2 word floating section headers and card labels.
""",
        "voice": """# voice-script.md — 03 Dark SaaS Architecture

- Tone: Calm, unhurried senior engineer explaining how pieces connect.
- Structure: Pain Point (`M x N` complexity) -> Analogy -> Persistent Architecture Walkthrough -> Live Example -> Clean Wrap-Up.
- Audio: Clean voice-only (`pure-focus`), zero background music, zero arcade SFX.
""",
        "motion": """# motion-skill.md — 03 Dark SaaS Architecture

## Motion Rules
- Keep ONE persistent spatial node diagram (`persistent-node-canvas`) anchored across multiple sentences instead of cutting to blank slides.
- Use `depth-focus-modal` (blur + dim background to 20% opacity) whenever zooming into a JSON schema, SQL result, or approval prompt, then return focus smoothly.
- On 16:9 Long-Form, anchor diagram on left 55% and slide detail panels into right 45%.
- Dim inactive code lines to `35%` opacity inside `code-spotlight-card`.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Locked minimum badge font size to `18px` to avoid mobile compression softness.
""",
    },
    {
        "slug": "04-bio-2d-explainer",
        "title": "Bio 2D Explainer (Cellular & Biochemistry Shorts)",
        "profile": {
            "theme_id": "04-bio-2d-explainer",
            "renderer": "hyperframes",
            "aspect_ratios": ["9:16", "16:9"],
            "pacing_mode": "kinetic",
            "audio_preset": "editorial-kinetic",
            "lufs_voice": -16,
            "lufs_bgm": -30,
            "sfx_cap_db_below_voice": 15,
            "captions": "always-on-karaoke",
            "character_tier": "tier-0-svg-cell-mascot",
            "automation_fit": ["mode-a-studio", "mode-b-auto"],
        },
        "design": """# DESIGN.md — 04 Bio 2D Explainer

## Palette
- Bloodstream / Active Zone: Deep vascular crimson `#2B080D` -> `#4A0E17` with floating RBC silhouettes
- Protected / Cellular Sanctuary: Cool cyan-teal `#0A2E38` -> `#115E6B`
- Safe Banner: Emerald `#10B981` | Breach / Alert Banner: Urgent Red `#EF4444`

## Safe Zones (Strict)
- Top banner height capped so vertical barrier labels NEVER clip underneath it.
- Mascot stage stays strictly above the bottom `300px` caption zone so subtitles never overlap character faces.
""",
        "voice": """# voice-script.md — 04 Bio 2D Explainer

- Format: Fast 25-60s high-retention curiosity hooks (e.g., immune privilege, enzyme inhibition, viral entry, metabolic bottlenecks).
- Scientific Integrity: Every biological claim must be verified in `claims.md` against textbooks or peer-reviewed papers.
- Tone: Energetic, visual storytelling—translate biochemical mechanisms into dramatic spatial stories without sacrificing accuracy.
""",
        "motion": """# motion-skill.md — 04 Bio 2D Explainer

## Motion Rules
- Use state-shifting Tier-0 SVG cell mascots (e.g., patrol/flashlight state -> alert state -> attack state) driven by GSAP.
- Reusable blocks: `cell-barrier-split` (epithelial wall with animated crack/breach), antibody/ligand particle swarms, `reticle-photo-card` (1 real microscopy/anatomy photo grounded with a scanner HUD).
- Run `npx hyperframes check` on every frame to guarantee zero text clipping or mascot/subtitle overlap.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Enforced strict top-banner and bottom-caption safe zones to prevent rotated barrier text clipping and mascot head overlap.
""",
    },
    {
        "slug": "05-talking-head-educator",
        "title": "Talking Head Educator (Face-Cam + Chalkboard Diagrams)",
        "profile": {
            "theme_id": "05-talking-head-educator",
            "renderer": "hyperframes",
            "aspect_ratios": ["16:9"],
            "pacing_mode": "pedagogical",
            "audio_preset": "pure-focus",
            "lufs_voice": -16,
            "lufs_bgm": -30,
            "sfx_cap_db_below_voice": 16,
            "captions": "hook-only",
            "character_tier": "real-human-facecam",
            "automation_fit": ["mode-a-studio"],
        },
        "design": """# DESIGN.md — 05 Talking Head Educator

## Three Core Layouts
- Layout A (Intro / Transitions): Full-screen center-framed face-cam + dark translucent glass cards sliding into left/right 25% margins (never touching face).
- Layout B (Primary Teaching — ~75% runtime): Dark textured chalkboard slate (`#0E1015`) on left 75% + blue-bordered rounded PiP face-cam on right 25%.
- Layout C (Web / Papers / Docs): Clean light canvas (`#F8FAFC`) on left 75% + same right 25% PiP face-cam.

## Captions & Notes
- Captions appear ONLY during the first 3-4 second opening hook, then turn off cleanly.
- Auto-generate companion PDF short notes from `claims.md` and tease them on screen (`notes-teaser-scroll`).
""",
        "voice": """# voice-script.md — 05 Talking Head Educator

- Filming Contract: Record constant `30fps`, medium-wide shot sitting dead-center with 25% breathing room on both sides.
- Audio: Soft ambient music during the 60-second intro only; fade out cleanly during deep explanation.
- Retention Hook: Promise viewers they don't need to take notes because crisp companion notes are linked below.
""",
        "motion": """# motion-skill.md — 05 Talking Head Educator

## Motion Rules
- Use `aroll_prep` workflow (constant 30fps lock + silence trim + vocal polish + word timestamps) before coding visuals.
- Morph camera cleanly between Layout A and Layout B/C via `pip-stage-morph` using `data-track-index`.
- Render long 15-25 min lectures in 2-3 minute chapter chunks and stitch via FFmpeg to guarantee zero lip-sync drift.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Locked filming framing and 30fps contract before building automated PiP transitions.
""",
    },
    {
        "slug": "06-veritasium-doc",
        "title": "Veritasium & Business Documentary (Curated Footage + Minimalist Labels)",
        "profile": {
            "theme_id": "06-veritasium-doc",
            "renderer": "hyperframes",
            "aspect_ratios": ["16:9", "9:16"],
            "pacing_mode": "pedagogical",
            "audio_preset": "story-ambient",
            "lufs_voice": -16,
            "lufs_bgm": -28,
            "sfx_cap_db_below_voice": 16,
            "captions": "off",
            "character_tier": "real-human-or-faceless",
            "automation_fit": ["mode-a-studio", "mode-b-overnight-draft"],
        },
        "design": """# DESIGN.md — 06 Veritasium & Documentary

## Palette & Typography
- Presenter backdrop: Plain matte dark wall (`#111318`).
- Overlays: Box-free floating Serif typography (`Georgia` / `Playfair Display` + `Noto Sans Bengali` if bilingual) in crisp white `#FFFFFF` with subtle drop shadow.
- Editorial researcher/source credit lower-third (`researcher-credit-card`) auto-populated from `media/credits.md`.
- Zero bottom karaoke captions (let full-screen microscopy, archival footage, and B-roll breathe).
""",
        "voice": """# voice-script.md — 06 Veritasium & Documentary

- Structure: 10-second arresting visual cold open -> Human intro framing the mystery -> Full-screen curated visual journey -> Human philosophical/real-world reflection outro.
- Sourcing: Use open-license microscopy/animations (`WEHI.TV` CC BY 4.0, `Wikimedia Commons`, `The Cell Image Library` PD/CC BY, `Pexels`, open-access journal MP4s, or Google Flow atmospheric B-roll). Every single clip MUST be logged in `media/credits.md`.
""",
        "motion": """# motion-skill.md — 06 Veritasium & Documentary

## Motion Rules
- Use `broll-cue` (`start`, `end`, `playbackRate`) to land visual peaks on exact spoken sentences.
- Use `minimal-term-overlay` for floating scientific/economic terms without bulky boxes.
- Support `bridge-reel` mode: pull one standalone paradox/story from `claims.md` into a 90-120s 9:16 Short funneling to the 16:9 episode.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Tied `researcher-credit-card` directly to `media/credits.md` for transparent attribution.
""",
    },
    {
        "slug": "07-stem-math-story",
        "title": "STEM & Math Story (3Blue1Brown Style — Manim + Chalk Sketches)",
        "profile": {
            "theme_id": "07-stem-math-story",
            "renderer": "hybrid",
            "aspect_ratios": ["16:9", "9:16"],
            "pacing_mode": "pedagogical",
            "audio_preset": "story-ambient",
            "lufs_voice": -16,
            "lufs_bgm": -28,
            "sfx_cap_db_below_voice": 18,
            "captions": "selective",
            "character_tier": "tier-1-chalk-sprites-or-flow",
            "automation_fit": ["mode-a-studio"],
        },
        "design": """# DESIGN.md — 07 STEM & Math Story

## Palette (Color as Semantic Memory)
- Canvas: Pure solid `#000000` (allows seamless `mix-blend-mode: screen` compositing of Manim + chalk sketches).
- Lock one color per mathematical/scientific entity across the entire episode (e.g., Blue `#58C4DD`, Green `#83C167`, Yellow `#FFFF00`, Coral `#FC6255`).

## Key Visual Blocks
- `timeline-scrubber`: Persistent bottom chronological axis that glides forward and smoothly rewinds to earlier years.
- `source-highlight-split`: Pins actual primary problem text/paper abstract in top 20% with word-synced highlighter while diagram reacts below.
""",
        "voice": """# voice-script.md — 07 STEM & Math Story

- Pacing: Hold key mathematical/conceptual insights still for 2-4 seconds so viewers can process relationships.
- Audio: Use `pure-focus` (zero music/SFX) for dense proofs; use `story-ambient` (curiosity synth bed, zero UI SFX) for narrative anecdotes and Bridge Reels.
- Captions: Selective only (hooks/quotes); hide captions whenever dense equations are visible.
""",
        "motion": """# motion-skill.md — 07 STEM & Math Story

## Motion Rules
- Prefer continuous object morphing (`TransformMatchingTex` in Manim) over slide cuts.
- Composite Tier-1 chalk character sprites (with subtle 6fps SVG line-boil) or pure-black Google Flow sketches via `mix-blend-mode: screen`.
- Phase 2 upgrade: Mount optional `manimcommunity/manim` container sharing `./workspace` for native LaTeX proofs.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Separated Manim into an optional Phase 2 service to keep Phase 1 Docker lean.
""",
    },
    {
        "slug": "08-bio-3d-microscopy",
        "title": "Bio 3D Microscopy & Interactive Mascot (Flow + Three.js + PDB)",
        "profile": {
            "theme_id": "08-bio-3d-microscopy",
            "renderer": "hybrid",
            "aspect_ratios": ["9:16", "16:9"],
            "pacing_mode": "kinetic",
            "audio_preset": "story-ambient",
            "lufs_voice": -16,
            "lufs_bgm": -28,
            "sfx_cap_db_below_voice": 15,
            "captions": "selective",
            "character_tier": "tier-2-locked-anchor-3d-mascot",
            "automation_fit": ["mode-a-studio"],
        },
        "design": """# DESIGN.md — 08 Bio 3D Microscopy & Mascot

## Palette
- Dark-Field Microscopy Mode: Deep space `#030712`, icy cyan Fresnel rim glow `#38BDF8`, warm amber/peach nucleus glow `#FB923C`.
- Presenter Studio Mode: Clean light medical blue `#DCEEFF` with a permanent high-contrast character anchor (e.g., branded headband/goggles).

## Signature Overlays (100% HyperFrames Code)
- `scale-hud-badge`: Frosted top-left hierarchy + unit indicator (`Organ -> mm`, `Cells -> μm`, `DNA -> nm`).
- `anatomical-callout`: Crisp code-rendered leader lines and labels (NEVER let AI video generators draw anatomical text).
- `split-compare`: Animated side-by-side physiological comparison (e.g., bright vs. dim pupil, normal vs. inhibited enzyme).
""",
        "voice": """# voice-script.md — 08 Bio 3D Microscopy & Mascot

- Cadence: Alternate ~4-second Interactive Mascot presenter beats with Macro 3D Organ/Molecular cutaways.
- Scientific Accuracy Rule: Use Google Flow (Omni Flash 1.2 / Veo 3.1 Lite) for atmospheric hooks and character beats, NIH 3D `.glb` + Three.js or Blender Molecular Nodes (`.pdb`) for exact molecular structures, and HyperFrames SVG/Manim for exact physics/optics/pathway diagrams.
""",
        "motion": """# motion-skill.md — 08 Bio 3D Microscopy & Mascot

## Motion Rules
- **STRICT ZERO-TEXT PROMPT RULE:** Append "NO text, NO labels, NO arrows, NO watermarks" to every Google Flow generation.
- **Credit Saver:** Pre-build 6-8 reusable neutral presenter clips inside `character/clips/` (pointing, open palm, nodding, CTA wave) and spend fresh Flow credits only on topic-specific macro organ cutaways. Test in 360p before upscaling to 1080p.
- Zoom-In / Zoom-Out Bookend: Stage multi-scale journeys with smooth zoom transitions + `scale-hud-badge`.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Banned AI-generated labels and optics diagrams after auditing common anatomical hallucination errors.
""",
    },
]


def main() -> None:
    print(f"\nBootstrapping AI Video Studio inside: {ROOT}\n")

    # 1. Core folders
    for rel_dir in [
        "engine/scripts",
        "engine/lib",
        "shared/blocks",
        "projects/00-test-30s/audio",
        "projects/00-test-30s/media",
        "projects/00-test-30s/reel-9x16",
    ]:
        (ROOT / rel_dir).mkdir(parents=True, exist_ok=True)

    # 2. Root & starter files
    write_if_missing("AGENTS.md", AGENTS_MD)
    write_if_missing("GEMINI.md", GEMINI_MD)
    write_json_if_missing("engine/respell.json", {})
    write_if_missing("projects/00-test-30s/media/credits.md", CREDITS_MD)
    write_if_missing("projects/00-test-30s/claims.md", CLAIMS_MD)

    # 3. All 8 Theme Packs
    created_json_files = [ROOT / "engine/respell.json"]
    for theme in THEMES:
        base = f"themes/{theme['slug']}"
        for sub in ["blocks", "character/poses", "character/clips"]:
            (ROOT / base / sub).mkdir(parents=True, exist_ok=True)

        write_json_if_missing(f"{base}/profile.json", theme["profile"])
        write_if_missing(f"{base}/DESIGN.md", theme["design"])
        write_if_missing(f"{base}/voice-script.md", theme["voice"])
        write_if_missing(f"{base}/motion-skill.md", theme["motion"])
        write_if_missing(
            f"{base}/ideas.md", IDEAS_TEMPLATE.format(title=theme["title"])
        )
        created_json_files.append(ROOT / f"{base}/profile.json")

    # 4. Self-verification pass
    print("\nRunning JSON & structure integrity check...")
    for jf in created_json_files:
        parsed = json.loads(jf.read_text(encoding="utf-8"))
        assert isinstance(parsed, dict), f"Invalid JSON object in {jf}"
    print(f"ALL CHECKS PASSED: {len(THEMES)} themes + Core Engine skeleton verified!\n")


if __name__ == "__main__":
    main()