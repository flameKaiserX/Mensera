import React from 'react';
import { useApp } from '../../context/AppContext';
export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen w-full bg-[#FAF7F2] text-slate-800 font-sans antialiased selection:bg-rose-200 ${darkMode ? 'dark-mode' : ''}`}>
      {children}
    </div>
  );
};
