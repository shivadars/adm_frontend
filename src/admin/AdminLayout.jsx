import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, ImagePlay,
  FileText, LogOut, Menu, X,
  Tag, Star, Settings, MessageCircle, PawPrint
} from 'lucide-react';

const NAV_PRIMARY = [
  { label: 'Dashboard',    icon: LayoutDashboard, to: '/admin' },
  { label: 'Products',     icon: Package,         to: '/admin/products' },
  { label: 'Coupons',      icon: Tag,             to: '/admin/coupons' },
  { label: 'Manage Site',  icon: Settings,        to: '/' },
  { label: 'Content',      icon: FileText,        to: '/admin/content' },
  { label: 'Banners',      icon: ImagePlay,       to: '/admin/banners' },
  { label: 'Pet Profiles', icon: PawPrint,        to: '/admin/pet-profiles' },
];

const NAV_SECONDARY = [
  { label: 'Customers',   icon: Users,           to: '/admin/customers' },
  { label: 'Orders',      icon: ShoppingBag,     to: '/admin/orders' },
  { label: 'Reviews',     icon: Star,            to: '/admin/reviews' },
  { label: 'Enquiries',   icon: MessageCircle,   to: '/admin/enquiries' },
];

const NAV = [...NAV_PRIMARY, ...NAV_SECONDARY];

const SidebarContent = ({ onClose, location, handleLogout }) => (
  <div
    className="flex flex-col h-full"
    style={{ backgroundColor: '#e0f4ee' }}
  >
    {/* Logo */}
    <div className="px-6 py-4 border-b border-brand-border/50">
      <div className="flex items-center justify-between">
        <Link to="/" className="block">
          <img 
            src="/newlogo.png" 
            alt="A'DOREMOM Couture" 
            className="h-20 w-full object-contain mx-auto"
          />
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-brand-dark/60 hover:text-brand-dark p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>

    {/* Nav items */}
    <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-0.5">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-dark/40 px-4 pb-2 pt-1 font-sans">Admin Menu</p>
      {NAV_PRIMARY.map(({ label, icon: Icon, to }) => {
        const active = location.pathname === to;
        return (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold font-sans transition-all duration-200 ${
              active
                ? 'bg-[#073b3a] text-white'
                : 'text-brand-dark/70 hover:bg-brand-muted hover:text-brand-dark'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
            {label}
          </Link>
        );
      })}

      <div className="pt-4">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-dark/40 px-4 pb-2 font-sans">Customers</p>
        {NAV_SECONDARY.map(({ label, icon: Icon, to }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold font-sans transition-all duration-200 ${
                active
                  ? 'bg-[#073b3a] text-white'
                  : 'text-brand-dark/70 hover:bg-brand-muted hover:text-brand-dark'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>

    {/* Logout */}
    <div className="px-4 py-4 border-t border-brand-border/50">
      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold font-sans text-brand-dark/70 hover:bg-brand-muted hover:text-brand-dark transition-all duration-200 w-full text-left">
        <LogOut className="w-4 h-4 shrink-0" />
        Logout
      </button>
    </div>
  </div>
);

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <>
      {/* ── Desktop static sidebar ───────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-brand-border" style={{ backgroundColor: '#e0f4ee' }}>
        <SidebarContent location={location} handleLogout={handleLogout} onClose={null} />
      </aside>

      {/* ── Mobile: overlay + animated drawer ────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 left-0 bottom-0 w-[260px] z-50 lg:hidden flex flex-col border-r border-brand-border"
        style={{ backgroundColor: '#e0f4ee' }}
      >
        <SidebarContent location={location} handleLogout={handleLogout} onClose={() => setOpen(false)} />
      </motion.div>
    </>
  );
};

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, role } = useSelector(s => s.auth);
  const currentPage = NAV.find(n => n.to === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#e0f4ee] overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-[#e0f4ee] border-b border-brand-border px-6 sm:px-10 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-brand-dark/70 hover:text-brand-dark">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-2xl font-bold text-brand-dark">
              {currentPage === 'Dashboard' ? ((role?.toLowerCase() === 'superadmin' || user?.role?.toLowerCase() === 'superadmin') ? 'Superadmin Dashboard' : 'Admin Dashboard') : currentPage}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Empty space on the right, user pill removed as requested */}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
