import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  BatteryCharging,
  Dumbbell,
  Droplets,
  Heart,
  Save,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type {
  EnergyLevel,
  GymPerformance,
  SymptomKey,
  SymptomSeverity,
} from '../../types';
import { getPhaseForCycleDay, getDaysDifference } from '../../utils/cycleEngine';

interface DayDetailModalProps {
  dateStr: string;
  onClose: () => void;
}

const SYMPTOM_OPTIONS: { key: SymptomKey; label: string; icon: string }[] = [
  { key: 'cramps', label: 'Cramps', icon: '⚡' },
  { key: 'bloating', label: 'Bloating', icon: '🎈' },
  { key: 'headache', label: 'Headache', icon: '🤕' },
  { key: 'fatigue', label: 'Fatigue', icon: '😴' },
  { key: 'moodSwings', label: 'Mood Shifts', icon: '🎭' },
  { key: 'breastTenderness', label: 'Tenderness', icon: '🌸' },
  { key: 'foodCravings', label: 'Cravings', icon: '🍫' },
  { key: 'backPain', label: 'Back Pain', icon: '🩹' },
  { key: 'sleepChanges', label: 'Sleep Issues', icon: '🌙' },
  { key: 'acne', label: 'Acne', icon: '✨' },
  { key: 'digestive', label: 'Digestion', icon: '🍵' },
];

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ dateStr, onClose }) => {
  const { userProfile, getLogForDate, saveDayLog } = useApp();

  // Determine cycle day and phase for this date
  const diffDays = getDaysDifference(userProfile.lastPeriodStartDate, dateStr);
  let cycleDay = (diffDays % userProfile.avgCycleLength) + 1;
  if (cycleDay <= 0) cycleDay = userProfile.avgCycleLength + cycleDay;

  const { phase, subPhase } = getPhaseForCycleDay(
    cycleDay,
    userProfile.avgCycleLength,
    userProfile.avgPeriodDuration
  );

  const existingLog = getLogForDate(dateStr);

  const [periodFlow, setPeriodFlow] = useState<any>(existingLog?.periodFlow || 'none');
  const [energy, setEnergy] = useState<EnergyLevel | undefined>(existingLog?.energy);
  const [gymPerformance, setGymPerformance] = useState<GymPerformance | undefined>(
    existingLog?.gymPerformance
  );
  const [symptoms, setSymptoms] = useState<Partial<Record<SymptomKey, SymptomSeverity>>>(
    existingLog?.symptoms || {}
  );
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(
    existingLog?.workoutCompleted ?? false
  );
  const [workoutType, setWorkoutType] = useState<string>(existingLog?.workoutType || '');
  const [workoutIntensity, setWorkoutIntensity] = useState<any>(
    existingLog?.workoutIntensity || 'moderate'
  );
  const sleepQuality = existingLog?.sleepQuality || 'good';
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      date: dateStr,
      cycleDay,
      periodFlow,
      energy,
      gymPerformance,
      symptoms,
      workoutCompleted,
      workoutType,
      workoutIntensity,
      sleepQuality,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const phaseColors = {
    menstrual: { name: 'Menstrual Phase 🩸', color: '#E11D48', bg: '#FFE4E6' },
    follicular: { name: 'Follicular Phase 🌱', color: '#059669', bg: '#D1FAE5' },
    ovulation: { name: 'Ovulation Phase ⚡', color: '#D97706', bg: '#FEF3C7' },
    luteal: {
      name: subPhase === 'late-luteal' ? 'Late Luteal / PMS 🌙' : 'Early Luteal Phase ✨',
      color: '#7C3AED',
      bg: '#EDE9FE',
    },
  }[phase];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-white/60 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <CalendarIcon size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                {dateStr}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-bold text-slate-700">Day {cycleDay}</span>
                <span className="text-slate-300">•</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: phaseColors.bg, color: phaseColors.color }}
                >
                  {phaseColors.name}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1">
          {/* Period Flow Selector */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
            <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Droplets size={14} className="text-rose-500" />
              <span>Period Flow</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['none', 'spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                <button
                  key={flow}
                  type="button"
                  onClick={() => setPeriodFlow(flow)}
                  className={`py-1.5 text-center rounded-xl text-xs font-semibold capitalize transition-all ${
                    periodFlow === flow
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Energy Rating */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BatteryCharging size={14} className="text-amber-500" />
                <span>Daily Energy</span>
              </label>
              <span className="text-xs font-extrabold text-amber-600">
                {energy === 1
                  ? '😴 Very Low'
                  : energy === 2
                  ? '🔋 Low'
                  : energy === 3
                  ? '🙂 Normal'
                  : energy === 4
                  ? '⚡ High'
                  : energy === 5
                  ? '🔥 Very High'
                  : 'Not rated'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { val: 1, label: '😴', sub: 'Very Low' },
                { val: 2, label: '🔋', sub: 'Low' },
                { val: 3, label: '🙂', sub: 'Normal' },
                { val: 4, label: '⚡', sub: 'High' },
                { val: 5, label: '🔥', sub: 'Peak' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setEnergy(item.val as EnergyLevel)}
                  className={`py-2 px-1 text-center rounded-xl border transition-all ${
                    energy === item.val
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold scale-[1.02] shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base block">{item.label}</span>
                  <span className="text-[9px] block mt-0.5 leading-none">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gym Performance Rating */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Dumbbell size={14} className="text-rose-500" />
                <span>Gym Performance</span>
              </label>
              <span className="text-xs font-extrabold text-violet-700">
                {gymPerformance === 1
                  ? 'Much Weaker'
                  : gymPerformance === 2
                  ? 'Slightly Weaker'
                  : gymPerformance === 3
                  ? 'Normal'
                  : gymPerformance === 4
                  ? 'Strong'
                  : gymPerformance === 5
                  ? 'Stronger Than Usual'
                  : 'Not logged'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center">
              {[
                { val: 1, label: '-2', sub: 'Much Weaker' },
                { val: 2, label: '-1', sub: 'Slightly' },
                { val: 3, label: '0', sub: 'Normal' },
                { val: 4, label: '+1', sub: 'Strong' },
                { val: 5, label: '+2', sub: 'Stronger' },
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  type="button"
                  onClick={() => setGymPerformance(lvl.val as GymPerformance)}
                  className={`py-1.5 px-1 rounded-xl border text-[11px] font-semibold transition-all ${
                    gymPerformance === lvl.val
                      ? 'bg-violet-600 border-violet-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold block">{lvl.label}</span>
                  <span className="text-[9px] block leading-tight">{lvl.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500" />
                <span>Symptoms Logged</span>
              </label>
              <span className="text-[10px] text-slate-400">Tap to cycle: Mild → Mod → Severe</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SYMPTOM_OPTIONS.map((opt) => {
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
                        : 'bg-slate-50/70 border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs flex items-center gap-1">
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </span>
                    {severity && (
                      <span className="text-[9px] uppercase font-extrabold px-1 rounded-sm bg-white/70">
                        {severity[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workout Log & Sleep */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Dumbbell size={14} className="text-emerald-600" />
                <span>Did you train today?</span>
              </label>
              <input
                type="checkbox"
                checked={workoutCompleted}
                onChange={(e) => setWorkoutCompleted(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-violet-600"
              />
            </div>

            {workoutCompleted && (
              <div className="space-y-2 pt-1 border-t border-slate-100 animate-fadeIn">
                <input
                  type="text"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  placeholder="Workout details (e.g. Squats 4x6, 30m Walk)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />

                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-500">Intensity:</span>
                  {(['light', 'moderate', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setWorkoutIntensity(lvl)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize ${
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
          </div>
        </div>

        {/* Footer Save Button */}
        <div className="p-4 border-t border-slate-200/80 bg-[#FAF7F2]">
          <button
            onClick={handleSave}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-violet-600 to-rose-500 text-white hover:opacity-95'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check size={18} />
                <span>Logged Successfully!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Log for Day {cycleDay}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
