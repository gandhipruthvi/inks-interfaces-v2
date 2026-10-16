// Proof: client logo marquee (calm CSS loop, pauses on hover),
// a draggable story deck of founder briefs, and real result counters.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../../data/projects.json';
import reviews from '../../data/reviews.json';

gsap.registerPlugin(ScrollTrigger);

const cover = (p) => `/work-media/${p.slug}/cover-1280.webp`;
// ponytail: these two logo files have no alpha channel; re-check if logos are swapped
const OPAQUE_LOGOS = { 'vanya-luxe': 'is-light-ground', 'the-saucy-heat': 'is-dark-ground' };

export function initProofSection(section) {
  initMarquee(section.querySelector('.marquee-container'));
  initStories(section.querySelector('.story'));
  initReviews(section.querySelector('.reviews'));
  initCounters(section);
}

// Quote deck: cards fan out either side of the front card, tinted in the
// coral family. Arrows, arrow keys, swipe, click a side card; auto-advances
// every 6s unless the deck is hovered or focused.
const TINTS = ['#FDE2E1', '#F5F1EC', '#FBC1BE', '#FFFFFF'];
function initReviews(root) {
  if (!root) return;
  const deck = root.querySelector('.reviews-deck');
  const count = root.querySelector('.reviews-count');
  const n = reviews.length;
  let current = 0;

  deck.innerHTML = reviews.map((r, i) => {
    const initials = r.name.split(' ').map((w) => w[0]).join('').toLowerCase();
    return `<figure class="review-card" data-i="${i}" style="--tint: ${TINTS[i % TINTS.length]}">
      <p class="mono-label review-project"><a href="/work/${r.slug}" tabindex="-1">${r.role.split(', ')[1].toLowerCase()} &nearr;</a></p>
      <blockquote>&ldquo;${r.quote}&rdquo;</blockquote>
      <figcaption><span class="review-avatar" aria-hidden="true">${initials}</span><span><strong>${r.name}</strong><span>${r.role}</span></span></figcaption>
    </figure>`;
  }).join('');
  const cards = [...deck.children];

  const layout = () => {
    cards.forEach((c, i) => {
      let k = i - current;
      if (k > n / 2) k -= n;
      if (k < -n / 2) k += n;
      const a = Math.abs(k);
      c.style.transform = `translateX(${k * 58}%) translateY(${a * 26}px) rotate(${k * 5}deg) scale(${1 - a * 0.07})`;
      c.style.zIndex = String(10 - a);
      c.style.opacity = a > 1 ? '0' : '1';
      c.classList.toggle('is-front', a === 0);
      c.setAttribute('aria-hidden', a ? 'true' : 'false');
      c.querySelector('a').tabIndex = a ? -1 : 0;
    });
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
  };
  let last = performance.now();
  const go = (d) => { current = (current + d + n) % n; last = performance.now(); layout(); };

  root.querySelector('.reviews-prev').addEventListener('click', () => go(-1));
  root.querySelector('.reviews-next').addEventListener('click', () => go(1));
  deck.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
  let x0 = null;
  deck.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  deck.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) return go(dx < 0 ? 1 : -1);
    const card = e.target.closest('.review-card');
    if (card && !card.classList.contains('is-front')) { e.preventDefault(); current = +card.dataset.i; last = performance.now(); layout(); }
  });
  layout();

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let held = false, onScreen = false;
  root.addEventListener('pointerenter', () => { held = true; });
  root.addEventListener('pointerleave', () => { held = false; last = performance.now(); });
  root.addEventListener('focusin', () => { held = true; });
  root.addEventListener('focusout', () => { held = false; });
  new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; last = performance.now(); }).observe(root);
  setInterval(() => {
    if (!held && onScreen && !document.hidden && performance.now() - last > 6000) go(1);
  }, 250);
}

function initMarquee(box) {
  if (!box) return;
  const logos = projects.filter((p) => p.logo && !p.isConcept);
  const plate = (p, hidden) =>
    `<a class="marquee-logo-plate${OPAQUE_LOGOS[p.slug] ? ' ' + OPAQUE_LOGOS[p.slug] : ''}" href="/work/${p.slug}" ${hidden ? 'aria-hidden="true" tabindex="-1"' : ''}>
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

  // Auto-advance every 5s; hovering, focusing or dragging the deck holds it.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let held = false, onScreen = false, last = performance.now();
  const shell = root.querySelector('.story-card-shell') || root;
  const hold = (v) => () => { held = v; last = performance.now(); };
  shell.addEventListener('pointerenter', hold(true));
  shell.addEventListener('pointerleave', hold(false));
  shell.addEventListener('focusin', hold(true));
  shell.addEventListener('focusout', hold(false));
  root.querySelectorAll('.story-prev, .story-next').forEach((b) => b.addEventListener('click', () => { last = performance.now(); }));
  new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; last = performance.now(); }).observe(root);
  setInterval(() => {
    if (held || drag || !onScreen || document.hidden || performance.now() - last < 5000) return;
    last = performance.now();
    go(1);
  }, 250);
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
