import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/chrome.css';
import { initScroll } from './core/scroll.js';
import { initCursor } from './core/cursor.js';
import { initNav } from './core/nav.js';
import { initReveals } from './core/reveal.js';
import { initMagnetic } from './core/magnetic.js';
import { initLoader, initFooter } from './core/chrome.js';

// Every page script calls this once. It used to also auto-run here, which
// started two Lenis loops per page and made scrolling judder.
export function bootstrapApp() {
  initLoader();
  initFooter();
  const lenis = initScroll();
  initCursor();
  initNav();
  initReveals();
  initMagnetic();
  return { lenis };
}
