import { useState, useEffect } from 'react';
import { Home, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import type { Page, Goal } from './types';
import { loadGoals, saveGoals } from './services/storage';

// Pages
import HomePage from './pages/Home';
import StatsPage from './pages/Stats';
import SettingsPage from './pages/Settings';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [goals, setGoals] = useState<Goal[]>([]);
  // Use a simple counter to force re-render of stats when data changes in Home
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const handleUpdateGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    saveGoals(newGoals);
    setDataVersion((v) => v + 1);
  };

  const handleDataChange = () => {
    setDataVersion((v) => v + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage goals={goals} onDataChange={handleDataChange} />;
      case 'stats':
        return <StatsPage goals={goals} refreshTrigger={dataVersion} />;
      case 'settings':
        return <SettingsPage goals={goals} onUpdateGoals={handleUpdateGoals} />;
      default:
        return <HomePage goals={goals} onDataChange={handleDataChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Header / Title Bar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          TriGoal Diary
        </h1>
        <div
          className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
          title="Online"
        />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 pb-safe">
        <div className="flex justify-around items-center p-3">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === 'home'
                ? 'text-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home size={24} strokeWidth={currentPage === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Diary</span>
          </button>

          <button
            onClick={() => setCurrentPage('stats')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === 'stats'
                ? 'text-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BarChart2
              size={24}
              strokeWidth={currentPage === 'stats' ? 2.5 : 2}
            />
            <span className="text-[10px] font-medium">Stats</span>
          </button>

          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === 'settings'
                ? 'text-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <SettingsIcon
              size={24}
              strokeWidth={currentPage === 'settings' ? 2.5 : 2}
            />
            <span className="text-[10px] font-medium">Goals</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
