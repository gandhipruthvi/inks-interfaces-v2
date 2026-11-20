import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));

async function processImages() {
  console.log(`Verifying and optimizing responsive assets for ${projects.length} projects...`);

  let processed = 0;
  for (const p of projects) {
    const targetDir = path.join(ROOT_DIR, 'public/work-media', p.slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const coverPath = path.join(ROOT_DIR, 'public', p.cover.replace(/^\//, ''));
    if (fs.existsSync(coverPath)) {
      const coverOut = path.join(targetDir, 'cover-1280.webp');
      if (!fs.existsSync(coverOut)) {
        await sharp(coverPath)
          .resize(1280, null, { withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(coverOut);
        processed++;
      }
      // small thumbs for the page loader's flying cards
      const thumbOut = path.join(targetDir, 'thumb-360.webp');
      if (!fs.existsSync(thumbOut)) {
        await sharp(coverPath)
          .resize(360, 450, { fit: 'cover' })
          .webp({ quality: 72 })
          .toFile(thumbOut);
        processed++;
      }
      // 4:5 cards for the home hero's work wall (sharp on 2x screens)
      const cardOut = path.join(targetDir, 'card-640.webp');
      if (!fs.existsSync(cardOut)) {
        await sharp(coverPath)
          .resize(640, 800, { fit: 'cover' })
          .webp({ quality: 74 })
          .toFile(cardOut);
        processed++;
      }
    }
  }

  console.log(`✅ Responsive media verification complete (${processed} covers optimized).`);
}

processImages().catch(console.error);
