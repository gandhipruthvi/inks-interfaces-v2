// Capabilities, "roster" style: a list on the left, a sticky image on the right.
// The active row rolls its name and the next image wipes up over the last one.
// Active row follows scroll, and hover takes over on desktop.
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCapabilities(section) {
  const rows = [...section.querySelectorAll('.caps-row')];
  const stack = section.querySelector('.caps-stack');
  const count = section.querySelector('.caps-count');
  const cap = section.querySelector('.caps-cap');
  if (!rows.length || !stack) return;

  let active = -1, layerZ = 1;

  const setActive = (i) => {
    if (i === active) return;
    active = i;
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(rows.length).padStart(2, '0')}`;
    cap.textContent = rows[i].querySelector('.caps-name').textContent.trim();

    const img = document.createElement('img');
    img.src = rows[i].dataset.img;
    img.alt = '';
    img.style.zIndex = ++layerZ;
    stack.appendChild(img);
    // two frames so the clip-path transition actually runs
    requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('is-in')));
    // ponytail: keep only the last 3 layers; enough to cover a fast wipe sequence
    while (stack.children.length > 3) stack.firstElementChild.remove();
  };

  rows.forEach((row, i) => {
    row.addEventListener('mouseenter', () => setActive(i));
    row.addEventListener('focusin', () => setActive(i));
    ScrollTrigger.create({
      trigger: row,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && setActive(i)
    });
  });

  section.querySelector('.caps-prev')?.addEventListener('click', () => setActive((active - 1 + rows.length) % rows.length));
  section.querySelector('.caps-next')?.addEventListener('click', () => setActive((active + 1) % rows.length));

  setActive(0);
}
