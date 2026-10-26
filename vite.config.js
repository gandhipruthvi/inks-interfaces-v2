import { defineConfig, loadEnv } from 'vite';
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

// Dev only: run the Vercel functions in /api so the contact form works locally.
// Secrets come from .env.local (gitignored), e.g. RESEND_API_KEY=...
const devApi = {
  name: 'dev-api',
  configureServer(server) {
    Object.assign(process.env, loadEnv('development', process.cwd(), ''));
    server.middlewares.use(async (req, res, next) => {
      const m = req.url.match(/^\/api\/([a-z0-9-]+)\/?(\?.*)?$/);
      if (!m) return next();
      let raw = '';
      for await (const chunk of req) raw += chunk;
      try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); return res; };
      try {
        const { default: handler } = await server.ssrLoadModule(`/api/${m[1]}.js`);
        await handler(req, res);
      } catch (e) {
        console.error(e);
        res.statusCode = 404; res.end();
      }
    });
  }
};

export default defineConfig({
  root: '.',
  plugins: [caseStudyRewrite, devApi],
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
