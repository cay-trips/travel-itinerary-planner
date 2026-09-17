import React, { useState } from 'react';

interface AuthModalProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onBackToHome: () => void;
  authMessage?: string | null;
  formError?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onLogin,
  onRegister,
  onForgotPassword,
  onBackToHome,
  authMessage,
  formError,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else if (mode === 'register') {
        await onRegister(email, password, name);
      } else if (mode === 'forgot') {
        await onForgotPassword(email);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-24 text-white">
      <div className="w-full max-w-md p-8 bg-[#0A0D14] border border-white/20 rounded-2xl shadow-2xl relative">
        <button
          type="button"
          onClick={onBackToHome}
          className="absolute top-6 right-6 text-white/40 hover:text-white font-mono text-xs uppercase cursor-pointer"
        >
          ✕ Close
        </button>

        <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          SECURITY ACCESS GATE
        </div>
        <h2 className="font-mono text-2xl font-bold uppercase mb-6">
          {mode === 'login'
            ? 'Operator Login'
            : mode === 'register'
            ? 'Commission Account'
            : 'Reset Credentials'}
        </h2>

        {authMessage && (
          <div className="mb-6 p-4 bg-[#2F6F62]/20 border border-[#2F6F62]/40 rounded-xl font-mono text-xs text-[#4EAA98]">
            {authMessage}
          </div>
        )}

        {formError && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-xl font-mono text-xs text-red-300">
            ⚠ {formError}
          </div>
        )}

        {mode !== 'forgot' && (
          <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl mb-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              LOG IN
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              REGISTER
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarush Vijay"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase mb-1">
              Account Email
            </label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-xs text-white/70 uppercase">
                  Passcode
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="font-mono text-[11px] text-[#E3A008] hover:underline cursor-pointer"
                  >
                    Forgot passcode?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-[0_0_20px_rgba(227,160,8,0.25)] active:scale-95 disabled:opacity-50"
          >
            {loading
              ? 'AUTHENTICATING...'
              : mode === 'login'
              ? 'ENTER COCKPIT'
              : mode === 'register'
              ? 'CREATE SUPABASE ACCOUNT'
              : 'SEND RESET LINK'}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center font-mono text-xs text-white/50 hover:text-white pt-2 cursor-pointer"
            >
              ← Back to login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
