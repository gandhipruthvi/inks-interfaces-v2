// Services bento: a small live 3D object in each card (road with pins, quote
// marks, palette, refresh arrows, laptop, component cubes, rocket). Graphite
// and silver with coral accents. One renderer and one canvas behind the whole
// grid; each frame it scissors into every card's .bento-icon box.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const M = {
  graphite: new THREE.MeshPhysicalMaterial({ color: 0x2b2b2b, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 }),
  silver: new THREE.MeshPhysicalMaterial({ color: 0xc9c3bc, metalness: 0.9, roughness: 0.22 }),
  coral: new THREE.MeshPhysicalMaterial({ color: 0xf25b54, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.1 }),
  pale: new THREE.MeshPhysicalMaterial({ color: 0xfbc1be, roughness: 0.4, clearcoat: 0.6 }),
  paper: new THREE.MeshPhysicalMaterial({ color: 0xf5f1ec, roughness: 0.5 })
};
const mesh = (geo, mat) => new THREE.Mesh(geo, mat);
const extrude = (shape, depth = 0.25, bevel = 0.06) =>
  new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 24 }).center();

// map pin: a lathe teardrop with a ring through its head
const pin = (mat) => {
  const g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20, a = t * Math.PI; pts.push(new THREE.Vector2(Math.sin(a) * 0.32 * (1 - t * 0.15) * (t < 0.5 ? 1 : 1), Math.cos(a) * 0.32 + 0.55)); }
  pts.push(new THREE.Vector2(0.02, -0.2));
  const body = mesh(new THREE.LatheGeometry(pts.reverse(), 32), mat);
  const hole = mesh(new THREE.TorusGeometry(0.13, 0.05, 12, 32), M.graphite);
  hole.position.set(0, 0.6, 0.27);
  g.add(body, hole);
  return g;
};

