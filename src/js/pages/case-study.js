import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/case-study.css';

import { bootstrapApp } from '../main.js';

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();

  const hero = document.querySelector('.cs-hero');
  const spotlight = document.querySelector('.cs-spotlight-overlay');
  const gallerySection = document.querySelector('.cs-gallery-section');

  // 1. Cursor Spotlight Reveal (220px soft circular mask)
  if (hero && spotlight) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty('--spot-x', `${x}%`);
      spotlight.style.setProperty('--spot-y', `${y}%`);
      spotlight.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });

    // Touch support (tap and hold)
    hero.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = hero.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        spotlight.style.setProperty('--spot-x', `${x}%`);
        spotlight.style.setProperty('--spot-y', `${y}%`);
        spotlight.style.opacity = '1';
      }
    }, { passive: true });

    hero.addEventListener('touchend', () => {
      spotlight.style.opacity = '0';
    });
  }

  // 2. Layer carousel: the active image sits in front, neighbours step back on
  // both sides. Arrows, arrow keys, swipe/drag, or click a side image.
  const layer = document.querySelector('.cs-layer');
  if (layer) initLayerCarousel(layer, gallerySection);
});

function initLayerCarousel(layer, section) {
  const items = [...layer.querySelectorAll('.cs-layer-item')];
  const count = section.querySelector('.cs-layer-count');
  const caption = section.querySelector('.cs-layer-caption');
  const n = items.length, pad = (v) => String(v).padStart(2, '0');
  let active = 0;

  const render = () => {
    items.forEach((el, i) => {
      // shortest signed distance around the loop, so the stack wraps
      let k = i - active;
      if (k > n / 2) k -= n;
      if (k < -n / 2) k += n;
      const a = Math.abs(k);
      el.style.transform = `translateX(${k * 22}%) scale(${1 - Math.min(a, 4) * 0.12})`;
      el.style.zIndex = String(100 - a);
      el.style.opacity = a > 3 ? '0' : '1';
      el.style.filter = a ? `brightness(${1 - Math.min(a, 3) * 0.18})` : 'none';
      el.classList.toggle('is-active', a === 0);
      el.setAttribute('aria-hidden', a ? 'true' : 'false');
    });
    count.textContent = `${pad(active + 1)} / ${pad(n)}`;
    caption.textContent = items[active].querySelector('img').alt;
  };
  const go = (d) => { active = (active + d + n) % n; render(); };

  section.querySelector('.cs-layer-prev').addEventListener('click', () => go(-1));
  section.querySelector('.cs-layer-next').addEventListener('click', () => go(1));
  layer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });

  // drag / swipe; a short tap on a side image brings it forward
  let x0 = null, moved = 0;
  layer.addEventListener('pointerdown', (e) => { x0 = e.clientX; moved = 0; });
  layer.addEventListener('pointermove', (e) => { if (x0 !== null) moved = e.clientX - x0; });
  layer.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    x0 = null;
    if (Math.abs(moved) > 50) return go(moved < 0 ? 1 : -1);
    const hit = e.target.closest('.cs-layer-item');
    if (hit && !hit.classList.contains('is-active')) { active = +hit.dataset.index; render(); }
  });
  layer.addEventListener('pointercancel', () => { x0 = null; });

  render();
}
