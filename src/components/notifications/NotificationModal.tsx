import React from 'react';
import { X, Bell, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, userProfile, updateUserProfile, setActiveTab } =
    useApp();

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
      onClose();
    }
  };

  const toggleSetting = (key: keyof typeof userProfile.notificationsEnabled) => {
    updateUserProfile({
      notificationsEnabled: {
        ...userProfile.notificationsEnabled,
        [key]: !userProfile.notificationsEnabled[key],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-white/60 flex flex-col justify-between">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Supportive Notifications
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Private, gentle wellness & cycle alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1">
          {/* Notification List */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Recent Reminders
            </span>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-white border-slate-200/80 opacity-75'
                    : 'bg-gradient-to-r from-violet-50/90 to-rose-50/70 border-violet-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{n.date}</span>
                  </span>
                  {n.actionTab && (
                    <span className="font-bold text-violet-600">Tap to view</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Optional Notification Preferences */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Notification Preferences
            </span>
            <p className="text-xs text-slate-500">
              All reminders are 100% optional and under your full control.
            </p>

            <div className="space-y-2.5 pt-1">
              {[
                {
                  key: 'periodApproaching' as const,
                  label: 'Period approaching reminder',
                  desc: '“Your period may be approaching. How are you feeling today?”',
                },
                {
                  key: 'fertileWindow' as const,
                  label: 'Estimated fertile window alerts',
                  desc: '“Your estimated fertile window is approaching.”',
                },
                {
                  key: 'recoveryAlerts' as const,
                  label: 'Adaptive recovery suggestions',
                  desc: '“Your energy has been lower recently. Want to switch to recovery mode?”',
                },
                {
                  key: 'mindsetBoosts' as const,
                  label: 'Gentle mindset reinforcement',
                  desc: '“Remember: adjusting your workout isn’t giving up.”',
                },
              ].map((pref) => (
                <div
                  key={pref.key}
                  className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-800">{pref.label}</h5>
                    <p className="text-[10px] text-slate-500 italic mt-0.5">{pref.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.notificationsEnabled[pref.key]}
                    onChange={() => toggleSetting(pref.key)}
                    className="mt-1 w-4 h-4 rounded-sm accent-violet-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-[#FAF7F2]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-violet-700 text-white font-bold text-xs hover:bg-violet-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
