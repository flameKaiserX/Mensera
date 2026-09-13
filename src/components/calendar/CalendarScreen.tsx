import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Dumbbell,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateToISO, getDaysDifference, getPhaseForCycleDay } from '../../utils/cycleEngine';
import { DayDetailModal } from './DayDetailModal';

export const CalendarScreen: React.FC = () => {
  const { userProfile, getLogForDate, currentCycle } = useApp();

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());
  const [inspectingDate, setInspectingDate] = useState<string | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Adjust starting day (0 = Sunday, we want Monday = 0)
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentMonthDate(new Date());
  };

  const todayStr = formatDateToISO(new Date());

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="px-4 py-3 space-y-4 animate-fadeIn pb-6">
      {/* Calendar Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span>{monthNames[month]} {year}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cycle Length: {userProfile.avgCycleLength} days ({userProfile.isRegular})
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGoToday}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="text-[11px] font-bold text-slate-400 py-1 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty cells before first day */}
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 rounded-xl bg-transparent opacity-0" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateObj = new Date(year, month, dayNum);
            const dateStr = formatDateToISO(dateObj);
            const isToday = dateStr === todayStr;

            // Calculate cycle day relative to last period start
            const diffDays = getDaysDifference(userProfile.lastPeriodStartDate, dateStr);
            let cycleDay = (diffDays % userProfile.avgCycleLength) + 1;
            if (cycleDay <= 0) cycleDay = userProfile.avgCycleLength + cycleDay;

            const { phase } = getPhaseForCycleDay(
              cycleDay,
              userProfile.avgCycleLength,
              userProfile.avgPeriodDuration
            );

            const log = getLogForDate(dateStr);
            const hasPeriod = log?.periodFlow && log.periodFlow !== 'none';
            const hasWorkout = log?.workoutCompleted;
            const hasSymptoms = log?.symptoms && Object.keys(log.symptoms).length > 0;

            // Phase indicator border/badge colors
            const phaseBadge = {
              menstrual: { border: 'border-rose-400', bg: 'bg-rose-50/70', dot: 'bg-rose-500' },
              follicular: { border: 'border-emerald-400', bg: 'bg-emerald-50/70', dot: 'bg-emerald-500' },
              ovulation: { border: 'border-amber-400', bg: 'bg-amber-50/70', dot: 'bg-amber-500' },
              luteal: { border: 'border-violet-400', bg: 'bg-violet-50/70', dot: 'bg-violet-500' },
            }[phase];

            return (
              <button
                key={dateStr}
                onClick={() => setInspectingDate(dateStr)}
                className={`h-14 rounded-2xl p-1 flex flex-col justify-between items-center transition-all border relative group ${
                  isToday
                    ? 'ring-2 ring-violet-600 ring-offset-1 bg-white shadow-xs font-bold'
                    : phaseBadge.bg
                } ${phaseBadge.border}/50 hover:scale-[1.03] hover:shadow-sm`}
              >
                {/* Date header */}
                <div className="w-full flex items-center justify-between px-0.5">
                  <span
                    className={`text-xs font-bold leading-none ${
                      isToday ? 'text-violet-900 font-extrabold' : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 leading-none">
                    D{cycleDay}
                  </span>
                </div>

                {/* Logged Indicators */}
                <div className="flex items-center gap-0.5 my-auto">
                  {hasPeriod && (
                    <Droplets size={11} className="text-rose-600 fill-rose-500 shrink-0" />
                  )}
                  {hasWorkout && (
                    <Dumbbell size={11} className="text-violet-700 shrink-0" />
                  )}
                  {log?.energy && (
                    <span className="text-[10px] leading-none">
                      {log.energy >= 4 ? '⚡' : log.energy <= 2 ? '😴' : '🙂'}
                    </span>
                  )}
                </div>

                {/* Bottom Phase Dot */}
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${phaseBadge.dot}`} />
                  {hasSymptoms && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase Color Legend */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Menstrual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Follicular</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Ovulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
            <span>Luteal</span>
          </div>
        </div>
      </div>

      {/* Today's Quick Summary / Action */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current Day
          </span>
          <h4 className="text-sm font-bold text-slate-800">
            Cycle Day {currentCycle.currentDay} • {currentCycle.phaseDisplayName}
          </h4>
          <p className="text-xs text-slate-500">
            {currentCycle.daysUntilNextPeriod} days until next period
          </p>
        </div>

        <button
          onClick={() => setInspectingDate(todayStr)}
          className="py-2 px-3 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-xs hover:bg-violet-700 flex items-center gap-1"
        >
          <Plus size={14} />
          <span>Log Day</span>
        </button>
      </div>

      {/* Tap Day Detail Modal */}
      {inspectingDate && (
        <DayDetailModal
          dateStr={inspectingDate}
          onClose={() => setInspectingDate(null)}
        />
      )}
    </div>
  );
};
