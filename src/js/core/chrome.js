// Site chrome shared by every page (including the 28 generated case studies):
// the page loader and the halftone footer. Rendered here once so
// no page can drift out of sync.
import { createShaderCanvas } from '../webgl/shaderCanvas.js';
import { scrollToTop } from './scroll.js';

const EMAIL = 'letscreate.inksandinterfaces@gmail.com';

// Covers that stream past the edges of the loader (small 360px thumbs)
const LOADER_CARDS = ['waggle', 'zestee', 'satori-bites', 'vanya-luxe', 'terra-cork', 'the-ube-press', 'globetap', 'silver-sphere-tech', 'golden-crust', 'hardin-jewels'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Loader: guide lines draw in, a tagline blurs in word by word, the wordmark
// takes its place while blurred project cards stream past the edges, then the
// black plate splits into four quadrants that wipe away one after another.
export function initLoader() {
  const root = document.documentElement;
  // Always open at the top; restoring a mid-page scroll under the loader looks broken
  if (!location.hash) { history.scrollRestoration = 'manual'; scrollTo(0, 0); }
  const el = document.createElement('div');
  el.className = 'page-loader';
  el.setAttribute('aria-hidden', 'true');
  const words = ['made', 'with', 'craft,', 'in', 'india'];
  el.innerHTML = `
    <span class="ld-q ld-q--tl"></span><span class="ld-q ld-q--tr"></span>
    <span class="ld-q ld-q--bl"></span><span class="ld-q ld-q--br"></span>
    <div class="ld-stage">
      <span class="ld-guide ld-guide--v"></span>
      <span class="ld-tick ld-tick--tl"></span><span class="ld-tick ld-tick--tr"></span>
      <span class="ld-tick ld-tick--bl"></span><span class="ld-tick ld-tick--br"></span>
      <p class="ld-words">${words.map((w) => `<span>${w}</span>`).join(' ')}</p>
      <img class="ld-mark" src="/brand/wordmark-white.webp" alt="" width="2041" height="637">
      <div class="ld-cards"></div>
    </div>`;
  document.body.prepend(el);

  // First visit in a session gets the full moment; later page hops only wipe.
  let seen = false;
  // The flag is only written once the full intro has finished, so leaving the
  // first page mid-intro still shows it on the next one.
  const KEY = 'ii-intro-played';
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch {}
  const markSeen = () => { try { sessionStorage.setItem(KEY, '1'); } catch {} };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((r) => window.addEventListener('load', r, { once: true }));
  const ready = Promise.race([loaded, wait(5000)]);   // never hold the page longer than 5s

  const anim = (node, frames, opts) => node.animate(frames, { fill: 'both', easing: 'cubic-bezier(.16,1,.3,1)', ...opts });
  const blurIn = [{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(6px)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }];
  const blurOut = [{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(12px)' }];

  const streamCards = () => {
    const box = el.querySelector('.ld-cards');
    const W = innerWidth, H = innerHeight;
    LOADER_CARDS.forEach((slug, i) => {
      const img = new Image();
      img.src = `/work-media/${slug}/thumb-360.webp`;
      img.alt = '';
      img.className = 'ld-card';
      box.appendChild(img);
      // alternate top / bottom bands so the centre (and the wordmark) stays clear
      const top = i % 2 === 0;
      const ltr = i % 4 < 2;
      const y = top ? H * (0.04 + Math.random() * 0.16) : H * (0.68 + Math.random() * 0.16);
      const x0 = ltr ? -W * 0.25 : W * 1.05, x1 = ltr ? W * 1.05 : -W * 0.25;
      const r0 = (Math.random() - 0.5) * 30, r1 = r0 + (ltr ? 18 : -18);
      const lift = (top ? 1 : -1) * H * 0.08;   // a slight arc toward the middle
      anim(img, [
        { transform: `translate(${x0}px, ${y}px) rotate(${r0}deg)`, filter: 'blur(6px)' },
        { transform: `translate(${(x0 + x1) / 2}px, ${y + lift}px) rotate(${(r0 + r1) / 2}deg)`, filter: 'blur(2px)' },
        { transform: `translate(${x1}px, ${y}px) rotate(${r1}deg)`, filter: 'blur(6px)' }
      ], { duration: 1500, delay: i * 110, easing: 'cubic-bezier(.45,.05,.55,.95)' });
    });
  };

  const reveal = async () => {
    markSeen();
    root.classList.add('is-loaded');
    window.dispatchEvent(new Event('ii:loaded'));
    el.querySelector('.ld-stage').style.opacity = '0';
    // each quadrant wipes toward the outside edge it touches first
    const wipes = { tr: 'inset(100% 0 0 0)', bl: 'inset(0 0 100% 0)', tl: 'inset(0 0 0 100%)', br: 'inset(0 100% 0 0)' };
    const runs = Object.entries(wipes).map(([q, to], i) =>
      anim(el.querySelector(`.ld-q--${q}`), [{ clipPath: 'inset(0 0 0 0)' }, { clipPath: to }],
        { duration: seen ? 550 : 800, delay: i * (seen ? 60 : 120), easing: 'cubic-bezier(.76,0,.24,1)' }).finished);
    await Promise.all(runs);
    el.remove();
  };

  (async () => {
    if (reduced) { await ready; root.classList.add('is-loaded'); window.dispatchEvent(new Event('ii:loaded')); el.remove(); return; }
    if (seen) { await Promise.race([ready, wait(400)]); return reveal(); }

    anim(el.querySelector('.ld-guide--v'), [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 900 });
    el.querySelectorAll('.ld-tick').forEach((t, i) => anim(t, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 200 + i * 60 }));
    const spans = [...el.querySelectorAll('.ld-words span')];
    spans.forEach((s, i) => anim(s, blurIn, { duration: 600, delay: 300 + i * 140 }));
    await wait(300 + spans.length * 140 + 700);
    anim(el.querySelector('.ld-words'), blurOut, { duration: 400 });
    await wait(250);
    const mark = el.querySelector('.ld-mark');
    anim(mark, [{ opacity: 0, filter: 'blur(14px)', transform: 'scale(.96)' }, { opacity: 1, filter: 'blur(0)', transform: 'scale(1)' }], { duration: 700 });
    await wait(450);
    streamCards();
    await wait(1300);
    anim(mark, blurOut, { duration: 500 });
    await ready;
    await wait(300);
    reveal();
  })();
}

export function initFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="pattern-band pattern-band--drift" aria-hidden="true"></div>
    <div class="ft-top">
      <div class="ft-cta">
        <p class="mono-label">// next chapter</p>
        <h2 class="ft-cta-title">outgrown the brand<br>you started with?</h2>
        <div class="ft-cta-actions">
          <a href="/contact" class="coral-pill" data-magnetic>start a project &rarr;</a>
          <a href="mailto:${EMAIL}" class="ft-mail">${EMAIL}</a>
        </div>
      </div>
      <nav class="ft-cols" aria-label="footer">
        <div class="ft-col">
          <h3>studio</h3>
          <a href="/work">work</a><a href="/services">services</a><a href="/studio">studio</a><a href="/contact">contact</a>
        </div>
        <div class="ft-col">
          <h3>recent brands</h3>
          <a href="/work/waggle">waggle</a><a href="/work/zestee">zestee</a><a href="/work/satori-bites">satori bites</a><a href="/work/terra-cork">terra cork</a><a href="/work/silver-sphere-tech">silver sphere</a>
        </div>
        <div class="ft-col">
          <h3>follow</h3>
          <a href="https://www.instagram.com/inks.and.interfaces" target="_blank" rel="noopener">instagram</a>
          <a href="https://www.linkedin.com/company/inksandinterfaces" target="_blank" rel="noopener">linkedin</a>
          <a href="https://x.com/Inks_Interfaces" target="_blank" rel="noopener">x / twitter</a>
          <a href="https://www.behance.net/shivanirotliwala" target="_blank" rel="noopener">behance</a>
        </div>
        <div class="ft-col">
          <h3>based in</h3>
          <p>india</p>
          <p>working worldwide</p>
        </div>
      </nav>
    </div>
    <div class="ft-scene"><div class="ft-scene-canvas"></div></div>
    <div class="ft-wordmark-wrap">
      <img class="ft-wordmark" src="/brand/wordmark-white.webp" alt="inks &amp; interfaces" width="2041" height="637" loading="lazy">
    </div>
    <div class="ft-bottom">
      <span>&copy; 2026 inks &amp; interfaces &middot; based in india &middot; operating globally</span>
      <span>branding &middot; rebranding &middot; identity systems</span>
      <a href="#top" class="ft-top-link">back to top &uarr;</a>
    </div>`;

  footer.querySelector('.ft-top-link').addEventListener('click', (e) => {
    e.preventDefault();
    scrollToTop();
  });

  createShaderCanvas(footer.querySelector('.ft-scene-canvas'), HALFTONE_HILLS, { dpr: 2, stillTime: 20 });
}

// Coral halftone landscape: a setting sun behind four drifting ridges.
// Everything is one hue (coral dots on black) so it stays on-brand.
const HALFTONE_HILLS = `
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;
float h1(float n){return fract(sin(n)*43758.5453);}
float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h1(i),h1(i+1.),f);}
float ridge(float x,float s){return n1(x+s)*.6+n1(x*2.3+s*1.7)*.3+n1(x*5.1+s*3.1)*.1;}
float scene(vec2 uv,float aspect){
  float t=uTime*.035;
  vec2 sc=vec2(aspect*.66+(uMouse.x-.5)*.03,.58);
  float d=length(uv-sc);
  float L=smoothstep(.2,.185,d)*.9+smoothstep(.55,.15,d)*.16;
  for(int i=0;i<4;i++){
    float fi=float(i);
    float par=(uMouse.x-.5)*.06*(fi+1.);
    float h=.66-fi*.12+(ridge(uv.x*(1.1+fi*.55)+t*(fi*.6+.4)+par,fi*13.7)-.5)*(.36+fi*.07);
    if(uv.y<h){
      float depth=h-uv.y;
      float rim=smoothstep(.05,0.,depth);
      float body=.1+fi*.1+.08*n1(uv.x*30.+fi*9.)*smoothstep(.0,.2,depth);
      L=mix(body,.85-fi*.05,rim*.9);
    }
  }
  return L*smoothstep(.0,.22,uv.y);
}
void main(){
  float cell=floor(uRes.y/70.);
  cell=max(cell,5.);
  vec2 g=floor(gl_FragCoord.xy/cell);
  vec2 c=(g+.5)*cell;
  float aspect=uRes.x/uRes.y;
  vec2 uv=vec2(c.x/uRes.y,c.y/uRes.y);
  float L=clamp(scene(uv,aspect),0.,1.);
  float r=sqrt(L)*cell*.62;
  float a=smoothstep(r,r-1.5,length(gl_FragCoord.xy-c));
  gl_FragColor=vec4(mix(vec3(0.),vec3(.945,.357,.329),a),1.);
}`;
