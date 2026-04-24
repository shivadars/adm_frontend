import React from 'react';
import { Tags } from 'lucide-react';

export const AdminCoupons = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border">
      <div className="flex items-center gap-3 mb-6">
        <Tags className="w-6 h-6 text-brand-dark opacity-50" />
        <h2 className="text-xl font-bold font-serif text-brand-dark">Coupon Management</h2>
      </div>
      <p className="text-brand-dark/70">Coupon and discount code management system coming soon.</p>
    </div>
  );
};
