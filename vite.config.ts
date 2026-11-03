import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

function standaloneApp(): Plugin {
  const virtualId = 'virtual:cloudchem-standalone';
  const resolvedId = '\0' + virtualId;
  const marker = '${dataPayload}';
  let outputDir = resolve(rootDir, 'dist');
  const templatePath = resolve(rootDir, 'src/templates/chem-revision-app.template.html');
  const readTemplate = () => readFileSync(templatePath, 'utf8')
    // These handlers occur inside single-quoted JavaScript HTML strings.
    // HTML entities preserve the handler argument without ending that string.
    .replace(/window\.stepStandalone3D\('([vhz])'\)/g,
      (_match, axis: string) => `window.stepStandalone3D(&#39;${axis}&#39;)`);
  const getPopulatedHtml = () => {
    const template = readTemplate();
    if (template.split(marker).length !== 2) throw new Error('Standalone template requires exactly one data placeholder.');
    const data = JSON.parse(readFileSync(resolve(rootDir, 'src/data/questions.json'), 'utf8'));
    if (!Array.isArray(data.questions) || data.questions.length !== 130) throw new Error('Standalone question bank is incomplete.');
    const payload = JSON.stringify(data).replace(/</g, '\u003c').replace(/\u2028/g, '\u2028').replace(/\u2029/g, '\u2029');
    return template.replace(marker, () => payload);
  };
  return {
    name: 'cloudchem-standalone',
    configResolved(config) { outputDir = resolve(config.root, config.build.outDir); },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    load(id) { if (id === resolvedId) return 'export default ' + JSON.stringify(readTemplate()) + ';'; },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url === '/chem-revision-app.html' || req.url.startsWith('/chem-revision-app.html?'))) {
          const html = getPopulatedHtml();
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
          return;
        }
        next();
      });
    },
    writeBundle() {
      const populatedHtml = getPopulatedHtml();
      writeFileSync(resolve(outputDir, 'chem-revision-app.html'), populatedHtml);
      writeFileSync(resolve(rootDir, 'chem-revision-app.html'), populatedHtml);
      writeFileSync(resolve(rootDir, 'public/chem-revision-app.html'), populatedHtml);
    }
  };
}

export default defineConfig(() => ({
  base: './',
  plugins: [react(), tailwindcss(), standaloneApp()],
  resolve: { alias: { '@': rootDir } },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true as const,
    // Preserve AI Studio's HMR and file-watching settings.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
