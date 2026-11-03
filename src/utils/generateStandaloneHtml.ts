import { QUESTIONS, SOURCE_AUDIT } from '../data/questions';

export function getStandaloneHtml(): string {
  const dataPayload = JSON.stringify({
    audit: SOURCE_AUDIT,
    questions: QUESTIONS
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudChem - Inorganic Chemistry Adaptive Revision</title>
  <meta name="description" content="Complete standalone local revision app for Inorganic Chemistry Mid-Term Tests with 130 verified exam questions, authority grading, and adaptive spaced repetition.">
  <style>
    :root {
      --sky-50: #f0f7ff;
      --sky-100: #e0f2fe;
      --sky-200: #bae6fd;
      --sky-600: #0284c7;
      --sky-700: #0369a1;
      --sky-800: #075985;
      --slate-700: #334155;
      --slate-800: #1e293b;
      --emerald-50: #ecfdf5;
      --emerald-600: #059669;
      --rose-50: #fff1f2;
      --rose-600: #e11d48;
      --amber-50: #fffbeb;
      --amber-800: #92400e;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--sky-50);
      color: var(--slate-800);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
    }

    /* Cloud Background Puffs */
    .bg-cloud-1 {
      position: fixed; top: -50px; left: -50px; width: 350px; height: 180px;
      background: rgba(255, 255, 255, 0.7); border-radius: 9999px; filter: blur(30px); z-index: -1;
      animation: float1 14s ease-in-out infinite;
    }
    .bg-cloud-2 {
      position: fixed; top: 80px; right: -80px; width: 400px; height: 200px;
      background: rgba(255, 255, 255, 0.6); border-radius: 9999px; filter: blur(35px); z-index: -1;
      animation: float2 18s ease-in-out infinite;
    }
    .bg-cloud-3 {
      position: fixed; bottom: -60px; right: 50px; width: 380px; height: 190px;
      background: rgba(255, 255, 255, 0.8); border-radius: 9999px; filter: blur(30px); z-index: -1;
      animation: float1 16s ease-in-out infinite;
    }

    @keyframes float1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(8px, -10px); } }
    @keyframes float2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-8px, 10px); } }

    @media (prefers-reduced-motion: reduce) {
      .bg-cloud-1, .bg-cloud-2, .bg-cloud-3 { animation: none !important; }
    }
    .no-motion .bg-cloud-1, .no-motion .bg-cloud-2, .no-motion .bg-cloud-3 { animation: none !important; }

    header {
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #e0f2fe;
      position: sticky; top: 0; z-index: 30;
      padding: 12px 16px;
    }
    .header-inner {
      max-width: 900px; margin: 0 auto;
      display: flex; flex-direction: column; gap: 8px;
    }
    .header-top {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;
    }
    .logo-area { display: flex; align-items: center; gap: 8px; }
    .logo-icon { font-size: 28px; }
    .logo-title {
      font-size: 19px; font-weight: 800;
      background: linear-gradient(135deg, #0369a1, #4338ca);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .badge {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      padding: 3px 8px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
    }

    .nav-actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .btn {
      font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 12px;
      border: 1px solid #cbd5e1; background: #f8fafc; color: #334155;
      cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 4px;
    }
    .btn:hover { background: #e2e8f0; }
    .btn-primary { background: #0284c7; color: #fff; border-color: #0284c7; }
    .btn-primary:hover { background: #0369a1; }
    .btn-amber { background: #fef3c7; color: #92400e; border-color: #fde68a; }

    .filter-bar {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
      padding-top: 6px; border-top: 1px solid rgba(224, 242, 254, 0.8); font-size: 12px;
    }
    .filter-group { display: flex; align-items: center; gap: 4px; overflow-x: auto; max-width: 100%; }
    .chip {
      padding: 3px 8px; border-radius: 8px; background: #f1f5f9; color: #475569;
      font-size: 11px; font-weight: 600; cursor: pointer; border: 1px solid transparent;
    }
    .chip.active { background: #0284c7; color: white; }
    select.filter-select {
      padding: 4px 8px; border-radius: 8px; border: 1px solid #cbd5e1; background: white;
      font-size: 12px; color: #334155; outline: none;
    }

    main {
      flex: 1; max-width: 820px; width: 100%; margin: 24px auto; padding: 0 16px;
    }

    .card {
      background: rgba(255, 255, 255, 0.96);
      border-radius: 28px;
      padding: 28px;
      box-shadow: 0 16px 40px rgba(100, 150, 200, 0.12);
      border: 1px solid #e0f2fe;
    }

    .q-meta {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
      padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid #f0f7ff; font-size: 12px;
    }
    .q-year-pill {
      font-weight: 700; background: #e0f2fe; color: #075985; padding: 4px 10px; border-radius: 8px;
    }
    .q-theme-pill {
      background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 9999px; font-weight: 500;
    }

    .q-text {
      font-size: 18px; font-weight: 500; line-height: 1.55; color: #1e293b; margin-bottom: 22px;
      white-space: pre-line;
    }

    .q-img-wrap {
      text-align: center; margin-bottom: 20px; padding: 12px; background: #f8fafc;
      border-radius: 16px; border: 1px solid #e2e8f0;
    }
    .q-img-wrap img { max-height: 220px; max-width: 100%; border-radius: 8px; }

    .options-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .opt-btn {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
      border-radius: 18px; border: 2px solid #e2e8f0; background: rgba(240, 247, 255, 0.35);
      cursor: pointer; text-align: left; font-size: 15px; color: #1e293b; transition: all 0.15s ease;
      position: relative;
    }
    .opt-btn:hover:not(:disabled) {
      border-color: #38bdf8; background: #f0f9ff;
    }
    .opt-key {
      width: 32px; height: 32px; border-radius: 10px; background: white; border: 1px solid #cbd5e1;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;
      color: #475569; flex-shrink: 0;
    }
    .opt-content { flex: 1; padding-top: 4px; line-height: 1.45; }
    .opt-kbd { font-size: 11px; color: #94a3b8; padding-top: 6px; }

    .opt-btn.correct {
      background: #ecfdf5 !important; border-color: #34d399 !important; color: #064e3b;
    }
    .opt-btn.correct .opt-key { background: #059669; color: white; border-color: #059669; }
    .opt-btn.incorrect {
      background: #fff1f2 !important; border-color: #f87171 !important; color: #881337;
    }
    .opt-btn.incorrect .opt-key { background: #e11d48; color: white; border-color: #e11d48; }
    .opt-btn.faded { opacity: 0.55; border-color: #e2e8f0; }

    .feedback-box {
      margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0f2fe;
      display: flex; flex-direction: column; gap: 12px;
    }
    .status-bar {
      padding: 14px 18px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center;
    }
    .status-bar.success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
    .status-bar.fail { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; }

    .alt-key-alert {
      padding: 12px 14px; border-radius: 14px; background: #fffbeb; border: 1px solid #fde68a;
      color: #92400e; font-size: 13px; line-height: 1.4;
    }
    .note-box {
      padding: 10px 14px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0;
      color: #475569; font-size: 12px; line-height: 1.4;
    }
    .explanation-card {
      padding: 16px; border-radius: 16px; background: #f0f9ff; border: 1px solid #bae6fd;
      color: #0f172a; font-size: 13.5px; line-height: 1.55;
    }
    .explanation-head {
      font-weight: 700; font-size: 11px; text-transform: uppercase; color: #0369a1;
      letter-spacing: 0.05em; margin-bottom: 6px; display: flex; justify-content: space-between;
    }

    /* Modals */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px);
      z-index: 50; display: none; align-items: center; justify-content: center; padding: 16px;
    }
    .modal-backdrop.open { display: flex; }
    .modal-card {
      background: white; border-radius: 24px; padding: 24px; width: 100%; max-width: 800px;
      max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px;
      margin-bottom: 16px; border-bottom: 1px solid #e2e8f0;
    }
    .modal-title { font-size: 20px; font-weight: 700; color: #1e293b; }
    .close-btn {
      width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; border: none;
      font-size: 16px; cursor: pointer; color: #64748b;
    }

    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
    th, td { padding: 8px 10px; border: 1px solid #e2e8f0; text-align: left; }
    th { background: #f8fafc; font-weight: 600; color: #475569; }

    .grid-metrics {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 16px;
    }
    .metric-card {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; text-align: center;
    }
    .metric-val { font-size: 22px; font-weight: 800; color: #0284c7; margin-top: 4px; }
    .metric-label { font-size: 11px; color: #64748b; font-weight: 600; }
  </style>
</head>
<body>
  <div class="bg-cloud-1"></div>
  <div class="bg-cloud-2"></div>
  <div class="bg-cloud-3"></div>

  <header>
    <div class="header-inner">
      <div class="header-top">
        <div class="logo-area">
          <span class="logo-icon">☁️</span>
          <div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="logo-title">CloudChem</span>
              <span class="badge">Offline Standalone</span>
            </div>
            <div style="font-size:11px; color:#64748b;">Inorganic Chemistry Mid-Term Question Authority</div>
          </div>
        </div>

        <div class="nav-actions">
          <button class="btn btn-primary" onclick="openProgress()">
            <span>📊</span><span>Progress</span>
            <span id="header-progress-pill" style="background:rgba(255,255,255,0.3); padding:2px 6px; border-radius:6px; font-size:10px;">0/130</span>
          </button>
          <button class="btn" onclick="openAudit()">📋 Audit</button>
          <button class="btn" onclick="openPeriodic()">⚛️ Elements</button>
          <button class="btn" onclick="openSettings()">⚙️ Settings</button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-group" id="year-filters">
          <span style="font-weight:600; color:#64748b; font-size:11px;">Paper:</span>
          <span class="chip active" onclick="setYearFilter('ALL')">ALL</span>
          <span class="chip" onclick="setYearFilter('AY25/26')">AY25/26</span>
          <span class="chip" onclick="setYearFilter('AY24/25')">AY24/25</span>
          <span class="chip" onclick="setYearFilter('AY23/24')">AY23/24</span>
          <span class="chip" onclick="setYearFilter('AY22/23')">AY22/23</span>
          <span class="chip" onclick="setYearFilter('AY21/22')">AY21/22</span>
        </div>

        <div>
          <select class="filter-select" id="theme-select" onchange="setThemeFilter(this.value)">
            <option value="ALL">All Themes (130 Questions)</option>
            <option value="Coordination Nomenclature & Formulas">Coordination Nomenclature & Formulas</option>
            <option value="Isomerism & Stereochemistry">Isomerism & Stereochemistry</option>
            <option value="Crystal Field & Ligand Field Theory">Crystal Field & Ligand Field Theory</option>
            <option value="Bonding & Spectrochemical Series">Bonding & Spectrochemical Series</option>
            <option value="Coordination Stability & Thermodynamics">Coordination Stability & Thermodynamics</option>
            <option value="Jahn-Teller & Electronic Spectra">Jahn-Teller & Electronic Spectra</option>
          </select>
        </div>
      </div>
    </div>
  </header>

  <main>
    <div class="card" id="quiz-card">
      <div class="q-meta">
        <div>
          <span class="q-year-pill" id="q-year">AY25/26 • Q1</span>
          <span style="color:#64748b; margin-left:6px;" id="q-page">Page 2</span>
        </div>
        <div>
          <span class="q-theme-pill" id="q-theme">Nomenclature</span>
          <span style="color:#94a3b8; font-size:11px; margin-left:6px;" id="q-pool-info">Pool: 130</span>
        </div>
      </div>

      <div class="q-text" id="q-text">Loading question...</div>

      <div class="q-img-wrap" id="q-img-box" style="display:none;">
        <img id="q-img" src="" alt="Question figure">
      </div>

      <div class="options-grid" id="options-container"></div>

      <div class="feedback-box" id="feedback-box" style="display:none;">
        <div class="status-bar" id="status-bar">
          <div>
            <div style="font-weight:700; font-size:16px;" id="status-title">Correct!</div>
            <div style="font-size:12px; opacity:0.9;" id="status-sub">Authority Answer: B</div>
          </div>
          <button class="btn btn-primary" onclick="nextQuestion()" style="font-size:14px; padding:8px 16px;">
            Next [Space/Enter] →
          </button>
        </div>

        <div class="alt-key-alert" id="alt-key-alert" style="display:none;">
          <strong>Official Alternative Key:</strong> The supplied answer key lists alternatives. Either option is accepted as correct.
        </div>

        <div class="note-box" id="note-box" style="display:none;"></div>

        <div class="explanation-card">
          <div class="explanation-head">
            <span>Chemical Principle & Explanation</span>
            <span>Pre-compiled</span>
          </div>
          <div id="explanation-text"></div>
        </div>
      </div>
    </div>
  </main>

  <!-- Progress Modal -->
  <div class="modal-backdrop" id="modal-progress" onclick="if(event.target===this)closeModals()">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">📊 Progress & Retention Analytics</div>
        <button class="close-btn" onclick="closeModals()">✕</button>
      </div>

      <div class="grid-metrics">
        <div class="metric-card">
          <div class="metric-label">Unique Coverage</div>
          <div class="metric-val" id="metric-coverage">0%</div>
          <div style="font-size:10px; color:#64748b;" id="metric-coverage-sub">0 / 130 Qs</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">1st-Attempt Accuracy</div>
          <div class="metric-val" id="metric-first-acc">0%</div>
          <div style="font-size:10px; color:#64748b;" id="metric-first-acc-sub">0 / 0 unique</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Overall Reviews</div>
          <div class="metric-val" id="metric-overall-acc">0%</div>
          <div style="font-size:10px; color:#64748b;" id="metric-overall-acc-sub">0 / 0 reviews</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Estimated Retention</div>
          <div class="metric-val" id="metric-retention">—</div>
          <div style="font-size:10px; color:#64748b;">R = exp(-Δt/S)</div>
        </div>
      </div>

      <h4 style="font-size:14px; font-weight:700; margin-bottom:8px;">Theme Breakdown</h4>
      <div style="overflow-x:auto;">
        <table id="theme-table">
          <thead>
            <tr>
              <th>Theme</th>
              <th>Coverage</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>

      <div style="margin-top:20px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <button class="btn" onclick="exportData()">💾 Export JSON</button>
        <button class="btn" onclick="document.getElementById('import-file').click()">📂 Import JSON</button>
        <input type="file" id="import-file" style="display:none;" onchange="importData(event)">
        <button class="btn" style="color:#e11d48;" onclick="resetData()">Reset Progress</button>
      </div>
    </div>
  </div>

  <!-- Audit Modal -->
  <div class="modal-backdrop" id="modal-audit" onclick="if(event.target===this)closeModals()">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">📋 Source Material & Authority Audit</div>
        <button class="close-btn" onclick="closeModals()">✕</button>
      </div>
      <p style="font-size:13px; color:#475569; margin-bottom:12px;">
        Exact reconciliation of all 5 examination papers against ANS.pdf.
      </p>
      <table>
        <thead>
          <tr>
            <th>Academic Year</th>
            <th>Questions Found</th>
            <th>Key Entries</th>
            <th>Verified Usable</th>
            <th>Quarantined</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody id="audit-table-body"></tbody>
      </table>
    </div>
  </div>

  <!-- Elements Reference Modal -->
  <div class="modal-backdrop" id="modal-periodic" onclick="if(event.target===this)closeModals()">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">⚛️ Transition Metals & Valence Reference</div>
        <button class="close-btn" onclick="closeModals()">✕</button>
      </div>
      <div style="font-size:12px; line-height:1.6; color:#334155;">
        <p><strong>First-Row Transition Metals (3d):</strong></p>
        <p>• Sc (21): [Ar] 3d<sup>1</sup> 4s<sup>2</sup> | Sc<sup>3+</sup> (d<sup>0</sup>)<br>
        • Ti (22): [Ar] 3d<sup>2</sup> 4s<sup>2</sup> | Ti<sup>4+</sup> (d<sup>0</sup>), Ti<sup>3+</sup> (d<sup>1</sup>), Ti<sup>2+</sup> (d<sup>2</sup>)<br>
        • V (23): [Ar] 3d<sup>3</sup> 4s<sup>2</sup> | V<sup>5+</sup> (d<sup>0</sup>), V<sup>4+</sup> (d<sup>1</sup>), V<sup>3+</sup> (d<sup>2</sup>), V<sup>2+</sup> (d<sup>3</sup>)<br>
        • Cr (24): [Ar] 3d<sup>5</sup> 4s<sup>1</sup> | Cr<sup>6+</sup> (d<sup>0</sup>), Cr<sup>3+</sup> (d<sup>3</sup>), Cr<sup>2+</sup> (d<sup>4</sup>)<br>
        • Mn (25): [Ar] 3d<sup>5</sup> 4s<sup>2</sup> | Mn<sup>7+</sup> (d<sup>0</sup>), Mn<sup>4+</sup> (d<sup>3</sup>), Mn<sup>3+</sup> (d<sup>4</sup>), Mn<sup>2+</sup> (d<sup>5</sup>)<br>
        • Fe (26): [Ar] 3d<sup>6</sup> 4s<sup>2</sup> | Fe<sup>3+</sup> (d<sup>5</sup>), Fe<sup>2+</sup> (d<sup>6</sup>)<br>
        • Co (27): [Ar] 3d<sup>7</sup> 4s<sup>2</sup> | Co<sup>3+</sup> (d<sup>6</sup>), Co<sup>2+</sup> (d<sup>7</sup>)<br>
        • Ni (28): [Ar] 3d<sup>8</sup> 4s<sup>2</sup> | Ni<sup>2+</sup> (d<sup>8</sup>)<br>
        • Cu (29): [Ar] 3d<sup>10</sup> 4s<sup>1</sup> | Cu<sup>2+</sup> (d<sup>9</sup>), Cu<sup>+</sup> (d<sup>10</sup>)<br>
        • Zn (30): [Ar] 3d<sup>10</sup> 4s<sup>2</sup> | Zn<sup>2+</sup> (d<sup>10</sup>)</p>
        <p style="margin-top:10px;"><strong>Heavier Platinum Group:</strong><br>
        • Rh (45): Rh<sup>3+</sup> (d<sup>6</sup>) | Pd (46): Pd<sup>2+</sup> (d<sup>8</sup>)<br>
        • Ir (77): Ir<sup>3+</sup> (d<sup>6</sup>) | Pt (78): Pt<sup>2+</sup> (d<sup>8</sup>, square planar), Pt<sup>4+</sup> (d<sup>6</sup>, octahedral)</p>
        <p style="margin-top:10px; background:#f0f9ff; padding:8px; border-radius:8px;">
          <strong>Spectrochemical Series:</strong><br>
          I⁻ &lt; Br⁻ &lt; S²⁻ &lt; SCN⁻ &lt; Cl⁻ &lt; NO₃⁻ &lt; F⁻ &lt; OH⁻ &lt; C₂O₄²⁻ &lt; H₂O &lt; NCS⁻ &lt; NH₃ &lt; en &lt; NO₂⁻ &lt; PPh₃ &lt; CN⁻ ≈ CO
        </p>
      </div>
    </div>
  </div>

  <!-- Settings Modal -->
  <div class="modal-backdrop" id="modal-settings" onclick="if(event.target===this)closeModals()">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">⚙️ Adaptive Scheduling & Settings</div>
        <button class="close-btn" onclick="closeModals()">✕</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label style="font-weight:600; font-size:13px;">Target Retention Rate (r): <span id="retention-val" style="color:#0284c7;">85%</span></label>
          <input type="range" id="retention-slider" min="0.70" max="0.95" step="0.01" value="0.85" style="width:100%; margin-top:6px;" oninput="updateTargetRetention(this.value)">
          <div style="font-size:11px; color:#64748b; margin-top:2px;">Calculates due interval: <code>due = -S_i × ln(r)</code></div>
        </div>

        <div>
          <label style="display:flex; align-items:center; gap:8px; font-weight:600; font-size:13px; cursor:pointer;">
            <input type="checkbox" id="motion-check" checked onchange="toggleMotion(this.checked)">
            <span>Enable Cloud Animations</span>
          </label>
        </div>

        <div style="background:#f8fafc; padding:12px; border-radius:12px; font-size:11.5px; line-height:1.5; color:#475569;">
          <strong>Adaptive Scheduler Model:</strong><br>
          • Retention estimate: <code>R_i(t) = exp(-Δt / S_i)</code><br>
          • Initial stability: <code>S_0 = 24 hours</code><br>
          • Correct answer multiplier: <code>2.2×</code><br>
          • Lapse decay multiplier: <code>0.35×</code> (min 4 hours)<br>
          • Session relearning: re-tests missed items after 3 intervening questions.
        </div>
      </div>
    </div>
  </div>

  <script>
    // Embedded Data
    const DATA = \${dataPayload};
    const QUESTIONS = DATA.questions;
    const AUDIT = DATA.audit;

    function formatChemHtml(text) {
      if (!text) return '';
      let res = text;
      res = res.replace(/\\bdx2-y2\\b/gi, 'd<sub>x<sup>2</sup>-y<sup>2</sup></sub>');
      res = res.replace(/\\bdz\\s*2\\b/gi, 'd<sub>z<sup>2</sup></sub>');
      res = res.replace(/\\bdz2\\b/gi, 'd<sub>z<sup>2</sup></sub>');
      res = res.replace(/\\bdxy\\b/gi, 'd<sub>xy</sub>');
      res = res.replace(/\\bdyz\\b/gi, 'd<sub>yz</sub>');
      res = res.replace(/\\bdxz\\b/gi, 'd<sub>xz</sub>');
      res = res.replace(/\\bdyx\\b/gi, 'd<sub>yx</sub>');
      res = res.replace(/Δ[oO0]/g, 'Δ<sub>o</sub>');
      res = res.replace(/Δt(?!\\w)/g, 'Δ<sub>t</sub>');
      res = res.replace(/\\b([1-6])([spdf])(\\d+)\\b/g, '$1$2<sup>$3</sup>');
      res = res.replace(/\\bsp([23])\\b/g, 'sp<sup>$1</sup>');
      res = res.replace(/\\bt2g\\s*\\^?(\\d+)/gi, 't<sub>2g</sub><sup>$1</sup>');
      res = res.replace(/\\beg\\s*\\^?(\\d+)/gi, 'e<sub>g</sub><sup>$1</sup>');
      res = res.replace(/\\bt2g\\b/gi, 't<sub>2g</sub>');
      res = res.replace(/\\beg\\b/gi, 'e<sub>g</sub>');
      res = res.replace(/(^|[\\s\\(\\[\\-\\/\\>])d([0-9]|10)\\b/g, '$1d<sup>$2</sup>');
      res = res.replace(/\\b10\\^([+\\-]?\\d+)/g, '10<sup>$1</sup>');
      res = res.replace(/\\b10(11|27|15|18)\\b/g, '10<sup>$1</sup>');
      res = res.replace(/\\]\\s*([2-6]?)([+\\-])/g, function(m, num, sign) {
        return ']<sup>' + num + (sign === '-' ? '−' : '+') + '</sup>';
      });
      res = res.replace(/\\b(Na|K|Ba|Ca|Mg|Li)(\\d+)\\[/g, '$1<sub>$2</sub>[');
      res = res.replace(/\\[([^\\]]+)\\]/g, function(wholeMatch, inner) {
        var formattedInner = inner;
        formattedInner = formattedInner.replace(/\\)([2-8])/g, ')<sub>$1</sub>');
        formattedInner = formattedInner.replace(/H2O/g, 'H<sub>2</sub>O');
        formattedInner = formattedInner.replace(/NH3/g, 'NH<sub>3</sub>');
        formattedInner = formattedInner.replace(/CH3/g, 'CH<sub>3</sub>');
        formattedInner = formattedInner.replace(/NH2/g, 'NH<sub>2</sub>');
        formattedInner = formattedInner.replace(/PPh3/g, 'PPh<sub>3</sub>');
        formattedInner = formattedInner.replace(/C2O4/g, 'C<sub>2</sub>O<sub>4</sub>');
        formattedInner = formattedInner.replace(/C6H5/g, 'C<sub>6</sub>H<sub>5</sub>');
        formattedInner = formattedInner.replace(/NO2/g, 'NO<sub>2</sub>');
        formattedInner = formattedInner.replace(/NO3/g, 'NO<sub>3</sub>');
        formattedInner = formattedInner.replace(/SO4/g, 'SO<sub>4</sub>');
        formattedInner = formattedInner.replace(/CO3/g, 'CO<sub>3</sub>');
        formattedInner = formattedInner.replace(/(Cl|Br|F|I|H|O|N|P|S|Pt|Pd|Ni|Co|Fe|Mn|Cr|V|Ti|Cu|Zn)(\\d+)/g, '$1<sub>$2</sub>');
        return '[' + formattedInner + ']';
      });
      res = res.replace(/(\\]|<\\/sup>)(Cl|Br|I|F)(\\d+)/g, '$1$2<sub>$3</sub>');
      res = res.replace(/(\\]|<\\/sup>)\\(NO3\\)(\\d+)/g, '$1(NO<sub>3</sub>)<sub>$2</sub>');
      res = res.replace(/(\\]|<\\/sup>)\\(NO2\\)(\\d+)/g, '$1(NO<sub>2</sub>)<sub>$2</sub>');
      res = res.replace(/(\\]|<\\/sup>)\\(SO4\\)/g, '$1SO<sub>4</sub>');
      res = res.replace(/\\bML6\\b/g, 'ML<sub>6</sub>');
      res = res.replace(/\\bML4\\b/g, 'ML<sub>4</sub>');
      res = res.replace(/\\bMX2Y4\\b/g, 'MX<sub>2</sub>Y<sub>4</sub>');
      res = res.replace(/\\bMa4b2\\b/g, 'Ma<sub>4</sub>b<sub>2</sub>');
      res = res.replace(/\\bMa3b3\\b/g, 'Ma<sub>3</sub>b<sub>3</sub>');
      res = res.replace(/\\bMa4bc\\b/g, 'Ma<sub>4</sub>bc');
      res = res.replace(/\\bMa2b2c2\\b/g, 'Ma<sub>2</sub>b<sub>2</sub>c<sub>2</sub>');
      res = res.replace(/M\\(A\\-B\\)3/g, 'M(A-B)<sub>3</sub>');
      res = res.replace(/M\\(A\\-A\\)2/g, 'M(A-A)<sub>2</sub>');
      res = res.replace(/M\\(A\\-A\\)3/g, 'M(A-A)<sub>3</sub>');
      res = res.replace(/\\(A\\-B\\)3/g, '(A-B)<sub>3</sub>');
      res = res.replace(/\\(A\\-A\\)2/g, '(A-A)<sub>2</sub>');
      res = res.replace(/\\(A\\-A\\)3/g, '(A-A)<sub>3</sub>');
      res = res.replace(/\\bKMnO4\\b/g, 'KMnO<sub>4</sub>');
      res = res.replace(/\\bPbCl2\\b/g, 'PbCl<sub>2</sub>');
      res = res.replace(/\\bBaCl2\\b/g, 'BaCl<sub>2</sub>');
      res = res.replace(/\\bAgNO3\\b/g, 'AgNO<sub>3</sub>');
      res = res.replace(/\\bNiCl2\\b/g, 'NiCl<sub>2</sub>');
      res = res.replace(/\\bCoCl2\\b/g, 'CoCl<sub>2</sub>');
      res = res.replace(/\\bFeCl3\\b/g, 'FeCl<sub>3</sub>');
      res = res.replace(/\\bFeCl2\\b/g, 'FeCl<sub>2</sub>');
      res = res.replace(/\\bCuSO4\\b/g, 'CuSO<sub>4</sub>');
      res = res.replace(/\\bH2O\\b/g, 'H<sub>2</sub>O');
      res = res.replace(/\\bNH3\\b/g, 'NH<sub>3</sub>');
      res = res.replace(/\\bCH3NH2\\b/g, 'CH<sub>3</sub>NH<sub>2</sub>');
      res = res.replace(/\\bPPh3\\b/g, 'PPh<sub>3</sub>');
      res = res.replace(/\\)([2-8])(?!\\w)/g, ')<sub>$1</sub>');
      res = res.replace(/\\bSO4(?!\\w)/g, 'SO<sub>4</sub>');
      res = res.replace(/\\bCO3(?!\\w)/g, 'CO<sub>3</sub>');
      res = res.replace(/\\bNO2(?!\\w)/g, 'NO<sub>2</sub>');
      res = res.replace(/\\bNO3(?!\\w)/g, 'NO<sub>3</sub>');
      res = res.replace(/\\bC2O4(?!\\w)/g, 'C<sub>2</sub>O<sub>4</sub>');

      var metals = ['Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Pt', 'Ti', 'Cr', 'Mn', 'V', 'Cd', 'Rh', 'Ir', 'Pd', 'Ba', 'Pb', 'Ag', 'Ca', 'Mg', 'Sc', 'Al'];
      for (var i = 0; i < metals.length; i++) {
        var mName = metals[i];
        var reg = new RegExp('\\\\b' + mName + '([2-7]?)([+\\-])(?!\\\\w)', 'g');
        res = res.replace(reg, function(match, num, sign) {
          return mName + '<sup>' + num + (sign === '-' ? '−' : '+') + '</sup>';
        });
      }
      res = res.replace(/\\bM([2-7]?)([+\\-])(?!\\w)/g, function(match, num, sign) {
        return 'M<sup>' + num + (sign === '-' ? '−' : '+') + '</sup>';
      });
      res = res.replace(/\\bMn\\+(?!\\w)/g, 'M<sup>n+</sup>');
      res = res.replace(/\\bPt0\\b/g, 'Pt<sup>0</sup>');
      res = res.replace(/\\bSCN\\s*([+\\-])(?!\\w)/g, 'SCN<sup>−</sup>');
      res = res.replace(/\\bCN\\s*([+\\-])(?!\\w)/g, 'CN<sup>−</sup>');
      res = res.replace(/\\bOH\\s*([+\\-])(?!\\w)/g, 'OH<sup>−</sup>');
      res = res.replace(/\\bNO2\\s*([+\\-])(?!\\w)/g, 'NO<sub>2</sub><sup>−</sup>');
      res = res.replace(/\\bNO3\\s*([+\\-])(?!\\w)/g, 'NO<sub>3</sub><sup>−</sup>');
      res = res.replace(/\\bSO4\\s*2\\-(?!\\w)/g, 'SO<sub>4</sub><sup>2−</sup>');
      res = res.replace(/\\bCO3\\s*2\\-(?!\\w)/g, 'CO<sub>3</sub><sup>2−</sup>');
      res = res.replace(/\\bC2O4\\s*2\\-(?!\\w)/g, 'C<sub>2</sub>O<sub>4</sub><sup>2−</sup>');
      res = res.replace(/\\bCl\\s*([+\\-])(?!\\w)/g, 'Cl<sup>−</sup>');
      res = res.replace(/\\bBr\\s*([+\\-])(?!\\w)/g, 'Br<sup>−</sup>');
      res = res.replace(/\\bI\\s*([+\\-])(?!\\w)/g, 'I<sup>−</sup>');
      res = res.replace(/\\bF\\s*([+\\-])(?!\\w)/g, 'F<sup>−</sup>');

      return res;
    }

    // State
    let currentQuestion = null;
    let selectedOption = null;
    let isSubmitted = false;
    let activeYearFilter = 'ALL';
    let activeThemeFilter = 'ALL';
    let targetRetention = 0.85;
    let animationsEnabled = true;

    let learningStates = {};
    let recentIds = [];
    let sessionMistakeQueue = [];
    let sessionAttempts = 0;
    let sessionCorrect = 0;

    // Load from localStorage
    function loadStorage() {
      try {
        const raw = localStorage.getItem('cloudchem_standalone_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.learningStates) {
            learningStates = parsed.learningStates;
            if (parsed.settings) {
              targetRetention = parsed.settings.targetRetention || 0.85;
              animationsEnabled = parsed.settings.animationsEnabled !== false;
            }
          }
        }
      } catch (e) {
        console.warn('Storage unavailable', e);
      }
    }

    function saveStorage() {
      try {
        localStorage.setItem('cloudchem_standalone_v1', JSON.stringify({
          schemaVersion: '1.0',
          learningStates,
          settings: { targetRetention, animationsEnabled }
        }));
      } catch (e) {}
    }

    // Spaced repetition formulas
    function calculateRetention(lastReviewedAt, stability, now) {
      if (!lastReviewedAt || stability <= 0) return null;
      const elapsedHours = Math.max(0, (now - lastReviewedAt) / 3600000);
      return Math.exp(-elapsedHours / stability);
    }

    function calculateDueInterval(stability, r) {
      return Math.max(0.25, stability * (-Math.log(r || 0.85)));
    }

    // Hybrid Selector
    function getEligiblePool() {
      return QUESTIONS.filter(q => {
        if (activeYearFilter !== 'ALL' && q.academicYear !== activeYearFilter) return false;
        if (activeThemeFilter !== 'ALL' && q.primaryTheme !== activeThemeFilter) return false;
        return true;
      });
    }

    function pickNextQuestion() {
      const pool = getEligiblePool();
      if (pool.length === 0) return null;
      if (pool.length === 1) return pool[0];

      const now = Date.now();
      const recentWindow = Math.min(4, Math.max(1, pool.length - 2));
      const recentSet = new Set(recentIds.slice(-recentWindow));

      // Session mistake queue check
      const readyLapse = sessionMistakeQueue.find(
        item => item.questionsSinceLapse >= 3 && pool.some(q => q.id === item.questionId) && !recentSet.has(item.questionId)
      );
      if (readyLapse) {
        return pool.find(q => q.id === readyLapse.questionId);
      }

      const scored = [];
      for (const q of pool) {
        if (recentSet.has(q.id) && pool.length > recentWindow) continue;

        const s = learningStates[q.id];
        let weight = 1.0;
        if (!s || !s.lastReviewedAt) {
          weight = 8.0;
        } else {
          const ret = calculateRetention(s.lastReviewedAt, s.stability, now) ?? 1.0;
          if (s.nextDueAt && now >= s.nextDueAt) {
            weight = 12.0 + (1.0 - ret) * 20.0;
          } else if (ret < targetRetention) {
            weight = 7.0 + (targetRetention - ret) * 15.0;
          } else {
            weight = Math.max(0.5, (1.0 - ret) * 3.0);
          }
          if (s.lapses > 0) weight += Math.min(8.0, s.lapses * 2.5);
        }
        scored.push({ q, weight: Math.max(0.1, weight) });
      }

      if (scored.length === 0) {
        return pool.find(q => q.id !== recentIds[recentIds.length - 1]) || pool[0];
      }

      const totalWeight = scored.reduce((a, b) => a + b.weight, 0);
      let r = Math.random() * totalWeight;
      for (const item of scored) {
        r -= item.weight;
        if (r <= 0) return item.q;
      }
      return scored[scored.length - 1].q;
    }

    function renderQuestion(q) {
      currentQuestion = q;
      selectedOption = null;
      isSubmitted = false;

      const pool = getEligiblePool();
      const unseenCount = pool.filter(item => !learningStates[item.id] || !learningStates[item.id].lastReviewedAt).length;

      document.getElementById('q-year').textContent = q.academicYear + ' • Q' + q.originalQNum;
      document.getElementById('q-page').textContent = 'Page ' + q.page;
      document.getElementById('q-theme').textContent = q.primaryTheme;
      document.getElementById('q-pool-info').textContent = 'Pool: ' + pool.length + ' (' + unseenCount + ' unseen)';
      document.getElementById('q-text').innerHTML = formatChemHtml(q.questionText);

      const imgBox = document.getElementById('q-img-box');
      const img = document.getElementById('q-img');
      if (q.visualAsset) {
        img.src = q.visualAsset;
        imgBox.style.display = 'block';
      } else {
        imgBox.style.display = 'none';
      }

      const optContainer = document.getElementById('options-container');
      optContainer.innerHTML = '';

      ['A', 'B', 'C', 'D'].forEach((key, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.id = 'opt-btn-' + key;
        btn.onclick = () => selectOption(key);
        btn.innerHTML =
          '<div class="opt-key">' + key + '</div>' +
          '<div class="opt-content">' + formatChemHtml(q.options[key]) + '</div>' +
          '<div class="opt-kbd">[' + (idx + 1) + ']</div>';
        optContainer.appendChild(btn);
      });

      document.getElementById('feedback-box').style.display = 'none';
      updateHeaderPill();
    }

    function selectOption(key) {
      if (isSubmitted || !currentQuestion) return;
      isSubmitted = true;
      selectedOption = key;

      const now = Date.now();
      const isCorrect = currentQuestion.acceptedAnswers.includes(key);

      sessionAttempts++;
      if (isCorrect) sessionCorrect++;

      // Update learning state
      const prevState = learningStates[currentQuestion.id] || {
        questionId: currentQuestion.id,
        reps: 0,
        lapses: 0,
        stability: 24,
        lastReviewedAt: null,
        nextDueAt: null,
        history: []
      };

      const newHistory = [...prevState.history, { timestamp: now, selectedOption: key, isCorrect }];
      let newStability = prevState.stability;
      let newLapses = prevState.lapses;

      if (isCorrect) {
        newStability = prevState.lastReviewedAt ? Math.min(8760, prevState.stability * 2.2) : 24;
      } else {
        newLapses++;
        newStability = Math.max(4, prevState.stability * 0.35);
        // Add to session mistake queue
        sessionMistakeQueue.push({ questionId: currentQuestion.id, questionsSinceLapse: 0 });
      }

      const dueHours = calculateDueInterval(newStability, targetRetention);
      learningStates[currentQuestion.id] = {
        questionId: currentQuestion.id,
        reps: prevState.reps + 1,
        lapses: newLapses,
        stability: newStability,
        lastReviewedAt: now,
        nextDueAt: now + dueHours * 3600000,
        history: newHistory
      };

      // Increment mistake queue counters
      sessionMistakeQueue.forEach(item => {
        if (item.questionId !== currentQuestion.id) item.questionsSinceLapse++;
      });
      recentIds.push(currentQuestion.id);

      saveStorage();

      // Style options
      ['A', 'B', 'C', 'D'].forEach(k => {
        const btn = document.getElementById('opt-btn-' + k);
        btn.disabled = true;
        if (currentQuestion.acceptedAnswers.includes(k)) {
          btn.className = 'opt-btn correct';
        } else if (k === key && !isCorrect) {
          btn.className = 'opt-btn incorrect';
        } else {
          btn.className = 'opt-btn faded';
        }
      });

      // Show feedback
      const fb = document.getElementById('feedback-box');
      fb.style.display = 'flex';

      const statusBar = document.getElementById('status-bar');
      statusBar.className = isCorrect ? 'status-bar success' : 'status-bar fail';
      document.getElementById('status-title').textContent = isCorrect ? '🌟 Correct!' : '💡 Incorrect';
      document.getElementById('status-sub').textContent = 'Authority Answer: ' + currentQuestion.acceptedAnswers.join(' or ');

      const altAlert = document.getElementById('alt-key-alert');
      if (currentQuestion.isAlternativeKey) {
        altAlert.style.display = 'block';
        altAlert.innerHTML = '<strong>Official Alternative Key:</strong> The supplied answer key lists alternatives <code>(' + currentQuestion.acceptedAnswers.join('/') + ')</code>. Either option is accepted as correct.';
      } else {
        altAlert.style.display = 'none';
      }

      const noteBox = document.getElementById('note-box');
      if (currentQuestion.notes) {
        noteBox.style.display = 'block';
        noteBox.innerHTML = '<strong>Source Authority Note: </strong>' + formatChemHtml(currentQuestion.notes);
      } else {
        noteBox.style.display = 'none';
      }

      document.getElementById('explanation-text').innerHTML = formatChemHtml(currentQuestion.explanation);
      updateHeaderPill();
    }

    function nextQuestion() {
      const q = pickNextQuestion();
      if (q) renderQuestion(q);
    }

    function setYearFilter(y) {
      activeYearFilter = y;
      document.querySelectorAll('#year-filters .chip').forEach(el => {
        el.className = el.textContent === y ? 'chip active' : 'chip';
      });
      nextQuestion();
    }

    function setThemeFilter(t) {
      activeThemeFilter = t;
      nextQuestion();
    }

    function updateHeaderPill() {
      const attempted = Object.keys(learningStates).filter(id => learningStates[id].history.length > 0).length;
      document.getElementById('header-progress-pill').textContent = attempted + '/130';
    }

    // Keyboard navigation
    window.addEventListener('keydown', e => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;
      if (document.querySelector('.modal-backdrop.open')) return;

      if (!isSubmitted) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') selectOption('A');
        else if (e.key === '2' || e.key.toLowerCase() === 'b') selectOption('B');
        else if (e.key === '3' || e.key.toLowerCase() === 'c') selectOption('C');
        else if (e.key === '4' || e.key.toLowerCase() === 'd') selectOption('D');
      } else {
        if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'n') {
          e.preventDefault();
          nextQuestion();
        }
      }
    });

    // Modals
    function closeModals() {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.classList.remove('open'));
    }
    function openProgress() {
      const totalVerified = 130;
      const attemptedIds = Object.keys(learningStates).filter(id => learningStates[id].history.length > 0);
      const uniqueCount = attemptedIds.length;
      const covPct = ((uniqueCount / totalVerified) * 100).toFixed(1);

      let firstCorrect = 0, totalGraded = 0, totalCorrect = 0, retSum = 0, retCount = 0;
      attemptedIds.forEach(id => {
        const s = learningStates[id];
        if (s.history[0]?.isCorrect) firstCorrect++;
        s.history.forEach(h => {
          totalGraded++;
          if (h.isCorrect) totalCorrect++;
        });
        const ret = calculateRetention(s.lastReviewedAt, s.stability, Date.now());
        if (ret !== null) { retSum += ret; retCount++; }
      });

      document.getElementById('metric-coverage').textContent = covPct + '%';
      document.getElementById('metric-coverage-sub').textContent = uniqueCount + ' / 130 verified Qs';
      document.getElementById('metric-first-acc').textContent = (uniqueCount > 0 ? ((firstCorrect / uniqueCount) * 100).toFixed(1) : 0) + '%';
      document.getElementById('metric-first-acc-sub').textContent = firstCorrect + ' / ' + uniqueCount + ' unique';
      document.getElementById('metric-overall-acc').textContent = (totalGraded > 0 ? ((totalCorrect / totalGraded) * 100).toFixed(1) : 0) + '%';
      document.getElementById('metric-overall-acc-sub').textContent = totalCorrect + ' / ' + totalGraded + ' reviews';
      document.getElementById('metric-retention').textContent = retCount > 0 ? ((retSum / retCount) * 100).toFixed(1) + '%' : 'Unseen';

      // Table breakdown
      const themes = [
        'Coordination Nomenclature & Formulas',
        'Isomerism & Stereochemistry',
        'Crystal Field & Ligand Field Theory',
        'Bonding & Spectrochemical Series',
        'Coordination Stability & Thermodynamics',
        'Jahn-Teller & Electronic Spectra'
      ];
      const tbody = document.querySelector('#theme-table tbody');
      tbody.innerHTML = '';
      themes.forEach(theme => {
        const themeQs = QUESTIONS.filter(q => q.primaryTheme === theme);
        const attempted = themeQs.filter(q => learningStates[q.id]?.history.length > 0).length;
        let c = 0, tot = 0;
        themeQs.forEach(q => {
          learningStates[q.id]?.history.forEach(h => { tot++; if (h.isCorrect) c++; });
        });
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + theme + '</td><td>' + attempted + '/' + themeQs.length + '</td><td>' + (tot > 0 ? ((c/tot)*100).toFixed(0) + '% (' + c + '/' + tot + ')' : '—') + '</td>';
        tbody.appendChild(tr);
      });

      document.getElementById('modal-progress').classList.add('open');
    }

    function openAudit() {
      const tbody = document.getElementById('audit-table-body');
      tbody.innerHTML = '';
      AUDIT.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td><strong>' + item.academicYear + '</strong></td><td>' + item.questionsFound + '</td><td>' + item.answerKeyEntries + '</td><td>' + item.verifiedUsableQuestions + '</td><td>' + item.quarantinedCount + '</td><td style="font-size:11px;">' + item.notes + '</td>';
        tbody.appendChild(tr);
      });
      document.getElementById('modal-audit').classList.add('open');
    }

    function openPeriodic() { document.getElementById('modal-periodic').classList.add('open'); }
    function openSettings() {
      document.getElementById('retention-slider').value = targetRetention;
      document.getElementById('retention-val').textContent = Math.round(targetRetention * 100) + '%';
      document.getElementById('motion-check').checked = animationsEnabled;
      document.getElementById('modal-settings').classList.add('open');
    }
    function updateTargetRetention(v) {
      targetRetention = parseFloat(v);
      document.getElementById('retention-val').textContent = Math.round(targetRetention * 100) + '%';
      saveStorage();
    }
    function toggleMotion(checked) {
      animationsEnabled = checked;
      document.body.classList.toggle('no-motion', !checked);
      saveStorage();
    }

    function exportData() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
        schemaVersion: '1.0',
        learningStates,
        settings: { targetRetention, animationsEnabled }
      }, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', 'cloudchem_progress_' + new Date().toISOString().slice(0, 10) + '.json');
      dlAnchor.click();
    }

    function importData(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed && parsed.schemaVersion === '1.0' && parsed.learningStates) {
            learningStates = parsed.learningStates;
            saveStorage();
            alert('Progress imported successfully!');
            openProgress();
          } else {
            alert('Invalid progress file schema.');
          }
        } catch (err) { alert('Failed to parse JSON file.'); }
      };
      reader.readAsText(file);
    }

    function resetData() {
      if (confirm('Are you sure you want to reset all learning history and progress?')) {
        learningStates = {};
        sessionAttempts = 0;
        sessionCorrect = 0;
        recentIds = [];
        sessionMistakeQueue = [];
        saveStorage();
        closeModals();
        nextQuestion();
      }
    }

    // Startup
    loadStorage();
    nextQuestion();
  </script>
</body>
</html>`;
}
