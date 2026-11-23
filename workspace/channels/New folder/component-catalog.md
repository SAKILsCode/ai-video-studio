## Diagrams and Workflows (Batch 4)
Load `motion-presets.diagrams.js` after `motion-presets.js`. `flow`, `timeline` and `split` lay out vertically in 9:16 and horizontally in 16:9 with the same markup (`--h` / `--v` force an axis). In layout JSON, container components take their children as `props.items`. Presets given a container (flow, cycle, checklist, layers) expand to its children. Do not set `pathLength` on SVG edges.

- `cc-flow` [`--h` `--v` `--wrap`] holds nodes, steps and edges in DOM order. Preset: `flowSequence` (items enter, edges draw, interleaved).
- `cc-node` [`--primary` `--muted` `--accent` `--ghost`] parts `__icon` `__label` `__sub`. Presets: `nodeEnter`, `nodePulse`.
- `cc-edge` [`--solid` `--dashed` `--arrow` `--accent`] is a `<span>` placed between nodes inside `cc-flow`. Free form: `<svg class="cc-edge__svg" viewBox="0 0 W H"><path class="cc-edge__path" data-draw d="..."/><path class="cc-edge__head" d="..."/></svg>` (variants `cc-edge__path--dashed`, `cc-edge__path--accent`; the head path goes right after its path). Preset: `drawPath`.
- `cc-step` [`--active` `--done`] parts `__num` `__text` `__title` `__body`. Preset: `stepAdvance`.
- `cc-timeline` [`--h` `--v`] parts `__item` (contains `__dot` `__label` `__text`). Preset: `stepAdvance` (items stay lit, segments fill).
- `cc-split` [`--before-after` `--versus` `--wipe` `--h` `--v`] parts `__a` `__b` `__divider`. Preset: `splitWipe`.
- `cc-checklist` (`<ul>`) parts `__item` [`--todo` `--done` `--fail`] `__tick` `__text`. Preset: `checkTick`.
- `cc-matrix` [`--2x2`] parts `__axis` [`--x` `--y`] `__cell` [`--hl`]. Put both axes first, then 4 cells. Use `fadeUp` or `nodeEnter` on cells.
- `cc-cycle` (set `style="--n:4"`) parts `__ring` `__hub` `__item` (set `style="--i:0"`; each item is an empty anchor wrapping one `cc-node`). Presets: `nodeEnter` (on the cycle), `cycleSpin`.
- `cc-layers` parts `__layer` [`--primary` `--accent` `--ghost`] (optional `style="--i:N"` insets a layer). Preset: `layersStack`.
- `cc-callout` [`--box` `--circle` `--arrow`] part `__text`. Place it inside the same slot as its target, as a sibling. Position with `style="--cx:..%;--cy:..%"` (`--box` and `--circle` also need `--cw` `--ch`). For `--arrow`, `--cx` / `--cy` is the pointer tip. Preset: `calloutIn`.
- `cc-bridge`, `cc-tiles`: unchanged (see Batch 1).

Presets (`CCMotion.name(tl, target, at, opts)`):
`drawPath` {dur, ease, stagger, head} · `nodeEnter` {dur, stagger, dist, times} · `nodePulse` {count, dur, peak} · `connectFlow(tl, a, edge, b, at, {dur, edgeDur, enterA})` · `flowSequence` {dur, edgeDur, times} · `stepAdvance` {gap, times, dur, keep, finish} · `splitWipe` {dur, ease, from, to} · `checkTick` {stagger, dur, times, fail} · `calloutIn` {dur, stagger} · `layersStack` {dur, stagger, dist, from, times} · `cycleSpin` {turns, dur, from, ease}.
`times` is an array of absolute seconds taken from `timestamps.json`.

