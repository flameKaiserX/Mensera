import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  RefreshCw,
  Lock,
  Save,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { FitnessGoal } from '../../types';
import { AccountPanel } from './AccountPanel';

export const ProfileScreen: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    exportDataJSON,
    exportDataCSV,
    seedSampleData,
    clearAllData,
    openModal,
    darkMode,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [cycleLength, setCycleLength] = useState(userProfile.avgCycleLength);
  const [periodDuration, setPeriodDuration] = useState(userProfile.avgPeriodDuration);
  const [lastPeriodDate, setLastPeriodDate] = useState(userProfile.lastPeriodStartDate);
  const [isRegular, setIsRegular] = useState(userProfile.isRegular);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(userProfile.fitnessGoal);
  const [savedSettings, setSavedSettings] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const fitnessGoals: { id: FitnessGoal; label: string; icon: string }[] = [
    { id: 'strength', label: 'Build strength', icon: '🏋️' },
    { id: 'muscle', label: 'Build muscle', icon: '💪' },
    { id: 'fat-loss', label: 'Lose fat', icon: '🔥' },
    { id: 'fitness', label: 'Improve fitness', icon: '⚡' },
    { id: 'health', label: 'General health', icon: '🌿' },
    { id: 'understand-cycle', label: 'Understand cycle', icon: '✨' },
  ];

  const handleSaveSettings = () => {
    updateUserProfile({
      name: name.trim() || 'Friend',
      avgCycleLength: cycleLength,
      avgPeriodDuration: periodDuration,
      lastPeriodStartDate: lastPeriodDate,
      isRegular,
      fitnessGoal,
    });
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleWipeData = () => {
    clearAllData();
    setShowWipeConfirm(false);
    openModal('onboarding');
  };

  return (
    <div className="px-4 py-3 space-y-4 animate-fadeIn pb-8">
      <AccountPanel />

      {/* Cycle Settings Form */}
      <div className={['rounded-3xl p-5 border shadow-xs space-y-4', darkMode ? 'bg-[#241f2b] border-[#403649]' : 'bg-white border-slate-200/80'].join(' ')}>
        <div className={['flex items-center gap-2 pb-2 border-b', darkMode ? 'border-[#403649]' : 'border-slate-100'].join(' ')}>
          <Settings size={16} className="text-violet-600" />
          <h3 className={['text-sm font-bold uppercase tracking-wider', darkMode ? 'text-[#f5eff8]' : 'text-slate-800'].join(' ')}>
            Cycle Settings & Parameters
          </h3>
        </div>

        <div>
          <label className={['block text-xs font-bold mb-1', darkMode ? 'text-slate-200' : 'text-slate-700'].join(' ')}>Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={['w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-violet-500 font-semibold', darkMode ? 'bg-[#1d1823] border-[#403649] text-[#f5eff8]' : 'bg-slate-50 border-slate-200 text-slate-800'].join(' ')}
          />
        </div>

        {/* Cycle Length Slider */}
        <div>
          <div className={['flex items-center justify-between text-xs font-bold mb-1', darkMode ? 'text-slate-200' : 'text-slate-700'].join(' ')}>
            <span>Average Cycle Length</span>
            <span className="text-violet-700 font-extrabold">{cycleLength} Days</span>
          </div>
          <input
            type="range"
            min={21}
            max={40}
            value={cycleLength}
            onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
            className="w-full accent-violet-600"
          />
        </div>

        {/* Period Duration Slider */}
        <div>
          <div className={['flex items-center justify-between text-xs font-bold mb-1', darkMode ? 'text-slate-200' : 'text-slate-700'].join(' ')}>
            <span>Average Period Duration</span>
            <span className="text-rose-600 font-extrabold">{periodDuration} Days</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            value={periodDuration}
            onChange={(e) => setPeriodDuration(parseInt(e.target.value, 10))}
            className="w-full accent-rose-500"
          />
        </div>

        {/* First day of last period */}
        <div>
          <label className={['block text-xs font-bold mb-1', darkMode ? 'text-slate-200' : 'text-slate-700'].join(' ')}>
            First Day of Last Period
          </label>
          <input
            type="date"
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            className={['w-full px-3 py-2 text-xs rounded-xl border font-semibold focus:outline-hidden', darkMode ? 'bg-[#1d1823] border-[#403649] text-[#f5eff8]' : 'bg-slate-50 border-slate-200 text-slate-800'].join(' ')}
          />
        </div>

        {/* Regularity */}
        <div>
          <label className={['block text-xs font-bold mb-1.5', darkMode ? 'text-slate-200' : 'text-slate-700'].join(' ')}>Cycle Regularity</label>
          <div className="grid grid-cols-3 gap-2">
            {(['regular', 'irregular', 'not-sure'] as const).map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setIsRegular(reg)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold capitalize border transition-all ${
                  isRegular === reg
                    ? 'bg-violet-100 border-violet-500 text-violet-900 font-bold'
                    : darkMode
                      ? 'bg-[#1d1823] border-[#403649] text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {reg.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Fitness Goal Picker */}
        <div>
          <label className={['block text-xs font-bold mb-1.5', darkMode ? 'text-slate-200' : 'text-slate-700'].join(' ')}>Fitness Goal</label>
          <div className="grid grid-cols-2 gap-2">
            {fitnessGoals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFitnessGoal(g.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                  fitnessGoal === g.id
                    ? 'bg-violet-50 border-violet-500 text-violet-900 font-bold'
                    : darkMode
                      ? 'bg-[#1d1823] border-[#403649] text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span>{g.icon}</span>
                <span className="truncate">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save Settings Button */}
        <button
          onClick={handleSaveSettings}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all ${
            savedSettings
              ? 'bg-emerald-600 text-white'
              : 'bg-violet-700 text-white hover:bg-violet-800'
          }`}
        >
          {savedSettings ? (
            <>
              <Check size={14} />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Save Cycle Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Privacy Vault & Data Export/Delete Controls (Key Feature #21) */}
      <div className={['rounded-3xl p-5 border shadow-xs space-y-3.5', darkMode ? 'bg-[#241f2b] border-[#403649]' : 'bg-white border-slate-200/80'].join(' ')}>
        <div className={['flex items-center gap-2 pb-2 border-b', darkMode ? 'border-[#403649]' : 'border-slate-100'].join(' ')}>
          <Shield size={16} className="text-emerald-600" />
          <div>
            <h3 className={['text-xs font-bold uppercase tracking-wider', darkMode ? 'text-[#f5eff8]' : 'text-slate-800'].join(' ')}>
              Privacy Vault & Data Controls
            </h3>
          </div>
        </div>

        <div className={['p-3 rounded-2xl border text-xs leading-relaxed flex items-start gap-2', darkMode ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-100' : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'].join(' ')}>
          <Lock size={15} className="text-emerald-700 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Your control:</span> Guest data stays on this device. When
            you sign in, your profile and cycle logs sync to your private account.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={exportDataJSON}
            className={['w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors', darkMode ? 'bg-[#1d1823] hover:bg-[#241f2b] border-[#403649] text-slate-100' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'].join(' ')}
          >
            <Download size={14} className="text-violet-600" />
            <span>Export Complete Backup (JSON)</span>
          </button>

          <button
            onClick={exportDataCSV}
            className={['w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors', darkMode ? 'bg-[#1d1823] hover:bg-[#241f2b] border-[#403649] text-slate-100' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'].join(' ')}
          >
            <Download size={14} className="text-emerald-600" />
            <span>Export Cycle Logs (CSV for Doctor)</span>
          </button>
        </div>

        {/* Seed Sample Data vs Clear Data */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              seedSampleData();
              alert('Loaded 3 complete historical cycles of sample data!');
            }}
            className={['flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5', darkMode ? 'bg-amber-900/30 hover:bg-amber-900/45 border-amber-700 text-amber-100' : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'].join(' ')}
            title="Pre-populate with 3 realistic cycles"
          >
            <RefreshCw size={13} />
            <span>Re-seed 3 Cycles</span>
          </button>

          <button
            onClick={() => setShowWipeConfirm(true)}
            className={['py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5', darkMode ? 'bg-rose-950/40 hover:bg-rose-900/50 border-rose-700 text-rose-100' : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'].join(' ')}
          >
            <Trash2 size={13} />
            <span>Delete All</span>
          </button>
        </div>

        {/* Wipe Confirm Sub-dialog */}
        {showWipeConfirm && (
          <div className={['p-3.5 rounded-2xl border space-y-2 animate-fadeIn', darkMode ? 'bg-rose-950/30 border-rose-700 text-rose-100' : 'bg-rose-50 border-rose-300 text-rose-950'].join(' ')}>
            <p className="text-xs font-bold">Wipe all cycle logs & reset Mensera?</p>
            <p className={['text-[11px] leading-tight', darkMode ? 'text-rose-200' : 'text-rose-800'].join(' ')}>
              This completely clears your local device storage. This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleWipeData}
                className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
              >
                Yes, Wipe All Data
              </button>
              <button
                onClick={() => setShowWipeConfirm(false)}
                className={['flex-1 py-1.5 rounded-lg border text-xs font-semibold', darkMode ? 'bg-[#1d1823] border-[#403649] text-slate-100' : 'bg-white border-slate-300 text-slate-700'].join(' ')}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
