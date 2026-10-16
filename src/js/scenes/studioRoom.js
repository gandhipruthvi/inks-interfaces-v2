// Studio hero: the studio as a 3D isometric diorama, modelled on the studio
// render (two walls meeting at the back corner). Left wall: window with blinds,
// moodboard, the long shared desk with two monitors and mesh chairs. Back wall:
// lit corner shelves, the i&i monogram on a black plate, the sofa. Centre: rug,
// black coffee table, coral pouf. Live touches: screens redraw, plants sway,
// sunlight drifts, chairs idle, the camera follows the cursor.
// Pauses off-screen; one still frame under reduced motion.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const C = {
  slab: 0xf7f3ee, wall: 0xf6f1ea, floor: 0xe9d6bd, wood: 0xd8b48a, white: 0xfbf8f4,
  coral: 0xf25b54, deep: 0xc9433d, ink: 0x161616, ash: 0x8f8a85, cream: 0xebe3d8,
  leaf: 0x3f6b3a, leafLight: 0x5d8a4c, pot: 0xd8d2ca, glass: 0xcfe3c1
};
const mats = new Map();
const mat = (color, o = {}) => {
  const k = color + JSON.stringify(o);
  if (!mats.has(k)) mats.set(k, new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...o }));
  return mats.get(k);
};
const put = (parent, geo, material, x, y, z, ry = 0) => {
  const m = new THREE.Mesh(geo, typeof material === 'number' ? mat(material) : material);
  m.position.set(x, y, z);
  m.rotation.y = ry;
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
};
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const rbox = (w, h, d, r = 0.04) => new RoundedBoxGeometry(w, h, d, 3, r);
const cyl = (rt, rb, h, s = 24) => new THREE.CylinderGeometry(rt, rb, h, s);

const canvasTex = (w, h, draw) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const ctx = c.getContext('2d');
  const redraw = (time) => { draw(ctx, w, h, time); t.needsUpdate = true; };
  redraw(0);
  return { t, redraw };
};
const plane = (w, h, tex, opts = {}) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, ...opts }));

// a leafy plant: pot + a cluster of stretched leaves; returns the leaf group to sway
function plant(parent, x, y, z, s = 1, potColor = C.pot) {
  put(parent, cyl(0.12 * s, 0.09 * s, 0.2 * s), potColor, x, y + 0.1 * s, z);
  const g = new THREE.Group();
  g.position.set(x, y + 0.2 * s, z);
  for (let i = 0; i < 9; i++) {
    const l = put(g, new THREE.SphereGeometry(0.07 * s, 10, 8), i % 2 ? C.leaf : C.leafLight, Math.cos(i * 2.4) * 0.09 * s, (0.08 + (i % 4) * 0.06) * s, Math.sin(i * 2.4) * 0.09 * s);
    l.scale.set(0.7, 2.2, 0.35);
    l.rotation.set(Math.sin(i) * 0.7, i * 0.7, Math.cos(i * 1.3) * 0.7);
  }
  parent.add(g);
  return g;
}
// a trailing plant hanging off a shelf edge
function trailing(parent, x, y, z, len = 6) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  for (let i = 0; i < len; i++) {
    const l = put(g, new THREE.SphereGeometry(0.05, 8, 6), i % 2 ? C.leaf : C.leafLight, Math.sin(i * 1.7) * 0.05, -i * 0.09, Math.cos(i * 1.3) * 0.04);
    l.scale.set(1.2, 0.8, 0.6);
  }
  parent.add(g);
  return g;
}
// mesh office chair facing -x (toward the desk)
function chair(parent, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = put(g, box(0.36, 0.03, 0.04), C.ink, Math.cos(a) * 0.17, 0.08, Math.sin(a) * 0.17);
    leg.rotation.y = -a;
    put(g, new THREE.SphereGeometry(0.035, 8, 6), C.ink, Math.cos(a) * 0.34, 0.035, Math.sin(a) * 0.34);
  }
  put(g, cyl(0.03, 0.03, 0.38, 10), C.ash, 0, 0.27, 0);
  const top = new THREE.Group();
  top.position.y = 0.48;
  g.add(top);
  put(top, rbox(0.46, 0.08, 0.46, 0.04), C.coral, 0, 0, 0);
  const back = put(top, rbox(0.06, 0.55, 0.44, 0.03), mat(C.white, { roughness: 0.95 }), 0.24, 0.36, 0);
  back.rotation.z = -0.12;
  put(top, rbox(0.03, 0.5, 0.4, 0.015), C.ink, 0.27, 0.36, 0).rotation.z = -0.12;   // frame
  for (const s of [-1, 1]) put(top, box(0.3, 0.03, 0.04), C.ink, 0.02, 0.2, s * 0.24);   // arm rests
  parent.add(g);
  return top;
}