### HTML: flow with arrow edges and a callout
```html
<div class="cc-slot" data-slot="center">
  <div class="cc-flow" data-cc="flow" id="flow_01" data-in="flowSequence" data-at="1.2" data-out="exitFade">
    <div class="cc-node cc-node--primary" data-cc="node" id="node_01"><span class="cc-node__label">Prompt</span><span class="cc-node__sub">you type</span></div>
    <span class="cc-edge cc-edge--arrow" data-cc="edge" id="edge_01"></span>
    <div class="cc-node" data-cc="node" id="node_02"><span class="cc-node__label">Claude Code</span><span class="cc-node__sub">plans and edits</span></div>
    <span class="cc-edge cc-edge--arrow cc-edge--accent" data-cc="edge" id="edge_02"></span>
    <div class="cc-node cc-node--accent" data-cc="node" id="node_03"><span class="cc-node__label">Pull request</span></div>
  </div>
  <div class="cc-callout cc-callout--arrow" data-cc="callout" id="callout_01" data-in="calloutIn" data-at="3.4" style="--cx:50%;--cy:38%"><span class="cc-callout__text">runs your tests</span></div>
</div>
```

### HTML: steps and timeline
```html
<div class="cc-slot" data-slot="center">
  <div class="cc-flow" data-cc="flow" id="flow_02" data-in="stepAdvance" data-at="1.0">
    <div class="cc-step" data-cc="step" id="step_01"><span class="cc-step__num">1</span><div class="cc-step__text"><span class="cc-step__title">Describe</span><span class="cc-step__body">Say what you want built.</span></div></div>
    <div class="cc-step" data-cc="step" id="step_02"><span class="cc-step__num">2</span><div class="cc-step__text"><span class="cc-step__title">Review</span><span class="cc-step__body">Read the diff.</span></div></div>
    <div class="cc-step" data-cc="step" id="step_03"><span class="cc-step__num">3</span><div class="cc-step__text"><span class="cc-step__title">Ship</span><span class="cc-step__body">Merge and deploy.</span></div></div>
  </div>
</div>
<div class="cc-slot" data-slot="lower">
  <div class="cc-timeline" data-cc="timeline" id="timeline_01" data-in="stepAdvance" data-at="1.0">
    <div class="cc-timeline__item" data-cc="timeline-item"><i class="cc-timeline__dot"></i><span class="cc-timeline__label">2023</span><span class="cc-timeline__text">First release</span></div>
    <div class="cc-timeline__item" data-cc="timeline-item"><i class="cc-timeline__dot"></i><span class="cc-timeline__label">2024</span><span class="cc-timeline__text">Agents</span></div>
    <div class="cc-timeline__item" data-cc="timeline-item"><i class="cc-timeline__dot"></i><span class="cc-timeline__label">2025</span><span class="cc-timeline__text">Everywhere</span></div>
  </div>
</div>
```

### HTML: split wipe and checklist
```html
<div class="cc-slot" data-slot="center">
  <div class="cc-split cc-split--before-after cc-split--wipe" data-cc="split" id="split_01" data-in="splitWipe" data-at="2.0">
    <div class="cc-split__a"><span class="cc-badge cc-badge--coral">Before</span>40 minutes{{"\n"}}by hand</div>
    <div class="cc-split__b"><span class="cc-badge cc-badge--gold">After</span>4 minutes{{"\n"}}with Claude</div>
    <div class="cc-split__divider"></div>
  </div>
</div>
<div class="cc-slot" data-slot="lower">
  <ul class="cc-checklist" data-cc="checklist" id="checklist_01" data-in="checkTick" data-at="1.5">
    <li class="cc-checklist__item"><i class="cc-checklist__tick"></i><span class="cc-checklist__text">Tests pass</span></li>
    <li class="cc-checklist__item"><i class="cc-checklist__tick"></i><span class="cc-checklist__text">Lint clean</span></li>
    <li class="cc-checklist__item"><i class="cc-checklist__tick"></i><span class="cc-checklist__text">Types check</span></li>
  </ul>
</div>
```
Replace `{{"\n"}}` with `<br>` in real HTML (or rely on `white-space: pre-line` with a literal line break).

