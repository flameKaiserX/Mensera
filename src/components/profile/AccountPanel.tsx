import React, { useState } from 'react';
import { Cloud, LogIn, LogOut, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountPanel: React.FC = () => {
  const {
    session,
    authLoading,
    authError,
    syncStatus,
    userProfile,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  } = useApp();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const error = mode === 'sign-in' ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);
    if (!error && mode === 'sign-up' && !authError) {
      setMessage('Account created. Check your email to confirm it, then sign in here.');
    }
  };

  const handleGoogle = async () => {
    setMessage(null);
    setSubmitting(true);
    await signInWithGoogle();
    setSubmitting(false);
  };

  const handleLogout = async () => {
    setMessage(null);
    setSubmitting(true);
    await signOut();
    setSubmitting(false);
  };

  if (authLoading) {
    return <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs text-xs text-slate-500">Checking account session...</div>;
  }

  if (session) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FBE0D8] border border-[#F3B8A8] text-[#B4232A] flex items-center justify-center text-base font-extrabold">
              {(userProfile.name.trim() || 'Friend').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">{userProfile.name.trim() || 'Friend'}</h3>
              <p className="text-[11px] text-slate-500">{session.user.email}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
            <Cloud size={12} /> {syncStatus === 'synced' ? 'Synced' : syncStatus}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your profile and cycle logs are synced to your private account. Local data was merged when you signed in.
        </p>
        {authError && <p className="text-xs text-rose-700 font-semibold">{authError}</p>}
        <button
          type="button"
          onClick={handleLogout}
          disabled={submitting}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
      <div>
        <h3 className="text-sm font-extrabold text-slate-800">Save your Mensera data</h3>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          Use guest mode on this device, or create an account to sync your profile and cycle logs securely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <label className="block">
          <span className="sr-only">Email address</span>
          <span className="flex items-center gap-2 px-3 rounded-xl bg-slate-50 border border-slate-200">
            <Mail size={14} className="text-slate-400" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="w-full py-2.5 bg-transparent text-xs text-slate-800 outline-none"
            />
          </span>
        </label>
        <label className="block">
          <span className="sr-only">Password</span>
          <span className="flex items-center gap-2 px-3 rounded-xl bg-slate-50 border border-slate-200">
            <ShieldCheck size={14} className="text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password (at least 6 characters)"
              className="w-full py-2.5 bg-transparent text-xs text-slate-800 outline-none"
            />
          </span>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 px-3 rounded-xl bg-[#B4232A] hover:bg-[#8F1D25] text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {mode === 'sign-in' ? <LogIn size={14} /> : <UserPlus size={14} />}
          {mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <div className="flex items-center gap-2 my-4 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
        <span className="h-px bg-slate-200 flex-1" /> or continue with <span className="h-px bg-slate-200 flex-1" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <span className="text-base font-extrabold leading-none">G</span>
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
        className="w-full text-[11px] font-semibold text-[#B4232A] hover:text-[#8F1D25]"
      >
        {mode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
      </button>

      {(authError || message) && (
        <p className={`text-xs font-semibold ${authError ? 'text-rose-700' : 'text-emerald-700'}`}>
          {authError || message}
        </p>
      )}
    </div>
  );
};
