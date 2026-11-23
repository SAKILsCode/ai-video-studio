# motion-skill.md — 04 Bio 2D Explainer

## Motion Rules
- Use state-shifting Tier-0 SVG cell mascots (e.g., patrol/flashlight state -> alert state -> attack state) driven by GSAP.
- Reusable blocks: `cell-barrier-split` (epithelial wall with animated crack/breach), antibody/ligand particle swarms, `reticle-photo-card` (1 real microscopy/anatomy photo grounded with a scanner HUD).
- Run `npx hyperframes check` on every frame to guarantee zero text clipping or mascot/subtitle overlap.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Enforced strict top-banner and bottom-caption safe zones to prevent rotated barrier text clipping and mascot head overlap.
