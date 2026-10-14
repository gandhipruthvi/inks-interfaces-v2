# inks & interfaces v2: rules for the agent

## brand (non-negotiable)
- Palette: --ink #0B0B0B, --paper #F5F1EC, --coral #F25B54 (+ tints in docs/brand-guidelines). One accent only. No purple, blue, rainbow, neon glows.
- Font: Space Grotesk (300/400/500/700) for everything. JetBrains Mono for 11–12px labels only.
- Headlines and nav lowercase. Body sentence case. No exclamation marks. No em dashes in copy.
- Never redraw, recolour, outline or add 3D/shadow/glow to the logo or monogram. Use files in /public/brand as-is, on a solid #000 or coral plate.
- The pattern comes from docs/pattern.md SVG only. Coral on black, never under body text, never low-opacity texture.
- Banned words: elevate, seamless, unleash, next-gen, game-changer, delve, synergy, leverage, solutions, world-class, delight.

## content
- Founder outcome first, work second (docs/brand-guidelines §9–16). Every project entry needs: founder problem → strategy → result.
- NEVER invent metrics, quotes or founder names. If data/projects.json has `null`, render the block without the number or hide it. Leave a TODO comment.

## code
- Vite + vanilla JS modules. No React, no Tailwind. CSS in /src/styles with custom properties in tokens.css.
- Deps allowed: three, gsap, lenis. Ask before adding anything else.
- Animate only transform, opacity, clip-path, filter. Never top/left/width/height.
- Every WebGL scene: pause when off-screen (IntersectionObserver), cap DPR at 2 (1.5 on mobile), dispose on page leave, static-image fallback when WebGL unavailable or prefers-reduced-motion.
- Any section using mix-blend-mode over video/canvas gets `isolation: isolate` on its wrapper.
- Semantic HTML, one h1 per page, alt text from projects.json, visible focus rings, skip link, keyboard-operable everything (ID cards flip on Enter/Space).
- Images: AVIF+WebP via <picture>, explicit width/height, lazy below the fold, hero preloaded.
- Budget: LCP < 2.5s on 4G, JS < 250KB gzip on the home page excluding three.js (lazy-loaded), CLS < 0.05.

## workflow
- After each task: run the dev server, check in the browser agent at 1440 and 390 widths, attach screenshots to the walkthrough.
