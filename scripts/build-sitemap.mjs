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

  // llms.txt: plain-text index for AI assistants (ChatGPT, Claude, Gemini, Perplexity). Kept in sync with projects.json.
  const plain = (s) => String(s || '').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/<[^>]+>/g, '');
  const work = projects
    .map((p) => `- [${plain(p.name)}](${baseUrl}/work/${p.slug}): ${p.isConcept ? 'Self-initiated concept' : plain(p.location)}. ${plain((p.services || []).join(', '))}. ${plain(p.headline)}`)
    .join('\n');
  const llms = `# Inks & Interfaces

> Inks & Interfaces is a founder-led branding studio offering brand strategy, logo design, visual identity, rebranding, brand naming, brand websites and pitch decks. Two founders, Shivani Rotliwala (brand strategy and visual design) and Sakhi Rotliwala (interactive design and engineering), do all the work themselves. Based in India, working with founders in the United States, Canada, United Kingdom, Europe, Australia, Singapore and the UAE.

- Projects are fixed-fee, quoted in USD or INR after a 20-minute call.
- Identity and rebrand projects usually take 4 to 6 weeks; a website adds about 4 weeks.
- Work runs asynchronously across time zones with a weekly live check-in.
- Contact: studio@inksandinterfaces.design or ${baseUrl}/contact

## Pages

- [Services](${baseUrl}/services): brand strategy and positioning, naming and verbal identity, logo and visual identity systems, rebranding, websites, product UI/UX, launch content and investor decks
- [Work](${baseUrl}/work): ${projects.length} brand identity case studies
- [Studio](${baseUrl}/studio): the founders and how the studio works
- [Contact](${baseUrl}/contact): start a project, FAQ

## Case studies

${work}
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'llms.txt'), llms, 'utf-8');
  console.log('✅ Generated public/llms.txt');
}

buildSitemap();
