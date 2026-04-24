import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, ImagePlay,
  FileText, BarChart3, LogOut, Menu, X, ChevronRight,
  Tag, Star, Settings, ClipboardList, MessageCircle, PawPrint
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard',   icon: LayoutDashboard, to: '/admin' },
  { label: 'Orders',      icon: ShoppingBag,      to: '/admin/orders' },
  { label: 'Products',    icon: Package,          to: '/admin/products' },
  { label: 'Customers',   icon: Users,            to: '/admin/customers' },
  { label: 'Inventory',   icon: ClipboardList,    to: '/admin/inventory' },
  { label: 'Pet Profiles', icon: PawPrint,          to: '/admin/pet-profiles' },
  { label: 'Coupons',     icon: Tag,              to: '/admin/coupons' },
  { label: 'Reviews',     icon: Star,             to: '/admin/reviews' },
  { label: 'Enquiries',   icon: MessageCircle,    to: '/admin/enquiries' },
  { label: 'Banners',     icon: ImagePlay,        to: '/admin/banners' },
  { label: 'Content',     icon: FileText,         to: '/admin/content' },
  { label: 'Analytics',   icon: BarChart3,        to: '/admin/analytics' },
  { label: 'Settings',    icon: Settings,         to: '/admin/settings' },
];

const SidebarContent = ({ onClose, location, handleLogout }) => (
  <div
    className="flex flex-col h-full"
    style={{ backgroundColor: '#fcfcfc' }}
  >
    {/* Logo */}
    <div className="px-6 py-4 border-b border-brand-border/50">
      <div className="flex items-center justify-between">
        <Link to="/" className="block">
          <img 
            src="/logo.png" 
            alt="A'DOREMOM Couture" 
            className="h-18 w-auto object-contain"
          />
          <p className="text-[9px] text-brand-dark/50 uppercase tracking-[0.2em] font-sans">Super Admin Dashboard</p>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-brand-dark/60 hover:text-brand-dark p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>

    {/* Nav items */}
    <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
      {NAV.map(({ label, icon: Icon, to }) => {
        const active = location.pathname === to;
        return (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold font-sans transition-all duration-200 ${
              active
                ? 'bg-[#e8f0fe] text-brand-blue'
                : 'text-brand-dark/70 hover:bg-brand-muted hover:text-brand-dark'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-blue' : ''}`} />
            {label}
          </Link>
        );
      })}
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
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-brand-border" style={{ backgroundColor: '#fcfcfc' }}>
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
        style={{ backgroundColor: '#fcfcfc' }}
      >
        <SidebarContent location={location} handleLogout={handleLogout} onClose={() => setOpen(false)} />
      </motion.div>
    </>
  );
};

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector(s => s.auth);
  const currentPage = NAV.find(n => n.to === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-brand-border px-6 sm:px-10 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-brand-dark/70 hover:text-brand-dark">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-2xl font-bold text-brand-dark">
              {currentPage === 'Dashboard' ? 'Admin Dashboard' : currentPage}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-brand-light/30 px-3 py-1.5 rounded-full cursor-pointer hover:bg-brand-light/50 transition border border-brand-border/50">
              <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-sm font-bold text-brand-dark overflow-hidden border border-brand-border">
                {user?.name?.[0] || 'A'}
              </div>
              <span className="text-sm font-bold text-brand-dark pr-2">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-brand-dark/50 rotate-90" />
            </div>
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
