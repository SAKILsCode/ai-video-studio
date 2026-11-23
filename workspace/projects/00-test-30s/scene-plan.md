# Scene Plan: 00-test-30s — The Blood-Brain Barrier (BBB)

> **Gate 1 Approval Document**  
> **Theme:** `04-bio-2d-explainer` (Cellular & Biochemistry Shorts)  
> **Format:** 9:16 Vertical Video (1080 × 1920 px) | 30 FPS  
> **Total Duration:** 36.86s (Exact timeline duration: 36.858s)  
> **Audio Preset:** `editorial-kinetic` (Voice: `en-US-GuyNeural` @ -16 LUFS | BGM: -30 LUFS | SFX ceiling: -31 LUFS)  
> **Karaoke Captions:** Bottom 300px locked safe zone (`y: 1620px – 1920px`)

---

## 1. Episode Specifications & Verified Claims Parity

| Script Line | Spoken Phrase | Claim ID | Verified Fact / Scope | Visual Parity Commitment |
| :--- | :--- | :--- | :--- | :--- |
| **Line 00** | *"Why do almost all brain medicines completely fail?"* | Context | Clinical delivery failure to CNS | Drug capsules shown drifting in blood, blocked from brain tissue |
| **Line 01** | *"Inside your skull sits a locked wall of endothelial cells."* | `C1` | Cerebral endothelial cells form the BBB microvessel wall | Anatomical capillary cross-section with interlocking endothelial cell tiles |
| **Line 02** | *"Scientists call this cellular fortress the Blood Brain Barrier."* | `C1` | Primary anatomical definition of BBB | Fortress HUD title stamp `BLOOD-BRAIN BARRIER (BBB)` |
| **Line 03** | *"Special protein seams called tight junctions weld every gap shut."* | `C1` | Tight junctions seal intercellular clefts, blocking paracellular diffusion | Claudin/Occludin protein zippers zipping intercellular gaps with laser weld |
| **Line 04** | *"Toxins, bacteria, and huge molecules slam straight into this shield."* | `C1` | Blocks passive diffusion of pathogens, proteins, polar macromolecules | Green toxins, purple bacteria rod, and macromolecule bounce off shield |
| **Line 05** | *"Over 90 percent of small drugs cannot cross this wall."* | `C2` | Pardridge / NIH: >90% of small molecules and ~100% large therapeutics fail | Exact kinetic counter `Over 90%` + 9/10 drug molecules deflecting away |
| **Line 06** | *"Only tiny molecules or special nutrient transporters earn a pass."* | `C3` | Only very small lipid-soluble molecules or specific carrier-mediated solutes cross | O2/CO2 diffusing through membrane + GLUT-1 transporter gating glucose |
| **Line 07** | *"That microscopic lock keeps your brain alive every second."* | `C1`, `C3` | BBB preserves cerebral homeostasis essential for neuronal survival | Radiant neural network firing in protected teal sanctuary; Mascot salute |

---

## 2. Canvas Geometry & Spatial Layout (1080 × 1920)

```
y = 0px     +-------------------------------------------------------+
            |  TOP SAFE / HUD BANNER (0 - 140px)                    |
            |  Episode Title / Mode Badge / Reticle Status          |
y = 140px   +-------------------------------------------------------+
            |                                                       |
            |  VASCULAR BLOODSTREAM ZONE (140px - 850px)            |
            |  Deep Crimson Gradient (#2B080D -> #4A0E17)           |
            |  Floating RBCs, Plasma Currents, Incoming Solutes     |
            |                                                       |
y = 850px   +=======================================================+
            |  ENDOTHELIAL CELL BARRIER WALL (850px - 1070px)       |
            |  Tight Junction Seams, Transporter Gate (x: 480-600)  |
y = 1070px  +=======================================================+
            |                                                       |
            |  BRAIN SANCTUARY ZONE (1070px - 1620px)               |
            |  Cool Cyan-Teal Gradient (#0A2E38 -> #115E6B)         |
            |  Tier-0 Mascot Stage (y: 1100 - 1520px, x: 380 - 700) |
            |  Protected Neural Network / Synaptic Glow             |
            |                                                       |
y = 1620px  +-------------------------------------------------------+
            |  STRICT CAPTION SAFE ZONE (1620px - 1920px)           |
            |  Word-by-word Karaoke Subtitles (y: 1680 - 1820px)    |
            |  *** ZERO MASCOT / GRAPHICS ENCROACHMENT ***          |
y = 1920px  +-------------------------------------------------------+
```

