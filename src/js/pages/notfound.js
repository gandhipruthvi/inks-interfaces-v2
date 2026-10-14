import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/secondary.css';

import { bootstrapApp } from '../main.js';
import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();

  const dropMiss = document.querySelector('.ink-drop-miss');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Signature 404 animation: ink drop falls and misses to the bottom right
  if (dropMiss && !prefersReduced) {
    gsap.fromTo(dropMiss,
      { y: -60, x: 0, opacity: 0 },
      {
        y: 260,
        x: 90,
        opacity: 1,
        duration: 1.4,
        ease: 'power2.in',
        repeat: -1,
        repeatDelay: 1.2
      }
    );
  }
});
