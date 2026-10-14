import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/work.css';

import { bootstrapApp } from '../main.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();

  const collageContainer = document.querySelector('.collage-hero');
  const collageItems = document.querySelectorAll('.collage-item');
  const filterChips = document.querySelectorAll('.work-filter-chip');
  const viewBtns = document.querySelectorAll('.view-btn');
  const gridContainer = document.querySelector('.work-grid');
  const listContainer = document.querySelector('.work-list');
  const preview = document.querySelector('.services-cursor-preview');
  const previewImg = preview?.querySelector('img');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Scattered Collage Random Depths & Cursor Drift
  if (collageContainer && collageItems.length > 0 && !prefersReduced) {
    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.08;
      curY += (mouseY - curY) * 0.08;

      collageItems.forEach((item, idx) => {
        const depth = 0.3 + (idx % 7) * 0.1;
        gsap.set(item, {
          x: curX * 30 * depth,
          y: curY * 20 * depth
        });
      });
    });

    // Scroll settling
    ScrollTrigger.create({
      trigger: collageContainer,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        collageItems.forEach((item) => {
          gsap.set(item, {
            scale: 1.0 - p * 0.3,
            opacity: 1.0 - p * 0.8
          });
        });
      }
    });
  }

  // 2. View Toggle (Grid / List) & LocalStorage Persistence
  function setView(mode) {
    if (mode === 'list') {
      gridContainer.style.display = 'none';
      listContainer.style.display = 'flex';
      viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === 'list'));
    } else {
      gridContainer.style.display = 'grid';
      listContainer.style.display = 'none';
      viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === 'grid'));
    }
    try {
      localStorage.setItem('ii_work_view', mode);
    } catch (e) {}
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setView(btn.dataset.view);
    });
  });

  // Restore saved view
  try {
    const savedView = localStorage.getItem('ii_work_view');
    if (savedView === 'list') setView('list');
  } catch (e) {}

  // 3. Filtering & URL Query Param Sync
  function setFilter(category) {
    filterChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === category);
    });

    const gridCards = document.querySelectorAll('.work-grid-card');
    const listRows = document.querySelectorAll('.work-list-row');

    gridCards.forEach(card => {
      const match = (category === 'all') || (card.dataset.category === category);
      card.style.display = match ? 'flex' : 'none';
    });

    listRows.forEach(row => {
      const match = (category === 'all') || (row.dataset.category === category);
      row.style.display = match ? 'grid' : 'none';
    });

    // Update URL param without page reload
    const url = new URL(window.location);
    if (category === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', category);
    }
    window.history.replaceState({}, '', url);
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setFilter(chip.dataset.filter);
    });
  });

  // Check URL query param on initial load
  const initialParams = new URLSearchParams(window.location.search);
  const initialFilter = initialParams.get('filter');
  if (initialFilter) {
    setFilter(initialFilter);
  }

  // 4. Cursor Preview for List View
  if (preview && previewImg && isFinePointer && !prefersReduced) {
    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let currentSrc = '';

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;

      gsap.set(preview, {
        x: curX + 28,
        y: curY - 180
      });
    });

    const listRows = document.querySelectorAll('.work-list-row');
    listRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        const imgSrc = row.dataset.cover;
        if (imgSrc && imgSrc !== currentSrc) {
          currentSrc = imgSrc;
          previewImg.src = imgSrc;
          gsap.fromTo(preview,
            { clipPath: 'inset(100% 0 0 0)', opacity: 1 },
            { clipPath: 'inset(0% 0 0 0)', duration: 0.35, ease: 'power3.out' }
          );
        } else {
          gsap.to(preview, { opacity: 1, duration: 0.2 });
        }
      });

      row.addEventListener('mouseleave', () => {
        gsap.to(preview, { opacity: 0, duration: 0.2 });
      });
    });
  }
});
