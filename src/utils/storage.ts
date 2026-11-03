/**
 * LocalStorage persistence and progress export/import
 */

import { QuestionLearningState, SchedulerConfig, DEFAULT_CONFIG } from './scheduler';

export interface StoredAppData {
  schemaVersion: string;
  learningStates: Record<string, QuestionLearningState>;
  settings: {
    targetRetention: number;
    animationsEnabled: boolean;
    activeYearFilter: string; // 'ALL' or 'AY21/22', etc.
    activeThemeFilter: string; // 'ALL' or specific theme
    rapidIntakeEnabled?: boolean;
  };
}

const STORAGE_KEY = 'chem_revision_progress_v1';

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function loadStoredData(): StoredAppData | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.schemaVersion === '1.0' && typeof parsed.learningStates === 'object') {
      return parsed as StoredAppData;
    }
  } catch (e) {
    console.error('Error loading stored revision data', e);
  }
  return null;
}

export function saveStoredData(data: StoredAppData): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving revision data to localStorage', e);
    return false;
  }
}

export function exportProgressToJson(data: StoredAppData): string {
  return JSON.stringify(data, null, 2);
}

export function validateImportedData(parsed: any): { valid: boolean; data?: StoredAppData; error?: string } {
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'Imported file is not a valid JSON object.' };
  }
  if (parsed.schemaVersion !== '1.0') {
    return { valid: false, error: `Unsupported schema version: ${parsed.schemaVersion || 'unknown'}. Expected 1.0.` };
  }
  if (!parsed.learningStates || typeof parsed.learningStates !== 'object') {
    return { valid: false, error: 'Missing or invalid learningStates record.' };
  }

  // Validate learningStates entries
  for (const [id, state] of Object.entries(parsed.learningStates)) {
    const s = state as any;
    if (typeof s.stability !== 'number' || typeof s.reps !== 'number' || !Array.isArray(s.history)) {
      return { valid: false, error: `Invalid state structure for question ${id}.` };
    }
  }

  const sanitized: StoredAppData = {
    schemaVersion: '1.0',
    learningStates: parsed.learningStates,
    settings: {
      targetRetention: typeof parsed.settings?.targetRetention === 'number' ? parsed.settings.targetRetention : DEFAULT_CONFIG.targetRetention,
      animationsEnabled: typeof parsed.settings?.animationsEnabled === 'boolean' ? parsed.settings.animationsEnabled : true,
      activeYearFilter: typeof parsed.settings?.activeYearFilter === 'string' ? parsed.settings.activeYearFilter : 'ALL',
      activeThemeFilter: typeof parsed.settings?.activeThemeFilter === 'string' ? parsed.settings.activeThemeFilter : 'ALL',
      rapidIntakeEnabled: typeof parsed.settings?.rapidIntakeEnabled === 'boolean' ? parsed.settings.rapidIntakeEnabled : false
    }
  };

  return { valid: true, data: sanitized };
}
