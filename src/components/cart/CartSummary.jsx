import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCartTotal } from '../../features/cart/cartSlice';

export const CartSummary = () => {
  const { cartTotalAmount, cartItems } = useSelector(state => state.cart);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cartItems, dispatch]);

  const tax   = cartTotalAmount * 0.05;
  const total = cartTotalAmount + tax;

  return (
    <div className="bg-white p-6 rounded-2xl soft-shadow border border-brand-border">
      <h3 className="text-xl font-extrabold text-primary-dark mb-6 tracking-tight">Order Summary</h3>
      <div className="space-y-3 font-medium text-brand-dark/70 border-b border-brand-border pb-4 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-brand-dark font-bold">₹{cartTotalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Tax (5%)</span>
          <span className="text-brand-dark font-bold">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Shipping</span>
          <span className={cartTotalAmount >= 999 ? 'text-green-600 font-bold' : 'text-brand-dark font-bold'}>
            {cartTotalAmount >= 999 ? 'FREE' : '₹79'}
          </span>
        </div>
      </div>
      <div className="flex justify-between text-xl font-extrabold text-brand-dark mb-6">
        <span>Total</span>
        <span>₹{(cartTotalAmount + (cartTotalAmount >= 999 ? 0 : 79)).toFixed(2)}</span>
      </div>
      <button
        onClick={() => navigate('/checkout')}
        disabled={cartItems.length === 0}
        className="w-full bg-primary-dark hover:bg-primary hover:text-primary-dark text-white font-bold py-4 rounded-xl shadow-md transition-all border hover:border-primary-dark uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};
