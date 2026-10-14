// Services hero: an isometric field of soft blocks. Blocks near the cursor rise
// and warm to coral; a slow wave keeps the field breathing when idle.
// Glyphs on some tops (×, ✳, ○) echo the tactile keyboard-like reference.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const COLS = 26, ROWS = 18;

function glyphTexture(char) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.font = '300 92px "Space Grotesk", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(char, 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function initBlockField(host) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  // look slightly up-left of the field centre so it sits right and low, clear of the headline
  const look = new THREE.Vector3(-8, 0, -0.5);
  camera.position.set(look.x + 14, 16, look.z + 14);
  camera.lookAt(look);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xfff1ea, 1.6);
  key.position.set(-6, 14, 4);
  scene.add(key);
  const glow = new THREE.PointLight(0xf25b54, 0, 9, 1.6);
  scene.add(glow);

  const n = COLS * ROWS;
  const blocks = new THREE.InstancedMesh(
    new RoundedBoxGeometry(0.88, 0.6, 0.88, 3, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0 }),
    n
  );
  scene.add(blocks);

  // glyph decals: one instanced mesh per glyph, each tied to a block index
  const glyphs = ['×', '✳', '○'].map((ch) => ({
    mesh: null, owners: [], tex: glyphTexture(ch)
  }));
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    if (r < 0.3) glyphs[Math.floor(r / 0.1)].owners.push(i);
  }
  const decalGeo = new THREE.PlaneGeometry(0.42, 0.42).rotateX(-Math.PI / 2);
  for (const g of glyphs) {
    g.mesh = new THREE.InstancedMesh(decalGeo, new THREE.MeshBasicMaterial({ map: g.tex, transparent: true, depthWrite: false }), g.owners.length);
    scene.add(g.mesh);
  }

  const base = new THREE.Color('#161414');
  const coral = new THREE.Color('#F25B54');
  const deep = new THREE.Color('#7a2a26');
  const pale = new THREE.Color('#FBD3D0');
  const glyphOff = new THREE.Color('#5a5552');
  const glyphOn = new THREE.Color('#1a0d0c');

  const pos = [], h = new Float32Array(n), heat = new Float32Array(n);
  for (let z = 0; z < ROWS; z++) for (let x = 0; x < COLS; x++) {
    pos.push(new THREE.Vector2(x - COLS / 2 + 0.5, z - ROWS / 2 + 0.5));
  }

  const resize = () => {
    const w = host.clientWidth, hgt = host.clientHeight;
    renderer.setSize(w, hgt, false);
    const zoom = w < 768 ? 7 : 8.5;
    const a = w / hgt;
    Object.assign(camera, { left: -zoom * a, right: zoom * a, top: zoom, bottom: -zoom });
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(host);

  const ndc = new THREE.Vector2(), ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3(999, 0, 999), aim = new THREE.Vector3(999, 0, 999);
  let pointerIn = false;
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    ray.ray.intersectPlane(plane, aim);
    pointerIn = true;
  });
  host.addEventListener('pointerleave', () => { pointerIn = false; });

  const m4 = new THREE.Matrix4(), col = new THREE.Color(), gcol = new THREE.Color();
  const t0 = performance.now();

  const step = (time) => {
    // the light drifts in a slow loop when no cursor is present
    if (!pointerIn) aim.set(Math.sin(time * 0.25) * 7, 0, Math.cos(time * 0.18) * 4);
    hit.lerp(aim, 0.06);
    glow.position.set(hit.x, 2.4, hit.z);
    glow.intensity += ((pointerIn ? 26 : 16) - glow.intensity) * 0.05;

    for (let i = 0; i < n; i++) {
      const p = pos[i];
      const dx = p.x - hit.x, dz = p.y - hit.z;
      const f = Math.exp(-(dx * dx + dz * dz) / 7);
      const wave = 0.08 * Math.sin(p.x * 0.45 + p.y * 0.3 + time * 0.9);
      // ponytail: 0.07 lerp is the "calm" knob; higher feels snappier
      h[i] += (f * 0.85 + wave - h[i]) * 0.07;
      heat[i] += (f - heat[i]) * 0.07;

      m4.makeTranslation(p.x, h[i], p.y);
      blocks.setMatrixAt(i, m4);
      const k = heat[i];
      col.copy(base).lerp(deep, Math.min(1, k * 2)).lerp(coral, Math.max(0, k * 1.6 - 0.5)).lerp(pale, Math.max(0, k * 2 - 1.5));
      blocks.setColorAt(i, col);
    }
    blocks.instanceMatrix.needsUpdate = true;
    blocks.instanceColor.needsUpdate = true;

    for (const g of glyphs) {
      g.owners.forEach((owner, j) => {
        m4.makeTranslation(pos[owner].x, h[owner] + 0.305, pos[owner].y);
        g.mesh.setMatrixAt(j, m4);
        gcol.copy(glyphOff).lerp(glyphOn, Math.min(1, heat[owner] * 2.2));
        g.mesh.setColorAt(j, gcol);
      });
      g.mesh.instanceMatrix.needsUpdate = true;
      if (g.mesh.instanceColor) g.mesh.instanceColor.needsUpdate = true;
    }
    renderer.render(scene, camera);
  };

  if (reduced) {
    for (let k = 0; k < 120; k++) step(4);
    return;
  }

  let visible = false, raf = 0;
  const loop = () => {
    raf = 0;
    if (!visible) return;
    step((performance.now() - t0) / 1000);
    raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }).observe(host);
}
