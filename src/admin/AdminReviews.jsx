import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addReview, editReview, deleteReview, toggleFeaturedReview } from '../features/admin/adminSlice';
import { Star, Plus, Trash2, Eye, EyeOff, X, Check, Home } from 'lucide-react';

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange && onChange(s)}>
        <Star className={`w-5 h-5 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} ${onChange ? 'hover:text-amber-400 cursor-pointer' : 'cursor-default'}`} />
      </button>
    ))}
  </div>
);

const EMPTY_REVIEW = { name: '', location: '', rating: 5, text: '', avatar: '' };

const Modal = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState({ ...EMPTY_REVIEW, ...data });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <h3 className="font-serif text-lg font-bold text-brand-dark">
            {data.id ? 'Edit Review' : 'Add New Review'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-brand-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider font-sans mb-1 block">Customer Name</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Priya Sharma" className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-dark" />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider font-sans mb-1 block">City</label>
              <input value={form.location} onChange={set('location')} placeholder="e.g. Mumbai" className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-dark" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider font-sans mb-2 block">Rating</label>
            <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider font-sans mb-1 block">Review Text</label>
            <textarea value={form.text} onChange={set('text')} rows={4} placeholder="Customer's review..." className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-dark resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-brand-border">
          <button onClick={onClose} className="flex-1 py-2.5 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark/80 hover:bg-brand-muted transition-colors font-sans">Cancel</button>
          <button
            onClick={() => onSave({ ...form, rating: Number(form.rating), avatar: form.name?.[0]?.toUpperCase() || 'C' })}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 font-sans"
            style={{ background: '#073b3a' }}
          >
            <Check className="w-4 h-4" />
            {data.id ? 'Save Changes' : 'Add Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminReviews = () => {
  const reviews  = useSelector(s => s.admin.reviews);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const featured = reviews.filter(r => r.featured);
  const unfeatured = reviews.filter(r => !r.featured);

  const handleSave = (data) => {
    if (data.id) dispatch(editReview(data));
    else dispatch(addReview(data));
    setModal(null);
  };

  const badgeClass = (featured) =>
    featured
      ? 'bg-green-100 text-green-700 border border-green-200'
      : 'bg-gray-100 text-gray-500 border border-gray-200';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-brand-dark">Customer Reviews</h2>
          <p className="text-sm text-brand-dark/60 font-sans mt-1">
            <span className="font-bold text-green-700">{featured.length}</span> featured on homepage · {reviews.length} total
          </p>
        </div>
        <button
          onClick={() => setModal({ data: EMPTY_REVIEW })}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-colors font-sans"
          style={{ background: '#073b3a' }}
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {/* Featured section */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
          <Home className="w-4 h-4 text-green-600" />
          <h3 className="font-bold text-brand-dark text-sm font-sans">Featured on Homepage ({featured.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {featured.length === 0 ? (
            <p className="px-5 py-6 text-sm text-brand-dark/50 font-sans text-center">No reviews featured yet. Toggle below to add.</p>
          ) : featured.map(r => (
            <ReviewRow key={r.id} review={r} onEdit={() => setModal({ data: r })} onDelete={() => { if (window.confirm('Delete this review?')) dispatch(deleteReview(r.id)); }} onToggle={() => dispatch(toggleFeaturedReview(r.id))} />
          ))}
        </div>
      </div>

      {/* All reviews */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border">
          <h3 className="font-bold text-brand-dark text-sm font-sans">All Reviews ({reviews.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {reviews.map(r => (
            <ReviewRow key={r.id} review={r} onEdit={() => setModal({ data: r })} onDelete={() => { if (window.confirm('Delete this review?')) dispatch(deleteReview(r.id)); }} onToggle={() => dispatch(toggleFeaturedReview(r.id))} />
          ))}
        </div>
      </div>

      {modal && <Modal data={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
};

const ReviewRow = ({ review: r, onEdit, onDelete, onToggle }) => (
  <div className="px-5 py-4 flex items-start gap-4">
    {/* Avatar */}
    <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-sm font-bold text-brand-light shrink-0">
      {r.avatar || r.name?.[0]}
    </div>
    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="font-bold text-brand-dark text-sm">{r.name}</span>
        <span className="text-xs text-brand-dark/50">{r.location}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {r.featured ? '★ Featured' : 'Hidden'}
        </span>
        <StarRating value={r.rating} />
      </div>
      <p className="text-sm text-brand-dark/70 font-sans line-clamp-2">{r.text}</p>
      <p className="text-[11px] text-brand-dark/40 mt-1 font-sans">{r.date}</p>
    </div>
    {/* Actions */}
    <div className="flex gap-1 shrink-0">
      <button
        onClick={onToggle}
        title={r.featured ? 'Remove from homepage' : 'Feature on homepage'}
        className={`p-2 rounded-lg transition-colors ${r.featured ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600'}`}
      >
        {r.featured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      <button onClick={onEdit} className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
        <Star className="w-4 h-4" />
      </button>
      <button onClick={onDelete} className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);