const BUILD = {
  road() {
    const g = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3([[-1.4, -0.9], [-0.4, -0.7], [0.1, -0.1], [-0.5, 0.4], [0.4, 0.8], [1.3, 0.6]].map(([x, y]) => new THREE.Vector3(x, y, 0)));
    const road = mesh(new THREE.TubeGeometry(curve, 120, 0.16, 12, false), M.graphite);
    road.scale.z = 0.25;
    const lane = mesh(new THREE.TubeGeometry(curve, 120, 0.025, 6, false), M.paper);
    lane.position.z = 0.05;
    const p1 = pin(M.coral), p2 = pin(M.silver);
    p1.position.set(-0.45, -0.68, 0.1); p2.position.set(0.45, 0.82, 0.1);
    p1.scale.setScalar(0.9); p2.scale.setScalar(0.7);
    g.add(road, lane, p1, p2);
    g.rotation.x = -0.9;
    return { g, tick: (t) => { p1.position.z = 0.1 + Math.abs(Math.sin(t * 2)) * 0.25; p2.position.z = 0.1 + Math.abs(Math.sin(t * 2 + 1.5)) * 0.2; g.rotation.z = Math.sin(t * 0.4) * 0.2; } };
  },
  quote() {
    const g = new THREE.Group();
    const mark = () => {
      const s = new THREE.Shape();
      s.absarc(0, 0, 0.42, 0, Math.PI * 2, false);
      const tail = new THREE.Shape();
      tail.moveTo(0.3, 0.1); tail.bezierCurveTo(0.35, -0.6, 0.0, -0.9, -0.4, -1.05); tail.bezierCurveTo(-0.1, -0.7, -0.05, -0.3, -0.2, -0.2); tail.closePath();
      const m = new THREE.Group();
      m.add(mesh(extrude(s, 0.3), M.coral));
      const t = mesh(extrude(tail, 0.3), M.coral); t.position.set(0.05, -0.45, 0);
      m.add(t);
      return m;
    };
    const a = mark(), b = mark();
    b.children.forEach((c) => { c.material = M.silver; });
    a.position.x = -0.6; b.position.x = 0.6;
    g.add(a, b);
    g.rotation.z = Math.PI;   // opening quotes
    return { g, tick: (t) => { a.rotation.y = Math.sin(t * 1.2) * 0.5; b.rotation.y = Math.sin(t * 1.2 + 0.8) * 0.5; g.position.y = Math.sin(t) * 0.08; } };
  },
  palette() {
    const g = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(0, 1.05);
    s.bezierCurveTo(0.9, 1.05, 1.3, 0.3, 1.1, -0.35);
    s.bezierCurveTo(0.95, -0.9, 0.3, -1.05, -0.2, -0.95);
    s.bezierCurveTo(-0.65, -0.85, -0.35, -0.4, -0.75, -0.35);
    s.bezierCurveTo(-1.2, -0.3, -1.25, 0.2, -1.05, 0.5);
    s.bezierCurveTo(-0.8, 0.9, -0.4, 1.05, 0, 1.05);
    const hole = new THREE.Path(); hole.absarc(-0.45, -0.55, 0.16, 0, Math.PI * 2, true);
    s.holes.push(hole);
    g.add(mesh(extrude(s, 0.12, 0.05), M.graphite));
    [[0.1, 0.6, M.coral], [0.65, 0.35, M.pale], [0.7, -0.25, M.paper], [-0.55, 0.35, M.silver]].forEach(([x, y, m]) => {
      const blob = mesh(new THREE.SphereGeometry(0.2, 24, 16), m);
      blob.scale.z = 0.45; blob.position.set(x, y, 0.13);
      g.add(blob);
    });
    const brush = new THREE.Group();
    brush.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.9, 16), M.silver));
    const tip = mesh(new THREE.ConeGeometry(0.1, 0.4, 16), M.coral); tip.position.y = -1.1; tip.rotation.x = Math.PI;
    brush.add(tip);
    brush.position.set(0.2, -0.1, 0.35); brush.rotation.z = -0.8;
    g.add(brush);
    g.rotation.x = -0.35;
    return { g, tick: (t) => { brush.rotation.z = -0.8 + Math.sin(t * 1.6) * 0.15; g.rotation.y = Math.sin(t * 0.5) * 0.3; } };
  },
  refresh() {
    const g = new THREE.Group();
    const arc = (mat, rot) => {
      const a = new THREE.Group();
      a.add(mesh(new THREE.TorusGeometry(0.85, 0.13, 16, 64, Math.PI * 0.8), mat));
      const head = mesh(new THREE.ConeGeometry(0.28, 0.45, 24), mat);
      head.position.set(Math.cos(Math.PI * 0.8) * 0.85, Math.sin(Math.PI * 0.8) * 0.85, 0);
      head.rotation.z = Math.PI * 0.8;
      a.add(head);
      a.rotation.z = rot;
      return a;
    };
    g.add(arc(M.coral, 0), arc(M.silver, Math.PI));
    return { g, tick: (t) => { g.rotation.z = -t * 0.9; g.rotation.x = Math.sin(t * 0.6) * 0.35; } };
  },
  laptop() {
    const g = new THREE.Group();
    const base = mesh(new RoundedBoxGeometry(2.2, 0.1, 1.5, 4, 0.05), M.silver);
    const lid = new THREE.Group();
    const screen = mesh(new RoundedBoxGeometry(2.2, 1.45, 0.08, 4, 0.04), M.graphite);
    screen.position.y = 0.72;
    lid.add(screen);
    // "</>" in coral on the screen
    const chev = (dir) => { const s = new THREE.Shape(); s.moveTo(0, 0.28); s.lineTo(-0.24 * dir, 0); s.lineTo(0, -0.28); s.lineTo(0.08 * dir, -0.22); s.lineTo(-0.12 * dir, 0); s.lineTo(0.08 * dir, 0.22); s.closePath(); return s; };
    const slash = new THREE.Shape(); slash.moveTo(0.1, 0.32); slash.lineTo(0.18, 0.3); slash.lineTo(-0.1, -0.32); slash.lineTo(-0.18, -0.3); slash.closePath();
    [[chev(1), -0.42], [slash, 0], [chev(-1), 0.42]].forEach(([sh, x]) => { const m = mesh(extrude(sh, 0.05, 0.015), M.coral); m.position.set(x, 0.75, 0.06); lid.add(m); });
    lid.position.set(0, 0.05, -0.72);
    g.add(base, lid);
    g.rotation.set(0.35, -0.5, 0);
    g.position.y = -0.35;
    return { g, tick: (t) => { lid.rotation.x = -0.22 + Math.sin(t * 0.9) * 0.18; g.rotation.y = -0.5 + Math.sin(t * 0.4) * 0.25; } };
  },
  cubes() {
    const g = new THREE.Group();
    const cubes = [];
    const pos = [[-0.55, -0.55, 0], [0.05, -0.55, 0], [0.65, -0.55, 0], [-0.25, 0.05, 0], [0.35, 0.05, 0], [0.05, 0.65, 0], [0.05, -0.55, -0.6], [0.65, -0.55, -0.6]];
    pos.forEach(([x, y, z], i) => {
      const c = mesh(new RoundedBoxGeometry(0.56, 0.56, 0.56, 3, 0.07), i === 5 ? M.coral : M.graphite);
      c.position.set(x, y, z);
      c.userData.y = y;
      cubes.push(c); g.add(c);
    });
    g.rotation.set(0.5, -0.7, 0);
    return { g, tick: (t) => { cubes.forEach((c, i) => { c.position.y = c.userData.y + Math.max(0, Math.sin(t * 1.4 - i * 0.6)) * 0.15; }); g.rotation.y = -0.7 + t * 0.2; } };
  },
  rocket() {
    const g = new THREE.Group();
    const prof = [[0, -0.9], [0.32, -0.8], [0.36, -0.2], [0.33, 0.35], [0.22, 0.75], [0, 1.0]].map(([x, y]) => new THREE.Vector2(x, y));
    const body = mesh(new THREE.LatheGeometry(prof, 32), M.silver);
    const nose = mesh(new THREE.SphereGeometry(0.235, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.coral);
    nose.position.y = 0.75; nose.scale.y = 1.15;
    const window_ = mesh(new THREE.TorusGeometry(0.11, 0.04, 12, 24), M.graphite);
    window_.position.set(0, 0.2, 0.33);
    const fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(0.4, -0.35); fin.lineTo(0.4, -0.05); fin.lineTo(0, 0.35); fin.closePath();
    for (let i = 0; i < 3; i++) {
      const f = mesh(extrude(fin, 0.05, 0.02), M.coral);
      const a = (i / 3) * Math.PI * 2;
      f.position.set(Math.sin(a) * 0.42, -0.65, Math.cos(a) * 0.42);
      f.rotation.y = a - Math.PI / 2;
      g.add(f);
    }
    const flame = mesh(new THREE.ConeGeometry(0.2, 0.6, 20), M.pale);
    flame.position.y = -1.15; flame.rotation.x = Math.PI;
    g.add(body, nose, window_, flame);
    g.rotation.z = -0.6;
    return { g, tick: (t) => { flame.scale.set(1, 0.8 + Math.random() * 0.4, 1); g.position.set(Math.sin(t * 1.3) * 0.05, Math.sin(t * 1.6) * 0.12, 0); g.rotation.y = t * 0.6; } };
  }
};

