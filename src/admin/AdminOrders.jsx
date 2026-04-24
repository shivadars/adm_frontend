import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../features/orders/ordersSlice';

const STATUS = ['Pending', 'Shipped', 'Delivered', 'Returned'];
const STATUS_COLOR = { Pending: 'bg-amber-100 text-amber-700', Shipped: 'bg-blue-100 text-blue-700', Delivered: 'bg-green-100 text-green-700', Returned: 'bg-red-100 text-red-700' };

export const AdminOrders = () => {
  const { orders } = useSelector(s => s.orders);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    (o.id.includes(search) || o.userName?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or customer..."
          className="border border-brand-border rounded-xl px-4 py-2.5 text-sm font-sans w-full sm:w-72 focus:outline-none focus:border-green-600" />
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${filter === s ? 'text-white border-transparent' : 'bg-white border-brand-border text-brand-dark/80 hover:border-green-600'}`}
              style={filter === s ? { background: '#073b3a' } : {}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-brand-dark/50 font-sans text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-muted text-xs text-brand-dark/70 uppercase tracking-wider font-sans">
                <tr>{['Order ID','Customer','Items','Total','Status','Date','Update Status'].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-brand-muted transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-brand-dark/50">{o.id}</td>
                    <td className="px-4 py-3 font-semibold text-brand-dark">{o.userName}</td>
                    <td className="px-4 py-3 text-brand-dark/70">{o.items?.length ?? 0}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#073b3a' }}>₹{o.total?.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[o.status] || 'bg-brand-muted text-brand-dark/80'}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-brand-dark/50 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => dispatch(updateOrderStatus({ orderId: o.id, status: e.target.value }))}
                        className="border border-brand-border rounded-lg px-2 py-1 text-xs font-sans focus:outline-none focus:border-green-600 bg-white cursor-pointer">
                        {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
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
