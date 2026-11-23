# DESIGN.md — 09 Cloned Flagship (Tactile Minimal Tech / InsiderForce Style)

Visual DNA reverse-engineered directly from 78 reference frames (`references/frames/frame_001.png` to `frame_078.png`). This theme captures the high-retention, ultra-clean aesthetic characteristic of premium AI and developer-tool short-form explainers: tactile claymorphic elevation, Swiss typography with extreme weight contrast, floating tablet/browser device stages, and crisp monochrome contrast punctuated by warm terracotta accents.

---

## 1. Exact Hex Palette

### Canvas & Background
- **Studio Canvas Base:** `#F2F2F2` (soft warm studio off-white; avoids harsh sterile `#FFFFFF`)
- **Center Spotlight Radial Highlight:** `#F8F8FA` to `#FFFFFF` (central radial fill at 50% 40% with 60% falloff)
- **Vignette Outer Rim:** `#E5E5EB` to `#E8E8EE` (soft ambient vignetting drawing focus inward)
- **Technical Coordinate Grid:** `#D1D1D6` / `rgba(0, 0, 0, 0.08)` (fine dotted/dashed lines with 4px circular intersection nodes spaced at 72px intervals; seen on hook intro and outro bookends)

### Surface Cards & Device Stages
- **Floating Tablet / Browser Bezel:** `#FFFFFF` (pure white chassis with `border-radius: 28px - 32px`)
- **Stage Outer Perimeter Border:** `1px solid rgba(0, 0, 0, 0.08)` (subtle structural edge definition)
- **Stage Top Specular Highlight:** `1px solid rgba(255, 255, 255, 0.85)` (directional top-down lighting catch)
- **Stage Multi-Tier Ambient Occlusion Shadow:**
  ```css
  box-shadow: 
    0 10px 20px -5px rgba(0, 0, 0, 0.06),
    0 24px 48px -10px rgba(0, 0, 0, 0.12),
    0 48px 96px -20px rgba(0, 0, 0, 0.08);
  ```
- **Dark In-App UI / Terminal Surface:** `#161618` to `#1C1C1F` (deep obsidian; code editor and browser dark mode)
- **In-App Card Sub-Surfaces:** `#222226` (metric cards, chat bubbles, prompt chips)
- **Inverted Black Pill Badge:** `#141416` (solid black rounded badge for high-impact hook keywords like `[you need right now]`, text `#FFFFFF`)

### Tactile 3D MCP Badges
- **Pill Body Surface:** `#FFFFFF` to `#FDFDFD` (`border-radius: 9999px` / capsule)
- **Left Icon Container Box:** `#1A1A1A` (charcoal black rounded rectangle `border-radius: 10px` holding brand glyphs)
- **Tactile Bevel & Extrusion Shadow:**
  ```css
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 12px 24px -4px rgba(0, 0, 0, 0.16),
    0 24px 48px -8px rgba(0, 0, 0, 0.10);
  border: 1px solid rgba(0, 0, 0, 0.06);
  ```

### Typography Colors
- **Primary Spoken / Focal Text:** `#161616` to `#1A1A1A` (deep near-black, razor-sharp edge contrast)
- **Secondary / Lead-in Text:** `#737373` to `#8E8E93` (neutral slate gray for conversational connectives)
- **Inactive / Ghost Word Fill:** `#C7C7CC` (words awaiting spoken activation in karaoke subtitle flow)
- **Watermark / Footer Handle:** `#B0B0B8` at `35%` opacity (`insiderforce.io`)

### Signature Accent Colors
- **Brand Hero Accent (Anthropic Clay / Terracotta):** `#D77656` (exact frame sample: ceramic token stars, floral corner petal cutouts, primary attention focal points)
- **MCP Ecosystem Accents (Crisp Brand Badges):**
  - **Perplexity MCP:** `#FFFFFF` starburst on `#1A1A1A` container
  - **Playwright MCP:** `#22C55E` (Emerald) + `#E11D48` (Crimson) comedy/tragedy dual theater masks
  - **Firecrawl MCP:** `#F97316` to `#EA580C` (vibrant neon flame)
  - **Higgsfield MCP:** `#CCFF00` to `#D4E157` (electric lime/chartreuse worm path)
  - **Chrome DevTools MCP:** Multi-bracket gradient (`#4285F4` Blue, `#EA4335` Red, `#FBBC05` Yellow, `#34A853` Green)
- **Bullet Point Glyph:** `#161616` (4-point star `✦` / diamond sparkle)

---

