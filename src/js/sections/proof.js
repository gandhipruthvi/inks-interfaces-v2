// Proof: client logo marquee (calm CSS loop, pauses on hover),
// a draggable story deck of founder briefs, and real result counters.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

const cover = (p) => `/work-media/${p.slug}/cover-1280.webp`;

export function initProofSection(section) {
  initMarquee(section.querySelector('.marquee-container'));
  initStories(section.querySelector('.story'));
  initCounters(section);
}

function initMarquee(box) {
  if (!box) return;
  const logos = projects.filter((p) => p.logo && !p.isConcept);
  const plate = (p, hidden) =>
    `<a class="marquee-logo-plate" href="/work/${p.slug}" ${hidden ? 'aria-hidden="true" tabindex="-1"' : ''}>
       <img src="${encodeURI(p.logo)}" alt="${hidden ? '' : p.name}" loading="lazy">
     </a>`;
  const row = (list) => list.map((p) => plate(p)).join('') + list.map((p) => plate(p, true)).join('');
  box.innerHTML = `
    <div class="marquee-track">${row(logos)}</div>
    <div class="marquee-track marquee-track--rev">${row([...logos].reverse())}</div>`;
}

function initStories(root) {
  if (!root) return;
  const items = projects.filter((p) => p.founder && p.quote && !p.isConcept);
  const deck = root.querySelector('.story-deck');
  const text = root.querySelector('.story-text');
  const n = items.length;
  let current = 0;

  deck.innerHTML = items.map((p) =>
    `<div class="story-card"><img src="${cover(p)}" alt="${p.name} brand work" loading="lazy" draggable="false"></div>`
  ).join('');
  const cards = [...deck.children];

  const layout = () => {
    cards.forEach((c, i) => {
      const k = (i - current + n) % n;
      c.style.transition = '';
      c.style.zIndex = n - k;
      c.style.opacity = k > 3 ? 0 : 1;
      c.style.transform = `translate(${k * 16}px, ${-k * 10}px) rotate(${k * 3}deg) scale(${1 - k * 0.04})`;
    });
  };

  const fill = () => {
    const p = items[current];
    text.querySelector('.story-index').textContent = `${String(current + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    text.querySelector('.story-title').innerHTML = p.headline;
    text.querySelector('.story-quote').innerHTML = `&ldquo;${p.quote.text}&rdquo;`;
    text.querySelector('.story-name').textContent = p.founder.name;
    text.querySelector('.story-role').textContent = `founder, ${p.name.toLowerCase()}`;
    text.querySelector('.story-link').href = `/work/${p.slug}`;
  };

  const go = (dir) => {
    current = (current + dir + n) % n;
    layout();
    text.classList.add('is-swapping');
    setTimeout(() => { fill(); text.classList.remove('is-swapping'); }, 320);
  };

  root.querySelector('.story-prev').addEventListener('click', () => go(-1));
  root.querySelector('.story-next').addEventListener('click', () => go(1));

  // Drag the top card: past 90px it flies to the back of the deck
  let startX = 0, dx = 0, drag = null;
  deck.addEventListener('pointerdown', (e) => {
    drag = cards[current];
    startX = e.clientX; dx = 0;
    drag.style.transition = 'none';
    deck.setPointerCapture(e.pointerId);
  });
  deck.addEventListener('pointermove', (e) => {
    if (!drag) return;
    dx = e.clientX - startX;
    drag.style.transform = `translateX(${dx}px) rotate(${dx * 0.04}deg)`;
  });
  const release = () => {
    if (!drag) return;
    drag = null;
    Math.abs(dx) > 90 ? go(dx < 0 ? 1 : -1) : layout();
  };
  deck.addEventListener('pointerup', release);
  deck.addEventListener('pointercancel', release);

  layout();
  fill();
}

function initCounters(section) {
  section.querySelectorAll('.proof-counter').forEach((el) => {
    const raw = el.dataset.target;
    const m = raw.match(/[\d.]+/);
    if (!m) return;
    const end = parseFloat(m[0]);
    const decimals = (m[0].split('.')[1] || '').length;
    const pre = raw.slice(0, m.index), post = raw.slice(m.index + m[0].length);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, {
          v: end, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.textContent = pre + o.v.toFixed(decimals) + post; }
        });
      }
    });
  });
}
