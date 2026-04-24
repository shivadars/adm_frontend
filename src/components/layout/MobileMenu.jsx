import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ChevronDown, User, Heart } from 'lucide-react';

export const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, megaMenuData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  }

  const toggleMobileAccordion = (item) => {
    setExpandedMobileMenu(expandedMobileMenu === item ? null : item);
  }

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-white p-6 flex flex-col md:hidden overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-extrabold text-primary-dark">
              Pet<span className="text-accent-pink">Pals</span>
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-brand-dark/70 hover:text-brand-dark bg-primary/20 rounded-full p-2">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col space-y-4">
             {Object.keys(megaMenuData).map((cat) => (
               <div key={cat} className="border-b border-brand-border pb-4">
                 <div 
                   className="flex justify-between items-center cursor-pointer py-2"
                   onClick={() => toggleMobileAccordion(cat)}
                 >
                   <span className="text-xl font-bold text-brand-dark uppercase">{cat}</span>
                   <ChevronDown className={`w-5 h-5 text-brand-dark/70 transition-transform ${expandedMobileMenu === cat ? 'rotate-180' : ''}`} />
                 </div>
                 <AnimatePresence>
                   {expandedMobileMenu === cat && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden"
                     >
                       <div className="bg-primary/10 rounded-xl p-4 mt-2">
                         <Link to={`/shop?category=${cat}`} onClick={() => setMobileMenuOpen(false)} className="block text-primary-dark font-bold mb-4">Shop All {cat}</Link>
                         {megaMenuData[cat].lists.map(list => (
                           <div key={list.title} className="mb-4 last:mb-0">
                             <h5 className="font-bold text-brand-dark/80 text-sm mb-2">{list.title}</h5>
                             <div className="flex flex-col space-y-2 pl-2">
                               {list.links.map(link => (
                                 <Link key={link} to={`/shop?category=${cat}`} onClick={() => setMobileMenuOpen(false)} className="text-brand-dark/70 font-medium">
                                   {link}
                                 </Link>
                               ))}
                             </div>
                           </div>
                         ))}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}

              {/* Simple Links */}
              {[
                { label: 'New Collections', path: '/shop?category=new-collections' },
                { label: 'Bandana', path: '/shop?category=bandana' },
                { label: 'Customization', path: '/customization' },
                { label: 'Try@Home', path: '/try-at-home' },
              ].map(link => (
                <div key={link.label} className="border-b border-brand-border pb-4">
                  <Link to={link.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center py-2">
                    <span className="text-xl font-bold text-brand-dark uppercase">{link.label}</span>
                  </Link>
                </div>
              ))}
          </div>
          
          <div className="mt-auto pt-8 flex justify-around border-t border-brand-border">
            <button className="flex flex-col items-center text-brand-dark/70 hover:text-primary-dark">
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">Profile</span>
            </button>
            <button className="flex flex-col items-center text-brand-dark/70 hover:text-accent-pink">
              <Heart className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">Wishlist</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
