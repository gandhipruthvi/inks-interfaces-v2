// Project library: all 28 covers as paper cards fanned around a slowly turning ring.
// Hover lifts a card and names it, click opens the case study, drag spins the ring.
import * as THREE from 'three';
import projects from '../../data/projects.json';
import uvs from '../../data/atlas-uvs.json';

const CARD_W = 0.62, CARD_H = 0.74, BORDER = 0.035;

export function initRingScene(section) {
  const host = section.querySelector('.ring-canvas');
  const label = section.querySelector('.ring-label');
  const chips = section.querySelectorAll('.ring-chip');
  if (!host) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  const target = new THREE.Vector3(0, -0.15, 0);

  const atlas = new THREE.TextureLoader().load('/assets/atlas.webp');
  atlas.colorSpace = THREE.SRGBColorSpace;
  atlas.anisotropy = 8;

  const paper = new THREE.MeshBasicMaterial({ color: 0xf5f1ec, side: THREE.DoubleSide, transparent: true });
  const R = mobile ? 2.1 : 2.7;
  const ring = new THREE.Group();
  scene.add(ring);

  const cards = projects.map((p, i) => {
    const uv = uvs.find((u) => u.slug === p.slug);
    const group = new THREE.Group();

    const border = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W, CARD_H), paper.clone());
    group.add(border);

    const imgGeo = new THREE.PlaneGeometry(CARD_W - BORDER * 2, CARD_H - BORDER * 2);
    if (uv) {
      const a = imgGeo.attributes.uv;
      for (let k = 0; k < a.count; k++) {
        a.setXY(k, uv.uMin + a.getX(k) * (uv.uMax - uv.uMin), uv.vMin + a.getY(k) * (uv.vMax - uv.vMin));
      }
    }
    const imgMat = new THREE.MeshBasicMaterial({ map: atlas, transparent: true });
    const front = new THREE.Mesh(imgGeo, imgMat);
    front.position.z = 0.003;
    const back = new THREE.Mesh(imgGeo, imgMat);
    back.position.z = -0.003;
    back.rotation.y = Math.PI;
    group.add(front, back);

    const angle = (i / projects.length) * Math.PI * 2;
    group.userData = { i, angle, lift: 0, dim: 1, dimTarget: 1, project: p, mats: [border.material, imgMat] };
    ring.add(group);
    return group;
  });

  // --- interaction state ---
  let spin = 0, velocity = reduced ? 0 : 0.0016, dragging = false, lastX = 0, moved = 0;
  let hovered = null;
  const pointer = new THREE.Vector2(-9, -9);
  const ray = new THREE.Raycaster();

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(0, mobile ? 3.6 : 3.1, mobile ? 8.2 : 7.8);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(host);

  host.addEventListener('pointerdown', (e) => {
    dragging = true; lastX = e.clientX; moved = 0;
    host.setPointerCapture(e.pointerId);
  });
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (dragging) {
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      velocity = dx * 0.0009;
    }
  });
  host.addEventListener('pointerup', () => {
    dragging = false;
    if (moved < 6 && hovered) location.href = `/work/${hovered.userData.project.slug}`;
  });
  host.addEventListener('pointerleave', () => { pointer.set(-9, -9); dragging = false; });

  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.toggle('active', c === chip));
    const f = chip.dataset.filter;
    cards.forEach((c) => {
      const p = c.userData.project;
      const match = f === 'all' || (f === 'concept' ? p.isConcept : !p.isConcept && p.category === f);
      c.userData.dimTarget = match ? 1 : 0.12;
    });
  }));

  const setLabel = (card) => {
    if (!label) return;
    if (!card) { label.classList.remove('is-on'); return; }
    const p = card.userData.project;
    label.querySelector('strong').textContent = p.name.toLowerCase();
    label.querySelector('span').textContent = `${p.isConcept ? 'concept' : p.category} · ${p.year}`;
    label.classList.add('is-on');
  };

  // --- render loop (paused off-screen) ---
  let visible = false, raf = 0;
  const frame = () => {
    raf = 0;
    if (!visible) return;

    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(ring.children, true)[0];
    const card = hit ? hit.object.parent : null;
    if (card !== hovered) {
      hovered = card;
      setLabel(card);
      document.body.toggleAttribute('data-ring-hover', !!card);
      host.style.cursor = card ? 'pointer' : 'grab';
    }

    if (!dragging) {
      // ease toward a calm idle speed, nearly stop while a card is hovered
      const idle = reduced ? 0 : hovered ? 0.0002 : 0.0016;
      velocity += (idle - velocity) * 0.03;
    }
    spin += velocity;

    for (const c of cards) {
      const d = c.userData;
      d.lift += ((c === hovered ? 1 : 0) - d.lift) * 0.12;
      d.dim += (d.dimTarget - d.dim) * 0.08;
      const a = d.angle + spin;
      const r = R + d.lift * 0.35;
      c.position.set(Math.sin(a) * r, d.lift * 0.32 - (1 - d.dim) * 0.25, Math.cos(a) * r);
      c.rotation.set(0, a + Math.PI / 2 - 0.6, 0);
      d.mats.forEach((m) => { m.opacity = d.dim; });
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }).observe(host);
}
