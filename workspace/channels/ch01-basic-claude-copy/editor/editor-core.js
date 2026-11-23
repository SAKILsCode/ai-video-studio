(function () {
  const cfg = window.CHANNEL_EDITOR_CONFIG;
  if (!cfg) return alert('Missing window.CHANNEL_EDITOR_CONFIG');

  const STORAGE_KEY = 'hf_isolated_editor_' + cfg.channelId;
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (_) { return null; }
  })();

  const state = {
    aspect: (saved && saved.aspect) || '9x16',
    dark: saved ? !!saved.dark : false,
    bn: saved ? !!saved.bn : true,
    guides: false,
    sceneName: (saved && saved.sceneName) || 'scene-01',
    bridgeOnline: false,
    inspectorTab: 'element',
    selectedId: null,
    tokens: Object.assign({}, cfg.defaultTokens, (saved && saved.tokens) || {}),
    items: (saved && Array.isArray(saved.items) && saved.items.length)
      ? saved.items
      : JSON.parse(JSON.stringify(cfg.defaultItems))
  };

  let scale = 0.35;
  let playTl = null;
  let activeExportTab = 'tokens';
  let toastTimer = null;

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        aspect: state.aspect, dark: state.dark, bn: state.bn,
        sceneName: state.sceneName, tokens: state.tokens, items: state.items
      }));
    } catch (_) {}
  }

  function toast(msg, isErr) {
    const el = document.getElementById('edToast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'ed-toast show' + (isErr ? ' err' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function stageDims() {
    return state.aspect === '16x9' ? { w: 1920, h: 1080 } : { w: 1080, h: 1920 };
  }

  function buildShell() {
    document.body.innerHTML = `
      <div class="ed-app">
        <div class="ed-top">
          <div class="ed-brand">
            <span>${cfg.title}</span>
            <span id="bridgeBadge" class="ed-status">○ Static Mode</span>
          </div>
          <div class="ed-group">
            <button class="ed-btn ${state.aspect === '9x16' ? 'active' : ''}" id="btn9">9:16</button>
            <button class="ed-btn ${state.aspect === '16x9' ? 'active' : ''}" id="btn16">16:9</button>
            <button class="ed-btn ${state.dark ? 'active' : ''}" id="btnDark">Paper / Dark</button>
            <button class="ed-btn ${state.bn ? 'active' : ''}" id="btnBn">বাংলা / EN</button>
            <button class="ed-btn" id="btnGuides">Safe Zones</button>
          </div>
          <div class="ed-group">
            <input class="ed-scene-input" id="sceneNameInput" value="${state.sceneName}" title="Scene filename (templates/<name>.html)" />
            <button class="ed-btn" id="btnLoadDisk" disabled title="Load templates/<name>.layout.json from disk">Load</button>
            <button class="ed-btn ed-btn--mint" id="btnSaveTokens" disabled title="Surgically update tokens.css on disk">Save Tokens</button>
            <button class="ed-btn ed-btn--gold" id="btnSaveScene" disabled title="Write layout.json & scene.html to templates/">Save Scene</button>
            <button class="ed-btn" id="btnExport">Export</button>
            <button class="ed-btn" id="btnReset">Reset</button>
          </div>
        </div>

        <div class="ed-left">
          <div>
            <div class="ed-sec-title">Add Component</div>
            <div class="ed-shelf" id="shelf"></div>
            <label class="ed-shelf-btn" style="display:block;margin-top:6px;text-align:center;border-style:dashed;">
              + Upload PNG / Cutout
              <input type="file" accept="image/*" hidden id="imgUpload" />
            </label>
          </div>
          <div style="flex:1;">
            <div class="ed-sec-title">Layers</div>
            <div class="ed-layer-list" id="layerList"></div>
          </div>
        </div>

        <div class="ed-center" id="centerPane">
          <div class="ed-canvas-shell" id="canvasShell">
            <div class="ed-stage-scaler ${cfg.stageClass}" id="stageEl">
              ${cfg.stageBackdropHtml || ''}
              <div id="itemsLayer" style="position:absolute;inset:0;z-index:10;"></div>
              <div class="ed-guide-x" id="guideX"></div>
              <div class="ed-guide-y" id="guideY"></div>
              <div class="ed-safe-guides">
                <div class="ed-safe-top"></div>
                <div class="ed-safe-bottom"></div>
              </div>
            </div>
          </div>
          <div class="ed-timeline">
            <button class="ed-btn ed-btn--gold" id="btnPlay">▶ Play GSAP</button>
            <button class="ed-btn" id="btnStop">■ Edit Mode</button>
            <input type="range" id="scrub" min="0" max="1000" value="0" />
            <span id="timeTxt" style="min-width:44px;text-align:right;font-family:monospace;">0.00s</span>
          </div>
        </div>

        <div class="ed-right">
          <div class="ed-tabs">
            <button class="ed-btn active" id="tabEl">Element Style</button>
            <button class="ed-btn" id="tabTheme">Global Theme</button>
          </div>
          <div id="inspectorBody"></div>
        </div>
      </div>

      <div id="edToast" class="ed-toast"></div>

      <div class="ed-modal-bg" id="exportModal">
        <div class="ed-modal">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>Export (${cfg.channelId})</strong>
            <button class="ed-btn" id="closeModal">✕</button>
          </div>
          <div class="ed-group">
            <button class="ed-btn active" data-exp="tokens">tokens.css</button>
            <button class="ed-btn" data-exp="layout">layout.json</button>
            <button class="ed-btn" data-exp="scene">templates/scene.html</button>
          </div>
          <pre id="exportPreview"></pre>
          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button class="ed-btn" id="copyExp">Copy</button>
            <button class="ed-btn ed-btn--gold" id="dlExp">Download File</button>
          </div>
        </div>
      </div>
    `;
  }

  async function detectBridge() {
    if (!location.protocol.startsWith('http')) return;
    try {
      const res = await fetch('/api/ping');
      const data = await res.json();
      if (data && data.ok) {
        state.bridgeOnline = true;
        const badge = document.getElementById('bridgeBadge');
        badge.textContent = '● Bridge Live';
        badge.classList.add('ed-status--live');
        document.getElementById('btnSaveTokens').disabled = false;
        document.getElementById('btnSaveScene').disabled = false;
        document.getElementById('btnLoadDisk').disabled = false;
      }
    } catch (_) {}
  }

  function buildLayoutObject() {
    const dims = stageDims();
    return {
      channelId: cfg.channelId,
      sceneName: state.sceneName,
      aspect: state.aspect,
      width: dims.w,
      height: dims.h,
      darkMode: state.dark,
      bangla: state.bn,
      tokens: state.tokens,
      elements: state.items.map(({ imgSrc, ...rest }) => rest)
    };
  }

  function buildSceneHtml() {
    const dims = stageDims();
    const els = state.items.map(it => {
      const st = `position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px;z-index:${it.z};font-family:${it.fontFamily};font-size:${it.fontSize}px;font-weight:${it.fontWeight};color:${it.color};background:${it.bg};border-radius:${it.radius}px;padding:${it.padding}px;display:flex;align-items:center;justify-content:${it.align==='left'?'flex-start':it.align==='right'?'flex-end':'center'};text-align:${it.align};${it.border?'border:'+it.border+';':''}${it.shadow?'box-shadow:'+it.shadow+';':''}`;
      const content = it.imgSrc ? `<img src="../assets/replace-me.png" style="width:100%;height:100%;object-fit:contain;" />` : (it.text || '');
      return `    <div id="${it.id}" data-anim="${it.anim}" data-delay="${it.delay}" data-dur="${it.duration}" style="${st}">${content}</div>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="${state.bn ? 'bn' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="../tokens.css" />
  <link rel="stylesheet" href="../components.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>
  <script src="../motion-presets.js"><\/script>
</head>
<body style="margin:0;width:${dims.w}px;height:${dims.h}px;overflow:hidden;">
  <div class="${cfg.stageClass} ${state.dark ? cfg.darkClass : ''} ${state.bn ? cfg.bnClass : ''} ${state.aspect === '16x9' && cfg.wideClass ? cfg.wideClass : ''}" style="width:${dims.w}px;height:${dims.h}px;">
    ${cfg.stageBackdropHtml || ''}
${els}
  </div>
</body>
</html>`;
  }

  function applyStageLayout() {
    const dims = stageDims();
    const center = document.getElementById('centerPane');
    const availW = Math.max(320, center.clientWidth - 48);
    const availH = Math.max(360, center.clientHeight - 104);
    scale = Math.min(availW / dims.w, availH / dims.h, 0.52);

    const shell = document.getElementById('canvasShell');
    const stage = document.getElementById('stageEl');
    shell.style.width = Math.round(dims.w * scale) + 'px';
    shell.style.height = Math.round(dims.h * scale) + 'px';
    stage.style.width = dims.w + 'px';
    stage.style.height = dims.h + 'px';
    stage.style.transform = `scale(${scale})`;

    stage.classList.toggle(cfg.darkClass, state.dark);
    stage.classList.toggle(cfg.bnClass, state.bn);
    if (cfg.wideClass) stage.classList.toggle(cfg.wideClass, state.aspect === '16x9');
    shell.classList.toggle('show-guides', state.guides);

    Object.entries(state.tokens).forEach(([k, v]) => stage.style.setProperty(k, v));
  }

  function renderShelf() {
    const shelf = document.getElementById('shelf');
    shelf.innerHTML = cfg.shelfTemplates.map((tpl, idx) =>
      `<button class="ed-shelf-btn" data-add="${idx}">+ ${tpl.label}</button>`
    ).join('');
    shelf.querySelectorAll('[data-add]').forEach(btn => {
      btn.onclick = () => {
        stopPlayback();
        const tpl = JSON.parse(JSON.stringify(cfg.shelfTemplates[+btn.dataset.add]));
        tpl.id = 'el_' + Date.now();
        tpl.z = state.items.length + 2;
        state.items.push(tpl);
        state.selectedId = tpl.id;
        persist(); renderItems(); renderLayers(); renderInspector();
      };
    });
  }

  function applyItemStyles(node, inner, it) {
    node.style.left = it.x + 'px';
    node.style.top = it.y + 'px';
    node.style.width = it.w + 'px';
    node.style.height = it.h + 'px';
    node.style.zIndex = it.z;
    node.style.opacity = it.opacity != null ? it.opacity : 1;

    inner.style.fontFamily = it.fontFamily || 'inherit';
    inner.style.fontSize = (it.fontSize || 36) + 'px';
    inner.style.fontWeight = it.fontWeight || '700';
    inner.style.color = it.color || 'inherit';
    inner.style.background = it.bg || 'transparent';
    inner.style.borderRadius = (it.radius || 0) + 'px';
    inner.style.padding = (it.padding || 0) + 'px';
    inner.style.textAlign = it.align || 'center';
    inner.style.justifyContent = it.align === 'left' ? 'flex-start' : it.align === 'right' ? 'flex-end' : 'center';
    inner.style.border = it.border || 'none';
    inner.style.boxShadow = it.shadow || 'none';
    inner.style.lineHeight = state.bn ? '1.3' : '1.15';
  }

  function renderItems() {
    const layer = document.getElementById('itemsLayer');
    layer.innerHTML = '';
    const handles = ['nw','n','ne','e','se','s','sw','w'];

    state.items.forEach(it => {
      const node = document.createElement('div');
      node.className = 'ed-item' + (it.id === state.selectedId ? ' selected' : '');
      node.dataset.id = it.id;

      const inner = document.createElement('div');
      inner.className = 'ed-item-inner ' + (it.extraClass || '');
      if (it.imgSrc) inner.innerHTML = `<img src="${it.imgSrc}" alt="${it.label}" />`;
      else inner.textContent = it.text || '';

      applyItemStyles(node, inner, it);
      node.appendChild(inner);

      handles.forEach(dir => {
        const h = document.createElement('div');
        h.className = 'ed-handle ed-h-' + dir;
        h.dataset.dir = dir;
        node.appendChild(h);
      });

      node.addEventListener('pointerdown', e => startInteract(e, it, node));
      node.addEventListener('dblclick', e => {
        if (it.imgSrc) return;
        e.stopPropagation();
        node.classList.add('editing');
        inner.contentEditable = 'true';
        inner.focus();
        const finish = () => {
          inner.contentEditable = 'false';
          node.classList.remove('editing');
          it.text = inner.innerText;
          persist(); renderInspector();
          inner.removeEventListener('blur', finish);
        };
        inner.addEventListener('blur', finish);
      });

      layer.appendChild(node);
    });
  }

  function startInteract(e, it, node) {
    if (node.classList.contains('editing')) return;
    e.stopPropagation();
    stopPlayback();

    if (state.selectedId !== it.id) {
      state.selectedId = it.id;
      document.querySelectorAll('.ed-item').forEach(el => el.classList.toggle('selected', el.dataset.id === it.id));
      renderLayers(); renderInspector();
    }

    const dir = e.target.dataset.dir || 'move';
    const startX = e.clientX, startY = e.clientY;
    const orig = { x: it.x, y: it.y, w: it.w, h: it.h };
    const dims = stageDims();
    const gx = document.getElementById('guideX');
    const gy = document.getElementById('guideY');
    const snap = v => Math.round(v / 8) * 8;

    function onMove(ev) {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      gx.style.display = 'none'; gy.style.display = 'none';

      if (dir === 'move') {
        let nx = snap(orig.x + dx), ny = snap(orig.y + dy);
        const cx = Math.round((dims.w - it.w) / 2), cy = Math.round((dims.h - it.h) / 2);
        if (Math.abs(nx - cx) < 16) { nx = cx; gx.style.display = 'block'; }
        if (Math.abs(ny - cy) < 16) { ny = cy; gy.style.display = 'block'; }
        it.x = nx; it.y = ny;
      } else {
        if (dir.includes('e')) it.w = Math.max(48, snap(orig.w + dx));
        if (dir.includes('s')) it.h = Math.max(36, snap(orig.h + dy));
        if (dir.includes('w')) { const nw = Math.max(48, snap(orig.w - dx)); it.x = orig.x + (orig.w - nw); it.w = nw; }
        if (dir.includes('n')) { const nh = Math.max(36, snap(orig.h - dy)); it.y = orig.y + (orig.h - nh); it.h = nh; }
      }
      node.style.left = it.x + 'px'; node.style.top = it.y + 'px';
      node.style.width = it.w + 'px'; node.style.height = it.h + 'px';
    }

    function onUp() {
      gx.style.display = 'none'; gy.style.display = 'none';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      persist(); renderInspector();
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function renderLayers() {
    const list = document.getElementById('layerList');
    list.innerHTML = [...state.items].reverse().map(it => `
      <div class="ed-layer-row ${it.id === state.selectedId ? 'selected' : ''}" data-sel="${it.id}">
        <span>${it.label}</span>
        <span style="opacity:0.5;font-size:10px;">z:${it.z}</span>
      </div>
    `).join('');
    list.querySelectorAll('[data-sel]').forEach(row => {
      row.onclick = () => {
        state.selectedId = row.dataset.sel;
        renderItems(); renderLayers(); renderInspector();
      };
    });
  }

  function renderInspector() {
    const body = document.getElementById('inspectorBody');
    document.getElementById('tabEl').classList.toggle('active', state.inspectorTab === 'element');
    document.getElementById('tabTheme').classList.toggle('active', state.inspectorTab === 'theme');

    if (state.inspectorTab === 'theme') {
      body.innerHTML = Object.entries(cfg.tokenMeta).map(([cssVar, label]) => `
        <div class="ed-field">
          <label>${label} (<code>${cssVar}</code>)</label>
          <input type="color" data-tok="${cssVar}" value="${state.tokens[cssVar] || '#ffffff'}" />
        </div>
      `).join('');
      body.querySelectorAll('[data-tok]').forEach(inp => {
        inp.oninput = () => {
          state.tokens[inp.dataset.tok] = inp.value;
          applyStageLayout(); persist();
        };
      });
      return;
    }

    const it = state.items.find(x => x.id === state.selectedId);
    if (!it) {
      body.innerHTML = `<div style="opacity:0.6;font-size:12px;line-height:1.5;">Select any element on the canvas to move, resize, edit inline (double-click), or tune styles &amp; GSAP motion.</div>`;
      return;
    }

    const fontOptions = cfg.fontChoices.map(f =>
      `<option value="${f.value}" ${it.fontFamily === f.value ? 'selected' : ''}>${f.label}</option>`
    ).join('');

    body.innerHTML = `
      <div class="ed-sec-title">${it.label}</div>
      ${it.imgSrc ? '' : `<div class="ed-field"><label>Text Content</label><textarea rows="2" id="fText">${it.text || ''}</textarea></div>`}
      <div class="ed-row-2">
        <div class="ed-field"><label>X (px)</label><input type="number" id="fX" value="${it.x}" /></div>
        <div class="ed-field"><label>Y (px)</label><input type="number" id="fY" value="${it.y}" /></div>
        <div class="ed-field"><label>Width</label><input type="number" id="fW" value="${it.w}" /></div>
        <div class="ed-field"><label>Height</label><input type="number" id="fH" value="${it.h}" /></div>
      </div>
      <div class="ed-field"><label>Font Family</label><select id="fFont">${fontOptions}</select></div>
      <div class="ed-row-2">
        <div class="ed-field"><label>Font Size</label><input type="number" id="fSize" value="${it.fontSize || 36}" /></div>
        <div class="ed-field"><label>Radius</label><input type="number" id="fRad" value="${it.radius || 0}" /></div>
        <div class="ed-field"><label>Text Color</label><input type="color" id="fCol" value="${toHex(it.color, '#ffffff')}" /></div>
        <div class="ed-field"><label>Background</label><input type="color" id="fBg" value="${toHex(it.bg, '#064e35')}" /></div>
      </div>
      <div class="ed-row-2">
        <div class="ed-field"><label>Padding</label><input type="number" id="fPad" value="${it.padding || 0}" /></div>
        <div class="ed-field"><label>Align</label>
          <select id="fAlign">
            <option value="left" ${it.align==='left'?'selected':''}>Left</option>
            <option value="center" ${it.align==='center'?'selected':''}>Center</option>
            <option value="right" ${it.align==='right'?'selected':''}>Right</option>
          </select>
        </div>
      </div>
      <div class="ed-sec-title" style="margin-top:6px;">GSAP Motion</div>
      <div class="ed-field">
        <label>Entrance Preset</label>
        <select id="fAnim">
          <option value="popCard" ${it.anim==='popCard'?'selected':''}>Pop &amp; Tilt Settle</option>
          <option value="fadeUp" ${it.anim==='fadeUp'?'selected':''}>Snappy Fade Up</option>
          <option value="slideLeft" ${it.anim==='slideLeft'?'selected':''}>Slide From Right</option>
          <option value="sweepX" ${it.anim==='sweepX'?'selected':''}>Horizontal Ribbon Sweep</option>
          <option value="none" ${it.anim==='none'?'selected':''}>Static</option>
        </select>
      </div>
      <div class="ed-row-2">
        <div class="ed-field"><label>Delay (s)</label><input type="number" step="0.05" id="fDelay" value="${it.delay || 0}" /></div>
        <div class="ed-field"><label>Duration (s)</label><input type="number" step="0.05" id="fDur" value="${it.duration || 0.5}" /></div>
      </div>
      <div class="ed-row-2" style="margin-top:8px;">
        <button class="ed-btn" id="btnDup">Duplicate</button>
        <button class="ed-btn ed-btn--danger" id="btnDel">Delete</button>
      </div>
    `;

    const sync = () => {
      const node = document.querySelector(`.ed-item[data-id="${it.id}"]`);
      if (node) applyItemStyles(node, node.querySelector('.ed-item-inner'), it);
      persist();
    };
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => { fn(el.value); sync(); };
    };

    bind('fText', v => { it.text = v; const el = document.querySelector(`.ed-item[data-id="${it.id}"] .ed-item-inner`); if (el) el.textContent = v; });
    bind('fX', v => it.x = +v); bind('fY', v => it.y = +v);
    bind('fW', v => it.w = Math.max(40, +v)); bind('fH', v => it.h = Math.max(30, +v));
    bind('fFont', v => it.fontFamily = v); bind('fSize', v => it.fontSize = +v);
    bind('fRad', v => it.radius = +v); bind('fCol', v => it.color = v);
    bind('fBg', v => it.bg = v); bind('fPad', v => it.padding = +v);
    bind('fAlign', v => it.align = v); bind('fAnim', v => it.anim = v);
    bind('fDelay', v => it.delay = +v); bind('fDur', v => it.duration = Math.max(0.1, +v));

    document.getElementById('btnDup').onclick = () => {
      const copy = JSON.parse(JSON.stringify(it));
      copy.id = 'el_' + Date.now(); copy.x += 24; copy.y += 24; copy.z = state.items.length + 2;
      state.items.push(copy); state.selectedId = copy.id;
      persist(); renderItems(); renderLayers(); renderInspector();
    };
    document.getElementById('btnDel').onclick = () => {
      state.items = state.items.filter(x => x.id !== it.id);
      state.selectedId = null;
      persist(); renderItems(); renderLayers(); renderInspector();
    };
  }

  function toHex(val, fallback) {
    return (typeof val === 'string' && /^#[0-9a-fA-F]{6}$/.test(val)) ? val : fallback;
  }

  function stopPlayback() {
    if (playTl) { playTl.kill(); playTl = null; }
    document.querySelectorAll('.ed-item').forEach(el => gsap.set(el, { clearProps: 'transform,opacity' }));
    document.getElementById('scrub').value = 0;
    document.getElementById('timeTxt').textContent = '0.00s';
  }

  function playPreview() {
    stopPlayback();
    state.selectedId = null;
    document.querySelectorAll('.ed-item').forEach(el => el.classList.remove('selected'));
    const tl = gsap.timeline({
      onUpdate: () => {
        document.getElementById('scrub').value = Math.round(tl.progress() * 1000);
        document.getElementById('timeTxt').textContent = tl.time().toFixed(2) + 's';
      }
    });
    state.items.forEach(it => {
      const el = document.querySelector(`.ed-item[data-id="${it.id}"]`);
      if (!el || it.anim === 'none') return;
      const d = it.duration || 0.5, t = it.delay || 0;
      if (it.anim === 'popCard') tl.fromTo(el, { opacity: 0, y: 44, scale: 0.92, rotation: -2 }, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: d, ease: 'back.out(1.25)' }, t);
      else if (it.anim === 'fadeUp') tl.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: d, ease: 'power4.out' }, t);
      else if (it.anim === 'slideLeft') tl.fromTo(el, { opacity: 0, x: 56 }, { opacity: 1, x: 0, duration: d, ease: 'power4.out' }, t);
      else if (it.anim === 'sweepX') tl.fromTo(el, { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: d, ease: 'power4.out' }, t);
    });
    playTl = tl;
  }

  function getExportText(kind) {
    if (kind === 'tokens') {
      const lines = Object.entries(state.tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n');
      return `/* Token overrides for ${cfg.channelId} */\n:root {\n${lines}\n}\n`;
    }
    if (kind === 'layout') return JSON.stringify(buildLayoutObject(), null, 2);
    return buildSceneHtml();
  }

  function wireEvents() {
    document.getElementById('btn9').onclick = () => { state.aspect = '9x16'; updateTopButtons(); applyStageLayout(); persist(); };
    document.getElementById('btn16').onclick = () => { state.aspect = '16x9'; updateTopButtons(); applyStageLayout(); persist(); };
    document.getElementById('btnDark').onclick = () => { state.dark = !state.dark; updateTopButtons(); applyStageLayout(); persist(); };
    document.getElementById('btnBn').onclick = () => { state.bn = !state.bn; updateTopButtons(); applyStageLayout(); renderItems(); persist(); };
    document.getElementById('btnGuides').onclick = () => { state.guides = !state.guides; updateTopButtons(); applyStageLayout(); };
    document.getElementById('btnReset').onclick = () => { localStorage.removeItem(STORAGE_KEY); location.reload(); };
    document.getElementById('sceneNameInput').oninput = e => {
      state.sceneName = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') || 'scene-01';
      persist();
    };

    document.getElementById('btnSaveTokens').onclick = async () => {
      try {
        const res = await fetch('/api/save', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId: cfg.channelId, kind: 'tokens', tokens: state.tokens })
        });
        const out = await res.json();
        if (!out.ok) throw new Error(out.error || 'Save failed');
        toast(`Saved ${out.file} (${out.updated} tokens patched + backup)`);
      } catch (err) { toast('Error: ' + err.message, true); }
    };

    document.getElementById('btnSaveScene').onclick = async () => {
      try {
        const res = await fetch('/api/save', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId: cfg.channelId, kind: 'scene', sceneName: state.sceneName,
            layout: buildLayoutObject(), sceneHtml: buildSceneHtml()
          })
        });
        const out = await res.json();
        if (!out.ok) throw new Error(out.error || 'Save failed');
        toast(`Saved templates/${state.sceneName}.layout.json + .html`);
      } catch (err) { toast('Error: ' + err.message, true); }
    };

    document.getElementById('btnLoadDisk').onclick = async () => {
      try {
        const res = await fetch(`/api/load?channelId=${encodeURIComponent(cfg.channelId)}&scene=${encodeURIComponent(state.sceneName)}`);
        const out = await res.json();
        if (!out.ok) throw new Error(out.error || 'Not found');
        const d = out.data;
        state.aspect = d.aspect || '9x16';
        state.dark = !!d.darkMode;
        state.bn = !!d.bangla;
        if (d.tokens) state.tokens = Object.assign({}, cfg.defaultTokens, d.tokens);
        if (Array.isArray(d.elements)) state.items = d.elements;
        state.selectedId = null;
        persist(); updateTopButtons(); applyStageLayout(); renderItems(); renderLayers(); renderInspector();
        toast(`Loaded templates/${state.sceneName}.layout.json`);
      } catch (err) { toast('Load failed: ' + err.message, true); }
    };

    document.getElementById('tabEl').onclick = () => { state.inspectorTab = 'element'; renderInspector(); };
    document.getElementById('tabTheme').onclick = () => { state.inspectorTab = 'theme'; renderInspector(); };
    document.getElementById('stageEl').addEventListener('pointerdown', () => {
      state.selectedId = null; renderItems(); renderLayers(); renderInspector();
    });

    document.getElementById('imgUpload').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const it = {
        id: 'img_' + Date.now(), label: f.name, imgSrc: URL.createObjectURL(f),
        x: 240, y: 420, w: 560, h: 560, z: state.items.length + 2,
        bg: 'transparent', radius: 0, padding: 0, anim: 'fadeUp', delay: 0.2, duration: 0.5
      };
      state.items.push(it); state.selectedId = it.id;
      renderItems(); renderLayers(); renderInspector();
    };

    document.getElementById('btnPlay').onclick = playPreview;
    document.getElementById('btnStop').onclick = stopPlayback;
    document.getElementById('scrub').oninput = e => {
      if (!playTl) playPreview();
      playTl.pause(); playTl.progress(e.target.value / 1000);
    };

    const modal = document.getElementById('exportModal');
    const pre = document.getElementById('exportPreview');
    const showExp = kind => {
      activeExportTab = kind;
      modal.querySelectorAll('[data-exp]').forEach(b => b.classList.toggle('active', b.dataset.exp === kind));
      pre.textContent = getExportText(kind);
    };
    document.getElementById('btnExport').onclick = () => { modal.classList.add('open'); showExp('tokens'); };
    document.getElementById('closeModal').onclick = () => modal.classList.remove('open');
    modal.querySelectorAll('[data-exp]').forEach(b => { b.onclick = () => showExp(b.dataset.exp); });
    document.getElementById('copyExp').onclick = () => { navigator.clipboard.writeText(pre.textContent); toast('Copied to clipboard'); };
    document.getElementById('dlExp').onclick = () => {
      const names = { tokens: 'tokens-override.css', layout: `${state.sceneName}.layout.json`, scene: `${state.sceneName}.html` };
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([pre.textContent], { type: 'text/plain;charset=utf-8' }));
      a.download = names[activeExportTab];
      a.click();
    };

    window.addEventListener('resize', applyStageLayout);
  }

  function updateTopButtons() {
    document.getElementById('btn9').classList.toggle('active', state.aspect === '9x16');
    document.getElementById('btn16').classList.toggle('active', state.aspect === '16x9');
    document.getElementById('btnDark').classList.toggle('active', state.dark);
    document.getElementById('btnBn').classList.toggle('active', state.bn);
    document.getElementById('btnGuides').classList.toggle('active', state.guides);
  }

  buildShell();
  applyStageLayout();
  renderShelf();
  renderItems();
  renderLayers();
  renderInspector();
  wireEvents();
  detectBridge();
})();
