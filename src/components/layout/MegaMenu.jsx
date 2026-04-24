import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const MegaMenu = ({ activeMegaMenu, megaMenuData, handleMenuEnter, setActiveMegaMenu }) => {
  return (
    <AnimatePresence>
      {activeMegaMenu && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ overflow: 'hidden' }}
          className="absolute left-0 right-0 top-full bg-white border-t border-brand-border shadow-xl z-40 transform origin-top"
          onMouseEnter={() => handleMenuEnter(activeMegaMenu)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex gap-16">
              <div>
                <h3 className="text-2xl font-extrabold text-primary-dark mb-4 drop-shadow-sm">{megaMenuData[activeMegaMenu].title}</h3>
                <Link to={`/shop?category=${activeMegaMenu}`} onClick={() => setActiveMegaMenu(null)} className="inline-block bg-primary hover:bg-primary-dark hover:text-white transition-colors text-primary-dark font-bold text-sm px-5 py-2 rounded-full">
                  Shop All {activeMegaMenu}
                </Link>
              </div>
              <div className="flex gap-12 flex-1">
                {megaMenuData[activeMegaMenu].lists.map((list, idx) => (
                  <div key={idx}>
                    <h4 className="font-bold text-brand-dark mb-4 uppercase tracking-wider text-sm">{list.title}</h4>
                    <ul className="space-y-3">
                      {list.links.map(link => (
                        <li key={link}>
                          <Link to={`/shop?category=${activeMegaMenu}`} onClick={() => setActiveMegaMenu(null)} className="text-brand-dark/70 hover:text-accent-pink hover:font-bold transition-all">
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {/* Decorative Area in Mega Menu */}
              <div className="w-48 bg-primary/20 rounded-2xl flex items-center justify-center overflow-hidden border border-blue-100 relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-pink to-transparent"></div>
                <span className="text-5xl drop-shadow-md">{activeMegaMenu === 'dog' ? '🐶' : activeMegaMenu === 'cat' ? '🐱' : '🎀'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
