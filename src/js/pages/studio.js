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

  // Subtle 3D Studio diorama animation: float + mouse parallax tilt
  const room = document.querySelector('.studio-room');
  const dioramaImg = room?.querySelector('img');
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (room && dioramaImg && !prefersReduced) {
    // 1. Entrance reveal
    gsap.fromTo(dioramaImg,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }
    );

    // 2. Ambient gentle float
    gsap.to(room, {
      y: -10,
      duration: 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.3
    });

    // 3. Interactive mouse parallax tilt
    window.addEventListener('mousemove', (e) => {
      const rect = room.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      gsap.to(dioramaImg, {
        rotateX: -normY * 5,
        rotateY: normX * 5,
        transformPerspective: 1000,
        transformOrigin: 'center center',
        duration: 0.7,
        ease: 'power2.out'
      });
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      gsap.to(dioramaImg, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    });
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
