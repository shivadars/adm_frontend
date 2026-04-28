import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addProduct, editProduct, deleteProduct,
  addCategory, deleteCategory,
  addSubCategory, deleteSubCategory,
  fetchAdminData
} from '../features/admin/adminSlice';
import { DEFAULT_FABRICS, DEFAULT_COLORS } from '../features/admin/adminSlice';
import { Plus, Edit2, Trash2, X, Check, Tag, PlusCircle } from 'lucide-react';
import { ImageInput } from './ImageInput';

// Removed hardcoded COLLECTIONS and CATEGORIES_BY_COLLECTION. 
// Now pulled dynamically from Redux state.

const EMPTY = {
  name: '', mrp: '', sellingPrice: '', image: '',
  collection: 'Male',   // primary collection
  subCategory: '',      // e.g. Casual, Party Wear…
  categories: ['Male'], // kept for backwards compat
  tags: '', description: '',
  rating: 4.5, reviews: 0,
  materials: [], colors: [],
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
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all font-sans ${active ? 'border-brand-dark bg-brand-dark text-white' : 'border-brand-border bg-white text-brand-dark/70 hover:border-brand-dark'
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
const Modal = ({ data, onClose, onSave, isNew, customCollections, subCategoriesByCol }) => {
  const [form, setForm] = useState({
    ...EMPTY,
    ...data,
    collection: data?.collection || (data?.categories?.[0]) || (data?.category) || 'Male',
    subCategory: data?.subCategory || '',
    categories: data?.categories ? [...data.categories] : data?.category ? [data.category] : EMPTY.categories,
    tags: data?.tags ? (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) : EMPTY.tags,
    materials: data?.materials ? [...data.materials] : [],
    colors: data?.colors ? [...data.colors] : [],
  });

  const COLLECTIONS = (customCollections || []).map(c => c.name);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleArr = key => id => setForm(f => {
    const arr = f[key];
    return { ...f, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
  });

  const handleSave = () => onSave({
    ...form,
    mrp: Number(form.mrp),
    sellingPrice: Number(form.sellingPrice),
    price: Number(form.sellingPrice),
    tags: String(form.tags).split(',').map(s => s.trim()).filter(Boolean),
    // Keep backwards-compat fields
    categories: [form.collection],
    category: form.collection,
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
            ['Product Name', 'name', 'text'],
            ['Description', 'description', 'text'],
            ['Tags (comma-separated)', 'tags', 'text'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">{label}</label>
              <input type={type} value={form[key]} onChange={set(key)} className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-green-600" />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">MRP (₹)</label>
              <input type="number" value={form.mrp} onChange={set('mrp')} placeholder="1599" className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">Selling Price (₹)</label>
              <input type="number" value={form.sellingPrice} onChange={set('sellingPrice')} placeholder="1299" className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-green-600" />
            </div>
          </div>
          {form.mrp && form.sellingPrice && Number(form.mrp) > Number(form.sellingPrice) && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-100 rounded-xl">
              <span className="text-xs text-green-700 font-bold">✓ {Math.round(((Number(form.mrp) - Number(form.sellingPrice)) / Number(form.mrp)) * 100)}% off</span>
              <span className="text-xs text-brand-dark/50 line-through">₹{Number(form.mrp).toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-brand-dark">→ ₹{Number(form.sellingPrice).toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* ── Collection — fixed chips: Male / Female / Accessories ── */}
          <div>
            <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-2 block">
              Collection <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {COLLECTIONS.map(col => {
                const active = form.collection === col;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, collection: col, subCategory: '' }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all font-sans ${active ? 'border-green-600 bg-green-600 text-white' : 'border-brand-border text-brand-dark/70 hover:border-green-600'
                      }`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {col}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Category — depends on selected collection ── */}
          <div>
            <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {(subCategoriesByCol[(form.collection || 'Male').toLowerCase()] || []).map(cat => {
                const active = form.subCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, subCategory: active ? '' : cat }))}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all font-sans ${active ? 'border-brand-dark bg-brand-dark text-white' : 'border-brand-border text-brand-dark/70 hover:border-brand-dark'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
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
  const [open, setOpen] = useState(false);
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
        Manage Collections
        <span className="ml-1 bg-brand-muted text-brand-dark/70 text-xs font-bold px-2 py-0.5 rounded-full">
          {customCategories.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-brand-border shadow-2xl z-40 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif font-bold text-brand-dark text-sm">Product Collections</h4>
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
              placeholder="New collection name..."
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
            Collections appear in product form & shop filters
          </p>
        </div>
      )}
    </div>
  );
};

// ── Sub-Category Manager ──────────────────────────────────────────────────
const SubCategoryManager = ({ collections, subCategories, dispatch }) => {
  const [open, setOpen] = useState(false);
  const [selectedCol, setSelectedCol] = useState(collections[0]?.urlKey || 'male');
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    dispatch(addSubCategory({ collection: selectedCol, name: trimmed }));
    setNewName('');
  };

  const handleRemove = (name) => {
    if (window.confirm(`Remove category "${name}"?`)) {
      dispatch(deleteSubCategory({ collection: selectedCol, name }));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-brand-border bg-white text-brand-dark hover:border-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
      >
        <PlusCircle className="w-4 h-4" />
        Add Category
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-brand-border shadow-2xl z-40 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-serif font-bold text-brand-dark text-sm">Manage Categories</h4>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-brand-muted">
              <X className="w-4 h-4 text-brand-dark/60" />
            </button>
          </div>

          {/* Collection Picker */}
          <div className="mb-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1.5 block">Select Collection</label>
            <div className="flex flex-wrap gap-2">
              {collections.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCol(c.urlKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedCol === c.urlKey ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-dark/70 border-brand-border hover:border-brand-dark'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Form */}
          <div className="flex gap-2 mb-4">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="New category name..."
              className="flex-1 border border-brand-border rounded-xl px-3 py-2 text-sm font-sans focus:outline-none focus:border-brand-blue"
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="p-2 rounded-xl text-white disabled:opacity-40 transition-colors bg-brand-dark"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            <p className="text-[10px] font-bold text-brand-dark/40 uppercase mb-2">Existing in {selectedCol}</p>
            {(subCategories[selectedCol] || []).map(cat => (
              <div key={cat} className="flex items-center justify-between px-3 py-2 rounded-xl bg-brand-muted/30 group">
                <span className="text-sm font-semibold text-brand-dark">{cat}</span>
                <button
                  onClick={() => handleRemove(cat)}
                  className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main AdminProducts page ────────────────────────────────────────────────
export const AdminProducts = () => {
  const { products, customCategories, subCategories, status, error } = useSelector(s => s.admin);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const handleSave = (data) => {
    if (modal.isNew) dispatch(addProduct(data));
    else dispatch(editProduct({ id: modal.data.id, ...data }));
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) dispatch(deleteProduct(id));
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-sans font-semibold text-brand-dark/50">Fetching products from database...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 bg-red-50 rounded-2xl border border-red-100">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-sm font-sans font-bold text-red-600">Error loading products</p>
        <div className="bg-white/50 p-4 rounded-xl border border-red-100 max-w-md w-full">
          <p className="text-xs font-mono text-red-500 break-all">{error || 'Unknown Error'}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors">Try Refreshing</button>
          <button onClick={() => dispatch(fetchAdminData())} className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">Retry Fetch</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Top bar: Manage Categories + Add Product ── */}
      <div className="flex items-center justify-end gap-2">
        {/* ── Inline Category Manager ── */}
        <CategoryManager customCategories={customCategories} dispatch={dispatch} />

        {/* ── Add Category to Collection ── */}
        <SubCategoryManager collections={customCategories} subCategories={subCategories} dispatch={dispatch} />

        {/* ── Add Product ── */}
        <button
          onClick={() => setModal({ data: { ...EMPTY }, isNew: true })}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          style={{ background: '#073b3a' }}
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* ── Product table ── */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-muted text-xs text-brand-dark/70 uppercase tracking-wider font-sans">
              <tr>{['Image', 'Name', 'Collection', 'Category', 'Pricing', 'Materials', 'Colors', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products || []).map(p => {
                if (!p) return null;
                return (
                  <tr key={p.id} className="hover:bg-brand-muted transition-colors">
                    <td className="px-4 py-3"><img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-brand-muted" /></td>
                    <td className="px-4 py-3 font-semibold text-brand-dark max-w-[140px] truncate">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize whitespace-nowrap">
                        {typeof (p.collection || p.categories?.[0] || p.category) === 'string'
                          ? (p.collection || p.categories?.[0] || p.category)
                          : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-brand-dark/70">{typeof p.subCategory === 'string' ? p.subCategory : '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-brand-dark text-sm">₹{Number(p.sellingPrice ?? p.price ?? 0).toLocaleString('en-IN')}</span>
                        {p.mrp && p.mrp > (p.sellingPrice ?? p.price) && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-brand-dark/40 line-through">₹{Number(p.mrp || 0).toLocaleString('en-IN')}</span>
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{Math.round(((p.mrp - (p.sellingPrice ?? p.price)) / p.mrp) * 100)}% off</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {Array.isArray(p.materials) && p.materials.length > 0
                        ? <span className="text-xs text-brand-dark/70">{p.materials.map(id => DEFAULT_FABRICS.find(f => f.id === id)?.name).filter(Boolean).join(', ')}</span>
                        : <span className="text-xs text-brand-dark/30">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {Array.isArray(p.colors) && p.colors.slice(0, 5).map(id => {
                          const c = DEFAULT_COLORS.find(c => c.id === id);
                          return c ? <span key={id} title={c.name} className="w-4 h-4 rounded-full border border-gray-200 inline-block" style={{ background: c.hex }} /> : null;
                        })}
                        {(p.colors?.length ?? 0) > 5 && <span className="text-xs text-brand-dark/50">+{p.colors.length - 5}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ data: p, isNew: false })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          data={modal.data}
          isNew={modal.isNew}
          onClose={() => setModal(null)}
          onSave={handleSave}
          customCollections={customCategories}
          subCategoriesByCol={subCategories}
        />
      )}
    </div>
  );
};
