import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/secondary.css';

import { bootstrapApp } from '../main.js';

// three.js loads only on pages that show a 3D scene
function lazyScene(selector, load) {
  const el = document.querySelector(selector);
  if (el) load().then((init) => init(el));
}

// Four-act road: a coral marker drives the road on a loop (time-based, not
// scroll-linked). Passing a pin lights that act; the trail fills behind it.
function initRoad(section) {
  const road = section.querySelector('.road');
  const path = road.querySelector('.road-lane');
  const trail = road.querySelector('.road-trail');
  const car = road.querySelector('.road-car');
  const pins = [...road.querySelectorAll('.road-pins span')];
  const acts = [...section.querySelectorAll('.road-act')];
  const L = path.getTotalLength();
  const STOPS = [0.16, 0.39, 0.62, 0.85];       // where each act sits along the road
  const LAP = 14000, HOLD = 1800;                // ms to drive the road, then a pause at the end

  let sx = 1, sy = 1;
  const measure = () => { sx = road.clientWidth / 1200; sy = road.clientHeight / 360; };
  const at = (f) => { const p = path.getPointAtLength(f * L); return [p.x * sx, p.y * sy]; };
  const placePins = () => STOPS.forEach((f, i) => { const [x, y] = at(f); pins[i].style.transform = `translate(${x}px, ${y}px) rotate(-45deg)`; });
  measure(); placePins();
  new ResizeObserver(() => { measure(); placePins(); }).observe(road);

  const show = (f) => {
    const [x, y] = at(f), [x2, y2] = at(Math.min(1, f + 0.004));
    car.style.transform = `translate(${x}px, ${y}px) rotate(${Math.atan2(y2 - y, x2 - x)}rad)`;
    trail.style.clipPath = `inset(0 ${100 - (x / road.clientWidth) * 100}% 0 0)`;
    const reached = STOPS.filter((s) => f >= s).length;   // 0..4
    pins.forEach((p, i) => p.classList.toggle('is-reached', i < reached));
    acts.forEach((a, i) => {
      a.classList.toggle('is-done', i < reached - 1);
      a.classList.toggle('is-current', i === reached - 1);
    });
  };

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { show(1); return; }
  let visible = false, raf = 0, start = performance.now();
  const loop = (now) => {
    raf = 0;
    if (!visible) return;
    const t = (now - start) % (LAP + HOLD);
    show(Math.min(1, t / LAP));   // constant speed reads calmest
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
