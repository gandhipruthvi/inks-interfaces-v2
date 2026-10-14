import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function getHtmlInputs() {
  const potentialPages = {
    main: resolve(__dirname, 'index.html'),
    work: resolve(__dirname, 'work.html'),
    services: resolve(__dirname, 'services.html'),
    studio: resolve(__dirname, 'studio.html'),
    contact: resolve(__dirname, 'contact.html'),
    notfound: resolve(__dirname, '404.html'),
    styleguide: resolve(__dirname, '_styleguide.html')
  };

  const pages = {};
  for (const [key, path] of Object.entries(potentialPages)) {
    if (fs.existsSync(path)) {
      pages[key] = path;
    }
  }

  const workDir = resolve(__dirname, 'work');
  if (fs.existsSync(workDir)) {
    const subdirs = fs.readdirSync(workDir, { withFileTypes: true });
    for (const subdir of subdirs) {
      if (subdir.isDirectory()) {
        const pagePath = resolve(workDir, subdir.name, 'index.html');
        if (fs.existsSync(pagePath)) {
          pages[`work_${subdir.name}`] = pagePath;
        }
      }
    }
  }

  return pages;
}

// Dev only: serve /work/<slug> from work/<slug>/index.html like Vercel's cleanUrls does
const caseStudyRewrite = {
  name: 'case-study-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const m = req.url.match(/^\/work\/([a-z0-9-]+)\/?(\?.*)?$/);
      if (m) req.url = `/work/${m[1]}/index.html${m[2] || ''}`;
      next();
    });
  }
};

export default defineConfig({
  root: '.',
  plugins: [caseStudyRewrite],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputs()
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
