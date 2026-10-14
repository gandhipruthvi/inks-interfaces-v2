// Studio hero panel: the brand pattern, extruded straight from Pattern.svg into a
// coral relief on black. A raking light makes it read like an embossed print;
// tiles near the cursor lift gently and the plate tilts toward the pointer.
// (Pattern only. The logo itself is never put into 3D.)
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const TILE_W = 144.18, TILE_H = 119.48, COLS = 3, ROWS = 3;

export function initPatternRelief(host) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 1);
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 5000);
  camera.position.set(0, -120, 360);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-500, 400, 260);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffd9d6, 0.5);
  fill.position.set(400, -300, 300);
  scene.add(fill);

  const plate = new THREE.Group();
  scene.add(plate);

  let tiles = null;
  const tileCenters = [];

  new SVGLoader().load('/brand/Pattern.svg', (data) => {
    const parts = [];
    for (const path of data.paths) {
      for (const shape of SVGLoader.createShapes(path)) {
        parts.push(new THREE.ExtrudeGeometry(shape, { depth: 5, bevelEnabled: true, bevelThickness: 0.6, bevelSize: 0.35, bevelSegments: 2, curveSegments: 10 }));
      }
    }
    const geo = mergeGeometries(parts);
    geo.scale(1, -1, 1);                     // SVG y points down
    geo.translate(-TILE_W / 2, TILE_H / 2, 0);
    geo.computeVertexNormals();

    tiles = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xf15b54, roughness: 0.62, metalness: 0.05 }), COLS * ROWS);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      tileCenters.push(new THREE.Vector2((c - (COLS - 1) / 2) * TILE_W, (r - (ROWS - 1) / 2) * TILE_H));
    }
    plate.add(tiles);
    if (reduced) step(3);
  });

  const resize = () => {
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(host);

  const mouse = new THREE.Vector2(0, 0), smooth = new THREE.Vector2(0, 0);
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  });
  host.addEventListener('pointerleave', () => mouse.set(0, 0));

  const m4 = new THREE.Matrix4(), lift = new Float32Array(COLS * ROWS);
  const t0 = performance.now();

  function step(time) {
    if (!tiles) return;
    smooth.lerp(mouse, 0.05);
    plate.rotation.set(-0.38 + smooth.y * 0.1, smooth.x * 0.14, 0);
    // cursor position projected roughly onto the plate, in tile units
    const cx = smooth.x * TILE_W * COLS * 0.42, cy = smooth.y * TILE_H * ROWS * 0.42;
    tileCenters.forEach((p, i) => {
      const d2 = ((p.x - cx) ** 2 + (p.y - cy) ** 2) / (TILE_W * TILE_W * 1.6);
      const target = 18 * Math.exp(-d2) + 4 * Math.sin(time * 0.7 + p.x * 0.01 + p.y * 0.012);
      lift[i] += (target - lift[i]) * 0.06;
      m4.makeTranslation(p.x, p.y, lift[i]);
      tiles.setMatrixAt(i, m4);
    });
    tiles.instanceMatrix.needsUpdate = true;
    key.position.x = -500 + Math.sin(time * 0.2) * 160;  // slow raking sweep
    renderer.render(scene, camera);
  }

  if (reduced) return;
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
