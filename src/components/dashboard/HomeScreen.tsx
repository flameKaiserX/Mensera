import React from 'react';
import {
  Flame,
  BatteryCharging,
  BedDouble,
  Lightbulb,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Activity,
  Apple,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CycleWheel } from './CycleWheel';
import { DailyActionCard } from './DailyActionCard';
import { FUN_FACTS } from '../../data/funFactsData';

export const HomeScreen: React.FC = () => {
  const { currentCycle, todayRecommendation, openModal, setActiveTab } = useApp();

  // Pick a relevant fun fact (e.g. based on cycle day)
  const funFact = FUN_FACTS[(currentCycle.currentDay - 1) % FUN_FACTS.length] || FUN_FACTS[0];

  return (
    <div className="px-4 py-3 space-y-4 animate-fadeIn pb-6">
      {/* Top Welcome & Where Am I In My Cycle Banner */}
      <div className="glass-card rounded-3xl p-5 border border-white/80 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-40"
          style={{ backgroundColor: currentCycle.phaseColor }}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Where am I in my cycle?
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs"
            style={{
              backgroundColor: currentCycle.phaseLightColor,
              color: currentCycle.phaseColor,
              borderColor: `${currentCycle.phaseColor}30`,
            }}
          >
            {currentCycle.phaseDisplayName}
          </span>
        </div>

        {/* Circular Wheel Visualization */}
        <CycleWheel />

        {/* Quick Phase Subtitle */}
        <p className="text-xs text-center text-slate-600 font-medium px-4 mt-1">
          {currentCycle.energyForecast}
        </p>
      </div>

      {/* Adaptive Check-In Hero Card ("How are you feeling today?") */}
      <div className="bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
              <Sparkles size={14} />
              <span>Adaptive Engine</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
              Personalized
            </span>
          </div>

          <h3 className="text-2xl font-extrabold mt-1 tracking-tight leading-tight">
            How are you feeling today?
          </h3>
          <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
            The phase is a guide, not a rule. Tell us your energy, soreness, and symptoms to tune
            today’s training.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => openModal('adaptive-checkin')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 text-white font-bold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5"
            >
              <span>Quick Check-in (30s)</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => setActiveTab('log')}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20"
            >
              Log Details
            </button>
          </div>
        </div>
      </div>

      {/* Today's 3 Key Guidance Badges: Energy, Workout Intensity, Recovery */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Energy Card */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <BatteryCharging size={12} className="text-amber-500" />
            <span>Energy</span>
          </div>
          <div className="my-1.5">
            <span className="text-xs font-bold text-slate-800 leading-tight block">
              {currentCycle.currentPhase === 'menstrual'
                ? 'Gently Rebuilding'
                : currentCycle.currentPhase === 'follicular'
                ? 'Rising & Crisp'
                : currentCycle.currentPhase === 'ovulation'
                ? 'High Potential'
                : currentCycle.subPhase === 'late-luteal'
                ? 'Lower / Winding'
                : 'Steady Stamina'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium line-clamp-2">
            {todayRecommendation.type === 'push'
              ? 'Prime for effort'
              : todayRecommendation.type === 'recovery'
              ? 'Conserve reserves'
              : 'Consistent rhythm'}
          </span>
        </div>

        {/* Workout Card */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Flame size={12} className="text-rose-500" />
            <span>Workout</span>
          </div>
          <div className="my-1.5">
            <span className="text-xs font-bold text-slate-800 leading-tight block">
              {todayRecommendation.title}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium line-clamp-2">
            {todayRecommendation.targetIntensity}
          </span>
        </div>

        {/* Recovery Card */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <BedDouble size={12} className="text-violet-500" />
            <span>Recovery</span>
          </div>
          <div className="my-1.5">
            <span className="text-xs font-bold text-slate-800 leading-tight block">
              {currentCycle.currentPhase === 'menstrual'
                ? 'Warmth & Sleep'
                : currentCycle.currentPhase === 'follicular'
                ? 'Fast Muscle Repair'
                : currentCycle.currentPhase === 'ovulation'
                ? 'Joint Mobility'
                : 'Hydration & Cool Room'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium line-clamp-2">
            Prioritize sleep
          </span>
        </div>
      </div>

      {/* "What Should I Do Today?" Section Card */}
      <DailyActionCard />

      {/* Fun Fact / Did You Know? Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl p-4 border border-amber-200/70 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-2xl bg-amber-200/70 text-amber-800 shrink-0">
            <Lightbulb size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                Did You Know? • {funFact.category}
              </span>
              <button
                onClick={() => openModal('facts-browser')}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-0.5"
              >
                <span>More</span>
                <ArrowRight size={11} />
              </button>
            </div>
            <h4 className="text-xs font-bold text-slate-800 mt-1">{funFact.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{funFact.fact}</p>
            <p className="text-[10px] text-amber-800/80 font-medium mt-1.5 italic">
              Source: {funFact.source}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards: 4 Phases Explorer & Phase Nutrition */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => openModal('phases-explorer')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-left shadow-2xs transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Activity size={18} />
          </div>
          <h4 className="text-xs font-bold text-slate-800">4 Cycle Phases</h4>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            Explore biology, energy shifts & workout guides.
          </p>
        </button>

        <button
          onClick={() => openModal('nutrition-guide')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-left shadow-2xs transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Apple size={18} />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Phase Nutrition</h4>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            Balanced meal ideas without restrictive diets.
          </p>
        </button>
      </div>

      {/* Mindset Anchor Message */}
      <div className="p-3 rounded-2xl bg-white/70 border border-violet-100 text-center">
        <p className="text-xs font-medium text-slate-700 italic flex items-center justify-center gap-1.5">
          <HeartHandshake size={14} className="text-rose-500 shrink-0" />
          <span>“Your body isn’t working against you. Learn how it works and work with it.”</span>
        </p>
      </div>
    </div>
  );
};
