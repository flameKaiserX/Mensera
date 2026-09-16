import React from 'react';
import { Home, Calendar, PlusCircle, BookOpen, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  interface NavItem {
    id: 'home' | 'calendar' | 'log' | 'learn' | 'profile';
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    isCenter?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'log', label: 'Log', icon: PlusCircle, isCenter: true },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-[#FFF9F5]/95 backdrop-blur-lg border-t border-[#F3C7B9]/80 px-2 py-1.5 pb-2.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center -mt-4 group focus:outline-hidden"
              aria-label="Daily Check-in and Log"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-[#F34B43] to-[#7FA77B] text-white scale-105 shadow-rose-200'
                    : 'bg-gradient-to-tr from-[#B4232A] to-[#F34B43] text-white hover:scale-105'
                }`}
              >
                <PlusCircle size={24} className="stroke-[2.2]" />
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 ${
                  isActive ? 'text-[#B4232A] font-bold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-[#B4232A] font-semibold'
                : 'text-slate-500 hover:text-slate-700 font-normal'
            }`}
          >
            <div className="relative">
              <Icon
                size={20}
                className={`transition-transform ${
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`}
              />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#F34B43] rounded-full" />
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
