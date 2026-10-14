import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/case-study.css';

import { bootstrapApp } from '../main.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();

  const hero = document.querySelector('.cs-hero');
  const spotlight = document.querySelector('.cs-spotlight-overlay');
  const gallerySection = document.querySelector('.cs-gallery-section');
  const horizontalTrack = document.querySelector('.cs-horizontal-track');
  const nextCard = document.querySelector('.cs-next-reel-card');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // 2. Horizontal Pinned Gallery Scroll
  if (gallerySection && horizontalTrack && !prefersReduced) {
    const totalScroll = horizontalTrack.scrollWidth - window.innerWidth + 120;
    if (totalScroll > 0) {
      ScrollTrigger.create({
        trigger: gallerySection,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(horizontalTrack, {
            x: -self.progress * totalScroll
          });
        }
      });
    }
  }

  // 3. Next Project Reel Auto-Navigate & Progress Ring
  if (nextCard && !prefersReduced) {
    const nextUrl = nextCard.dataset.nextUrl;
    let progress = 0;
    let navigating = false;
    const circumference = 2 * Math.PI * 26; // r=26

    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0.6 && !navigating && nextUrl) {
          navigating = true;
          let currentOffset = circumference;
          const interval = setInterval(() => {
            progress += 5;
            currentOffset = circumference - (progress / 100) * circumference;
            if (progressCircle) {
              progressCircle.style.strokeDashoffset = `${currentOffset}`;
            }
            if (progress >= 100) {
              clearInterval(interval);
              window.location.href = nextUrl;
            }
          }, 35);
        }
      });
    }, { threshold: [0.6] });

    observer.observe(nextCard);
  }
});
