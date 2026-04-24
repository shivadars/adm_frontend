import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { PawBackground } from '../components/common/PawBackground';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { error, isAuthenticated, role, user, status } = useSelector(s => s.auth);
  const pets = useSelector(state => state.pets.userPets[user?.id] || []);

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const loading = status === 'loading';

  React.useEffect(() => {
    dispatch(clearError());
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === 'customer' && pets.length === 0) {
        navigate('/onboarding/pet', { replace: true });
      } else {
        navigate(params.get('next') || '/', { replace: true });
      }
    }
  }, [isAuthenticated, role, pets.length, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <PawBackground />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand header */}
        <div className="text-center mb-4 -mt-10 pointer-events-none">
          <img src="/logo.png" alt="A'DOREMOM" className="h-40 w-auto object-contain mx-auto" />
        </div>

        <div className="boutique-card p-8">
          <h2 className="font-serif text-2xl font-bold text-brand-dark mb-1">Welcome back</h2>
          <p className="text-sm text-brand-dark/70 font-sans mb-6">Sign in to your account to continue</p>

          {params.get('next') && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-sans mb-4">
              🔒 Please login to continue
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-sans mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5 font-sans">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full border border-brand-border bg-[#e8f0fe] rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-dark transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5 font-sans">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full border border-brand-border bg-[#e8f0fe] rounded-xl px-4 py-3 pr-11 text-sm font-sans focus:outline-none focus:border-brand-dark transition-colors"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-3 text-brand-dark/50 hover:text-brand-dark/80">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-brand w-full justify-center mt-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border text-center text-sm font-sans text-brand-dark/70">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-dark hover:underline">Create one free</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
