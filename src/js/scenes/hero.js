// Home hero: a paper desk with a few design tools laid out like a flat-lay
// (pencil, pen-tool nib, ruler, set square, cursor, swatch). Matte ink, paper
// and coral with thin bevels. Drag and flick them; they settle with a slight
// give. The headline, copy and reset button are solid, so tools never cover text.
//
// Rendering is three.js with an orthographic top-down camera where 1 world unit
// is 1 CSS pixel, so pointer and physics share one coordinate space. Physics is
// a small rigid-body step: every tool is a set of circles; contacts get
// positional correction plus an impulse with rotation. No physics library.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const C = { coral: 0xf25b54, ink: 0x1a1a1a, white: 0xfffcf9, ash: 0x9a948e, wood: 0xf3dcc3 };
const DEPTH = 9;

// ---------- shape helpers (all in px at scale 1, centred on the origin) ----------
const roundRect = (w, h, r, x = 0, y = 0) => {
  const s = new THREE.Shape(), x0 = x - w / 2, y0 = y - h / 2;
  s.moveTo(x0 + r, y0);
  s.lineTo(x0 + w - r, y0); s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  s.lineTo(x0 + w, y0 + h - r); s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  s.lineTo(x0 + r, y0 + h); s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0);
  return s;
};
const poly = (pts) => { const s = new THREE.Shape(); s.moveTo(...pts[0]); pts.slice(1).forEach((p) => s.lineTo(...p)); s.closePath(); return s; };
const circle = (r, x = 0, y = 0) => { const s = new THREE.Shape(); s.absarc(x, y, r, 0, Math.PI * 2, false); return s; };
const line = (x0, x1, y, r) => { const out = []; for (let x = x0; x <= x1 + 0.1; x += r * 1.4) out.push([x, y, r]); return out; };

// Each tool: parts (shape, colour, z lift, depth) and circle colliders [x, y, r].
const TOOLS = {
  pencil: (body = C.coral) => ({
    name: 'pencil',
    parts: [
      [roundRect(200, 34, 6, 5, 0), body],
      [roundRect(26, 36, 4, 117, 0), C.ash],
      [roundRect(30, 34, 12, 140, 0), C.ink],
      [poly([[-95, -17], [-95, 17], [-140, 3], [-140, -3]]), C.wood],
      [poly([[-128, -6.5], [-128, 6.5], [-150, 0]]), C.ink, 1]
    ],
    colliders: line(-130, 145, 0, 19)
  }),
  ruler: () => ({
    name: 'ruler',
    parts: [
      [roundRect(380, 64, 12), C.white],
      ...Array.from({ length: 19 }, (_, i) => [roundRect(3, i % 5 ? 14 : 26, 1.5, -171 + i * 19, 32 - (i % 5 ? 7 : 13) - 6), C.ink, 1, 2])
    ],
    colliders: line(-160, 160, 0, 32)
  }),
  nib: () => {
    // the illustrator pen tool: a nib with a slit and a breather hole
    const s = new THREE.Shape();
    s.moveTo(0, -105);
    s.bezierCurveTo(-24, -70, -58, -20, -50, 22);
    s.lineTo(-34, 58); s.lineTo(34, 58); s.lineTo(50, 22);
    s.bezierCurveTo(58, -20, 24, -70, 0, -105);
    s.holes.push(circle(11, 0, 0));
    s.holes.push(poly([[-2.5, -10], [2.5, -10], [1, -88], [-1, -88]]));
    return {
      name: 'pen tool',
      parts: [[s, C.ink], [roundRect(76, 34, 8, 0, 76), C.coral]],
      colliders: [[0, -70, 22], [0, -25, 40], [0, 30, 42], [0, 74, 30]]
    };
  },
  square: () => {
    const s = poly([[-110, -95], [120, -95], [-110, 135]]);
    s.holes.push(poly([[-72, -60], [40, -60], [-72, 52]]));
    return {
      name: 'set square',
      parts: [[s, C.white]],
      colliders: [...line(-95, 105, -80, 18).slice(0, 8), [-95, -30, 18], [-95, 20, 18], [-95, 70, 18], [-95, 115, 18], [-40, 30, 18], [10, -20, 18], [50, -60, 18]]
    };
  },
  cursor: () => ({
    name: 'selection',
    parts: [[poly([[0, 60], [0, -62], [30, -32], [52, -78], [68, -70], [46, -24], [88, -24]]), C.ink]],
    colliders: [[12, 30, 22], [12, -15, 24], [40, -35, 22], [58, -64, 14]]
  }),
  swatch: () => ({
    name: 'swatch',
    parts: [[roundRect(104, 150, 12), C.white], [roundRect(88, 96, 6, 0, 18), C.coral, 1, 2], [roundRect(52, 6, 3, -10, -46), C.ash, 1, 2]],
    colliders: [[0, -40, 46], [0, 30, 50]]
  })
};

