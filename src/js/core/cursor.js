import gsap from 'gsap';

export function initCursor() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  let dot = document.querySelector('.cursor-dot');
  let ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) {
    dot = document.createElement('div');
    dot.className = 'cursor-dot';
    ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.innerHTML = '<span>view ↗</span>';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
  }

  const ringLabel = ring.querySelector('span');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  // Lerp ring for inertia follow-through
  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    gsap.set(ring, { x: ringX, y: ringY });
  });

  // Delegated event listener for data-cursor attributes
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (target) {
      const mode = target.getAttribute('data-cursor') || 'view';
      document.body.setAttribute('data-cursor-state', mode);
      const customLabel = target.getAttribute('data-cursor-label');
      if (customLabel && ringLabel) {
        ringLabel.textContent = customLabel;
      } else if (ringLabel) {
        ringLabel.textContent = mode === 'view' ? 'view ↗' : mode === 'drag' ? 'drag ↔' : '';
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (target) {
      document.body.removeAttribute('data-cursor-state');
    }
  });
}
