import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/secondary.css';

import { bootstrapApp } from '../main.js';
import { initBadgesSection } from '../sections/badges.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();

  // The studio as a live 3D diorama; the still render stays underneath as the
  // fallback (no WebGL, or reduced motion) and fades out once the scene draws.
  const room = document.querySelector('.studio-room');
  if (room && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    import('../scenes/studioRoom.js').then((m) => { if (m.initStudioRoom(room)) room.classList.add('is-3d'); });
  }

  // 1. Reuse hanging ID cards in Studio
  const foundersSection = document.querySelector('.founders-section');
  if (foundersSection) {
    initBadgesSection(foundersSection);
  }

  // 2. Coral wipe into the founders section, scrubbed so it can't end on a hard cut
  const wipe = document.querySelector('.section-wipe span');
  if (wipe && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(wipe,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.section-wipe', start: 'top 85%', end: 'top 30%', scrub: 0.6 }
      });
  }
});
