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
    <header
      className={[
        'sticky top-0 z-30 backdrop-blur-md px-4 py-3 flex items-center justify-between transition-colors duration-200 border-b',
        darkMode ? 'bg-[#17131d]/90 border-[#403649]' : 'bg-[#FFF9F5]/90 border-[#F3C7B9]/70',
      ].join(' ')}
    >
      {/* Brand & Greeting */}
      <div className="flex items-center gap-2.5">
        <MenseraLogo size={40} className="drop-shadow-sm" />
        <div>
          <h1 className="text-lg font-extrabold text-[#B4232A] tracking-tight leading-none">
            MENSERA
          </h1>
          <p className={['text-[11px] font-medium', darkMode ? 'text-slate-300' : 'text-slate-500'].join(' ')}>
            Hi, {userProfile.name || 'Friend'}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className={[
            'p-2 rounded-full border transition-colors shadow-xs',
            darkMode ? 'bg-[#241f2b] border-[#4d4056] text-[#f5eff8] hover:bg-[#2f2740]' : 'bg-white/80 border-slate-200/80 text-slate-700 hover:bg-slate-100',
          ].join(' ')}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        {/* Notifications Bell */}
        <button
          onClick={() => openModal('notifications')}
          className={[
            'relative p-2 rounded-full border transition-colors shadow-xs',
            darkMode ? 'bg-[#241f2b] border-[#4d4056] text-[#f5eff8] hover:bg-[#2f2740]' : 'bg-white/80 border-slate-200/80 text-slate-700 hover:bg-slate-100',
          ].join(' ')}
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
