const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating standalone HTML using src/utils/generateStandaloneHtml.ts...');
execSync(`npx --yes tsx -e "import { getStandaloneHtml } from './src/utils/generateStandaloneHtml'; import fs from 'fs'; const html = getStandaloneHtml(); fs.writeFileSync('public/chem-revision-app.html', html, 'utf8'); fs.writeFileSync('chem-revision-app.html', html, 'utf8'); console.log('Successfully written standalone HTML, length:', html.length);"`, { stdio: 'inherit' });
