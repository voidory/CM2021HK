const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function parseFile(filename) {
  const buf = fs.readFileSync('public/assets/aistudio/' + filename);
  const uint8 = new Uint8Array(buf);
  const parser = new PDFParse(uint8);
  const res = await parser.getText();
  return res.text;
}

async function main() {
  const files = [
    'ANS_f06ae2c1.pdf',
    'AY21_22_Mid_term_test_paper_26e2425a.pdf',
    'AY22_23_Mid_term_test_paper_c84be2dd.pdf',
    'AY23_24_Mid_term_test_paper_7b42005c.pdf',
    'AY24_25_Mid_term_test_paper_b32e7cba.pdf',
    'AY25_26_Mid_term_test_paper_aff449cd.pdf'
  ];

  for (const f of files) {
    console.log('==============================');
    console.log('START FILE:', f);
    try {
      const text = await parseFile(f);
      console.log('LENGTH:', text.length);
      fs.writeFileSync(`scripts/extracted_${f.replace('.pdf', '.txt')}`, text, 'utf8');
      console.log('SAVED to scripts/extracted_' + f.replace('.pdf', '.txt'));
      console.log('HEAD:\n' + text.slice(0, 300));
    } catch (e) {
      console.error('Error parsing', f, e.message);
    }
  }
}
main();
