import { scrollToTop } from './scroll.js';

// Sections with a paper background; the header flips to ink over them.
const LIGHT = '.hero-section, .theme-paper, .cs-problem-section, .cs-quote-section, .manifesto-section, .contact-section, .founders-section, .story-card-shell';

export function initNav() {
  const header = document.querySelector('.site-header');
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

  // Mobile menu toggle
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}
