import { scrollToTop, lockScroll } from './scroll.js';

// Sections with a paper background; the header flips to ink over them.
const LIGHT = '.hero-section, .theme-paper, .cs-problem-section, .cs-quote-section, .manifesto-section, .contact-section, .founders-section, .story-card-shell';

// Only the home page ships the menu button + overlay in its HTML. Every other page
// (studio, services, work, contact, all case studies) gets them built here.
function ensureMobileMenu(header) {
  if (!header || header.querySelector('.nav-toggle')) return;
  let right = header.querySelector('.header-right');
  if (!right) { right = document.createElement('div'); right.className = 'header-right'; header.appendChild(right); }
  const btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span>';
  right.appendChild(btn);

  if (document.querySelector('.mobile-nav-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  const links = [...header.querySelectorAll('.header-nav a')]
    .map((a) => `<a href="${a.getAttribute('href')}" class="nav-link">${a.textContent.trim()}</a>`).join('');
  overlay.innerHTML = `${links}<div style="margin-top: var(--space-6);"><a href="/contact" class="coral-pill">start a project &rarr;</a></div>`;
  header.after(overlay);   // after the header: the header's :has(~ overlay) rule depends on it
}

export function initNav() {
  const header = document.querySelector('.site-header');
  ensureMobileMenu(header);
  const timeEl = document.querySelector('.header-time');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav-overlay');

  // Live Studio Clock (IST, India)
  if (timeEl) {
    function updateTime() {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      const timeStr = formatter.format(new Date());
      timeEl.textContent = `india ${timeStr} ist · booking q1 2027`;
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  const backTop = document.createElement('button');
  backTop.className = 'back-to-top-btn';
  backTop.setAttribute('aria-label', 'Back to top');
  backTop.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg><span>top</span>`;
  backTop.addEventListener('click', () => {
    scrollToTop();
    header?.querySelector('a')?.focus({ preventScroll: true });
  });
  document.body.appendChild(backTop);

  const lights = [...document.querySelectorAll(LIGHT)];
  let lastScroll = 0;
  const threshold = 10;

  const onScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    backTop.classList.toggle('is-visible', currentScroll > 350);
    if (!header) return;

    // Header hide on scroll down, show on scroll up
    if (currentScroll <= 60) {
      header.classList.remove('header-hidden');
    } else if (currentScroll > lastScroll + threshold) {
      header.classList.add('header-hidden');
    } else if (currentScroll < lastScroll - threshold) {
      header.classList.remove('header-hidden');
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;

    // Paper under the header's vertical middle → dark header
    const y = header.offsetHeight / 2;
    header.classList.toggle('header-on-light', lights.some((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    }));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle: locks page scroll while open, Escape or a link closes it
  if (navToggle && mobileNav) {
    const setOpen = (open) => {
      mobileNav.classList.toggle('is-open', open);
      mobileNav.setAttribute('aria-hidden', String(!open));
      navToggle.setAttribute('aria-expanded', String(open));
      lockScroll(open);
    };
    navToggle.addEventListener('click', () => setOpen(!mobileNav.classList.contains('is-open')));
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) { setOpen(false); navToggle.focus(); }
    });
    // rotating a phone past the breakpoint hides the toggle; don't leave the page locked
    matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }
}
