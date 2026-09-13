import React from 'react';
import { X, Award, CheckCircle2, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BadgesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { badges } = useApp();

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-white/60 flex flex-col justify-between">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Gentle Milestones & Badges
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {unlockedCount} of {badges.length} Milestones Achieved
              </p>
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
          {/* Gentle Motivation Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-50 to-rose-50 border border-violet-100 flex items-start gap-2.5">
            <Heart size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-violet-900 uppercase tracking-wider">
                Gentle Philosophy
              </span>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-medium">
                We celebrate your curiosity and body connection. You are{' '}
                <span className="font-bold text-violet-900">never penalized</span> or broken for
                missing a day. Your body is a lifelong friend, not a streak to lose.
              </p>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="space-y-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-3xl border transition-all flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-white border-violet-200 shadow-2xs'
                    : 'bg-slate-100/70 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-violet-100 to-rose-100 border border-violet-200'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {badge.emoji}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {badge.unlocked && (
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      )}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {badge.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {badge.description}
                  </p>

                  {badge.unlocked && badge.unlockedDate && (
                    <p className="text-[10px] text-violet-600 font-semibold mt-1.5">
                      Unlocked on {badge.unlockedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-[#FAF7F2]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
