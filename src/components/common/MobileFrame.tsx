import React from 'react';
import { useApp } from '../../context/AppContext';
export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useApp();

  return (
    <div
      className={[
        'min-h-screen w-full font-sans antialiased selection:bg-[#F8C6BF] transition-colors duration-200',
        darkMode ? 'dark-mode bg-[#17131d] text-[#f5eff8]' : 'bg-[#FFF9F5] text-slate-800',
      ].join(' ')}
    >
      {children}
    </div>
  );
};
