import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, ChevronDown, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleCart } from '../../features/cart/cartSlice';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { ProfilePanel } from './ProfilePanel';
import { PetProfileIcon } from './PetProfileIcon';

const NAV_ITEMS = [
  {
    label: 'Male Design', key: 'male',
    links: [
      'Casual', 'Party Wear', 'Festive', 'Tuxedo'
    ],
    featured: {
      name: 'Boy\'s Classic Tuxedo Set',
      price: '₹1,299',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
      tag: 'Trending',
    },
    featured2: {
      name: 'Festive Party Hoodie',
      price: '₹899',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop',
      tag: 'New',
    },
    featured3: {
      name: 'Smart Casual Blazer',
      price: '₹1,599',
      image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400&h=400&fit=crop',
      tag: 'Sale',
    },
  },
  {
    label: 'Female Design', key: 'female',
    links: [
      'Casual', 'Designer', 'Festive', 'Party Wear', 'Skirt Top/ Co-ords', 'Lehengas'
    ],
    featured: {
      name: 'Princess Ruffle Frock',
      price: '₹1,499',
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop',
      tag: 'Bestseller',
    },
    featured2: {
      name: 'Festive Designer Gown',
      price: '₹1,899',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      tag: 'Special',
    },
    featured3: {
      name: 'Floral Summer Dress',
      price: '₹1,199',
      image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=400&h=400&fit=crop',
      tag: 'Trending',
    },
  },
  {
    label: 'Accessories', key: 'accessories',
    links: [
      'Bandana', 'Caps', 'HairClips', 'Ties'
    ],
    featured: {
      name: 'Floral Bandana Trio',
      price: '₹299',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=400&fit=crop',
      tag: 'Popular',
    },
    featured2: {
      name: 'Bow & Clips Gift Set',
      price: '₹499',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
      tag: 'Gift',
    },
    featured3: {
      name: 'Designer Sunglasses',
      price: '₹599',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
      tag: 'New',
    },
  },
];

const FeaturedCard = ({ item: f, collectionKey, onClose }) => (
  <Link to={`/shop?category=${collectionKey}`} onClick={onClose} className="block group">
    <div className="relative h-44 xl:h-48 w-full rounded-2xl overflow-hidden mb-3">
      <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <span className="absolute top-3 left-3 bg-white text-brand-dark text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
        {f.tag}
      </span>
    </div>
    <h5 className="font-bold text-brand-dark text-sm leading-tight mb-1">{f.name}</h5>
    <p className="text-brand-blue text-xs font-bold">{f.price}</p>
  </Link>
);

const MegaMenu = ({ item, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className="absolute top-full left-0 right-0 bg-white border-t border-brand-border z-40 shadow-boutique-hover mt-[1px]"
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-10">
      <div className="flex w-full gap-10 xl:gap-14 justify-between">

        {/* Left: subcategory links list downwards */}
        <div className="shrink-0 min-w-[280px]">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 text-brand-blue">{item.label}</h4>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {item.links.map((sub) => (
              <Link
                key={sub}
                to={`/shop?category=${item.key}&sub=${encodeURIComponent(sub)}`}
                onClick={onClose}
                className="text-sm text-brand-dark hover:text-brand-blue font-medium transition-colors w-fit block"
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: featured products */}
        <div className="hidden lg:flex gap-6 xl:gap-8 ml-auto">
          <div className="w-52 xl:w-60 shrink-0">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 text-brand-blue">Featured</h4>
            <FeaturedCard item={item.featured} collectionKey={item.key} onClose={onClose} />
          </div>
          <div className="w-52 xl:w-60 shrink-0">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 text-brand-blue">Also Love</h4>
            <FeaturedCard item={item.featured2} collectionKey={item.key} onClose={onClose} />
          </div>
          {item.featured3 && (
            <div className="w-52 xl:w-60 shrink-0 hidden xl:block">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 text-brand-blue">Trending</h4>
              <FeaturedCard item={item.featured3} collectionKey={item.key} onClose={onClose} />
            </div>
          )}
        </div>

      </div>
    </div>
  </motion.div>
);

