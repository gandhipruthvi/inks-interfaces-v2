import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/work.css';

import { bootstrapApp } from '../main.js';
import { getLenis } from '../core/scroll.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();

  const filterChips = document.querySelectorAll('.work-filter-chip');
  const viewBtns = document.querySelectorAll('.view-btn');
  const gridContainer = document.querySelector('.work-grid');
  const listContainer = document.querySelector('.work-list');
  const preview = document.querySelector('.services-cursor-preview');
  const previewImg = preview?.querySelector('img');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Orbit gallery hero
  const orbit = document.querySelector('.work-orbit');
  if (orbit) initOrbitGallery(orbit, prefersReduced);

  // 2. View Toggle (Grid / List) & LocalStorage Persistence
  function setView(mode) {
    if (mode === 'list') {
      gridContainer.style.display = 'none';
      listContainer.style.display = 'flex';
      viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === 'list'));
    } else {
      gridContainer.style.display = 'grid';
      listContainer.style.display = 'none';
      viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === 'grid'));
    }
    try {
      localStorage.setItem('ii_work_view', mode);
    } catch (e) {}
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setView(btn.dataset.view);
    });
  });

  // Restore saved view
  try {
    const savedView = localStorage.getItem('ii_work_view');
    if (savedView === 'list') setView('list');
  } catch (e) {}

  // 3. Scope × industry filtering, synced to ?scope=&industry=
  const emptyMsg = document.querySelector('.work-empty');
  const filters = { scope: 'all', industry: 'all' };

  function applyFilters() {
    filterChips.forEach(chip => {
      const tier = 'scope' in chip.dataset ? 'scope' : 'industry';
      const on = chip.dataset[tier] === filters[tier];
      chip.classList.toggle('active', on);
      chip.setAttribute('aria-pressed', on);
    });

    let shown = 0;
    const matches = (el) =>
      (filters.scope === 'all' || el.dataset.category === filters.scope) &&
      (filters.industry === 'all' || el.dataset.industry === filters.industry);
    document.querySelectorAll('.work-grid-card').forEach(card => {
      const m = matches(card);
      card.style.display = m ? 'flex' : 'none';
      shown += m;
    });
    document.querySelectorAll('.work-list-row').forEach(row => {
      row.style.display = matches(row) ? 'grid' : 'none';
    });
    if (emptyMsg) emptyMsg.hidden = shown > 0;

    const url = new URL(window.location);
    url.searchParams.delete('filter');
    for (const [k, v] of Object.entries(filters)) {
      v === 'all' ? url.searchParams.delete(k) : url.searchParams.set(k, v);
    }
    window.history.replaceState({}, '', url);
    ScrollTrigger.refresh();
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tier = 'scope' in chip.dataset ? 'scope' : 'industry';
      filters[tier] = chip.dataset[tier];
      applyFilters();
      // the bar sits above the orbit hero, so bring the results into view
      const results = document.querySelector('.work-container');
      if (results.getBoundingClientRect().top > innerHeight * 0.5) {
        const bar = document.querySelector('.work-controls-bar').offsetHeight;
        const lenis = getLenis();
        const y = results.getBoundingClientRect().top + scrollY - bar - 80;
        lenis ? lenis.scrollTo(y, { duration: 1 }) : scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // Restore from URL (?filter= is the old single-tier param)
  const params = new URLSearchParams(window.location.search);
  filters.scope = params.get('scope') || params.get('filter') || 'all';
  filters.industry = params.get('industry') || 'all';
  if (filters.scope !== 'all' || filters.industry !== 'all') applyFilters();

  // 4. Cursor Preview for List View
  if (preview && previewImg && isFinePointer && !prefersReduced) {
    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let currentSrc = '';

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;

      gsap.set(preview, {
        x: curX + 28,
        y: curY - 180
      });
    });

    const listRows = document.querySelectorAll('.work-list-row');
    listRows.forEach(row => {
      // Kill the previous row's fade-out first: when moving row to row it was
      // still running and hid the new image a moment after it appeared.
      row.addEventListener('mouseenter', () => {
        gsap.killTweensOf(preview, 'opacity,clipPath');
        const imgSrc = row.dataset.cover;
        if (imgSrc && imgSrc !== currentSrc) {
          currentSrc = imgSrc;
          previewImg.src = imgSrc;
          gsap.fromTo(preview,
            { clipPath: 'inset(100% 0 0 0)', opacity: 1 },
            { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.35, ease: 'power3.out' }
          );
        } else {
          gsap.to(preview, { opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.2 });
        }
      });

      row.addEventListener('mouseleave', () => {
        gsap.killTweensOf(preview, 'opacity,clipPath');
        gsap.to(preview, { opacity: 0, duration: 0.2 });
      });
    });
  }
});

