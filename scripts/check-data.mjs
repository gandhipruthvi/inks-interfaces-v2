import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const jsonPath = path.join(ROOT_DIR, 'src', 'data', 'projects.json');

assert(fs.existsSync(jsonPath), 'projects.json must exist');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`Checking data for ${data.length} projects...`);
assert.strictEqual(data.length, 28, 'Must have exactly 28 projects');

const slugs = new Set();
let featuredCount = 0;
let missingImages = 0;

for (const p of data) {
  assert(!slugs.has(p.slug), `Duplicate slug found: ${p.slug}`);
  slugs.add(p.slug);

  if (p.featured) featuredCount++;

  assert(['branding', 'ui-ux', 'packaging', 'concept'].includes(p.category), `Unknown category "${p.category}" for ${p.slug}`);
  assert(typeof p.industry === 'string' && p.industry, `Missing industry for ${p.slug}`);
  assert.strictEqual(new Set(p.gallery).size, p.gallery.length, `Duplicate gallery images for ${p.slug}`);

  // Verify cover image
  const coverDiskPath = path.join(ROOT_DIR, 'public', p.cover.replace(/^\//, ''));
  if (!fs.existsSync(coverDiskPath)) {
    console.error(`Missing cover image on disk: ${p.cover} (for ${p.slug})`);
    missingImages++;
  }

  // Verify gallery images
  for (const img of p.gallery) {
    const diskPath = path.join(ROOT_DIR, 'public', img.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      console.error(`Missing gallery image on disk: ${img} (for ${p.slug})`);
      missingImages++;
    }
  }

  // Check palette
  assert(Array.isArray(p.palette) && p.palette.length >= 2, `Palette must have at least 2 colors for ${p.slug}`);
}

assert.strictEqual(featuredCount, 8, `Featured projects count must be exactly 8, got ${featuredCount}`);
assert.strictEqual(missingImages, 0, `There are ${missingImages} missing images`);

console.log('✅ check-data.mjs PASSED: 28 unique projects, 8 featured, all images exist on disk!');
