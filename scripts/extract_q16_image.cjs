const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function extractQ16Image() {
  const buf = fs.readFileSync('public/assets/aistudio/AY21_22_Mid_term_test_paper_26e2425a.pdf');
  const parser = new PDFParse(new Uint8Array(buf));
  const res = await parser.getImage();
  const p3 = res.pages.find(p => p.pageNumber === 3);
  if (p3 && p3.images.length > 0) {
    const imgData = p3.images[0].dataUrl;
    const base64Data = imgData.replace(/^data:image\/png;base64,/, '');
    fs.mkdirSync('public/assets', { recursive: true });
    fs.writeFileSync('public/assets/ay21_22_q16.png', Buffer.from(base64Data, 'base64'));
    console.log('Saved public/assets/ay21_22_q16.png (bytes:', base64Data.length, ')');
  }
}
extractQ16Image();
