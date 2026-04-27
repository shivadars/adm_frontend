import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { updateCollectionDescription } from '../features/admin/adminSlice';
import { ProductCard } from '../components/product/ProductCard';
import { EditableText } from '../components/admin/EditableText';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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

const EmptyState = ({ onReset }) => (
  <div className="boutique-card p-12 text-center">
    <div className="text-7xl mb-5">🐾</div>
    <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">No products found</h3>
    <p className="text-brand-dark/70 text-sm mb-6 font-sans">Try a different category or browse our full collection.</p>
    <button onClick={onReset} className="btn-brand">Browse All Products</button>
  </div>
);

export const Shop = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, status } = useSelector(state => state.products);
  const collectionDescriptions = useSelector(s => s.admin.collectionDescriptions) || {};
  const location  = useLocation();

  const queryParams   = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const collectionKey = queryParams.get('category') || '';   // e.g. "male"
  const subCategory   = queryParams.get('sub')      || '';   // e.g. "Casual"

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  /* ── Filtering ─────────────────────────────────────────────────────── */
  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by collection (e.g. male/female/accessories)
    if (collectionKey) {
      result = result.filter(p => {
        const col = (p.collection || '').toLowerCase();
        const cat = (p.category   || '').toLowerCase();
        return col === collectionKey.toLowerCase() || cat === collectionKey.toLowerCase();
      });
    }

    // Further filter by sub-category (e.g. Casual, Festive)
    if (subCategory) {
      result = result.filter(p => {
        if (Array.isArray(p.categories) && p.categories.length > 0) {
          return p.categories.some(c => c.toLowerCase() === subCategory.toLowerCase());
        }
        return (p.subCategory || p.category || '').toLowerCase() === subCategory.toLowerCase();
      });
    }

    return result;
  }, [items, collectionKey, subCategory]);

  const loading = status === 'loading';

  /* ── Header content (only when sub-category is set) ──────────────── */
  const descKey     = subCategory ? subCategory : '_default';
  const description = collectionDescriptions[collectionKey]?.[descKey] || '';

  const handleSaveDescription = (val) => {
    if (!collectionKey) return;
    dispatch(updateCollectionDescription({ collection: collectionKey, subKey: descKey, description: val }));
  };

  const clearSub = () => navigate(collectionKey ? `/shop?category=${collectionKey}` : '/shop');

  return (
    <div className="min-h-screen">

      {/* ── Page header ─────────────────────────────────────────────── */}
      {subCategory ? (
        /* Sub-category page: big heading + editable description */
        <div className="bg-white border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <EditableText
              value={subCategory.toUpperCase()}
              onSave={() => {}}
              as="h1"
              className="font-serif text-4xl sm:text-5xl font-bold text-brand-dark tracking-widest mb-5"
            />
            <EditableText
              value={description}
              onSave={handleSaveDescription}
              as="p"
              className="text-brand-dark/65 text-sm sm:text-base font-sans leading-relaxed max-w-2xl mx-auto"
              multiline
              placeholder="Add a description for this category..."
            />
          </div>
        </div>
      ) : (
        /* Collection / All products: simple minimal header */
        <div className="bg-white border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-xs font-bold text-brand-dark uppercase tracking-[0.18em] font-sans mb-1">A'DOREMOM</p>
            <h1 className="font-serif text-3xl font-bold text-brand-dark">Our Collection</h1>
          </div>
        </div>
      )}

      {/* ── Products grid ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {subCategory && (
              <div className="flex items-center gap-2 bg-brand-dark/10 border border-brand-dark/20 rounded-full px-3 py-1.5 text-xs font-semibold text-brand-dark font-sans">
                {subCategory}
                <button onClick={clearSub} className="hover:text-brand-blue transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-sm text-brand-dark/70 font-sans">
              <span className="font-bold text-brand-dark">{filteredItems.length}</span> products
            </p>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState onReset={() => navigate('/shop')} />
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
  );
};
