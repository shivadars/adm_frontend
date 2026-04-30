import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../features/auth/authSlice';
import {
  User, Package, Heart, LogOut, LayoutDashboard,
  ShoppingBag, Settings, ChevronRight, LogIn, UserPlus
} from 'lucide-react';

// ─── Panel animation ───────────────────────────────────────────────────────────
const PANEL_VARIANTS = {
  hidden:  { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1     },
  exit:    { opacity: 0, y: -8, scale: 0.97  },
};

// ─── Menu item ─────────────────────────────────────────────────────────────────
const MenuItem = ({ icon: Icon, label, to, onClick, accent }) => {
  const inner = (
    <div
      className="flex items-center gap-3 px-5 py-3 cursor-pointer group transition-colors duration-150 hover:bg-brand-muted"
      onClick={onClick}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${accent ? 'bg-brand-blue/10' : 'bg-brand-dark/5'}`}
      >
        <Icon
          className={`w-4 h-4 transition-colors ${accent ? 'text-brand-blue' : 'text-brand-dark'}`}
        />
      </div>
      <span
        className={`text-sm font-semibold font-sans flex-1 ${accent ? 'text-brand-blue' : 'text-brand-dark'}`}
      >
        {label}
      </span>
      <ChevronRight
        className="w-3.5 h-3.5 text-brand-dark/30 group-hover:text-brand-dark/70 transition-colors"
      />
    </div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
};

// ─── Divider ───────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="mx-5 border-t border-brand-border" />
);

// ─── Guest panel ───────────────────────────────────────────────────────────────
const GuestPanel = ({ onClose }) => (
  <>
    {/* Header */}
    <div className="px-5 pt-5 pb-4">
      <p className="font-serif text-lg font-bold text-brand-dark leading-tight">
        Welcome! 🐾
      </p>
      <p className="text-xs text-brand-dark/70 font-sans mt-1 leading-relaxed">
        Login to access your orders, wishlist, and profile.
      </p>

      <div className="flex gap-2 mt-4">
        <Link
          to="/login"
          onClick={onClose}
          className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl transition-colors font-sans bg-brand-dark text-brand-light hover:bg-brand-blue hover:text-white"
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={onClose}
          className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl border-2 transition-colors font-sans border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-light"
        >
          Sign Up
        </Link>
      </div>
    </div>

    <Divider />

    {/* Guest limited menu */}
    <div className="py-2">
      <p className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] font-sans text-brand-blue">
        Browse
      </p>
      <MenuItem
        icon={Package}
        label="My Orders"
        to="/login?next=/profile"
        onClick={onClose}
      />
      <MenuItem
        icon={Heart}
        label="Wishlist"
        to="/login?next=/wishlist"
        onClick={onClose}
      />
    </div>
  </>
);

// ─── Customer panel ────────────────────────────────────────────────────────────
const CustomerPanel = ({ user, onClose, onLogout }) => (
  <>
    {/* User header */}
    <div className="px-5 pt-5 pb-4 flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold shrink-0 bg-brand-dark text-brand-light"
      >
        {user?.name?.[0]?.toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="font-serif font-bold text-brand-dark text-base leading-tight truncate">
          {user?.name}
        </p>
        <p className="text-[11px] text-brand-dark/50 font-sans truncate">{user?.email}</p>
      </div>
    </div>

    <Divider />

    {/* Main menu */}
    <div className="py-2">
      <p className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] font-sans text-brand-blue">
        My Account
      </p>
      <MenuItem icon={User}    label="My Profile" to="/profile"  onClick={onClose} />
      <MenuItem icon={Package} label="My Orders"  to="/profile"  onClick={onClose} />
      <MenuItem icon={Heart}   label="Wishlist"   to="/profile"  onClick={onClose} />
    </div>

    <Divider />

    {/* Logout */}
    <div className="py-2 pb-3">
      <MenuItem icon={LogOut} label="Sign Out" onClick={() => { onClose(); onLogout(); }} accent />
    </div>
  </>
);

// ─── Admin panel ───────────────────────────────────────────────────────────────
const AdminPanel = ({ user, onClose, onLogout }) => (
  <>
    {/* Admin header */}
    <div className="px-5 pt-5 pb-4">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2 h-2 rounded-full bg-brand-dark"
        />
        <p className="text-[10px] font-bold uppercase tracking-widest font-sans text-brand-dark">
          Admin
        </p>
      </div>
      <p className="font-serif font-bold text-brand-dark text-lg leading-tight">{user?.name}</p>
      <p className="text-[11px] text-brand-dark/50 font-sans">{user?.email}</p>
    </div>

    <Divider />

    {/* Admin menu */}
    <div className="py-2">
      <p className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] font-sans text-brand-blue">
        Admin Panel
      </p>
      <MenuItem icon={LayoutDashboard} label="Dashboard"       to="/admin"           onClick={onClose} />
      <MenuItem icon={ShoppingBag}     label="Manage Products" to="/admin/products"  onClick={onClose} />
      <MenuItem icon={Package}         label="All Orders"      to="/admin/orders"    onClick={onClose} />
      <MenuItem icon={Settings}        label="Site Content"    to="/admin/content"   onClick={onClose} />
    </div>

    <Divider />

    {/* View site + logout */}
    <div className="py-2 pb-3">
      <MenuItem icon={LogOut} label="Sign Out" onClick={() => { onClose(); onLogout(); }} accent />
    </div>
  </>
);

// ─── Main component ────────────────────────────────────────────────────────────
export const ProfilePanel = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, role } = useSelector(s => s.auth);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          variants={PANEL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden z-50 bg-white border border-brand-border shadow-boutique-hover"
        >
          {!isAuthenticated && (
            <GuestPanel onClose={onClose} />
          )}
          {isAuthenticated && role === 'customer' && (
            <CustomerPanel user={user} onClose={onClose} onLogout={handleLogout} />
          )}
          {isAuthenticated && (role === 'admin' || role === 'superadmin') && (
            <AdminPanel user={user} onClose={onClose} onLogout={handleLogout} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
