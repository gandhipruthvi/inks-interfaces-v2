import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/secondary.css';

import { bootstrapApp } from '../main.js';

// three.js loads only on pages that show a 3D scene
function lazyScene(selector, load) {
  const el = document.querySelector(selector);
  if (el) load().then((init) => init(el));
}

// Four-act road, vertical: the car dashes to each act (a quick drive with a small
// overshoot), waits there, then dashes on. Arriving lights the act; the trail fills behind.
function initRoad(section) {
  const road = section.querySelector('.road');
  const path = road.querySelector('.road-lane');
  const trail = road.querySelector('.road-trail');
  const car = road.querySelector('.road-car');
  const pins = [...road.querySelectorAll('.road-pins span')];
  const acts = [...section.querySelectorAll('.road-act')];
  const L = path.getTotalLength();
  const DRIVE = 850, WAIT = 2000, END_WAIT = 2600;   // ms per dash, stop at each act, pause after the last

  // path fraction at a given height (viewBox y) — y only increases along this road, so bisect
  const fractionAtY = (vy) => {
    let lo = 0, hi = 1;
    for (let k = 0; k < 24; k++) { const mid = (lo + hi) / 2; path.getPointAtLength(mid * L).y < vy ? (lo = mid) : (hi = mid); }
    return lo;
  };

  // stops sit level with each act card's middle, so they line up at any text length or width
  let sx = 1, sy = 1, stops = [0.15, 0.38, 0.62, 0.85];
  const at = (f) => { const p = path.getPointAtLength(Math.max(0, Math.min(1, f)) * L); return [p.x * sx, p.y * sy]; };
  const measure = () => {
    const r = road.getBoundingClientRect();
    if (!r.height) return;
    sx = r.width / 200; sy = r.height / 1000;
    stops = acts.map((a) => { const ar = a.getBoundingClientRect(); return fractionAtY(((ar.top + ar.height / 2 - r.top) / r.height) * 1000); });
    stops.forEach((f, i) => { const [x, y] = at(f); pins[i].style.transform = `translate(${x}px, ${y}px) rotate(-45deg)`; });
  };
  measure();
  new ResizeObserver(measure).observe(section);

  const show = (f, reached) => {
    const [x, y] = at(f), [x2, y2] = at(f + 0.004);
    car.style.transform = `translate(${x}px, ${y}px) rotate(${Math.atan2(y2 - y, x2 - x)}rad)`;
    trail.style.clipPath = `inset(0 0 ${100 - (y / road.clientHeight) * 100}% 0)`;
    pins.forEach((p, i) => p.classList.toggle('is-reached', i < reached));
    acts.forEach((a, i) => {
      a.classList.toggle('is-done', i < reached - 1);
      a.classList.toggle('is-current', i === reached - 1);
    });
  };

  // a slight overshoot past the pin, then settle back: the "bouncy" arrival
  const easeOutBack = (t) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; };

  // one lap: start -> act 1 (wait) -> act 2 (wait) -> act 3 (wait) -> act 4 (longer wait), then restart
  const lapAt = (t) => {
    let from = 0;
    for (let i = 0; i < stops.length; i++) {
      if (t < DRIVE) return [from + (stops[i] - from) * easeOutBack(t / DRIVE), i];
      t -= DRIVE;
      const wait = i === stops.length - 1 ? END_WAIT : WAIT;
      if (t < wait) return [stops[i], i + 1];
      t -= wait;
      from = stops[i];
    }
    return [stops[stops.length - 1], stops.length];
  };
  const LAP = stops.length * DRIVE + (stops.length - 1) * WAIT + END_WAIT;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { show(stops[3], 4); return; }
  let visible = false, raf = 0, start = performance.now();
  const loop = (now) => {
    raf = 0;
    if (!visible) return;
    const [f, reached] = lapAt((now - start) % LAP);
    show(f, reached);
    raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !raf) { start = performance.now(); raf = requestAnimationFrame(loop); }
  }).observe(road);
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();
  lazyScene('.block-field', () => import('../scenes/blockField.js').then((m) => m.initBlockField));
  lazyScene('.services-bento', () => import('../scenes/bentoIcons.js').then((m) => m.initBentoIcons));

  const roadmap = document.querySelector('.roadmap-section');
  if (roadmap) initRoad(roadmap);
});
