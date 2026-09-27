import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authModalTab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid email or password');
      }
    } else {
      const res = await register(name, email, phone, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed');
      }
    }
  };

  const handleQuickDemoCustomer = () => {
    setEmail('chioma@example.com');
    setPassword('password123');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@bellefood.com');
    setPassword('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="relative bg-stone-50 border-b border-stone-100 p-4">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-2 max-w-xs mx-auto bg-stone-200/80 p-1 rounded-2xl">
            <button
              onClick={() => {
                setErrorMsg('');
                openAuthModal('login');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                authModalTab === 'login'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setErrorMsg('');
                openAuthModal('register');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                authModalTab === 'register'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-extrabold text-stone-900">
              {authModalTab === 'login' ? 'Welcome Back to Belle Food' : 'Create Your Foodie Account'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {authModalTab === 'login'
                ? 'Sign in to access your order history, saved addresses, and favorites.'
                : 'Join Belle Food rewards, save your favorite dishes, and order faster.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chioma Adebayo"
                    className="w-full text-xs pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full text-xs pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
            >
              {isLoading
                ? 'Processing...'
                : authModalTab === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Login Shortcuts */}
          {authModalTab === 'login' && (
            <div className="mt-5 pt-4 border-t border-stone-100 space-y-2">
              <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider text-center">
                Demo Accounts for Testing:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoCustomer}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Demo Customer</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>
          )}

          {/* Guest Checkout Option */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold underline cursor-pointer"
            >
              Continue as Guest (No account needed)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