export const Navbar = () => {
  const dispatch = useDispatch();
  const { cartTotalQuantity } = useSelector(s => s.cart);
  const { isAuthenticated, role, user } = useSelector(s => s.auth);
  const { products, navbarFeatured, subCategories } = useSelector(s => s.admin);

  const getFeaturedProduct = (id) => {
    if (!id || !products) return null;
    const p = products.find(prod => prod.id === id);
    if (!p) return null;
    return {
      name: p.name,
      price: `₹${(p.sellingPrice || p.price || 0).toLocaleString('en-IN')}`,
      image: p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
      tag: 'Featured',
    };
  };

  const dynamicNavItems = NAV_ITEMS.map(item => {
    const ids = navbarFeatured?.[item.key] || [];
    return {
      ...item,
      links: subCategories?.[item.key] || item.links,
      featured: getFeaturedProduct(ids[0]) || item.featured,
      featured2: getFeaturedProduct(ids[1]) || item.featured2,
      featured3: getFeaturedProduct(ids[2]) || item.featured3,
    };
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);   // mega menu key
  const [profileOpen, setProfileOpen] = useState(false);  // profile panel
  const [scrolled, setScrolled] = useState(false);

  const megaTimeout = useRef(null);
  const profileBtnRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Mega menu hover with delay
  const openMega = (key) => { clearTimeout(megaTimeout.current); setActiveMenu(key); };
  const closeMega = () => { megaTimeout.current = setTimeout(() => setActiveMenu(null), 180); };
  const keepMega = () => clearTimeout(megaTimeout.current);

  const closeProfile = () => setProfileOpen(false);
  const toggleProfile = () => setProfileOpen(o => !o);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-[#e0f4ee] transition-all duration-300 ${scrolled ? 'shadow-boutique border-b border-brand-border' : 'border-b border-transparent'}`}
        onMouseLeave={closeMega}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[100px]">

            {/* ── Logo ─────────────────────────────── */}
            <Link to="/" className="shrink-0 flex items-center" onClick={closeProfile}>
              <img
                src="/newlogo.png"
                alt="A'DOREMOM Couture"
                className="h-20 sm:h-[90px] w-auto object-contain -ml-8 scale-125 transform"
              />
            </Link>

            {/* ── Desktop nav ───────────────────────── */}
            <div className="hidden md:flex items-center h-full gap-0.5 flex-1 justify-center">
              {dynamicNavItems.map(item => (
                <div key={item.key} className="relative h-full flex items-center"
                  onMouseEnter={() => openMega(item.key)}>
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200 ${activeMenu === item.key ? 'text-[#073b3a] bg-brand-muted' : 'text-[#073b3a] hover:text-[#073b3a] hover:bg-brand-muted'}`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === item.key ? 'rotate-180' : ''}`} />
                  </button>
                  {activeMenu === item.key && (
                    <motion.div layoutId="nav-line"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-brand-dark" />
                  )}
                </div>
              ))}
              {[
                { label: 'New Collections', path: '/shop?category=new-collections' },
                { label: 'Customization', path: '/customization' },
                { label: 'Try@Home', path: '/try-at-home' },
              ].map(link => (
                <Link key={link.label} to={link.path} onClick={closeProfile}
                  className="px-3 xl:px-4 py-2 text-[15px] xl:text-base font-semibold text-[#073b3a] hover:text-[#073b3a] hover:bg-brand-muted rounded-lg transition-all whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ── Right action icons ────────────────── */}
            <div className="ml-auto flex items-center gap-1">

              {/* Wishlist (customers only) */}
              {isAuthenticated && role === 'customer' && (
                <button
                  className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-brand-dark/70 hover:text-brand-blue hover:bg-brand-muted transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>
              )}

              {/* Pet Profile Icon (customers only) */}
              <PetProfileIcon />

              {/* Cart */}
              {isAuthenticated && (
                <button
                  onClick={() => { dispatch(toggleCart(true)); closeProfile(); }}
                  className="relative flex w-9 h-9 items-center justify-center rounded-xl text-brand-dark/70 hover:text-brand-dark hover:bg-brand-muted transition-colors"
                  aria-label="Open cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <AnimatePresence>
                    {cartTotalQuantity > 0 && (
                      <motion.span
                        key={cartTotalQuantity}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center bg-brand-blue"
                      >
                        {cartTotalQuantity}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )}

              {/* ── Profile button ──────────────────── */}
              <div className="relative">
                <button
                  ref={profileBtnRef}
                  onClick={toggleProfile}
                  aria-label="Account"
                  aria-expanded={profileOpen}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 ${profileOpen ? 'bg-brand-muted' : 'hover:bg-brand-muted'}`}
                >
                  {isAuthenticated ? (
                    /* Avatar circle */
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-dark text-brand-light"
                    >
                      {(user?.name?.[0] ?? '?').toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-5 h-5 text-brand-dark/80" />
                  )}
                  <ChevronDown
                    className={`w-3 h-3 text-brand-dark/50 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Panel — positioned relative to this div */}
                <ProfilePanel open={profileOpen} onClose={closeProfile} />
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex w-9 h-9 items-center justify-center rounded-xl text-brand-dark/80 hover:bg-brand-muted transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {activeMenu && (
            <div onMouseEnter={keepMega} onMouseLeave={closeMega}>
              <MegaMenu
                item={dynamicNavItems.find(i => i.key === activeMenu)}
                onClose={() => setActiveMenu(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </nav>

      <MobileMenu
        mobileMenuOpen={mobileOpen}
        setMobileMenuOpen={setMobileOpen}
        megaMenuData={Object.fromEntries(
          dynamicNavItems.map(i => [i.key, {
            title: i.label,
            lists: [{ title: 'Categories', links: i.links }]
          }])
        )}
      />
    </>
  );
};
