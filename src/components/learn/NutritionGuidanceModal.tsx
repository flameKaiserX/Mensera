import React, { useState } from 'react';
import { X, Apple, Droplets, Info, Heart } from 'lucide-react';
import type { PhaseType } from '../../types';

interface NutritionPhaseGuide {
  phase: PhaseType;
  title: string;
  emoji: string;
  color: string;
  bg: string;
  focus: string;
  priorities: { label: string; why: string; foods: string }[];
  hydrationTip: string;
  mythBuster: string;
}

const NUTRITION_PHASES: NutritionPhaseGuide[] = [
  {
    phase: 'menstrual',
    title: 'Menstrual Phase Nutrition',
    emoji: '🩸',
    color: '#E11D48',
    bg: '#FFE4E6',
    focus: 'Replenishing micronutrients, anti-inflammatory nourishment & cellular rest',
    priorities: [
      {
        label: 'Iron-Rich Foods',
        why: 'Replenishes hemoglobin lost during menstrual flow to prevent fatigue.',
        foods: 'Lentils, spinach, organic beef, beans, pumpkin seeds, dark chocolate (70%+).',
      },
      {
        label: 'High-Quality Protein',
        why: 'Supports cellular rebuilding and stabilizes blood glucose when energy is lower.',
        foods: 'Eggs, tofu, chicken breast, Greek yogurt, fish, tempeh.',
      },
      {
        label: 'Fiber & Gut Motility',
        why: 'Prostaglandins can cause loose stools or constipation; fiber normalizes digestion.',
        foods: 'Oats, chia seeds, raspberries, steamed broccoli, carrots.',
      },
    ],
    hydrationTip:
      'Warm herbal teas (ginger, chamomile, peppermint) help relax uterine muscles and ease cramping.',
    mythBuster:
      'You don’t need to completely cut out foods you love. Eating warm, comforting, balanced meals is physiologically soothing.',
  },
  {
    phase: 'follicular',
    title: 'Follicular Phase Nutrition',
    emoji: '🌱',
    color: '#059669',
    bg: '#D1FAE5',
    focus: 'Sustaining rising metabolic energy and fueling progressive gym overload',
    priorities: [
      {
        label: 'Adequate Carbohydrates',
        why: 'Estrogen enhances muscle glycogen storage. Carbs fuel harder lifting and higher training volumes.',
        foods: 'Brown rice, quinoa, sweet potatoes, sourdough, bananas, berries.',
      },
      {
        label: 'Lean Muscle Protein',
        why: 'Maximizes muscle protein synthesis during your body’s most anabolic window.',
        foods: 'Salmon, edamame, chicken, cottage cheese, protein smoothies.',
      },
      {
        label: 'Vibrant Antioxidants',
        why: 'Cruciferous vegetables support healthy liver metabolism of rising estrogen.',
        foods: 'Broccoli, cauliflower, kale, blueberries, citrus fruits.',
      },
    ],
    hydrationTip:
      'Aim for 2.5–3 liters of water, especially around resistance training sessions.',
    mythBuster:
      'Low-carb diets during high-intensity training can suppress the LH surge. Carbs are performance fuel.',
  },
  {
    phase: 'ovulation',
    title: 'Ovulation Phase Nutrition',
    emoji: '⚡',
    color: '#D97706',
    bg: '#FEF3C7',
    focus: 'Sustained energy release, fiber for estrogen balance & cellular hydration',
    priorities: [
      {
        label: 'Balanced Clean Meals',
        why: 'Peak energy means your body efficiently utilizes diverse macronutrients.',
        foods: 'Mediterranean-style bowls, avocado, olive oil, leafy greens, grilled fish.',
      },
      {
        label: 'Soluble Fiber',
        why: 'Binds to excess circulating estrogen in the digestive tract for smooth elimination.',
        foods: 'Flaxseeds, Brussels sprouts, apples, pears, black beans.',
      },
      {
        label: 'Hydration & Electrolytes',
        why: 'High estrogen slightly alters body water balance; electrolytes keep stamina high.',
        foods: 'Coconut water, pinch of sea salt in lemon water, watery fruits (watermelon, cucumbers).',
      },
    ],
    hydrationTip:
      'Stay consistent with fluid intake; slight pelvic cramping (mittelschmerz) eases with hydration.',
    mythBuster:
      'There is no required "ovulation cleanse" — your liver and kidneys handle detoxification naturally.',
  },
  {
    phase: 'luteal',
    title: 'Luteal Phase Nutrition',
    emoji: '🌙',
    color: '#7C3AED',
    bg: '#EDE9FE',
    focus: 'Caloric nourishment, magnesium for mood & complex carbs to support serotonin',
    priorities: [
      {
        label: 'Adequate Calories (+100–300 kcal)',
        why: 'Your basal body temperature is higher, burning more calories at rest! Hunger is real.',
        foods: 'Nut butters, extra avocado, oatmeal bowls with nuts, hearty soups.',
      },
      {
        label: 'Complex Carbohydrates',
        why: 'Essential for the brain to produce serotonin and prevent premenstrual mood crashes.',
        foods: 'Sweet potatoes, whole grain pasta, roasted squash, sprouted grains.',
      },
      {
        label: 'Magnesium & Healthy Fats',
        why: 'Reduces premenstrual water retention, supports deep sleep, and eases breast tenderness.',
        foods: 'Almonds, cashews, dark chocolate, salmon, chia seeds.',
      },
    ],
    hydrationTip:
      'Higher progesterone can make you feel thirstier; keep an electrolyte beverage handy.',
    mythBuster:
      'Craving chocolate or carbs before your period is NOT a moral failing. It is brain biochemistry asking for serotonin precursors!',
  },
];

