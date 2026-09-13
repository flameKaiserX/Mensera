import React, { useState } from 'react';
import {
  Heart,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import type { FitnessGoal } from '../../types';
import { formatDateToISO } from '../../utils/cycleEngine';

export const OnboardingModal: React.FC = () => {
  const { userProfile, updateUserProfile, seedSampleData, closeModal } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(userProfile.name || '');
  const [age, setAge] = useState<string>(userProfile.age ? String(userProfile.age) : '');
  const [cycleLength, setCycleLength] = useState<number>(userProfile.avgCycleLength || 29);
  const [periodDuration, setPeriodDuration] = useState<number>(userProfile.avgPeriodDuration || 5);
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(
    userProfile.lastPeriodStartDate || formatDateToISO(new Date())
  );
  const [isRegular, setIsRegular] = useState<'regular' | 'irregular' | 'not-sure'>(
    userProfile.isRegular || 'regular'
  );
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(
    userProfile.fitnessGoal || 'strength'
  );
  const [loadSampleData, setLoadSampleData] = useState<boolean>(true);

  const totalSteps = 5;

  const fitnessGoals: { id: FitnessGoal; label: string; icon: string; desc: string }[] = [
    {
      id: 'strength',
      label: 'Build strength',
      icon: '🏋️',
      desc: 'Lift heavier with progressive overload aligned with estrogen cycles.',
    },
    {
      id: 'muscle',
      label: 'Build muscle',
      icon: '💪',
      desc: 'Optimize hypertrophy and recovery windows across the month.',
    },
    {
      id: 'fat-loss',
      label: 'Lose fat',
      icon: '🔥',
      desc: 'Sustainable fat loss without aggressive dieting during high-stress phases.',
    },
    {
      id: 'fitness',
      label: 'Improve fitness',
      icon: '⚡',
      desc: 'Enhance cardiovascular endurance and athletic conditioning.',
    },
    {
      id: 'health',
      label: 'General health',
      icon: '🌿',
      desc: 'Balanced movement, vital energy, and daily well-being.',
    },
    {
      id: 'understand-cycle',
      label: 'Just understand my cycle',
      icon: '✨',
      desc: 'Learn the 4 phases and listen to biological signals without pressure.',
    },
  ];

  const handleFinish = () => {
    if (!name.trim()) {
      setStep(2);
      return;
    }

    updateUserProfile({
      name: name.trim(),
      age: age ? parseInt(age, 10) : undefined,
      avgCycleLength: cycleLength,
      avgPeriodDuration: periodDuration,
      lastPeriodStartDate: lastPeriodDate,
      isRegular,
      fitnessGoal,
      hasCompletedOnboarding: true,
    });

    if (loadSampleData) {
      seedSampleData();
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#F43F5E', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      console.error(e);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-white/60 p-6 flex flex-col justify-between">
        {/* Progress Bar & Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-200/60"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div className="w-5" />
            )}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step === i + 1
                      ? 'w-6 bg-violet-600'
                      : step > i + 1
                      ? 'w-3 bg-violet-300'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
            {step > 1 && step < totalSteps ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Skip
              </button>
            ) : (
              <div className="w-5" />
            )}
          </div>

          {/* STEP 1: Welcome & Philosophy */}
          {step === 1 && (
            <div className="text-center py-2 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 to-rose-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-200/50">
                <Heart size={32} className="stroke-[2.2] animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Welcome to MENSERA
              </h2>
              <p className="text-sm text-slate-600 mt-2 font-medium">
                Cycle tracking, hormonal education & fitness guidance designed for women who move.
              </p>

              <div className="my-6 p-4 rounded-2xl bg-white border border-violet-100 shadow-xs text-left">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-violet-900 uppercase tracking-wider">
                      Our Promise
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      “Your body is working differently today — adjust, don’t quit.” We never label
                      you as weak. We guide you to work with your body’s natural rhythm.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Message */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-left flex items-start gap-2.5">
                <Lock size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 leading-snug">
                  <span className="font-semibold">100% Private & On-Device:</span> Your menstrual
                  health data is sensitive. Mensera stores your information locally on your device
                  without cloud trackers or ad networks.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Name & Age */}
          {step === 2 && (
            <div className="py-2 animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-800">What should we call you?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Use your first name or a nickname so your guidance feels personal.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name / Nickname <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Age <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 26"
                    min={12}
                    max={65}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Cycle Length & Period Duration */}
          {step === 3 && (
            <div className="py-2 animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-800">Your Cycle Baseline</h3>
              <p className="text-xs text-slate-500 mt-1">
                Averages help us personalize phase estimates. You can adjust this anytime.
              </p>

              <div className="mt-6 space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">Average Cycle Length</label>
                    <span className="text-sm font-extrabold text-violet-700">
                      {cycleLength} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min={21}
                    max={40}
                    value={cycleLength}
                    onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>21 Days</span>
                    <span className="font-semibold text-slate-600">28–30 (Typical)</span>
                    <span>40 Days</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">
                      Average Period Duration
                    </label>
                    <span className="text-sm font-extrabold text-rose-600">
                      {periodDuration} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(parseInt(e.target.value, 10))}
                    className="w-full accent-rose-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>2 Days</span>
                    <span className="font-semibold text-slate-600">4–6 (Typical)</span>
                    <span>10 Days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Last Period Date & Regularity */}
          {step === 4 && (
            <div className="py-2 animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-800">Last Period & Regularity</h3>
              <p className="text-xs text-slate-500 mt-1">
                Helps us pinpoint exactly where you are in your cycle today.
              </p>

              <div className="mt-5 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={14} className="text-rose-500" />
                    First day of your last period
                  </label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    max={formatDateToISO(new Date())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Is your cycle usually regular?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'regular', label: 'Regular', desc: 'Predictable' },
                      { id: 'irregular', label: 'Irregular', desc: 'Shifts often' },
                      { id: 'not-sure', label: 'Not Sure', desc: 'Learning' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIsRegular(opt.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isRegular === opt.id
                            ? 'bg-violet-100 border-violet-500 text-violet-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-xs font-bold">{opt.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Fitness Goal & Realistic Data Choice */}
          {step === 5 && (
            <div className="py-2 animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-800">Your Fitness Focus</h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your primary goal so we can tailor your daily training recommendations.
              </p>

              <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
                {fitnessGoals.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFitnessGoal(g.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      fitnessGoal === g.id
                        ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{g.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800">{g.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{g.desc}</div>
                    </div>
                    {fitnessGoal === g.id && (
                      <CheckCircle2 size={16} className="text-violet-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Sample Data Toggle for Instant Exploration */}
              <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="sample-data-chk"
                  checked={loadSampleData}
                  onChange={(e) => setLoadSampleData(e.target.checked)}
                  className="mt-0.5 rounded-sm accent-violet-600"
                />
                <label htmlFor="sample-data-chk" className="text-xs text-amber-900 cursor-pointer">
                  <span className="font-semibold">Pre-load realistic 3-cycle history:</span> Allows
                  you to immediately see personalized patterns, gym performance trends, and multi-cycle
                  graphs on day one! (You can reset this anytime).
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <div className="pt-4 border-t border-slate-200/80 mt-4">
          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-rose-500 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Enter Mensera</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
