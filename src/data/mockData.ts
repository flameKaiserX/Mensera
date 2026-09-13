import type { UserProfile, DayLog, Badge } from '../types';
import { formatDateToISO } from '../utils/cycleEngine';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: '',
  age: undefined,
  avgCycleLength: 29,
  avgPeriodDuration: 5,
  // Set last period start date relative to today (e.g., 12 days ago, placing user nicely in Follicular / Early Ovulation)
  lastPeriodStartDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() - 11);
    return formatDateToISO(d);
  })(),
  isRegular: 'regular',
  fitnessGoal: 'strength',
  hasCompletedOnboarding: false,
  notificationsEnabled: {
    periodApproaching: true,
    fertileWindow: true,
    recoveryAlerts: true,
    mindsetBoosts: true,
  },
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-explorer',
    title: 'Cycle Explorer',
    emoji: '🌱',
    category: 'Education',
    description: 'Explored and learned all four distinct menstrual cycle phases.',
    unlocked: true,
    unlockedDate: '2026-08-15',
  },
  {
    id: 'badge-consistency',
    title: 'Consistency',
    emoji: '🔥',
    category: 'Habits',
    description: 'Logged your cycle check-ins for 7 days in a row.',
    unlocked: true,
    unlockedDate: '2026-08-22',
  },
  {
    id: 'badge-body-awareness',
    title: 'Body Awareness',
    emoji: '💜',
    category: 'Attunement',
    description: 'Logged daily energy and symptoms across an entire 28+ day cycle.',
    unlocked: true,
    unlockedDate: '2026-09-01',
  },
  {
    id: 'badge-pattern',
    title: 'Personal Pattern',
    emoji: '🔍',
    category: 'Insights',
    description: 'Completed 3 cycles to unlock personalized cycle pattern insights.',
    unlocked: true,
    unlockedDate: '2026-09-08',
  },
  {
    id: 'badge-recovery',
    title: 'Recovery Champion',
    emoji: '💧',
    category: 'Wisdom',
    description: 'Chose a restorative recovery day when your body asked for it.',
    unlocked: true,
    unlockedDate: '2026-08-28',
  },
];

/**
 * Generate 3 full realistic historical cycles ending right up to today
 */