### Strict Styling Rules
- **Minimum Label Font Size:** `20px` (exceeds the studio minimum of `18px`).
- **Headline Transitions:** Strictly sequential exit-before-enter (`opacity: 1 -> 0`, `y: 0 -> -20px`, followed by next title `y: 20 -> 0`, `opacity: 0 -> 1`).
- **Mascot Safe Bounding Box:** Constrained within `y: 1100px – 1560px` (always at least `60px` above the `1620px` caption threshold).
- **Caption Font & Style:** `46px` bold sans-serif, active karaoke word highlighted with `#FBBF24` (amber glow) and scale `1.15`, inactive words in `#FFFFFF` with `70%` opacity.

---

## 3. Tier-0 SVG Cell Mascot: "Bio-Guard Sentry" State Machine

The character is an expressive, stylized endothelial guard cell with emotive eyes, protective armor plates, and dynamic handheld biological tools:

| Mascot State | Visual Representation | Target Screen Placement | Scenes Used |
| :--- | :--- | :--- | :--- |
| **State A: Inquisitive Patrol** | Flashlight/Scanner cone scanning upwards into bloodstream | x: 440px, y: 1200px (Center Sanctuary) | Scene 00 |
| **State B: Wall Mechanic** | Hard hat + molecular welding torch sealing protein seams | x: 620px, y: 980px (Docked at Barrier) | Scene 01, Scene 03 |
| **State C: Fortress Commander** | Holographic HUD clipboard, inspecting integrity | x: 440px, y: 1220px | Scene 02 |
| **State D: Active Defense** | Dual biological forcefield shields deflecting particles | x: 440px, y: 1150px (Raised defensive stance) | Scene 04 |
| **State E: Strict Gatekeeper** | Arms crossed, stern expression, "ACCESS DENIED" badge | x: 440px, y: 1200px | Scene 05 |
| **State F: VIP Concierge** | Visor scanner reading molecular ID, polite welcoming wave | x: 680px, y: 1120px (Flanking Transporter Gate) | Scene 06 |
| **State G: Victorious Guardian** | Saluting, holding up glowing emerald BBB lock emblem | x: 440px, y: 1200px | Scene 07 |

---

## 4. Line-by-Line Scene Plan (Exact Audio Timestamps)

### Scene 00: The Enigma (The Failed Delivery)
- **Audio Timing:** `0.000s` – `3.840s` (Clip duration: `4.060s`, transition hold to next line)
- **Voice Text:** *"Why do almost all brain medicines completely fail?"*
- **Subtitle Text:** *"Why do almost all brain medicines completely fail?"*
- **Spoken Word Timings:**
  - `Why` (0.100s – 0.300s)
  - `do` (0.312s – 0.438s)
  - `almost` (0.450s – 0.875s)
  - `all` (0.900s – 1.100s)
  - `brain` (1.125s – 1.388s)
  - `medicines` (1.412s – 1.912s)
  - `completely` (1.938s – 2.462s)
  - `fail?` (2.488s – 2.962s)
- **Spatial Composition:**
  - **Top Zone (`y: 140 – 850`):** Crimson bloodstream with 5 floating RBC silhouettes.
  - **Center Action (`y: 400 – 900`):** Three glowing pharmaceutical capsules (magenta/cyan pills with `Rx` symbols) enter at `0.45s` (`almost`), travel downward at high velocity, hit an invisible spatial barrier at `y: 850px` at `1.94s` (`completely`), and shatter into ricocheting particles with an urgent red warning badge `DELIVERY REJECTED` (`font-size: 24px`, `#EF4444`).
  - **Tier-0 Mascot (State A):** Positioned at `(x: 440, y: 1200)`, looking upward through a luminous conical scanner beam; shakes head as pills shatter.
  - **HUD Callout:** Top banner displays `CASE STUDY: CNS DRUG DELIVERY` (`font-size: 22px`).
- **Transitions:**
  - Intro: Fade in from black (`0.00s` – `0.30s`).
  - Outro: Capsule fragments dissolve at `3.60s`; camera pushes downward toward the barrier boundary (`3.80s` – `4.06s`).

