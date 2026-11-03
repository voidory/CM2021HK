import template from 'virtual:cloudchem-standalone';
import { QUESTIONS, SOURCE_AUDIT } from '../data/questions';

export function getStandaloneHtml(): string {
  const marker = '${dataPayload}';
  if (template.split(marker).length !== 2) {
    throw new Error('Standalone template must contain exactly one question-bank placeholder.');
  }
  const payload = JSON.stringify({ audit: SOURCE_AUDIT, questions: QUESTIONS })
    .replace(/</g, '\u003c')
    .replace(/\u2028/g, '\u2028')
    .replace(/\u2029/g, '\u2029');
  return template.replace(marker, () => payload);
}
