import type {
  PhaseType,
  SubPhaseType,
  CurrentCycleStatus,
  AdaptiveInputs,
  AdaptiveRecommendationResult,
  DayLog,
  CyclePatternInsight,
} from '../types';

/**
 * Calculate the difference in calendar days between two YYYY-MM-DD date strings
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format a Date object as YYYY-MM-DD in local time
 */
export function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Compute the phase and sub-phase for a given cycle day
 */
export function getPhaseForCycleDay(
  day: number,
  cycleLength: number,
  periodDuration: number
): { phase: PhaseType; subPhase: SubPhaseType } {
  const ovulationDay = Math.max(12, cycleLength - 14);

  if (day >= 1 && day <= periodDuration) {
    return { phase: 'menstrual', subPhase: null };
  } else if (day > periodDuration && day < ovulationDay - 1) {
    return { phase: 'follicular', subPhase: null };
  } else if (day >= ovulationDay - 1 && day <= ovulationDay + 1) {
    return { phase: 'ovulation', subPhase: null };
  } else {
    // Luteal phase
    const lutealLateThreshold = cycleLength - 6;
    const subPhase = day >= lutealLateThreshold ? 'late-luteal' : 'early-luteal';
    return { phase: 'luteal', subPhase };
  }
}

/**
 * Get comprehensive cycle status for today (or a specific date)
 */
