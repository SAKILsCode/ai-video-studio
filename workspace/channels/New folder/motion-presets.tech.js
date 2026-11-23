/* ==========================================================================
   CH01: BASIC CLAUDE COPY — TECH / PRODUCT UI MOTION PRESETS (READ-ONLY)
   Extension file: only ADDS to window.CCMotion (never replaces core entries).
   Zero Math.random(), zero requestAnimationFrame, zero infinite repeats. Seek-safe.
   Load AFTER motion-presets.js.
   ========================================================================== */
(function (global) {
  const C = global.CCMotion;
  if (!C || !C.util) {
    throw new Error('motion-presets.tech.js requires motion-presets.js to be loaded first');
  }
  const util = C.util;

  const EASE_SNAPPY = 'power4.out';
  const EASE_POP = 'back.out(1.25)';
  const EASE_EXIT = 'power2.in';

  const within = (el, sel) => Array.from(el.querySelectorAll(sel));
  const startOf = (raw) => (raw && typeof raw === 'object' ? raw.start : raw);
  const LINE_SEL = '.cc-term__line, .cc-code__line, .cc-diff__line';

  const presets = {
    /* Window/browser/device entrance. opts: { dur=0.6, dist, from=0.94 } */
    windowEnter(tl, target, at, opts = {}) {
      return tl.fromTo(
        target,
        { opacity: 0, y: util.dist(opts, 56), scale: opts.from ?? 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: opts.dur ?? 0.6, ease: EASE_SNAPPY },
        at
      );
    },

    /* Type a command into a .cc-term__typed span (monospace, steps per character).
       opts: { cps=22, dur } */
    typeCommand(tl, target, at, opts = {}) {
      util.list(target).forEach((el) => {
        const n = Math.max(1, Array.from(el.textContent).length);
        const dur = opts.dur ?? n / (opts.cps ?? 22);
        tl.fromTo(
          el,
          { width: '0ch' },
          { width: n + 'ch', duration: dur, ease: 'steps(' + n + ')' },
          at
        );
      });
      return tl;
    },

    /* Output lines appear one by one. target = line els OR a .cc-term/.cc-term__body/.cc-code/.cc-diff.
       opts: { stagger=0.18, dur=0.16, dist, lead=0, skip=0, times (seconds or [{start}] per line) } */
    appendLines(tl, target, at, opts = {}) {
      let lines = [];
      util.list(target).forEach((el) => {
        if (el.matches('.cc-term, .cc-term__body, .cc-code, .cc-code__body, .cc-diff')) {
          lines.push(...within(el, LINE_SEL));
        } else {
          lines.push(el);
        }
      });
      lines = lines.slice(opts.skip ?? 0);
      const stagger = opts.stagger ?? 0.18;
      const d = util.dist(opts, 10);
      lines.forEach((line, i) => {
        const raw = opts.times ? startOf(opts.times[i]) : undefined;
        const t = typeof raw === 'number' ? raw + (opts.lead ?? 0) : at + i * stagger;
        tl.fromTo(
          line,
          { opacity: 0, y: d },
          { opacity: 1, y: 0, duration: opts.dur ?? 0.16, ease: EASE_SNAPPY },
          Math.max(0, t)
        );
      });
      return tl;
    },

    /* Finite blink using tl.set steps (no infinite repeat).
       opts: { dur=2, half=0.5 (seconds on/off), end='on'|'off' } */
    cursorBlink(tl, target, at, opts = {}) {
      const half = opts.half ?? 0.5;
      const count = Math.max(1, Math.floor((opts.dur ?? 2) / half));
      for (let i = 0; i < count; i += 1) {
        tl.set(target, { opacity: i % 2 === 0 ? 1 : 0 }, at + i * half);
      }
      tl.set(target, { opacity: opts.end === 'off' ? 0 : 1 }, at + count * half);
      return tl;
    },

    /* Diff lines enter in order; added/removed lines pulse their tint (--flash).
       target = .cc-diff or line els. opts: { stagger=0.1, dist, peak=0.42 } */
    diffHighlight(tl, target, at, opts = {}) {
      const lines = [];
      util.list(target).forEach((el) => {
        if (el.classList.contains('cc-diff')) lines.push(...within(el, '.cc-diff__line'));
        else lines.push(el);
      });
      const stagger = opts.stagger ?? 0.1;
      const d = util.dist(opts, 14);
      lines.forEach((line, i) => {
        const t = at + i * stagger;
        tl.fromTo(line, { opacity: 0, x: -d }, { opacity: 1, x: 0, duration: 0.3, ease: EASE_SNAPPY }, t);
        if (line.matches('.cc-diff__line--add, .cc-diff__line--del')) {
          tl.fromTo(
            line,
            { '--flash': 0.14 },
            { '--flash': opts.peak ?? 0.42, duration: 0.24, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false },
            t + 0.3
          );
        }
      });
      return tl;
    },

    /* Press one or several keycaps (combo: keys press together with a small stagger).
       opts: { dur=0.12, hold=0.1, stagger=0.06 } */
    keycapPress(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.12;
      const hold = opts.hold ?? 0.1;
      util.list(target).forEach((key, i) => {
        const t = at + i * (opts.stagger ?? 0.06);
        tl.fromTo(key, { '--press': 0 }, { '--press': 1, duration: dur, ease: 'power2.out', immediateRender: false }, t);
        tl.to(key, { '--press': 0, duration: dur * 1.6, ease: 'power2.out', immediateRender: false }, t + dur + hold);
      });
      return tl;
    },

    /* Chat bubble pops from its own side (user = right, ai = left).
       opts: { dur=0.42, dist, stagger=0.2 } */
    bubbleIn(tl, target, at, opts = {}) {
      const d = util.dist(opts, 28);
      util.list(target).forEach((el, i) => {
        const right = el.classList.contains('cc-chat__bubble--user');
        const origin = right ? '100% 100%' : '0% 100%';
        tl.fromTo(
          el,
          { opacity: 0, y: d, scale: 0.88, transformOrigin: origin },
          { opacity: 1, y: 0, scale: 1, transformOrigin: origin, duration: opts.dur ?? 0.42, ease: EASE_POP },
          at + i * (opts.stagger ?? 0.2)
        );
      });
      return tl;
    },

    /* Typing indicator (3 child dots) bounces for a finite number of cycles, then fades out.
       opts: { dur=1.2, period=0.45, dist, hide=true } */
    typingDots(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 1.2;
      const period = opts.period ?? 0.45;
      const cycles = Math.max(1, Math.round(dur / period));
      const rise = util.dist(opts, 10);
      util.list(target).forEach((el) => {
        tl.fromTo(el, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: 0.22, ease: EASE_SNAPPY }, at);
        Array.from(el.children).forEach((dot, i) => {
          tl.fromTo(
            dot,
            { y: 0, opacity: 0.4 },
            { y: -rise, opacity: 1, duration: period / 2, yoyo: true, repeat: cycles * 2 - 1, ease: 'sine.inOut' },
            at + 0.1 + (i * period) / 3
          );
        });
        if (opts.hide !== false) {
          tl.to(el, { opacity: 0, duration: 0.2, ease: EASE_EXIT, immediateRender: false }, at + dur + 0.25);
        }
      });
      return tl;
    },

    /* Tool-call chip pops in; optional doneAt (seconds) turns its dot warn -> ok.
       opts: { dur=0.4, dist, doneAt } */
    toolCallPop(tl, target, at, opts = {}) {
      const d = util.dist(opts, 24);
      tl.fromTo(
        target,
        { opacity: 0, scale: 0.8, x: -d * 0.5, transformOrigin: '0% 50%' },
        { opacity: 1, scale: 1, x: 0, transformOrigin: '0% 50%', duration: opts.dur ?? 0.4, ease: EASE_POP },
        at
      );
      if (typeof opts.doneAt === 'number') {
        tl.fromTo(
          target,
          { '--done': 0 },
          { '--done': 1, duration: 0.25, ease: 'power2.out', immediateRender: false },
          opts.doneAt
        );
      }
      return tl;
    },

    /* Status line: fades in, spinner turns a finite number of times, meter fills in discrete steps.
       opts: { dur=1.6, steps=8, from=0, to=1 (0..1), turns, dist } */
    statusTick(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 1.6;
      util.list(target).forEach((el) => {
        tl.fromTo(el, { opacity: 0, y: util.dist(opts, 16) }, { opacity: 1, y: 0, duration: 0.3, ease: EASE_SNAPPY }, at);
        const spin = el.querySelector('.cc-status__spinner');
        if (spin) {
          const turns = opts.turns ?? Math.max(1, Math.round(dur / 0.8));
          tl.fromTo(spin, { rotation: 0 }, { rotation: 360 * turns, duration: dur, ease: 'none' }, at);
        }
        const meter = el.querySelector('.cc-status__meter');
        if (meter) {
          tl.fromTo(
            meter,
            { '--v': opts.from ?? 0 },
            { '--v': opts.to ?? 1, duration: dur, ease: 'steps(' + (opts.steps ?? 8) + ')' },
            at
          );
        }
      });
      return tl;
    },
  };

  Object.keys(presets).forEach((name) => {
    if (!(name in C)) C[name] = presets[name];
  });
})(window);