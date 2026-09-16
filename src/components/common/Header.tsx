import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenseraLogo } from './MenseraLogo';

export const Header: React.FC = () => {
  const {
    notifications,
    openModal,
    userProfile,
    darkMode,
    toggleDarkMode,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-[#F3C7B9]/70 px-4 py-3 flex items-center justify-between">
      {/* Brand & Greeting */}
      <div className="flex items-center gap-2.5">
        <MenseraLogo size={40} className="drop-shadow-sm" />
        <div>
          <h1 className="text-lg font-extrabold text-[#B4232A] tracking-tight leading-none">
            MENSERA
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            Hi, {userProfile.name || 'Friend'}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        {/* Notifications Bell */}
        <button
          onClick={() => openModal('notifications')}
          className="relative p-2 rounded-full bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          aria-label="View notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