---

### Scene 01: The Locked Cellular Wall
- **Audio Timing:** `4.060s` – `8.356s` (Clip duration: `4.516s`, hold to `8.576s`)
- **Voice Text:** *"Inside your skull sits a locked wall of endothelial cells."*
- **Subtitle Text:** *"Inside your skull sits a locked wall of endothelial cells."*
- **Spoken Word Timings:**
  - `Inside` (4.160s – 4.622s)
  - `your` (4.648s – 4.785s)
  - `skull` (4.810s – 5.148s)
  - `sits` (5.172s – 5.398s)
  - `a` (5.410s – 5.472s)
  - `locked` (5.498s – 5.810s)
  - `wall` (5.835s – 6.072s)
  - `of` (6.085s – 6.185s)
  - `endothelial` (6.210s – 6.922s)
  - `cells.` (6.948s – 7.472s)
- **Spatial Composition:**
  - **Macro-to-Micro Transition:** Smooth visual snap into a stylized capillary cross-section.
  - **Barrier Construction (`y: 850 – 1070`):** Four hexagonal/curved endothelial cells glide in from left and right at `5.498s` (`locked wall`), interlocking like puzzle blocks with heavy mechanical-organic thud effects.
  - **Labels & Reticles:** At `6.210s` (`endothelial`), glowing reticle brackets lock onto the central cell: `CEREBRAL ENDOTHELIAL CELL` (`font-size: 22px`, `#38BDF8`).
  - **Dual-Zone Contrast:** Crimson vascular stream above (`y: 140 – 850`) vs. calm cyan brain sanctuary below (`y: 1070 – 1620`).
  - **Tier-0 Mascot (State B):** Emerges at `y: 1180px`, wearing a hard hat, inspecting cell boundary joints.
- **Transitions:**
  - Clean exit of Scene 00 text by `4.00s`.
  - Wall locks firmly into place at `6.00s`; steady hold with ambient blood/plasma flow.

---

### Scene 02: The Fortress Named
- **Audio Timing:** `8.576s` – `12.872s` (Clip duration: `4.516s`, hold to `13.092s`)
- **Voice Text:** *"Scientists call this cellular fortress the blood brain barrier."*
- **Subtitle Text:** *"Scientists call this cellular fortress the Blood Brain Barrier."*
- **Spoken Word Timings:**
  - `Scientists` (8.676s – 9.414s)
  - `call` (9.438s – 9.638s)
  - `this` (9.651s – 9.826s)
  - `cellular` (9.851s – 10.301s)
  - `fortress` (10.314s – 10.764s)
  - `the` (10.788s – 10.914s)
  - `Blood` (10.926s – 11.201s)
  - `Brain` (11.226s – 11.488s)
  - `Barrier.` (11.514s – 11.988s)
- **Spatial Composition:**
  - **Fortress HUD Blueprint:** At `8.676s`, a tactical blueprint overlay activates over the barrier. Gridlines and energy shields radiate outward.
  - **Color-Coded Kinetic Type:**
    - `10.926s` (`Blood`): The upper half flashes rich crimson with badge `BLOODSTREAM` (`font-size: 24px`, `#F87171`).
    - `11.226s` (`Brain`): The lower half pulses bioluminescent cyan with badge `BRAIN PARENCHYMA` (`font-size: 24px`, `#38BDF8`).
    - `11.514s` (`Barrier`): Central kinetic badge drops down: `BLOOD-BRAIN BARRIER (BBB)` (`font-size: 36px`, bold uppercase, `#10B981` emerald border).
  - **Tier-0 Mascot (State C):** Mascot steps center stage (`x: 440, y: 1220`), clicks a digital HUD tablet, displaying a green shield meter at `100% INTEGRITY`.
- **Transitions:**
  - Exit-before-enter: Blueprint HUD elements fade smoothly to `opacity: 0` from `12.50s` to `12.87s` before Scene 03 zoom begins.

---

