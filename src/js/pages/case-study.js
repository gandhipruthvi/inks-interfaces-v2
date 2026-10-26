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

  // 2. Gallery lightbox: click an image to view it large, arrows/keys/swipe to move.
  if (gallerySection) initLightbox(gallerySection);
});

function initLightbox(section) {
  const items = [...section.querySelectorAll('.cs-gallery-item img')];
  const box = section.querySelector('.cs-lightbox');
  if (!items.length || !box) return;
  const img = box.querySelector('.cs-lb-img');
  const count = box.querySelector('.cs-lb-count');
  const caption = box.querySelector('.cs-lb-caption');
  const n = items.length, pad = (v) => String(v).padStart(2, '0');
  let active = 0;

  const show = (i) => {
    active = (i + n) % n;
    img.src = items[active].currentSrc || items[active].src;
    img.alt = items[active].alt;
    count.textContent = `${pad(active + 1)} / ${pad(n)}`;
    caption.textContent = items[active].alt;
  };

  section.querySelectorAll('.cs-gallery-item').forEach((btn, i) =>
    btn.addEventListener('click', () => { show(i); box.showModal(); document.documentElement.classList.add('lb-open'); }));
  box.addEventListener('close', () => document.documentElement.classList.remove('lb-open'));
  box.querySelector('.cs-lb-prev').addEventListener('click', () => show(active - 1));
  box.querySelector('.cs-lb-next').addEventListener('click', () => show(active + 1));
  box.querySelector('.cs-lb-close').addEventListener('click', () => box.close());
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(active - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(active + 1); }
  });
  // click on the backdrop (the dialog itself, not its contents) closes it
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });

  // swipe
  let x0 = null;
  box.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  box.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(active + (dx < 0 ? 1 : -1));
  });
}
