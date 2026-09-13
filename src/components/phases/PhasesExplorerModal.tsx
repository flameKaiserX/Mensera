import React, { useState } from 'react';
import {
  X,
  Dumbbell,
  Heart,
  Activity,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PhaseType } from '../../types';

interface PhaseDetail {
  id: PhaseType;
  name: string;
  emoji: string;
  color: string;
  lightColor: string;
  badgeBorder: string;
  duration: string;
  subtitle: string;
  biology: string[];
  symptoms: string[];
  energyProfile: string;
  fitnessIntensity: string;
  recommendedActivities: string[];
  disclaimer?: string;
  mindsetMessage: string;
  subPhases?: {
    name: string;
    timing: string;
    intensity: string;
    activities: string[];
    description: string;
  }[];
  facts: { title: string; fact: string; source: string }[];
}

const PHASES_DATA: Record<PhaseType, PhaseDetail> = {
  menstrual: {
    id: 'menstrual',
    name: 'Menstrual Phase',
    emoji: '🩸',
    color: '#E11D48',
    lightColor: '#FFE4E6',
    badgeBorder: '#FDA4AF',
    duration: 'Days 1 to 5 (average 3–7 days)',
    subtitle: 'The biological reset & renewal',
    biology: [
      'Both estrogen and progesterone reach their lowest concentration.',
      'The inner uterine lining (endometrium) sheds and exits via the cervix.',
      'The pituitary gland in the brain begins secreting Follicle-Stimulating Hormone (FSH) to recruit new follicles for the upcoming cycle.',
    ],
    symptoms: [
      'Lower physical energy',
      'Uterine cramps (caused by uterine prostaglandins)',
      'Bloating & water retention',
      'Fatigue or sleepiness',
      'Lower back discomfort',
      'Reflective or introverted mood',
    ],
    energyProfile:
      'Energy is naturally at a baseline. Some women feel deeply sluggish on Days 1–2, while others experience an immediate energetic relief once bleeding commences.',
    fitnessIntensity: 'Low → Moderate Intensity (Flexible)',
    recommendedActivities: [
      'Leisurely walking in nature (releases natural pain-relieving endorphins)',
      'Full body mobility & hip opening flows',
      'Gentle restorative or yin yoga',
      'Light dumbbell strength training (RPE 5–6)',
      'Easy zone-2 cycling or swimming',
      'Full rest day if experiencing cramps',
    ],
    disclaimer:
      'Some women feel perfectly capable of intense training during their period. Your recommendation should always be based on your individual symptoms and energy, not a rigid calendar rule.',
    mindsetMessage: '“You don’t have to earn rest. Recovery is part of training.”',
    facts: [
      {
        title: 'Only 2–3 Tablespoons',
        fact: 'The total volume of actual blood lost during a normal period is only about 30–45 milliliters. The rest is endometrial tissue, mucus, and secretions.',
        source: 'ACOG Guidelines',
      },
      {
        title: 'Movement Relieves Cramping',
        fact: 'Gentle aerobic exercise prompts your body to release beta-endorphins, which act as natural analgesics and help quiet prostaglandins.',
        source: 'Cochrane Review',
      },
      {
        title: 'Hormones Are Low & Steady',
        fact: 'From a purely metabolic standpoint, low estrogen and progesterone mimic a baseline male hormonal profile, making muscle glycogen uptake straightforward.',
        source: 'Sports Medicine Review',
      },
    ],
  },
  follicular: {
    id: 'follicular',
    name: 'Follicular Phase',
    emoji: '🌱',
    color: '#059669',
    lightColor: '#D1FAE5',
    badgeBorder: '#6EE7B7',
    duration: 'Days 6 to 12 (approx. 7–10 days)',
    subtitle: 'Rising vitality & tissue regeneration',
    biology: [
      'FSH prompts multiple ovarian follicles to mature inside your ovaries.',
      'Developing follicles pump out rising levels of estradiol (estrogen).',
      'Estrogen thickens the uterine endometrium with fresh, nutrient-rich blood vessels.',
      'Rising estrogen optimizes insulin sensitivity, glycogen storage, and neurotransmitters (dopamine, serotonin).',
    ],
    symptoms: [
      'Increasing physical energy and stamina',
      'Mental sharpness, focus, and social enthusiasm',
      'Faster muscle recovery between training sessions',
      'Clearer skin and upbeat mood',
    ],
    energyProfile:
      'Energy climbs steadily day by day. You may feel motivated, resilient to fatigue, and eager to tackle challenging tasks or heavy weights.',
    fitnessIntensity: 'Moderate → High Intensity',
    recommendedActivities: [
      'Progressive overload strength training (adding 2.5–5 lbs or extra reps)',
      'High-Intensity Interval Training (HIIT)',
      'Challenging barbell compound lifts (squats, bench, deadlifts)',
      'Tempo runs or sprint intervals',
      'Skill-based workouts and athletic gymnastics/climbing',
      'Challenging gym sessions with heavy weights',
    ],
    mindsetMessage:
      '“If your energy is rising, this can be a great time to push yourself — but listen to your body.”',
    facts: [
      {
        title: 'Estrogen is Anabolic',
        fact: 'Estrogen stimulates the mTOR pathway, promoting muscle protein synthesis and enhancing muscle satellite cell activation for faster tissue repair.',
        source: 'Endocrine Reviews',
      },
      {
        title: 'Follicle Recruitment Race',
        fact: 'Between 10 and 20 microscopic follicles begin maturing each month, but typically only one dominant follicle develops fully to release an egg.',
        source: 'Human Reproduction Update',
      },
    ],
  },
  ovulation: {
    id: 'ovulation',
    name: 'Ovulation Phase',
    emoji: '⚡',
    color: '#D97706',
    lightColor: '#FEF3C7',
    badgeBorder: '#FCD34D',
    duration: 'Days 13 to 15 (approx. 24–48 hours event)',
    subtitle: 'Peak hormonal surge & biological centerpiece',
    biology: [
      'Estrogen peaks at its highest point of the entire month.',
      'The brain releases a rapid surge of Luteinizing Hormone (LH).',
      'The mature dominant follicle bursts open, releasing an egg into the fallopian tube.',
      'A tiny surge of testosterone also often occurs around this window, enhancing drive.',
    ],
    symptoms: [
      'High physical confidence, energy, and strength potential',
      'Clear, stretchy cervical mucus (resembling raw egg white)',
      'Subtle one-sided pelvic twinge in some women (mittelschmerz)',
      'Slight elevation in basal body temperature following egg release',
    ],
    energyProfile:
      'Peak energy potential for many women. Many report feeling charismatic, strong, and powerful during workouts.',
    fitnessIntensity: 'High Intensity / Peak Performance',
    recommendedActivities: [
      'Heavy compound strength training and personal record (PR) attempts',
      'Explosive sprinting, plyometrics, or Olympic lifting',
      'High-intensity circuit training and athletic games',
      'Performance-focused workouts with full recovery intervals',
    ],
    disclaimer:
      'Not every woman experiences a performance boost around ovulation. Some experience mild cramping or bloating. Your personal experience matters more than the average.',
    mindsetMessage:
      '“Your personal experience matters more than any textbook average. Trust what your body tells you today.”',
    facts: [
      {
        title: 'The Egg’s Brief Window',
        fact: 'The ovulated egg lives for only 12 to 24 hours. If unfertilized, it naturally disintegrates.',
        source: 'Reproductive Biology Journal',
      },
      {
        title: 'Joint Laxity Awareness',
        fact: 'Peak estrogen can slightly increase collagen laxity in ligaments. Focus on controlled form and avoid sloppy warm-ups before heavy lifts.',
        source: 'American Journal of Sports Medicine',
      },
    ],
  },
  luteal: {
    id: 'luteal',
    name: 'Luteal Phase',
    emoji: '🌙',
    color: '#7C3AED',
    lightColor: '#EDE9FE',
    badgeBorder: '#C4B5FD',
    duration: 'Days 16 to 28 (approx. 12–14 days)',
    subtitle: 'Progesterone rise, sustained stamina & PMS transition',
    biology: [
      'The ruptured follicle transforms into the corpus luteum, which secretes progesterone.',
      'Progesterone raises basal body temperature by ~0.5°F and increases metabolic rate.',
      'If pregnancy does not occur, the corpus luteum withers, progesterone and estrogen drop steeply, initiating the next period.',
    ],
    symptoms: [
      'Mild water retention or breast tenderness',
      'Increased appetite and cravings for carbohydrates',
      'Elevated heart rate and body warmth',
      'Mood shifts or irritability in late luteal (PMS)',
    ],
    energyProfile:
      'Split into two distinct halves: steady resilience in early luteal, followed by a gentle inward turning and lower stamina in late luteal.',
    fitnessIntensity: 'Divided: Early (Moderate/High) → Late (Low/Moderate)',
    recommendedActivities: [
      'Early Luteal: Steady strength training, moderate cardio, regular gym sessions',
      'Late Luteal: Deload lifting, pilates, yoga, mobility, lower-volume, walks',
    ],
    subPhases: [
      {
        name: 'Early Luteal (Days 16–21)',
        timing: 'Days 16–21',
        intensity: 'Moderate → High Intensity',
        activities: [
          'Steady resistance training with standard rest periods',
          'Aerobic conditioning and steady-state runs/swims',
          'Regular gym programming (RPE 7–8)',
        ],
        description:
          'Progesterone is rising smoothly. Energy remains steady and grounded. You can maintain solid training volume.',
      },
      {
        name: 'Late Luteal / PMS (Days 22–End)',
        timing: 'Days 22 to End',
        intensity: 'Low → Moderate Intensity (Deload Friendly)',
        activities: [
          'Deload lifting (drop weight by 15–20%, focus on tempo)',
          'Mat Pilates and core stability',
          'Restorative yoga, brisk walking, and hip mobility',
          'Higher sleep allowance and stress reduction',
        ],
        description:
          'Hormones are declining. Higher body temperature increases perceived exertion. Work with your body by reducing volume.',
      },
    ],
    mindsetMessage:
      '“If your performance dips, that doesn’t erase your progress. Deloading builds long-term resilience.”',
    facts: [
      {
        title: 'Caloric Burn Rises',
        fact: 'Your body expends an extra 100 to 300 calories per day during the luteal phase due to elevated basal body temperature!',
        source: 'American Journal of Clinical Nutrition',
      },
      {
        title: 'Carbs Fuel Serotonin',
        fact: 'Craving carbohydrates before your period is your brain’s natural strategy to synthesize serotonin during estrogen decline.',
        source: 'Neuropsychopharmacology',
      },
    ],
  },
};