export function calculateCycleStatus(
  lastPeriodStartDate: string,
  avgCycleLength: number = 28,
  avgPeriodDuration: number = 5,
  targetDate: Date = new Date()
): CurrentCycleStatus {
  const targetDateISO = formatDateToISO(targetDate);
  const diffDays = getDaysDifference(lastPeriodStartDate, targetDateISO);

  // Normalize current day within 1..avgCycleLength
  let currentDay = (diffDays % avgCycleLength) + 1;
  if (currentDay <= 0) {
    currentDay = avgCycleLength + currentDay;
  }

  const { phase, subPhase } = getPhaseForCycleDay(
    currentDay,
    avgCycleLength,
    avgPeriodDuration
  );

  const estimatedOvulationDay = Math.max(12, avgCycleLength - 14);
  const daysUntilNextPeriod = Math.max(0, avgCycleLength - currentDay + 1);
  const cycleProgressPercent = Math.min(100, Math.round((currentDay / avgCycleLength) * 100));

  // Phase-specific rich descriptors
  switch (phase) {
    case 'menstrual':
      return {
        currentDay,
        cycleLength: avgCycleLength,
        periodDuration: avgPeriodDuration,
        currentPhase: 'menstrual',
        subPhase,
        daysUntilNextPeriod,
        estimatedOvulationDay,
        cycleProgressPercent,
        phaseDisplayName: 'Menstrual Phase',
        phaseEmoji: '🩸',
        phaseColor: '#E11D48',
        phaseLightColor: '#FFE4E6',
        energyForecast:
          'Energy is often lower or gently stabilizing as your uterine lining sheds. Rest is productive work.',
        suggestedWorkoutIntensity: 'Low → Moderate Intensity',
        recoveryRecommendation:
          'Prioritize 8+ hours of sleep, gentle warmth, hydration, and iron-replenishing nutrition.',
        dailyFocus: 'Gentle movement, mobility, restorative sleep & self-compassion',
        mindsetMessage: '“Your body is working differently today — adjust, don’t quit.”',
      };

    case 'follicular':
      return {
        currentDay,
        cycleLength: avgCycleLength,
        periodDuration: avgPeriodDuration,
        currentPhase: 'follicular',
        subPhase,
        daysUntilNextPeriod,
        estimatedOvulationDay,
        cycleProgressPercent,
        phaseDisplayName: 'Follicular Phase',
        phaseEmoji: '🌱',
        phaseColor: '#059669',
        phaseLightColor: '#D1FAE5',
        energyForecast:
          'Estrogen is climbing. You may experience rising vitality, mental sharpness, and faster workout recovery.',
        suggestedWorkoutIntensity: 'Moderate → High Intensity',
        recoveryRecommendation:
          'Your muscles recover efficiently right now. Great window for progressive resistance overload.',
        dailyFocus: 'Strength building, progressive overload & exploring challenging sessions',
        mindsetMessage:
          '“If your energy is rising, this can be a great time to push yourself — but listen to your body.”',
      };

    case 'ovulation':
      return {
        currentDay,
        cycleLength: avgCycleLength,
        periodDuration: avgPeriodDuration,
        currentPhase: 'ovulation',
        subPhase,
        daysUntilNextPeriod,
        estimatedOvulationDay,
        cycleProgressPercent,
        phaseDisplayName: 'Ovulation Phase',
        phaseEmoji: '⚡',
        phaseColor: '#D97706',
        phaseLightColor: '#FEF3C7',
        energyForecast:
          'Estrogen and LH peak. Many notice peak stamina and drive, though personal responses naturally vary.',
        suggestedWorkoutIntensity: 'High Intensity / Performance Focus',
        recoveryRecommendation:
          'Joint laxity can slightly rise due to estrogen peaks; prioritize controlled form and solid warm-ups.',
        dailyFocus: 'Peak power, compound lifts, PR attempts, or dynamic intervals',
        mindsetMessage:
          '“Not every woman experiences a performance boost around ovulation. Your personal experience matters more than the average.”',
      };

    case 'luteal':
      const isLateLuteal = subPhase === 'late-luteal';
      return {
        currentDay,
        cycleLength: avgCycleLength,
        periodDuration: avgPeriodDuration,
        currentPhase: 'luteal',
        subPhase,
        daysUntilNextPeriod,
        estimatedOvulationDay,
        cycleProgressPercent,
        phaseDisplayName: isLateLuteal ? 'Late Luteal / PMS' : 'Early Luteal Phase',
        phaseEmoji: isLateLuteal ? '🌙' : '✨',
        phaseColor: '#7C3AED',
        phaseLightColor: '#EDE9FE',
        energyForecast: isLateLuteal
          ? 'Progesterone peaks then gently declines. Resting body temperature and basal metabolic rate are elevated.'
          : 'Progesterone rises to support the uterine environment. Energy is steady and grounded.',
        suggestedWorkoutIntensity: isLateLuteal
          ? 'Low → Moderate Intensity (Deload Friendly)'
          : 'Moderate → High Intensity',
        recoveryRecommendation: isLateLuteal
          ? 'Fuel with complex carbs and magnesium to support serotonin and soothe PMS symptoms.'
          : 'Stay hydrated with electrolytes as core temperature runs slightly warmer.',
        dailyFocus: isLateLuteal
          ? 'Deload lifting, Pilates, steady walking & stress management'
          : 'Steady strength circuits, aerobic conditioning & balanced nutrition',
        mindsetMessage:
          '“If your performance dips, that doesn’t erase your progress. Recovery is training.”',
      };
  }
}

/**
 * Dynamic Adaptive Daily Recommendation Engine
 * Evaluates real-time symptoms and feelings over rigid cycle rules
 */
