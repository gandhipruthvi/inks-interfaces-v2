import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits text into masked lines without external proprietary plugins.
 * Wraps words into span.reveal-line-wrap > span.reveal-line-inner
 */
function splitLines(element) {
  if (element.dataset.splitDone) return;
  
  const text = element.innerText.trim();
  const words = text.split(/\s+/);
  element.innerHTML = '';
  
  const wordSpans = words.map(w => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    span.textContent = w + ' ';
    element.appendChild(span);
    return span;
  });

  // Group words into lines based on offsetTop
  const lines = [];
  let currentLine = [];
  let currentTop = -1;

  wordSpans.forEach(span => {
    const top = span.offsetTop;
    if (top !== currentTop) {
      if (currentLine.length > 0) lines.push(currentLine);
      currentLine = [span];
      currentTop = top;
    } else {
      currentLine.push(span);
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  element.innerHTML = '';

  lines.forEach(lineWords => {
    const lineWrap = document.createElement('span');
    lineWrap.className = 'reveal-line-wrap';
    lineWrap.style.display = 'block';
    lineWrap.style.overflow = 'hidden';

    const lineInner = document.createElement('span');
    lineInner.className = 'reveal-line-inner';
    lineInner.style.display = 'block';

    lineWords.forEach(w => lineInner.appendChild(w));
    lineWrap.appendChild(lineInner);
    element.appendChild(lineWrap);
  });

  element.dataset.splitDone = 'true';
}

export function initReveals() {
  // Reveals start once the page loader has lifted, so nothing animates unseen
  if (!document.documentElement.classList.contains('is-loaded')) {
    window.addEventListener('ii:loaded', () => setTimeout(initReveals, 350), { once: true });
    return;
  }
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Line reveals
  const lineTargets = document.querySelectorAll('[data-reveal="lines"]');
  lineTargets.forEach(el => {
    if (!prefersReduced) {
      splitLines(el);
      const inners = el.querySelectorAll('.reveal-line-inner');
      // gsap owns the offset; a CSS translateY(%) would be read back as px and never return to 0
      gsap.set(inners, { yPercent: 110 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(inners, {
            yPercent: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.08
          });
        }
      });
    } else {
      const inners = el.querySelectorAll('.reveal-line-inner');
      gsap.set(inners, { yPercent: 0 });
    }
  });

  // 2. Image reveals
  ScrollTrigger.batch('[data-reveal="image"]', {
    interval: 0.1,
    batchMax: 4,
    start: 'top 85%',
    once: true,
    onEnter: batch => {
      if (prefersReduced) {
        batch.forEach(el => el.classList.add('is-revealed'));
        return;
      }
      batch.forEach((el, i) => {
        const innerImg = el.querySelector('img') || el;
        gsap.fromTo(el, 
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.out', delay: i * 0.1 }
        );
        if (innerImg !== el) {
          gsap.fromTo(innerImg,
            { scale: 1.2 },
            { scale: 1.0, duration: 1.4, ease: 'power3.out', delay: i * 0.1 }
          );
        }
      });
    }
  });

  // 3. Fade reveals
  ScrollTrigger.batch('[data-reveal="fade"]', {
    interval: 0.1,
    start: 'top 88%',
    once: true,
    onEnter: batch => {
      if (prefersReduced) {
        batch.forEach(el => el.classList.add('is-revealed'));
        return;
      }
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.06
      });
    }
  });
}