### HTML: matrix, cycle, layers, free SVG edge
```html
<div class="cc-slot" data-slot="center">
  <div class="cc-matrix cc-matrix--2x2" data-cc="matrix" id="matrix_01">
    <span class="cc-matrix__axis cc-matrix__axis--y">Impact</span>
    <span class="cc-matrix__axis cc-matrix__axis--x">Effort</span>
    <div class="cc-matrix__cell cc-matrix__cell--hl">Quick wins</div>
    <div class="cc-matrix__cell">Big bets</div>
    <div class="cc-matrix__cell">Fill-ins</div>
    <div class="cc-matrix__cell">Avoid</div>
  </div>
</div>
<div class="cc-slot" data-slot="center">
  <div class="cc-cycle" data-cc="cycle" id="cycle_01" style="--n:4" data-in="nodeEnter" data-at="1.0">
    <div class="cc-cycle__ring"></div>
    <div class="cc-cycle__hub">Agent{{"\n"}}loop</div>
    <div class="cc-cycle__item" style="--i:0"><div class="cc-node cc-node--primary"><span class="cc-node__label">Plan</span></div></div>
    <div class="cc-cycle__item" style="--i:1"><div class="cc-node"><span class="cc-node__label">Act</span></div></div>
    <div class="cc-cycle__item" style="--i:2"><div class="cc-node"><span class="cc-node__label">Observe</span></div></div>
    <div class="cc-cycle__item" style="--i:3"><div class="cc-node cc-node--accent"><span class="cc-node__label">Adjust</span></div></div>
  </div>
</div>
<div class="cc-slot" data-slot="center">
  <div class="cc-layers" data-cc="layers" id="layers_01" data-in="layersStack" data-at="1.0">
    <div class="cc-layers__layer cc-layers__layer--accent">Your app</div>
    <div class="cc-layers__layer cc-layers__layer--primary">Claude API</div>
    <div class="cc-layers__layer cc-layers__layer--ghost">Cloud infrastructure</div>
  </div>
</div>
<div class="cc-slot" data-slot="full">
  <svg class="cc-edge__svg" data-cc="edge" id="edge_03" viewBox="0 0 1080 1920" data-in="drawPath" data-at="2.0">
    <path class="cc-edge__path cc-edge__path--accent" data-draw d="M200 400 C 500 400, 500 900, 880 900"/>
    <path class="cc-edge__head" d="M880 900 l-26 -16 v32 z"/>
  </svg>
</div>
```

### layout.json: flow plus callout (16:9, English)
```json
{
  "channelId": "ch01",
  "sceneName": "scene-02",
  "aspect": "16x9",
  "lang": "en",
  "audioRef": "audio/scene-02.mp3",
  "beats": [
    {
      "id": "beat_01",
      "start": 0.0,
      "end": 6.0,
      "polarity": "light",
      "transitionIn": null,
      "elements": [
        {
          "id": "flow_01",
          "component": "flow",
          "variant": [],
          "slot": "center",
          "props": {
            "items": [
              { "component": "node", "variant": ["primary"], "label": "Prompt", "sub": "you type" },
              { "component": "edge", "variant": ["arrow"] },
              { "component": "node", "variant": [], "label": "Claude Code", "sub": "plans and edits" },
              { "component": "edge", "variant": ["arrow", "accent"] },
              { "component": "node", "variant": ["accent"], "label": "Pull request" }
            ]
          },
          "words": [],
          "in": { "preset": "flowSequence", "at": 1.2, "opts": { "dur": 0.44, "edgeDur": 0.5 } },
          "out": { "preset": "exitFade", "at": 5.6, "opts": {} }
        },
        {
          "id": "callout_01",
          "component": "callout",
          "variant": ["arrow"],
          "slot": null,
          "props": { "host": "flow_01", "text": "runs your tests", "cx": "50%", "cy": "38%" },
          "words": [],
          "in": { "preset": "calloutIn", "at": 3.4, "opts": {} },
          "out": { "preset": "exitFade", "at": 5.6, "opts": {} }
        }
      ]
    }
  ]
}
```

