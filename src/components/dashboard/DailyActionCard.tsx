import React, { useState } from 'react';
import {
  Compass,
  Footprints,
  Dumbbell,
  Bed,
  Utensils,
  Heart,
  Info,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DailyActionCard: React.FC = () => {
  const { currentCycle, todayRecommendation } = useApp();
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setCompletedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Build daily action guidelines based on phase and adaptive recommendation
  const getActionContent = () => {
    switch (currentCycle.currentPhase) {
      case 'menstrual':
        return {
          move: '20–30 min gentle walk or light mobility work to boost blood flow.',
          train: 'Reduce intensity if cramps or fatigue are present. Light dumbbells or yoga.',
          recover: 'Prioritize 8+ hours of sleep, heat therapy, and deep diaphragmatic breathing.',
          eat: 'Balanced meals, iron-rich foods (lentils, spinach, red meat), and hydration.',
          mindset: '“You don’t have to earn rest. Recovery is part of training.”',
          remember: 'Your cycle does not define your fitness level. Adjust, don’t quit.',
        };
      case 'follicular':
        return {
          move: 'Brisk walking or dynamic movement — energy is naturally building.',
          train: 'Progressive overload! Great time to add 2.5–5 lbs or an extra rep on compounds.',
          recover: 'Your muscles recover faster now. 7.5–8 hours of restorative sleep.',
          eat: 'Ample high-quality protein to support muscle synthesis and colorful vegetables.',
          mindset: '“If your energy is rising, push yourself — but stay tuned to your body.”',
          remember: 'Estrogen makes muscle adaptations efficient right now. Capitalize on it!',
        };
      case 'ovulation':
        return {
          move: 'Dynamic warm-ups and explosive or athletic conditioning.',
          train: todayRecommendation.type === 'push'
            ? 'High intensity / Heavy compound lifts if you feel energized.'
            : 'Listen to how you feel: solid strength or steady cardio.',
          recover: 'Prioritize joint stability warm-ups before heavy sets.',
          eat: 'Sustained energy meals: lean proteins, quinoa/brown rice, lots of water.',
          mindset: '“Your personal experience matters more than any population average.”',
          remember: 'Not everyone gets a surge; your own sensations are the truest compass.',
        };
      case 'luteal':
        const isLate = currentCycle.subPhase === 'late-luteal';
        return {
          move: isLate
            ? 'Zone 2 outdoor walking or relaxing Pilates to calm nervous system.'
            : 'Moderate steady-state cardio or enjoyable gym circuit.',
          train: isLate
            ? 'Deload or lower volume (3 sets instead of 4). Form and tempo over ego.'
            : 'Moderate to high intensity strength training with good rest intervals.',
          recover: 'Cool sleeping environment (65°F–68°F) to counter higher progesterone temp.',
          eat: 'Complex carbs (sweet potatoes, oats) to sustain serotonin and curb cravings.',
          mindset: '“If your performance dips, that doesn’t erase your progress.”',
          remember: 'Metabolism is elevated by 100–300 kcal/day. Hunger is physiological.',
        };
    }
  };

  const action = getActionContent();

  const items = [
    { key: 'move', label: 'Move', text: action.move, icon: Footprints, color: 'text-emerald-600' },
    { key: 'train', label: 'Train', text: action.train, icon: Dumbbell, color: 'text-violet-600' },
    { key: 'recover', label: 'Recover', text: action.recover, icon: Bed, color: 'text-blue-600' },
    { key: 'eat', label: 'Eat', text: action.eat, icon: Utensils, color: 'text-amber-600' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs my-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-violet-100 text-violet-700">
            <Compass size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              What Should I Do Today?
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Daily flexible guidance • {currentCycle.phaseDisplayName}
            </p>
          </div>
        </div>

        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: currentCycle.phaseLightColor,
            color: currentCycle.phaseColor,
          }}
        >
          {todayRecommendation.title}
        </span>
      </div>

      {/* Action Items List with subtle tap-to-complete */}
      <div className="mt-3.5 space-y-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isDone = completedItems[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleItem(item.key)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200/60 opacity-85'
                  : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <Circle size={16} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Icon size={13} className={item.color} />
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                </div>
                <p className={`text-xs mt-0.5 leading-relaxed ${isDone ? 'text-slate-500 line-through' : 'text-slate-600'}`}>
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mindset Quote Box */}
      <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-violet-50 to-rose-50 border border-violet-100/80">
        <div className="flex items-start gap-2">
          <Heart size={15} className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-violet-900 uppercase tracking-wider">
              Mindset For Today
            </span>
            <p className="text-xs text-slate-700 italic mt-0.5 font-medium">
              {action.mindset}
            </p>
          </div>
        </div>
      </div>

      {/* Remember Note */}
      <div className="mt-2.5 flex items-start gap-2 px-1 text-[11px] text-slate-500">
        <Info size={13} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-tight">
          <span className="font-semibold text-slate-700">Remember:</span> {action.remember}
        </p>
      </div>
    </div>
  );
};
