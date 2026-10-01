// Impeccable gate: the logic behind run.sh (see README.md for what each part covers).
//
//   --gate (default)  deterministic, must pass. Exit 0 pass, 1 failed, 3 could not run.
//     static layer   `impeccable@4.1.0 detect` in file mode; findings -> identities
//                    -> diffed against baseline.json. Any added OR missing identity fails.
//     runtime layer  `detect` in URL mode on the app served locally with the
//                    gesture-harness stub, 390x844, once per UI state (driver.js);
//                    identities diffed against runtime-baseline.json, both directions.
//   --review         runs the gate, then the skill's deterministic `context`, screenshots
//                    every state, and writes a review packet (BRIEF.md + REPORT.md) for
//                    agents to run the LLM critic commands. Exit = the gate's.
//   --check-review <dir>  validates a filled REPORT.md: complete, matches the file's
//                    current bytes, no open P0/P1. Exit 0 ok, 1 blocked.
//   --update         rewrites both baselines. Only with owner/operator approval.
import { spawn, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../..');
const PKG = 'impeccable@4.1.0';
const SKILL = path.join(REPO, '.agents/skills/impeccable');
// Hermetic: ignore any .impeccable/config, DESIGN.md or inline impeccable-disable
// comments, so every agent sees the same findings. Waivers live in the baselines.
const FLAGS = ['--json', '--no-config', '--no-inline-ignores', '--no-design-system'];
const STATIC_BASELINE = path.join(HERE, 'baseline.json');
const RUNTIME_BASELINE = path.join(HERE, 'runtime-baseline.json');
const HARNESS = path.join(REPO, 'design/gesture-harness');
const STATES = ['list', 'popup', 'sort', 'add', 'plans']; // driver.js defines each
// The skill's commands that run as read-only critics in --review (see README.md for the
// ones that don't and why). Grouped so the operator can fan out one agent per group.
const REVIEW_GROUPS = {
  evaluate: ['critique', 'audit'],
  refine: ['polish', 'distill', 'harden', 'onboard', 'quieter', 'bolder'],
  enhance: ['typeset', 'layout', 'colorize', 'animate', 'delight', 'overdrive'],
  fix: ['clarify', 'adapt', 'optimize'],
};
const REVIEW_COMMANDS = Object.values(REVIEW_GROUPS).flat();

function die(msg) { console.error(`IMPECCABLE ERROR: ${msg}`); process.exit(3); }

// ---------- args ----------
const args = process.argv.slice(2);
const MODES = ['--gate', '--review', '--check-review', '--update'];
const unknown = args.filter(a => a.startsWith('--') && !MODES.includes(a));
if (unknown.length) die(`unknown option ${unknown.join(' ')}\nusage: run.sh [--gate|--review|--update] [path/to/index.html] | run.sh --check-review <packet-dir>`);
const mode = args.find(a => MODES.includes(a)) || '--gate';
const positional = args.find(a => !a.startsWith('--'));

// ---------- running the pinned detector ----------
const ENV = { ...process.env, IMPECCABLE_NO_TELEMETRY: '1', DO_NOT_TRACK: '1' };
delete ENV.IMPECCABLE_BIN; // would let the shim run an arbitrary engine instead of 4.1.0's
let npxMode = '--offline'; // cache-only first: instant and works without network
const npxArgs = rest => ['-y', ...(npxMode ? [npxMode] : []), PKG, ...rest];

// Decide once how to reach the package: npm cache, else a real fetch, else fail loudly.
function ensurePackage() {
  const probe = () => spawnSync('npx', npxArgs(['--version']), { env: ENV, encoding: 'utf8', timeout: 180000 });
  let r = probe();
  if (r.status === 0 && r.stdout.trim() === '4.1.0') return;
  npxMode = null; // not cached: fetch it (bounded retries so offline fails in seconds, not minutes)
  Object.assign(ENV, { npm_config_fetch_retries: '1', npm_config_fetch_timeout: '30000' });
  console.error(`impeccable-gate: ${PKG} not in the npm cache, fetching from the registry...`);
  r = probe();
  if (r.status === 0 && r.stdout.trim() === '4.1.0') return;
  die(`cannot get ${PKG} (not in the npm cache and the registry fetch failed). ` +
      `The gate did NOT run; do not treat this as a pass.\n` +
      `${(r.stderr || '').trim().split('\n').slice(-4).join('\n')}${r.error ? '\n' + r.error.message : ''}`);
}

// The engine binary inside the npm package, for the vendored skill's launcher.
function enginePath() {
  const r = spawnSync('npx', ['-y', ...(npxMode ? [npxMode] : []), '-p', PKG, '-c', 'command -v impeccable'], { env: ENV, encoding: 'utf8' });
  const shim = r.stdout.trim();
  const plat = { linux: 'linux', darwin: 'darwin', win32: 'windows' }[process.platform], arch = { x64: 'x64', arm64: 'arm64' }[process.arch];
  const bin = shim && path.join(path.dirname(shim), '..', '@impeccable', `cli-${plat}-${arch}`, 'bin', 'impeccable');
  if (!bin || !fs.existsSync(bin)) die(`cannot locate the engine binary of ${PKG} (${shim || r.stderr.trim()})`);
  const p = spawnSync(bin, ['engine-probe'], { env: ENV, encoding: 'utf8' });
  const want = fs.readFileSync(path.join(SKILL, 'scripts/VERSION'), 'utf8').trim();
  if (p.stdout.trim() !== `impeccable-engine ${want}`) die(`engine is "${p.stdout.trim()}", the vendored skill expects ${want}`);
  return bin;
}

function parseFindings(r, what) {
  // exit 0 = no findings, 2 = findings; anything else (1 = target not scanned) is a failure to run
  if (r.status !== 0 && r.status !== 2) {
    die(`detector failed on ${what} (exit ${r.status}${r.signal ? ', ' + r.signal : ''}):\n${(r.stderr || '').trim().split('\n').slice(-6).join('\n')}`);
  }
  let a; try { a = JSON.parse(r.stdout); } catch { die(`detector output on ${what} is not JSON:\n${String(r.stdout).slice(0, 400)}`); }
  if (!Array.isArray(a)) die(`detector output on ${what} is not a findings array`);
  return a;
}

function detectFiles(files) {
  const r = spawnSync('npx', npxArgs(['detect', ...FLAGS, ...files]), { env: ENV, encoding: 'utf8', timeout: 300000, maxBuffer: 64 << 20 });
  const all = parseFindings(r, files.length === 1 ? files[0] : `${files.length} files`);
  const by = new Map(files.map(f => [path.resolve(f), []]));
  for (const f of all) {
    const k = path.resolve(f.file || '');
    if (!by.has(k)) die(`detector reported a finding for an unexpected file: ${f.file}`);
    by.get(k).push(f);
  }
  return by;
}

// ---------- static identities: rule + stable discriminator ----------
// Findings carry line 0, and clipped-overflow-container's snippet is just "<tag> clips a
// positioned child", so two clipped <div>s are indistinguishable. Those findings are
// attributed by probing: each CSS rule (or inline style) that clips is neutralised in a
// scratch copy, one at a time; the finding that disappears belongs to that selector.
// Every other rule's snippet already names the thing (a colour, a text sample), so
// rule + snippet is the identity, with " #n" for exact repeats.
const CLIP_DECL = /overflow(-[xy])?\s*:\s*(hidden|clip)/g;
const PROBED_RULES = new Set(['clipped-overflow-container']);

// Clip sites in the static file: [{label, ranges:[[start,end]]}] (char offsets in the html)
function clipSites(html) {
  const sites = [];
  const blank = s => s.replace(/[^\n]/g, ' ');
  // <style> blocks: strip comments (keeping offsets), then a brace scanner yields each
  // declaration block's selector chain.
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const base = m.index + m[0].indexOf('>') + 1;
    const css = m[1].replace(/\/\*[\s\S]*?\*\//g, blank);
    const stack = []; let segStart = 0;
    for (let i = 0; i < css.length; i++) {
      const c = css[i];
      if (c === '{') { stack.push({ sel: css.slice(segStart, i).trim().replace(/\s+/g, ' '), start: i + 1 }); segStart = i + 1; }
      else if (c === '}') {
        const b = stack.pop(); segStart = i + 1;
        if (!b) continue;
        const body = css.slice(b.start, i);
        if (/[{}]/.test(body)) continue; // a container (@media etc.), not a declaration block
        const ranges = [...body.matchAll(CLIP_DECL)].map(d => [base + b.start + d.index, base + b.start + d.index + d[0].length]);
        if (ranges.length) sites.push({ label: [...stack.map(s => s.sel), b.sel].join(' > '), ranges });
      } else if (c === ';' && !stack.length) segStart = i + 1;
    }
  }
  // inline style="" attributes on static markup (outside <script>/<style>)
  const masked = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, blank);
  for (const m of masked.matchAll(/<([a-z][\w-]*)\b[^>]*?\bstyle\s*=\s*("[^"]*"|'[^']*')[^>]*>/gi)) {
    const attrAt = m.index + m[0].indexOf(m[2]);
    const ranges = [...m[2].matchAll(CLIP_DECL)].map(d => [attrAt + d.index, attrAt + d.index + d[0].length]);
    if (!ranges.length) continue;
    const id = /\bid\s*=\s*["']([^"']+)/.exec(m[0]), cls = /\bclass\s*=\s*["']([^"']+)/.exec(m[0]);
    sites.push({ label: `<${m[1].toLowerCase()}${id ? '#' + id[1] : ''}${!id && cls ? '.' + cls[1].trim().split(/\s+/).join('.') : ''} style>`, ranges });
  }
  return sites;
}

function neutralise(html, ranges) {
  let out = html;
  for (const [s, e] of [...ranges].sort((a, b) => b[0] - a[0])) out = out.slice(0, s) + out.slice(s, e).replace(/:\s*(hidden|clip)/, ': visible') + out.slice(e);
  return out;
}

function staticIdentities(file, base) {
  const ids = [];
  const probed = base.filter(f => PROBED_RULES.has(f.antipattern));
  if (probed.length) {
    const html = fs.readFileSync(file, 'utf8');
    const sites = clipSites(html);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'impeccable-probe-'));
    try {
      const files = sites.map((s, i) => { const p = path.join(tmp, `probe-${i}.html`); fs.writeFileSync(p, neutralise(html, s.ranges)); return p; });
      const res = files.length ? detectFiles(files) : new Map();
      const left = probed.map(f => ({ f, label: null }));
      const key = f => f.antipattern + '\u0000' + f.snippet;
      sites.forEach((s, i) => {
        // multiset difference base - after = what neutralising this site removed; each
        // removed finding goes to a not-yet-attributed base finding with the same key
        const removed = probed.map(key);
        for (const f of res.get(path.resolve(files[i]))) { const j = removed.indexOf(key(f)); if (j >= 0) removed.splice(j, 1); }
        for (const k of removed) { const g = left.find(g => !g.label && key(g.f) === k); if (g) g.label = s.label; }
      });
      for (const g of left) ids.push({ id: `${g.f.antipattern} @ ${g.label || 'unattributed (' + g.f.snippet + ')'}`, f: g.f });
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  }
  for (const f of base) if (!PROBED_RULES.has(f.antipattern)) ids.push({ id: `${f.antipattern} | ${f.snippet}`, f });
  const seen = new Map();
  return ids.map(x => { const n = (seen.get(x.id) || 0) + 1; seen.set(x.id, n); return { ...x, id: n > 1 ? `${x.id} #${n}` : x.id }; })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ---------- runtime identities ----------
// Runtime findings come one per element (every list row repeats the same few), so the
// identity is rule + snippet as a SET across states: a 22nd row with a known pattern is
// not new, a new pattern in any state is. The states it shows in are kept as info.
// all-caps-body's "on <n> chars" varies with each row's text, so n is dropped.
function runtimeIdentities(fs_) {
  const m = new Map();
  for (const f of fs_) {
    const snip = f.antipattern === 'all-caps-body' ? String(f.snippet).replace(/on \d+ chars/, 'on <n> chars') : f.snippet;
    const id = `${f.antipattern} | ${snip}`;
    if (!m.has(id)) m.set(id, { id, f, states: new Set() });
    m.get(id).states.add(f.state);
  }
  return [...m.values()].map(x => ({ ...x, states: STATES.filter(s => x.states.has(s)) })).sort((a, b) => a.id.localeCompare(b.id));
}

// ---------- baselines ----------
function readBaseline(p) {
  if (!fs.existsSync(p)) die(`no baseline at ${path.relative(REPO, p)} (create it with --update, owner/operator approved)`);
  let b; try { b = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { die(`${path.relative(REPO, p)} is not valid JSON: ${e.message}`); }
  if (b.tool !== PKG) die(`${path.relative(REPO, p)} was recorded with ${b.tool}, the gate runs ${PKG}`);
  return b;
}

function writeBaseline(p, ids, note, extra = {}) {
  let prev = []; try { prev = JSON.parse(fs.readFileSync(p, 'utf8')).findings || []; } catch { /* new */ }
  const reasons = new Map(prev.map(f => [f.id, f.reason]));
  const findings = ids.map(x => ({ id: x.id, ...(x.states ? { states: x.states.join(' ') } : {}), reason: reasons.get(x.id) || 'TODO: why this is accepted (owner/operator approves)' }));
  fs.writeFileSync(p, JSON.stringify({ tool: PKG, flags: FLAGS.join(' '), note, ...extra, findings }, null, 2) + '\n');
  return findings.filter(f => !reasons.has(f.id)).length;
}

function diff(baseIds, nowIds) {
  const count = a => a.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
  const b = count(baseIds), n = count(nowIds), added = [], missing = [];
  for (const [k, v] of n) for (let i = (b.get(k) || 0); i < v; i++) added.push(k);
  for (const [k, v] of b) for (let i = (n.get(k) || 0); i < v; i++) missing.push(k);
  return { added, missing };
}

// ---------- the served app (runtime layer + review screenshots) ----------
function chromeExe() {
  if (process.env.CHROME) return process.env.CHROME;
  try {
    const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
    if (d) return `/opt/pw-browsers/${d}/chrome-linux/chrome`;
  } catch { /* none */ }
  return null;
}

// Serves the file under test with driver.js first in <head>, the Supabase stub, vendored
// Leaflet + Archivo; everything else 404s. /__hold?k=<key> stays open until the driver
// reports /__ready?k=<key>[&fail=why] (or 30s), so a "network idle" wait covers reaching
// the state.
async function serveApp(file) {
  const ownStub = path.join(path.dirname(file), 'design/gesture-harness/stub.js'); // the build's own fixture
  const stub = fs.existsSync(ownStub) ? ownStub : path.join(HARNESS, 'stub.js');
  const V = path.join(HARNESS, 'vendor');
  const driver = fs.readFileSync(path.join(HERE, 'driver.js'), 'utf8');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<head[^>]*>/i, m => `${m}\n<script>${driver}</script>`)
    .replace(/https:\/\/unpkg\.com\/leaflet@[^"']*\/leaflet\.(js|css)/g, '/v/leaflet.$1')
    .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/[^"']*/g, '/v/stub.js')
    .replace(/https:\/\/fonts\.googleapis\.com\/css2[^"']*/g, '/v/archivo.css');
  if (!html.includes('<script>' + driver)) die('runtime layer: the page has no <head> to inject the state driver into');
  const fontCss = fs.readFileSync(path.join(V, 'archivo.css'), 'utf8').replace(/https:\/\/fonts\.gstatic\.com\/[^)]*\/([^/)]+\.woff2)/g, '/v/$1');
  const routes = {
    '/': ['text/html', html], '/index.html': ['text/html', html],
    '/v/stub.js': ['application/javascript', fs.readFileSync(stub)],
    '/v/leaflet.js': ['application/javascript', fs.readFileSync(path.join(V, 'leaflet.js'))],
    '/v/leaflet.css': ['text/css', fs.readFileSync(path.join(V, 'leaflet.css'))],
    '/v/archivo.css': ['text/css', fontCss],
  };
  for (const f of fs.readdirSync(V).filter(f => f.endsWith('.woff2'))) routes['/v/' + f] = ['font/woff2', fs.readFileSync(path.join(V, f))];
  const holds = new Map(), result = new Map();
  const release = k => { for (const res of holds.get(k) || []) { res.writeHead(204); res.end(); } holds.delete(k); };
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'), k = u.searchParams.get('k') || '';
    if (u.pathname === '/__hold') {
      if (result.has(k)) { res.writeHead(204); return res.end(); }
      holds.set(k, [...(holds.get(k) || []), res]);
      setTimeout(() => { if (!result.has(k)) result.set(k, 'timeout (driver never reported)'); release(k); }, 30000).unref();
      return;
    }
    if (u.pathname === '/__ready') { result.set(k, u.searchParams.get('fail') || 'ok'); res.writeHead(204); res.end(); return release(k); }
    const r = routes[u.pathname];
    res.writeHead(r ? 200 : 404, { 'content-type': r ? r[0] : 'text/plain', 'cache-control': 'no-store' }); res.end(r ? r[1] : '');
  });
  await new Promise(ok => srv.listen(0, '127.0.0.1', ok));
  const origin = `http://127.0.0.1:${srv.address().port}`;
  return { origin, result, stub, close: () => { srv.close(); srv.closeAllConnections?.(); } };
}

async function runtimeFindings(file) {
  const exe = chromeExe();
  if (!exe || !fs.existsSync(exe)) die('runtime layer: no Chromium found (set CHROME=/path/to/chrome); the gate did NOT run');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'impeccable-rt-'));
  // Root needs --no-sandbox and the detector only takes a browser path, so wrap it. The
  // dead proxy keeps it hermetic: non-loopback requests (map tiles) fail fast instead of
  // leaving through the sandbox proxy; loopback is never proxied.
  const wrap = path.join(tmp, 'chrome.sh');
  fs.writeFileSync(wrap, `#!/bin/sh\nexec "${exe}"${process.getuid?.() === 0 ? ' --no-sandbox' : ''} --proxy-server=http://127.0.0.1:9 "$@"\n`, { mode: 0o755 });
  const app = await serveApp(file);
  const env = { ...ENV, IMPECCABLE_BROWSER: wrap, PUPPETEER_EXECUTABLE_PATH: wrap, NO_PROXY: '127.0.0.1,localhost', no_proxy: '127.0.0.1,localhost' };
  const scan = url => new Promise(ok => {
    const p = spawn('npx', npxArgs(['detect', ...FLAGS, '--viewport', '390x844', url]), { env });
    let stdout = '', stderr = ''; p.stdout.on('data', d => stdout += d); p.stderr.on('data', d => stderr += d);
    const t = setTimeout(() => p.kill('SIGKILL'), 180000);
    p.on('close', (status, signal) => { clearTimeout(t); ok({ status, signal, stdout, stderr }); });
  });
  const out = { findings: [], states: {}, stub: app.stub };
  try {
    for (const s of STATES) { // one scan per state, each a fresh browser
      const url = `${app.origin}/?state=${s}&k=scan-${s}`;
      const found = parseFindings(await scan(url), url);
      const st = app.result.get(`scan-${s}`);
      if (st === 'n/a') { out.states[s] = 'n/a'; continue; }
      if (st !== 'ok') die(`runtime state "${s}" was not reached (${st || 'driver never ran'}); its scan is not trustworthy`);
      out.states[s] = found.length;
      for (const f of found) out.findings.push({ ...f, state: s });
    }
    return out;
  } finally { app.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
}

// ---------- gate ----------
function staticLayer(file) {
  const ids = staticIdentities(file, detectFiles([file]).get(file));
  return ids;
}

function report(label, bl, ids, extraInfo = '') {
  const { added, missing } = diff(bl.findings.map(f => f.id), ids.map(x => x.id));
  const ok = !added.length && !missing.length;
  console.log(ok
    ? `IMPECCABLE ${label} ok: ${ids.length}/${bl.findings.length} baseline findings, 0 new, 0 missing${extraInfo}`
    : `IMPECCABLE ${label} FAILED: ${ids.length} findings vs ${bl.findings.length} baseline, ${added.length} new, ${missing.length} missing${extraInfo}`);
  for (const k of added) { const x = ids.find(x => x.id === k); console.log(`  + NEW      ${k}${x?.states ? `  [${x.states.join(' ')}]` : ''}  (${x?.f.severity} ${x?.f.name})`); }
  for (const k of missing) console.log(`  - MISSING  ${k}  (fixed or no longer rendered? the owner/operator approves \`run.sh --update\`)`);
  return ok;
}

async function gate(file, { update = false } = {}) {
  const rel = path.relative(process.cwd(), file).startsWith('..') ? file : path.relative(process.cwd(), file);
  const sids = staticLayer(file);
  const rt = await runtimeFindings(file);
  const rids = runtimeIdentities(rt.findings);
  const statesInfo = Object.entries(rt.states).map(([k, v]) => `${k} ${v === 'n/a' ? 'n/a' : v}`).join(', ');
  if (update) {
    const a = writeBaseline(STATIC_BASELINE, sids, 'Accepted static (file-mode) findings. Changes need owner/operator approval: only `run.sh --update` writes this file.');
    const b = writeBaseline(RUNTIME_BASELINE, rids, 'Accepted runtime (URL-mode, 390x844, stub fixture) findings, as a set across UI states. Changes need owner/operator approval.', { states: rt.states });
    console.log(`IMPECCABLE baselines rewritten from ${rel}: static ${sids.length}, runtime ${rids.length} (states: ${statesInfo})${a + b ? `; ${a + b} need a reason (TODO)` : ''}`);
    return true;
  }
  const okS = report('static', readBaseline(STATIC_BASELINE), sids, `  (${rel})`);
  const rbl = readBaseline(RUNTIME_BASELINE);
  const okR = report('runtime', rbl, rids, `  (states: ${statesInfo})`);
  const naNow = Object.keys(rt.states).filter(s => rt.states[s] === 'n/a').sort().join(' ');
  const naBase = Object.keys(rbl.states || {}).filter(s => rbl.states[s] === 'n/a').sort().join(' ');
  if (naNow !== naBase) console.log(`  note: states n/a here [${naNow}] vs baseline [${naBase}]: a build that adds/removes a UI state needs its runtime baseline reviewed`);
  const ok = okS && okR;
  console.log(ok ? 'IMPECCABLE GATE PASSED' : 'IMPECCABLE GATE FAILED');
  return ok;
}

// ---------- review packet ----------
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

async function screenshots(file, dir) {
  const require = createRequire(import.meta.url);
  let chromium; try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); } catch { try { ({ chromium } = require('playwright')); } catch { return 'skipped: playwright not found'; } }
  const exe = chromeExe(); if (!exe) return 'skipped: no Chromium';
  const app = await serveApp(file);
  // the same dead proxy as the detector's wrapper (Chromium never proxies loopback)
  const browser = await chromium.launch({ executablePath: exe, args: ['--proxy-server=http://127.0.0.1:9'] });
  const done = [];
  try {
    fs.mkdirSync(dir, { recursive: true });
    for (const s of STATES) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      await page.goto(`${app.origin}/?state=${s}&k=shot-${s}`);
      const t0 = Date.now();
      while (!app.result.has(`shot-${s}`) && Date.now() - t0 < 30000) await new Promise(r => setTimeout(r, 100));
      const st = app.result.get(`shot-${s}`);
      if (st === 'ok') { await page.screenshot({ path: path.join(dir, `${s}@3x.png`) }); done.push(s); }
      else done.push(`${s}:${st || 'timeout'}`);
      await ctx.close();
    }
  } finally { await browser.close(); app.close(); }
  return done.join(' ');
}

