import React from 'react';
import { useApp } from '../../context/AppContext';
export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen w-full bg-[#FFF9F5] text-slate-800 font-sans antialiased selection:bg-[#F8C6BF] ${darkMode ? 'dark-mode' : ''}`}>
      {children}
    </div>
  );
};
