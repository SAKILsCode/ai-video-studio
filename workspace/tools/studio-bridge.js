#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3005);
const HOST = process.env.HOST || '0.0.0.0';
const CHANNELS_DIR = path.resolve(__dirname, '..', 'channels');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
  '.mp3':  'audio/mpeg',
  '.woff2':'font/woff2'
};

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function safeId(str) {
  return typeof str === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(str);
}

function resolveChannelDir(channelId) {
  if (!safeId(channelId)) return null;
  const dir = path.resolve(CHANNELS_DIR, channelId);
  if (!dir.startsWith(CHANNELS_DIR + path.sep)) return null;
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;
  return dir;
}

function hexToRgb(hex) {
  if (typeof hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function backupFile(channelDir, filename) {
  const src = path.join(channelDir, filename);
  if (!fs.existsSync(src)) return;
  const backupDir = path.join(channelDir, '.backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(src, path.join(backupDir, `${filename}.${stamp}.bak`));

  // Keep only the 10 most recent backups per file prefix
  const backups = fs.readdirSync(backupDir)
    .filter(f => f.startsWith(filename + '.'))
    .sort();
  while (backups.length > 10) {
    const oldest = backups.shift();
    try { fs.unlinkSync(path.join(backupDir, oldest)); } catch (_) {}
  }
}

function patchTokensCss(cssText, tokenMap) {
  let out = cssText;
  let updated = 0;
  for (const [key, val] of Object.entries(tokenMap || {})) {
    if (!/^--[a-zA-Z0-9_-]+$/.test(key) || typeof val !== 'string') continue;
    const cleanVal = val.replace(/[;\r\n}]/g, '').trim();
    const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${esc}\\s*:\\s*)([^;]+)(;)`);
    if (re.test(out)) {
      out = out.replace(re, `$1${cleanVal}$3`);
      updated++;
    }
    const rgb = hexToRgb(cleanVal);
    if (rgb) {
      const rgbRe = new RegExp(`(${esc}-rgb\\s*:\\s*)([^;]+)(;)`);
      if (rgbRe.test(out)) {
        out = out.replace(rgbRe, `$1${rgb}$3`);
      }
    }
  }
  return { css: out, updated };
}

function renderDashboard() {
  const entries = fs.existsSync(CHANNELS_DIR)
    ? fs.readdirSync(CHANNELS_DIR, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('.'))
    : [];

  const cards = entries.map(d => {
    const base = path.join(CHANNELS_DIR, d.name);
    const hasEditor = fs.existsSync(path.join(base, 'editor.html'));
    const hasPreview = fs.existsSync(path.join(base, 'preview-kit.html'));
    return `
      <div class="card">
        <div class="name">${d.name}</div>
        <div class="links">
          ${hasEditor ? `<a class="btn gold" href="/${d.name}/editor.html">Open Visual Editor</a>` : `<span class="muted">No editor.html yet</span>`}
          ${hasPreview ? `<a class="btn" href="/${d.name}/preview-kit.html">Preview Kit</a>` : ''}
        </div>
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI Video Studio — Local Channel Bridge</title>
  <style>
    body{margin:0;background:#0b0f0e;color:#e8efec;font-family:Inter,system-ui,sans-serif;padding:40px;}
    h1{margin:0 0 8px;color:#f4be52;font-size:22px;}
    p{margin:0 0 28px;color:#93b5a7;font-size:14px;}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;max-width:1080px;}
    .card{background:#121917;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:14px;}
    .name{font-family:monospace;font-size:15px;font-weight:700;}
    .links{display:flex;gap:8px;flex-wrap:wrap;}
    .btn{padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);color:#eef4f2;text-decoration:none;font-size:12px;font-weight:600;background:rgba(255,255,255,0.06);}
    .btn.gold{background:#e5a93c;color:#101a16;border-color:transparent;}
    .muted{font-size:12px;color:#6c7d76;}
  </style>
</head>
<body>
  <h1>Local Channel Studio Bridge</h1>
  <p>Serving isolated channel folders from <code>${CHANNELS_DIR}</code> · Direct disk save enabled</p>
  <div class="grid">${cards || '<div class="muted">No channel folders found.</div>'}</div>
</body>
</html>`;
}

function readJsonBody(req, limitBytes = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    req.on('data', chunk => {
      total += chunk.length;
      if (total > limitBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch (err) { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(parsed.pathname);

  if (req.method === 'GET' && pathname === '/api/ping') {
    return sendJson(res, 200, { ok: true, channelsDir: CHANNELS_DIR });
  }

  if (req.method === 'GET' && pathname === '/api/load') {
    const channelId = parsed.searchParams.get('channelId');
    const sceneName = parsed.searchParams.get('scene') || 'default';
    const dir = resolveChannelDir(channelId);
    if (!dir || !safeId(sceneName)) return sendJson(res, 400, { ok: false, error: 'Invalid channelId or scene name' });
    const file = path.join(dir, 'templates', `${sceneName}.layout.json`);
    if (!fs.existsSync(file)) return sendJson(res, 404, { ok: false, error: 'Scene not found on disk' });
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      return sendJson(res, 200, { ok: true, data });
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: err.message });
    }
  }

  if (req.method === 'POST' && pathname === '/api/save') {
    try {
      const body = await readJsonBody(req);
      const dir = resolveChannelDir(body.channelId);
      if (!dir) return sendJson(res, 400, { ok: false, error: 'Invalid or unknown channelId' });

      if (body.kind === 'tokens') {
        const tokensPath = path.join(dir, 'tokens.css');
        if (!fs.existsSync(tokensPath)) return sendJson(res, 404, { ok: false, error: 'tokens.css not found' });
        backupFile(dir, 'tokens.css');
        const original = fs.readFileSync(tokensPath, 'utf8');
        const { css, updated } = patchTokensCss(original, body.tokens);
        fs.writeFileSync(tokensPath, css, 'utf8');
        return sendJson(res, 200, { ok: true, file: `${body.channelId}/tokens.css`, updated });
      }

      if (body.kind === 'scene') {
        const sceneName = safeId(body.sceneName) ? body.sceneName : 'default';
        const tplDir = path.join(dir, 'templates');
        fs.mkdirSync(tplDir, { recursive: true });
        const jsonPath = path.join(tplDir, `${sceneName}.layout.json`);
        const htmlPath = path.join(tplDir, `${sceneName}.html`);
        if (body.layout) fs.writeFileSync(jsonPath, JSON.stringify(body.layout, null, 2), 'utf8');
        if (typeof body.sceneHtml === 'string') fs.writeFileSync(htmlPath, body.sceneHtml, 'utf8');
        return sendJson(res, 200, {
          ok: true,
          files: [`${body.channelId}/templates/${sceneName}.layout.json`, `${body.channelId}/templates/${sceneName}.html`]
        });
      }

      return sendJson(res, 400, { ok: false, error: 'Unsupported save kind' });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(renderDashboard());
  }

  // Static file server strictly scoped to CHANNELS_DIR
  const rel = pathname.replace(/^\/+/, '');
  const resolved = path.resolve(CHANNELS_DIR, rel);
  if (!resolved.startsWith(CHANNELS_DIR + path.sep) || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not Found');
  }

  const ext = path.extname(resolved).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(resolved).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Studio Bridge running at http://localhost:${PORT}/`);
  console.log(`Channels root: ${CHANNELS_DIR}`);
});
