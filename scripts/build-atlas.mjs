import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));

async function buildAtlas() {
  const ATLAS_SIZE = 2048;
  const COLS = 6;
  const ROWS = 5;
  const CELL_W = Math.floor(ATLAS_SIZE / COLS); // 341
  const CELL_H = Math.floor(ATLAS_SIZE / ROWS); // 409

  console.log(`Building 2048x2048 texture atlas for ${projects.length} covers...`);

  const composites = [];
  const uvs = [];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = col * CELL_W;
    const top = row * CELL_H;

    const imgPath = path.join(ROOT_DIR, 'public', p.cover.replace(/^\//, ''));
    if (!fs.existsSync(imgPath)) {
      console.warn(`Cover not found: ${imgPath}`);
      continue;
    }

    const resized = await sharp(imgPath)
      .resize(CELL_W, CELL_H, { fit: 'cover' })
      .toBuffer();

    composites.push({
      input: resized,
      left,
      top
    });

    // UV coordinates (0 to 1, Three.js texture coordinate system)
    uvs.push({
      slug: p.slug,
      name: p.name,
      uMin: left / ATLAS_SIZE,
      uMax: (left + CELL_W) / ATLAS_SIZE,
      vMin: 1 - ((top + CELL_H) / ATLAS_SIZE),
      vMax: 1 - (top / ATLAS_SIZE)
    });
  }

  // Create empty 2048x2048 black canvas and composite
  const atlasBuffer = await sharp({
    create: {
      width: ATLAS_SIZE,
      height: ATLAS_SIZE,
      channels: 4,
      background: { r: 11, g: 11, b: 11, alpha: 1 }
    }
  })
  .composite(composites)
  .webp({ quality: 85 })
  .toFile(path.join(ROOT_DIR, 'public/assets/atlas.webp'));

  fs.writeFileSync(
    path.join(ROOT_DIR, 'src/data/atlas-uvs.json'),
    JSON.stringify(uvs, null, 2),
    'utf-8'
  );

  console.log('✅ Texture atlas generated at public/assets/atlas.webp and src/data/atlas-uvs.json');
}

buildAtlas().catch(console.error);