export function getAdaptiveWorkoutRecommendation(
  inputs: AdaptiveInputs,
  _phase?: PhaseType
): AdaptiveRecommendationResult {
  const { energy, pain, sleep, muscleSoreness, motivation } = inputs;

  // Case 1: Recovery Day
  // If user has severe pain, or moderate pain with very low energy / poor sleep
  if (
    pain === 'severe' ||
    (pain === 'moderate' && energy <= 2) ||
    (energy === 1 && (sleep === 'poor' || muscleSoreness === 'very_sore'))
  ) {
    return {
      type: 'recovery',
      title: 'Recovery Day',
      emoji: '🧘',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      targetIntensity: 'Very Gentle / Restorative',
      summary:
        'Your body is asking for genuine restoration. Prioritizing rest today protects your long-term progress and hormonal balance.',
      suggestedActivities: [
        '15–25 min leisurely nature walk',
        'Gentle restorative yoga or hip opening stretches',
        'Warm bath or heating pad for muscle relaxation',
        'Deep breathing or meditation session',
      ],
      mindsetQuote: '“You don’t have to earn rest. Recovery is part of training.”',
      rationale:
        'High symptoms, soreness, or fatigue indicate your central nervous system needs replenishment rather than additional training strain.',
    };
  }

  // Case 2: Deload / Lighter Training
  // If energy is low, mild pain/cramps, or sore muscles
  if (
    energy <= 2 ||
    pain === 'moderate' ||
    muscleSoreness === 'very_sore' ||
    muscleSoreness === 'sore' ||
    (motivation === 'low' && sleep === 'poor')
  ) {
    return {
      type: 'deload',
      title: 'Deload / Lighter Training',
      emoji: '🌿',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      targetIntensity: 'Low → Moderate Intensity',
      summary:
        'Keep the movement habit alive without putting excessive stress on your nervous system. Drop weights by 20–30% or choose fluid movement.',
      suggestedActivities: [
        'Moderate walking or light cycling (Zone 2 cardio)',
        'Full-body mobility and dynamic joint flows',
        'Light strength training with RPE 6 (focused on form, not failure)',
        'Mat Pilates or core stability work',
      ],
      mindsetQuote: '“Your body is working differently today — adjust, don’t quit.”',
      rationale:
        'Lighter resistance stimulates blood circulation and helps alleviate cramps without driving up cortisol levels.',
    };
  }

  // Case 3: Push Day
  // High energy, low symptoms, good recovery
  if (
    energy >= 4 &&
    pain === 'none' &&
    (sleep === 'good' || sleep === 'great') &&
    (muscleSoreness === 'none' || muscleSoreness === 'mild') &&
    motivation !== 'low'
  ) {
    return {
      type: 'push',
      title: 'Push Day',
      emoji: '🔥',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      targetIntensity: 'High / Progressive Overload',
      summary:
        'All your bio-markers are green! Your energy, sleep, and muscle readiness are primed to challenge yourself and build strength.',
      suggestedActivities: [
        'Heavy compound lifts (Squat, Deadlift, Bench, Overhead Press)',
        'Progressive overload session (add weight or 1–2 extra reps)',
        'High Intensity Interval Training (HIIT) or sprint work',
        'Skill-based athletic training or personal record attempts',
      ],
      mindsetQuote: '“Energy is primed — lean into the challenge while honoring your form.”',
      rationale:
        'High energy and minimal inflammation allow for optimal neuromuscular recruitment and adaptations.',
    };
  }

  // Case 4: Normal Training (Default for moderate/solid days)
  return {
    type: 'normal',
    title: 'Normal Training',
    emoji: '💪',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    targetIntensity: 'Moderate Intensity',
    summary:
      'A steady, consistent training day. Execute your regular scheduled workout at standard intensity and monitor how you feel as you warm up.',
    suggestedActivities: [
      'Standard gym resistance routine (3–4 working sets at RPE 7–8)',
      '30–40 min moderate cardio (jogging, rowing, or swimming)',
      'Dumbbell or kettlebell functional training',
      'Bodyweight circuit with steady pacing',
    ],
    mindsetQuote: '“Consistency beats sporadic intensity every single time.”',
    rationale:
      'Balanced energy and low discomfort mean your body can comfortably maintain training stimulus and maintain progress.',
  };
}

/**
 * Generate personal pattern insights from logged multi-cycle data
 */
