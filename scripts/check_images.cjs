const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function checkImages() {
  const files = [
    'AY21_22_Mid_term_test_paper_26e2425a.pdf',
    'AY22_23_Mid_term_test_paper_c84be2dd.pdf',
    'AY23_24_Mid_term_test_paper_7b42005c.pdf',
    'AY24_25_Mid_term_test_paper_b32e7cba.pdf',
    'AY25_26_Mid_term_test_paper_aff449cd.pdf'
  ];

  for (const f of files) {
    const buf = fs.readFileSync('public/assets/aistudio/' + f);
    const parser = new PDFParse(new Uint8Array(buf));
    // Let's see if there are images
    console.log('File:', f);
  }
}
checkImages();
