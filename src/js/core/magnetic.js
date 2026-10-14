import gsap from 'gsap';

export function initMagnetic() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isFinePointer || prefersReduced) return;

  const magneticElements = document.querySelectorAll('[data-magnetic]');

  magneticElements.forEach(el => {
    const strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.35;
    const radius = parseFloat(el.getAttribute('data-magnetic-radius')) || 85;

    let rect = el.getBoundingClientRect();
    let isHovering = false;

    function updateRect() {
      rect = el.getBoundingClientRect();
    }
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect);

    el.addEventListener('mouseenter', () => {
      isHovering = true;
      updateRect();
    });

    el.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.35,
          ease: 'power2.out'
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      isHovering = false;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)'
      });
    });
  });
}