// desktop layout as fractions of the hero, plus angle; tools sit right of the copy
// and some lie across the headline, like papers on a desk
// desktop layout as fractions of the hero, plus angle: right of the copy and in
// the gap under the headline, never on it (the text is solid anyway)
const LAYOUT = [
  ['square', 0.86, 0.40, 0.2], ['pencil', 0.70, 0.60, 0.18], ['nib', 0.60, 0.80, -0.35],
  ['ruler', 0.84, 0.82, -0.12], ['cursor', 0.53, 0.62, 0.25], ['swatch', 0.95, 0.62, -0.2]
];
const LAYOUT_MOBILE = [
  ['pencil', 0.32, 0.52, 0.35], ['nib', 0.82, 0.50, -0.35], ['cursor', 0.58, 0.56, 0.25], ['swatch', 0.14, 0.56, -0.2]
];

export function initHeroScene({ container }) {
  const section = container.closest('.hero-section');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = innerWidth < 768;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000);
  camera.position.set(0, 0, 1500);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xf1e7dd, 1.3));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: 0.14 }));
  ground.receiveShadow = true;
  scene.add(ground);

  const mats = new Map();
  const mat = (color) => {
    if (!mats.has(color)) mats.set(color, new THREE.MeshPhysicalMaterial({ color, roughness: 0.62, clearcoat: 0.2, clearcoatRoughness: 0.5 }));   // satin, not candy
    return mats.get(color);
  };

  let W = 1, H = 1, S = 1;
  // copy + toolbar are solid: tools bump into them so the text stays readable
  let blocks = [];
  const measureBlocks = () => {
    const c = container.getBoundingClientRect();
    // headline lines are measured by their glyphs (the line boxes span the full width)
    const range = document.createRange();
    const rects = [...section.querySelectorAll('.hero-line > span, .hero-eyebrow, .hero-subline')].map((el) => { range.selectNodeContents(el); return range.getBoundingClientRect(); });
    blocks = [...rects, ...[...section.querySelectorAll('.hero-actions, .hero-toolbar')].map((el) => el.getBoundingClientRect())].map((r) => {
      return { x0: r.left - c.left - W / 2 - 8, x1: r.right - c.left - W / 2 + 8, y0: H / 2 - (r.bottom - c.top) - 8, y1: H / 2 - (r.top - c.top) + 8 };
    });
  };
  const bodies = [];

  const build = (key) => {
    const def = TOOLS[key]();
    const group = new THREE.Group();
    const add = (geo, color, z = 0) => {
      const m = new THREE.Mesh(geo, mat(color));
      m.position.z = z;
      m.castShadow = true;
      group.add(m);
    };
    for (const [shape, color, layer = 0, depth = DEPTH] of def.parts) {
      add(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 2.5, bevelSize: 2, bevelSegments: 3, curveSegments: 20 }), color, layer * (DEPTH + 4));
    }
    scene.add(group);
    // mass / inertia from the colliders, as if each circle were a puck
    let m = 0, I = 0;
    for (const [x, y, r] of def.colliders) { const mi = r * r; m += mi; I += mi * (x * x + y * y + r * r / 2); }
    return { key, name: def.name, group, colliders: def.colliders, m, I, x: 0, y: 0, a: 0, vx: 0, vy: 0, w: 0, sq: 0, sqv: 0, z: 0, home: null, intro: 0 };
  };

  const layout = mobile ? LAYOUT_MOBILE : LAYOUT;
  for (const [key] of layout) bodies.push(build(key));

  const layoutBodies = [...bodies];   // bodies[] is re-ordered by grabbing; this keeps layout order

  const place = (instant) => {
    layout.forEach(([, fx, fy, a], i) => {
      const b = layoutBodies[i];
      b.home = { x: (fx - 0.5) * W, y: (0.5 - fy) * H, a };
      if (instant) Object.assign(b, { x: b.home.x, y: b.home.y, a, vx: 0, vy: 0, w: 0 });
    });
  };

  const resize = () => {
    W = container.clientWidth; H = container.clientHeight;
    S = Math.min(1.15, Math.max(0.5, W / 1440)) * (mobile ? 0.62 : 1);
    renderer.setSize(W, H, false);
    Object.assign(camera, { left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2 });
    camera.updateProjectionMatrix();
    ground.scale.set(W * 1.4, H * 1.4, 1);
    sun.position.set(-W * 0.25, H * 0.35, 1000);
    Object.assign(sun.shadow.camera, { left: -W * 0.75, right: W * 0.75, top: H * 0.75, bottom: -H * 0.75, near: 10, far: 2500 });
    sun.shadow.camera.updateProjectionMatrix();
    bodies.forEach((b) => b.group.scale.setScalar(S));
    place(!started);
    measureBlocks();
  };

  // ---------- physics ----------
  const world = (b, [x, y, r]) => {
    const c = Math.cos(b.a), s = Math.sin(b.a);
    return [b.x + (x * c - y * s) * S, b.y + (x * s + y * c) * S, r * S];
  };
  const kick = (b, impact) => { b.sqv += Math.min(impact, 900) * 0.0035; };   // a slight give, not a wobble

  const applyImpulse = (b, jx, jy, px, py) => {
    const m = b.m * S * S, I = b.I * S * S * S * S;
    b.vx += jx / m; b.vy += jy / m;
    b.w += ((px - b.x) * jy - (py - b.y) * jx) / I;
  };

  const contact = (A, B, ax, ay, ar, bx, by, br) => {
    const dx = bx - ax, dy = by - ay, d2 = dx * dx + dy * dy, rr = ar + br;
    if (d2 >= rr * rr || d2 < 1e-6) return;
    const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, over = rr - d;
    const px = ax + nx * ar, py = ay + ny * ar;
    const mA = 1 / (A.m * S * S), mB = 1 / (B.m * S * S);
    const share = 0.8 * over / (mA + mB);
    A.x -= nx * share * mA; A.y -= ny * share * mA;
    B.x += nx * share * mB; B.y += ny * share * mB;
    const rAx = px - A.x, rAy = py - A.y, rBx = px - B.x, rBy = py - B.y;
    const vAx = A.vx - A.w * rAy, vAy = A.vy + A.w * rAx, vBx = B.vx - B.w * rBy, vBy = B.vy + B.w * rBx;
    const vn = (vBx - vAx) * nx + (vBy - vAy) * ny;
    if (vn > 0) return;
    const IA = A.I * S ** 4, IB = B.I * S ** 4;
    const cA = rAx * ny - rAy * nx, cB = rBx * ny - rBy * nx;
    const e = 0.15;
    const j = -(1 + e) * vn / (mA + mB + cA * cA / IA + cB * cB / IB);
    applyImpulse(A, -j * nx, -j * ny, px, py);
    applyImpulse(B, j * nx, j * ny, px, py);
    kick(A, -vn); kick(B, -vn);
  };

  const step = (dt) => {
    for (const b of bodies) {
      if (b === grab?.b) {
        const [gx, gy] = world(b, grab.local);
        const jx = ((grab.tx - gx) * 18 - b.vx) * b.m * S * S * dt * 9;
        const jy = ((grab.ty - gy) * 18 - b.vy) * b.m * S * S * dt * 9;
        applyImpulse(b, jx, jy, gx, gy);
      }
      b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.w * dt;
      const f = Math.exp(-dt * (b === grab?.b ? 6 : 2.6));
      b.vx *= f; b.vy *= f; b.w *= Math.exp(-dt * 4);
    }
    for (let it = 0; it < 2; it++) {
      for (let i = 0; i < bodies.length; i++) for (let k = i + 1; k < bodies.length; k++) {
        const A = bodies[i], B = bodies[k];
        if (A.z > 30 || B.z > 30) continue;            // a lifted tool passes over the rest
        const reach = 220 * S;
        if (Math.abs(A.x - B.x) > reach * 1.8 || Math.abs(A.y - B.y) > reach * 1.8) continue;
        const wa = A.colliders.map((c) => world(A, c)), wb = B.colliders.map((c) => world(B, c));
        for (const [ax, ay, ar] of wa) for (const [bx, by, br] of wb) contact(A, B, ax, ay, ar, bx, by, br);
      }
      // walls: the hero edges, a little inside so nothing hides off-screen
      for (const b of bodies) for (const c of b.colliders) {
        // top wall sits below the fixed header so no tool slides under it
        const [x, y, r] = world(b, c), m = 6, top = H / 2 - 84;
        const pushes = [[-W / 2 + m - (x - r), 1, 0], [(x + r) - (W / 2 - m), -1, 0], [-H / 2 + m - (y - r), 0, 1], [(y + r) - top, 0, -1]];
        for (const k of blocks) {
          const qx = Math.max(k.x0, Math.min(x, k.x1)), qy = Math.max(k.y0, Math.min(y, k.y1));
          const dx = x - qx, dy = y - qy, d = Math.hypot(dx, dy);
          if (d < r && d > 1e-3) pushes.push([r - d, dx / d, dy / d]);
          else if (d <= 1e-3) {
            // centre is inside the box: leave through the nearest edge
            const exits = [[x - k.x0 + r, -1, 0], [k.x1 - x + r, 1, 0], [y - k.y0 + r, 0, -1], [k.y1 - y + r, 0, 1]];
            pushes.push(exits.reduce((m, e) => (e[0] < m[0] ? e : m)));
          }
        }
        for (const [over, nx, ny] of pushes) {
          if (over <= 0) continue;
          b.x += nx * over; b.y += ny * over;
          const vn = (b.vx - b.w * (y - b.y)) * nx + (b.vy + b.w * (x - b.x)) * ny;
          if (vn < 0) { applyImpulse(b, -vn * nx * (1.5) * b.m * S * S * 0.5, -vn * ny * 1.5 * b.m * S * S * 0.5, x, y); kick(b, -vn); }
        }
      }
    }
    // squish spring: thickness squashes, footprint swells, then it wobbles back
    for (const b of bodies) {
      b.sqv += (-170 * b.sq - 9 * b.sqv) * dt;
      b.sq += b.sqv * dt;
      b.sq = Math.max(-0.35, Math.min(0.35, b.sq));
    }
  };

  // ---------- pointer ----------
  let grab = null;
  const toWorld = (e) => {
    const r = container.getBoundingClientRect();
    return [e.clientX - r.left - W / 2, -(e.clientY - r.top - H / 2)];
  };
  const pick = (px, py) => {
    for (let i = bodies.length - 1; i >= 0; i--) {
      const b = bodies[i];
      for (const c of b.colliders) {
        const [x, y, r] = world(b, c);
        if ((px - x) ** 2 + (py - y) ** 2 < (r + 6) ** 2) return b;
      }
    }
    return null;
  };
  const down = (e) => {
    const [px, py] = toWorld(e);
    const b = pick(px, py);
    if (!b) return;
    e.preventDefault();
    const c = Math.cos(-b.a), s = Math.sin(-b.a), dx = (px - b.x) / S, dy = (py - b.y) / S;
    grab = { b, local: [dx * c - dy * s, dx * s + dy * c, 0], tx: px, ty: py };
    // pull it to the top of the pile
    bodies.splice(bodies.indexOf(b), 1); bodies.push(b);
    kick(b, 300);
    container.classList.add('is-grabbing');
    container.setPointerCapture(e.pointerId);
    wake();
  };
  container.addEventListener('pointerdown', down);
  container.addEventListener('pointermove', (e) => { if (grab) [grab.tx, grab.ty] = toWorld(e); });
  const up = () => { if (!grab) return; kick(grab.b, 400); grab = null; container.classList.remove('is-grabbing'); };
  container.addEventListener('pointerup', up);
  container.addEventListener('pointercancel', up);
  // touch: only claim the gesture when it starts on a tool, so the page still scrolls
  container.addEventListener('touchstart', (e) => {
    const t = e.touches[0], [px, py] = toWorld(t);
    if (pick(px, py)) e.preventDefault();
  }, { passive: false });

  // ---------- toolbar ----------
  let resetT = 0;
  section.querySelector('.hero-reset')?.addEventListener('click', () => {
    resetT = 1;
    bodies.forEach((b) => { b.vx = b.vy = b.w = 0; });
    wake();
  });

  // ---------- loop ----------
  let started = false, visible = true, raf = 0, last = 0, introAt = 0;
  resize();
  new ResizeObserver(resize).observe(container);
  document.fonts?.ready.then(measureBlocks);

  const draw = (now) => {
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      // intro: drop onto the desk one after another, then a squish on landing
      let drop = 0;
      if (introAt) {
        const t = Math.min(1, Math.max(0, (now - introAt - b.introDelay) / 650));
        drop = (1 - t) ** 3;
        if (t >= 1 && !b.landed) { b.landed = true; kick(b, 700); }
        b.group.visible = t > 0;
      }
      const lifted = grab?.b === b ? 1 : 0;
      b.z += (lifted * 60 - b.z) * 0.2;
      const sq = b.sq;
      b.group.position.set(b.x, b.y, b.z + drop * 140);
      b.group.rotation.set(0, 0, b.a + drop * 0.2);
      b.group.scale.set(S * (1 + sq * 0.5), S * (1 + sq * 0.5), S * (1 - sq));
      b.group.renderOrder = i;
    }
    renderer.render(scene, camera);
  };

  const loop = (now) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(1 / 30, (now - (last || now)) / 1000);
    last = now;
    if (resetT > 0) {
      resetT = Math.max(0, resetT - dt * 1.6);
      const k = 0.12;
      for (const b of bodies) { b.x += (b.home.x - b.x) * k; b.y += (b.home.y - b.y) * k; b.a += (b.home.a - b.a) * k; }
    } else {
      step(dt / 2); step(dt / 2);
    }
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  const wake = () => { if (!raf && visible && !reduced) raf = requestAnimationFrame(loop); };

  const begin = () => {
    if (started) return;
    started = true;
    setTimeout(measureBlocks, 1900);   // after the headline and copy finish rising into place
    if (reduced) { draw(performance.now()); return; }
    introAt = performance.now();
    layoutBodies.forEach((b, i) => { b.introDelay = 120 + i * 90; b.group.visible = false; });
    wake();
  };
  if (document.documentElement.classList.contains('is-loaded')) begin();
  else window.addEventListener('ii:loaded', begin, { once: true });
  draw(performance.now());

  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    last = 0;
    if (visible && started) wake();
  }).observe(container);

  addEventListener('pagehide', () => {
    renderer.dispose();
    pmrem.dispose();
    mats.forEach((m) => m.dispose());
    scene.traverse((o) => o.geometry?.dispose());
  }, { once: true });
}
