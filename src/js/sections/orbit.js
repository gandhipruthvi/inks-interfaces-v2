import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initOrbitSection(container) {
  if (!container) return;

  const covers = container.querySelectorAll('.orbit-card');
  const headline = container.querySelector('.orbit-headline');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (covers.length === 0) return;

  // Orbit item configurations: hand-placed percentages and depths
  // 3 in front (depth > 0.65), 5 behind (depth <= 0.65)
  const configs = [
    { x: 12, y: 8,  w: 18, depth: 0.35, z: 1 },  // behind top-left
    { x: 74, y: 12, w: 20, depth: 0.85, z: 4 },  // in front top-right
    { x: 5,  y: 42, w: 22, depth: 0.75, z: 4 },  // in front mid-left
    { x: 82, y: 46, w: 16, depth: 0.40, z: 1 },  // behind mid-right
    { x: 18, y: 72, w: 19, depth: 0.50, z: 1 },  // behind bottom-left
    { x: 68, y: 75, w: 24, depth: 0.90, z: 5 },  // in front bottom-right
    { x: 42, y: 15, w: 17, depth: 0.30, z: 1 },  // behind top-mid
    { x: 45, y: 78, w: 18, depth: 0.55, z: 1 }   // behind bottom-mid
  ];

  covers.forEach((card, i) => {
    const cfg = configs[i % configs.length];
    card.style.left = `${cfg.x}%`;
    card.style.top = `${cfg.y}%`;
    card.style.width = `${cfg.w}vw`;
    card.style.zIndex = cfg.z;
    card.dataset.depth = cfg.depth;
  });

  if (prefersReduced) return;

  // Scroll Parallax across section
  ScrollTrigger.create({
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      covers.forEach((card) => {
        const depth = parseFloat(card.dataset.depth) || 0.5;
        const translateY = (p - 0.5) * (1.0 - depth) * -350;
        gsap.set(card, { y: translateY });
      });
    }
  });

  // Cursor Parallax
  let mouseX = 0;
  let mouseY = 0;
  let curX = 0;
  let curY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  gsap.ticker.add(() => {
    curX += (mouseX - curX) * 0.08;
    curY += (mouseY - curY) * 0.08;

    covers.forEach((card) => {
      const depth = parseFloat(card.dataset.depth) || 0.5;
      const offsetX = curX * 24 * depth;
      const offsetY = curY * 24 * depth;
      card.style.setProperty('--cursor-x', `${offsetX}px`);
      card.style.setProperty('--cursor-y', `${offsetY}px`);
    });
  });

  // Hover states: dim other covers to 30%
  covers.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      covers.forEach((other) => {
        if (other !== card) {
          gsap.to(other, { opacity: 0.28, duration: 0.35, ease: 'power2.out' });
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      covers.forEach((other) => {
        gsap.to(other, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      });
    });
  });
}
