import React from 'react';
import { Settings } from 'lucide-react';

export const AdminSettings = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-brand-border">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-brand-dark opacity-50" />
        <h2 className="text-xl font-bold font-serif text-brand-dark">Store Settings</h2>
      </div>
      <p className="text-brand-dark/70">General store settings, payments, and shipping configuration coming soon.</p>
    </div>
  );
};
