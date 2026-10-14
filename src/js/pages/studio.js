import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/secondary.css';

import { bootstrapApp } from '../main.js';
import { initBadgesSection } from '../sections/badges.js';
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
  lazyScene('.pattern-relief', () => import('../scenes/patternRelief.js').then((m) => m.initPatternRelief));

  // 1. Reuse hanging ID cards in Studio
  const foundersSection = document.querySelector('.founders-section');
  if (foundersSection) {
    initBadgesSection(foundersSection);
  }

  // 2. Staircase Block Reveal Transition (§9 / Video 1)
  const staircaseBars = document.querySelectorAll('.staircase-bar');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (staircaseBars.length > 0 && !prefersReduced) {
    ScrollTrigger.create({
      trigger: '.staircase-wrapper',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(staircaseBars, {
          scaleX: 1,
          duration: 0.65,
          ease: 'power3.inOut',
          stagger: 0.08,
          onComplete: () => {
            gsap.to(staircaseBars, {
              transformOrigin: 'right',
              scaleX: 0,
              duration: 0.65,
              ease: 'power3.inOut',
              stagger: 0.08
            });
          }
        });
      }
    });
  }

  // 3. Signature draw-on animation
  const sigImg = document.querySelector('.founders-signature');
  if (sigImg && !prefersReduced) {
    ScrollTrigger.create({
      trigger: sigImg,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(sigImg,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.4, ease: 'power2.out' }
        );
      }
    });
  }
});
