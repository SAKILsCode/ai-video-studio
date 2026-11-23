# CH02 Tech Explainer — Motion-Only Contract (For 3.8 Flash)

## RULES
1. DO NOT edit `tokens.css` or `components.css`. Use ONLY `.tx-*` classes (add `.tx-stage--16x9` for 16:9 and `.tx-stage--bn` for Bangla).
2. NEVER add mascots or hand-coded organic clipart SVG. Use `.tx-plate-media` for provided images/Flow/Veo clips and crisp structured HUD blocks (`.tx-card`, `.tx-lines`, `.tx-states`, `.tx-stat-row`).
3. Build plain HTML + paused GSAP timeline (`gsap.timeline({ paused: true })`), zero `Math.random()`, zero `requestAnimationFrame`.
4. Every scene needs: `expo.out` entrance (0.12s after cut), slow continuous `.tx-camera` motion, clean exit-before-enter on text/cards, and `.tx-word--active` synced to `timestamps.json`.
5. Keep `.tx-vignette` and `.tx-grain` as the top two layers.
