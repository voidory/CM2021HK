const fs = require('fs');

const files = [
  { year: 'AY21_22', filename: 'scripts/extracted_AY21_22_Mid_term_test_paper_26e2425a.txt', total: 40 },
  { year: 'AY22_23', filename: 'scripts/extracted_AY22_23_Mid_term_test_paper_c84be2dd.txt', total: 20 },
  { year: 'AY23_24', filename: 'scripts/extracted_AY23_24_Mid_term_test_paper_7b42005c.txt', total: 30 },
  { year: 'AY24_25', filename: 'scripts/extracted_AY24_25_Mid_term_test_paper_b32e7cba.txt', total: 20 },
  { year: 'AY25_26', filename: 'scripts/extracted_AY25_26_Mid_term_test_paper_aff449cd.txt', total: 20 }
];

for (const f of files) {
  const content = fs.readFileSync(f.filename, 'utf8');
  console.log(`\n=================== ${f.year} (${content.length} chars) ===================`);
  // Let's find all question markers: e.g. "1)", "2)", "3)", etc.
  const regex = /(?:^|\n)\s*(\d{1,2})\)\s*/g;
  let match;
  const indices = [];
  while ((match = regex.exec(content)) !== null) {
    indices.push({ qNum: parseInt(match[1]), index: match.index });
  }
  console.log(`${f.year}: Found ${indices.length} question markers. Target: ${f.total}`);
  const qNums = indices.map(i => i.qNum);
  console.log('Question numbers found:', qNums.join(', '));
}
