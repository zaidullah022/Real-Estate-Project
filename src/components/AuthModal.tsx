import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail 
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await signInWithGoogle();
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setErrorMessage(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      let user: UserProfile;
      if (mode === 'signup') {
        user = await registerWithEmail(email, password, name || 'Homevia Member');
      } else {
        user = await loginWithEmail(email, password);
      }
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please Sign In.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Try demo login below.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'buyer' | 'seller') => {
    const demoUser: UserProfile = role === 'seller' ? {
      uid: 'demo-seller-marcus',
      displayName: 'Marcus Vance',
      email: 'marcus.vance@homevia.luxury',
      photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      role: 'seller'
    } : {
      uid: 'demo-buyer-elena',
      displayName: 'Elena Rostova',
      email: 'elena.rostova@homevia.luxury',
      photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      role: 'buyer'
    };

    onSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#08090b]/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12141b]/95 backdrop-blur-2xl border border-[#c8a97e]/30 rounded-[32px] overflow-hidden shadow-2xl shadow-black/90 my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0c0d10]/70 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a1d26] border border-[#c8a97e]/30 flex items-center justify-center text-[#dfc5a4] font-serif font-bold shadow-md">
              H
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {mode === 'signin' ? 'Welcome to Homevia' : 'Create Homevia Account'}
              </h3>
              <p className="text-[11px] text-stone-400 font-light">
                {mode === 'signin' ? 'Sign in to manage bookings and listings' : 'Join our luxury architectural real estate collective'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full border border-white/15 bg-[#0c0d10]/60 hover:bg-[#1a1d26] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all backdrop-blur-md cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-[11px] uppercase tracking-wider text-stone-400">Or with email</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@homevia.luxury"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-lg shadow-[#c8a97e]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4 text-[#0c0d10]" />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-[#0c0d10]" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In & Sign Up */}
          <div className="text-center pt-1">
            {mode === 'signin' ? (
              <p className="text-xs text-stone-400">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-[#dfc5a4] hover:underline font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-[#dfc5a4] hover:underline font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* 1-Click Instant Demo Login Section */}
          <div className="p-4 bg-[#0c0d10]/60 backdrop-blur-md rounded-2xl border border-[#c8a97e]/20 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#dfc5a4] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Instant Demo Accounts (Test Easily)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer')}
                className="p-2.5 rounded-xl bg-[#171920] hover:bg-[#20232c] border border-white/10 text-left transition-colors cursor-pointer"
              >
                <p className="text-xs font-bold text-white">Elena (Buyer)</p>
                <p className="text-[10px] text-stone-400 font-light">Book viewings</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seller')}
                className="p-2.5 rounded-xl bg-[#171920] hover:bg-[#20232c] border border-white/10 text-left transition-colors cursor-pointer"
              >
                <p className="text-xs font-bold text-white">Marcus (Seller)</p>
                <p className="text-[10px] text-stone-400 font-light">Add & edit listings</p>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
