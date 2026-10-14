import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initBadgesSection(container) {
  if (!container) return;

  const cards = container.querySelectorAll('.hanging-card-wrapper');
  const wirePath = container.querySelector('.wire-svg path');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Physics state for 2 pendulums
  const pendulums = [
    { angle: 0, angularVel: 0, gravity: 0.004, damping: 0.955, el: cards[0], cardEl: cards[0]?.querySelector('.hanging-card') },
    { angle: 0, angularVel: 0, gravity: 0.004, damping: 0.955, el: cards[1], cardEl: cards[1]?.querySelector('.hanging-card') }
  ];

  // Swing on scroll enter
  ScrollTrigger.create({
    trigger: container,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      if (!prefersReduced) {
        pendulums[0].angularVel = 0.014;
        pendulums[1].angularVel = -0.011;
      }
    }
  });

  // Cursor velocity passing through adds impulse
  let lastMouseX = 0;
  let lastTime = performance.now();

  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    const dt = Math.max(1, now - lastTime);
    const vx = (e.clientX - lastMouseX) / dt;
    lastMouseX = e.clientX;
    lastTime = now;

    if (prefersReduced) return;

    pendulums.forEach((p) => {
      if (!p.el) return;
      const rect = p.el.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        p.angularVel += gsap.utils.clamp(-0.0035, 0.0035, vx * 0.0012);
      }
    });
  });

  // Physics loop & sagging wire update
  if (!prefersReduced) {
    gsap.ticker.add(() => {
      pendulums.forEach((p) => {
        if (!p.el) return;
        // Damped harmonic pendulum: theta'' = -gravity * sin(theta)
        const restoring = -p.gravity * Math.sin(p.angle);
        p.angularVel += restoring;
        p.angularVel *= p.damping;
        p.angle += p.angularVel;

        const deg = p.angle * (180 / Math.PI);
        p.el.style.transform = `rotate(${deg}deg)`;
      });

      // Update sagging wire curve
      if (wirePath) {
        const p0 = pendulums[0].angle;
        const p1 = pendulums[1].angle;
        const sagOffset = 60 + (p0 + p1) * 40;
        wirePath.setAttribute('d', `M 0 10 Q 500 ${sagOffset} 1000 10`);
      }
    });
  }

  // 3D Flip & Coral Foil Sheen per card
  cards.forEach((wrapper, idx) => {
    const card = wrapper.querySelector('.hanging-card');
    const sheen = wrapper.querySelector('.foil-sheen');
    if (!card) return;

    let isFlipped = false;

    function toggleFlip() {
      isFlipped = !isFlipped;
      card.setAttribute('aria-expanded', isFlipped);
      if (prefersReduced) {
        card.classList.toggle('is-flipped', isFlipped);
      } else {
        gsap.to(card, {
          rotateY: isFlipped ? 180 : 0,
          duration: 0.9,
          ease: 'cubic-bezier(.76,0,.24,1)'
        });
      }
    }

    // Click / Enter / Space to flip
    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    });

    // Foil Sheen highlight calculation
    card.addEventListener('mousemove', (e) => {
      if (!sheen) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 90;
      sheen.style.background = `linear-gradient(${angle}deg, rgba(253, 226, 225, 0.35) 0%, rgba(242, 91, 84, 0.08) 35%, transparent 70%)`;
      sheen.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      if (sheen) sheen.style.opacity = '0';
    });
  });
}
