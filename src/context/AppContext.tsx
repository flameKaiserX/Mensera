import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  CurrentCycleStatus,
  DayLog,
  Badge,
  AppNotification,
  AdaptiveInputs,
  AdaptiveRecommendationResult,
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_BADGES,
  generateRealisticSampleLogs,
} from '../data/mockData';
import {
  calculateCycleStatus,
  formatDateToISO,
  getAdaptiveWorkoutRecommendation,
} from '../utils/cycleEngine';

interface AppContextType {
  userProfile: UserProfile;
  currentCycle: CurrentCycleStatus;
  logs: DayLog[];
  badges: Badge[];
  notifications: AppNotification[];
  activeTab: 'home' | 'calendar' | 'log' | 'learn' | 'profile';
  activeModal: string | null;
  modalPayload: any;
  todayLog: DayLog | undefined;
  todayRecommendation: AdaptiveRecommendationResult;
  selectedDate: string;

  // Actions
  setActiveTab: (tab: 'home' | 'calendar' | 'log' | 'learn' | 'profile') => void;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;
  setSelectedDate: (dateStr: string) => void;
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  saveDayLog: (log: Partial<DayLog> & { date: string }) => void;
  getLogForDate: (dateStr: string) => DayLog | undefined;
  seedSampleData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => void;
  exportDataCSV: () => void;
  markNotificationAsRead: (id: string) => void;
  runAdaptiveCheckIn: (inputs: AdaptiveInputs) => AdaptiveRecommendationResult;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'mensera_profile_v2',
  LOGS: 'mensera_logs_v1',
  BADGES: 'mensera_badges_v1',
  NOTIFICATIONS: 'mensera_notifications_v1',
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER_PROFILE;
  });

  // 2. Logs State
  const [logs, setLogs] = useState<DayLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Initialize with 3-cycle realistic sample logs for rich UX
    return generateRealisticSampleLogs(INITIAL_USER_PROFILE.lastPeriodStartDate, INITIAL_USER_PROFILE.avgCycleLength);
  });

  // 3. Badges State
  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BADGES;
  });

  // 4. Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const todayStr = formatDateToISO(new Date());
    return [
      {
        id: 'notif-1',
        title: 'Mid-Cycle Strength Window ⚡',
        message: 'Your natural estrogen peak is active. Great time for a push workout if you feel good!',
        type: 'workout',
        date: todayStr,
        read: false,
        actionTab: 'log',
      },
      {
        id: 'notif-2',
        title: 'Encouraging Mindset 💜',
        message: '“Your body is working differently today — adjust, don’t quit.”',
        type: 'mindset',
        date: todayStr,
        read: false,
      },
      {
        id: 'notif-3',
        title: 'Estimated Fertile Window Approaching 🌱',
        message: 'Your body is entering the peak fertile window of your current cycle.',
        type: 'fertile',
        date: todayStr,
        read: true,
        actionTab: 'calendar',
      },
    ];
  });

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'log' | 'learn' | 'profile'>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateToISO(new Date()));

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (e) {
      console.error(e);
    }
  }, [badges]);

  // Derived current cycle status
  const currentCycle = calculateCycleStatus(
    userProfile.lastPeriodStartDate,
    userProfile.avgCycleLength,
    userProfile.avgPeriodDuration,
    new Date()
  );

  const todayStr = formatDateToISO(new Date());
  const todayLog = logs.find((l) => l.date === todayStr);

  // Default recommendation if no custom adaptive checkin logged today
  const todayRecommendation: AdaptiveRecommendationResult =
    todayLog?.adaptiveRecommendation ||
    getAdaptiveWorkoutRecommendation(
      {
        energy: todayLog?.energy || 4,
        pain: todayLog?.symptoms?.cramps ? 'moderate' : 'none',
        sleep: todayLog?.sleepQuality || 'good',
        muscleSoreness: 'none',
        motivation: 'moderate',
      },
      currentCycle.currentPhase
    );

  const openModal = (modalName: string, payload?: any) => {
    setActiveModal(modalName);
    setModalPayload(payload ?? null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...partial }));
  };

  const saveDayLog = (logInput: Partial<DayLog> & { date: string }) => {
    setLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.date === logInput.date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...logInput,
          cycleDay: logInput.cycleDay ?? updated[existingIdx].cycleDay ?? currentCycle.currentDay,
          symptoms: {
            ...updated[existingIdx].symptoms,
            ...logInput.symptoms,
          },
        };
        return updated;
      } else {
        const newLog: DayLog = {
          cycleDay: currentCycle.currentDay,
          symptoms: {},
          ...logInput,
        };
        return [newLog, ...prev];
      }
    });
  };

  const getLogForDate = (dateStr: string): DayLog | undefined => {
    return logs.find((l) => l.date === dateStr);
  };

  const runAdaptiveCheckIn = (inputs: AdaptiveInputs): AdaptiveRecommendationResult => {
    const result = getAdaptiveWorkoutRecommendation(inputs, currentCycle.currentPhase);
    saveDayLog({
      date: todayStr,
      energy: inputs.energy,
      adaptiveRecommendation: result,
      sleepQuality: inputs.sleep,
      symptoms: {
        ...(todayLog?.symptoms || {}),
        cramps: inputs.pain === 'none' ? undefined : (inputs.pain as any),
      },
    });
    return result;
  };

  const seedSampleData = () => {
    const freshLogs = generateRealisticSampleLogs(
      userProfile.lastPeriodStartDate,
      userProfile.avgCycleLength
    );
    setLogs(freshLogs);
    setBadges(INITIAL_BADGES);
  };

  const clearAllData = () => {
    const emptyProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      hasCompletedOnboarding: false,
    };
    setUserProfile(emptyProfile);
    setLogs([]);
    setBadges(INITIAL_BADGES.map((b) => ({ ...b, unlocked: false })));
    localStorage.clear();
  };

  const exportDataJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      appName: 'Mensera Menstrual & Fitness Companion',
      privacyDisclaimer: 'Confidential personal wellness data. 100% on-device generated.',
      userProfile,
      cycleSummary: currentCycle,
      totalLogsCount: logs.length,
      logs,
      badges,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mensera_cycle_data_${formatDateToISO(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDataCSV = () => {
    const headers = [
      'Date',
      'Cycle Day',
      'Period Flow',
      'Energy (1-5)',
      'Gym Performance (1-5)',
      'Sleep Hours',
      'Sleep Quality',
      'Workout Completed',
      'Workout Type',
      'Workout Intensity',
      'Symptoms',
    ];
    const rows = logs.map((l) => [
      l.date,
      l.cycleDay,
      l.periodFlow || 'none',
      l.energy || '',
      l.gymPerformance || '',
      l.sleepHours || '',
      l.sleepQuality || '',
      l.workoutCompleted ? 'Yes' : 'No',
      `"${l.workoutType || ''}"`,
      l.workoutIntensity || '',
      `"${Object.keys(l.symptoms || {}).join(', ')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mensera_cycle_logs_${formatDateToISO(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        currentCycle,
        logs,
        badges,
        notifications,
        activeTab,
        activeModal,
        modalPayload,
        todayLog,
        todayRecommendation,
        selectedDate,
        setActiveTab,
        openModal,
        closeModal,
        setSelectedDate,
        updateUserProfile,
        saveDayLog,
        getLogForDate,
        seedSampleData,
        clearAllData,
        exportDataJSON,
        exportDataCSV,
        markNotificationAsRead,
        runAdaptiveCheckIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
