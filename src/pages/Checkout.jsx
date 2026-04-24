import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeOrder } from '../features/orders/ordersSlice';
import { clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard } from 'lucide-react';

export const Checkout = () => {
  const { user } = useSelector(s => s.auth);
  const { cartItems, cartTotalAmount } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=success
  const [address, setAddress] = useState({ line1: user?.address || '', city: '', pincode: '', phone: user?.phone || '' });
  const [payMethod, setPayMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);

  const shipping = cartTotalAmount >= 999 ? 0 : 79;
  const total = cartTotalAmount + shipping;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 800));
    dispatch(placeOrder({
      userId: user.id,
      userName: user.name,
      items: cartItems,
      address,
      payMethod,
      total,
    }));
    dispatch(clearCart());
    setStep(3);
    setPlacing(false);
  };

  if (step === 3) return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="boutique-card p-12 text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 mx-auto mb-5" style={{ color: '#073b3a' }} />
        <h2 className="font-serif text-2xl font-bold text-brand-dark mb-2">Order Placed! 🎉</h2>
        <p className="text-brand-dark/70 font-sans text-sm mb-8">Thank you! Your fur baby's outfit is on its way. We'll keep you updated.</p>
        <button onClick={() => navigate('/profile')} className="btn-brand w-full justify-center">View My Orders</button>
        <button onClick={() => navigate('/shop')} className="btn-brand-outline w-full justify-center mt-3">Continue Shopping</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <p className="brand-overline mb-1">A'DOREMOM</p>
          <h1 className="font-serif text-2xl font-bold text-brand-dark">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {step === 1 && (
            <div className="boutique-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5" style={{ color: '#073b3a' }} />
                <h2 className="font-serif text-xl font-bold">Delivery Address</h2>
              </div>
              <div className="space-y-4">
                {[['Street Address', 'line1', 'text'], ['City', 'city', 'text'], ['Pincode', 'pincode', 'text'], ['Phone', 'phone', 'tel']].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="text-xs font-bold text-brand-dark/80 uppercase tracking-wider font-sans mb-1 block">{label}</label>
                    <input type={type} required value={address[key]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                      className="w-full border border-brand-border bg-brand-light rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-dark transition-colors" />
                  </div>
                ))}
                <button onClick={() => setStep(2)} className="btn-brand w-full justify-center mt-2">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="boutique-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5" style={{ color: '#073b3a' }} />
                <h2 className="font-serif text-xl font-bold">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[['cod', '💵 Cash on Delivery'], ['upi', '📱 UPI / PhonePe / GPay'], ['card', '💳 Credit / Debit Card (Demo)']].map(([val, label]) => (
                  <label key={val} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${payMethod === val ? 'border-brand-dark bg-brand-dark/5' : 'border-brand-border'}`}>
                    <input type="radio" name="pay" value={val} checked={payMethod === val} onChange={() => setPayMethod(val)} className="accent-brand-dark" />
                    <span className="text-sm font-semibold font-sans">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(1)} className="btn-brand-outline flex-1 justify-center py-2.5">Back</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-brand flex-1 justify-center">
                  {placing ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
                  {placing ? 'Placing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="boutique-card p-6 h-fit">
          <h3 className="font-serif text-lg font-bold text-brand-dark mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm font-sans">
                <span className="text-brand-dark/80 truncate mr-2">{item.name} × {item.quantity}</span>
                <span className="font-semibold shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-border pt-4 space-y-2">
            <div className="flex justify-between text-sm font-sans text-brand-dark/70">
              <span>Subtotal</span><span>₹{cartTotalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-sans text-brand-dark/70">
              <span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-dark pt-2 border-t border-brand-border">
              <span className="font-serif">Total</span><span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
