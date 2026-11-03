# Rapid Intake: Accelerate Unseen Questions

A high-efficiency study mode for CloudChem that rapidly introduces all unseen chemistry questions while theoretically and mathematically safeguarding long-term retention.

---

> [!IMPORTANT] User Review & Critical Decisions
>
> - **Confirmed Balancing Model**: Heavily prioritize unseen questions as long as active retention is safe; temporarily yield only when reviews are critically overdue ($R(t) < 0.70$) or recent session mistakes require consolidation.
> - **Confirmed UI Placement**: Fast-access toggle button situated in the sticky navigation header alongside the quiz toolbar, displaying active state and remaining unseen count.
> - **Confirmed Completion Behavior**: Automatically deactivates and reverts to standard adaptive spaced repetition with a celebratory toast notification once all questions in the active filter pool have been seen.
> - **Filter Adaptability**: Dynamically respects active paper (e.g. AY24/25) and theme filters, recalculating unseen totals on filter changes.

---

## 1. Overview & Core Concept

When preparing for upcoming exams, students frequently face a cold-start pacing problem: standard spaced repetition algorithms interleave early reviews frequently, which slows down the initial exposure to fresh questions. 

**Rapid Intake Mode** solves this by:
1. **Accelerating New Knowledge Discovery**: Prioritizing remaining unseen questions so students can cover 100% of the syllabus syllabus questions across AY21/22 through AY25/26 faster.
2. **Mathematical Safety Gate**: Ensuring reviews are not neglected to the point of catastrophic forgetting. If a question's retention probability falls below the critical threshold ($R(t) < 0.70$) or an immediate lapse needs re-testing, the scheduler briefly surfaces the review before resuming new question intake.
3. **Graceful Auto-Reversion**: When the last unseen question in the selected paper or theme is seen, the app automatically transitions back to balanced adaptive review without requiring manual intervention.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Activation**:
   - The user clicks the **⚡ Rapid Intake** toggle button in the header (or quiz card toolbar).
   - An energetic sky/amber badge activates: `⚡ Rapid Intake ON (42 unseen)`.
   - The next card immediately pulls an unseen question from under-practiced themes.

2. **Practice Loop**:
   - As questions are answered, the counter dynamically decrements (`41 unseen`, `40 unseen`...).
   - If an existing card becomes critically overdue or a lapse occurs, CloudChem smoothly handles the critical review first, explaining in the card header metadata `[⚡ Review Guard: Critical Review]`.
   - Subsequent draws resume unseen items.

3. **Pool Depletion & Toast Notification**:
   - When the user answers the final unseen question in their selected filter pool, a toast notification animates in:  
     *“🎉 All questions in this pool have been explored! Returning to adaptive spaced review.”*
   - Rapid Intake deactivates cleanly, and the toggle returns to ready state with a checkmark indicator (`✓ All Seen`).

### Visual Styling & Interaction Design

- **Header Quick-Toggle Button**:
  - Unactive state: Crisp off-white button with subtle slate border and lightning glyph: `⚡ Rapid Intake (N unseen)`.
  - Active state: Radiant cyan/amber accent with subtle border ring and active pulse: `⚡ Rapid Intake ON (N left)`.
  - Inactive / Completed state: Subdued `✓ All Seen` when 0 unseen questions remain in the active filter.
- **Card Context Metadata**:
  - In the card header, alongside `Paper • Q#`, an indicator badge notes `⚡ New Intake` or `🔄 Review Guard` so the student always understands why a question was picked.
- **Toast Notification**:
  - Non-intrusive floating toast at the bottom right with backdrop blur and smooth entrance animation ($<200\text{ms}$).

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Alternatives Considered |
|---|---|---|
| **Intake Priority Math** | Priority Weight Multiplier ($W_{\text{unseen}} = 100.0$) with Critical Guard ($R < 0.70$) | Prevents memory decay while guaranteeing nearly 100% unseen selection when retention is stable. Avoids rigid 100% lockouts that let difficult cards decay completely. |
| **Placement** | Dual Header Action + Quiz Card Counter | Ensures instant single-click access on desktop and mobile without burying the feature in the Settings modal. |
| **State Persistence** | Saved to `localStorage` under `settings.rapidIntakeEnabled` | Remembers the student's preference between browser refreshes and tab reloads. |
| **Filter Sensitivity** | Scoped to the currently active Paper & Theme filters | If a student filters to "AY24/25", Rapid Intake prioritizes the 26 questions of that specific paper rather than the entire 130-question bank. |

---

## 4. Technical Architecture & Data Strategy

### System Diagram

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│  State: rapidIntakeEnabled, learningStates, filters    │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
            ▼                                ▼
┌───────────────────────────────┐  ┌─────────────────────┐
│          Header.tsx           │  │    QuizCard.tsx     │
│ ⚡ Rapid Intake Toggle Button  │  │ Intake Badge & Mode │
│ Dynamic unseen count badge    │  │ Context Indicators  │
└───────────┬───────────────────┘  └─────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────────────┐
│               utils/scheduler.ts (Core)                │
│  selectNextQuestion(pool, context)                     │
│  ├── If session mistake ready ──> Relearning item      │
│  ├── If rapidIntakeEnabled:                            │
│  │    ├── Find critically overdue (R < 0.70)           │
│  │    │     └── If found ──> Prioritize review guard   │
│  │    └── Else if unseen exist ──> Pick unseen item    │
│  └── Else standard weighted adaptive distribution      │
└────────────────────────────────────────────────────────┘
```

### State & Storage Mapping

1. **`StoredAppData` schema (`src/utils/storage.ts`)**:
   - Add `rapidIntakeEnabled?: boolean` to `StoredSettings`.
2. **`SelectorContext` (`src/utils/scheduler.ts`)**:
   - Add `rapidIntakeEnabled?: boolean` and `criticalRetentionThreshold?: number` (default $0.70$).
3. **Auto-Reversion Trigger**:
   - In `App.tsx`, calculate `unseenInPoolCount`. If `rapidIntakeEnabled` is true and `unseenInPoolCount === 0`, toggle it off and trigger a notification toast.
