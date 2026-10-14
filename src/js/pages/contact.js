import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/secondary.css';

import { bootstrapApp } from '../main.js';
import gsap from 'gsap';
import { initInkDrop } from '../scenes/inkDrop.js';

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();
  const dropHost = document.querySelector('.ink-drop');
  const drop = dropHost ? initInkDrop(dropHost, document.querySelector('.contact-form')) : null;

  const form = document.querySelector('.contact-form');
  const submitBtn = document.querySelector('.contact-submit-btn');
  const splashCanvas = document.querySelector('.contact-splash-canvas');
  const budgetChips = document.querySelectorAll('.budget-chip');
  const budgetInput = document.querySelector('#budgetInput');
  const faqItems = document.querySelectorAll('.faq-item');

  // Budget chips selection
  budgetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      budgetChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      if (budgetInput) {
        budgetInput.value = chip.dataset.val;
      }
    });
  });

  // FAQ Accordion toggles
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((i) => i.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });

  // Form submission with Ink Drop Splash Effect (§9)
  if (form && submitBtn && splashCanvas) {
    const ctx = splashCanvas.getContext('2d');
    splashCanvas.width = 280;
    splashCanvas.height = 90;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple inline validation
      const name = form.querySelector('#nameInput')?.value.trim();
      const email = form.querySelector('#emailInput')?.value.trim();
      if (!name || !email) {
        const errorEl = form.querySelector('.form-error-msg');
        if (errorEl) errorEl.textContent = 'Please provide both your name and work email.';
        return;
      }

      // Ink Drop Splash Animation
      drop?.splash();
      submitBtn.disabled = true;
      let dropY = -20;
      let splashRadius = 0;
      let isSplashing = false;

      function renderSplash() {
        ctx.clearRect(0, 0, splashCanvas.width, splashCanvas.height);

        if (!isSplashing) {
          dropY += 5;
          ctx.beginPath();
          ctx.arc(splashCanvas.width / 2, dropY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#0B0B0B';
          ctx.fill();

          if (dropY >= splashCanvas.height / 2) {
            isSplashing = true;
          }
          requestAnimationFrame(renderSplash);
        } else {
          splashRadius += 6;
          ctx.beginPath();
          ctx.arc(splashCanvas.width / 2, splashCanvas.height / 2, splashRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#f47d77';
          ctx.fill();

          if (splashRadius < splashCanvas.width) {
            requestAnimationFrame(renderSplash);
          } else {
            // Success state
            form.innerHTML = `
              <div style="padding: 40px; text-align: center;">
                <p class="mono-label" style="color: var(--coral);">// message received</p>
                <h3 style="font-size: 32px; font-weight: 400; margin: 12px 0;">we will be in touch within 24 hours.</h3>
                <p style="color: var(--ash-dark);">Thank you for trusting inks &amp; interfaces with your next phase of growth.</p>
              </div>
            `;
          }
        }
      }
      renderSplash();
    });
  }
});
