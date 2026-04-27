import React from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowUp, ChevronDown } from 'lucide-react';

const STATIC_DATA = [
  { day: '1 May',  sales: 10000 },
  { day: '5 May',  sales: 7000 },
  { day: '8 May',  sales: 17000 },
  { day: '12 May', sales: 11000 },
  { day: '15 May', sales: 16000 },
  { day: '18 May', sales: 16500 },
  { day: '21 May', sales: 30000 },
  { day: '24 May', sales: 20000 },
  { day: '26 May', sales: 24000 },
  { day: '29 May', sales: 26000 },
  { day: '31 May', sales: 34000 },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ANALYTICS_DATA = MONTHS.map(m => ({
  month: m,
  revenue: Math.floor(4000 + Math.random() * 16000),
  orders:  Math.floor(8   + Math.random() * 45),
  returns: Math.floor(0   + Math.random() * 5),
}));

const CATEGORY_DATA = [
  { name: 'Male Wear',   value: 48, color: '#073b3a' },
  { name: 'Female Wear', value: 28, color: '#cc0000' },
  { name: 'Accessories', value: 24, color: '#4f9b9b' },
];

const StatCard = ({ title, value, growth }) => (
  <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border flex flex-col justify-between h-[150px]">
    <p className="text-[13px] font-bold text-brand-dark/60 font-sans">{title}</p>
    <p className="text-3xl font-bold text-brand-dark font-sans tracking-tight">{value}</p>
    <div className="flex items-center gap-1 text-[11px] font-bold text-[#10b981]">
      <ArrowUp className="w-3.5 h-3.5" />
      <span>{growth} from last month</span>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { orders } = useSelector(s => s.orders);
  const { users } = useSelector(s => s.auth);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0) || 145890;
  const totalOrders  = orders.length || 245;
  const customers    = users.filter(u => u.role === 'customer').length || 1250;
  const returned     = orders.filter(o => o.status === 'Returned').length;

  const stats = [
    { title: 'Total Orders',    value: totalOrders,                                     growth: '18%' },
    { title: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString('en-IN')}`,      growth: '15%' },
    { title: 'Total Customers', value: customers.toLocaleString(),                      growth: '12%' },
    { title: 'Conversion Rate', value: '3.24%',                                         growth: '8%'  },
  ];

  const recentOrders = [
    { id: '#1234', name: 'Neha Sharma',  price: '₹2,297', status: 'Delivered',  c: 'bg-[#e6f4ea] text-[#1e8e3e]' },
    { id: '#1233', name: 'Ritu Verma',   price: '₹1,499', status: 'Shipped',    c: 'bg-[#e6f4ea] text-[#1e8e3e]' },
    { id: '#1232', name: 'Aarti Singh',  price: '₹999',   status: 'Delivered',  c: 'bg-[#e6f4ea] text-[#1e8e3e]' },
    { id: '#1231', name: 'Priya Patel',  price: '₹1,299', status: 'Processing', c: 'bg-[#fef7e0] text-[#f29900]'  },
    { id: '#1230', name: 'Simran Kaur',  price: '₹799',   status: 'Canceled',   c: 'bg-[#fce8e6] text-[#d93025]'  },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-brand-border shadow-lg rounded-xl">
          <p className="text-xs font-bold text-brand-dark/70 mb-1">{payload[0].payload.day}</p>
          <p className="text-sm font-bold text-[#073b3a]">₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">

      {/* ── Overview ── */}
      <h2 className="text-xl font-bold font-serif text-brand-dark">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── Recent Orders + Sales Chart ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left: Recent Orders */}
        <div className="xl:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border flex flex-col">
          <h3 className="font-bold font-sans text-brand-dark text-lg mb-6">Recent Orders</h3>
          <div className="flex flex-col gap-5 flex-1">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="flex items-center justify-between">
                <div className="flex items-center gap-6 sm:gap-10">
                  <span className="text-sm font-semibold text-brand-dark/70 w-12">{ord.id}</span>
                  <span className="text-sm font-bold text-brand-dark w-28 truncate">{ord.name}</span>
                  <span className="text-sm font-bold text-brand-dark w-16">{ord.price}</span>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider ${ord.c}`}>
                  {ord.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button className="px-5 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-dark hover:bg-brand-muted transition">
              View All Orders
            </button>
          </div>
        </div>

        {/* Right: Sales Overview */}
        <div className="xl:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold font-sans text-brand-dark text-lg">Sales Overview</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-brand-border rounded-lg cursor-pointer hover:bg-brand-muted transition text-xs font-bold text-brand-dark">
              <span>This Month</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex-1 w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={STATIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={val => `₹${val/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Analytics ── */}
      <h2 className="text-xl font-bold font-serif text-brand-dark pt-4">Analytics</h2>

      {/* Analytics summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#073b3a' },
          { label: 'Total Orders',  value: totalOrders,                                  color: '#7C3AED' },
          { label: 'Total Returns', value: returned,                                     color: '#cc0000' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
            <p className="text-xs font-semibold text-brand-dark/50 uppercase tracking-widest font-sans">{label}</p>
            <p className="text-3xl font-bold font-serif mt-1" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend line chart */}
      <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
        <h3 className="font-serif text-lg font-bold text-brand-dark mb-5">Revenue Trend (₹)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={ANALYTICS_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbece3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => `₹${v}`} />
            <Line type="monotone" dataKey="revenue" stroke="#073b3a" strokeWidth={2.5} dot={{ r: 4, fill: '#073b3a' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders vs Returns */}
        <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
          <h3 className="font-serif text-lg font-bold text-brand-dark mb-5">Orders vs Returns</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbece3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="orders"  fill="#073b3a" radius={[3,3,0,0]} />
              <Bar dataKey="returns" fill="#cc0000"  radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
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
