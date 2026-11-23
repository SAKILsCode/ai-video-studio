/* ==========================================================================
   CH01: BASIC CLAUDE COPY — MEDIA, TRANSITIONS & OUTRO PRESETS (Batch 6A, READ-ONLY)
   Extension file: only ADDS to window.CCMotion (never replaces core entries).
   Zero Math.random(), zero requestAnimationFrame, zero infinite repeats. Seek-safe.
   Load AFTER motion-presets.js.
   ========================================================================== */
(function (global) {
  const C = global.CCMotion;
  if (!C || !C.util) {
    throw new Error('motion-presets.media.js requires motion-presets.js to be loaded first');
  }
  const util = C.util;

  const EASE_SNAPPY = 'power4.out';
  const EASE_SMOOTH = 'power3.out';
  const EASE_POP = 'back.out(1.35)';
  const EASE_EXIT = 'power2.in';

  const startOf = (raw) => (raw && typeof raw === 'object' ? raw.start : raw);

  function wipePeak(at, opts = {}) {
    const dur = opts.dur ?? 0.9;
    const hold = opts.hold ?? 0.08;
    const coverDur = opts.coverDur ?? (dur - hold) * (opts.peak ?? 0.5);
    return at + coverDur + hold * 0.5;
  }

  function wipeTransition(tl, overlay, at, opts = {}) {
    const dur = opts.dur ?? 0.9;
    const hold = opts.hold ?? 0.08;
    const coverDur = opts.coverDur ?? (dur - hold) * (opts.peak ?? 0.5);
    const revealDur = opts.revealDur ?? Math.max(0.05, dur - hold - coverDur);
    const easeIn = opts.ease ?? 'power3.inOut';
    const easeOut = opts.ease2 ?? 'power3.inOut';
    const peakAt = at + coverDur + hold * 0.5;
    const revealAt = at + coverDur + hold;
    const endAt = revealAt + revealDur;

    util.list(overlay).forEach((el) => {
      const kind =
        opts.kind ||
        (el.classList.contains('cc-curtain')
          ? 'curtain'
          : el.classList.contains('cc-slash')
            ? 'slash'
            : el.classList.contains('cc-dim')
              ? 'dim'
              : 'wipe');
      const dir = opts.dir || el.dataset.dir || (kind === 'curtain' ? 'h' : 'left');

      tl.fromTo(el, { visibility: 'hidden' }, { visibility: 'visible', duration: 0.001 }, at);

      if (kind === 'wipe') {
        const panel = el.querySelector('.cc-wipe__panel') || el;
        const axis = dir === 'up' || dir === 'down' ? 'yPercent' : 'xPercent';
        const fromV = dir === 'right' || dir === 'down' ? -102 : 102;
        const exitV = -fromV;
        tl.fromTo(panel, { [axis]: fromV }, { [axis]: 0, duration: coverDur, ease: easeIn }, at);
        tl.to(panel, { [axis]: exitV, duration: revealDur, ease: easeOut, immediateRender: false }, revealAt);
      } else if (kind === 'curtain') {
        const panelA = el.querySelector('.cc-curtain__panel--a');
        const panelB = el.querySelector('.cc-curtain__panel--b');
        const axis = dir === 'v' ? 'yPercent' : 'xPercent';
        if (panelA) {
          tl.fromTo(panelA, { [axis]: -102 }, { [axis]: 0, duration: coverDur, ease: easeIn }, at);
          tl.to(panelA, { [axis]: -102, duration: revealDur, ease: easeOut, immediateRender: false }, revealAt);
        }
        if (panelB) {
          tl.fromTo(panelB, { [axis]: 102 }, { [axis]: 0, duration: coverDur, ease: easeIn }, at);
          tl.to(panelB, { [axis]: 102, duration: revealDur, ease: easeOut, immediateRender: false }, revealAt);
        }
      } else if (kind === 'slash') {
        const band = el.querySelector('.cc-slash__band') || el;
        const fromV = dir === 'right' ? -125 : 125;
        const exitV = -fromV;
        const skew = opts.skew ?? (dir === 'right' ? -14 : 14);
        tl.fromTo(
          band,
          { xPercent: fromV, skewX: skew },
          { xPercent: 0, skewX: skew, duration: coverDur, ease: easeIn },
          at
        );
        tl.to(band, { xPercent: exitV, duration: revealDur, ease: easeOut, immediateRender: false }, revealAt);
      } else {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: coverDur, ease: easeIn }, at);
        tl.to(el, { opacity: 0, duration: revealDur, ease: easeOut, immediateRender: false }, revealAt);
      }

      tl.to(el, { visibility: 'hidden', duration: 0.001, immediateRender: false }, endAt);
    });

    if (opts.onPeak) {
      if (typeof opts.onPeak === 'function') {
        tl.call(opts.onPeak, [], peakAt);
      } else if (typeof opts.onPeak === 'object') {
        C.polarityFlip(tl, opts.onPeak.stage, peakAt, opts.onPeak.toDark);
      }
    }
    return tl;
  }
  wipeTransition.peak = wipePeak;

  const presets = {
    /* Smooth Ken Burns zoom/pan on .cc-media or .cc-media__el (reads data-kb default).
       opts: { dir, from, to, pan=4, origin='50% 50%', dur=4, ease='none', stagger=0, reverse=false } */
    kenBurns(tl, target, at, opts = {}) {
      const dur = opts.dur ?? 4;
      const pan = opts.pan ?? 4;
      const ease = opts.ease ?? 'none';

      util.list(target).forEach((node, i) => {
        const el = node.classList.contains('cc-media')
          ? node.querySelector('.cc-media__el') || node
          : node;
        const dir = opts.dir || el.dataset.kb || node.dataset.kb || 'in';
        const origin = opts.origin ?? '50% 50%';

        let from = { scale: opts.from ?? 1, xPercent: 0, yPercent: 0, transformOrigin: origin };
        let to = { scale: opts.to ?? 1.12, xPercent: 0, yPercent: 0, transformOrigin: origin };

        if (dir === 'out') {
          from.scale = opts.from ?? 1.14;
          to.scale = opts.to ?? 1;
        } else if (dir === 'left') {
          from.scale = opts.from ?? 1.1;
          to.scale = opts.to ?? 1.1;
          from.xPercent = pan;
          to.xPercent = -pan;
        } else if (dir === 'right') {
          from.scale = opts.from ?? 1.1;
          to.scale = opts.to ?? 1.1;
          from.xPercent = -pan;
          to.xPercent = pan;
        } else if (dir === 'up') {
          from.scale = opts.from ?? 1.1;
          to.scale = opts.to ?? 1.1;
          from.yPercent = pan;
          to.yPercent = -pan;
        } else if (dir === 'down') {
          from.scale = opts.from ?? 1.1;
          to.scale = opts.to ?? 1.1;
          from.yPercent = -pan;
          to.yPercent = pan;
        } else if (dir === 'drift') {
          from.scale = opts.from ?? 1.04;
          to.scale = opts.to ?? 1.12;
          from.xPercent = -pan * 0.7;
          to.xPercent = pan * 0.7;
          from.yPercent = pan * 0.4;
          to.yPercent = -pan * 0.4;
        }

        if (opts.reverse) {
          const tmp = from;
          from = to;
          to = tmp;
        }

        tl.fromTo(el, from, { ...to, duration: dur, ease }, at + i * (opts.stagger ?? 0));
      });
      return tl;
    },

    /* Media frame entrance (mask | fade | scale | slide) + optional inner settle & exit.
       opts: { mode='mask', dir='up', dur=0.65, ease, dist, stagger=0.1, settle=true, outAt, outDur=0.35 } */
    mediaReveal(tl, target, at, opts = {}) {
      const mode = opts.mode ?? 'mask';
      const dir = opts.dir ?? 'up';
      const dur = opts.dur ?? 0.65;
      const ease = opts.ease ?? EASE_SNAPPY;
      const d = util.dist(opts, 48);

      util.list(target).forEach((el, i) => {
        const t = at + i * (opts.stagger ?? 0.1);
        if (mode === 'fade') {
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur, ease }, t);
        } else if (mode === 'scale') {
          tl.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: dur, ease }, t);
        } else if (mode === 'slide') {
          const from = { opacity: 0 };
          if (dir === 'left') from.x = -d;
          else if (dir === 'right') from.x = d;
          else if (dir === 'down') from.y = -d;
          else from.y = d;
          tl.fromTo(el, from, { opacity: 1, x: 0, y: 0, duration: dur, ease }, t);
        } else {
          const clipFrom =
            dir === 'down'
              ? 'inset(0% 0% 100% 0%)'
              : dir === 'left'
                ? 'inset(0% 0% 0% 100%)'
                : dir === 'right'
                  ? 'inset(0% 100% 0% 0%)'
                  : 'inset(100% 0% 0% 0%)';
          tl.fromTo(
            el,
            { clipPath: clipFrom, opacity: 1 },
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: dur, ease },
            t
          );
          if (opts.settle !== false) {
            const inner = el.querySelector('.cc-media__el');
            if (inner) {
              tl.fromTo(inner, { scale: 1.07 }, { scale: 1, duration: dur * 1.15, ease: EASE_SMOOTH }, t);
            }
          }
        }

        if (typeof opts.outAt === 'number') {
          tl.to(
            el,
            { opacity: 0, duration: opts.outDur ?? 0.35, ease: EASE_EXIT, immediateRender: false },
            opts.outAt
          );
        }
      });
      return tl;
    },

    wipeTransition,

    /* Safe-zone subtitle word animation via CSS custom properties ONLY (--pop --seen --seen-min --dy).
       opts: { mode='highlight'|'karaoke'|'build', times, byAttr=false, lead=0, stagger=0.18,
               dur=0.22, hold=0.14, stay=false, dist, exitAt, exitDur=0.2, prev } */
    captionPop(tl, target, at, opts = {}) {
      const box = util.list(target)[0];
      if (!box) return tl;

      const mode = opts.mode ?? 'highlight';
      const dur = opts.dur ?? 0.22;
      const hold = opts.hold ?? 0.14;
      const lead = opts.lead ?? 0;
      const stagger = opts.stagger ?? 0.18;
      const d = util.dist(opts, 16);
      const exitDur = opts.exitDur ?? 0.2;

      if (opts.prev) {
        tl.to(
          opts.prev,
          { autoAlpha: 0, duration: exitDur, ease: EASE_EXIT, immediateRender: false },
          Math.max(0, at - exitDur * 0.5)
        );
      }

      tl.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, Math.max(0, at - 0.01));

      const words = Array.from(box.querySelectorAll('.cc-subtitles__word'));
      const hasTimes = Array.isArray(opts.times) && opts.times.length > 0;

      words.forEach((word, i) => {
        const idx =
          opts.byAttr && word.dataset && word.dataset.word !== undefined
            ? Number(word.dataset.word)
            : i;
        const raw = hasTimes ? startOf(opts.times[idx]) : undefined;
        const t = typeof raw === 'number' ? Math.max(0, raw + lead) : at + i * stagger;

        if (mode === 'build') {
          tl.fromTo(
            word,
            { '--seen-min': 0, '--seen': 0, '--pop': 0, '--dy': d },
            { '--seen-min': 0, '--seen': 1, '--pop': 1, '--dy': 0, duration: dur, ease: EASE_POP },
            t
          );
          if (!opts.stay) {
            tl.to(word, { '--pop': 0, duration: dur, ease: 'power2.out', immediateRender: false }, t + dur + hold);
          }
        } else if (mode === 'karaoke') {
          tl.fromTo(
            word,
            { '--seen-min': 0.45, '--seen': 0, '--pop': 0, '--dy': 0 },
            { '--seen-min': 0.45, '--seen': 1, '--pop': 1, '--dy': 0, duration: dur, ease: EASE_POP },
            t
          );
          if (!opts.stay) {
            tl.to(word, { '--pop': 0, duration: dur, ease: 'power2.out', immediateRender: false }, t + dur + hold);
          }
        } else {
          tl.fromTo(
            word,
            { '--seen-min': 0.5, '--seen': 0, '--pop': 0, '--dy': 0 },
            { '--seen-min': 0.5, '--seen': 1, '--pop': 1, '--dy': 0, duration: dur, ease: EASE_POP },
            t
          );
          if (!opts.stay) {
            tl.to(
              word,
              { '--pop': 0, '--seen': 0.3, duration: dur, ease: 'power2.out', immediateRender: false },
              t + dur + hold
            );
          }
        }
      });

      if (typeof opts.exitAt === 'number') {
        tl.to(
          box,
          { autoAlpha: 0, duration: exitDur, ease: EASE_EXIT, immediateRender: false },
          opts.exitAt
        );
      }
      return tl;
    },

    /* Outro assembly: animates brand, next-video card, and CTA pill (with finite ring pulse).
       opts: { order=['brand','next','cta'], gap=0.22, dur=0.55, dist, pulses=2, exitAt, exitDur=0.35 } */
    outroAssemble(tl, outro, at, opts = {}) {
      const order = opts.order ?? ['brand', 'next', 'cta'];
      const gap = opts.gap ?? 0.22;
      const dur = opts.dur ?? 0.55;
      const d = util.dist(opts, 32);
      const pulses = opts.pulses ?? 2;

      util.list(outro).forEach((root) => {
        let cursor = at;

        order.forEach((part) => {
          if (part === 'brand') {
            const brand = root.querySelector('.cc-outro__brand');
            if (!brand) return;
            const mark = brand.querySelector('.cc-outro__mark');
            const name = brand.querySelector('.cc-outro__name');
            const rule = brand.querySelector('.cc-outro__rule');
            const signoff = brand.querySelector('.cc-outro__signoff');

            if (mark) {
              tl.fromTo(
                mark,
                { opacity: 0, scale: 0.65 },
                { opacity: 1, scale: 1, duration: dur * 0.85, ease: EASE_POP },
                cursor
              );
            }
            if (name) {
              tl.fromTo(
                name,
                { opacity: 0, y: d * 0.7 },
                { opacity: 1, y: 0, duration: dur, ease: EASE_SNAPPY },
                cursor + 0.08
              );
            }
            if (rule) {
              tl.fromTo(
                rule,
                { scaleX: 0, transformOrigin: '50% 50%' },
                { scaleX: 1, transformOrigin: '50% 50%', duration: dur * 0.7, ease: EASE_SMOOTH },
                cursor + 0.16
              );
            }
            if (signoff) {
              tl.fromTo(
                signoff,
                { opacity: 0, y: d * 0.5 },
                { opacity: 1, y: 0, duration: dur * 0.85, ease: EASE_SNAPPY },
                cursor + 0.2
              );
            }
            cursor += gap * 1.4;
          } else if (part === 'next') {
            const nextCard = root.querySelector('.cc-next');
            if (!nextCard) return;
            tl.fromTo(
              nextCard,
              { opacity: 0, y: d, scale: 0.94 },
              { opacity: 1, y: 0, scale: 1, duration: dur, ease: EASE_SNAPPY },
              cursor
            );
            cursor += gap;
          } else if (part === 'cta') {
            const cta = root.querySelector('.cc-cta');
            if (!cta) return;
            tl.fromTo(
              cta,
              { opacity: 0, y: d * 0.7, scale: 0.86 },
              { opacity: 1, y: 0, scale: 1, duration: dur * 0.9, ease: EASE_POP },
              cursor
            );
            for (let p = 0; p < pulses; p += 1) {
              tl.fromTo(
                cta,
                { '--pulse': 0 },
                { '--pulse': 1, duration: 0.75, ease: 'power2.out', immediateRender: false },
                cursor + dur * 0.7 + p * 0.9
              );
            }
            cursor += gap;
          }
        });

        if (typeof opts.exitAt === 'number') {
          tl.to(
            root,
            { opacity: 0, duration: opts.exitDur ?? 0.35, ease: EASE_EXIT, immediateRender: false },
            opts.exitAt
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