import React from 'react';

interface ProgressBarProps {
  current: number;
  easy: number;
  hard: number;
  insane: number;
  label: string;
  unit?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  easy,
  hard,
  insane,
  label,
  unit,
}) => {
  // Calculate percentages relative to the *entire* range (0 to Insane)
  // But strictly speaking, the user wants:
  // Easy reached -> Green
  // Easy to Hard -> Orange
  // Hard to Insane -> Red

  // We will show a single bar that fills up. The COLOR changes based on the tier.

  let colorClass = 'bg-emerald-400'; // Default / Easy
  if (current >= easy && current < hard) {
    colorClass = 'bg-amber-400';
  } else if (current >= hard) {
    colorClass = 'bg-rose-500';
  }

  const percentage = Math.min((current / insane) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="font-medium text-slate-700 text-sm">{label}</span>
        <span className="text-xs text-slate-500">
          {current} / {insane} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Tier Markers */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white opacity-50"
          style={{ left: `${(easy / insane) * 100}%` }}
          title="Easy"
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white opacity-50"
          style={{ left: `${(hard / insane) * 100}%` }}
          title="Hard"
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
        <span>0</span>
        <span style={{ marginLeft: `${(easy / insane) * 100 - 10}%` }}>
          Easy
        </span>
        <span
          style={{
            marginLeft: `${(hard / insane) * 100 - (easy / insane) * 100}%`,
          }}
        >
          Hard
        </span>
        <span>Insane</span>
      </div>
    </div>
  );
};

export default ProgressBar;