export function generatePatternInsights(
  logs: DayLog[],
  avgCycleLength: number = 28
): CyclePatternInsight[] {
  const insights: CyclePatternInsight[] = [];

  if (logs.length < 5) {
    insights.push({
      id: 'insight-early',
      title: 'Patterns Gathering',
      badge: 'Getting Started',
      observation:
        'You have started logging your daily check-ins! Complete your first full cycle to reveal correlations between your cycle days and workout energy.',
      recommendation:
        'Log your energy and any symptoms for just 30 seconds every morning or after workouts.',
      confidence: 'Emerging',
      supportingData: `${logs.length} days logged so far`,
    });
    return insights;
  }

  // Energy during first 2 days of cycle
  const periodOnsetLogs = logs.filter(
    (l) => (l.cycleDay === 1 || l.cycleDay === 2) && l.energy !== undefined
  );
  if (periodOnsetLogs.length > 0) {
    const avgOnsetEnergy =
      periodOnsetLogs.reduce((acc, curr) => acc + (curr.energy || 3), 0) /
      periodOnsetLogs.length;

    if (avgOnsetEnergy <= 2.5) {
      insights.push({
        id: 'insight-period-energy',
        title: 'Period Onset Energy Dip',
        badge: 'Energy Pattern',
        observation:
          'Based on your logged cycles, your energy tends to be lowest during the first 2 days of your period.',
        recommendation:
          'Planning mobility, yoga, or an intentional rest day on Days 1–2 keeps your consistency high without burnout.',
        confidence: 'High',
        supportingData: `Average energy: ${avgOnsetEnergy.toFixed(1)} / 5 across ${periodOnsetLogs.length} onset logs`,
      });
    }
  }

  // High gym performance window (Days 10-15)
  const follicularOvulationLogs = logs.filter(
    (l) => l.cycleDay >= 10 && l.cycleDay <= 15 && l.gymPerformance !== undefined
  );
  if (follicularOvulationLogs.length > 0) {
    const avgMidPerformance =
      follicularOvulationLogs.reduce((acc, curr) => acc + (curr.gymPerformance || 3), 0) /
      follicularOvulationLogs.length;

    if (avgMidPerformance >= 3.5) {
      insights.push({
        id: 'insight-mid-performance',
        title: 'Peak Performance Window',
        badge: 'Gym Performance',
        observation:
          'You tend to report your best gym performance and highest strength feelings around cycle days 10–15.',
        recommendation:
          'This is your ideal window to schedule challenging compound lifts, progressive overload, or PR attempts.',
        confidence: 'High',
        supportingData: `Average gym performance: ${avgMidPerformance.toFixed(1)} / 5 (Strong) on Days 10–15`,
      });
    }
  }

  // Late Luteal sleep / recovery
  const lateLutealLogs = logs.filter(
    (l) => l.cycleDay >= avgCycleLength - 6 && l.sleepQuality !== undefined
  );
  if (lateLutealLogs.length > 0) {
    const poorSleepCount = lateLutealLogs.filter(
      (l) => l.sleepQuality === 'poor' || l.sleepQuality === 'fair'
    ).length;
    if (poorSleepCount / lateLutealLogs.length >= 0.4) {
      insights.push({
        id: 'insight-late-luteal-sleep',
        title: 'Late Luteal Sleep Sensitivity',
        badge: 'Recovery Pattern',
        observation:
          'Your sleep quality tends to be lighter or more fragmented during the late luteal phase (days before your period).',
        recommendation:
          'Higher progesterone raises core body temperature. Keep your bedroom cooler (65–68°F), limit evening caffeine, and consider magnesium glycinate.',
        confidence: 'Moderate',
        supportingData: `${Math.round((poorSleepCount / lateLutealLogs.length) * 100)}% of late luteal nights had light sleep`,
      });
    }
  }

  // General cycle regularity
  insights.push({
    id: 'insight-cycle-stats',
    title: 'Cycle Rhythm Baseline',
    badge: 'Cycle Rhythm',
    observation: `Your estimated cycle length is ${avgCycleLength} days. Consistent logging helps spot shifts early.`,
    recommendation:
      'Natural cycles fluctuate by 1–3 days due to life stress, travel, or hard training blocks. This is completely healthy.',
    confidence: 'High',
    supportingData: `${logs.length} logged data points across multiple months`,
  });

  return insights;
}
