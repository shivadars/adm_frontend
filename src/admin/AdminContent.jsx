import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateContent } from '../features/admin/adminSlice';
import { Check } from 'lucide-react';

export const AdminContent = () => {
  const { content } = useSelector(s => s.admin);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ ...content });
  const [saved, setSaved] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setMsg = (i, v) => setForm(f => {
    const msgs = [...f.offerMessages];
    msgs[i] = v;
    return { ...f, offerMessages: msgs };
  });

  const handleSave = () => {
    dispatch(updateContent(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-sans">
          <Check className="w-4 h-4" /> Content saved and live on the site!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 space-y-5">
        <h3 className="font-serif text-lg font-bold text-brand-dark">Offer Strip Messages</h3>
        {(form.offerMessages || []).map((msg, i) => (
          <div key={i}>
            <label className="text-xs font-bold text-brand-dark/50 uppercase tracking-widest font-sans mb-1 block">Message {i + 1}</label>
            <input value={msg} onChange={e => setMsg(i, e.target.value)} className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-green-600" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 space-y-5">
        <h3 className="font-serif text-lg font-bold text-brand-dark">Promo Banner</h3>
        <div>
          <label className="text-xs font-bold text-brand-dark/50 uppercase tracking-widest font-sans mb-1 block">Banner Title</label>
          <input value={form.promoBannerTitle || ''} onChange={set('promoBannerTitle')} className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-green-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-brand-dark/50 uppercase tracking-widest font-sans mb-1 block">Banner Subtitle</label>
          <textarea value={form.promoBannerSubtitle || ''} onChange={set('promoBannerSubtitle')} rows={3} className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-green-600 resize-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 space-y-5">
        <h3 className="font-serif text-lg font-bold text-brand-dark">Why Choose Us Section</h3>
        <div>
          <label className="text-xs font-bold text-brand-dark/50 uppercase tracking-widest font-sans mb-1 block">Section Title</label>
          <input value={form.whyChooseTitle || ''} onChange={set('whyChooseTitle')} className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-green-600" />
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl" style={{ background: '#073b3a' }}>
        <Check className="w-4 h-4" /> Save All Changes
      </button>
    </div>
  );
};
