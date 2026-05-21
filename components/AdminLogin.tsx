'use client';

import { useState } from 'react';
import BackgroundStickers from './BackgroundStickers';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      sessionStorage.setItem('adminAuthenticated', 'true');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center px-4 relative selection:bg-indigo-500/25">
      <BackgroundStickers />
      
      <div className="glass-panel rounded-3xl border border-slate-200/40 dark:border-zinc-800/40 p-8 max-w-md w-full shadow-[0_8px_35px_rgba(0,0,0,0.01)] backdrop-blur-xl relative z-10 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-zinc-50 mb-2 text-center tracking-tight">Admin Console</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-xs text-center mb-6">Enter credentials to unlock administrative settings</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Access Token / Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 dark:text-zinc-100 bg-white/70 dark:bg-zinc-900/50 placeholder:text-slate-400 dark:placeholder:text-zinc-650 transition-all duration-300"
              placeholder="••••••••••••"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white dark:bg-zinc-50 dark:text-zinc-900 py-3.5 px-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 active:scale-99 transition-all duration-200 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed text-xs cursor-pointer shadow-sm mt-2"
          >
            {isLoading ? 'Decrypting Access Key...' : 'Unlock Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