## 2. Typography System (9:16 Vertical 1080x1920)

### Font Families
- **Primary Headings & Body:** `Inter`, `Geist Sans`, or system neo-grotesque (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`)
  - Google Fonts import: `https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&display=swap`
- **Monospace (Code / Terminal / Schemas):** `JetBrains Mono`, `Fira Code`, or `ui-monospace`
  - Google Fonts import: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap`

### Weight Contrast & Letter-Spacing
- **Extreme Weight Juxtaposition:** The hallmark of this visual grammar is pairing light/regular lead-ins with massive ultra-bold keywords on the same sentence or adjacent lines.
  - *Lead-ins:* `font-weight: 400` (Regular) or `500` (Medium) in secondary gray (`#737373`).
  - *Punchwords:* `font-weight: 800` (ExtraBold) or `900` (Black) in deep black (`#161616`).
  - *Editorial Italics:* `font-style: italic`, `font-weight: 700` (Bold) for personal inflection (*Human Made It*, *Follow*, *Claude Code Users*).
- **Letter-Spacing:**
  - Headlines & Titles: `-0.03em` to `-0.04em` (compact, intentional Swiss editorial tracking).
  - Tactile Pill Badges: `+0.05em` (uppercase tracking for crisp small-size legibility).
  - Monospace Code: `-0.01em` to `0.00em`.

### Scale Hierarchy for 1080x1920 (9:16)
| Role | Font Size | Weight | Line Height | Tracking | Text Color |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Number / Impact Count** | `120px - 140px` | `900` Black | `1.0` | `-0.04em` | `#161616` |
| **Primary Headline / Hook** | `68px - 76px` | `800` ExtraBold | `1.12` | `-0.035em` | `#161616` |
| **Secondary Headline / Sub-hook** | `48px - 56px` | `500` Medium | `1.20` | `-0.025em` | `#161616` / `#737373` |
| **Section Switch ("First is", "Second is")** | `52px - 60px` | `700` Bold (`is` in `400`) | `1.15` | `-0.03em` | `#161616` / `#8E8E93` |
| **Tactile MCP Pill Title** | `30px - 34px` | `800` ExtraBold | `1.0` | `+0.05em` | `#161616` (All-Caps) |
| **Staggered Bullet Items (✦)** | `40px - 44px` | `600` SemiBold | `1.30` | `-0.02em` | `#161616` |
| **Bullet Sparkle Icon (`✦`)** | `32px` | `900` Black | `1.0` | `0` | `#161616` |
| **Spoken Karaoke HUD Subtitle** | `38px - 44px` | `500` -> `800` active | `1.25` | `-0.02em` | `#8E8E93` -> `#161616` |
| **In-App Terminal / Code** | `20px - 24px` | `400` / `500` Mono | `1.45` | `0` | `#E4E4E7` |
| **Footer Watermark (`insiderforce.io`)** | `26px - 28px` | `500` Medium | `1.0` | `-0.01em` | `#B0B0B8` (35% op) |

---

## 3. Layering & Depth Recipe

The visual composition is strictly built across 5 discrete z-index planes to establish tangible, tactile physical depth:

```
[Layer 4: HUD & Safety Overlay]      z-index: 40  (Watermark, platform UI clearance)
[Layer 3: Foreground Typography]     z-index: 30  (Top headlines, staggered bullet points, pill badges)
[Layer 2: Floating Stage / Mockup]   z-index: 20  (Tablet browser frame, 3D ebook, app windows)
[Layer 1: Midground Physical Props]  z-index: 10  (Claymorphic tokens, terracotta cutouts, drop shadows)
[Layer 0: Backdrop Canvas]           z-index: 0   (Studio gradient, coordinate grid, micro-grain)
```

### Layer 0: Backdrop Canvas
- Base color `#F2F2F2`.
- Center spotlight: CSS radial gradient `radial-gradient(ellipse 900px 1100px at 50% 38%, #FFFFFF 0%, #F2F2F2 65%, #E5E5EB 100%)`.
- Procedural technical grid: SVG or CSS background pattern displaying dotted lines (`#D1D1D6`) on a `72px x 72px` grid with `4px` circular intersection nodes. Grid is active in Scene 1 (Hook), Scene 7 (Ebook CTA), and Scene 8 (Outro Logo).
- Micro-grain pass: Canvas or CSS SVG filter `#feTurbulence` with `baseFrequency="0.85"` set to `mix-blend-mode: multiply` at `2.5%` opacity to eliminate 8-bit banding on mobile screens.

### Layer 1: Midground Physical Props
- Ceramic 3D Tokens: Clay-style circular coins (`width: 220px; height: 220px; border-radius: 50%`) with embossed Anthropic terracotta flowerburst. Rendered with soft multi-directional drop shadows:
  ```css
  box-shadow:
    inset 0 4px 6px rgba(255, 255, 255, 0.8),
    inset 0 -6px 8px rgba(0, 0, 0, 0.08),
    0 16px 32px rgba(0, 0, 0, 0.12),
    0 32px 64px rgba(0, 0, 0, 0.08);
  ```
- Corner Cutouts: Abstract curved finger/petal cutouts in `#D77656` anchored to viewport corners, casting gentle ambient shadows onto the grid.

### Layer 2: Floating Stage / Device Mockup
- Centered horizontally, positioned in upper-middle vertical thirds (`top: 360px`, `height: 580px - 620px`, `width: 920px`).
- Frame styling: Bezel `#FFFFFF`, radius `30px`, border `1px solid rgba(0,0,0,0.08)`.
- Physical elevation: Deep ambient occlusion drop shadow projecting downward (+40px Y offset, blur 80px) to make the device hover noticeably in front of the canvas.
- Screen contents: Crisp HTML/CSS reconstructions of developer environments (VS Code terminal, browser address bar, Claude dashboard, video generation preview).

### Layer 3: Foreground Typography & Badges
- Top Headline: Anchored above the stage (`top: 180px - 340px`), centered, line-height compact.
- Tactile Pill Badges: Enter during transitional beats, resting in the exact center of the screen (`top: 600px - 660px`) before yielding to the device stage.
- Staggered Bullet Points: Positioned directly beneath the stage (`top: 1040px - 1380px`), left-aligned with a common indentation (`padding-left: 120px` to `160px`), each item prefixed with a crisp `✦` sparkle.

### Layer 4: HUD & Safety Overlay
- Watermark `insiderforce.io` positioned at `bottom: 160px` (`y: 1720px` in 1920 space), centered horizontally, letter-spacing `0.02em`, font-weight `500`, opacity `0.35`.

---

## 4. Caption / HUD Treatment & Safe-Zone Layout (1080x1920)

```
0px ────────────────────────────────────────────────────────
     ▲
     │  TOP SAFE ZONE: 180px (Status bar, account handle, audio pill)
     ▼
180px ──────────────────────────────────────────────────────
     ▲  HEADLINE ZONE: 180px - 340px (Height ~160px)
     │  "This gives Claude full control of Any Browser"
     ▼
340px ──────────────────────────────────────────────────────
     ▲
     │  FLOATING DEVICE STAGE / 3D PROP ZONE: 360px - 980px
     │  (Tablet browser frame: 920px × 580px, centered)
     ▼
980px ──────────────────────────────────────────────────────
     ▲
     │  FEATURE BULLETS / TRIGGER ZONE: 1020px - 1420px
     │  ✦ open pages
     │  ✦ click buttons
     │  ✦ fill out forms
     ▼
1420px ─────────────────────────────────────────────────────
     ▲  KARAOKE HUD / SUBTITLE ZONE: 1440px - 1620px
     │  "without you ever leaving Your Terminal"
     ▼
1620px ─────────────────────────────────────────────────────
     ▲
     │  BOTTOM SAFE ZONE: 300px (1620px - 1920px)
     │  - Watermark at 1680px (insiderforce.io)
     │  - Clear for Reels/TikTok caption box, comment/share icons
     ▼
1920px ─────────────────────────────────────────────────────
```

### Safe-Zone Guardrails
- **Horizontal Margins:** Strict `80px` margin on left and right (content box width: `920px`).
- **Top Safe Zone (0 - 180px):** Never place essential titles or UI props here; Instagram Reels and TikTok overlay creator info, audio tags, and search icons.
- **Bottom Safe Zone (1620 - 1920px):** Keep free of primary messaging. Subtitle captions must live strictly above `1620px` (ideally `1460px - 1580px`) so they never overlap native platform description text or engagement icons (heart, comment, share, bookmark).
- **HUD Caption Treatment:**
  - Sentences are kept to 1-2 lines maximum.
  - As words are spoken, their color transitions instantly from muted `#8E8E93` (`font-weight: 500`) to high-contrast `#161616` (`font-weight: 800`).
  - No background karaoke pills or ugly translucent boxes—text floats cleanly against the studio canvas with a subtle 1px text-shadow: `0 1px 2px rgba(255,255,255,0.8)`.