### layout.json: steps then checklist (9:16, Bangla, two beats)
```json
{
  "channelId": "ch01",
  "sceneName": "scene-03",
  "aspect": "9x16",
  "lang": "bn",
  "audioRef": "audio/scene-03.mp3",
  "beats": [
    {
      "id": "beat_01",
      "start": 0.0,
      "end": 5.0,
      "polarity": "dark",
      "transitionIn": null,
      "elements": [
        {
          "id": "flow_01",
          "component": "flow",
          "variant": [],
          "slot": "center",
          "props": {
            "items": [
              { "component": "step", "num": "১", "title": "প্রম্পট লিখুন", "body": "কী চান তা বলুন" },
              { "component": "step", "num": "২", "title": "কোড তৈরি হবে", "body": "Claude কাজ করবে" },
              { "component": "step", "num": "৩", "title": "রিভিউ করুন", "body": "পরিবর্তন দেখে নিন" }
            ]
          },
          "words": [],
          "in": { "preset": "stepAdvance", "at": 0.8, "opts": { "times": [0.8, 2.1, 3.3], "finish": true } },
          "out": { "preset": "exitFade", "at": 4.6, "opts": {} }
        }
      ]
    },
    {
      "id": "beat_02",
      "start": 5.0,
      "end": 9.0,
      "polarity": "dark",
      "transitionIn": null,
      "elements": [
        {
          "id": "checklist_01",
          "component": "checklist",
          "variant": [],
          "slot": "center",
          "props": { "items": [ { "text": "টেস্ট পাস" }, { "text": "লিন্ট পাস" }, { "text": "টাইপ চেক পাস" } ] },
          "words": [],
          "in": { "preset": "checkTick", "at": 5.4, "opts": { "times": [5.6, 6.5, 7.4] } },
          "out": { "preset": "exitFade", "at": 8.6, "opts": {} }
        }
      ]
    }
  ]
}
```



## Batch 6A — Media, Transitions & Outro

Load `motion-presets.media.js` after `motion-presets.js`. Layout JSON shape below is provisional (Contract v2 in Batch 6B formalises it): `{id, cc, slot, mod[], motion[[preset, target, at, opts]]}`.
Rules: full-bleed media, PiP, subtitles and transition overlays go directly in `.cc-stage` (never inside `.cc-cam` for subtitles/overlays). Video elements: `muted playsinline`. Use `cc-subtitles` instead of `cc-caption-stage` when media is behind.

### media: full-bleed B-roll + Ken Burns
```html
<div class="cc-media cc-media--full" id="bg" data-cc="media" data-kb="in">
  <img class="cc-media__el" src="assets/broll_01.jpg" alt="">
  <div class="cc-media__scrim cc-media__scrim--bottom"></div>
</div>
```
```json
{"id":"bg","cc":"media","mod":["full"],"motion":[["kenBurns","#bg",0,{"dur":6,"dir":"in"}]]}
```

### media: framed card in a slot (mask reveal)
```html
<div class="cc-slot" data-slot="center">
  <div class="cc-media cc-media--framed cc-media--rim" id="m1" data-cc="media">
    <img class="cc-media__el" src="assets/shot.jpg" alt="">
    <span class="cc-media__tag">B-roll</span>
  </div>
</div>
```
```json
{"id":"m1","cc":"media","slot":"center","mod":["framed","rim"],"motion":[["mediaReveal","#m1",0.2,{"mode":"mask","dir":"up"}]]}
```

### media: picture-in-picture (corner: tl tr bl br)
```html
<div class="cc-media cc-media--pip cc-media--br" id="pip" data-cc="media">
  <video class="cc-media__el" src="assets/clip.mp4" muted playsinline></video>
</div>
```
```json
{"id":"pip","cc":"media","mod":["pip","br"],"motion":[["mediaReveal","#pip",1,{"mode":"scale"}]]}
```

