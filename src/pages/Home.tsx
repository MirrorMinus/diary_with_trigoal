import React, { useState, useEffect } from 'react';
import type { Goal, DiaryEntry, DailyLog } from '../types';
import { getEntry, saveEntry } from '../services/storage';
import SleepTimer from '../components/SleepTimer';
import {
  Calendar,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface HomeProps {
  goals: Goal[];
  onDataChange: () => void; // Trigger refresh of charts if needed
}

// Helper to determine the "Diary Date" (4AM to 4AM rule)
const getCurrentDiaryDate = () => {
  const now = new Date();
  // If it's before 4 AM, it counts as yesterday
  if (now.getHours() < 4) {
    now.setDate(now.getDate() - 1);
  }
  return now.toISOString().split('T')[0];
};

const Home: React.FC<HomeProps> = ({ goals, onDataChange }) => {
  // Initialize with the correct "Diary Day"
  const [date, setDate] = useState<string>(getCurrentDiaryDate());

  const [content, setContent] = useState('');
  const [bedTime, setBedTime] = useState<string | undefined>(undefined);
  const [dailyGoalValues, setDailyGoalValues] = useState<DailyLog>({});
  const [aiReflection, setAiReflection] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load data when date changes
  useEffect(() => {
    const entry = getEntry(date);
    setContent(entry.content);
    setBedTime(entry.bedTime);
    setDailyGoalValues(entry.goals);
    setAiReflection(entry.aiReflection || '');
  }, [date]);

  const saveCurrentState = (updates?: Partial<DiaryEntry>) => {
    const entry: DiaryEntry = {
      date,
      content,
      bedTime,
      goals: dailyGoalValues,
      aiReflection,
      ...updates,
    };
    saveEntry(entry);
    onDataChange();
  };

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCurrentState();
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, bedTime, dailyGoalValues, aiReflection]);

  const handleBedTimeUpdate = (isoString: string) => {
    setBedTime(isoString);
    // Force immediate save for buttons
    saveCurrentState({ bedTime: isoString });
  };

  const handleGoalChange = (goalId: string, val: number) => {
    setDailyGoalValues((prev) => ({
      ...prev,
      [goalId]: val,
    }));
  };

  const handleGenerateReflection = async () => {
    console.log('Offline mode: AI reflection is disabled.');
  };

  const shiftDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  const isToday = date === getCurrentDiaryDate();

  return (
    <div className="pb-24 space-y-6">
      {/* Date Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
        <button
          onClick={() => shiftDate(-1)}
          className="p-2 text-slate-400 hover:text-slate-600"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-indigo-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-lg font-bold text-slate-700 bg-transparent outline-none text-center"
          />
        </div>
        <button
          onClick={() => shiftDate(1)}
          className="p-2 text-slate-400 hover:text-slate-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Sleep Section */}
      <section>
        <SleepTimer
          currentDate={date}
          bedTime={bedTime}
          onUpdateBedTime={handleBedTimeUpdate}
          isToday={isToday}
        />
      </section>

      {/* Diary Section */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-slate-700">Daily Diary</h2>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How was your day?"
          className="w-full h-32 p-3 text-slate-700 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
        />
        {aiReflection && (
          <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm text-purple-800 border border-purple-100 animate-in fade-in slide-in-from-top-1">
            <div className="flex gap-2">
              <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
              <p>{aiReflection}</p>
            </div>
          </div>
        )}
      </section>

      {/* Goals Section */}
      <section className="space-y-4">
        <h2 className="font-semibold text-slate-700 px-1">Daily Goals</h2>

        {goals.length === 0 && (
          <div className="text-center p-6 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-slate-400 text-sm">
              No goals set yet. Go to Settings to add some!
            </p>
          </div>
        )}

        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="font-medium text-slate-800">{goal.title}</h3>
              <p className="text-xs text-slate-500">
                {goal.type === 'check-in'
                  ? 'Check-in'
                  : `Accumulate (${goal.unit || 'units'})`}
              </p>
            </div>

            {goal.type === 'check-in' ? (
              <button
                onClick={() =>
                  handleGoalChange(goal.id, dailyGoalValues[goal.id] ? 0 : 1)
                }
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  dailyGoalValues[goal.id]
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                }`}
              >
                {dailyGoalValues[goal.id] ? (
                  <Check size={20} />
                ) : (
                  <div className="w-4 h-4 rounded-sm border-2 border-current" />
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={dailyGoalValues[goal.id] || ''}
                  onChange={(e) =>
                    handleGoalChange(goal.id, parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-20 p-2 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                />
                <span className="text-sm text-slate-400 w-8">{goal.unit}</span>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
