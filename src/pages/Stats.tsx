import React, { useMemo } from 'react';
import type { Goal } from '../types';
import { loadEntries } from '../services/storage';
import ProgressBar from '../components/ProgressBar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StatsProps {
  goals: Goal[];
  refreshTrigger: number;
}

const Stats: React.FC<StatsProps> = ({ goals, refreshTrigger }) => {
  const { entriesList, goalProgress } = useMemo(() => {
    const rawEntries = loadEntries();
    const sortedDates = Object.keys(rawEntries).sort();

    // Prepare Chart Data (Last 14 recorded days)
    const chartData = sortedDates
      .map((date) => {
        const entry = rawEntries[date];
        let bedTimeVal = null;
        let displayTime = '';

        if (entry.bedTime) {
          const d = new Date(entry.bedTime);
          const h = d.getHours();
          const m = d.getMinutes();

          // Convert to a linear scale for plotting.
          // We want 20:00 to be 20.0
          // We want 00:00 to be 24.0
          // We want 02:00 to be 26.0
          // We want 04:00 to be 28.0 (Day ends at 4AM)

          let val = h + m / 60;
          if (val < 4) {
            val += 24;
          }
          let bedTimeVal: number | null = null;
          bedTimeVal = val;
          displayTime = d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        }

        return {
          date: date.slice(5), // MM-DD
          bedTimeVal,
          displayTime,
        };
      })
      .slice(-14);

    // Prepare Goal Progress
    const progress: Record<string, number> = {};
    goals.forEach((g) => (progress[g.id] = 0));

    Object.values(rawEntries).forEach((entry) => {
      if (entry.goals) {
        Object.entries(entry.goals).forEach(([goalId, val]) => {
          if (progress[goalId] !== undefined) {
            progress[goalId] += val;
          }
        });
      }
    });

    return { entriesList: chartData, goalProgress: progress };
  }, [goals, refreshTrigger]);

  const formatYAxis = (val: number) => {
    let h = Math.floor(val);
    if (h >= 24) h -= 24;
    return `${String(h).padStart(2, '0')}:00`;
  };

  return (
    <div className="pb-24 space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Your Progress</h1>

      {/* Bedtime Chart */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Bedtime Trend
        </h2>
        <div className="h-64 w-full">
          {entriesList.length > 0 &&
          entriesList.some((e) => e.bedTimeVal !== null) ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entriesList}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[18, 30]} // Range from 6 PM to 6 AM (next day) approx
                  tickFormatter={formatYAxis}
                  allowDataOverflow={false} // Allow auto-scaling if user sleeps at 4 PM
                />
                <Tooltip
                  formatter={(_value: any, _name: string, props: any) => [
                    props.payload.displayTime || '--:--',
                    'Bedtime',
                  ]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bedTimeVal"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Not enough bedtime data yet.
            </div>
          )}
        </div>
      </section>

      {/* Goals Progress */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-slate-700 mb-6">
          Yearly Goals
        </h2>

        {goals.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-4">
            No goals defined.
          </p>
        )}

        <div className="space-y-6">
          {goals.map((goal) => (
            <ProgressBar
              key={goal.id}
              label={goal.title}
              current={goalProgress[goal.id] || 0}
              easy={goal.targetEasy}
              hard={goal.targetHard}
              insane={goal.targetInsane}
              unit={goal.unit}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Stats;
