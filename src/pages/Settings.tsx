import React, { useState } from 'react';
import type { Goal, GoalType } from '../types';
import { Trash2, Plus, Target } from 'lucide-react';

interface SettingsProps {
  goals: Goal[];
  onUpdateGoals: (goals: Goal[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ goals, onUpdateGoals }) => {
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<GoalType>('check-in');
  const [targetEasy, setTargetEasy] = useState(10);
  const [targetHard, setTargetHard] = useState(50);
  const [targetInsane, setTargetInsane] = useState(100);
  const [unit, setUnit] = useState('');

  const handleAdd = () => {
    if (!title) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      type,
      targetEasy,
      targetHard,
      targetInsane,
      unit: type === 'accumulation' ? unit : undefined,
    };

    onUpdateGoals([...goals, newGoal]);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        'Delete this goal? Logged data will remain but the progress bar will disappear.'
      )
    ) {
      onUpdateGoals(goals.filter((g) => g.id !== id));
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setTitle('');
    setType('check-in');
    setTargetEasy(10);
    setTargetHard(50);
    setTargetInsane(100);
    setUnit('');
  };

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Manage Goals</h1>

      {/* List */}
      <div className="space-y-4 mb-8">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-slate-800">{goal.title}</h3>
              <p className="text-xs text-slate-500">
                {goal.type === 'check-in' ? 'Check-in' : 'Accumulation'} •
                Insane Goal: {goal.targetInsane} {goal.unit}
              </p>
            </div>
            <button
              onClick={() => handleDelete(goal.id)}
              className="p-2 text-red-400 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center gap-2 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
        >
          <Plus size={20} />
          Add New Goal
        </button>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Target size={18} className="text-indigo-500" /> New Goal
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Goal Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-400"
                placeholder="e.g., Read Books"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Type
              </label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setType('check-in')}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all ${
                    type === 'check-in'
                      ? 'bg-white shadow text-indigo-600 font-medium'
                      : 'text-slate-500'
                  }`}
                >
                  Check-in (Daily)
                </button>
                <button
                  onClick={() => setType('accumulation')}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all ${
                    type === 'accumulation'
                      ? 'bg-white shadow text-indigo-600 font-medium'
                      : 'text-slate-500'
                  }`}
                >
                  Accumulation (Count)
                </button>
              </div>
            </div>

            {type === 'accumulation' && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Unit
                </label>
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-400"
                  placeholder="e.g., words, pages, km"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-emerald-600 mb-1">
                  Easy Target
                </label>
                <input
                  type="number"
                  value={targetEasy}
                  onChange={(e) => setTargetEasy(Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-emerald-400 text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-500 mb-1">
                  Hard Target
                </label>
                <input
                  type="number"
                  value={targetHard}
                  onChange={(e) => setTargetHard(Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-amber-400 text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-rose-500 mb-1">
                  Insane Target
                </label>
                <input
                  type="number"
                  value={targetInsane}
                  onChange={(e) => setTargetInsane(Number(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-rose-400 text-center"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 py-2 text-slate-500 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