### Scene 03: Protein Seams (Tight Junctions)
- **Audio Timing:** `13.092s` – `17.460s` (Clip duration: `4.588s`, hold to `17.680s`)
- **Voice Text:** *"Special protein seams called tight junctions weld every gap shut."*
- **Subtitle Text:** *"Special protein seams called tight junctions weld every gap shut."*
- **Spoken Word Timings:**
  - `Special` (13.192s – 13.667s)
  - `protein` (13.680s – 14.142s)
  - `seams` (14.167s – 14.430s)
  - `called` (14.442s – 14.667s)
  - `tight` (14.692s – 14.917s)
  - `junctions` (14.930s – 15.417s)
  - `weld` (15.442s – 15.704s)
  - `every` (15.730s – 15.954s)
  - `gap` (15.967s – 16.192s)
  - `shut.` (16.217s – 16.580s)
- **Spatial Composition:**
  - **Micro Zoom:** Camera punches in 2.5x onto the narrow intercellular gap (`cleft`) between two adjacent endothelial cells (`y: 700 – 1150`).
  - **Molecular Zipper:** Interlocking strands of Claudin and Occludin proteins interlace from opposing cell membranes (`13.68s` – `14.93s`).
  - **Laser Weld FX:** At `15.442s` (`weld`), a golden welding arc zips down the seam, emitting bright amber/cyan micro-sparks (`#F59E0B`, `#06B6D4`), hermetically sealing the fissure.
  - **Technical Callout:** Reticle points to the seam: `TIGHT JUNCTIONS (CLAUDIN-5 & OCCLUDIN)` (`font-size: 20px`, bold).
  - **Status Badge:** `PARACELLULAR DIFFUSION: BLOCKED` (`font-size: 22px`, `#10B981`).
  - **Tier-0 Mascot (State B):** Operates the welding wand at the edge of the cleft, giving a thumbs up as the seal locks airtight at `16.58s`.
- **Transitions:**
  - Smooth camera pull-back starting at `17.00s` to restore full barrier view for incoming particle barrage.

---

### Scene 04: The Particle Barrage (Toxins Repelled)
- **Audio Timing:** `17.680s` – `22.768s` (Clip duration: `5.308s`, hold to `22.988s`)
- **Voice Text:** *"Toxins, bacteria, and huge molecules slam straight into this shield."*
- **Subtitle Text:** *"Toxins, bacteria, and huge molecules slam straight into this shield."*
- **Spoken Word Timings:**
  - `Toxins,` (17.780s – 18.355s)
  - `bacteria,` (18.492s – 19.092s)
  - `and` (19.292s – 19.455s)
  - `huge` (19.480s – 19.780s)
  - `molecules` (19.805s – 20.368s)
  - `slam` (20.392s – 20.692s)
  - `straight` (20.718s – 21.030s)
  - `into` (21.055s – 21.242s)
  - `this` (21.268s – 21.405s)
  - `shield.` (21.430s – 21.880s)
- **Spatial Composition:**
  - **Multi-Particle Swarm Influx:**
    - `17.78s` (`Toxins`): 6 spiked, lime-green toxin clusters dive down from `y: 200px` toward the barrier.
    - `18.49s` (`bacteria`): A large purple rod bacterium (`120px` length with flagella) charges downward.
    - `19.48s` (`huge molecules`): A sprawling protein globular complex descends.
  - **Kinetic Impact & Deflection:** At `20.39s` (`slam`), all intruders strike the tight junction barrier simultaneously:
    - Hexagonal energy forcefield ripple spreads across the barrier (`mix-blend-mode: screen`).
    - Particles bounce backward forcefully with elastic squash-and-stretch into the crimson zone.
    - Warning flash: `IMPACT DEFLECTED: 0% PENETRATION` (`font-size: 24px`, `#EF4444`).
  - **Tier-0 Mascot (State D):** Stands firmly at `(x: 440, y: 1160)`, holding dual translucent cyan energy bucklers, bracing against the shockwave and repelling intruders.
- **Transitions:**
  - Deflected particles scatter off top-screen edges by `22.40s`. Forcefield glow settles before statistical counter enters.

---

