import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Droplets } from 'lucide-react';

export const CycleWheel: React.FC = () => {
  const { currentCycle, openModal } = useApp();

  const {
    currentDay,
    cycleLength,
    periodDuration,
    daysUntilNextPeriod,
    estimatedOvulationDay,
    phaseColor,
    phaseDisplayName,
    phaseEmoji,
  } = currentCycle;

  // SVG parameters
  const size = 260;
  const strokeWidth = 18;
  const center = size / 2;
  const radius = center - strokeWidth - 6;
  const circumference = 2 * Math.PI * radius;

  // Calculate arc angles for the 4 phases
  const menstrualDays = periodDuration;
  const follicularDays = Math.max(1, estimatedOvulationDay - 2 - periodDuration);
  const ovulationDays = 3; // e.g. Day 13-15
  const lutealDays = Math.max(1, cycleLength - (estimatedOvulationDay + 1));

  // Compute stroke-dasharray and offsets
  const menstrualLength = (menstrualDays / cycleLength) * circumference;
  const follicularLength = (follicularDays / cycleLength) * circumference;
  const ovulationLength = (ovulationDays / cycleLength) * circumference;
  const lutealLength = (lutealDays / cycleLength) * circumference;

  // Current day angle (0 deg at top, clockwise)
  const currentAngleDeg = ((currentDay - 1) / cycleLength) * 360 - 90;
  const currentAngleRad = (currentAngleDeg * Math.PI) / 180;
  const indicatorX = center + radius * Math.cos(currentAngleRad);
  const indicatorY = center + radius * Math.sin(currentAngleRad);

  return (
    <div className="relative flex flex-col items-center justify-center my-2 select-none">
      {/* Interactive Circular SVG Wheel */}
      <div
        onClick={() => openModal('phases-explorer')}
        className="relative cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
        title="Tap to explore the 4 phases in depth"
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Subtle background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#F1EDE4"
            strokeWidth={strokeWidth}
          />

          {/* Phase 1: Menstrual (🩸 Rose) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#E11D48"
            strokeWidth={strokeWidth}
            strokeDasharray={`${menstrualLength - 2} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Phase 2: Follicular (🌱 Emerald) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#059669"
            strokeWidth={strokeWidth}
            strokeDasharray={`${follicularLength - 2} ${circumference}`}
            strokeDashoffset={`-${menstrualLength}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Phase 3: Ovulation (⚡ Warm Amber) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#D97706"
            strokeWidth={strokeWidth}
            strokeDasharray={`${ovulationLength - 2} ${circumference}`}
            strokeDashoffset={`-${menstrualLength + follicularLength}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Phase 4: Luteal (🌙 Deep Lavender) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#7C3AED"
            strokeWidth={strokeWidth}
            strokeDasharray={`${lutealLength - 2} ${circumference}`}
            strokeDashoffset={`-${menstrualLength + follicularLength + ovulationLength}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Current Day Pointer Glow */}
          <circle
            cx={indicatorX}
            cy={indicatorY}
            r={13}
            fill="#FFFFFF"
            className="drop-shadow-md"
          />
          <circle
            cx={indicatorX}
            cy={indicatorY}
            r={8}
            fill={phaseColor}
            className="animate-pulse"
          />
        </svg>

        {/* Center Content of Ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
          <span className="text-3xl filter drop-shadow-xs mb-0.5">{phaseEmoji}</span>
          <p className="text-2xl font-extrabold tracking-tight leading-none" style={{ color: phaseColor }}>
            {phaseDisplayName}
          </p>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
              Day {currentDay}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ {cycleLength}</span>
          </div>

          <div className="mt-2 py-0.5 px-2.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-[10px] font-semibold text-slate-600 flex items-center gap-1 shadow-2xs">
            <Droplets size={10} className="text-rose-500" />
            <span>
              {daysUntilNextPeriod === 0
                ? 'Period expected today'
                : `${daysUntilNextPeriod} days until period`}
            </span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
        <Sparkles size={11} className="text-violet-500" />
        <span>Tap the cycle wheel or phases above for deep dive guidance</span>
      </p>
    </div>
  );
};
