import React from 'react';
import { useSelector } from 'react-redux';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const Cart = () => {
  const { cartItems } = useSelector(state => state.cart);

  return (
    <div className=" min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-semibold text-brand-sky uppercase tracking-[0.18em] font-sans mb-1">A'DOREMOM</p>
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Your Shopping Bag</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cartItems.length === 0 ? (
          <div className="boutique-card p-12 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-5">🛍️</div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">Your bag is feeling empty</h2>
            <p className="text-brand-dark/70 mb-8 font-sans text-sm leading-relaxed">
              Your fur baby is waiting for their next outfit! Browse our handcrafted collection.
            </p>
            <Link to="/shop" className="btn-brand">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items list */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold text-brand-dark/80 font-sans">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
                <Link to="/shop" className="text-sm text-brand-dark hover:text-brand-blue font-semibold inline-flex items-center gap-1 transition-colors font-sans">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
              </div>

              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-28">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