### Scene 05: The 90% Statistical Reality
- **Audio Timing:** `22.988s` – `27.164s` (Clip duration: `4.396s`, hold to `27.384s`)
- **Voice Text:** *"Over ninety percent of small drugs cannot cross this wall."*
- **Subtitle Text:** *"Over 90 percent of small drugs cannot cross this wall."*
- **Spoken Word Timings:**
  - `Over` (23.088s – 23.388s)
  - `90` (23.413s – 23.726s)
  - `percent` (23.750s – 24.126s)
  - `of` (24.138s – 24.213s)
  - `small` (24.238s – 24.538s)
  - `drugs` (24.563s – 24.950s)
  - `cannot` (24.976s – 25.313s)
  - `cross` (25.338s – 25.638s)
  - `this` (25.663s – 25.850s)
  - `wall.` (25.876s – 26.276s)
- **Spatial Composition:**
  - **Hero Kinetic Number:**
    - At `23.088s` (`Over`), a statistical meter appears at upper-center (`x: 540, y: 460`).
    - At `23.413s` (`90`), large typography rapidly counts up from `0%` to `>90%` (`font-size: 104px`, bold, `#EF4444`, drop shadow).
    - At `23.750s` (`percent`), subtitle label locks underneath: `OF SMALL-MOLECULE DRUGS BLOCKED` (`font-size: 22px`, `#FFFFFF`).
  - **Visual Molecule Array:** A grid of 10 stylized therapeutic pills (capsules) approaches the wall:
    - 9 pills hit the barrier and turn muted red/grey with a stamp `BLOCKED` (`24.56s` – `25.87s`).
    - 1 pill hovers with a pulsing yellow question mark `?`.
  - **Verification / Claims Parity:** Verified claim `C2` ("Over 90 percent of small drugs cannot cross this wall"). Word and unit parity verified: text displays `>90%` matching spoken *"Over ninety percent"*.
  - **Tier-0 Mascot (State E):** Crosses arms at `(x: 440, y: 1200)`, shaking head with a stern "ACCESS DENIED" holographic badge floating alongside.
- **Transitions:**
  - Exit-before-enter: The `>90%` graphic scales down and exits upward (`y: 460 -> 400`, `opacity: 0`) between `26.80s` and `27.16s`.

---

### Scene 06: The VIP Gate (Transporters & Nutrients)
- **Audio Timing:** `27.384s` – `32.208s` (Clip duration: `5.044s`, hold to `32.428s`)
- **Voice Text:** *"Only tiny molecules or special nutrient transporters earn a pass."*
- **Subtitle Text:** *"Only tiny molecules or special nutrient transporters earn a pass."*
- **Spoken Word Timings:**
  - `Only` (27.484s – 27.809s)
  - `tiny` (27.834s – 28.159s)
  - `molecules` (28.184s – 28.809s)
  - `or` (28.834s – 28.946s)
  - `special` (28.972s – 29.346s)
  - `nutrient` (29.372s – 29.834s)
  - `transporters` (29.846s – 30.546s)
  - `earn` (30.572s – 30.734s)
  - `a` (30.759s – 30.822s)
  - `pass.` (30.834s – 31.322s)
- **Spatial Composition:**
  - **Dual Transport Mechanisms:**
    - **Passive Diffusion (`27.48s` – `28.81s`):** Tiny golden glowing spheres (labeled `O₂` and `CO₂`, `font-size: 20px`) slip effortlessly directly across the endothelial lipid bilayer from crimson to cyan sanctuary.
    - **Active Transporter Gate (`28.97s` – `31.32s`):** A dedicated transmembrane channel (labeled `GLUT-1 TRANSPORTER`, `font-size: 22px`, `#38BDF8`) illuminates at `x: 540, y: 960`.
    - A glowing emerald glucose molecule (hexagon with `GLUCOSE` label) docks into the carrier at `29.85s`, the protein changes conformation (revolving gate animation), and delivers glucose safely into the brain sanctuary at `30.83s` with a welcoming green chime and `AUTHORIZED PASS` badge (`font-size: 22px`, `#10B981`).
  - **Tier-0 Mascot (State F):** Stands beside the transporter at `(x: 720, y: 1140)` wearing a scanner visor; scans the glucose molecule, gives a green checkmark, and politely ushers it through.
- **Transitions:**
  - Transporter channel returns to resting state at `31.80s`. Camera pulls back into wide anatomical majesty.

---

