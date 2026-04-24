import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateHeroSlide, deleteHeroSlide, updateCategory } from '../features/admin/adminSlice';
import { Plus, Trash2, Check, X, ImagePlay, Grid3X3 } from 'lucide-react';
import { ImageInput } from './ImageInput';

// ─── Hero slide edit card ───────────────────────────────────────────────────────
const SlideCard = ({ slide, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...slide });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => { onUpdate(form); setEditing(false); };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      {/* Preview */}
      <div className="relative h-44">
        <img src={slide.image} alt={slide.badge} className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="text-[10px] text-white/70 font-sans uppercase tracking-widest">{slide.badge}</span>
          <p className="text-white font-bold font-serif text-sm leading-tight">{slide.title?.split('\n')[0]}</p>
        </div>
        <span className="absolute top-3 right-3 text-[10px] font-bold bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm">{slide.cta}</span>
      </div>

      {editing ? (
        <div className="p-4 space-y-3">
          {[
            ['Badge Text', 'badge'],
            ['Title (\\n for line break)', 'title'],
            ['Subtitle', 'subtitle'],
            ['CTA Button Text', 'cta'],
            ['Link URL', 'link'],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest font-sans">{label}</label>
              <input value={form[key] || ''} onChange={set(key)}
                className="w-full mt-0.5 border border-brand-border rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-green-600" />
            </div>
          ))}

          <ImageInput
            label="Banner Image — Upload or Paste URL"
            value={form.image}
            onChange={(src) => setForm(f => ({ ...f, image: src }))}
            height="h-28"
          />

          <div className="flex gap-2 pt-1">
            <button onClick={save}
              className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-xl flex-1 justify-center"
              style={{ background: '#073b3a' }}>
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
            <button onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-dark/80 px-3 py-2 rounded-xl border border-brand-border hover:bg-brand-muted">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <p className="text-xs text-brand-dark/50 font-sans truncate">→ {slide.link}</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setEditing(true)}
              className="text-xs font-semibold text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              Edit
            </button>
            <button onClick={() => onDelete(slide.id)}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Category photo card ────────────────────────────────────────────────────────
const CategoryCard = ({ cat, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState(cat.image);
  const save = () => { onUpdate({ ...cat, image }); setEditing(false); };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      <div className="relative h-40 group">
        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
          <p className="text-white font-serif font-bold text-base">{cat.name}</p>
        </div>
      </div>

      {editing ? (
        <div className="p-4 space-y-3">
          <ImageInput
            label="Category Photo — Upload or Paste URL"
            value={image}
            onChange={setImage}
            height="h-24"
          />
          <div className="flex gap-2">
            <button onClick={save}
              className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-xl flex-1 justify-center"
              style={{ background: '#073b3a' }}>
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={() => { setImage(cat.image); setEditing(false); }}
              className="text-xs font-semibold text-brand-dark/80 px-3 py-2 rounded-xl border border-brand-border hover:bg-brand-muted">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-brand-dark/50 font-sans truncate">/{cat.urlKey}</p>
          <button onClick={() => setEditing(true)}
            className="text-xs font-semibold text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            Change Photo
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main page ──────────────────────────────────────────────────────────────────
export const AdminBanners = () => {
  const { heroSlides, categories } = useSelector(s => s.admin);
  const dispatch = useDispatch();
  const [tab, setTab] = useState('hero');
  const [adding, setAdding] = useState(false);
  const [newSlide, setNewSlide] = useState({ badge: '', title: '', subtitle: '', image: '', cta: 'Shop Now', link: '/shop' });

  const handleAdd = () => {
    if (!newSlide.image) return;
    dispatch(updateHeroSlide({ id: Date.now(), ...newSlide }));
    setAdding(false);
    setNewSlide({ badge: '', title: '', subtitle: '', image: '', cta: 'Shop Now', link: '/shop' });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'hero',       icon: ImagePlay, label: 'Hero Carousel Slides' },
          { key: 'categories', icon: Grid3X3,   label: 'Category Images'      },
        ].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-sans border transition-colors"
            style={tab === key ? { background: '#073b3a', color: '#e0f4ee', borderColor: 'transparent' } : { background: 'white', color: '#6B7280', borderColor: '#E5E7EB' }}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ── Hero slides ── */}
      {tab === 'hero' && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-brand-dark/70 font-sans">
              Edit carousel slides — upload a photo or paste a URL. Changes apply to the homepage instantly.
            </p>
            <button onClick={() => setAdding(true)}
              className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl whitespace-nowrap"
              style={{ background: '#073b3a' }}>
              <Plus className="w-4 h-4" /> Add Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {heroSlides.map(slide => (
              <SlideCard
                key={slide.id}
                slide={slide}
                onUpdate={(data) => dispatch(updateHeroSlide(data))}
                onDelete={(id) => { if (window.confirm('Delete this slide?')) dispatch(deleteHeroSlide(id)); }}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Category images ── */}
      {tab === 'categories' && (
        <>
          <p className="text-sm text-brand-dark/70 font-sans">
            Change photos for each category. You can upload from your computer or paste an image URL.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onUpdate={(data) => dispatch(updateCategory(data))}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Add slide modal ── */}
      {adding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between shrink-0">
              <h3 className="font-serif text-lg font-bold">Add New Hero Slide</h3>
              <button onClick={() => setAdding(false)} className="p-1.5 rounded-lg hover:bg-brand-muted"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-4 space-y-3 overflow-y-auto flex-1">
              {[['Badge', 'badge'], ['Title', 'title'], ['Subtitle', 'subtitle'], ['CTA Text', 'cta'], ['Link', 'link']].map(([label, key]) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest font-sans">{label}</label>
                  <input value={newSlide[key] || ''} onChange={e => setNewSlide(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full mt-0.5 border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-green-600" />
                </div>
              ))}
              <ImageInput
                label="Slide Image — Upload or Paste URL (required)"
                value={newSlide.image}
                onChange={(src) => setNewSlide(f => ({ ...f, image: src }))}
                height="h-28"
              />
            </div>
            <div className="px-6 py-4 border-t border-brand-border flex gap-3 shrink-0">
              <button onClick={() => setAdding(false)}
                className="flex-1 py-2.5 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark/80 hover:bg-brand-muted">Cancel</button>
              <button onClick={handleAdd} disabled={!newSlide.image}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#073b3a' }}>
                Add Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
