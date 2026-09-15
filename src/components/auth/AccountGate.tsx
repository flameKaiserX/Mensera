import React, { useState } from 'react';
import { Check, LogIn, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountGate: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, continueAsGuest, authError } = useApp();
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

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-md p-6 shadow-2xl border border-white/60">
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-rose-500 text-white flex items-center justify-center shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">Welcome to Mensera</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Create an account or sign in to keep your profile and cycle logs synced securely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <label className="block">
            <span className="sr-only">Email address</span>
            <span className="flex items-center gap-2 px-3 rounded-xl bg-white border border-slate-200">
              <Mail size={14} className="text-slate-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full py-3 bg-transparent text-xs text-slate-800 outline-none"
              />
            </span>
          </label>
          <label className="block">
            <span className="sr-only">Password</span>
            <span className="flex items-center gap-2 px-3 rounded-xl bg-white border border-slate-200">
              <ShieldCheck size={14} className="text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password (at least 6 characters)"
                className="w-full py-3 bg-transparent text-xs text-slate-800 outline-none"
              />
            </span>
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {mode === 'sign-in' ? <LogIn size={14} /> : <UserPlus size={14} />}
            {mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
          className="w-full mt-2 text-[11px] font-semibold text-violet-700 hover:text-violet-900"
        >
          {mode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>

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
          onClick={continueAsGuest}
          className="w-full mt-4 py-2.5 px-3 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Check size={14} /> Continue as guest
        </button>

        {(authError || message) && (
          <p className={`mt-3 text-xs font-semibold ${authError ? 'text-rose-700' : 'text-emerald-700'}`}>
            {authError || message}
          </p>
        )}
      </div>
    </div>
  );
};