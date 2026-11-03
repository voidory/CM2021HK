import React from 'react';
import { SOURCE_AUDIT } from '../data/questions';

interface SourceAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceAuditModal: React.FC<SourceAuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const totalQuestions = SOURCE_AUDIT.reduce((acc, a) => acc + a.questionsFound, 0);
  const totalKeys = SOURCE_AUDIT.reduce((acc, a) => acc + a.answerKeyEntries, 0);
  const totalVerified = SOURCE_AUDIT.reduce((acc, a) => acc + a.verifiedUsableQuestions, 0);
  const totalQuarantined = SOURCE_AUDIT.reduce((acc, a) => acc + a.quarantinedCount, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Source Material and Answer Authority Audit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-sky-100">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Source Material & Answer Authority Audit
              </h2>
              <p className="text-sm text-slate-500">
                Verification against original exam papers and ANS.pdf
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            aria-label="Close Audit Modal"
          >
            ✕
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 text-center">
            <div className="text-2xl font-bold text-sky-800">{totalQuestions}</div>
            <div className="text-xs font-medium text-sky-600 mt-1">Questions Found</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
            <div className="text-2xl font-bold text-emerald-800">{totalKeys}</div>
            <div className="text-xs font-medium text-emerald-600 mt-1">Answer Key Entries</div>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 text-center">
            <div className="text-2xl font-bold text-indigo-800">{totalVerified}</div>
            <div className="text-xs font-medium text-indigo-600 mt-1">Verified Usable</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
            <div className="text-2xl font-bold text-amber-800">{totalQuarantined}</div>
            <div className="text-xs font-medium text-amber-600 mt-1">Quarantined Items</div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-6">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-3 text-center">Questions Found</th>
                <th className="py-3 px-3 text-center">Key Entries</th>
                <th className="py-3 px-3 text-center">Verified Usable</th>
                <th className="py-3 px-3 text-center">Alternative Keys</th>
                <th className="py-3 px-4">Audit Status & Reconciliation Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SOURCE_AUDIT.map(item => (
                <tr key={item.academicYear} className="hover:bg-sky-50/40">
                  <td className="py-3 px-4 font-bold text-slate-800">{item.academicYear}</td>
                  <td className="py-3 px-3 text-center font-medium">{item.questionsFound}</td>
                  <td className="py-3 px-3 text-center font-medium text-emerald-700">
                    {item.answerKeyEntries}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-indigo-700">
                    {item.verifiedUsableQuestions}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.alternativeKeyCount > 0 ? (
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                        {item.alternativeKeyCount} active
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Authority and Alternative Keys Notice */}
        <div className="space-y-4 text-xs text-slate-600 bg-sky-50/60 rounded-2xl p-5 border border-sky-100">
          <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <span>🛡️</span>
            <span>Answer Authority & Preservation Policy</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>
              <strong>ANS.pdf is the sole authority:</strong> All grading adheres strictly to the provided answer key. Apparent errors in the key are never silently rewritten with synthetic alternatives.
            </li>
            <li>
              <strong>Parenthesised alternatives:</strong> In AY21/22, Q27 specifies <code>(B/D)</code> and Q29 specifies <code>(A/B)</code>. Each constitutes exactly one answer-key entry representing an accepted-answer set (<code>&#123;B, D&#125;</code> and <code>&#123;A, B&#125;</code>). Both options are graded as correct and flagged with clear explanations.
            </li>
            <li>
              <strong>Documented discrepancies:</strong> In AY25/26 Q01, the chemical formula is <code>[Fe(CN)2(CH3NH2)4]</code> (methylamine ligands), but the official key selects option B (which writes dimethylamine). The app grades option B as correct while providing a transparent note explaining standard nomenclature.
            </li>
            <li>
              <strong>All 130 questions verified:</strong> Exact question count matches answer-key entries across all five papers with 0 quarantined items.
            </li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl shadow-xs transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