export function generateRealisticSampleLogs(lastPeriodStartDateStr: string, cycleLength: number = 29): DayLog[] {
  const logs: DayLog[] = [];
  const today = new Date();
  
  // We will generate 85 days of logs back from today
  for (let i = 85; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = formatDateToISO(d);

    // Calculate cycle day based on lastPeriodStartDateStr
    const diff = Math.floor(
      (new Date(dateStr + 'T00:00:00').getTime() - new Date(lastPeriodStartDateStr + 'T00:00:00').getTime()) /
        (1000 * 60 * 60 * 24)
    );
    let cycleDay = (diff % cycleLength) + 1;
    if (cycleDay <= 0) cycleDay = cycleLength + cycleDay;

    let periodFlow: DayLog['periodFlow'] = 'none';
    let energy: DayLog['energy'] = 3;
    let gymPerformance: DayLog['gymPerformance'] = 3;
    const symptoms: DayLog['symptoms'] = {};
    let sleepQuality: DayLog['sleepQuality'] = 'good';
    let sleepHours = 7.5;
    let workoutCompleted = false;
    let workoutType = 'Rest';
    let workoutIntensity: DayLog['workoutIntensity'] = 'light';

    // Menstrual phase (Days 1–5)
    if (cycleDay >= 1 && cycleDay <= 5) {
      if (cycleDay === 1) {
        periodFlow = 'heavy';
        energy = 1;
        gymPerformance = 1;
        symptoms.cramps = 'moderate';
        symptoms.fatigue = 'moderate';
        symptoms.backPain = 'mild';
        workoutCompleted = true;
        workoutType = 'Mobility & Walking';
        workoutIntensity = 'light';
      } else if (cycleDay === 2) {
        periodFlow = 'heavy';
        energy = 2;
        gymPerformance = 2;
        symptoms.cramps = 'mild';
        symptoms.fatigue = 'mild';
        workoutCompleted = true;
        workoutType = 'Gentle Yoga & Stretch';
        workoutIntensity = 'light';
      } else if (cycleDay === 3) {
        periodFlow = 'medium';
        energy = 2;
        gymPerformance = 2;
        symptoms.bloating = 'mild';
        workoutCompleted = true;
        workoutType = 'Light Dumbbell Upper Body';
        workoutIntensity = 'light';
      } else if (cycleDay === 4) {
        periodFlow = 'light';
        energy = 3;
        gymPerformance = 3;
        workoutCompleted = true;
        workoutType = 'Pilates & Core';
        workoutIntensity = 'moderate';
      } else {
        periodFlow = 'spotting';
        energy = 3;
        gymPerformance = 3;
        workoutCompleted = true;
        workoutType = 'Full Body Resistance';
        workoutIntensity = 'moderate';
      }
    }
    // Follicular phase (Days 6–12)
    else if (cycleDay >= 6 && cycleDay <= 12) {
      if (cycleDay <= 8) {
        energy = 4;
        gymPerformance = 3;
        sleepQuality = 'good';
        workoutCompleted = true;
        workoutType = 'Lower Body Strength (Squats)';
        workoutIntensity = 'moderate';
      } else {
        energy = 4;
        gymPerformance = 4;
        sleepQuality = 'great';
        workoutCompleted = true;
        workoutType = 'Upper Body Push/Pull + Progressive Overload';
        workoutIntensity = 'high';
      }
    }
    // Ovulation window (Days 13–15)
    else if (cycleDay >= 13 && cycleDay <= 15) {
      energy = 5;
      gymPerformance = 5;
      sleepQuality = 'great';
      sleepHours = 8;
      workoutCompleted = true;
      workoutType = 'Heavy Deadlifts & High-Intensity Intervals';
      workoutIntensity = 'high';
    }
    // Early Luteal (Days 16–21)
    else if (cycleDay >= 16 && cycleDay <= 21) {
      energy = 4;
      gymPerformance = 4;
      sleepQuality = 'good';
      workoutCompleted = true;
      workoutType = 'Hypertrophy Strength Circuit';
      workoutIntensity = 'moderate';
    }
    // Late Luteal / PMS (Days 22–cycleLength)
    else {
      if (cycleDay <= 24) {
        energy = 3;
        gymPerformance = 3;
        symptoms.foodCravings = 'mild';
        symptoms.bloating = 'mild';
        sleepQuality = 'fair';
        workoutCompleted = true;
        workoutType = 'Moderate Resistance Training';
        workoutIntensity = 'moderate';
      } else if (cycleDay <= 26) {
        energy = 2;
        gymPerformance = 2;
        symptoms.foodCravings = 'moderate';
        symptoms.breastTenderness = 'mild';
        symptoms.moodSwings = 'mild';
        sleepQuality = 'fair';
        sleepHours = 6.8;
        workoutCompleted = true;
        workoutType = 'Mat Pilates & Zone 2 Walking';
        workoutIntensity = 'light';
      } else {
        energy = 2;
        gymPerformance = 2;
        symptoms.bloating = 'moderate';
        symptoms.fatigue = 'mild';
        symptoms.cramps = 'mild';
        sleepQuality = 'poor';
        sleepHours = 6.5;
        workoutCompleted = true;
        workoutType = 'Deload Full Body & Hip Mobility';
        workoutIntensity = 'light';
      }
    }

    logs.push({
      date: dateStr,
      cycleDay,
      periodFlow,
      energy,
      gymPerformance,
      symptoms,
      sleepHours,
      sleepQuality,
      workoutCompleted,
      workoutType,
      workoutIntensity,
    });
  }

  return logs;
}
