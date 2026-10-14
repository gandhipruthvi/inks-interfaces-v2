export function initNav() {
  const header = document.querySelector('.site-header');
  const timeEl = document.querySelector('.header-time');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav-overlay');

  // Live Studio Clock (IST - Surat, India)
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
      timeEl.textContent = `surat ${timeStr} ist · booking q1 2027`;
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  // Header hide on scroll down, show on scroll up
  if (header) {
    let lastScroll = 0;
    const threshold = 10;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll <= 60) {
        header.classList.remove('header-hidden');
      } else if (currentScroll > lastScroll + threshold) {
        // Scrolling down
        header.classList.add('header-hidden');
      } else if (currentScroll < lastScroll - threshold) {
        // Scrolling up
        header.classList.remove('header-hidden');
      }

      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  }

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
