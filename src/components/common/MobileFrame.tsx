import React from 'react';
export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-slate-800 font-sans antialiased selection:bg-rose-200">
      {children}
    </div>
  );
};
