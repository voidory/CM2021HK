const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function main() {
  const buf = fs.readFileSync('public/assets/aistudio/ANS_f06ae2c1.pdf');
  const parser = new PDFParse(buf, { verbosity: 0 });
  const res = await parser.getText();
  console.log('Result type:', typeof res);
  if (typeof res === 'string') {
    console.log('Text length:', res.length);
    console.log('Text content:\n', res);
  } else {
    console.log('Text field:', res.text);
  }
}
main().catch(console.error);
