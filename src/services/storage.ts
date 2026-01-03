import type { DiaryEntry, Goal, SleepSession } from '../types';

const STORAGE_KEYS = {
  ENTRIES: 'trilevel_diary_entries',
  GOALS: 'trilevel_diary_goals',
  SLEEP_SESSION: 'trilevel_diary_sleep_session',
};

// --- Entries ---
export const loadEntries = (): Record<string, DiaryEntry> => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to load entries', e);
    return {};
  }
};

export const saveEntry = (entry: DiaryEntry) => {
  const entries = loadEntries();
  entries[entry.date] = entry;
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
};

export const getEntry = (date: string): DiaryEntry => {
  const entries = loadEntries();
  if (entries[date]) return entries[date];
  return {
    date,
    content: '',
    goals: {},
  };
};

// --- Goals ---
export const loadGoals = (): Goal[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

// --- Sleep Session ---
export const loadSleepSession = (): SleepSession => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SLEEP_SESSION);
    return data ? JSON.parse(data) : { startTime: 0, isActive: false };
  } catch (e) {
    return { startTime: 0, isActive: false };
  }
};

export const saveSleepSession = (session: SleepSession) => {
  localStorage.setItem(STORAGE_KEYS.SLEEP_SESSION, JSON.stringify(session));
};