function reviewBrief(file, meta) {
  const cmds = Object.entries(REVIEW_GROUPS).map(([g, cs]) => `- **${g}**: ${cs.map(c => `\`${c}\``).join(', ')}`).join('\n');
  return `# Impeccable review packet

Generated by \`design/impeccable-gate/run.sh --review\`. File under test: \`${meta.file}\`
(sha256 \`${meta.sha256.slice(0, 16)}\`, ${meta.date}). Deterministic gate result: **${meta.gate}**
(full output in \`gate.txt\`). Skill context output: \`context.txt\`. Screenshots at 390x844 @3x
in \`shots/\` (not committed): ${meta.shots}.

## What to do (operator)

Run the ${REVIEW_COMMANDS.length} Impeccable critic commands below against the file under test,
filling one \`## <command>\` section of \`REPORT.md\` each. Fan out one agent per group (or one agent
for all); each agent gets this brief. Then \`design/impeccable-gate/run.sh --check-review ${meta.dirRel}\`.

${cmds}

Not run here, by design: \`init\`, \`document\`, \`extract\` (write PRODUCT.md / DESIGN.md / tokens:
owner decisions, one-time), \`shape\`, \`craft\` (build flows: the designer's tools in the concept
stage), \`live\` (interactive browser variant mode, needs a human at a browser), \`pin\`, \`hooks\`,
\`doctor\` (housekeeping).

## What to do (each critic agent)

1. Read \`.agents/skills/impeccable/SKILL.md\`, then for your command
   \`.agents/skills/impeccable/reference/<command>.md\` (and anything it links). That reference is the
   command definition: follow its assessment steps.
2. **Read-only.** Do not edit \`index.html\` or any tracked file; a critic run reports, it never
   applies. Where the reference says to make changes, write what you would change as findings.
   Skip steps that ask the user questions or persist state (\`critique-storage\`, \`.impeccable/\`).
3. Context in place of PRODUCT.md (this repo has none): \`CLAUDE.md\` (UX principles, team process),
   \`design/inspo/project/\` (the visual language: vintage travel labels, matchbooks, national-park
   posters; paper/ink tokens), the relevant \`docs/shipped.md\` sections. Mode: **Operate** (a
   personal trip-planning tool used one-handed on an iPhone). The brief wins over the skill's
   taste: the owner-approved look is not a defect because a generic rule dislikes it
   (e.g. cream \`--paper\` is the brand; see \`baseline.json\` reasons).
4. Use the screenshots, the stub-served app (\`node design/gesture-harness/...\` or the gate's
   states) and the source. Static detector findings are already covered by the gate: don't
   re-report them unless you judge their baseline reason wrong.
5. Severity is the skill's own P0-P3 scale (reference/critique.md "Issue Severity"):
   P0 blocking, P1 major, P2 minor, P3 polish. Taste-only commands (\`bolder\`, \`quieter\`,
   \`delight\`, \`overdrive\`, \`colorize\`) cap at P2 unless the issue is functional or a11y.
6. Fill your section in \`REPORT.md\`: set \`Status: done\`, a one-line verdict, and one table row per
   finding. Leave \`Disposition\` as \`open\`; dispositions are set by the designer/UX/CD loop.

## What blocks merge

\`--check-review\` fails while any section is not \`Status: done\`, the report's sha256 is not the
file's current one, or any **P0 or P1** row has disposition \`open\`. P0/P1 go to the designer → UX →
CD loop (CLAUDE.md team process), whose dispositions are \`fixed <sha>\`, \`accepted: <who> <why>\`
(CD for design calls, owner for scope) or \`backlog: <ref>\` (P1 only). P2/P3 never block; they are
recorded for the CD's execution review.
`;
}

