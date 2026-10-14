// Site chrome shared by every page (including the 28 generated case studies):
// the gradient page loader and the illustrated footer. Rendered here once so
// no page can drift out of sync.
import { createShaderCanvas } from '../webgl/shaderCanvas.js';

const EMAIL = 'letscreate.inksandinterfaces@gmail.com';

export function initLoader() {
  const root = document.documentElement;
  // Always open at the top; restoring a mid-page scroll under the loader looks broken
  if (!location.hash) { history.scrollRestoration = 'manual'; scrollTo(0, 0); }
  const el = document.createElement('div');
  el.className = 'page-loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="page-loader-mesh"></div>
    <div class="page-loader-center">
      <span class="page-loader-plate"><img src="/brand/secondary-monogram.png" alt="" width="56" height="56"></span>
      <span class="page-loader-count">000</span>
    </div>
    <span class="page-loader-label">brand &amp; identity studio</span>`;
  document.body.prepend(el);

  // First visit in a session gets the full moment; later page hops stay quick.
  let seen = false;
  try { seen = sessionStorage.getItem('ii-seen') === '1'; sessionStorage.setItem('ii-seen', '1'); } catch {}
  const minTime = seen ? 450 : 1500;
  const count = el.querySelector('.page-loader-count');
  const t0 = performance.now();
  let loaded = document.readyState === 'complete';
  window.addEventListener('load', () => { loaded = true; }, { once: true });

  const tick = () => {
    const elapsed = performance.now() - t0;
    // ponytail: counter is time-based with a hold at 90 until window.load; good enough to feel honest
    const p = Math.min(loaded ? 1 : 0.9, elapsed / minTime);
    count.textContent = String(Math.round(p * 100)).padStart(3, '0');
    if (p >= 1 || elapsed > 4000) {
      root.classList.add('is-loaded');
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 1300);
      window.dispatchEvent(new Event('ii:loaded'));
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
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
          <a href="/work/waggle">waggle</a><a href="/work/zestee">zestee</a><a href="/work/terra-cork">terra cork</a><a href="/work/silver-sphere-tech">silver sphere</a>
        </div>
        <div class="ft-col">
          <h3>follow</h3>
          <a href="https://www.instagram.com/inks.and.interfaces" target="_blank" rel="noopener">instagram</a>
          <a href="https://x.com/Inks_Interfaces" target="_blank" rel="noopener">x / twitter</a>
          <a href="https://www.behance.net/shivanirotliwala" target="_blank" rel="noopener">behance</a>
        </div>
        <div class="ft-col">
          <h3>based in</h3>
          <p>surat, gujarat, india</p>
          <p>working worldwide</p>
        </div>
      </nav>
    </div>
    <div class="ft-scene"><div class="ft-scene-canvas"></div></div>
    <div class="ft-wordmark-wrap">
      <img class="ft-wordmark" src="/brand/wordmark-white.webp" alt="inks &amp; interfaces" width="2041" height="637" loading="lazy">
    </div>
    <div class="ft-bottom">
      <span>&copy; 2026 inks &amp; interfaces</span>
      <span>branding &middot; rebranding &middot; identity systems</span>
      <a href="#top" class="ft-top-link">back to top &uarr;</a>
    </div>`;

  footer.querySelector('.ft-top-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
