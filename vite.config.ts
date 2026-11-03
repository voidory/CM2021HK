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
  const readTemplate = () => readFileSync(resolve(rootDir, 'public/chem-revision-app.html'), 'utf8');
  return {
    name: 'cloudchem-standalone',
    configResolved(config) { outputDir = resolve(config.root, config.build.outDir); },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    load(id) { if (id === resolvedId) return 'export default ' + JSON.stringify(readTemplate()) + ';'; },
    writeBundle() {
      const template = readTemplate();
      if (template.split(marker).length !== 2) throw new Error('Standalone template requires exactly one data placeholder.');
      const data = JSON.parse(readFileSync(resolve(rootDir, 'src/data/questions.json'), 'utf8'));
      if (!Array.isArray(data.questions) || data.questions.length !== 130) throw new Error('Standalone question bank is incomplete.');
      const payload = JSON.stringify(data).replace(/</g, '\u003c').replace(/\u2028/g, '\u2028').replace(/\u2029/g, '\u2029');
      writeFileSync(resolve(outputDir, 'chem-revision-app.html'), template.replace(marker, () => payload));
    }
  };
}

export default defineConfig(() => ({
  base: './',
  plugins: [react(), tailwindcss(), standaloneApp()],
  resolve: { alias: { '@': rootDir } },
  server: {
    // Preserve AI Studio's HMR and file-watching settings.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
