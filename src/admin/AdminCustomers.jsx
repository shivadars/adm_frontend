import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const AdminCustomers = () => {
  const { users } = useSelector(s => s.auth);
  const { orders } = useSelector(s => s.orders);
  const [search, setSearch] = useState('');

  const customers = users.filter(u => u.role === 'customer' && (
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="space-y-5">
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
        className="border border-brand-border rounded-xl px-4 py-2.5 text-sm font-sans w-full sm:w-72 focus:outline-none focus:border-green-600" />

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-muted text-xs text-brand-dark/70 uppercase tracking-wider font-sans">
              <tr>{['Name','Email','Phone','Orders','Joined'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => {
                const myOrders = orders.filter(o => o.userId === c.id);
                return (
                  <tr key={c.id} className="hover:bg-brand-muted transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: '#073b3a' }}>
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-brand-dark">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brand-dark/70 font-sans">{c.email}</td>
                    <td className="px-5 py-3 text-brand-dark/70 font-sans">{c.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">{myOrders.length} orders</span>
                    </td>
                    <td className="px-5 py-3 text-brand-dark/50 font-sans whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                );
              })}
              {customers.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-brand-dark/50 font-sans">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
