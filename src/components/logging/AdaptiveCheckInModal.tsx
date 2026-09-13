import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Dumbbell,
  CheckCircle2,
  Heart,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import type {
  AdaptiveRecommendationResult,
  EnergyLevel,
} from '../../types';

export const AdaptiveCheckInModal: React.FC = () => {
  const { currentCycle, runAdaptiveCheckIn, closeModal, todayLog } = useApp();

  const [energy, setEnergy] = useState<EnergyLevel>(todayLog?.energy || 4);
  const [pain, setPain] = useState<'none' | 'mild' | 'moderate' | 'severe'>('none');
  const [sleep, setSleep] = useState<'poor' | 'fair' | 'good' | 'great'>(
    todayLog?.sleepQuality || 'good'
  );
  const [muscleSoreness, setMuscleSoreness] = useState<
    'none' | 'mild' | 'sore' | 'very_sore'
  >('none');
  const [motivation, setMotivation] = useState<'low' | 'moderate' | 'high'>('moderate');

  const [result, setResult] = useState<AdaptiveRecommendationResult | null>(null);

  const handleSubmit = () => {
    const res = runAdaptiveCheckIn({
      energy,
      pain,
      sleep,
      muscleSoreness,
      motivation,
    });
    setResult(res);

    if (res.type === 'push') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#8B5CF6'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-white/60 flex flex-col justify-between">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Adaptive Recommendation Engine
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Day {currentCycle.currentDay} • {currentCycle.phaseDisplayName}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1">
          {!result ? (
            <>
              {/* Question 1: Energy */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">1. How is your energy right now?</label>
                  <span className="text-xs font-bold text-violet-700">
                    {energy === 1 ? '😴 Very Low' : energy === 2 ? '🔋 Low' : energy === 3 ? '🙂 Normal' : energy === 4 ? '⚡ High' : '🔥 Very High'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { val: 1, label: '😴', sub: 'Very Low' },
                    { val: 2, label: '🔋', sub: 'Low' },
                    { val: 3, label: '🙂', sub: 'Normal' },
                    { val: 4, label: '⚡', sub: 'High' },
                    { val: 5, label: '🔥', sub: 'Peak' },
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      type="button"
                      onClick={() => setEnergy(lvl.val as EnergyLevel)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        energy === lvl.val
                          ? 'bg-violet-100 border-violet-500 text-violet-900 font-bold scale-[1.02] shadow-xs'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-base block">{lvl.label}</span>
                      <span className="text-[9px] block leading-tight">{lvl.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Pain / Cramps */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  2. Any pain or uterine cramps?
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'None', emoji: '✨' },
                    { id: 'mild', label: 'Mild', emoji: '🌿' },
                    { id: 'moderate', label: 'Moderate', emoji: '🩹' },
                    { id: 'severe', label: 'Severe', emoji: '🚨' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPain(p.id as any)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        pain === p.id
                          ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm block">{p.emoji}</span>
                      <span className="text-[11px] block mt-0.5 capitalize">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Sleep Quality */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  3. How did you sleep last night?
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'poor', label: 'Poor', emoji: '🥱' },
                    { id: 'fair', label: 'Fair', emoji: '😐' },
                    { id: 'good', label: 'Good', emoji: '😴' },
                    { id: 'great', label: 'Great', emoji: '🌟' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSleep(s.id as any)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        sleep === s.id
                          ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm block">{s.emoji}</span>
                      <span className="text-[11px] block mt-0.5 capitalize">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Muscle Soreness */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  4. Muscle soreness from previous workouts?
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'Fresh' },
                    { id: 'mild', label: 'Mild DOMS' },
                    { id: 'sore', label: 'Noticeably Sore' },
                    { id: 'very_sore', label: 'Very Sore' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMuscleSoreness(m.id as any)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        muscleSoreness === m.id
                          ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] block leading-tight font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5: Mental Motivation */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  5. Motivation to exercise today?
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'low', label: 'Low', desc: 'Need ease' },
                    { id: 'moderate', label: 'Moderate', desc: 'Ready for steady' },
                    { id: 'high', label: 'High', desc: 'Fired up' },
                  ].map((mv) => (
                    <button
                      key={mv.id}
                      type="button"
                      onClick={() => setMotivation(mv.id as any)}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        motivation === mv.id
                          ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs block font-bold capitalize">{mv.label}</span>
                      <span className="text-[9px] block text-slate-500 mt-0.5">{mv.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Philosophy Notice */}
              <div className="p-3 rounded-2xl bg-violet-50/80 border border-violet-200/70 flex items-start gap-2 text-[11px] text-violet-950">
                <Info size={14} className="text-violet-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold">Core Principle:</span> The phase is a guide, not a
                  rigid rule. Your symptoms and how you actually feel come first.
                </p>
              </div>
            </>
          ) : (
            /* DYNAMIC RECOMMENDATION RESULT VIEW */
            <div className="space-y-4 animate-fadeIn">
              {/* Main Badge Card */}
              <div className={`p-5 rounded-3xl border text-center ${result.badgeColor}`}>
                <span className="text-4xl block mb-1">{result.emoji}</span>
                <h3 className="text-xl font-extrabold tracking-tight">{result.title}</h3>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-white/80 text-slate-800 text-xs font-bold border border-current/20">
                  Target: {result.targetIntensity}
                </span>
                <p className="text-xs text-slate-700 mt-3 leading-relaxed font-medium">
                  {result.summary}
                </p>
              </div>

              {/* Rationale */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Why this recommendation?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{result.rationale}</p>
              </div>

              {/* Suggested Activities */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Dumbbell size={14} className="text-violet-600" />
                  <span>Suggested Activities for Today:</span>
                </h4>
                <div className="space-y-1.5">
                  {result.suggestedActivities.map((act, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mindset Quote */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-50 to-rose-50 border border-violet-100 flex items-start gap-2.5">
                <Heart size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-violet-900 uppercase tracking-wider">
                    Today’s Thought
                  </span>
                  <p className="text-xs font-semibold text-slate-800 italic mt-0.5">
                    {result.mindsetQuote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-slate-200/80 bg-[#FAF7F2]">
          {!result ? (
            <button
              onClick={handleSubmit}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-rose-500 text-white font-bold text-sm shadow-md hover:opacity-95 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Get My Recommendation</span>
            </button>
          ) : (
            <button
              onClick={closeModal}
              className="w-full py-3 px-4 rounded-2xl bg-violet-700 text-white font-bold text-sm shadow-md hover:bg-violet-800 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Got it, apply to today!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
