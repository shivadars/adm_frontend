import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts } from '../../services/apiMockData';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); setOpen(false); return; }
    const t = setTimeout(() => {
      const results = mockProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
      setSuggestions(results);
      setOpen(results.length > 0);
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery(''); setOpen(false);
    }
  };

  const handleSelect = (product) => {
    navigate(`/product/${product.id}`);
    setQuery(''); setOpen(false);
  };

  return (
    <div ref={ref} className="hidden md:flex relative">
      <div className={`flex items-center gap-2 bg-brand-muted border rounded-xl px-3 py-2 transition-all duration-200 ${focused ? 'border-primary-dark bg-white shadow-sm w-72' : 'border-brand-border w-52 hover:border-brand-border'}`}>
        <Search className={`w-4 h-4 shrink-0 transition-colors ${focused ? 'text-primary-dark' : 'text-brand-dark/50'}`} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products..."
          className="flex-1 bg-transparent text-sm text-brand-dark placeholder-gray-400 outline-none min-w-0"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="text-brand-dark/50 hover:text-brand-dark/80">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl border border-brand-border shadow-mega overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest">Suggestions</p>
            </div>
            {suggestions.map(product => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-brand-muted transition-colors text-left"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-11 h-11 object-cover rounded-xl bg-brand-muted shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{product.name}</p>
                  <p className="text-xs font-bold text-primary-dark">${product.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
