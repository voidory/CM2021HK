/**
 * Script to refactor question explanations across all academic years:
 * 1. Strips "Generated explanation; not an official solution."
 * 2. Condenses explanation to only the core concept needed to understand the answer.
 * 3. Extracts caveats, nuances, distractor alerts, and edge cases into a dedicated `caveat` field.
 */

const fs = require('fs');
const path = require('path');

const files = [
  './scripts/data/ay21_22.cjs',
  './scripts/data/ay22_23.cjs',
  './scripts/data/ay23_24.cjs',
  './scripts/data/ay24_25.cjs',
  './scripts/data/ay25_26.cjs'
];

for (const filePath of files) {
  const fullPath = path.resolve(filePath);
  const questions = require(fullPath);

  for (const q of questions) {
    let text = q.explanation || '';
    // Strip generated preface
    text = text.replace(/^Generated explanation; not an official solution\.\s*/i, '').trim();

    // Check if there are caveats or distractor discussions to split
    let core = text;
    let caveat = q.caveat || '';

    // Patterns for splitting caveats / distractors
    const splitRegex = /(In contrast,|However,|Watch out for|Caution:|Note that|Beware of|Do not confuse|Although |Unlike |Distractor alert:|Option [A-D] is tempting)/i;
    const match = text.match(splitRegex);

    if (match && match.index !== undefined && match.index > 35) {
      const splitIdx = match.index;
      core = text.substring(0, splitIdx).trim();
      const extractedCaveat = text.substring(splitIdx).trim();
      caveat = caveat ? `${extractedCaveat} ${caveat}` : extractedCaveat;
    }

    // Clean up trailing punctuation if necessary
    if (!core.endsWith('.')) core += '.';

    // If no specific caveat was parsed but notes exist and mention a pitfall, use notes or create targeted caveat
    if (!caveat && q.notes && /optical|trap|exception|ambidentate|isomer|confuse/i.test(q.notes)) {
      caveat = q.notes;
    }

    q.explanation = core;
    if (caveat) {
      q.caveat = caveat;
    }
  }

  // Save back to file
  const outCode = `module.exports = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(fullPath, outCode, 'utf8');
  console.log(`Updated ${filePath}: ${questions.length} questions refactored.`);
}

console.log('Finished refactoring raw data files.');
