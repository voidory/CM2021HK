const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function inspectImages() {
  const buf = fs.readFileSync('public/assets/aistudio/AY21_22_Mid_term_test_paper_26e2425a.pdf');
  const parser = new PDFParse(new Uint8Array(buf));
  console.log('Parser methods with image:');
  for (const m of ['getImage', 'resolveEmbeddedImage']) {
    console.log(m, typeof parser[m]);
  }
}
inspectImages();
