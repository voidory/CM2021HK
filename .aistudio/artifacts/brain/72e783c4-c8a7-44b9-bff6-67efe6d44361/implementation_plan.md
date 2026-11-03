# Universal GitHub Pages Deployment & Embedded Offline Standalone HTML Fix

Resolves the dual issue where CloudChem fails to display on GitHub Pages (due to mismatched script hashes, conflicting redirects, and missing subpath handling) and the offline standalone HTML fails to load (due to unresolved data placeholders and lack of pre-bundled questions).

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed during the interactive clarification phase:

- **Confirmed Decision 1 (Universal GitHub Pages Support)**: The app will seamlessly support all three GitHub Pages deployment models:
  1. Automated GitHub Actions workflow uploading `./dist` (`deploy.yml`).
  2. Branch-based deployment serving the `/docs` folder (`docs/index.html`).
  3. Direct root-level serving with intelligent redirection to the compiled bundle.
- **Confirmed Decision 2 (Pre-built Embedded Standalone HTML)**: The standalone offline revision file (`chem-revision-app.html`) will be fully pre-built with all 130 questions, source audits, and 3D isomer visualizers self-contained in `chem-revision-app.html`, `public/chem-revision-app.html`, `dist/chem-revision-app.html`, and `docs/chem-revision-app.html`. Users can double-click it locally without Node.js or any internet connection.

---

## 1. Overview & Core Concept

### What It Does
- **Resilient Multi-Target Deployment**: Ensures that whether GitHub Pages is configured to deploy via GitHub Actions (`dist/`), branch `/docs`, or repo root, the browser immediately resolves the correct compiled bundles with correct relative paths without 404 redirection loops.
- **Instant Offline Revision**: Eliminates the `${dataPayload}` syntax error by embedding the complete 130-question dataset directly into all standalone HTML deliverables so students can download and open the standalone single-file revision app completely offline in any web browser.

### Target Audience & Persona
- Chemistry students and instructors studying Inorganic Chemistry mid-term test papers across AY21/22 to AY25/26 on desktop, tablets, or offline campus computers.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **GitHub Pages Navigation**:
   - User visits `https://<user>.github.io/<repo>/` (with or without trailing slash).
   - If served via root, the page instantly transfers execution to the compiled entry in `/docs/` or `./dist/` without showing an unstyled crash dialog.
   - If served via GitHub Actions (`./dist`) or `/docs`, the React 19 app boots cleanly, displaying the floating cloud backdrop, interactive question card, and practice controls.
2. **Offline HTML Download & Local Execution**:
   - User clicks **Export Standalone HTML** or downloads `chem-revision-app.html` directly from GitHub.
   - Double-clicking the file offline opens the complete interactive revision interface with instant chemical formula rendering (`[Co(NH3)4Cl2]+`, $t_{2g}$ orbitals), spaced-repetition scheduler, and 3D canvas isomer rotational viewer without any remote asset dependencies.

### Resilience & Error Handling
- Replaces brittle `window.addEventListener('error', showFailure, true)` (which was prematurely capturing harmless resource warnings) with targeted React Error Boundaries and graceful recovery buttons.
- Harmonizes 404 handling so that missing sub-resource requests do not get trapped in an endless recursive `replace()` loop.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Redirection & Fallback Strategy for GitHub Pages
- **Chosen Approach**: Multi-tier detection:
  - If the page is already running compiled code (Vite bundled `<script type="module" crossorigin src="./assets/index-....js">`), execute immediately.
  - If uncompiled `index.html` is served at `https://<org>.github.io/<repo>/`, perform a single clean URL rewrite to `<base>/docs/` where the pre-compiled distribution lives.
  - Fix `docs/index.html` so it never redirects if already inside `/docs/` or if served as root.
- **Why**: GitHub repositories frequently switch between GitHub Actions workflow deployment and branch `/docs` publishing; universal compatibility guarantees zero downtime regardless of repo settings.

### Decision 2: Pre-bundled vs. On-the-Fly Standalone HTML
- **Chosen Approach**: Maintain a pre-bundled `chem-revision-app.html` in root, `docs/`, and `public/` that always has the full 130-question database populated, while also providing a Vite dev middleware so `/chem-revision-app.html` renders dynamically with live updates.
- **Why**: Offline users who clone the repo or download the file from GitHub need it to work immediately without having to run `npm run build`.

---

## 4. Technical Architecture & Data Strategy

### System & Build Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Build & Distribution Pipeline                 │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │     questions.json (130 Questions + Source Audit)       │
       └────────────────────────────┬────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│        Vite Bundler          │              │  Standalone Generator Script │
│  (Compile TSX, CSS, Assets)  │              │ (Inject Payload into HTML)   │
└──────────────┬───────────────┘              └─────────────┬────────────────┘
               │                                            │
               ▼                                            ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│         dist/ Directory      │              │     chem-revision-app.html   │
│  - index.html (Bundled)      │              │  - root /chem-revision-app   │
│  - assets/ (JS/CSS/Images)   │              │  - public/chem-revision-app  │
│  - chem-revision-app.html    │              │  - dist/chem-revision-app    │
│  - .nojekyll, 404.html       │              │  - docs/chem-revision-app    │
└──────────────┬───────────────┘              └──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Sync to docs/ Directory  │
│ (Universal GitHub Pages root)│
└──────────────────────────────┘
```

### Components to Update
1. **`vite.config.ts`**:
   - Add dev server middleware in `standaloneApp()` plugin to serve the compiled standalone revision HTML on `/chem-revision-app.html` during `npm run dev`.
   - Update `writeBundle()` to output both `dist/chem-revision-app.html` and refresh root `chem-revision-app.html`.
2. **`index.html` & `docs/index.html`**:
   - Remove conflicting redirection loops and the overly aggressive global `window.addEventListener('error')` that broke the initial mount.
   - Synchronize relative asset paths and ensure `.nojekyll` is preserved.
3. **`public/404.html` & `docs/404.html`**:
   - Fix SPA routing logic to safely redirect to base directory rather than appending or looping directory slashes.
4. **`package.json` build script**:
   - Ensure `npm run build` runs Vite build, populates standalone HTML, syncs to `docs/`, and verifies files against `scripts/verify-pages.py`.
