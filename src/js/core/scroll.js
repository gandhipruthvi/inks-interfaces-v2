import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.log('[scroll] reduced-motion active: Lenis disabled');
    return null;
  }

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false,
    smoothWheel: true
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  if (import.meta.env.DEV) window.__lenis = lenis;
  // Return lenis instance for velocity access etc
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