// Covers sit on a sphere (golden-angle spacing) squashed to the stage's shape,
// spinning slowly around the vertical axis. Near covers are big and sharp, far
// ones small, blurred and faded. Drag spins it with momentum; hovering a cover
// holds the spin and names the project; click opens the case study.
function initOrbitGallery(root, reduced) {
  const stage = root.querySelector('.wo-stage');
  const cards = [...stage.querySelectorAll('.wo-card')];
  const label = root.querySelector('.wo-label');
  const n = cards.length;
  const pts = cards.map((_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;               // -1..1, top to bottom
    const r = Math.sqrt(1 - y * y), a = i * 2.39996; // golden angle
    return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
  });

  let W = 0, H = 0, cw = 0, ch = 0;
  const copy = root.querySelector('.wo-copy');
  // the copy box (half-size, centred) is kept clear: covers fade as they cross it
  const measure = () => { W = stage.clientWidth; H = stage.clientHeight; cw = copy.offsetWidth / 2 + 40; ch = copy.offsetHeight / 2 + 30; };
  measure();
  new ResizeObserver(measure).observe(stage);

  let yaw = 0, pitch = 0.25, vel = reduced ? 0 : 0.12, held = false, drag = null, hovered = null;
  const AUTO = reduced ? 0 : 0.12;   // rad/s

  const render = () => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const base = Math.min(150, Math.max(78, W / 11));
    pts.forEach((p, i) => {
      // spin around y, then tip toward the viewer around x
      const x = p.x * cy + p.z * sy, z0 = -p.x * sy + p.z * cy;
      const y = p.y * cp - z0 * sp, z = p.y * sp + z0 * cp;     // z: -1 far .. 1 near
      const near = (z + 1) / 2;
      const s = 0.45 + near * 0.75;
      const px = x * W * 0.46, py = y * H * 0.42;
      const c = cards[i];
      c.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) rotate(var(--tilt)) scale(${s * (c === hovered ? 1.12 : 1)})`;
      c.style.zIndex = String(Math.round(near * 100));
      const inCopy = Math.max(0, 1 - Math.max(Math.abs(px) - cw, Math.abs(py) - ch, 0) / 60);   // 1 inside, 0 beyond 60px
      c.style.opacity = String((0.25 + near * 0.75) * (1 - inCopy * 0.85));
      c.style.pointerEvents = inCopy > 0.5 ? 'none' : '';
      c.style.filter = near < 0.55 ? `blur(${((0.55 - near) * 7).toFixed(1)}px)` : 'none';
      c.style.setProperty('--size', base + 'px');
    });
  };

  let last = performance.now(), visible = true;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!drag) {
      const target = held ? 0 : AUTO;
      vel += (target - vel) * Math.min(1, dt * 2.5);     // momentum eases back to the idle spin
      yaw += vel * dt;
      pitch += (0.25 - pitch) * dt * 1.5;
    }
    render();
    if (visible) requestAnimationFrame(loop); else raf = 0;
  };
  let raf = requestAnimationFrame(loop);
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }).observe(root);

  // drag to spin (a click without movement still opens the card)
  let moved = 0;
  stage.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY, t: performance.now() };
    moved = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, dt = Math.max(1, performance.now() - drag.t) / 1000;
    moved += Math.abs(dx) + Math.abs(dy);
    yaw += dx * 0.005; pitch = Math.max(-0.6, Math.min(0.9, pitch + dy * 0.003));
    vel = (dx * 0.005) / dt;
    drag = { x: e.clientX, y: e.clientY, t: performance.now() };
  });
  const end = () => { drag = null; stage.classList.remove('is-dragging'); vel = Math.max(-3, Math.min(3, vel)); };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('click', (e) => { if (moved > 6) e.preventDefault(); }, true);

  cards.forEach((c) => {
    c.addEventListener('pointerenter', () => { hovered = c; held = true; label.textContent = c.dataset.name; label.classList.add('is-on'); });
    c.addEventListener('pointerleave', () => { hovered = null; held = false; label.classList.remove('is-on'); });
  });
  stage.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect();
    label.style.transform = `translate(${e.clientX - r.left + 18}px, ${e.clientY - r.top + 18}px)`;
  });
}
