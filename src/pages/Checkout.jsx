/**
 * Checkout.jsx
 *
 * 3-step checkout:
 *   Step 1 — Pet & Size selection (with auto-fill from pet profile + size guide)
 *   Step 2 — Delivery Address
 *   Step 3 — Payment method
 *   Step 4 — Order success
 *
 * Measurements entered here are saved back to the pet profile automatically.
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeOrder } from '../features/orders/ordersSlice';
import { clearCart }  from '../features/cart/cartSlice';
import { updatePetMeasurements } from '../features/pets/petSlice';
import { saveAddress } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard, PawPrint, Ruler, ChevronDown, Edit3, Check, ChevronRight } from 'lucide-react';
import { SizeGuide } from '../components/common/SizeGuide';

// ── Helpers ───────────────────────────────────────────────────────────────
const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const InputField = ({ label, value, onChange, type = 'text', placeholder, required }) => (
  <div>
    <label className="block text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full border border-brand-border bg-brand-light rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-dark transition-colors"
    />
  </div>
);

// ── Step indicator ────────────────────────────────────────────────────────
const Steps = ({ current }) => {
  const steps = [
    { n: 1, label: 'Pet & Size' },
    { n: 2, label: 'Address' },
    { n: 3, label: 'Payment' },
  ];
  return (
    <div className="flex items-center gap-0 mb-6 sm:mb-8">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans shrink-0 transition-all ${
              current > s.n ? 'bg-green-500 text-white' :
              current === s.n ? 'bg-brand-dark text-white' :
              'bg-brand-muted text-brand-dark/40'
            }`}>
              {current > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
            </div>
            <span className={`text-xs font-semibold font-sans hidden sm:block ${current === s.n ? 'text-brand-dark' : 'text-brand-dark/40'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-all ${current > s.n ? 'bg-green-400' : 'bg-brand-muted'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ── Checkout ──────────────────────────────────────────────────────────────
export const Checkout = () => {
  const { user }                      = useSelector(s => s.auth);
  const { cartItems, cartTotalAmount } = useSelector(s => s.cart);
  const pets                          = useSelector(s => s.pets.userPets[user?.id] || []);
  const dispatch                      = useDispatch();
  const navigate                      = useNavigate();

  // Saved addresses from user profile (array of address objects)
  const savedAddresses = user?.savedAddresses || [];

  const [step,       setStep]       = useState(1);
  const [placing,    setPlacing]    = useState(false);
  const [sizeGuide,  setSizeGuide]  = useState(false);

  // Step 1 — Pet & Size
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [measurements,  setMeasurements]  = useState({ neckLength: '', chestLength: '', backLength: '', topToToeHeight: '', size: '' });
  const [editingSize,   setEditingSize]   = useState(false);

  // Step 2 — Address (auto-fill from most recent saved address)
  const [address, setAddress] = useState({
    name:    user?.name    || '',
    line1:   savedAddresses[0]?.line1   || user?.address || '',
    city:    savedAddresses[0]?.city    || '',
    pincode: savedAddresses[0]?.pincode || '',
    phone:   savedAddresses[0]?.phone   || user?.phone   || '',
  });

  // Step 3 — Payment
  const [payMethod, setPayMethod] = useState('cod');

  const selectedPet = pets.find(p => p.id === selectedPetId);
  const shipping    = cartTotalAmount >= 999 ? 0 : 79;
  const total       = cartTotalAmount + shipping;

  // Auto-fill measurements when pet changes
  useEffect(() => {
    if (selectedPet?.measurements) {
      setMeasurements({ neckLength: '', chestLength: '', backLength: '', topToToeHeight: '', size: '', ...selectedPet.measurements });
      setEditingSize(!selectedPet.measurements.size); // edit mode if no saved size
    } else {
      setMeasurements({ neckLength: '', chestLength: '', backLength: '', topToToeHeight: '', size: '' });
      setEditingSize(true);
    }
  }, [selectedPetId]);

  const setMeas = k => e => setMeasurements(m => ({ ...m, [k]: e.target.value }));

  // Save measurements to pet profile & proceed
  const handlePetStepContinue = () => {
    if (!selectedPetId) return;
    if (measurements.size && selectedPetId) {
      dispatch(updatePetMeasurements({ userId: user.id, petId: selectedPetId, measurements }));
    }
    setStep(2);
  };

  // Save address to profile & proceed
  const handleAddressStepContinue = () => {
    if (!address.line1 || !address.city || !address.pincode || !address.phone) return;
    // Merge into saved addresses (most recent first, deduplicate by line1+pincode)
    const key = `${address.line1.trim()}|${address.pincode.trim()}`;
    const existing = savedAddresses.filter(
      a => `${a.line1.trim()}|${a.pincode.trim()}` !== key
    );
    const updated = [{ ...address }, ...existing].slice(0, 3); // keep last 3
    dispatch(saveAddress(updated));
    setStep(3);
  };

  // Place order
  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 800));
    dispatch(placeOrder({
      userId:    user.id,
      userName:  user.name,
      items:     cartItems,
      address,
      payMethod,
      total,
      petId:     selectedPetId,
      petName:   selectedPet?.name,
      petSize:   measurements.size,
    }));
    dispatch(clearCart());
    setStep(4);
    setPlacing(false);
  };

  // ── Order Summary sidebar ──────────────────────────────────────────────
  const OrderSummary = () => (
    <div className="boutique-card p-5 sm:p-6 h-fit">
      <h3 className="font-serif text-lg font-bold text-brand-dark mb-4">Order Summary</h3>
      <div className="space-y-2.5 mb-4">
        {cartItems.map(item => (
          <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm font-sans">
            <span className="text-brand-dark/80 truncate mr-2 flex-1">{item.name} × {item.quantity}</span>
            <span className="font-semibold shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-brand-border pt-4 space-y-2">
        <div className="flex justify-between text-sm font-sans text-brand-dark/70">
          <span>Subtotal</span><span>₹{cartTotalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans text-brand-dark/70">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
        </div>
        {selectedPet && (
          <div className="flex justify-between text-sm font-sans text-brand-dark/70 pt-2 border-t border-brand-border">
            <span className="flex items-center gap-1"><PawPrint className="w-3.5 h-3.5" />{selectedPet.name}</span>
            <span className="font-bold text-brand-dark">{measurements.size || '—'}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-brand-dark pt-2 border-t border-brand-border">
          <span className="font-serif">Total</span><span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  // ── Success screen ─────────────────────────────────────────────────────
  if (step === 4) return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="boutique-card p-8 sm:p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mb-2">Order Placed! 🎉</h2>
        {selectedPet && measurements.size && (
          <div className="inline-flex items-center gap-2 bg-brand-muted rounded-xl px-4 py-2 mb-4 text-sm font-semibold text-brand-dark">
            <PawPrint className="w-4 h-4" /> Size <strong>{measurements.size}</strong> saved to {selectedPet.name}'s profile
          </div>
        )}
        <p className="text-brand-dark/70 font-sans text-sm mb-8">Thank you! Your fur baby's outfit is on its way. We'll keep you updated.</p>
        <button onClick={() => navigate('/profile')} className="btn-brand w-full justify-center">View My Orders</button>
        <button onClick={() => navigate('/shop')} className="btn-brand-outline w-full justify-center mt-3">Continue Shopping</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <p className="brand-overline mb-1">A'DOREMOM</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* ── Form ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Step indicator */}
            <Steps current={step} />

            {/* ══════════════════════════════ STEP 1: Pet & Size ══════════════════════ */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="boutique-card p-5 sm:p-6">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <PawPrint className="w-5 h-5 text-brand-dark" />
                        <h2 className="font-serif text-lg sm:text-xl font-bold">Who is this for?</h2>
                      </div>
                      <button
                        onClick={() => setSizeGuide(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-brand-dark border border-brand-border rounded-xl px-3 py-2 hover:bg-brand-muted transition-colors"
                      >
                        <Ruler className="w-3.5 h-3.5" /> Size Guide
                      </button>
                    </div>

                    {/* No pets → prompt */}
                    {pets.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-brand-border rounded-2xl">
                        <PawPrint className="w-10 h-10 text-brand-dark/20 mx-auto mb-3" />
                        <p className="text-sm text-brand-dark/70 font-sans mb-4">No pet profiles yet — add one to save measurements for future orders.</p>
                        <Link to="/pet-profile" className="btn-brand-outline text-sm py-2 px-4">Add Pet Profile</Link>
                      </div>
                    ) : (
                      <>
                        {/* Pet selector */}
                        <div className="mb-5">
                          <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-2 block">Select Pet</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {pets.map(pet => (
                              <button
                                key={pet.id}
                                onClick={() => setSelectedPetId(pet.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                                  selectedPetId === pet.id
                                    ? 'border-brand-dark bg-brand-dark/5'
                                    : 'border-brand-border hover:border-brand-dark/40'
                                }`}
                              >
                                {pet.photo
                                  ? <img src={pet.photo} alt={pet.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                  : <div className="w-10 h-10 rounded-xl bg-brand-muted flex items-center justify-center shrink-0 text-lg">{pet.name?.[0]}</div>
                                }
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-brand-dark truncate">{pet.name}</p>
                                  <p className="text-[10px] text-brand-dark/50 font-sans truncate">{pet.breed}</p>
                                  {pet.measurements?.size && (
                                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">
                                      Size {pet.measurements.size}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Measurements for selected pet */}
                        {selectedPet && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans">
                                Measurements for {selectedPet.name}
                              </p>
                              {!editingSize && measurements.size && (
                                <button
                                  onClick={() => setEditingSize(true)}
                                  className="flex items-center gap-1 text-xs font-semibold text-brand-dark border border-brand-border rounded-lg px-2.5 py-1.5 hover:bg-brand-muted"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit
                                </button>
                              )}
                            </div>

                            {/* Saved size display */}
                            {!editingSize && measurements.size ? (
                              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl font-extrabold text-green-700 font-mono shrink-0">
                                  {measurements.size}
                                </div>
                                <div>
                                  <p className="font-bold text-green-800 text-sm">Size saved from previous order ✓</p>
                                  <p className="text-xs text-green-700/70 font-sans mt-0.5">
                                    {[
                                      measurements.neckLength && `Neck: ${measurements.neckLength}"`,
                                      measurements.chestLength && `Chest: ${measurements.chestLength}"`,
                                      measurements.backLength && `Back: ${measurements.backLength}"`,
                                    ].filter(Boolean).join('  •  ')}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Measurement inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <InputField label='Neck Length (inches)' value={measurements.neckLength} onChange={setMeas('neckLength')} placeholder='e.g. 12' />
                                  <InputField label='Chest Length (inches)' value={measurements.chestLength} onChange={setMeas('chestLength')} placeholder='e.g. 16' />
                                  <InputField label='Back Length (inches)' value={measurements.backLength} onChange={setMeas('backLength')} placeholder='e.g. 11' />
                                  <InputField label='Top to Toe Height (inches)' value={measurements.topToToeHeight} onChange={setMeas('topToToeHeight')} placeholder='e.g. 14 (dogs)' />
                                </div>

                                {/* Size picker */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans">
                                      Select Size <span className="text-red-400">*</span>
                                    </label>
                                    <button onClick={() => setSizeGuide(true)} className="text-xs font-semibold text-brand-dark/50 hover:text-brand-dark underline">
                                      Not sure? View chart
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {SIZES.map(sz => (
                                      <button
                                        key={sz}
                                        type="button"
                                        onClick={() => setMeasurements(m => ({ ...m, size: sz }))}
                                        className={`min-w-[48px] h-10 rounded-xl font-bold text-sm font-sans border-2 transition-all ${
                                          measurements.size === sz
                                            ? 'border-brand-dark bg-brand-dark text-white shadow-sm'
                                            : 'border-brand-border text-brand-dark/70 hover:border-brand-dark/60'
                                        }`}
                                      >
                                        {sz}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <p className="text-xs text-brand-dark/40 font-sans">
                                  💡 Add 1 inch to each measurement for comfort. Measurements will be saved to {selectedPet.name}'s profile.
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <button
                      onClick={handlePetStepContinue}
                      disabled={pets.length > 0 && !measurements.size && !selectedPet?.measurements?.size}
                      className="btn-brand w-full justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Address <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════ STEP 2: Address ═════════════════════════ */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="boutique-card p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <MapPin className="w-5 h-5 text-brand-dark" />
                      <h2 className="font-serif text-lg sm:text-xl font-bold">Delivery Address</h2>
                    </div>

                    {/* Saved addresses — one-tap refill */}
                    {savedAddresses.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider font-sans mb-2">
                          Saved Addresses
                        </p>
                        <div className="space-y-2">
                          {savedAddresses.map((a, i) => {
                            const isSelected =
                              address.line1 === a.line1 &&
                              address.pincode === a.pincode;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setAddress({ ...a })}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                                  isSelected
                                    ? 'border-brand-dark bg-brand-dark/5'
                                    : 'border-brand-border hover:border-brand-dark/30'
                                }`}
                              >
                                <p className="text-sm font-bold text-brand-dark font-sans truncate">
                                  {a.name && <span className="mr-1">{a.name} —</span>}
                                  {a.line1}
                                </p>
                                <p className="text-xs text-brand-dark/50 font-sans mt-0.5">
                                  {[a.city, a.pincode, a.phone].filter(Boolean).join(' · ')}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-brand-border" />
                          <span className="text-xs text-brand-dark/40 font-sans">or enter new</span>
                          <div className="flex-1 h-px bg-brand-border" />
                        </div>
                      </div>
                    )}

                    {/* Address form */}
                    <div className="space-y-4">
                      <InputField label="Full Name" value={address.name || ''} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} placeholder="e.g. Priya Sharma" required />
                      <InputField label="Street Address" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} placeholder="House, Street, Area" required />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField label="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} placeholder="e.g. Mumbai" required />
                        <InputField label="Pincode" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} placeholder="6-digit pincode" required />
                      </div>
                      <InputField label="Phone" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" type="tel" required />
                    </div>

                    <p className="text-xs text-brand-dark/40 font-sans mt-3">
                      💾 This address will be saved for future orders.
                    </p>

                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setStep(1)} className="btn-brand-outline flex-1 justify-center py-3 text-sm">← Back</button>
                      <button
                        onClick={handleAddressStepContinue}
                        disabled={!address.line1 || !address.city || !address.pincode || !address.phone}
                        className="btn-brand flex-1 justify-center disabled:opacity-50"
                      >
                        Continue to Payment <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}


              {/* ══════════════════════════════ STEP 3: Payment ══════════════════════════ */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="boutique-card p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <CreditCard className="w-5 h-5 text-brand-dark" />
                      <h2 className="font-serif text-lg sm:text-xl font-bold">Payment Method</h2>
                    </div>
                    <div className="space-y-3">
                      {[['cod', '💵', 'Cash on Delivery', 'Pay when your order arrives'], ['upi', '📱', 'UPI / PhonePe / GPay', 'Instant payment via UPI'], ['card', '💳', 'Credit / Debit Card', 'Demo — no actual charge']].map(([val, emoji, label, sub]) => (
                        <label key={val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === val ? 'border-brand-dark bg-brand-dark/5' : 'border-brand-border hover:border-brand-dark/30'}`}>
                          <input type="radio" name="pay" value={val} checked={payMethod === val} onChange={() => setPayMethod(val)} className="accent-brand-dark shrink-0" />
                          <span className="text-2xl">{emoji}</span>
                          <div>
                            <p className="text-sm font-bold text-brand-dark font-sans">{label}</p>
                            <p className="text-xs text-brand-dark/50 font-sans">{sub}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep(2)} className="btn-brand-outline flex-1 justify-center py-3 text-sm">← Back</button>
                      <button onClick={handlePlaceOrder} disabled={placing} className="btn-brand flex-1 justify-center">
                        {placing ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                        {placing ? 'Placing...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Order Summary sidebar ── */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuide
        open={sizeGuide}
        onClose={() => setSizeGuide(false)}
        defaultTab={selectedPet?.type || 'dog'}
      />
    </div>
  );
};