// ---- monitor screens and wall art, drawn on canvases ----
const drawDesignScreen = (x, w, h, t) => {      // an artboard with a coral mark taking shape
  x.fillStyle = '#1b1b1b'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#2a2a2a'; x.fillRect(0, 0, 34, h); x.fillRect(w - 50, 0, 50, h);
  x.fillStyle = '#F5F1EC'; x.fillRect(70, 26, w - 160, h - 52);
  const k = (Math.sin(t * 0.6) + 1) / 2;
  x.fillStyle = '#0B0B0B'; x.beginPath(); x.arc(w / 2 - 20, h / 2, 44, Math.PI * 0.5, Math.PI * 1.5); x.fill();
  x.fillStyle = '#F25B54'; x.beginPath(); x.arc(w / 2 - 20 + k * 12, h / 2, 44, -Math.PI * 0.5, Math.PI * 0.5); x.fill();
  x.fillStyle = '#F25B54';
  x.fillRect(w / 2 - 22 + k * 12 - 3, h / 2 - 47, 6, 6);
};
const drawGridScreen = (x, w, h, t) => {        // a moodboard grid, one tile pulsing
  x.fillStyle = '#1b1b1b'; x.fillRect(0, 0, w, h);
  const cols = ['#F25B54', '#F5F1EC', '#0B0B0B', '#C9433D', '#FBC1BE', '#8A8A8A'];
  const live = Math.floor(t * 0.8) % 12;
  for (let i = 0; i < 12; i++) {
    const cx = 60 + (i % 4) * 46, cy = 22 + Math.floor(i / 4) * 40;
    x.fillStyle = i === live ? '#F25B54' : cols[(i * 5) % 6];
    x.fillRect(cx, cy, 40, 34);
  }
  x.fillStyle = '#2a2a2a'; x.fillRect(0, 0, 40, h);
};
const drawPoster = (kind) => (x, w, h) => {
  x.fillStyle = kind === 'type' ? '#F5F1EC' : kind === 'ink' ? '#0B0B0B' : '#ffffff';
  x.fillRect(0, 0, w, h);
  if (kind === 'type') {
    x.fillStyle = '#0B0B0B'; x.font = 'bold 34px Space Grotesk, sans-serif';
    ['GOOD', 'DESIGN', 'BUILDS', 'GOOD', 'BUSINESS.'].forEach((l, i) => x.fillText(l, 16, 48 + i * 36));
    x.fillStyle = '#F25B54'; x.fillRect(w - 46, 14, 30, 30);
  } else if (kind === 'amp') {
    x.fillStyle = '#0B0B0B'; x.font = 'bold 150px Space Grotesk, sans-serif'; x.fillText('&', 34, 170);
  } else {
    x.fillStyle = kind === 'ink' ? '#F25B54' : '#0B0B0B';
    x.beginPath(); x.arc(w * 0.4, h * 0.45, w * 0.28, 0, Math.PI * 1.5); x.lineTo(w * 0.4, h * 0.45); x.fill();
    x.fillStyle = kind === 'ink' ? '#F5F1EC' : '#F25B54';
    x.fillRect(w * 0.55, h * 0.55, w * 0.25, h * 0.25);
  }
};

