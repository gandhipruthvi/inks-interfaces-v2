import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const projects = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));

function buildSitemap() {
  const baseUrl = 'https://inksandinterfaces.design';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/work', priority: '0.9', changefreq: 'weekly' },
    { url: '/services', priority: '0.8', changefreq: 'monthly' },
    { url: '/studio', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${p.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  projects.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/work/${p.slug}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'sitemap.xml'), xml, 'utf-8');
  console.log(`✅ Generated public/sitemap.xml with ${staticPages.length + projects.length} URLs`);

  // Also create public/robots.txt
  const robots = `User-agent: *
Allow: /
Disallow: /_styleguide

Sitemap: https://inksandinterfaces.design/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'robots.txt'), robots, 'utf-8');
  console.log('✅ Generated public/robots.txt');
}

buildSitemap();