export function initBentoIcons(grid) {
  const canvas = grid.querySelector('.bento-canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.autoClear = false;
  renderer.setScissorTest(true);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const cards = [...grid.querySelectorAll('.bento-card')].map((card) => {
    const slot = card.querySelector('.bento-icon');
    const scene = new THREE.Scene();
    scene.environment = env;
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-3, 4, 5);
    const rim = new THREE.DirectionalLight(0xf25b54, 1.2); rim.position.set(4, -2, -3);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.25));
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 7.5);
    camera.aspect = 0;
    const icon = BUILD[card.dataset.icon]();
    scene.add(icon.g);
    // frame the object: its bounding sphere must fit the slot's narrower side
    const radius = new THREE.Box3().setFromObject(icon.g).getBoundingSphere(new THREE.Sphere()).radius;
    const st = { slot, scene, camera, icon, radius, hover: 0, target: 0 };
    card.addEventListener('pointerenter', () => { st.target = 1; });
    card.addEventListener('pointerleave', () => { st.target = 0; });
    return st;
  });

  const resize = () => renderer.setSize(grid.clientWidth, grid.clientHeight, false);
  resize();
  new ResizeObserver(resize).observe(grid);

  const t0 = performance.now();
  const render = () => {
    const t = (performance.now() - t0) / 1000;
    const g = grid.getBoundingClientRect();
    renderer.setScissor(0, 0, grid.clientWidth, grid.clientHeight);
    renderer.clear();
    for (const c of cards) {
      const r = c.slot.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || !r.width) continue;
      const x = r.left - g.left, y = g.bottom - r.bottom;
      renderer.setViewport(x, y, r.width, r.height);
      renderer.setScissor(x, y, r.width, r.height);
      const aspect = r.width / r.height;
      if (aspect !== c.camera.aspect) {
        c.camera.aspect = aspect;
        c.camera.position.z = (c.radius * 1.12) / Math.sin(THREE.MathUtils.degToRad(15)) / Math.min(1, aspect);
        c.camera.updateProjectionMatrix();
      }
      c.hover += (c.target - c.hover) * 0.08;
      if (!reduced) c.icon.tick(t * (1 + c.hover * 1.5));
      c.icon.g.scale.setScalar(1 + c.hover * 0.08);
      renderer.render(c.scene, c.camera);
    }
  };

  if (reduced) { render(); new ResizeObserver(render).observe(grid); return; }
  let visible = false, raf = 0;
  const loop = () => { raf = 0; if (!visible) return; render(); raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(grid);

  addEventListener('pagehide', () => {
    renderer.dispose(); pmrem.dispose();
    cards.forEach((c) => c.scene.traverse((o) => o.geometry?.dispose()));
  }, { once: true });
}
