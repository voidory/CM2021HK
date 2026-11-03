const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const templatePath = path.join(rootDir, 'src/templates/chem-revision-app.template.html');

if (!fs.existsSync(templatePath)) {
  throw new Error(`Master standalone template not found at ${templatePath}`);
}

const template = fs.readFileSync(templatePath, 'utf8')
  .replace(/window\.stepStandalone3D\('([vhz])'\)/g, (_match, axis) => `window.stepStandalone3D(&#39;${axis}&#39;)`);

const marker = '${dataPayload}';
if (template.split(marker).length !== 2) {
  throw new Error('Standalone template must contain exactly one question-bank placeholder.');
}

const data = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/questions.json'), 'utf8'));
if (!Array.isArray(data.questions) || data.questions.length !== 130) {
  throw new Error('Standalone question bank is incomplete. Expected 130 questions.');
}

const payload = JSON.stringify(data)
  .replace(/</g, '\u003c')
  .replace(/\u2028/g, '\u2028')
  .replace(/\u2029/g, '\u2029');

const html = template.replace(marker, () => payload);

// Write to root so cloning/downloading from GitHub yields a working offline file
fs.writeFileSync(path.join(rootDir, 'chem-revision-app.html'), html, 'utf8');

// Write to public so static file servers serve the fully embedded version
fs.writeFileSync(path.join(rootDir, 'public/chem-revision-app.html'), html, 'utf8');

// Write to dist and docs if directories exist
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'chem-revision-app.html'), html, 'utf8');
}

const docsDir = path.join(rootDir, 'docs');
if (fs.existsSync(docsDir)) {
  fs.writeFileSync(path.join(docsDir, 'chem-revision-app.html'), html, 'utf8');
}

console.log('Successfully generated standalone offline HTML across all targets. File size:', html.length, 'bytes.');
