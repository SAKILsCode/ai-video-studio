/* ==========================================================================
   motion-presets.diagrams.js — Batch 4: Diagrams and Workflows
   Load after motion-presets.js. Only adds to window.CCMotion; never replaces
   an existing entry. Deterministic and seek-safe: tweens only (custom
   properties, transforms, dash offsets, clip-path), no tl.call, no onUpdate,
   no randomness, no rAF, no infinite repeats.
   Signature: CCMotion.name(tl, target, at, opts) -> tl
   (connectFlow is the exception: tl, nodeA, edge, nodeB, at, opts)
   ========================================================================== */
(function (win) {
  'use strict';
  var M = win.CCMotion;
  if (!M) { console.error('motion-presets.diagrams.js: load motion-presets.js first'); return; }
  var U = M.util || {};
  var push = Array.prototype.push;

  function list(x) {
    if (U.list) { return U.list(x); }
    if (!x) { return []; }
    if (typeof x === 'string') { return Array.prototype.slice.call(document.querySelectorAll(x)); }
    if (x.nodeType) { return [x]; }
    return Array.prototype.slice.call(x);
  }
  function add(name, fn) { if (!M[name]) { M[name] = fn; } }
  function num(v, d) { return typeof v === 'number' ? v : d; }
  function is16(el) { return !!(el && el.closest && el.closest('.cc-stage--16x9')); }
  function when(o, i, at, gap) { return o.times && o.times[i] != null ? o.times[i] : at + i * gap; }

  /* Expand a container (flow, cycle, ...) into its children; plain elements pass through. */
  function pick(target, hostSel, childSel) {
    var out = [];
    list(target).forEach(function (el) {
      var kids = el.matches && el.matches(hostSel) ? el.querySelectorAll(childSel) : [];
      if (kids.length) { push.apply(out, kids); } else { out.push(el); }
    });
    return out;
  }

  function enter(tl, el, t, dur, dist) {
    var d = dist != null ? dist : (is16(el) ? 24 : 36);
    tl.fromTo(el, { autoAlpha: 0, y: d, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: dur, ease: 'back.out(1.4)' }, t);
  }

  /* Drawable units: SVG [data-draw] paths and inline .cc-edge spans. */
  function units(target) {
    var out = [];
    list(target).forEach(function (el) {
      if (el.matches('[data-draw], .cc-edge')) { out.push(el); }
      else { push.apply(out, el.querySelectorAll('[data-draw], .cc-edge')); }
    });
    return out;
  }

  function drawOne(tl, el, t, o) {
    var dur = num(o.dur, 0.6), html = !el.getTotalLength;
    var ease = o.ease || (html ? 'none' : 'power2.inOut'), L = 0, bb = null;
    if (html) {
      tl.fromTo(el, { '--draw': 0 }, { '--draw': 1, duration: dur, ease: ease }, t);
      return;
    }
    try { L = el.getTotalLength(); bb = el.getBBox(); } catch (e) { L = 0; }
    if (!L || !bb) {
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur * 0.5, ease: 'none' }, t);
    } else if (el.classList.contains('cc-edge__path--dashed')) {
      var v = bb.height > bb.width;
      tl.fromTo(el, { clipPath: v ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: ease }, t);
    } else {
      el.style.strokeDasharray = String(L);
      tl.fromTo(el, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, ease: ease }, t);
    }
  }

  /* drawPath(tl, target, at, {dur, ease, stagger, head}) — target: SVG path with data-draw, an inline .cc-edge,
     or any container (draws every [data-draw] / .cc-edge inside). An arrow head is a <path class="cc-edge__head">
     right after its path (or pass opts.head). */
  add('drawPath', function (tl, target, at, o) {
    o = o || {};
    var dur = num(o.dur, 0.6), st = num(o.stagger, 0.15);
    units(target).forEach(function (el, i) {
      var t = at + i * st, sib = el.nextElementSibling;
      drawOne(tl, el, t, o);
      var head = o.head ? list(o.head)[i] : (sib && sib.classList.contains('cc-edge__head') ? sib : null);
      if (head) { tl.fromTo(head, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur * 0.2, ease: 'none' }, t + dur * 0.85); }
    });
    return tl;
  });

  /* nodeEnter(tl, nodes, at, {dur, stagger, dist, times}) — a .cc-flow or .cc-cycle target expands to its .cc-node children. */
  add('nodeEnter', function (tl, target, at, o) {
    o = o || {};
    pick(target, '.cc-flow, .cc-cycle', '.cc-node').forEach(function (el, i) {
      enter(tl, el, when(o, i, at, num(o.stagger, 0.12)), num(o.dur, 0.44), o.dist);
    });
    return tl;
  });

  /* nodePulse(tl, node, at, {count, dur, peak}) — finite gold ring pulses via --pulse. */
  add('nodePulse', function (tl, target, at, o) {
    o = o || {};
    var n = Math.max(1, o.count || 2), dur = num(o.dur, 0.7), peak = num(o.peak, 1);
    pick(target, '.cc-flow, .cc-cycle', '.cc-node').forEach(function (el) {
      for (var i = 0; i < n; i++) {
        var t = at + i * dur;
        tl.fromTo(el, { '--pulse': 0 }, { '--pulse': peak, duration: dur / 2, ease: 'sine.out', immediateRender: false }, t);
        tl.fromTo(el, { '--pulse': peak }, { '--pulse': 0, duration: dur / 2, ease: 'sine.in', immediateRender: false }, t + dur / 2);
      }
    });
    return tl;
  });

  /* connectFlow(tl, nodeA, edge, nodeB, at, {dur, edgeDur, enterA}) — A enters (unless enterA:false), edge draws, B enters. */
  add('connectFlow', function (tl, a, edge, b, at, o) {
    o = o || {};
    var t = at, nd = num(o.dur, 0.44), ed = num(o.edgeDur, 0.5);
    if (o.enterA !== false) {
      list(a).forEach(function (el) { enter(tl, el, t, nd); });
      t += nd * 0.7;
    }
    M.drawPath(tl, edge, t, { dur: ed });
    t += ed * 0.85;
    list(b).forEach(function (el) { enter(tl, el, t, nd); });
    return tl;
  });

  /* flowSequence(tl, flow, at, {dur, edgeDur, times}) — walks a .cc-flow in DOM order: items enter, edges draw.
     times[] (absolute seconds) pins the n-th non-edge child. */
  add('flowSequence', function (tl, target, at, o) {
    o = o || {};
    var nd = num(o.dur, 0.44), ed = num(o.edgeDur, 0.5);
    list(target).forEach(function (flow) {
      var t = at, n = 0;
      Array.prototype.forEach.call(flow.children, function (c) {
        if (c.classList.contains('cc-edge')) {
          drawOne(tl, c, t, { dur: ed });
          t += ed * 0.85;
        } else {
          var s = o.times && o.times[n] != null ? o.times[n] : t;
          enter(tl, c, s, nd);
          t = s + nd * 0.7;
          n++;
        }
      });
    });
    return tl;
  });

  /* stepAdvance(tl, steps, at, {gap, times, dur, keep, finish}) — activates items one by one via --on.
     .cc-step: previous goes done (--done). .cc-timeline__item: previous stays lit and its segment fills (--seg).
     Target may be a container (.cc-flow / .cc-timeline) or a list of items. */
  add('stepAdvance', function (tl, target, at, o) {
    o = o || {};
    var els = [], gap = num(o.gap, 0.9), dur = num(o.dur, 0.32);
    list(target).forEach(function (el) {
      var kids = el.querySelectorAll(':scope > .cc-step, :scope > .cc-timeline__item');
      if (kids.length) { push.apply(els, kids); } else { els.push(el); }
    });
    if (!els.length) { return tl; }
    var keep = o.keep != null ? o.keep : els[0].classList.contains('cc-timeline__item');
    function settle(el, t) {
      if (keep) { return; }
      tl.fromTo(el, { '--on': 1, '--done': 0 }, { '--on': 0, '--done': 1, duration: dur, ease: 'power2.out', immediateRender: false }, t);
    }
    els.forEach(function (el, i) {
      var t = when(o, i, at, gap), prev = els[i - 1];
      tl.fromTo(el, { '--on': 0 }, { '--on': 1, duration: dur, ease: 'power2.out' }, t);
      if (prev) {
        if (prev.classList.contains('cc-timeline__item')) {
          tl.fromTo(prev, { '--seg': 0 }, { '--seg': 1, duration: dur, ease: 'power2.out', immediateRender: false }, t);
        }
        settle(prev, t);
      }
    });
    if (o.finish) { settle(els[els.length - 1], when(o, els.length, at, gap)); }
    return tl;
  });

  /* splitWipe(tl, split, at, {dur, ease, from, to}) — .cc-split--wipe sweeps pane B in via --p; other splits fade pane B up. */
  add('splitWipe', function (tl, target, at, o) {
    o = o || {};
    var dur = num(o.dur, 0.9), ease = o.ease || 'power2.inOut';
    list(target).forEach(function (el) {
      if (el.classList.contains('cc-split--wipe')) {
        tl.fromTo(el, { '--p': num(o.from, 0) }, { '--p': num(o.to, 1), duration: dur, ease: ease }, at);
      } else {
        var b = el.querySelector('.cc-split__b');
        if (b) { enter(tl, b, at, dur * 0.6); }
      }
    });
    return tl;
  });

  /* checkTick(tl, checklist, at, {stagger, dur, times, fail}) — ticks items via --tick; fail:true or fail:[indices] uses --fail. */
  add('checkTick', function (tl, target, at, o) {
    o = o || {};
    var dur = num(o.dur, 0.3), st = num(o.stagger, 0.5);
    pick(target, '.cc-checklist', '.cc-checklist__item').forEach(function (el, i) {
      var bad = o.fail === true || (Array.isArray(o.fail) && o.fail.indexOf(i) > -1);
      var k = bad ? '--fail' : '--tick', from = {}, to = { duration: dur, ease: 'back.out(2)' };
      from[k] = 0; to[k] = 1;
      tl.fromTo(el, from, to, when(o, i, at, st));
    });
    return tl;
  });

  /* calloutIn(tl, callout, at, {dur, stagger}) — pop-in; arrow callouts scale from their tip. */
  add('calloutIn', function (tl, target, at, o) {
    o = o || {};
    list(target).forEach(function (el, i) {
      tl.fromTo(el, { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: num(o.dur, 0.4), ease: 'back.out(1.8)', transformOrigin: '50% 50%' },
        when(o, i, at, num(o.stagger, 0.2)));
    });
    return tl;
  });

  /* layersStack(tl, layers, at, {dur, stagger, dist, from, times}) — foundation first (last child up) unless from:'top'. */
  add('layersStack', function (tl, target, at, o) {
    o = o || {};
    var layers = pick(target, '.cc-layers', '.cc-layers__layer'), top = o.from === 'top';
    if (!top) { layers.reverse(); }
    layers.forEach(function (el, i) {
      var d = num(o.dist, is16(el) ? 36 : 56) * (top ? -1 : 1);
      tl.fromTo(el, { autoAlpha: 0, y: d }, { autoAlpha: 1, y: 0, duration: num(o.dur, 0.5), ease: 'power3.out' },
        when(o, i, at, num(o.stagger, 0.25)));
    });
    return tl;
  });

  /* cycleSpin(tl, cycle, at, {turns, dur, from, ease}) — finite rotation of items around the ring via --spin (items stay upright). */
  add('cycleSpin', function (tl, target, at, o) {
    o = o || {};
    var from = num(o.from, 0);
    list(target).forEach(function (el) {
      tl.fromTo(el, { '--spin': from }, { '--spin': from + num(o.turns, 0.25) * 360, duration: num(o.dur, 1.6), ease: o.ease || 'power2.inOut' }, at);
    });
    return tl;
  });
})(window);