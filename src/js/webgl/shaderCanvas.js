// Full-bleed fragment-shader canvas. Raw WebGL, no three.js, so it stays tiny.
// Used by the hero ink, the footer halftone landscape and the page loader.
// Pauses off-screen, caps DPR, renders one still frame under reduced motion.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

export function createShaderCanvas(container, frag, { uniforms = {}, dpr = 1.5, stillTime = 6, onFrame } = {}) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  container.appendChild(canvas);

  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) { canvas.remove(); return null; }

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, 'precision highp float;\n' + frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name) => gl.getUniformLocation(prog, name);
  const uTime = u('uTime'), uRes = u('uRes'), uMouse = u('uMouse');
  const custom = Object.fromEntries(Object.keys(uniforms).map((k) => [k, u(k)]));

  const state = { mouse: [0.5, 0.5], target: [0.5, 0.5], uniforms };
  const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : dpr);

  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight;
    canvas.width = Math.max(1, Math.round(w * ratio));
    canvas.height = Math.max(1, Math.round(h * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  new ResizeObserver(resize).observe(container);

  container.addEventListener('pointermove', (e) => {
    const r = container.getBoundingClientRect();
    state.target = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = performance.now();
  let visible = true, raf = 0;

  const draw = (t) => {
    // ponytail: gentle mouse lerp keeps the motion soothing; raise 0.04 for snappier follow
    state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.04;
    state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.04;
    onFrame?.(state, t);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    if (uMouse) gl.uniform2f(uMouse, state.mouse[0], state.mouse[1]);
    for (const [k, l] of Object.entries(custom)) {
      const v = state.uniforms[k];
      Array.isArray(v) ? gl[`uniform${v.length}f`](l, ...v) : gl.uniform1f(l, v);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = () => {
    raf = 0;
    if (!visible) return;
    draw((performance.now() - start) / 1000);
    raf = requestAnimationFrame(loop);
  };

  if (reduced) {
    draw(stillTime);
  } else {
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    }).observe(container);
  }

  return { canvas, state };
}
