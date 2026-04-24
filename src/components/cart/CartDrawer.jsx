import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart, getCartTotal } from '../../features/cart/cartSlice';
import { CartItem } from './CartItem';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { isCartOpen, cartItems, cartTotalAmount } = useSelector(s => s.cart);
  const dispatch = useDispatch();

  React.useEffect(() => { dispatch(getCartTotal()); }, [cartItems, dispatch]);

  const shipping = cartTotalAmount >= 999 ? 0 : 79;
  const total = cartTotalAmount + shipping;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart(false))}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#e8f0fe] z-[80] flex flex-col shadow-2xl border-l border-brand-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-dark" />
                <h2 className="font-serif text-lg font-bold text-brand-dark">
                  Your Bag
                  {cartItems.length > 0 && <span className="ml-2 text-sm font-normal text-brand-dark/50 font-sans">({cartItems.length})</span>}
                </h2>
              </div>
              <button onClick={() => dispatch(toggleCart(false))} className="w-8 h-8 rounded-full hover:bg-brand-muted text-brand-dark/70 flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping bar */}
            {cartTotalAmount > 0 && cartTotalAmount < 999 && (
              <div className="px-6 py-3 bg-brand-dark/10 border-b border-brand-border">
                <div className="flex justify-between text-xs font-semibold text-brand-dark mb-1.5 font-sans">
                  <span>Add <span className="text-brand-dark font-bold">₹{(999 - cartTotalAmount).toFixed(0)}</span> more for FREE shipping!</span>
                  <span>{Math.min(Math.round((cartTotalAmount / 999) * 100), 100)}%</span>
                </div>
                <div className="h-1.5 bg-brand-border rounded-full">
                  <motion.div className="h-full bg-brand-dark rounded-full" initial={{ width: 0 }}
                    animate={{ width: `${Math.min((cartTotalAmount / 999) * 100, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="text-6xl mb-5">🛍️</div>
                  <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">Your bag is empty</h3>
                  <p className="text-brand-dark/70 text-sm mb-8 font-sans">Your fur baby is waiting for their next outfit!</p>
                  <button onClick={() => dispatch(toggleCart(false))} className="btn-brand">Browse Collection</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => <CartItem key={`${item.id}-${item.size}`} item={item} />)}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-brand-border px-6 py-5 bg-white">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm text-brand-dark/70 font-sans">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brand-dark">₹{cartTotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-dark/70 font-sans">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-brand-dark' : 'text-brand-dark'}`}>
                      {shipping === 0 ? 'FREE 🎉' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-brand-dark pt-2 border-t border-brand-border">
                    <span className="font-serif">Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={() => dispatch(toggleCart(false))} className="btn-brand w-full justify-center">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={() => dispatch(toggleCart(false))} className="w-full text-center text-sm text-brand-dark/50 hover:text-brand-dark/80 mt-3 transition-colors font-sans">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
