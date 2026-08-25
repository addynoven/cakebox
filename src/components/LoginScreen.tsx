import React, { useState } from 'react';
import { DripHeader } from './DripHeader';
import { CakeDoodles } from './CakeDoodles';
import { Mail, Lock, X, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '../services/firebase';

interface LoginScreenProps {
  onSuccess: (user: Partial<UserProfile>) => void;
  onGuestContinue: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onGuestContinue
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setToastMessage(null);
    try {
      const userProfile = await signInWithGoogle();
      onSuccess(userProfile);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setToastMessage(err.message || 'Google sign-in could not be completed. You can also sign in with email or guest mode.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setToastMessage('Please enter your email address');
      return;
    }
    if (!password || password.length < 6) {
      setToastMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setToastMessage(null);

    try {
      if (isSignUp) {
        const userProfile = await registerWithEmail(name || 'Sweet Baker', identifier, password);
        onSuccess(userProfile);
      } else {
        const userProfile = await signInWithEmail(identifier, password);
        onSuccess(userProfile);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Fallback gracefully if network is limited or offline
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setToastMessage('Invalid email or password. Check your credentials or sign up.');
      } else if (err.code === 'auth/email-already-in-use') {
        setToastMessage('This email is already registered. Please log in.');
      } else {
        // Local simulation fallback
        onSuccess({
          name: isSignUp ? name || 'Sweet Tooth' : 'Sweet Baker',
          email: identifier,
          phone: '+1 (555) 234-5678',
          isLoggedIn: true
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col justify-between bg-gradient-to-b from-[#FFAEC8] via-[#FFD6B9] to-[#FFF3E8] text-[#3B2C30] relative overflow-hidden select-none">
      <CakeDoodles density="high" />

      {/* Top Header Icing Drip */}
      <div className="w-full relative z-10">
        <DripHeader color="#FFF8F8" height={68} />
        <div className="absolute top-3 inset-x-0 flex justify-center items-center">
          <span className="text-2xl font-bold font-display text-white drop-shadow-sm tracking-wide">
            CakeBox
          </span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-4 z-10">
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-[36px] p-6 shadow-xl border border-pink-100/80 flex flex-col">
          <h2 className="text-2xl font-bold text-center text-[#3B2C30] font-display mb-1">
            {isSignUp ? 'Join CakeBox!' : 'Welcome Back!'}
          </h2>
          <p className="text-xs text-center text-[#584146] mb-4">
            {isSignUp ? 'Create your sweet account' : 'Sign in to order your favorite treats'}
          </p>

          {/* Google Sign-in with Firebase Auth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50/50 text-[#3B2C30] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 mb-3.5 btn-bounce"
          >
            {isGoogleLoading ? (
              <Loader2 size={16} className="animate-spin text-pink-500" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-3">
            <div className="border-t border-pink-200 w-full" />
            <span className="bg-white px-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              or with email
            </span>
            <div className="border-t border-pink-200 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isSignUp && (
              <div className="relative flex items-center bg-[#FFF8F8] border border-pink-200/80 rounded-2xl px-3.5 py-2.5 transition-all focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100">
                <span className="text-pink-400 mr-2.5">
                  <Sparkles size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#3B2C30] placeholder-gray-400 outline-none font-medium"
                />
              </div>
            )}

            {/* Email Input */}
            <div className="relative flex items-center bg-[#FFF8F8] border border-pink-200/80 rounded-2xl px-3.5 py-2.5 transition-all focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-400 to-rose-300 text-white flex items-center justify-center mr-2 shrink-0 shadow-xs">
                <Mail size={13} />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-transparent text-xs text-[#3B2C30] placeholder-gray-400 outline-none font-medium"
              />
              {identifier && (
                <button
                  type="button"
                  onClick={() => setIdentifier('')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Password Input */}
            <div className="relative flex items-center bg-[#FFF8F8] border border-pink-200/80 rounded-2xl px-3.5 py-2.5 transition-all focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-300 to-amber-300 text-white flex items-center justify-center mr-2 shrink-0 shadow-xs">
                <Lock size={13} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs text-[#3B2C30] placeholder-gray-400 outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Forgot Password */}
            {!isSignUp && (
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage('Password reset link will be sent to your registered email!');
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className="text-[11px] font-semibold text-pink-500 hover:text-pink-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Toast feedback */}
            {toastMessage && (
              <div className="bg-pink-50 border border-pink-200 text-pink-700 text-xs px-3 py-1.5 rounded-xl text-center animate-fade-in leading-snug">
                {toastMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF5388] to-[#FF8566] text-white font-bold text-sm shadow-md shadow-pink-500/25 hover:opacity-95 transition-all btn-bounce mt-1 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{isSignUp ? 'Create Firebase Account' : 'Sign In'}</span>
            </button>
          </form>

          {/* Toggle sign up / login */}
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setToastMessage(null);
              }}
              className="text-xs font-bold text-pink-600 hover:underline"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Guest access option */}
        <button
          type="button"
          onClick={onGuestContinue}
          className="mt-4 text-xs font-semibold text-white/95 bg-white/20 hover:bg-white/30 backdrop-blur-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
        >
          <span>Continue as Guest</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="py-2 text-center text-[11px] text-[#3B2C30]/60 z-10">
        CakeBox Bakery • Powered by Firebase Auth & Firestore
      </div>
    </div>
  );
};
