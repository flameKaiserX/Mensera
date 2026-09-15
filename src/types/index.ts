export type PhaseType = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type SubPhaseType = 'early-luteal' | 'late-luteal' | null;

export type FitnessGoal =
  | 'strength'
  | 'fat-loss'
  | 'muscle'
  | 'fitness'
  | 'health'
  | 'understand-cycle';

export interface UserProfile {
  name: string;
  age?: number;
  avgCycleLength: number; // e.g. 28
  avgPeriodDuration: number; // e.g. 5
  lastPeriodStartDate: string; // YYYY-MM-DD
  isRegular: 'regular' | 'irregular' | 'not-sure';
  fitnessGoal: FitnessGoal;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: {
    periodApproaching: boolean;
    fertileWindow: boolean;
    recoveryAlerts: boolean;
    mindsetBoosts: boolean;
  };
}

export type EnergyLevel = 1 | 2 | 3 | 4 | 5; // 1: Very Low, 2: Low, 3: Normal, 4: High, 5: Very High
export type GymPerformance = 1 | 2 | 3 | 4 | 5; // 1: Much weaker, 2: Slightly weaker, 3: Normal, 4: Strong, 5: Stronger than usual

export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export type SymptomKey =
  | 'cramps'
  | 'headache'
  | 'bloating'
  | 'acne'
  | 'breastTenderness'
  | 'fatigue'
  | 'moodSwings'
  | 'foodCravings'
  | 'backPain'
  | 'sleepChanges'
  | 'digestive';

export interface AdaptiveInputs {
  energy: EnergyLevel;
  pain: 'none' | 'mild' | 'moderate' | 'severe';
  sleep: 'poor' | 'fair' | 'good' | 'great';
  muscleSoreness: 'none' | 'mild' | 'sore' | 'very_sore';
  motivation: 'low' | 'moderate' | 'high';
}

export interface AdaptiveRecommendationResult {
  type: 'push' | 'normal' | 'deload' | 'recovery';
  title: string;
  emoji: string;
  badgeColor: string;
  summary: string;
  targetIntensity: string;
  suggestedActivities: string[];
  mindsetQuote: string;
  rationale: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  cycleDay: number;
  periodFlow?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  energy?: EnergyLevel;
  gymPerformance?: GymPerformance;
  symptoms: Partial<Record<SymptomKey, SymptomSeverity>>;
  mood?: 'great' | 'calm' | 'sensitive' | 'irritated' | 'exhausted' | 'anxious';
  sleepHours?: number;
  sleepQuality?: 'poor' | 'fair' | 'good' | 'great';
  workoutCompleted?: boolean;
  workoutType?: string;
  workoutIntensity?: 'light' | 'moderate' | 'high';
  workoutNotes?: string;
  adaptiveRecommendation?: AdaptiveRecommendationResult;
}

export interface CurrentCycleStatus {
  currentDay: number;
  cycleLength: number;
  periodDuration: number;
  currentPhase: PhaseType;
  subPhase: SubPhaseType;
  daysUntilNextPeriod: number;
  estimatedOvulationDay: number;
  cycleProgressPercent: number;
  phaseDisplayName: string;
  phaseEmoji: string;
  phaseColor: string;
  phaseLightColor: string;
  energyForecast: string;
  suggestedWorkoutIntensity: string;
  recoveryRecommendation: string;
  dailyFocus: string;
  mindsetMessage: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  readTime: string;
  category: 'Biology' | 'Fitness' | 'Wellness' | 'Myths' | 'Medical';
  preview: string;
  iconName: string;
  sections: {
    heading: string;
    body: string;
    highlights?: string[];
  }[];
  keyTakeaway: string;
}

export interface FunFact {
  id: string;
  category:
    | 'Hormones'
    | 'Periods'
    | 'Exercise'
    | 'Nutrition'
    | 'Sleep'
    | 'PMS'
    | 'Ovulation'
    | 'Common Myths'
    | 'Female Physiology';
  title: string;
  fact: string;
  source: string;
  icon: string;
}

export interface CyclePatternInsight {
  id: string;
  title: string;
  badge: string;
  observation: string;
  recommendation: string;
  confidence: 'High' | 'Moderate' | 'Emerging';
  supportingData: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'period' | 'fertile' | 'workout' | 'mindset' | 'insight';
  date: string;
  read: boolean;
  actionTab?: 'home' | 'calendar' | 'log' | 'learn' | 'profile';
}
