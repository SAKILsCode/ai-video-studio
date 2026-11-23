/* ==========================================================================
   CH01: BASIC CLAUDE COPY — TYPOGRAPHY & HOOK MOTION PRESETS (Batch 2, READ-ONLY)
   Extension file: only ADDS to window.CCMotion (never replaces core entries).
   Zero Math.random(), zero requestAnimationFrame, zero infinite repeats. Seek-safe.
   Load AFTER motion-presets.js.
   ========================================================================== */
(function (global) {
  const C = global.CCMotion;
  if (!C || !C.util) {
    throw new Error('motion-presets.text.js requires motion-presets.js to be loaded first');
  }
  const util = C.util;

  const EASE_SNAPPY = 'power4.out';
  const EASE_SMOOTH = 'power3.out';
  const EASE_POP = 'back.out(1.4)';
  const EASE_EXIT = 'power2.in';

  const presets = {
    /* Cold-open hook slam: slams .cc-hook__line items in with punch, pops .cc-hook__accent.
       opts: { dur=0.45, stagger=0.14, dist, scale=1.12 } */
    hookSlam(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.45;
      const stagger = opts.stagger ?? 0.14;
      const d = util.dist(opts, 36);

      util.list(target).forEach((el) => {
        const lines = el.classList.contains('cc-hook')
          ? Array.from(el.querySelectorAll('.cc-hook__line'))
          : [el];
        const items = lines.length ? lines : [el];

        items.forEach((line, i) => {
          const t = at + i * stagger;
          tl.fromTo(
            line,
            { opacity: 0, y: d, scale: opts.scale ?? 1.12 },
            { opacity: 1, y: 0, scale: 1, duration: dur, ease: EASE_SNAPPY },
            t
          );
          const accents = line.querySelectorAll('.cc-hook__accent');
          if (accents.length) {
            tl.fromTo(
              accents,
              { scale: 0.92 },
              { scale: 1, duration: 0.34, ease: EASE_POP, immediateRender: false },
              t + dur * 0.45
            );
          }
        });
      });
      return tl;
    },

    /* Pull-quote reveal: mark pops, quote text lifts, citation follows.
       opts: { dur=0.55, gap=0.14, dist } */
    quoteReveal(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.55;
      const gap = opts.gap ?? 0.14;
      const d = util.dist(opts, 28);

      util.list(target).forEach((el) => {
        const mark = el.querySelector('.cc-quote__mark');
        const text = el.querySelector('.cc-quote__text');
        const cite = el.querySelector('.cc-quote__cite');
        let cursor = at;

        if (mark) {
          tl.fromTo(
            mark,
            { opacity: 0, scale: 0.65, y: -d * 0.4 },
            { opacity: 1, scale: 1, y: 0, duration: dur * 0.75, ease: EASE_POP },
            cursor
          );
          cursor += gap;
        }
        if (text) {
          tl.fromTo(
            text,
            { opacity: 0, y: d },
            { opacity: 1, y: 0, duration: dur, ease: EASE_SNAPPY },
            cursor
          );
          cursor += gap * 1.4;
        }
        if (cite) {
          tl.fromTo(
            cite,
            { opacity: 0, x: -d * 0.5 },
            { opacity: 1, x: 0, duration: dur * 0.75, ease: EASE_SMOOTH },
            cursor
          );
        }
        if (!mark && !text && !cite) {
          tl.fromTo(el, { opacity: 0, y: d }, { opacity: 1, y: 0, duration: dur, ease: EASE_SNAPPY }, at);
        }
      });
      return tl;
    },

    /* Lower-third entrance: container fades, accent bar draws down, name & role slide in.
       opts: { dur=0.48, dist } */
    lowerThirdIn(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.48;
      const d = util.dist(opts, 28);

      util.list(target).forEach((el) => {
        const bar = el.querySelector('.cc-lower-third__bar');
        const name = el.querySelector('.cc-lower-third__name');
        const role = el.querySelector('.cc-lower-third__role');

        tl.fromTo(
          el,
          { opacity: 0, x: -d },
          { opacity: 1, x: 0, duration: dur, ease: EASE_SNAPPY },
          at
        );
        if (bar) {
          tl.fromTo(
            bar,
            { scaleY: 0, transformOrigin: '50% 0%' },
            { scaleY: 1, transformOrigin: '50% 0%', duration: dur * 0.85, ease: EASE_SMOOTH },
            at + 0.05
          );
        }
        if (name) {
          tl.fromTo(
            name,
            { opacity: 0, x: -d * 0.6 },
            { opacity: 1, x: 0, duration: dur * 0.8, ease: EASE_SNAPPY },
            at + 0.1
          );
        }
        if (role) {
          tl.fromTo(
            role,
            { opacity: 0, x: -d * 0.5 },
            { opacity: 1, x: 0, duration: dur * 0.8, ease: EASE_SNAPPY },
            at + 0.18
          );
        }
      });
      return tl;
    },

    /* Lower-third exit (seek-safe). opts: { dur=0.35, dist } */
    lowerThirdOut(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.35;
      const d = util.dist(opts, 24);

      util.list(target).forEach((el) => {
        const bar = el.querySelector('.cc-lower-third__bar');
        if (bar) {
          tl.to(
            bar,
            { scaleY: 0, transformOrigin: '50% 100%', duration: dur * 0.7, ease: EASE_EXIT, immediateRender: false },
            at
          );
        }
        tl.to(
          el,
          { opacity: 0, x: -d, duration: dur, ease: EASE_EXIT, immediateRender: false },
          at + 0.04
        );
      });
      return tl;
    },

    /* Staggered bullet list reveal. target = .cc-bullets or .cc-bullets__item list.
       opts: { dur=0.45, stagger=0.14, dist, times } */
    bulletsStagger(tl, target, at, opts = {}) {
      const items = [];
      util.list(target).forEach((el) => {
        if (el.classList.contains('cc-bullets')) {
          items.push(...el.querySelectorAll('.cc-bullets__item'));
        } else {
          items.push(el);
        }
      });
      const dur = opts.dur ?? 0.45;
      const stagger = opts.stagger ?? 0.14;
      const d = util.dist(opts, 28);

      items.forEach((item, i) => {
        const raw = opts.times ? opts.times[i] : undefined;
        const val = raw && typeof raw === 'object' ? raw.start : raw;
        const t = typeof val === 'number' ? Math.max(0, val) : at + i * stagger;
        tl.fromTo(
          item,
          { opacity: 0, x: -d },
          { opacity: 1, x: 0, duration: dur, ease: EASE_SNAPPY },
          t
        );
      });
      return tl;
    },

    /* One .cc-caption phrase in place. Words inside (.cc-word) reveal at `times` or staggered.
       Pass `prev` to dismiss the previous overlapping phrase cleanly.
       opts: { times, byAttr=false, stagger=0.14, lead=0, dur=0.22, dist, prev, exitAt, exitDur=0.18, pop=false } */
    captionPhrase(tl, capEl, at, opts = {}) {
      const cap = util.list(capEl)[0];
      if (!cap) return tl;

      const exitDur = opts.exitDur ?? 0.18;
      if (opts.prev) {
        tl.to(
          opts.prev,
          { opacity: 0, duration: exitDur, ease: EASE_EXIT, immediateRender: false },
          Math.max(0, at - exitDur * 0.5)
        );
      }

      tl.fromTo(
        cap,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01 },
        Math.max(0, at - 0.01)
      );

      const words = Array.from(cap.querySelectorAll('.cc-word'));
      if (words.length) {
        C.revealWordsAt(tl, words, opts.times, {
          at,
          lead: opts.lead ?? 0,
          dur: opts.dur ?? 0.22,
          dist: opts.dist,
          stagger: opts.stagger ?? 0.14,
          byAttr: Boolean(opts.byAttr),
          pop: Boolean(opts.pop),
        });
      }

      if (typeof opts.exitAt === 'number') {
        tl.to(
          cap,
          { autoAlpha: 0, duration: exitDur, ease: EASE_EXIT, immediateRender: false },
          opts.exitAt
        );
      }
      return tl;
    },

    /* Marker / underline draw on .cc-highlight via CSS custom prop --draw (0..1).
       opts: { dur=0.48, stagger=0.12, ease } */
    highlightDraw(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.48;
      const stagger = opts.stagger ?? 0.12;
      util.list(target).forEach((el, i) => {
        tl.fromTo(
          el,
          { '--draw': 0 },
          { '--draw': 1, duration: dur, ease: opts.ease ?? EASE_SMOOTH },
          at + i * stagger
        );
      });
      return tl;
    },
  };

  Object.keys(presets).forEach((name) => {
    if (!(name in C)) C[name] = presets[name];
  });
})(window);