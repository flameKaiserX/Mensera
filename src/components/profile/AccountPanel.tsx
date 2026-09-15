import React, { useState } from 'react';
import { Cloud, LogIn, LogOut, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountPanel: React.FC = () => {
  const {
    session,
    authLoading,
    authError,
    syncStatus,
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
    if (!error && mode === 'sign-up') {
      setMessage('Account created. Check your email if verification is enabled.');
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
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><ShieldCheck size={17} /></div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Cloud account</h3>
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

      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <LogIn size={14} /> Continue with Google
      </button>

      <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
        <span className="h-px bg-slate-200 flex-1" /> or email <span className="h-px bg-slate-200 flex-1" />
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
          className="w-full py-2.5 px-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {mode === 'sign-in' ? <LogIn size={14} /> : <UserPlus size={14} />}
          {mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
        className="w-full text-[11px] font-semibold text-violet-700 hover:text-violet-900"
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