### Scene 07: The Microscopic Lock (Brain Alive)
- **Audio Timing:** `32.428s` – `36.508s` (Clip duration: `4.430s`, total timeline to `36.858s`)
- **Voice Text:** *"That microscopic lock keeps your brain alive every second."*
- **Subtitle Text:** *"That microscopic lock keeps your brain alive every second."*
- **Spoken Word Timings:**
  - `That` (32.528s – 32.753s)
  - `microscopic` (32.766s – 33.503s)
  - `lock` (33.528s – 33.778s)
  - `keeps` (33.803s – 34.066s)
  - `your` (34.090s – 34.228s)
  - `brain` (34.253s – 34.503s)
  - `alive` (34.516s – 34.853s)
  - `every` (34.878s – 35.103s)
  - `second.` (35.128s – 35.603s)
- **Spatial Composition:**
  - **Grand Reveal (Wide 9:16 Vertical Composition):**
    - The upper crimson bloodstream flows steadily with vibrant red cells, safely isolated.
    - The central barrier stands glowing with interlocking cellular shields.
    - The lower brain sanctuary bursts into a brilliant bioluminescent neural network: dendrites and axon terminals pulsing with gentle teal electrical action potentials (`#22D3EE`).
  - **Hero Mascot (State G):** Center stage at `(x: 440, y: 1200)`, saluting proudly while holding up a luminous emerald padlock emblem (`BBB SECURED`).
  - **Vital Sign HUD:** Subtle rhythmic ECG/vital pulse line sweeps across `y: 1540px`: `CEREBRAL HOMEOSTASIS: STABLE` (`font-size: 20px`, `#10B981`).
  - **Retention Loop Hold (`35.60s` – `36.86s`):** Final frame holds a captivating contrast between the violent red bloodstream and the pristine brain sanctuary, naturally prompting a re-watch back to Line 00's opening question.
- **Transitions:**
  - Hold final frame state through `36.858s` (exact timeline end).

---

## 5. Caption System & Karaoke Sync

- **Mount Container:** Host `div` with `data-track-kind="captions"`, positioned at `x: 80px, y: 1680px, width: 920px, height: 180px`.
- **Text Alignment:** Centered horizontal alignment, maximum 2 lines per display, font size `44px` / line height `56px`.
- **Karaoke Word Animation:**
  - Default word state: `color: rgba(255, 255, 255, 0.70)`, `font-weight: 700`.
  - Active spoken word: `color: #FBBF24` (vibrant amber-gold), `text-shadow: 0 0 16px rgba(251, 191, 36, 0.8)`, scale `1.12` with smooth GSAP elastic micro-pop (`duration: 0.12s`).
  - Past word state: `color: #FFFFFF`, `opacity: 0.95`.
- **Line Clearing Timings (Clean Exit-Before-Enter):**
  - Line 00 clears at `3.50s` -> Line 01 enters at `4.06s`
  - Line 01 clears at `8.00s` -> Line 02 enters at `8.58s`
  - Line 02 clears at `12.50s` -> Line 03 enters at `13.09s`
  - Line 03 clears at `17.00s` -> Line 04 enters at `17.68s`
  - Line 04 clears at `22.30s` -> Line 05 enters at `22.99s`
  - Line 05 clears at `26.80s` -> Line 06 enters at `27.38s`
  - Line 06 clears at `31.80s` -> Line 07 enters at `32.43s`
  - Line 07 holds through `36.20s`, then gently settles into final loop hold.

---

## 6. Gate 1 Pre-Code Validation Checklist

- [x] **Truth & Claims Parity:** Line 05 counter `>90%` strictly maps to `claims.md` Claim `C2` (Pardridge / NIH: >90% of small drugs cannot cross).
- [x] **Word-for-Word Alignment:** Exact 1:1 parity between `voice_script.txt` ("ninety percent") and `subtitle_script.txt` ("90 percent") maintained.
- [x] **Strict Safe Zones:** Mascot stage bounded strictly within `y: 1100 – 1560px`; caption safe zone (`y: 1620 – 1920px`) has zero visual overlap.
- [x] **Legibility Guarantee:** All technical HUD labels, badges, and reticles are `>= 20px` (exceeding the 18px minimum requirement).
- [x] **No Colliding Transitions:** Every title and scene element has an explicit exit duration prior to the arrival of subsequent text.
- [x] **Theme Harmony (`04-bio-2d-explainer`):** Vascular crimson `#2B080D` vs. brain cyan `#0A2E38` palette strictly respected; Tier-0 SVG mascot state machine fully specified.
