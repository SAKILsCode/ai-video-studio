/* ==========================================================================
   motion-presets.data.js - Batch 5: Data and Evidence
   Load after motion-presets.js (and GSAP 3.15). Every preset is
   CCMotion.<name>(tl, target, at, opts) -> tl, added only if the name is free.
   Seek-safe: pure fromTo tweens, no callbacks or state. countUp writes text
   through a GSAP modifier, which runs during render even when events are
   suppressed (tl.seek). Bars animate the --v custom property.
   ========================================================================== */
(function (root) {
  'use strict';
  var M = root.CCMotion = root.CCMotion || {};
  var U = M.util || {};
  var BN = '\u09E6\u09E7\u09E8\u09E9\u09EA\u09EB\u09EC\u09ED\u09EE\u09EF';
  var FILL = '.cc-progress__fill, .cc-bars__fill';
  var ITEM = '.cc-kpi, .cc-metric, .cc-table__row, .cc-bars__bar, .cc-progress, .cc-source, .cc-linechart';

  function add(name, fn) { if (!M[name]) M[name] = fn; }

  function toArr(t) {
    var out = [], i;
    if (t == null) return out;
    if (typeof t === 'string') return toArr(document.querySelectorAll(t));
    if (t.nodeType === 1) return [t];
    if (typeof t.length === 'number') {
      for (i = 0; i < t.length; i++) out = out.concat(toArr(t[i]));
    }
    return out;
  }
  function list(t) {
    var r = null;
    if (typeof U.list === 'function') {
      try { r = U.list(t); } catch (e) { r = null; }
    }
    if (r && typeof r.length === 'number') return toArr(Array.prototype.slice.call(r));
    return toArr(t);
  }
  function stageHas(el, cls) {
    var s = el && el.closest ? el.closest('.cc-stage') : null;
    return !!(s && s.classList.contains(cls));
  }
  function num(v, d) {
    var n = parseFloat(String(v).replace(/,/g, ''));
    return isFinite(n) ? n : d;
  }
  function fmt(v, c) {
    var s = Math.abs(v).toFixed(c.decimals), p, neg;
    if (c.sep) {
      p = s.split('.');
      p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, c.sep);
      s = p.join('.');
    }
    neg = v < 0 && parseFloat(s) !== 0 ? '-' : '';
    if (c.bn) s = s.replace(/\d/g, function (d) { return BN.charAt(+d); });
    return neg + c.prefix + s + c.suffix;
  }

  /* countUp(tl, els, at, {to,from,decimals,prefix,suffix,sep,digits,dur,ease,stagger,times})
     Reads data-value / data-from / data-decimals / data-prefix / data-suffix / data-sep /
     data-digits (auto|en|bn). digits:auto uses Bengali numerals inside .cc-stage--bn. */
  add('countUp', function (tl, target, at, o) {
    o = o || {};
    list(target).forEach(function (el, i) {
      var ds = el.dataset || {};
      var digits = o.digits || ds.digits || 'auto';
      var cfg = {
        decimals: o.decimals != null ? o.decimals : (ds.decimals != null ? +ds.decimals : 0),
        prefix: o.prefix != null ? o.prefix : (ds.prefix || ''),
        suffix: o.suffix != null ? o.suffix : (ds.suffix || ''),
        sep: o.sep != null ? o.sep : (ds.sep != null ? ds.sep : ','),
        bn: digits === 'bn' || (digits === 'auto' && stageHas(el, 'cc-stage--bn'))
      };
      var to = num(o.to != null ? o.to : ds.value, 0);
      var from = num(o.from != null ? o.from : ds.from, 0);
      var t = o.times && o.times[i] != null ? o.times[i] : at + i * (o.stagger || 0);
      el.textContent = fmt(from, cfg);
      tl.fromTo(el,
        { textContent: from },
        {
          textContent: to,
          duration: o.dur != null ? o.dur : 1.2,
          ease: o.ease || 'power3.out',
          modifiers: { textContent: function (v) { return fmt(parseFloat(v), cfg); } }
        }, t);
    });
    return tl;
  });

  /* barGrow(tl, target, at, {dur,stagger,ease,from,to,times,values})
     target: progress/bars containers or fill elements. Final fill reads the CSS --v
     (cached in data-cc-to on first build). values:false disables the synced
     count-up of [data-value] labels inside the same bar. */
  add('barGrow', function (tl, target, at, o) {
    o = o || {};
    var dur = o.dur != null ? o.dur : 0.9;
    var gap = o.stagger != null ? o.stagger : 0.12;
    var ease = o.ease || 'power3.out';
    var found = [];
    list(target).forEach(function (el) {
      if (el.matches(FILL)) found.push(el);
      else found = found.concat(toArr(el.querySelectorAll(FILL)));
    });
    found.forEach(function (f, i) {
      var n, to, t, host, labels;
      if (f.dataset.ccTo === undefined) {
        n = parseFloat(getComputedStyle(f).getPropertyValue('--v'));
        f.dataset.ccTo = isFinite(n) ? n : 1;
      }
      to = o.to != null ? o.to : parseFloat(f.dataset.ccTo);
      t = o.times && o.times[i] != null ? o.times[i] : at + i * gap;
      tl.fromTo(f, { '--v': o.from != null ? o.from : 0 }, { '--v': to, duration: dur, ease: ease }, t);
      if (o.values !== false && typeof M.countUp === 'function') {
        host = f.closest('.cc-progress, .cc-bars__bar');
        labels = host ? toArr(host.querySelectorAll('[data-value]')) : [];
        if (labels.length) M.countUp(tl, labels, t, { dur: dur, ease: ease });
      }
    });
    return tl;
  });

  /* lineDraw(tl, target, at, {dur,ease,grid,dots,lineStagger,stagger})
     target: .cc-linechart containers (animates grid, lines, area, dots) or bare
     .cc-linechart__line paths. Paths get pathLength="1"; CSS dasharray is "1 2". */
  add('lineDraw', function (tl, target, at, o) {
    o = o || {};
    var dur = o.dur != null ? o.dur : 1.4;
    list(target).forEach(function (el, ci) {
      var isLine = el.matches('.cc-linechart__line');
      var lines = isLine ? [el] : toArr(el.querySelectorAll('.cc-linechart__line'));
      var grid = isLine ? null : el.querySelector('.cc-linechart__grid');
      var areas = isLine ? [] : toArr(el.querySelectorAll('.cc-linechart__area'));
      var dots = (isLine || o.dots === false) ? [] : toArr(el.querySelectorAll('.cc-linechart__dot'));
      var base = at + ci * (o.stagger || 0);
      var gd = grid && o.grid !== false ? 0.3 : 0;
      var t0 = base + gd * 0.5, xs, mn, mx, span;
      if (gd) tl.fromTo(grid, { opacity: 0 }, { opacity: 1, duration: gd, ease: 'power1.out' }, base);
      lines.forEach(function (ln, li) {
        if (!ln.hasAttribute('pathLength')) ln.setAttribute('pathLength', '1');
        tl.fromTo(ln, { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: dur, ease: o.ease || 'power2.inOut' },
          t0 + li * (o.lineStagger != null ? o.lineStagger : 0.15));
      });
      areas.forEach(function (a) {
        tl.fromTo(a, { opacity: 0 }, { opacity: 1, duration: dur * 0.5, ease: 'power1.out' }, t0 + dur * 0.5);
      });
      if (dots.length) {
        xs = dots.map(function (d) { return num(d.getAttribute('cx'), 0); });
        mn = Math.min.apply(null, xs);
        mx = Math.max.apply(null, xs);
        span = mx - mn;
        dots.forEach(function (d, di) {
          var f = span > 0 ? (xs[di] - mn) / span : (dots.length > 1 ? di / (dots.length - 1) : 1);
          tl.fromTo(d,
            { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
            { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 0.32, ease: 'back.out(2.2)' },
            t0 + dur * f);
        });
      }
    });
    return tl;
  });

  /* dataStagger(tl, target, at, {stagger,dur,dist,from,sel,times})
     from: up (default) | down | left | right | scale | fade.
     Items: .cc-table -> rows, .cc-bars -> bars, KPI/metric/etc. -> themselves,
     any other container -> its children. sel overrides item lookup. */
  add('dataStagger', function (tl, target, at, o) {
    o = o || {};
    var dur = o.dur != null ? o.dur : 0.5;
    var gap = o.stagger != null ? o.stagger : 0.09;
    var mode = o.from || 'up';
    var n = 0;
    list(target).forEach(function (host) {
      var d = o.dist != null ? o.dist : (stageHas(host, 'cc-stage--16x9') ? 24 : 36);
      var els;
      if (o.sel) els = toArr(host.querySelectorAll(o.sel));
      else if (host.matches(ITEM)) els = [host];
      else if (host.matches('.cc-table')) els = toArr(host.querySelectorAll('.cc-table__row'));
      else if (host.matches('.cc-bars')) els = toArr(host.querySelectorAll('.cc-bars__bar'));
      else els = Array.prototype.slice.call(host.children);
      els.forEach(function (it) {
        var f = { opacity: 0 };
        var v = { opacity: 1, duration: dur, ease: 'power3.out' };
        var t = o.times && o.times[n] != null ? o.times[n] : at + n * gap;
        if (mode === 'up') { f.y = d; v.y = 0; }
        else if (mode === 'down') { f.y = -d; v.y = 0; }
        else if (mode === 'left') { f.x = -d; v.x = 0; }
        else if (mode === 'right') { f.x = d; v.x = 0; }
        else if (mode === 'scale') {
          f.scale = 0.9; v.scale = 1;
          f.transformOrigin = '50% 50%'; v.transformOrigin = '50% 50%';
          v.ease = 'back.out(1.5)';
        }
        tl.fromTo(it, f, v, t);
        n++;
      });
    });
    return tl;
  });
})(typeof window !== 'undefined' ? window : this);