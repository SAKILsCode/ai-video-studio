# CH03 Emerald Editorial — Motion Contract (For 3.8 Flash)
1. DO NOT edit `tokens.css` or `components.css`. Use ONLY `.ee-*` classes and toggle `.ee-stage--dark` per scene.
2. Place speaker cutout, Arabic/course plates, or UI props from `assets/` inside `.ee-camera` or `.ee-avatar-ring`; never hand-code complex organic/human illustrations in SVG.
3. Use a paused GSAP timeline (`gsap.timeline({ paused: true })`), zero `Math.random()`, zero `requestAnimationFrame`.
4. Match fast phrase-by-phrase Bangla captions (~1–2.5s beats) to `timestamps.json` with `.ee-hl-gold` emphasis.
