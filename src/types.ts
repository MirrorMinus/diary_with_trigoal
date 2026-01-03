export type GoalType = 'check-in' | 'accumulation';

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetEasy: number;
  targetHard: number;
  targetInsane: number;
  unit?: string; // e.g., "words", "km"
}

export interface DailyLog {
  [goalId: string]: number; // Value for that day. 1 for check-in, N for accumulation
}

export interface DiaryEntry {
  date: string; // ISO YYYY-MM-DD (Represents the "Diary Day", usually 4AM to 4AM)
  content: string;
  sleepHours?: number; // Deprecated, but kept for legacy data
  bedTime?: string; // ISO Timestamp of when user went to bed
  goals: DailyLog;
  aiReflection?: string;
}

export type Page = 'home' | 'stats' | 'settings';

export interface SleepSession {
  startTime: number; // timestamp
  isActive: boolean;
}