export function initStudioRoom(host) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch { return false; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xeeeae5, 1);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const room = new THREE.Group();
  scene.add(room);
  const sway = [];

  // ---- shell
  put(room, rbox(6.5, 0.3, 5.5, 0.06), C.slab, 0.1, -0.15, 0.1);
  const floorTex = canvasTex(512, 512, (x, w, h) => {
    x.fillStyle = '#e9d6bd'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(120,90,60,.12)'; x.lineWidth = 2;
    for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); }
  });
  const floor = put(room, box(6, 0.02, 5), new THREE.MeshStandardMaterial({ map: floorTex.t, roughness: 0.75 }), 0.1, 0.01, 0.1);
  floor.castShadow = false;
  put(room, box(0.2, 3.3, 5.3), C.wall, -3.0, 1.65, 0.05);      // left wall (x = -3)
  put(room, box(6.3, 3.3, 0.2), C.wall, 0.05, 1.65, -2.5);      // back wall (z = -2.5)
  put(room, box(0.34, 0.12, 5.4), C.white, -3.02, 3.33, 0.05);  // wall caps
  put(room, box(6.4, 0.12, 0.34), C.white, 0.05, 3.33, -2.52);

  // ---- window with blinds (left wall, back half)
  const glassTex = canvasTex(256, 192, (x, w, h, t) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#dfe9cf'); g.addColorStop(1, '#a8c48d');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      x.fillStyle = i % 2 ? 'rgba(80,120,60,.55)' : 'rgba(120,160,90,.5)';
      x.beginPath(); x.arc((i * 47 + Math.sin(t * 0.5 + i) * 4) % w, h * 0.45 + ((i * 31) % 90), 18 + (i % 4) * 6, 0, 7); x.fill();
    }
  });
  const glass = plane(1.7, 1.45, glassTex.t, { emissive: 0xffffff, emissiveMap: glassTex.t, emissiveIntensity: 0.55 });
  glass.position.set(-2.89, 1.75, -1.25); glass.rotation.y = Math.PI / 2;
  room.add(glass);
  put(room, box(0.08, 0.06, 1.85), C.white, -2.86, 1.0, -1.25);           // sill
  put(room, box(0.08, 0.06, 1.85), C.white, -2.86, 2.5, -1.25);
  put(room, box(0.08, 1.55, 0.06), C.white, -2.86, 1.75, -2.17);
  put(room, box(0.08, 1.55, 0.06), C.white, -2.86, 1.75, -0.33);
  put(room, box(0.08, 1.55, 0.04), C.white, -2.86, 1.75, -1.25);
  for (let i = 0; i < 9; i++) put(room, box(0.05, 0.02, 1.78), mat(C.white, { roughness: 0.6 }), -2.8, 2.45 - i * 0.07, -1.25).rotation.z = 0.5;

  // ---- moodboard (left wall, front half)
  const posters = [['type', 0.5, 0.62, 2.25, 0.95], ['shape', 0.38, 0.48, 2.55, 0.38], ['ink', 0.36, 0.46, 2.05, 0.4], ['amp', 0.36, 0.36, 1.6, 0.45], ['shape', 0.4, 0.4, 1.6, 0.95], ['ink', 0.34, 0.42, 1.55, 1.42], ['shape', 0.3, 0.38, 2.6, 1.45]];
  posters.forEach(([kind, w, h, y, z]) => {
    const p = plane(w, h, canvasTex(256, Math.round(256 * h / w), drawPoster(kind)).t);
    p.position.set(-2.885, y, z); p.rotation.y = Math.PI / 2;
    p.receiveShadow = true;
    room.add(p);
  });

  // ---- the long desk along the left wall
  put(room, rbox(0.9, 0.06, 3.7, 0.02), C.wood, -2.45, 0.95, -0.55);
  put(room, rbox(0.8, 0.92, 0.55, 0.03), C.white, -2.47, 0.46, 0.95);       // drawer unit
  [0.25, 0.55, 0.8].forEach((y) => put(room, box(0.01, 0.006, 0.4), C.ash, -2.06, y, 0.95));
  put(room, box(0.06, 0.92, 0.06), C.white, -2.08, 0.46, -2.3);
  const screens = [canvasTex(256, 160, drawDesignScreen), canvasTex(256, 160, drawGridScreen)];
  [[-1.65, screens[0]], [-0.15, screens[1]]].forEach(([z, sc]) => {
    put(room, rbox(0.06, 0.62, 1.0, 0.02), C.ink, -2.62, 1.42, z);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 0.56), new THREE.MeshBasicMaterial({ map: sc.t, toneMapped: false }));
    face.position.set(-2.585, 1.42, z); face.rotation.y = Math.PI / 2;
    room.add(face);
    put(room, box(0.06, 0.28, 0.06), C.ash, -2.66, 1.1, z);
    put(room, box(0.28, 0.02, 0.32), C.ash, -2.62, 0.99, z);
    put(room, rbox(0.18, 0.025, 0.55, 0.01), C.ink, -2.28, 0.995, z);      // keyboard
    put(room, rbox(0.07, 0.02, 0.05, 0.01), C.ink, -2.28, 0.995, z + 0.42);  // mouse
  });
  put(room, rbox(0.3, 0.04, 0.22, 0.01), C.coral, -2.35, 1.0, 0.55);        // notebooks
  put(room, rbox(0.26, 0.03, 0.2, 0.01), C.ink, -2.33, 1.035, 0.57);
  put(room, rbox(0.24, 0.035, 0.18, 0.01), C.coral, -2.3, 1.0, -0.95);
  put(room, cyl(0.05, 0.05, 0.12), C.ink, -2.6, 1.04, -0.95);               // pen cups
  put(room, cyl(0.05, 0.05, 0.12), C.coral, -2.6, 1.04, 0.3);
  for (let i = 0; i < 4; i++) put(room, cyl(0.006, 0.006, 0.22, 6), [C.coral, C.ink, C.coral, C.ash][i], -2.6 + Math.sin(i) * 0.02, 1.15, -0.95 + Math.cos(i) * 0.02);
  sway.push(plant(room, -2.6, 0.98, -0.9, 1.1, C.white), plant(room, -2.55, 0.98, 1.05, 1.3, C.white));
  // desk lamp at the front end
  put(room, cyl(0.08, 0.09, 0.03), C.ink, -2.6, 0.995, 0.75);
  const arm = put(room, cyl(0.012, 0.012, 0.5, 8), C.ink, -2.52, 1.22, 0.75);
  arm.rotation.z = -0.35;
  const shade = put(room, new THREE.ConeGeometry(0.1, 0.16, 20, 1, true), mat(C.ink, { side: THREE.DoubleSide }), -2.38, 1.44, 0.75);
  shade.rotation.z = 2.2;
  const lampLight = new THREE.PointLight(0xffd9b0, 2.5, 2.2, 1.6);
  lampLight.position.set(-2.33, 1.33, 0.75);
  room.add(lampLight);
  const chairs = [chair(room, -1.75, -1.65), chair(room, -1.65, -0.1)];

  // ---- corner shelves on the back wall, lit from underneath
  [1.35, 1.9, 2.45].forEach((y, row) => {
    put(room, rbox(1.7, 0.05, 0.36, 0.01), C.wood, -1.9, y, -2.22);
    const strip = put(room, box(1.6, 0.01, 0.02), mat(0xfff0d8, { emissive: 0xffe2b8, emissiveIntensity: 1.6 }), -1.9, y - 0.03, -2.1);
    strip.castShadow = false;
    let x = -2.65;
    for (let i = 0; i < 7 + row; i++) {
      const hgt = 0.22 + ((i * 7 + row * 3) % 5) * 0.03;
      put(room, box(0.06, hgt, 0.26), [C.coral, C.ink, C.white, C.ink, C.coral, C.cream, C.ink][(i + row) % 7], x, y + 0.025 + hgt / 2, -2.22);
      x += 0.075;
      if (i === 3 + row % 2) x += 0.18;
    }
    const frame = put(room, rbox(0.24, 0.3, 0.03, 0.01), C.ink, -1.2 + row * 0.15, y + 0.18, -2.3);
    frame.rotation.x = -0.1;
    put(room, box(0.18, 0.22, 0.01), row % 2 ? C.coral : C.white, -1.2 + row * 0.15, y + 0.18, -2.28);
  });
  put(room, rbox(1.7, 0.75, 0.45, 0.02), C.white, -1.9, 0.38, -2.18);       // low cabinet
  [-2.32, -1.9, -1.48].forEach((x) => put(room, box(0.004, 0.6, 0.004), C.ash, x, 0.4, -1.95));
  sway.push(trailing(room, -1.1, 2.45, -2.06, 8), trailing(room, -2.6, 1.9, -2.06, 5));
  sway.push(plant(room, -1.35, 1.9, -2.22, 0.8, C.coral));

  // ---- i&i monogram on a black plate (the brand file itself, flat, never redrawn)
  const logoPlate = put(room, rbox(1.2, 0.95, 0.04, 0.03), mat(0x000000, { roughness: 0.6 }), 1.6, 2.05, -2.39);   // monogram is coral: solid #000 plate per the brand rules
  logoPlate.castShadow = false;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 1024;
    const k = Math.min(1024 / img.width, 1024 / img.height) * 0.9;   // contain, keep the mark's proportions
    c.getContext('2d').drawImage(img, (1024 - img.width * k) / 2, (1024 - img.height * k) / 2, img.width * k, img.height * k);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.9 }));
    logo.position.set(1.6, 2.05, -2.365);
    room.add(logo);
    if (reduced) render();
  };
  img.src = '/brand/secondary-monogram.png';

  // ---- sofa against the back wall
  const sofa = new THREE.Group();
  sofa.position.set(1.35, 0, -1.85);
  room.add(sofa);
  const fabric = mat(C.cream, { roughness: 1 });
  put(sofa, rbox(2.3, 0.32, 0.95, 0.08), fabric, 0, 0.26, 0);
  put(sofa, rbox(2.3, 0.62, 0.26, 0.1), fabric, 0, 0.62, -0.38);
  for (const s of [-1, 1]) put(sofa, rbox(0.26, 0.52, 0.95, 0.1), fabric, s * 1.1, 0.4, 0);
  for (const s of [-1, 1]) put(sofa, rbox(0.95, 0.14, 0.72, 0.06), fabric, s * 0.48, 0.48, 0.08);
  const check = canvasTex(64, 64, (x, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.fillStyle = (i + j) % 2 ? '#161616' : '#f6f1ea'; x.fillRect(i * 8, j * 8, 8, 8); } });
  check.t.magFilter = THREE.NearestFilter;
  [[-0.6, C.coral], [-0.05, new THREE.MeshStandardMaterial({ map: check.t, roughness: 1 })], [0.55, C.white]].forEach(([x, m], i) => {
    const p = put(sofa, rbox(0.42, 0.38, 0.13, 0.06), m, x, 0.74, -0.2);
    p.rotation.set(-0.25, (i - 1) * 0.15, (i - 1) * 0.08);
  });
  for (const s of [-1, 1]) put(sofa, cyl(0.025, 0.02, 0.1, 8), C.ink, s * 1.05, 0.05, 0.35);

  // ---- rug, coffee table, pouf, corner plant
  const rugTex = canvasTex(256, 256, (x, w, h) => {
    x.fillStyle = '#ece3d6'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(150,130,110,.18)'; x.lineWidth = 2;
    for (let i = 0; i < 40; i++) { x.beginPath(); x.arc((i * 53) % w, (i * 97) % h, 10 + (i % 5) * 4, 0, 4); x.stroke(); }
  });
  const rug = put(room, rbox(3.1, 0.025, 2.6, 0.01), new THREE.MeshStandardMaterial({ map: rugTex.t, roughness: 1 }), 0.75, 0.025, 0.35);
  rug.castShadow = false;
  put(room, cyl(0.58, 0.58, 0.36, 40), mat(C.ink, { roughness: 0.55 }), 0.85, 0.22, -0.35);
  put(room, rbox(0.42, 0.05, 0.3, 0.01), C.white, 0.95, 0.43, -0.3).rotation.y = 0.3;
  put(room, rbox(0.38, 0.04, 0.27, 0.01), C.coral, 0.95, 0.475, -0.3).rotation.y = 0.2;
  put(room, cyl(0.05, 0.06, 0.16), C.coral, 0.55, 0.48, -0.5);
  for (let i = 0; i < 3; i++) put(room, cyl(0.004, 0.004, 0.22, 6), C.ink, 0.55 + (i - 1) * 0.015, 0.62, -0.5);
  sway.push(plant(room, 0.75, 0.4, -0.7, 0.8, C.coral));
  put(room, cyl(0.4, 0.4, 0.42, 36), mat(C.coral, { roughness: 1 }), 0.05, 0.23, 1.1);
  put(room, cyl(0.26, 0.2, 0.55), C.pot, 2.7, 0.28, -1.95);
  const bigPlant = new THREE.Group();
  bigPlant.position.set(2.7, 0.55, -1.95);
  for (let i = 0; i < 9; i++) {
    const l = put(bigPlant, new THREE.SphereGeometry(0.16, 12, 10), i % 2 ? C.leaf : C.leafLight, Math.cos(i * 2.1) * 0.18, 0.35 + (i % 4) * 0.22, Math.sin(i * 2.1) * 0.18);
    l.scale.set(0.5, 1.9, 0.18);
    l.rotation.set(Math.sin(i * 1.7) * 0.6, i * 1.1, Math.cos(i * 1.7) * 0.6);
  }
  room.add(bigPlant);
  sway.push(bigPlant);

  // ---- light: soft sky + warm sun coming through the window side
  scene.add(new THREE.HemisphereLight(0xfffaf3, 0xd9cbbb, 1.6));
  const sun = new THREE.DirectionalLight(0xfff0dc, 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
  sun.shadow.bias = -0.0004;
  sun.shadow.radius = 5;
  scene.add(sun);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const look = new THREE.Vector3(0, 1.1, 0);
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight, a = w / h;
    renderer.setSize(w, h, false);
    const viewH = Math.max(6.2, 8.2 / a);      // keep the whole room in frame
    Object.assign(camera, { left: -viewH * a / 2, right: viewH * a / 2, top: viewH / 2, bottom: -viewH / 2 });
    camera.updateProjectionMatrix();
  };
  resize();

  const mouse = new THREE.Vector2(), smooth = new THREE.Vector2();
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  });
  host.addEventListener('pointerleave', () => mouse.set(0, 0));

  const t0 = performance.now();
  let frame = 0;
  function render() {
    const t = reduced ? 3 : (performance.now() - t0) / 1000;
    smooth.lerp(mouse, 0.05);
    // orbit a little around the room with the cursor, plus a slow idle drift
    const yaw = Math.PI / 4 + smooth.x * 0.22 + Math.sin(t * 0.15) * 0.05;
    camera.position.set(Math.sin(yaw) * 12, 9.2 - smooth.y * 1.2, Math.cos(yaw) * 12);
    camera.lookAt(look);
    sun.position.set(-7 + Math.sin(t * 0.1) * 1.5, 8, 4 + Math.cos(t * 0.1) * 1.5);
    sway.forEach((g, i) => { g.rotation.z = Math.sin(t * 0.9 + i) * 0.03; g.rotation.x = Math.cos(t * 0.7 + i) * 0.02; });
    chairs.forEach((c, i) => { c.rotation.y = Math.sin(t * 0.35 + i * 2) * 0.18; });
    if (frame++ % 4 === 0) { screens.forEach((s) => s.redraw(t)); glassTex.redraw(t); }
    lampLight.intensity = 2.5 + Math.sin(t * 7) * 0.04;
    renderer.render(scene, camera);
  }

  new ResizeObserver(() => { resize(); if (reduced) render(); }).observe(host);
  if (reduced) { render(); return true; }
  let visible = false, raf = 0;
  const loop = () => { raf = 0; if (!visible) return; render(); raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(host);

  addEventListener('pagehide', () => {
    renderer.dispose();
    mats.forEach((m) => m.dispose());
    scene.traverse((o) => { o.geometry?.dispose(); o.material?.map?.dispose(); });
  }, { once: true });
  return true;
}