export const NutritionGuidanceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseType>('menstrual');

  const guide = NUTRITION_PHASES.find((p) => p.phase === selectedPhase) || NUTRITION_PHASES[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-1 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] rounded-3xl w-full max-w-lg h-[calc(100dvh-0.5rem)] max-h-[98vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex-none bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Apple size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Phase-Based Nutrition Guidance
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                No restrictive diets • Nourishing your natural biology
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

        {/* Phase Selector Tabs */}
        <div className="flex-none px-4 pt-3 pb-1">
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/60 rounded-2xl">
            {NUTRITION_PHASES.map((p) => (
              <button
                key={p.phase}
                onClick={() => setSelectedPhase(p.phase)}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  selectedPhase === p.phase
                    ? 'bg-white text-slate-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span className="text-base block mb-0.5">{p.emoji}</span>
                <span className="text-[11px] leading-none block capitalize">{p.phase}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y no-scrollbar">
          {/* Phase Banner */}
          <div
            className="p-4 rounded-3xl border shadow-2xs"
            style={{ backgroundColor: guide.bg, borderColor: `${guide.color}40` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{guide.emoji}</span>
              <div>
                <h4 className="text-base font-extrabold text-slate-800">{guide.title}</h4>
                <p className="text-xs font-semibold text-slate-600">{guide.focus}</p>
              </div>
            </div>
          </div>

          {/* Core Priorities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Nutritional Focus Areas
            </h4>
            {guide.priorities.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: guide.color }} />
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.why}</p>
                <p className="text-[11px] text-slate-500 pt-1 font-medium">
                  <span className="font-semibold text-slate-700">Great sources:</span> {item.foods}
                </p>
              </div>
            ))}
          </div>

          {/* Hydration Tip */}
          <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
            <Droplets size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Hydration Tip:</span> {guide.hydrationTip}
            </div>
          </div>

          {/* Myth Buster */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
            <Heart size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Diet Myth Buster:</span> {guide.mythBuster}
            </div>
          </div>

          {/* Universal Principle */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
            <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
            <p>
              <span className="font-bold">No Single “Perfect Period Diet”:</span> Every body is
              biochemically unique. Choose nutrient-dense foods that make you feel energized, and
              never feel guilty about listening to genuine hunger cues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
