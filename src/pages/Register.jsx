import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { PawBackground } from '../components/common/PawBackground';

const Field = ({ label, name, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5 font-sans">{label}</label>
    <input
      type={type} required value={value} onChange={onChange} placeholder={placeholder}
      className="w-full border border-brand-border bg-[#e8f0fe] rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-dark transition-colors"
    />
  </div>
);

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, user, status } = useSelector(s => s.auth);
  const pets = useSelector(state => state.pets.userPets[user?.id] || []);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const loading = status === 'loading';

  React.useEffect(() => { dispatch(clearError()); }, []);
  React.useEffect(() => {
    if (isAuthenticated) {
      if (pets.length === 0 && user?.role === 'customer') {
        navigate('/onboarding/pet', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, pets.length, user]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <PawBackground />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-4 -mt-10 pointer-events-none">
          <img src="/logo.png" alt="A'DOREMOM" className="h-40 w-auto object-contain mx-auto" />
        </div>

        <div className="boutique-card p-8">
          <h2 className="font-serif text-2xl font-bold text-brand-dark mb-1">Create your account</h2>
          <p className="text-sm text-brand-dark/70 font-sans mb-6">Join thousands of pet moms & dads</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-sans mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name"     name="name"     value={form.name}     onChange={set('name')}     placeholder="Your name" />
            <Field label="Email"         name="email"    value={form.email}    onChange={set('email')}    type="email" placeholder="you@example.com" />
            <Field label="Phone Number"  name="phone"    value={form.phone}    onChange={set('phone')}    placeholder="+91 XXXXX XXXXX" />
            <Field label="Password"      name="password" value={form.password} onChange={set('password')} type="password" placeholder="Min. 6 characters" />

            <button type="submit" disabled={loading} className="btn-brand w-full justify-center mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border text-center text-sm font-sans text-brand-dark/70">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-dark hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
