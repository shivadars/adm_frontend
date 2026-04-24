import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, editProduct, deleteProduct, addCategory, deleteCategory } from '../features/admin/adminSlice';
import { DEFAULT_FABRICS, DEFAULT_COLORS } from '../features/admin/adminSlice';
import { Plus, Edit2, Trash2, X, Check, Tag } from 'lucide-react';
import { ImageInput } from './ImageInput';

const EMPTY = {
  name: '', mrp: '', sellingPrice: '', categories: ['Male'], image: '',
  sizes: 'XS,S,M,L', tags: '', brand: "A'DOREMOM", description: '', stock: 50,
  rating: 4.5, reviews: 0,
  materials: [],
  colors: [],
};

// ── Chip multi-select (materials, colors, categories) ──────────────────────
const ChipSelect = ({ label, options, selected, onToggle, renderChip, colorMode }) => (
  <div>
    <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-2 block">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt.id ?? opt);
        return (
          <button
            key={opt.id ?? opt}
            type="button"
            onClick={() => onToggle(opt.id ?? opt)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all font-sans ${
              active ? 'border-brand-dark bg-brand-dark text-white' : 'border-brand-border bg-white text-brand-dark/70 hover:border-brand-dark'
            }`}
          >
            {renderChip ? renderChip(opt, active) : (opt.name ?? opt)}
          </button>
        );
      })}
    </div>
  </div>
);

// ── Product Add/Edit Modal ─────────────────────────────────────────────────
const Modal = ({ data, onClose, onSave, isNew, customCategories }) => {
  const [form, setForm] = useState({
    ...EMPTY,
    ...data,
    sizes:      data?.sizes      ? (Array.isArray(data.sizes)      ? data.sizes.join(', ')      : data.sizes)      : EMPTY.sizes,
    tags:       data?.tags       ? (Array.isArray(data.tags)       ? data.tags.join(', ')       : data.tags)       : EMPTY.tags,
    materials:  data?.materials  ? [...data.materials]  : [],
    colors:     data?.colors     ? [...data.colors]     : [],
    // Migrate legacy single `category` string → `categories` array
    categories: data?.categories
      ? [...data.categories]
      : data?.category
        ? [data.category]
        : EMPTY.categories,
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleArr = key => id => setForm(f => {
    const arr = f[key];
    return { ...f, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
  });

  const handleSave = () => onSave({
    ...form,
    mrp:          Number(form.mrp),
    sellingPrice: Number(form.sellingPrice),
    price:        Number(form.sellingPrice),
    stock:        Number(form.stock),
    sizes:        String(form.sizes).split(',').map(s => s.trim()).filter(Boolean),
    tags:         String(form.tags).split(',').map(s => s.trim()).filter(Boolean),
    // Keep first category as primary `category` for backwards compat with any old reads
    category:     form.categories[0] || 'Male',
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <h3 className="font-serif text-lg font-bold">{isNew ? 'Add New Product' : 'Edit Product'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-brand-muted"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {/* Basic text fields */}
          {[
            ['Product Name',             'name',        'text'],
            ['Description',              'description', 'text'],
            ['Sizes (comma-separated)',   'sizes',       'text'],
            ['Tags (comma-separated)',    'tags',        'text'],
            ['Stock',                    'stock',       'number'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">{label}</label>
              <input type={type} value={form[key]} onChange={set(key)} className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-green-600" />
            </div>
          ))}

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">MRP (₹) <span className="text-brand-dark/40 normal-case tracking-normal font-normal">(crossed-out)</span></label>
              <input type="number" value={form.mrp} onChange={set('mrp')} placeholder="e.g. 1599" className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">Selling Price (₹) <span className="text-green-600 normal-case tracking-normal font-normal">(highlighted)</span></label>
              <input type="number" value={form.sellingPrice} onChange={set('sellingPrice')} placeholder="e.g. 1299" className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-green-600" />
            </div>
          </div>
          {form.mrp && form.sellingPrice && Number(form.mrp) > Number(form.sellingPrice) && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-100 rounded-xl">
              <span className="text-xs text-green-700 font-bold">✓ {Math.round(((Number(form.mrp) - Number(form.sellingPrice)) / Number(form.mrp)) * 100)}% off</span>
              <span className="text-xs text-brand-dark/50 line-through">₹{Number(form.mrp).toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-brand-dark">→ ₹{Number(form.sellingPrice).toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* ── Categories — multi-select chips ── */}
          <div>
            <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-2 block">
              Categories <span className="text-brand-dark/40 normal-case tracking-normal font-normal">(select all that apply — product shows in each)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {customCategories.map(cat => {
                const active = form.categories.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        categories: active
                          ? f.categories.filter(c => c !== cat.name)
                          : [...f.categories, cat.name],
                      }));
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all font-sans ${
                      active
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-brand-border bg-white text-brand-dark/70 hover:border-green-600'
                    }`}
                  >
                    {active && <Check className="w-3 h-3" />}
                    {cat.name}
                  </button>
                );
              })}
            </div>
            {form.categories.length === 0 && (
              <p className="text-xs text-red-500 mt-1 font-sans">Please select at least one category.</p>
            )}
          </div>

          {/* Material selector */}
          <ChipSelect
            label="Available Materials (select all that apply)"
            options={DEFAULT_FABRICS}
            selected={form.materials}
            onToggle={toggleArr('materials')}
          />

          {/* Color selector */}
          <ChipSelect
            label="Available Colors (select all that apply)"
            options={DEFAULT_COLORS}
            selected={form.colors}
            onToggle={toggleArr('colors')}
            renderChip={(opt, active) => (
              <>
                <span className="w-3.5 h-3.5 rounded-full border border-white/60 shrink-0" style={{ background: opt.hex, boxShadow: active ? `0 0 0 2px ${opt.hex}66` : undefined }} />
                {opt.name}
              </>
            )}
          />

          <ImageInput
            label="Product Image — Upload or Paste URL"
            value={form.image}
            onChange={(src) => setForm(f => ({ ...f, image: src }))}
            height="h-28"
          />
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-brand-border">
          <button onClick={onClose} className="flex-1 py-2.5 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark/80 hover:bg-brand-muted transition-colors font-sans">Cancel</button>
          <button
            onClick={handleSave}
            disabled={form.categories.length === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors font-sans flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: '#073b3a' }}
          >
            <Check className="w-4 h-4" /> {isNew ? 'Add Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Inline Category Manager ────────────────────────────────────────────────
const CategoryManager = ({ customCategories, dispatch }) => {
  const [open, setOpen]         = useState(false);
  const [newCatName, setNewCat] = useState('');

  const handleAdd = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    dispatch(addCategory(trimmed));
    setNewCat('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark hover:border-green-600 hover:text-green-700 transition-colors whitespace-nowrap"
      >
        <Tag className="w-4 h-4" />
        Manage Categories
        <span className="ml-1 bg-brand-muted text-brand-dark/70 text-xs font-bold px-2 py-0.5 rounded-full">
          {customCategories.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-brand-border shadow-2xl z-40 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif font-bold text-brand-dark text-sm">Product Categories</h4>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-brand-muted">
              <X className="w-4 h-4 text-brand-dark/60" />
            </button>
          </div>

          {/* Add new category */}
          <div className="flex gap-2 mb-3">
            <input
              value={newCatName}
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="New category name..."
              className="flex-1 border border-brand-border rounded-xl px-3 py-2 text-sm font-sans focus:outline-none focus:border-green-600"
            />
            <button
              onClick={handleAdd}
              disabled={!newCatName.trim()}
              className="p-2 rounded-xl text-white disabled:opacity-40 transition-colors"
              style={{ background: '#073b3a' }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Existing categories */}
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {customCategories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-brand-muted group">
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{cat.name}</p>
                  <p className="text-[10px] text-brand-dark/40 font-sans">/{cat.urlKey}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete category "${cat.name}"? Products won't be deleted, just re-categorise them.`)) {
                      dispatch(deleteCategory(cat.id));
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-brand-dark/40 font-sans mt-3 text-center">
            Categories appear in product form & shop filters
          </p>
        </div>
      )}
    </div>
  );
};

// ── Main AdminProducts page ────────────────────────────────────────────────
export const AdminProducts = () => {
  const { products, customCategories } = useSelector(s => s.admin);
  const dispatch = useDispatch();
  const [modal,  setModal]  = useState(null);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (data) => {
    if (modal.isNew) dispatch(addProduct(data));
    else             dispatch(editProduct({ id: modal.data.id, ...data }));
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) dispatch(deleteProduct(id));
  };

  return (
    <div className="space-y-5">
      {/* ── Top bar: search + Manage Categories + Add Product ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border border-brand-border rounded-xl px-4 py-2.5 text-sm font-sans w-full sm:w-72 focus:outline-none focus:border-green-600"
        />

        <div className="flex items-center gap-2 shrink-0">
          {/* ── Inline Category Manager ── */}
          <CategoryManager customCategories={customCategories} dispatch={dispatch} />

          {/* ── Add Product ── */}
          <button
            onClick={() => setModal({ data: { ...EMPTY }, isNew: true })}
            className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            style={{ background: '#073b3a' }}
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* ── Product table ── */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-muted text-xs text-brand-dark/70 uppercase tracking-wider font-sans">
              <tr>{['Image','Name','Categories','Pricing','Materials','Colors','Stock','Actions'].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-brand-muted transition-colors">
                  <td className="px-4 py-3"><img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-brand-muted" /></td>
                  <td className="px-4 py-3 font-semibold text-brand-dark max-w-[160px] truncate">{p.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {/* Support both old `category` string and new `categories` array */}
                      {(p.categories ?? [p.category]).filter(Boolean).map(cat => (
                        <span key={cat} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 capitalize whitespace-nowrap">{cat}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-brand-dark text-sm">₹{(p.sellingPrice ?? p.price).toLocaleString('en-IN')}</span>
                      {p.mrp && p.mrp > (p.sellingPrice ?? p.price) && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-brand-dark/40 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{Math.round(((p.mrp-(p.sellingPrice??p.price))/p.mrp)*100)}% off</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.materials?.length > 0
                      ? <span className="text-xs text-brand-dark/70">{p.materials.map(id => DEFAULT_FABRICS.find(f=>f.id===id)?.name).filter(Boolean).join(', ')}</span>
                      : <span className="text-xs text-brand-dark/30">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.colors?.slice(0,5).map(id => {
                        const c = DEFAULT_COLORS.find(c=>c.id===id);
                        return c ? <span key={id} title={c.name} className="w-4 h-4 rounded-full border border-gray-200 inline-block" style={{ background: c.hex }} /> : null;
                      })}
                      {(p.colors?.length ?? 0) > 5 && <span className="text-xs text-brand-dark/50">+{p.colors.length-5}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brand-dark/70">{p.stock ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setModal({ data: p, isNew: false })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          data={modal.data}
          isNew={modal.isNew}
          customCategories={customCategories}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