### media-split: two panes (stacked 9:16, side by side 16:9)
```html
<div class="cc-slot" data-slot="full">
  <div class="cc-media-split" data-cc="media-split">
    <div class="cc-media cc-media--framed" id="a"><img class="cc-media__el" src="assets/a.jpg" alt=""></div>
    <div class="cc-media cc-media--framed" id="b"><img class="cc-media__el" src="assets/b.jpg" alt=""></div>
  </div>
</div>
```
```json
{"id":"split","cc":"media-split","slot":"full","motion":[["mediaReveal","#a, #b",0,{"mode":"slide","stagger":0.15}]]}
```

### subtitles: word-highlight (modes: highlight | karaoke | build)
```html
<div class="cc-subtitles cc-subtitles--plate" id="sub1" data-cc="subtitles">
  <div class="cc-subtitles__line">
    <span class="cc-subtitles__word" data-word="0">Ship</span>
    <span class="cc-subtitles__word" data-word="1">faster</span>
    <span class="cc-subtitles__word" data-word="2">today</span>
  </div>
</div>
```
```json
{"id":"sub1","cc":"subtitles","mod":["plate"],"motion":[["captionPop","#sub1",2,{"mode":"karaoke","times":[2.1,2.4,2.8],"exitAt":3.6}]]}
```
Modifiers: `--plate` `--on-media` `--top` `--lift`. Times are absolute timeline seconds.

### transitions: wipe / curtain / slash / dim
```html
<div class="cc-wipe cc-wipe--edge cc-tx--emerald" id="tx1" data-cc="wipe" data-dir="right"><div class="cc-wipe__panel"></div></div>
<div class="cc-curtain cc-tx--deep" id="tx2" data-cc="curtain" data-dir="h"><div class="cc-curtain__panel cc-curtain__panel--a"></div><div class="cc-curtain__panel cc-curtain__panel--b"></div></div>
<div class="cc-slash cc-slash--edge cc-tx--gold" id="tx3" data-cc="slash" data-dir="right"><div class="cc-slash__band"></div></div>
<div class="cc-dim cc-dim--vignette cc-tx--deep" id="tx4" data-cc="dim"></div>
```
```json
{"id":"tx1","cc":"wipe","motion":[["wipeTransition","#tx1",4,{"dur":0.7,"onPeak":{"toDark":true}}]]}
```
Swap scenes at `CCMotion.wipeTransition.peak(4, {dur:0.7})` (fully covered). Optional opts: `hold`, `coverDur`, `revealDur`, `ease`, `peak` (dim opacity).

### outro: brand sign-off + next-video card + CTA
```html
<div class="cc-slot cc-outro" data-slot="full" data-cc="outro" id="outro">
  <div class="cc-outro__brand"><div class="cc-outro__mark">C</div><div class="cc-outro__name">Basic Claude</div><i class="cc-outro__rule"></i><p class="cc-outro__signoff">See you in the next one.</p></div>
  <div class="cc-next" data-cc="next"><div class="cc-next__thumb"><img src="assets/next.jpg" alt=""><i class="cc-next__play"></i><span class="cc-next__dur">8:42</span></div>
    <div class="cc-next__meta"><span class="cc-next__eyebrow">Next up</span><h3 class="cc-next__title">Claude Code in 10 minutes</h3></div></div>
  <a class="cc-cta cc-cta--subscribe" data-cc="cta"><span class="cc-cta__icon"></span><span class="cc-cta__text"><b class="cc-cta__label">Subscribe</b><span class="cc-cta__handle">@handle</span></span></a>
</div>
```
```json
{"id":"outro","cc":"outro","slot":"full","motion":[["outroAssemble","#outro",0,{"pulses":2}]]}
```
CTA variants: `--subscribe` `--follow` `--emerald` `--white` `--ghost`. Next card: `--white` `--row`.