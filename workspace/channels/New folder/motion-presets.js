/* ==========================================================================
   CH01: BASIC CLAUDE COPY — CORE MOTION PRESETS (Batch 1, READ-ONLY)
   Defines window.CCMotion + CCMotion.util. Load AFTER GSAP 3.15 and BEFORE
   all motion-presets.<category>.js extension files.
   Zero Math.random(), zero requestAnimationFrame, zero infinite repeats. Seek-safe.
   ========================================================================== */
(function (global) {
  const EASE_SNAPPY = 'power4.out';
  const EASE_SMOOTH = 'power3.out';
  const EASE_POP = 'back.out(1.35)';
  const EASE_EXIT = 'power2.in';

  const startOf = (raw) => (raw && typeof raw === 'object' ? raw.start : raw);

  function toArray(target) {
    if (!target) return [];
    if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
    if (target.nodeType === 1) return [target];
    if (typeof target.length === 'number') {
      const out = [];
      for (let i = 0; i < target.length; i += 1) {
        const item = target[i];
        if (!item) continue;
        if (typeof item === 'string') out.push(...document.querySelectorAll(item));
        else if (item.nodeType === 1) out.push(item);
      }
      return out;
    }
    return [];
  }

  const util = {
    list(target) {
      return toArray(target);
    },

    stage(target) {
      if (target && target.nodeType === 1) {
        if (target.classList.contains('cc-stage')) return target;
        return target.closest('.cc-stage') || document.querySelector('.cc-stage');
      }
      const first = toArray(target)[0];
      if (first) return first.closest('.cc-stage') || document.querySelector('.cc-stage');
      return document.querySelector('.cc-stage');
    },

    is16x9(st) {
      const s = util.stage(st);
      return !!(s && s.classList.contains('cc-stage--16x9'));
    },

    k(st) {
      return util.is16x9(st) ? 0.85 : 1;
    },

    dist(opts, base = 36, st) {
      if (typeof opts === 'number') {
        const ref = base && base.nodeType === 1 ? base : st;
        return opts * util.k(ref);
      }
      if (opts && typeof opts.dist === 'number') return opts.dist;
      const ref = opts && opts.stage ? opts.stage : st;
      return base * util.k(ref);
    },

    cssVar(el, name, fallback = '') {
      let node = el;
      let prop = name;
      let fb = fallback;
      if (typeof el === 'string' && el.startsWith('--')) {
        prop = el;
        node = name && name.nodeType === 1 ? name : util.stage();
        fb = typeof name === 'string' ? name : fallback;
      }
      const target = node || util.stage() || document.documentElement;
      if (!target || !prop) return fb;
      const val = getComputedStyle(target).getPropertyValue(prop).trim();
      return val || fb;
    },

    stageClass(st, toDark) {
      const el = util.stage(st);
      const tokens = (el ? el.className : 'cc-stage')
        .split(/\s+/)
        .filter((c) => c && c !== 'cc-stage--dark');
      if (toDark) tokens.push('cc-stage--dark');
      return tokens.join(' ');
    },

    irisScale(st, irisEl) {
      const s = util.stage(st);
      const w = (s && s.offsetWidth) || (util.is16x9(s) ? 1920 : 1080);
      const h = (s && s.offsetHeight) || (util.is16x9(s) ? 1080 : 1920);
      const diag = Math.hypot(w, h);
      const el = toArray(irisEl)[0];
      const base = (el && Math.min(el.offsetWidth || 0, el.offsetHeight || 0)) || 120;
      return Math.ceil((diag / Math.max(1, base)) * 1.15);
    },
  };

  const CCMotion = {
    util,

    /* --- ENTRANCES --- */

    fadeUp(tl, target, at, opts = {}) {
      return tl.fromTo(
        target,
        { opacity: 0, y: util.dist(opts, 40) },
        {
          opacity: 1,
          y: 0,
          duration: opts.dur ?? 0.55,
          stagger: opts.stagger ?? 0,
          ease: opts.ease ?? EASE_SNAPPY,
        },
        at
      );
    },

    slideIn(tl, target, at, opts = {}) {
      const dir = opts.dir ?? 'left';
      const d = util.dist(opts, 64);
      const from = { opacity: 0 };
      if (dir === 'left') from.x = -d;
      else if (dir === 'right') from.x = d;
      else if (dir === 'up') from.y = -d;
      else from.y = d;

      return tl.fromTo(
        target,
        from,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: opts.dur ?? 0.55,
          stagger: opts.stagger ?? 0,
          ease: opts.ease ?? EASE_SNAPPY,
        },
        at
      );
    },

    popIn(tl, target, at, opts = {}) {
      return tl.fromTo(
        target,
        { opacity: 0, scale: opts.from ?? 0.82, y: util.dist(opts, 18) },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: opts.dur ?? 0.48,
          stagger: opts.stagger ?? 0,
          ease: opts.ease ?? EASE_POP,
        },
        at
      );
    },

    maskReveal(tl, target, at, opts = {}) {
      const dir = opts.dir ?? 'up';
      const clipFrom =
        dir === 'down'
          ? 'inset(0% 0% 100% 0%)'
          : dir === 'left'
            ? 'inset(0% 0% 0% 100%)'
            : dir === 'right'
              ? 'inset(0% 100% 0% 0%)'
              : 'inset(100% 0% 0% 0%)';
      const d = util.dist(opts, opts.shift ?? 0);
      const from = { clipPath: clipFrom, opacity: opts.fade ? 0 : 1 };
      const to = {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: opts.dur ?? 0.6,
        stagger: opts.stagger ?? 0,
        ease: opts.ease ?? EASE_SNAPPY,
      };
      if (d) {
        if (dir === 'up') { from.y = d; to.y = 0; }
        else if (dir === 'down') { from.y = -d; to.y = 0; }
        else if (dir === 'left') { from.x = d; to.x = 0; }
        else { from.x = -d; to.x = 0; }
      }
      return tl.fromTo(target, from, to, at);
    },

    scaleIn(tl, target, at, opts = {}) {
      return tl.fromTo(
        target,
        { opacity: 0, scale: opts.from ?? 0.88 },
        {
          opacity: 1,
          scale: 1,
          duration: opts.dur ?? 0.5,
          stagger: opts.stagger ?? 0,
          ease: opts.ease ?? EASE_SMOOTH,
        },
        at
      );
    },

    /* --- EXITS --- */

    exitFade(tl, target, at, opts = {}) {
      return tl.to(
        target,
        {
          opacity: 0,
          duration: opts.dur ?? 0.35,
          stagger: opts.stagger ?? 0,
          ease: opts.ease ?? EASE_EXIT,
          immediateRender: false,
        },
        at
      );
    },

    exitDown(tl, target, at, opts = {}) {
      return tl.to(
        target,
        {
          opacity: 0,
          y: util.dist(opts, 40),
          duration: opts.dur ?? 0.38,
          stagger: opts.stagger ?? 0,
          ease: opts.ease ?? EASE_EXIT,
          immediateRender: false,
        },
        at
      );
    },

    exitCard(tl, target, at, opts = {}) {
      return tl.to(
        target,
        {
          opacity: 0,
          y: util.dist(opts, 30),
          scale: opts.to ?? 0.94,
          duration: opts.dur ?? 0.38,
          stagger: opts.stagger ?? 0,
          ease: opts.ease ?? EASE_EXIT,
          immediateRender: false,
        },
        at
      );
    },

    exitStagger(tl, target, at, opts = {}) {
      return tl.to(
        target,
        {
          opacity: 0,
          y: util.dist(opts, 28),
          duration: opts.dur ?? 0.32,
          stagger: opts.stagger ?? 0.06,
          ease: opts.ease ?? EASE_EXIT,
          immediateRender: false,
        },
        at
      );
    },

    clearBeat(tl, target, at, opts = {}) {
      return tl.to(
        target,
        {
          opacity: 0,
          y: util.dist(opts, 24),
          duration: opts.dur ?? 0.34,
          stagger: opts.stagger ?? 0.04,
          ease: opts.ease ?? EASE_EXIT,
          immediateRender: false,
        },
        at
      );
    },

    /* --- CAMERA --- */

    cameraPush(tl, target, at, opts = {}) {
      return tl.fromTo(
        target,
        { scale: opts.from ?? 1, transformOrigin: opts.origin ?? '50% 50%' },
        {
          scale: opts.to ?? 1.06,
          transformOrigin: opts.origin ?? '50% 50%',
          duration: opts.dur ?? 4,
          ease: opts.ease ?? 'sine.inOut',
          immediateRender: false,
        },
        at
      );
    },

    panTo(tl, target, at, opts = {}) {
      return tl.to(
        target,
        {
          x: opts.x ?? 0,
          y: opts.y ?? 0,
          scale: opts.scale ?? 1,
          duration: opts.dur ?? 0.85,
          ease: opts.ease ?? 'power3.inOut',
          immediateRender: false,
        },
        at
      );
    },

    focusZoom(tl, target, at, opts = {}) {
      return tl.to(
        target,
        {
          scale: opts.scale ?? 1.14,
          x: opts.x ?? 0,
          y: opts.y ?? 0,
          transformOrigin: opts.origin ?? '50% 50%',
          duration: opts.dur ?? 0.75,
          ease: opts.ease ?? 'power3.inOut',
          immediateRender: false,
        },
        at
      );
    },

    /* --- POLARITY (seek-safe absolute class string swap for GSAP 3.15) --- */

    polarityFlip(tl, stage, at, toDark) {
      const dark =
        typeof toDark === 'object' && toDark !== null ? Boolean(toDark.toDark) : Boolean(toDark);
      const st = util.stage(stage);
      if (!st) return tl;
      const fromCls = util.stageClass(st, !dark);
      const toCls = util.stageClass(st, dark);
      return tl.fromTo(
        st,
        { className: fromCls },
        { className: toCls, duration: 0.001, immediateRender: false },
        at
      );
    },

    /* --- WORDS --- */

    revealWordsAt(tl, els, times, opts = {}) {
      const list = util.list(els);
      const d = util.dist(opts, 16);
      const dur = opts.dur ?? 0.22;
      const lead = opts.lead ?? 0;
      const baseAt = opts.at ?? 0;
      const stagger = opts.stagger ?? 0.14;
      const hasTimes = Array.isArray(times) && times.length > 0;

      list.forEach((el, i) => {
        const idx =
          opts.byAttr && el.dataset && el.dataset.word !== undefined
            ? Number(el.dataset.word)
            : i;
        const raw = hasTimes ? startOf(times[idx]) : undefined;
        const t = typeof raw === 'number' ? Math.max(0, raw + lead) : baseAt + i * stagger;
        tl.fromTo(
          el,
          { opacity: 0, y: d, scale: opts.pop ? 0.9 : 1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: dur,
            ease: opts.pop ? EASE_POP : EASE_SMOOTH,
          },
          t
        );
      });
      return tl;
    },

    highlightWord(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.28;
      util.list(target).forEach((el, i) => {
        const st = util.stage(el);
        const color = opts.color ?? util.cssVar(st, '--hl', '#F5A623');
        const t = at + i * (opts.stagger ?? 0.08);
        tl.to(
          el,
          {
            color,
            scale: opts.scale ?? 1.06,
            duration: dur,
            ease: EASE_POP,
            immediateRender: false,
          },
          t
        );
        if (opts.settle !== false) {
          tl.to(
            el,
            { scale: 1, duration: dur * 0.85, ease: 'power2.out', immediateRender: false },
            t + dur + (opts.hold ?? 0.1)
          );
        }
      });
      return tl;
    },

    underlineDraw(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.5;
      util.list(target).forEach((el, i) => {
        const t = at + i * (opts.stagger ?? 0.1);
        if (el.classList.contains('cc-highlight')) {
          tl.fromTo(
            el,
            { '--draw': 0 },
            { '--draw': 1, duration: dur, ease: opts.ease ?? EASE_SMOOTH },
            t
          );
        } else {
          tl.fromTo(
            el,
            { scaleX: 0, transformOrigin: '0% 50%' },
            { scaleX: 1, transformOrigin: '0% 50%', duration: dur, ease: opts.ease ?? EASE_SMOOTH },
            t
          );
        }
      });
      return tl;
    },

    /* --- LEGACY (FIXED FOR BOTH ASPECTS & SEEK-SAFETY) --- */

    sweepBridge(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.8;
      const half = dur * 0.45;
      const hold = opts.hold ?? dur * 0.1;
      util.list(target).forEach((el) => {
        tl.fromTo(
          el,
          { scaleX: 0, transformOrigin: '0% 50%', autoAlpha: 1 },
          { scaleX: 1, transformOrigin: '0% 50%', duration: half, ease: 'power3.inOut' },
          at
        );
        if (opts.clear !== false) {
          tl.set(el, { transformOrigin: '100% 50%' }, at + half + hold);
          tl.to(
            el,
            { scaleX: 0, duration: half, ease: 'power3.inOut', immediateRender: false },
            at + half + hold
          );
        }
      });
      return tl;
    },

    irisTransition(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 0.9;
      const hold = opts.hold ?? 0.08;
      const coverDur = opts.coverDur ?? (dur - hold) * 0.5;
      const revealDur = opts.revealDur ?? (dur - hold) * 0.5;
      const peakAt = at + coverDur;

      util.list(target).forEach((el) => {
        const st = util.stage(opts.stage || el);
        const scale = opts.scale ?? util.irisScale(st, el);
        tl.fromTo(
          el,
          { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' },
          { scale, autoAlpha: 1, duration: coverDur, ease: opts.ease ?? 'power3.in' },
          at
        );
        tl.to(
          el,
          {
            scale: 0,
            autoAlpha: 0,
            duration: revealDur,
            ease: opts.ease2 ?? 'power3.out',
            immediateRender: false,
          },
          peakAt + hold
        );
      });

      if (opts.onPeak) {
        if (typeof opts.onPeak === 'function') {
          tl.call(opts.onPeak, [], peakAt);
        } else if (typeof opts.onPeak === 'object') {
          CCMotion.polarityFlip(tl, opts.onPeak.stage || opts.stage, peakAt, opts.onPeak.toDark);
        }
      }
      return tl;
    },
  };

  global.CCMotion = CCMotion;
})(window);