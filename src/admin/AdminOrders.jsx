import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminOrders, updateOrderStatusAdmin } from '../features/orders/ordersSlice';

const STATUS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLOR = { 
  placed: 'bg-amber-100 text-amber-700', 
  confirmed: 'bg-blue-100 text-blue-700', 
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700', 
  delivered: 'bg-green-100 text-green-700', 
  cancelled: 'bg-red-100 text-red-700' 
};

export const AdminOrders = () => {
  const { orders, status, error } = useSelector(s => s.orders);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const filtered = (orders || []).filter(o =>
    (filter === 'All' || o.order_status === filter) &&
    (String(o.order_number || '').includes(search) || 
     (o.user?.name?.toLowerCase() || '').includes(search.toLowerCase()))
  );

  const handleStatusChange = (id, newStatus) => {
    if (window.confirm(`Update order status to ${newStatus}?`)) {
      dispatch(updateOrderStatusAdmin({ orderId: id, status: newStatus }));
    }
  };

  if (status === 'loading' && (!orders || orders.length === 0)) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-brand-border rounded-full animate-spin" style={{ borderTopColor: '#073b3a' }} />
        <span className="ml-3 text-brand-dark/50 font-sans">Loading orders...</span>
      </div>
    );
  }

  if (status === 'failed' && (!orders || orders.length === 0)) {
    return (
      <div className="p-12 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100">
        <p className="font-bold mb-2">Error loading orders</p>
        <p className="text-sm opacity-80">{error}</p>
        <button onClick={() => dispatch(fetchAdminOrders())} className="mt-4 btn-brand py-2 px-4 text-sm">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search by Order # or customer..."
          className="border border-brand-border rounded-xl px-4 py-2.5 text-sm font-sans w-full sm:w-72 focus:outline-none focus:border-green-600 shadow-sm" 
        />
        <div className="flex gap-2 flex-wrap text-xs">
          {['All', ...STATUS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`font-semibold px-3 py-1.5 rounded-full border transition-all capitalize shadow-sm ${filter === s ? 'text-white border-transparent' : 'bg-white border-brand-border text-brand-dark/80 hover:border-green-600'}`}
              style={filter === s ? { background: '#073b3a' } : {}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-brand-dark/50 font-sans text-sm">
            {search || filter !== 'All' ? 'No orders match your criteria' : 'No customer orders found yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-muted text-[10px] text-brand-dark/60 uppercase font-black tracking-widest font-sans">
                <tr>{['Order #','Customer','Items','Total','Status','Date','Action'].map(h => <th key={h} className="px-5 py-4 text-left whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-brand-muted/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-brand-dark/50 font-bold">{o.order_number}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-dark">{o.user?.name || 'Guest Customer'}</span>
                        <span className="text-[10px] text-brand-dark/40 font-mono">{o.user?.email || 'no-email'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-sans font-bold text-brand-dark/80">{o.order_items?.length || 0}</span>
                        <span className="text-[10px] text-brand-dark/40 uppercase font-black tracking-tighter">Items</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-black" style={{ color: '#073b3a' }}>₹{Number(o.total_amount || 0).toFixed(0)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLOR[o.order_status] || 'bg-brand-muted text-brand-dark/80'}`}>
                        {o.order_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-brand-dark/50 whitespace-nowrap font-sans text-xs">
                      {o.placed_at ? new Date(o.placed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <select 
                        value={o.order_status} 
                        onChange={e => handleStatusChange(o.id, e.target.value)}
                        className="border border-brand-border rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider font-sans focus:outline-none focus:border-green-600 bg-white cursor-pointer transition-all hover:border-green-600"
                      >
                        {STATUS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
