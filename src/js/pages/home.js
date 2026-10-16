import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/home.css';

import { bootstrapApp } from '../main.js';
import { initOrbitSection } from '../sections/orbit.js';
import { initCapabilities } from '../sections/capabilities.js';
import { initBadgesSection } from '../sections/badges.js';
import { initProofSection } from '../sections/proof.js';

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();

  const hero = document.querySelector('.hero-canvas-container');
  // the desk of tools is three.js, so it loads in its own chunk
  if (hero) import('../scenes/hero.js').then((m) => m.initHeroScene({ container: hero }));

  const orbit = document.querySelector('.orbit-section');
  if (orbit) initOrbitSection(orbit);

  // three.js only loads when the library ring gets close to the viewport
  const ring = document.querySelector('.ring-section');
  if (ring) {
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      import('../scenes/ring.js').then((m) => m.initRingScene(ring));
    }, { rootMargin: '800px 0px' });
    io.observe(ring);
  }

  const caps = document.querySelector('.caps-section');
  if (caps) initCapabilities(caps);

  const founders = document.querySelector('.founders-section');
  if (founders) initBadgesSection(founders);

  const proof = document.querySelector('.proof-section');
  if (proof) initProofSection(proof);
});
