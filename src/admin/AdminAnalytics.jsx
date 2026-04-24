import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const generateData = () => MONTHS.map(m => ({
  month: m,
  revenue: Math.floor(4000 + Math.random() * 16000),
  orders: Math.floor(8 + Math.random() * 45),
  returns: Math.floor(0 + Math.random() * 5),
}));

const DATA = generateData();

const CATEGORY_DATA = [
  { name: 'Male Wear',     value: 48, color: '#073b3a' },
  { name: 'Female Wear',     value: 28, color: '#cc0000' },
  { name: 'Accessories',  value: 24, color: '#4f9b9b' },
];

export const AdminAnalytics = () => {
  const { orders } = useSelector(s => s.orders);
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders  = orders.length;
  const returned     = orders.filter(o => o.status === 'Returned').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, color: '#073b3a' },
          { label: 'Total Orders',  value: totalOrders,                   color: '#7C3AED' },
          { label: 'Total Returns', value: returned,                      color: '#cc0000' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <p className="text-xs font-semibold text-brand-dark/50 uppercase tracking-widest font-sans">{label}</p>
            <p className="text-3xl font-bold font-serif mt-1" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue line chart */}
      <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
        <h3 className="font-serif text-lg font-bold text-brand-dark mb-5">Revenue Trend (₹)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbece3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => `₹${v}`} />
            <Line type="monotone" dataKey="revenue" stroke="#073b3a" strokeWidth={2.5} dot={{ r: 4, fill: '#073b3a' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders vs Returns bar */}
        <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
          <h3 className="font-serif text-lg font-bold text-brand-dark mb-5">Orders vs Returns</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbece3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="orders"  fill="#073b3a" radius={[3,3,0,0]} />
              <Bar dataKey="returns" fill="#cc0000" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
          <h3 className="font-serif text-lg font-bold text-brand-dark mb-5">Sales by Category</h3>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {CATEGORY_DATA.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2 text-sm font-sans">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-brand-dark/80">{name}</span>
                  <span className="font-bold text-brand-dark ml-1">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
