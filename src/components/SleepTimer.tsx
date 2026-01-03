import React from 'react';
import { Moon, Clock } from 'lucide-react';

interface SleepTimerProps {
  currentDate: string; // The diary date currently being viewed
  bedTime?: string; // ISO string
  onUpdateBedTime: (isoDateString: string) => void;
  isToday: boolean; // Whether currentDate is the "current active diary day"
}

const SleepTimer: React.FC<SleepTimerProps> = ({
  currentDate,
  bedTime,
  onUpdateBedTime,
  isToday,
}) => {
  const handleSleepNow = () => {
    const now = new Date();
    onUpdateBedTime(now.toISOString());
  };

  const handleManualTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value; // "HH:MM"
    if (!timeStr) return;

    const [hours, minutes] = timeStr.split(':').map(Number);

    // Construct the full date object based on the "Diary Date" logic.
    // If the time chosen is 00:00 - 03:59, it technically belongs to the *next* calendar day
    // relative to the diary date (which usually tracks the day *before* the sleep).
    // OR if the user considers 2AM part of "Jan 1st", then physically it is Jan 2nd.

    const d = new Date(currentDate); // This is YYYY-MM-DD at 00:00 UTC usually, or local.
    // Let's assume currentDate is local YYYY-MM-DD.

    d.setHours(hours);
    d.setMinutes(minutes);

    // Adjustment:
    // If diary date is Jan 1st.
    // User selects 23:00 -> Jan 1st 23:00.
    // User selects 02:00 -> Jan 2nd 02:00.
    if (hours < 4) {
      d.setDate(d.getDate() + 1);
    }

    onUpdateBedTime(d.toISOString());
  };

  // Helper to display time for input value
  const getDisplayTime = (isoString?: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  // Helper for UI display
  const formatTimeUI = (isoString?: string) => {
    if (!isoString) return 'Not recorded';
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 rounded-xl shadow-sm bg-indigo-900 text-white transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-indigo-100 flex items-center gap-2">
            <Moon size={18} /> Bedtime
          </h3>
          <p className="text-2xl font-mono mt-1 font-bold">
            {formatTimeUI(bedTime)}
          </p>
        </div>

        {isToday && (
          <button
            onClick={handleSleepNow}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-semibold shadow-lg active:scale-95 transition-all"
          >
            Sleep Now
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-indigo-800/50">
        <Clock size={14} className="text-indigo-300" />
        <label className="text-xs text-indigo-300">Edit time:</label>
        <input
          type="time"
          value={getDisplayTime(bedTime)}
          onChange={handleManualTimeChange}
          className="bg-indigo-800/50 text-white text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-400 border border-transparent"
        />
      </div>
      <p className="text-[10px] text-indigo-400 mt-2 text-right opacity-70">
        *Day ends at 4:00 AM
      </p>
    </div>
  );
};

export default SleepTimer;
