import React from 'react';
import { Package } from 'lucide-react';

export const AdminInventory = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-brand-dark opacity-50" />
        <h2 className="text-xl font-bold font-serif text-brand-dark">Inventory Management</h2>
      </div>
      <p className="text-brand-dark/70">Inventory management system coming soon.</p>
    </div>
  );
};
