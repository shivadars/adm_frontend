import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
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
  const totalOrders = orders.length || 245;
  const customers = users.filter(u => u.role === 'customer').length || 1250;

  const stats = [
    { title: 'Total Orders',    value: totalOrders,                growth: '18%' },
    { title: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString('en-IN')}`, growth: '15%' },
    { title: 'Total Customers', value: customers.toLocaleString(), growth: '12%' },
    { title: 'Conversion Rate', value: '3.24%',                   growth: '8%' },
  ];

  // Dummy recent data matching image structure
  const recentOrders = [
    { id: '#1234', name: 'Neha Sharma',  price: '₹2,297', status: 'Delivered', c: 'bg-[#e6f4ea] text-[#1e8e3e]' },
    { id: '#1233', name: 'Ritu Verma',   price: '₹1,499', status: 'Shipped',   c: 'bg-[#e6f4ea] text-[#1e8e3e]' },
    { id: '#1232', name: 'Aarti Singh',  price: '₹999',   status: 'Delivered', c: 'bg-[#e6f4ea] text-[#1e8e3e]' },
    { id: '#1231', name: 'Priya Patel',  price: '₹1,299', status: 'Processing',c: 'bg-[#fef7e0] text-[#f29900]' },
    { id: '#1230', name: 'Simran Kaur',  price: '₹799',   status: 'Canceled',  c: 'bg-[#fce8e6] text-[#d93025]' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-brand-border shadow-lg rounded-xl">
          <p className="text-xs font-bold text-brand-dark/70 drop-shadow-sm mb-1">{payload[0].payload.day}</p>
          <p className="text-sm font-bold text-brand-blue">₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* 4 Stat Cards */}
      <h2 className="text-xl font-bold font-serif text-brand-dark mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Bottom Split Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-2">
        
        {/* Left: Recent Orders */}
        <div className="xl:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border flex flex-col h-full">
          <h3 className="font-bold font-sans text-brand-dark text-lg mb-6">Recent Orders</h3>
          
          <div className="flex-1">
            <div className="flex flex-col gap-5">
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
          </div>
          
          <div className="mt-8">
            <button className="px-5 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-dark hover:bg-brand-muted transition">
              View All Orders
            </button>
          </div>
        </div>

        {/* Right: Sales Overview */}
        <div className="xl:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border flex flex-col h-full">
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
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
};
