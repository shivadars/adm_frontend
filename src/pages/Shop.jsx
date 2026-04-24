import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { ProductCard } from '../components/product/ProductCard';
import { FilterSidebar } from '../components/filters/FilterSidebar';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

const Skeleton = () => (
  <div className="boutique-card">
    <div className="aspect-[3/4] skeleton" />
    <div className="p-4 space-y-2.5">
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-3 w-24 rounded" />
      <div className="flex justify-between pt-1">
        <div className="skeleton h-5 w-20 rounded" />
        <div className="skeleton w-8 h-8 rounded-xl" />
      </div>
    </div>
  </div>
);

const PetSticker = () => (
  <div className="text-center py-8">
    <div className="text-7xl mb-5">🐾</div>
    <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">No products found</h3>
    <p className="text-brand-dark/70 text-sm mb-6 font-sans">Try a different filter or browse our full collection.</p>
  </div>
);

export const Shop = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector(state => state.products);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCat = queryParams.get('category');

  const parseCategory = (cat) => {
    if (!cat) return 'All';
    if (cat.toLowerCase() === 'new-collections') return 'New Collections';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const [selectedCategory, setSelectedCategory] = useState(parseCategory(initialCat));
  const [sortOrder, setSortOrder] = useState('featured');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  useEffect(() => {
    if (initialCat) setSelectedCategory(parseCategory(initialCat));
  }, [initialCat]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory !== 'All') {
      result = items.filter(p => {
        // New multi-category products have a `categories` array
        if (Array.isArray(p.categories) && p.categories.length > 0) {
          return p.categories.includes(selectedCategory);
        }
        // Legacy products have a single `category` string
        return p.category === selectedCategory;
      });
    }
    if (sortOrder === 'price-low') return [...result].sort((a, b) => a.price - b.price);
    if (sortOrder === 'price-high') return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [items, selectedCategory, sortOrder]);

  const loading = status === 'loading';

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-brand-muted border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-bold text-brand-dark uppercase tracking-[0.18em] font-sans mb-1">A'DOREMOM</p>
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Our Collection</h1>
          {selectedCategory !== 'All' && (
            <p className="text-sm text-brand-dark/70 mt-1 font-sans">
              Showing <span className="font-semibold text-brand-dark">{selectedCategory}</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="boutique-card sticky top-28 overflow-hidden">
              <FilterSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-white border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-dark hover:border-brand-dark transition-colors shadow-soft font-sans"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>

                {selectedCategory !== 'All' && (
                  <div className="flex items-center gap-2 bg-brand-dark/10 border border-brand-dark/20 rounded-full px-3 py-1.5 text-xs font-semibold text-brand-dark font-sans">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="hover:text-brand-blue transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <p className="text-sm text-brand-dark/70 font-sans">
                  <span className="font-bold text-brand-dark">{filteredItems.length}</span> products
                </p>
              </div>

              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="bg-white border border-brand-border text-brand-dark text-sm rounded-xl px-4 py-2.5 font-sans outline-none focus:border-brand-dark transition-colors shadow-soft cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
                </div>
              ) : filteredItems.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="boutique-card p-12 text-center">
                  <PetSticker />
                  <button onClick={() => setSelectedCategory('All')} className="btn-brand">
                    Browse All Products
                  </button>
                </motion.div>
              ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence>
                    {filteredItems.map(product => (
                      <motion.div key={product.id} layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.22 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden" />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-brand-light z-50 shadow-2xl overflow-y-auto border-r border-brand-border lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border bg-white">
                <h2 className="font-serif font-bold text-lg">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-brand-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={(c) => { setSelectedCategory(c); setSidebarOpen(false); }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
