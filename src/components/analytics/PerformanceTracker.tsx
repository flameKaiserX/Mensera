import React from 'react';
import {
  TrendingUp,
  Sparkles,
  Info,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CycleGraph } from './CycleGraph';
import { generatePatternInsights } from '../../utils/cycleEngine';

export const PerformanceTracker: React.FC = () => {
  const { logs, userProfile } = useApp();

  const insights = generatePatternInsights(logs, userProfile.avgCycleLength);

  return (
    <div className="space-y-4">
      {/* Graph Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Energy & Gym Performance Curves
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Mapped across your {userProfile.avgCycleLength}-day cycle
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
            {logs.length} Days Logged
          </span>
        </div>

        {/* The interactive SVG curve component */}
        <CycleGraph />
      </div>

      {/* "Your Cycle Patterns" Personalized Insights Panel */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Your Cycle Patterns
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Personalized observations from your logged data
              </p>
            </div>
          </div>
        </div>

        {/* Pattern Insight Cards */}
        <div className="space-y-2.5">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-violet-50/40 border border-slate-200/80 hover:border-violet-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-violet-900 uppercase tracking-wider shadow-2xs">
                  {insight.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <CheckCircle size={11} className="text-emerald-500" />
                  <span>{insight.confidence} Confidence</span>
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-800">{insight.title}</h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                “{insight.observation}”
              </p>

              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start gap-1.5 text-[11px] text-slate-600">
                <Lightbulb size={13} className="text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-800">Practical tip:</span>{' '}
                  {insight.recommendation}
                </p>
              </div>

              <p className="text-[9px] text-slate-400 mt-1 font-mono">
                Evidence: {insight.supportingData}
              </p>
            </div>
          ))}
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-2 text-[11px] leading-relaxed">
          <Info size={15} className="shrink-0 text-amber-700 mt-0.5" />
          <p>
            <span className="font-bold">Important Label:</span> These insights are patterns
            calculated exclusively from your own logged data. They reflect your unique body trends
            and are <span className="font-semibold">never medically guaranteed</span> or intended as
            a clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};
