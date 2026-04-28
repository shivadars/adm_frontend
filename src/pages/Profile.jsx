import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../features/auth/authSlice';
import { fetchOrders }       from '../features/orders/ordersSlice';
import { motion } from 'framer-motion';
import { User, Package, Edit3, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const { user, status: authStatus } = useSelector(s => s.auth);
  const { orders }                   = useSelector(s => s.orders);
  const dispatch                     = useDispatch();

  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [saved,   setSaved]   = useState(false);

  // No need to filter by userId anymore as the API already scopes to current user
  const myOrders = orders;

  // Refresh orders on mount
  React.useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  const handleSave = async () => {
    if (!user?.id) return;
    const result = await dispatch(updateUserProfile({ id: user.id, data: form }));
    if (updateUserProfile.fulfilled.match(result)) {
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const STATUS_COLORS = {
    placed:     'bg-amber-100 text-amber-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen ">
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="brand-overline mb-1">Account</p>
          <h1 className="font-serif text-3xl font-bold text-brand-dark">My Profile</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="boutique-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-brand-light" style={{ background: '#073b3a' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-serif font-bold text-lg text-brand-dark">{user?.name}</p>
                <p className="text-xs text-brand-dark/70 font-sans">{user?.email}</p>
              </div>
            </div>

            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-700 font-sans mb-4">
                <Check className="w-4 h-4" /> Profile updated!
              </div>
            )}

            <div className="space-y-3">
              {editing ? (
                <>
                  {[['Full Name', 'name', 'text'], ['Phone', 'phone', 'text'], ['Delivery Address', 'address', 'text']].map(([label, key, type]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/50 font-sans">{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full mt-1 border border-brand-border  rounded-xl px-3 py-2 text-sm font-sans focus:outline-none focus:border-brand-dark" />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={authStatus === 'loading'}
                      className="btn-brand flex-1 justify-center py-2 px-4 text-sm"
                    >
                      {authStatus === 'loading' ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-brand-outline flex-1 justify-center py-2 px-4 text-sm">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  {[['Email', user?.email], ['Phone', user?.phone || '—'], ['Address', user?.address || '—']].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/50 font-sans">{label}</p>
                      <p className="text-sm text-brand-dark font-sans mt-0.5">{val}</p>
                    </div>
                  ))}
                  <button onClick={() => setEditing(true)} className="btn-brand-outline w-full justify-center mt-3 text-sm py-2">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="boutique-card overflow-visible">
            <div className="px-6 py-5 border-b border-brand-border flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-dark" />
              <h2 className="font-serif font-bold text-xl text-brand-dark">Order History ({myOrders.length})</h2>
            </div>
            {myOrders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="font-serif text-lg font-bold text-brand-dark mb-2">No orders yet</p>
                <p className="text-sm text-brand-dark/70 font-sans mb-6">Your fur baby is waiting for their first outfit!</p>
                <Link to="/shop" className="btn-brand">Browse Collection</Link>
              </div>
            ) : (
              <div className="divide-y divide-brand-border">
                {myOrders.map(order => (
                  <div key={order.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-brand-dark/70">{order.order_number}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.order_status] || 'bg-brand-muted text-brand-dark/80'}`}>
                        {order.order_status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-brand-dark font-sans">
                      {order.order_items?.length || 0} item(s)
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-brand-dark/50 font-sans">
                        {order.placed_at ? new Date(order.placed_at).toLocaleDateString('en-IN') : '—'}
                      </p>
                      <p className="font-bold text-brand-dark text-sm">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
