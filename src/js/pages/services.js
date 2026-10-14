import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/secondary.css';

import { bootstrapApp } from '../main.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// three.js loads only on pages that show a 3D scene
function lazyScene(selector, load) {
  const el = document.querySelector(selector);
  if (el) load().then((init) => init(el));
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();
  lazyScene('.block-field', () => import('../scenes/blockField.js').then((m) => m.initBlockField));

  const processSection = document.querySelector('.process-scrub-section');
  const actCards = document.querySelectorAll('.process-act-card');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-scrubbed 4-act timeline (lerp 0.15)
  if (processSection && actCards.length > 0 && !prefersReduced) {
    let targetProgress = 0;
    let currentProgress = 0;

    ScrollTrigger.create({
      trigger: processSection,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: true,
      onUpdate: (self) => {
        targetProgress = self.progress;
      }
    });

    gsap.ticker.add(() => {
      currentProgress += (targetProgress - currentProgress) * 0.15;
      const activeIdx = Math.min(Math.floor(currentProgress * 4), 3);

      actCards.forEach((card, i) => {
        card.classList.toggle('active', i === activeIdx);
      });
    });
  }
});
