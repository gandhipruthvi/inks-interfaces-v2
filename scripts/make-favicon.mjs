import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

async function makeFavicon() {
  const monogramPath = path.join(ROOT_DIR, 'public/brand/secondary-monogram.png');
  const monoResized = await sharp(monogramPath)
    .resize(48, 48, { fit: 'contain' })
    .toBuffer();

  const svgBg = Buffer.from('<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="14" fill="#F25B54"/></svg>');

  await sharp(svgBg)
    .composite([{ input: monoResized, gravity: 'center' }])
    .png()
    .toFile(path.join(ROOT_DIR, 'public/favicon.png'));

  console.log('✅ Generated public/favicon.png on coral plate');
}

makeFavicon().catch(console.error);
