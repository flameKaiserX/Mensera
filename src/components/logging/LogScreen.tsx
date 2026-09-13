import React, { useState } from 'react';
import {
  BatteryCharging,
  Dumbbell,
  Droplets,
  Heart,
  Save,
  Check,
  Sparkles,
  Calendar,
  Activity,
  Flame,
  Bed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type {
  EnergyLevel,
  GymPerformance,
  SymptomKey,
  SymptomSeverity,
} from '../../types';
import { formatDateToISO, getDaysDifference, getPhaseForCycleDay } from '../../utils/cycleEngine';
import { PerformanceTracker } from '../analytics/PerformanceTracker';

const SYMPTOMS_LIST: { key: SymptomKey; label: string; icon: string }[] = [
  { key: 'cramps', label: 'Cramps', icon: '⚡' },
  { key: 'headache', label: 'Headache', icon: '🤕' },
  { key: 'bloating', label: 'Bloating', icon: '🎈' },
  { key: 'fatigue', label: 'Fatigue', icon: '😴' },
  { key: 'moodSwings', label: 'Mood Shifts', icon: '🎭' },
  { key: 'breastTenderness', label: 'Tenderness', icon: '🌸' },
  { key: 'foodCravings', label: 'Cravings', icon: '🍫' },
  { key: 'backPain', label: 'Back Pain', icon: '🩹' },
  { key: 'sleepChanges', label: 'Sleep Changes', icon: '🌙' },
  { key: 'acne', label: 'Acne', icon: '✨' },
  { key: 'digestive', label: 'Digestion', icon: '🍵' },
];

export const LogScreen: React.FC = () => {
  const { userProfile, getLogForDate, saveDayLog, openModal, todayRecommendation } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'log' | 'trends'>('log');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() =>
    formatDateToISO(new Date())
  );

  // Calculate cycle day for selected date
  const diffDays = getDaysDifference(userProfile.lastPeriodStartDate, selectedDateStr);
  let cycleDay = (diffDays % userProfile.avgCycleLength) + 1;
  if (cycleDay <= 0) cycleDay = userProfile.avgCycleLength + cycleDay;

  const { phase } = getPhaseForCycleDay(
    cycleDay,
    userProfile.avgCycleLength,
    userProfile.avgPeriodDuration
  );

  const existingLog = getLogForDate(selectedDateStr);

  const [periodFlow, setPeriodFlow] = useState<any>(existingLog?.periodFlow || 'none');
  const [energy, setEnergy] = useState<EnergyLevel | undefined>(existingLog?.energy || 3);
  const [gymPerformance, setGymPerformance] = useState<GymPerformance | undefined>(
    existingLog?.gymPerformance || 3
  );
  const [symptoms, setSymptoms] = useState<Partial<Record<SymptomKey, SymptomSeverity>>>(
    existingLog?.symptoms || {}
  );
  const sleepHours = existingLog?.sleepHours || 7.5;
  const [sleepQuality, setSleepQuality] = useState<any>(existingLog?.sleepQuality || 'good');
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(
    existingLog?.workoutCompleted ?? true
  );
  const [workoutType, setWorkoutType] = useState<string>(
    existingLog?.workoutType || 'Strength & Core'
  );
  const [workoutIntensity, setWorkoutIntensity] = useState<any>(
    existingLog?.workoutIntensity || 'moderate'
  );
  const [saved, setSaved] = useState(false);

  const toggleSymptom = (key: SymptomKey) => {
    setSymptoms((prev) => {
      const copy = { ...prev };
      if (!copy[key]) {
        copy[key] = 'mild';
      } else if (copy[key] === 'mild') {
        copy[key] = 'moderate';
      } else if (copy[key] === 'moderate') {
        copy[key] = 'severe';
      } else {
        delete copy[key];
      }
      return copy;
    });
  };

  const handleSave = () => {
    saveDayLog({
      date: selectedDateStr,
      cycleDay,
      periodFlow,
      energy,
      gymPerformance,
      symptoms,
      sleepHours,
      sleepQuality,
      workoutCompleted,
      workoutType,
      workoutIntensity,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 py-3 space-y-4 animate-fadeIn pb-6">
      {/* Sub-Tabs: Daily Log vs Performance Trends */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('log')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'log'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Check-in
        </button>
        <button
          onClick={() => setActiveSubTab('trends')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'trends'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity size={14} className="text-violet-600" />
          <span>Performance & Patterns</span>
        </button>
      </div>

      {activeSubTab === 'trends' ? (
        <PerformanceTracker />
      ) : (
        <>
          {/* Adaptive Check-in Hero Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-violet-900 to-indigo-900 text-white flex items-center justify-between shadow-md">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                <Sparkles size={14} />
                <span>Today's Recommendation</span>
              </div>
              <h3 className="text-lg font-extrabold mt-0.5 leading-tight">
                {todayRecommendation.emoji} {todayRecommendation.title}
              </h3>
              <p className="text-[11px] text-indigo-200 mt-0.5 line-clamp-1">
                {todayRecommendation.summary}
              </p>
            </div>
            <button
              onClick={() => openModal('adaptive-checkin')}
              className="py-2 px-3 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-100 shrink-0"
            >
              Evaluate
            </button>
          </div>

          {/* Date Selector & Day Context */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
                <Calendar size={16} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Log Date
                </label>
                <input
                  type="date"
                  value={selectedDateStr}
                  onChange={(e) => setSelectedDateStr(e.target.value)}
                  max={formatDateToISO(new Date())}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200 capitalize">
              Cycle Day {cycleDay} • {phase}
            </span>
          </div>

          {/* 1. Period Flow Tracker */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
            <label className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
              <Droplets size={14} className="text-rose-500" />
              <span>Menstrual Bleeding / Flow</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['none', 'spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                <button
                  key={flow}
                  type="button"
                  onClick={() => setPeriodFlow(flow)}
                  className={`py-2 text-center rounded-xl text-xs font-semibold capitalize transition-all ${
                    periodFlow === flow
                      ? 'bg-rose-500 text-white shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Daily Energy Rating (Key Feature #8) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BatteryCharging size={14} className="text-amber-500" />
                <span>Rate Daily Energy</span>
              </label>
              <span className="text-xs font-bold text-amber-600">
                {energy === 1
                  ? '😴 Very Low'
                  : energy === 2
                  ? '🔋 Low'
                  : energy === 3
                  ? '🙂 Normal'
                  : energy === 4
                  ? '⚡ High'
                  : '🔥 Very High'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { val: 1, label: '😴', sub: 'Very Low' },
                { val: 2, label: '🔋', sub: 'Low' },
                { val: 3, label: '🙂', sub: 'Normal' },
                { val: 4, label: '⚡', sub: 'High' },
                { val: 5, label: '🔥', sub: 'Very High' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setEnergy(item.val as EnergyLevel)}
                  className={`py-2 px-1 text-center rounded-xl border transition-all ${
                    energy === item.val
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg block">{item.label}</span>
                  <span className="text-[10px] block font-medium mt-0.5">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Gym Performance Rating (Key Feature #8) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Dumbbell size={14} className="text-violet-600" />
                <span>Rate Gym Performance</span>
              </label>
              <span className="text-xs font-bold text-violet-700">
                {gymPerformance === 1
                  ? 'Much Weaker'
                  : gymPerformance === 2
                  ? 'Slightly Weaker'
                  : gymPerformance === 3
                  ? 'Normal'
                  : gymPerformance === 4
                  ? 'Strong'
                  : 'Stronger Than Usual'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { val: 1, label: 'Much Weaker' },
                { val: 2, label: 'Slightly Weaker' },
                { val: 3, label: 'Normal' },
                { val: 4, label: 'Strong' },
                { val: 5, label: 'Stronger Than Usual' },
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  type="button"
                  onClick={() => setGymPerformance(lvl.val as GymPerformance)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    gymPerformance === lvl.val
                      ? 'bg-violet-600 border-violet-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 text-xs'
                  }`}
                >
                  <span className="text-[10px] font-semibold block leading-tight">
                    {lvl.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Symptoms Tracker (Key Feature #13) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500" />
                <span>Symptoms Check</span>
              </label>
              <span className="text-[10px] text-slate-400">Tap to cycle severity</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SYMPTOMS_LIST.map((opt) => {
                const severity = symptoms[opt.key];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleSymptom(opt.key)}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                      severity === 'severe'
                        ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                        : severity === 'moderate'
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                        : severity === 'mild'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs flex items-center gap-1">
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </span>
                    {severity && (
                      <span className="text-[9px] uppercase font-extrabold px-1 rounded-sm bg-white/80">
                        {severity[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Workout Activity & Sleep Log */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Flame size={14} className="text-rose-500" />
                <span>Workout Log</span>
              </label>
              <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={workoutCompleted}
                  onChange={(e) => setWorkoutCompleted(e.target.checked)}
                  className="rounded-sm accent-violet-600"
                />
                <span className="font-semibold">Completed workout</span>
              </label>
            </div>

            {workoutCompleted && (
              <div className="space-y-2 pt-1 border-t border-slate-100 animate-fadeIn">
                <input
                  type="text"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  placeholder="Workout type (e.g. Leg Day, 5km Run, Pilates)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Intensity:</span>
                  {(['light', 'moderate', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setWorkoutIntensity(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                        workoutIntensity === lvl
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sleep Rating */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Bed size={14} className="text-blue-500" />
                <span>Sleep:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['poor', 'fair', 'good', 'great'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSleepQuality(s)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize ${
                      sleepQuality === s
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Save Button */}
          <button
            onClick={handleSave}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-violet-600 to-rose-500 text-white hover:opacity-95'
            }`}
          >
            {saved ? (
              <>
                <Check size={18} />
                <span>Daily Check-in Saved!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Today's Check-in</span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};
