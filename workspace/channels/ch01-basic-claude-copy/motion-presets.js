/* ==========================================================================
   CH01: BASIC CLAUDE COPY — DETERMINISTIC GSAP MOTION PRESETS (READ-ONLY)
   Zero Math.random(), zero requestAnimationFrame. 100% HyperFrames safe.
   ========================================================================== */
(function (global) {
  const EASE_SNAPPY = 'power4.out';
  const EASE_POP = 'back.out(1.25)';
  const EASE_SMOOTH = 'power3.inOut';

  const CCMotion = {
    /* Tactile card entrance with subtle physical tilt settle */
    enterCard(tl, target, at, tiltDeg = -2.2) {
      return tl.fromTo(
        target,
        { opacity: 0, y: 48, scale: 0.92, rotation: tiltDeg },
        { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.55, ease: EASE_POP },
        at
      );
    },

    /* Warm gold connector bridge sweep across paired cards */
    sweepBridge(tl, target, at) {
      return tl.fromTo(
        target,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.48, ease: EASE_SNAPPY },
        at
      );
    },

    /* Smooth matrix or milestone tile cascade */
    cascadeTiles(tl, targets, at, stagger = 0.032) {
      return tl.fromTo(
        targets,
        { opacity: 0, scale: 0.72, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.34, stagger, ease: EASE_POP },
        at
      );
    },

    /* Signature gold-rimmed circular iris wipe (Light Paper -> Dark Emerald) */
    irisTransition(tl, irisEl, at, onPeak) {
      tl.fromTo(
        irisEl,
        { scale: 0, opacity: 1 },
        { scale: 1.15, duration: 0.58, ease: EASE_SMOOTH },
        at
      );
      if (typeof onPeak === 'function') {
        tl.call(onPeak, null, at + 0.48);
      }
      tl.to(irisEl, { opacity: 0, duration: 0.22, ease: 'power2.out' }, at + 0.54);
      return tl;
    },

    /* Clean breakdown rows sliding in with zero overlap */
    staggerRows(tl, targets, at, stagger = 0.14) {
      return tl.fromTo(
        targets,
        { opacity: 0, x: 42 },
        { opacity: 1, x: 0, duration: 0.44, stagger, ease: EASE_SNAPPY },
        at
      );
    },

    /* Crimson strikethrough draw across old price + new price pop */
    strikePrice(tl, strikeEl, newPriceEl, at) {
      tl.fromTo(
        strikeEl,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.36, ease: EASE_SNAPPY },
        at
      );
      if (newPriceEl) {
        tl.fromTo(
          newPriceEl,
          { opacity: 0, y: 24, scale: 0.86 },
          { opacity: 1, y: 0, scale: 1, duration: 0.46, ease: EASE_POP },
          at + 0.22
        );
      }
      return tl;
    },

    /* Editorial word-by-word caption reveal */
    revealWords(tl, wordEls, at, stagger = 0.14) {
      return tl.fromTo(
        wordEls,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.34, stagger, ease: EASE_SNAPPY },
        at
      );
    },

    /* Subtle continuous camera drift so no frame is ever dead static */
    cameraDrift(tl, cameraEl, at, duration, fromScale = 1.0, toScale = 1.035) {
      return tl.fromTo(
        cameraEl,
        { scale: fromScale },
        { scale: toScale, duration, ease: 'none' },
        at
      );
    },

    /* Deterministic 5-bar speaker waveform loop (no Math.random) */
    pulseWaveform(tl, barEls, duration = 6) {
      const heights = [0.65, 1.85, 2.5, 1.4, 0.85];
      barEls.forEach((bar, i) => {
        tl.to(
          bar,
          {
            scaleY: heights[i % heights.length],
            duration: 0.26 + i * 0.04,
            repeat: Math.floor(duration / (0.26 + i * 0.04)),
            yoyo: true,
            ease: 'sine.inOut',
          },
          0
        );
      });
      return tl;
    },
  };

  global.CCMotion = CCMotion;
})(window);
