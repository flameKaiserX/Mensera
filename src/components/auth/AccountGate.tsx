import React, { useState } from 'react';
import { Check, LogIn, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenseraLogo } from '../common/MenseraLogo';

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

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-md p-6 shadow-2xl border border-white/60">
        <div className="text-center mb-5">
          <MenseraLogo size={72} className="mx-auto mb-3" />
          <h2 className="text-xl font-extrabold tracking-[0.18em] text-[#B4232A]">MENSERA</h2>
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
            className="w-full py-3 px-3 rounded-xl bg-[#B4232A] hover:bg-[#8F1D25] text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {mode === 'sign-in' ? <LogIn size={14} /> : <UserPlus size={14} />}
            {mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
          className="w-full mt-2 text-[11px] font-semibold text-[#B4232A] hover:text-[#8F1D25]"
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
          className="w-full mt-4 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
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