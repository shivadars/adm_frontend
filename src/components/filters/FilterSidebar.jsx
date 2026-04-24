import React from 'react';
import { useSelector } from 'react-redux';

export const FilterSidebar = ({ selectedCategory, setSelectedCategory }) => {
  const customCategories = useSelector(s => s.admin.customCategories);

  // Always show "All" first, then the admin-managed categories
  const allOption  = { id: 'all', name: 'All' };
  const categories = [allOption, ...(customCategories || [])];

  return (
    <div className="bg-white rounded-2xl p-6 soft-shadow border border-brand-border sticky top-28">
      <h3 className="text-xl font-extrabold text-primary-dark mb-6">Filters</h3>

      <div className="mb-8">
        <h4 className="font-bold text-brand-dark mb-3 uppercase text-sm tracking-wider">Category</h4>
        <div className="space-y-3">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategory === cat.name ? 'bg-primary-dark border-primary-dark' : 'border-brand-border group-hover:border-primary-dark'}`}>
                {selectedCategory === cat.name && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-brand-dark/80 transition-colors ${selectedCategory === cat.name ? 'font-bold text-brand-dark' : 'group-hover:text-primary-dark'}`}>
                {cat.name}
              </span>
              <input type="radio" name="category" className="hidden" checked={selectedCategory === cat.name} onChange={() => setSelectedCategory(cat.name)} />
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-bold text-brand-dark mb-3 uppercase text-sm tracking-wider">Price Range</h4>
        <input type="range" className="w-full accent-primary-dark" min="0" max="100" />
        <div className="flex justify-between text-xs text-brand-dark/70 mt-2 font-medium">
          <span>₹0</span>
          <span>₹5000+</span>
        </div>
      </div>
    </div>
  );
};
