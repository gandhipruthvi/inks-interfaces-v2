import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// mobile address bars resize the viewport while scrolling; re-measuring every time makes pinned/scrubbed sections jump
ScrollTrigger.config({ ignoreMobileResize: true });

let lenis = null;

export function initScroll() {
  // late fonts and images shift layout; re-measure triggers once they settle
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1.0,
    infinite: false,
    smoothWheel: true,
    anchors: { offset: -80 }   // in-page links (#selected-work) glide too, clear of the header
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

// Freeze page scroll under an overlay (mobile menu, lightbox). Lenis ignores
// overflow:hidden, so it has to be stopped as well.
export function lockScroll(on) {
  document.documentElement.classList.toggle('scroll-locked', on);
  if (lenis) on ? lenis.stop() : lenis.start();
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