function reportSkeleton(meta) {
  const sections = REVIEW_COMMANDS.map(c => `## ${c}

Status: TODO
Verdict:

| # | Severity | Finding | Where | Disposition |
|---|---|---|---|---|
`).join('\n');
  return `# Impeccable review report

sha256: ${meta.sha256}
file: ${meta.file}
generated: ${meta.date}

${sections}`;
}

async function review(file) {
  const ok = await (async () => {
    const lines = []; const log = console.log; console.log = (...a) => { lines.push(a.join(' ')); log(...a); };
    try { return [await gate(file), lines]; } finally { console.log = log; }
  })();
  const [gateOk, gateLines] = ok;
  const bin = enginePath();
  const ctx = spawnSync(path.join(SKILL, 'scripts/impeccable'), ['context', '--target', file], { env: { ...ENV, IMPECCABLE_BIN: bin }, encoding: 'utf8', cwd: REPO });
  if (ctx.status !== 0) die(`skill launcher \`context\` failed (exit ${ctx.status}): ${ctx.stderr.trim().slice(0, 400)}`);
  const digest = sha(file), date = new Date().toISOString().slice(0, 10);
  const dir = path.join(HERE, 'reviews', `${date}-${digest.slice(0, 12)}`);
  fs.mkdirSync(dir, { recursive: true });
  const shots = await screenshots(file, path.join(dir, 'shots')).catch(e => `failed: ${e.message.split('\n')[0]}`);
  const meta = { file: path.relative(REPO, file).startsWith('..') ? file : path.relative(REPO, file), sha256: digest, date, gate: gateOk ? 'PASSED' : 'FAILED', shots, dirRel: path.relative(REPO, dir) };
  fs.writeFileSync(path.join(dir, 'gate.txt'), gateLines.join('\n') + '\n');
  fs.writeFileSync(path.join(dir, 'context.txt'), ctx.stdout);
  fs.writeFileSync(path.join(dir, 'BRIEF.md'), reviewBrief(file, meta));
  if (!fs.existsSync(path.join(dir, 'REPORT.md'))) fs.writeFileSync(path.join(dir, 'REPORT.md'), reportSkeleton(meta));
  console.log(`IMPECCABLE review packet: ${meta.dirRel}/ (BRIEF.md, REPORT.md). PENDING: run the ${REVIEW_COMMANDS.length} critic commands per BRIEF.md, then run.sh --check-review ${meta.dirRel}`);
  return gateOk;
}

