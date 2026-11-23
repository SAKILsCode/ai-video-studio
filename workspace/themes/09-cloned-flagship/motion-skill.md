# motion-skill.md — 09 Cloned Flagship (Tactile Minimal Tech / InsiderForce Style)

Motion engineering grammar reverse-engineered from 78 reference frames (`references/frames/frame_001.png` to `frame_078.png`). This document establishes the exact choreography, camera kinematics, easing curves, stagger rhythms, and registry block standards for producing high-retention short-form tech videos in this style.

---

## 1. Camera Behavior & Kinematics

### Continuous Ambient Drift (Anti-Dead-Frame Engine)
- **Continuous Camera Push-In:** Never allow a frame to sit completely stationary. Across every 3 to 5 second scene, apply a subtle, constant camera push-in:
  - `scale: 1.000` -> `1.035` over scene duration.
  - Easing: `none` or `power1.inOut` (smooth, constant linear drift).
  - This simulates physical high-end studio cinematography and maintains viewer subconscious retention.

### Rack Zooms & Focal Punch-Ins
- **Context-to-Detail Transition:** When narrative shifts from high-level tool introduction ("This gives Claude full control of Any Browser") to specific execution details (clicking buttons, filling forms), perform a snappy punch-in:
  - Camera scales `1.00` -> `1.18` focused on the device stage center.
  - Duration: `0.45s` using `power2.out`.
  - The device frame remains grounded while internal UI elements expand cleanly into the viewer's field of view.

### Impact Shakes & Micro-Thuds
- **Tactile Badge Drop Slam:** On the exact frame an MCP tactile pill slams onto the canvas:
  - Duration: `0.15s`.
  - Displacement: `y: -4px -> +3px -> -2px -> 0px` (damped vertical contact bounce).
  - Subtle micro-camera shake: `camera-shake` component with intensity `0.2` and duration `0.18s`.
  - Gives physical tactile weight to the 3D clay pill badge, communicating material mass.

---

## 2. Easing Curves, Stagger Timings & Beat Cadence

### Easing Curve Specifications
- **Tactile Card & Badge Arrivals:**
  ```javascript
  gsap.fromTo(badge, 
    { scale: 0.82, opacity: 0, y: 30 },
    { scale: 1.00, opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.5)" }
  );
  ```
  *(Notice: `back.out(1.5)` produces a precise, crisp physical overshoot without bouncy cartoon oscillations).*

- **Device Stage Entrance:**
  ```javascript
  gsap.fromTo(deviceStage,
    { scale: 0.90, opacity: 0, y: 60 },
    { scale: 1.00, opacity: 1, y: 0, duration: 0.70, ease: "power3.out" }
  );
  ```

- **Feature Bullet Pops (`✦`):**
  ```javascript
  gsap.fromTo(bulletItem,
    { scale: 0.85, opacity: 0, x: -20 },
    { scale: 1.00, opacity: 1, x: 0, duration: 0.40, ease: "back.out(1.7)" }
  );
  ```

- **Exit Transitions (Strict Exit-Before-Enter):**
  ```javascript
  gsap.to(outgoingElement, {
    scale: 0.94,
    opacity: 0,
    y: -20,
    duration: 0.28,
    ease: "power2.in"
  });
  ```

### Stagger Timings
- **Staggered Feature Bullets:** Stagger delay of `0.28s - 0.35s` between consecutive bullet lines (`✦ open pages`, `✦ click buttons`, `✦ fill out forms`). Each item is tied strictly to the narration audio beat when that specific capability is named.
- **Word-Level Kinetic Type:** In section titles, words stagger in at `0.08s` intervals with `power3.out` and `letter-spacing: -0.04em`.
- **Dynamic Word Karaoke Highlight:** Active spoken words dynamically switch from `color: #8E8E93; font-weight: 500;` to `color: #161616; font-weight: 800;` in `0.06s` without layout shift.

### Scene Beat Cadence (30-Second Structural Rhythm)
1. **The Dual Hook (0:00 - 0:03, ~3s):**
   - *Beat 1 (0:00 - 0:01.2):* "if you use Claude Code" with terracotta floral props and dark prompt card.
   - *Beat 2 (0:01.2 - 0:03.0):* "these are the 5 MCP Servers you need right now" — massive bold typography with black inverted emphasis pill.
2. **Modular Tool Spotlights (0:03 - 0:22, ~3.8s per tool):**
   - *Sub-beat A (0.6s):* Section switch ("First is", "Second is") + Tactile 3D MCP pill badge impact slam.
   - *Sub-beat B (1.0s):* Device stage enters; high-level capability statement locks in.
   - *Sub-beat C (2.2s):* Staggered `✦` feature bullets pop in sync with spoken examples.
3. **The Payoff / Value Synthesis (0:22 - 0:25, ~3s):**
   - "You just found 5 tools that most Claude Code Users do not even know exist."
   - Clean, rapid text cards focusing viewer retention.