export const PhasesExplorerModal: React.FC = () => {
  const { currentCycle, closeModal, modalPayload } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<PhaseType>(
    modalPayload?.initialPhase || currentCycle.currentPhase
  );
  const [factIndex, setFactIndex] = useState(0);

  const phase = PHASES_DATA[selectedPhase];

  const phaseKeys: PhaseType[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn"
      onClick={closeModal}
    >
      <div
        className="bg-[#FAF7F2] rounded-3xl w-full max-w-lg h-[calc(100dvh-1.5rem)] max-h-[92vh] overflow-hidden shadow-2xl border border-white/60 flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex-none bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Menstrual Cycle Education
            </span>
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
              The 4 Phases Explained
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Phase Selector Tabs */}
        <div className="flex-none px-4 pt-3 pb-1">
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/60 rounded-2xl">
            {phaseKeys.map((key) => {
              const p = PHASES_DATA[key];
              const isSelected = selectedPhase === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedPhase(key);
                    setFactIndex(0);
                  }}
                  className={`py-2 px-1 rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-white text-slate-800 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span className="text-base block mb-0.5">{p.emoji}</span>
                  <span className="text-[11px] leading-none block capitalize">{key}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase Body */}
        <div className="p-5 space-y-5 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y no-scrollbar">
          {/* Phase Hero Title Card */}
          <div
            className="p-4 rounded-3xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: phase.lightColor,
              borderColor: phase.badgeBorder,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{phase.emoji}</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-800 leading-tight">
                  {phase.name}
                </h3>
                <p className="text-xs font-semibold text-slate-600">{phase.duration}</p>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-700 mt-2 italic">
              {phase.subtitle}
            </p>
          </div>

          {/* Mindset Quote Banner */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-2.5">
            <Heart size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-violet-900 uppercase tracking-wider">
                Mindset Guide
              </span>
              <p className="text-xs font-semibold text-slate-800 italic mt-0.5">
                {phase.mindsetMessage}
              </p>
            </div>
          </div>

          {/* What Is Happening in the Body */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-violet-600" />
              <span>What’s Happening in the Body</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
              {phase.biology.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: phase.color }}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You Might Experience (Symptoms & Energy) */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>What You Might Feel</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">{phase.energyProfile}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {phase.symptoms.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Fitness & Workout Guidance */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell size={14} className="text-rose-500" />
                <span>Fitness & Gym Guidance</span>
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {phase.fitnessIntensity}
              </span>
            </div>

            {/* If Sub-phases exist (e.g. Luteal: Early vs Late) */}
            {phase.subPhases ? (
              <div className="space-y-3">
                {phase.subPhases.map((sp, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">{sp.name}</span>
                      <span className="text-[10px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded-md">
                        {sp.intensity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{sp.description}</p>
                    <div className="space-y-1">
                      {sp.activities.map((act, aIdx) => (
                        <div key={aIdx} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-violet-500" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-700">Suggested Activities:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {phase.recommendedActivities.map((act, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Variation Disclaimer */}
            {phase.disclaimer && (
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2 text-amber-900 text-[11px] leading-relaxed">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-700" />
                <span>{phase.disclaimer}</span>
              </div>
            )}
          </div>

          {/* Swipeable Fun Facts Card */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-3xl border border-violet-100 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-900 flex items-center gap-1">
                <Lightbulb size={12} className="text-violet-600" />
                <span>Phase Fact ({factIndex + 1} / {phase.facts.length})</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setFactIndex((prev) => (prev > 0 ? prev - 1 : phase.facts.length - 1))
                  }
                  className="p-1 rounded-full hover:bg-violet-200/50 text-slate-600"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() =>
                    setFactIndex((prev) => (prev < phase.facts.length - 1 ? prev + 1 : 0))
                  }
                  className="p-1 rounded-full hover:bg-violet-200/50 text-slate-600"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <h5 className="text-xs font-bold text-slate-800">{phase.facts[factIndex]?.title}</h5>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {phase.facts[factIndex]?.fact}
            </p>
            <p className="text-[10px] text-violet-700 font-medium mt-1.5 italic">
              Source: {phase.facts[factIndex]?.source}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