function checkReview(dir) {
  const rp = path.join(dir, 'REPORT.md');
  if (!fs.existsSync(rp)) die(`no REPORT.md in ${dir}`);
  const txt = fs.readFileSync(rp, 'utf8');
  const problems = [];
  const fileLine = /^file: (.+)$/m.exec(txt)?.[1]?.trim(), shaLine = /^sha256: ([0-9a-f]{64})$/m.exec(txt)?.[1];
  const target = fileLine && path.resolve(REPO, fileLine);
  if (!target || !fs.existsSync(target)) problems.push(`report names no existing file (${fileLine})`);
  else if (sha(target) !== shaLine) problems.push(`stale: ${fileLine} changed since this review (re-run --review)`);
  let rows = 0, blocking = 0;
  for (const c of REVIEW_COMMANDS) {
    const m = new RegExp(`^## ${c}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(txt);
    if (!m) { problems.push(`missing section: ${c}`); continue; }
    const body = m[1];
    if (!/^Status:\s*done\s*$/mi.test(body)) problems.push(`${c}: not done`);
    if (!/^Verdict:\s*\S/m.test(body)) problems.push(`${c}: no verdict`);
    for (const line of body.split('\n').filter(l => /^\|\s*[^|#-]/.test(l) && !/^\|\s*#\s*\|/.test(l))) {
      const cells = line.split('|').slice(1, -1).map(s => s.trim());
      if (cells.length < 5) { problems.push(`${c}: malformed row: ${line}`); continue; }
      rows++;
      const [n, sev, , , disp] = cells;
      if (!/^P[0-3]$/.test(sev)) { problems.push(`${c} #${n}: severity "${sev}" is not P0-P3`); continue; }
      const dispOk = /^(fixed \S+|accepted: \S.*)$/.test(disp) || (sev === 'P1' && /^backlog: \S/.test(disp));
      if ((sev === 'P0' || sev === 'P1') && !dispOk) { blocking++; problems.push(`${c} #${n}: ${sev} needs designer/UX/CD disposition (is "${disp || 'empty'}")`); }
    }
  }
  if (problems.length) {
    console.log(`IMPECCABLE review BLOCKED: ${problems.length} problem(s), ${blocking} open P0/P1, ${rows} findings recorded  (${path.relative(REPO, dir)})`);
    for (const p of problems) console.log(`  - ${p}`);
    return false;
  }
  console.log(`IMPECCABLE review ok: ${REVIEW_COMMANDS.length}/${REVIEW_COMMANDS.length} commands done, ${rows} findings, 0 open P0/P1  (${path.relative(REPO, dir)})`);
  return true;
}

// ---------- main ----------
if (mode === '--check-review') {
  if (!positional) die('usage: run.sh --check-review <packet-dir>');
  process.exit(checkReview(path.resolve(positional)) ? 0 : 1);
}
const FILE = path.resolve(positional || path.join(REPO, 'index.html'));
if (!fs.existsSync(FILE)) die(`no such file: ${FILE}`);
ensurePackage();
if (mode === '--update') { await gate(FILE, { update: true }); process.exit(0); }
if (mode === '--review') process.exit((await review(FILE)) ? 0 : 1);
process.exit((await gate(FILE)) ? 0 : 1);