4. **The High-Converting Outro CTA (0:25 - 0:30, ~5s):**
   - *Beat 1 (0:25 - 0:27.5):* Comment "HUMAN" + Isometric 3D ebook mockup drops onto the stage.
   - *Beat 2 (0:27.5 - 0:30.0):* "make sure you Follow InsiderForce" + 3D crowned logo badge locks into center grid.

---

## 3. Explicit Ban on Crude Organic SVG Clipart

> [!CAUTION]
> **Zero Crude Hand-Coded Organic SVG Clipart Policy:**
> Hand-coded SVG wobbly arrows, cartoon stickmen, jagged doodles, smiley faces, and hallucinated AI vector paths are STRICTLY BANNED in this theme. Such assets destroy the premium, multi-million-dollar SaaS credibility demonstrated in the flagship frames.

### Mandated Visual Implementation Rules:
1. **Reconstruct All UIs in Native HTML/CSS:**
   - Terminals, VS Code windows, browser address bars, metric cards, and dashboard widgets must be built with standard HTML flexbox/grid, CSS border-radius, clean monospace fonts, and authentic syntax colors.
2. **Swiss Typography as the Primary Graphic:**
   - Rely on high-contrast font weights (`900` Black vs `400` Regular), inverted pill badges, and letter-spacing (`-0.035em`) to create graphic interest.
3. **Use 3D Ceramic/Clay Elements & Device Stages:**
   - 3D physical props (coins with embossed logos, tablet mockups with ambient occlusion shadows) provide tangible physical depth without cartoon vector clutter.

---

## 4. HyperFrames Registry Mapping (100% Free & Local)

Use these specific components and blocks installed from `hyperframes-registry` to replicate the flagship look:

### Overlays, Textures & Grids
- **`grain-overlay`** *(Component)*: Animated CSS film grain overlay. Set opacity to `2.5%` with `mix-blend-mode: multiply` on the `#F2F2F2` canvas to add tactile analog warmth.
- **`grain-field`** *(Component)*: Subtle drifting dot field for ambient texture in bookend scenes.
- **`dynamic-grid`** *(Component)*: Technical coordinate grid with intersection dots matching the exact dashed grid in frames 001-005 and 075-078.
- **`editorial-flash-overlay`** *(Block)*: Single-frame subtle white illumination flash for high-impact scene transitions (e.g. hook to tool 1).

### Stages, Devices & Surface Props
- **`browser-device-stage`** *(Component)*: The primary floating browser/tablet chassis used across Tools 1 through 5. Provides bezel, address bar, screen slot, and multi-tier drop shadow.
- **`device-frame-stage`** *(Component)*: Alternative physical tablet prop with slot for responsive HTML terminal/code reconstructions.
- **`tilt-card`** *(Component)*: Used for the physical 3D ebook and tactile card surfaces with subtle responsive 3D perspective rotation.

### Camera Movements & Transitions
- **`camera-shake`** *(Component)*: Micro-impact camera impulse triggered on tactile MCP pill badge slam.
- **`yt-camera-move`** / **`cinematic-zoom`** *(Block/Component)*: Smooth camera punch-ins from wide device overview to code detail crops.
- **`ui-focus-zoom`** *(Component)*: Focused camera push directly toward active terminal commands or clicked browser buttons.
- **`camera-rig-depth-stack`** *(Component)*: Multi-plane z-axis parallax choreography separating backdrop grid, floating device stage, and foreground typography.

### Kinetic Typography, Badges & Micro-Interactions
- **`badge-pop`** *(Component)*: Tactile pill badge pop-in with spring overshoot for the "PERPLEXITY MCP", "PLAYWRIGHT MCP", etc., badges.
- **`micro-transitions`** *(Component)*: Clean micro-interactions for button click ripples, toggle state switches, and drop-in pills.
- **`text-stagger`** *(Component)*: Word-by-word reveal for primary headlines and bullet point entries.
- **`caption-kinetic-slam`** *(Component)*: High-impact single-word / phrase transitions for the hook and outro CTA words ("HUMAN", "FOLLOWERS").
- **`light-sweep-pass`** *(Component)*: Traveling diagonal specular light streak across the surface of the floating tablet stage to emphasize premium glass quality.

---

## 5. Video -> Lesson -> Skill Compounding Log

- **[Lesson 01 - Frame Inspection]:** Flagship aesthetic derives power from extreme font weight juxtaposition (`900` vs `400`), tight letter spacing (`-0.035em`), and tactile clay elevation on a warm `#F2F2F2` canvas. Never use pure `#FFFFFF` background or crude SVG drawings.
- **[Lesson 02 - Spatial Budgeting]:** 9:16 layout must strictly partition vertical space into 5 zones (Top Safe Zone -> Headline -> Floating Device Stage -> Staggered ✦ Bullets -> Karaoke HUD -> Bottom Safe Zone) to ensure 100% legibility above platform UI.
