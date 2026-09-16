import React from 'react';
import { AppContextProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/common/MobileFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/dashboard/HomeScreen';
import { CalendarScreen } from './components/calendar/CalendarScreen';
import { LogScreen } from './components/logging/LogScreen';
import { LearnScreen } from './components/learn/LearnScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { PhasesExplorerModal } from './components/phases/PhasesExplorerModal';
import { AdaptiveCheckInModal } from './components/logging/AdaptiveCheckInModal';
import { FunFactsBrowser } from './components/learn/FunFactsBrowser';
import { NutritionGuidanceModal } from './components/learn/NutritionGuidanceModal';
import { MedicalSafetyModal } from './components/learn/MedicalSafetyModal';
import { NotificationModal } from './components/notifications/NotificationModal';
import { AccountGate } from './components/auth/AccountGate';
import { ChatbotPanel } from './components/chat/ChatbotPanel';
import { FloatingChatButton } from './components/chat/FloatingChatButton';
import './App.css';

const AppContent: React.FC = () => {
  const { userProfile, activeTab, activeModal, closeModal, session, guestMode, authLoading, darkMode } = useApp();
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <MobileFrame>
      <div className={['flex flex-col min-h-screen transition-colors duration-200', darkMode ? 'bg-[#17131d]' : 'bg-[#FFF9F5]'].join(' ')}>
        {/* Sticky Mobile Header */}
        <Header />

        {/* Tab View Container */}
        <main className="flex-1 overflow-x-hidden pb-2">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'calendar' && <CalendarScreen />}
          {activeTab === 'log' && <LogScreen />}
          {activeTab === 'learn' && <LearnScreen onOpenChat={() => setChatOpen(true)} />}
          {activeTab === 'profile' && <ProfileScreen />}
        </main>

        {/* Sticky Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {(session || guestMode) && !activeModal && <FloatingChatButton onClick={() => setChatOpen(true)} />}
      {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}

      {/* Onboarding Wizard (first launch or requested from profile) */}
      {!authLoading && !session && !guestMode && <AccountGate />}
      {!authLoading && (session || guestMode) && (!userProfile.hasCompletedOnboarding || !userProfile.name.trim() || activeModal === 'onboarding') && (
        <OnboardingModal />
      )}

      {/* Global Modals */}
      {activeModal === 'phases-explorer' && <PhasesExplorerModal />}
      {activeModal === 'adaptive-checkin' && <AdaptiveCheckInModal />}
      {activeModal === 'facts-browser' && <FunFactsBrowser onClose={closeModal} />}
      {activeModal === 'nutrition-guide' && <NutritionGuidanceModal onClose={closeModal} />}
      {activeModal === 'medical-safety' && <MedicalSafetyModal onClose={closeModal} />}
      {activeModal === 'notifications' && <NotificationModal onClose={closeModal} />}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}
