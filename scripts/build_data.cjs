const fs = require('fs');
const path = require('path');

const ay21_22 = require('./data/ay21_22.cjs');
const ay22_23 = require('./data/ay22_23.cjs');
const ay23_24 = require('./data/ay23_24.cjs');
const ay24_25 = require('./data/ay24_25.cjs');
const ay25_26 = require('./data/ay25_26.cjs');

const allQuestions = [
  ...ay21_22,
  ...ay22_23,
  ...ay23_24,
  ...ay24_25,
  ...ay25_26
];

console.log('Total questions loaded:', allQuestions.length);

// Validation
const ids = new Set();
for (const q of allQuestions) {
  if (ids.has(q.id)) {
    throw new Error(`Duplicate ID: ${q.id}`);
  }
  ids.add(q.id);

  if (!q.options.A || !q.options.B || !q.options.C || !q.options.D) {
    throw new Error(`Question ${q.id} missing options`);
  }

  if (!q.acceptedAnswers || q.acceptedAnswers.length === 0) {
    throw new Error(`Question ${q.id} missing accepted answers`);
  }

  for (const ans of q.acceptedAnswers) {
    if (!['A', 'B', 'C', 'D'].includes(ans)) {
      throw new Error(`Question ${q.id} invalid accepted answer: ${ans}`);
    }
  }

  if (!q.explanation || q.explanation.length < 20) {
    throw new Error(`Question ${q.id} explanation too short`);
  }

  if (!q.primaryTheme) {
    throw new Error(`Question ${q.id} missing primary theme`);
  }
}

// Reconcile with key
const keys = {
  'AY21/22': 'AAADACAADADDADBDBAADDCCDAC(B/D)B(A/B)DBCCDCCABDA',
  'AY22/23': 'BBADCAAABCBDBBADCACB',
  'AY23/24': 'CBBBBCABDBBDCBBDBCBACADBABDABA',
  'AY24/25': 'CACBCBADABABBCCBDDBA',
  'AY25/26': 'BABBABCDDBDDBCAAAAAB'
};

function parseKey(keyStr) {
  const result = [];
  let i = 0;
  while (i < keyStr.length) {
    if (keyStr[i] === '(') {
      const end = keyStr.indexOf(')', i);
      const sub = keyStr.substring(i + 1, end).split('/');
      result.push(sub);
      i = end + 1;
    } else {
      result.push([keyStr[i]]);
      i++;
    }
  }
  return result;
}

const audit = [];

for (const [year, keyStr] of Object.entries(keys)) {
  const parsedKey = parseKey(keyStr);
  const qs = allQuestions.filter(q => q.academicYear === year);
  console.log(`Year ${year}: Key entries = ${parsedKey.length}, Questions = ${qs.length}`);
  if (parsedKey.length !== qs.length) {
    throw new Error(`Count mismatch for ${year}: Key has ${parsedKey.length}, Questions has ${qs.length}`);
  }

  for (let idx = 0; idx < qs.length; idx++) {
    const q = qs[idx];
    const expected = parsedKey[idx];
    const actual = q.acceptedAnswers;
    if (JSON.stringify(expected.sort()) !== JSON.stringify(actual.slice().sort())) {
      throw new Error(`Answer mismatch for ${q.id}: expected ${expected}, got ${actual}`);
    }
  }

  audit.push({
    academicYear: year,
    questionsFound: qs.length,
    answerKeyEntries: parsedKey.length,
    verifiedUsableQuestions: qs.length,
    quarantinedCount: 0,
    alternativeKeyCount: qs.filter(q => q.isAlternativeKey).length,
    notes: year === 'AY21/22'
      ? '40 questions verified; 2 parenthesised alternative entries preserved: Q27 (B/D) and Q29 (A/B).'
      : year === 'AY25/26'
      ? '20 questions verified; Q01 key authority selects B (dimethylamine) despite formula CH3NH2.'
      : `${qs.length} questions verified; 100% key reconciliation.`
  });
}

console.log('All audits and keys verified perfectly!');

// Write src/data/questions.ts
const tsContent = `/**
 * Complete Question Bank for Inorganic Chemistry (CM2021) Mid-Term Test Revision
 * Source: 5 Exam Papers (AY21/22 - AY25/26) and ANS.pdf
 * Total: 130 Verified Questions
 */

export interface Question {
  id: string;
  academicYear: 'AY21/22' | 'AY22/23' | 'AY23/24' | 'AY24/25' | 'AY25/26';
  originalQNum: number;
  sourcePdf: string;
  page: number;
  questionText: string;
  visualAsset?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  acceptedAnswers: ('A' | 'B' | 'C' | 'D')[];
  isAlternativeKey: boolean;
  primaryTheme: string;
  secondaryTags: string[];
  explanation: string;
  caveat?: string;
  notes?: string;
}

export interface PaperAudit {
  academicYear: string;
  questionsFound: number;
  answerKeyEntries: number;
  verifiedUsableQuestions: number;
  quarantinedCount: number;
  alternativeKeyCount: number;
  notes: string;
}

export const SOURCE_AUDIT: PaperAudit[] = ${JSON.stringify(audit, null, 2)};

export const ALL_THEMES = [
  'Coordination Nomenclature & Formulas',
  'Isomerism & Stereochemistry',
  'Crystal Field & Ligand Field Theory',
  'Bonding & Spectrochemical Series',
  'Coordination Stability & Thermodynamics',
  'Jahn-Teller & Electronic Spectra'
] as const;

export type ThemeName = typeof ALL_THEMES[number];

export const QUESTIONS: Question[] = ${JSON.stringify(allQuestions, null, 2)};
`;

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/questions.ts', tsContent, 'utf8');
fs.writeFileSync('src/data/questions.json', JSON.stringify({ audit, questions: allQuestions }, null, 2), 'utf8');
console.log('Successfully wrote src/data/questions.ts and src/data/questions.json!');
