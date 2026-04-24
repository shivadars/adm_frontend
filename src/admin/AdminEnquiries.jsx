import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEnquiryStatus, deleteEnquiry } from '../features/admin/adminSlice';
import { Ruler, Palette, Trash2, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  new:        { label: 'New',        color: 'bg-blue-100 text-blue-700',   icon: Clock },
  contacted:  { label: 'Contacted',  color: 'bg-amber-100 text-amber-700', icon: ChevronDown },
  completed:  { label: 'Completed',  color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected:   { label: 'Rejected',   color: 'bg-red-100 text-red-500',     icon: XCircle },
};

const EnquiryCard = ({ enq, onStatusChange, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const isColor = enq.type === 'custom_color';
  const isSize  = enq.type === 'custom_size';
  const st = STATUS_CONFIG[enq.status] || STATUS_CONFIG.new;
  const Icon = isColor ? Palette : Ruler;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-shadow hover:shadow-md ${enq.status === 'new' ? 'border-blue-200' : 'border-brand-border'}`}>
      {/* Header row */}
      <div className="flex items-start gap-4 px-5 py-4">
        {/* Type icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isColor ? 'bg-purple-100' : 'bg-teal-100'}`}>
          <Icon className={`w-5 h-5 ${isColor ? 'text-purple-600' : 'text-teal-600'}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-brand-dark text-sm font-sans">{enq.productName}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isColor ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
              {isColor ? '🎨 Custom Colour' : '📏 Custom Size'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
          </div>

          {/* Quick preview */}
          {isColor && enq.colorDesc && (
            <p className="text-xs text-brand-dark/60 font-sans truncate">{enq.colorDesc}</p>
          )}
          {isSize && enq.measurements && (
            <p className="text-xs text-brand-dark/60 font-sans">
              Neck: {enq.measurements.neck || '—'}cm · Chest: {enq.measurements.chest || '—'}cm · Back: {enq.measurements.back || '—'}cm
            </p>
          )}
          <p className="text-[11px] text-brand-dark/40 font-sans mt-1">
            {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Product image */}
        {enq.productImage && (
          <img src={enq.productImage} alt={enq.productName} className="w-12 h-12 rounded-lg object-cover border border-brand-border shrink-0 hidden sm:block" />
        )}

        {/* Expand toggle */}
        <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-lg hover:bg-brand-muted text-brand-dark/50 shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-brand-border px-5 py-4 space-y-4 bg-brand-muted/40">
          {/* Selected options at time of enquiry */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[['Size', enq.selectedSize], ['Colour', enq.selectedColor], ['Material', enq.selectedMaterial]].map(([label, val]) => val && (
              <div key={label} className="bg-white rounded-xl px-3 py-2 border border-brand-border">
                <p className="text-brand-dark/50 mb-0.5 font-sans uppercase tracking-wider text-[10px] font-bold">{label}</p>
                <p className="font-bold text-brand-dark font-sans">{val}</p>
              </div>
            ))}
          </div>

          {/* Colour enquiry details */}
          {isColor && (
            <div className="space-y-2">
              {enq.colorDesc && (
                <div className="bg-white rounded-xl px-4 py-3 border border-brand-border">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">Customer Description</p>
                  <p className="text-sm text-brand-dark/80 font-sans">{enq.colorDesc}</p>
                </div>
              )}
              {enq.colorImage && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 mb-2">Reference Image</p>
                  <img src={enq.colorImage} alt="Color reference" className="h-28 rounded-xl object-cover border border-brand-border" onError={e => e.target.style.display='none'} />
                </div>
              )}
            </div>
          )}

          {/* Size enquiry details */}
          {isSize && enq.measurements && (
            <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-brand-muted">
                  <tr>
                    {['Measurement', 'Value'].map(h => <th key={h} className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 font-sans">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ['Neck Circumference', enq.measurements.neck ? `${enq.measurements.neck} cm` : '—'],
                    ['Chest / Belly Girth', enq.measurements.chest ? `${enq.measurements.chest} cm` : '—'],
                    ['Back Length', enq.measurements.back ? `${enq.measurements.back} cm` : '—'],
                    ['Pet Weight', enq.measurements.weight ? `${enq.measurements.weight} kg` : '—'],
                    ['Notes', enq.measurements.notes || '—'],
                  ].map(([label, val]) => (
                    <tr key={label} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold text-brand-dark/70 text-xs font-sans">{label}</td>
                      <td className="px-4 py-2 text-brand-dark font-sans text-xs">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-brand-dark/50 font-sans mr-1">Update Status:</span>
            {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => onStatusChange(enq.id, key)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all font-sans ${
                  enq.status === key ? color + ' border-transparent' : 'border-brand-border text-brand-dark/50 hover:border-brand-dark'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto">
              <button onClick={() => { if (window.confirm('Delete this enquiry?')) onDelete(enq.id); }} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminEnquiries = () => {
  const enquiries = useSelector(s => s.admin.enquiries) || [];
  const dispatch  = useDispatch();
  const [filter, setFilter] = useState('all');

  const counts = { all: enquiries.length, new: 0, contacted: 0, completed: 0, rejected: 0 };
  enquiries.forEach(e => { if (counts[e.status] !== undefined) counts[e.status]++; });

  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-brand-dark">Custom Enquiries</h2>
        <p className="text-sm text-brand-dark/60 font-sans mt-1">
          Customer requests for custom colours and sizes
          <span className="ml-2 font-bold text-blue-600">{counts.new} new</span>
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries({ all: 'All', new: 'New', contacted: 'Contacted', completed: 'Completed', rejected: 'Rejected' }).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-all font-sans ${
              filter === key ? 'bg-brand-dark text-white border-brand-dark' : 'border-brand-border text-brand-dark/60 hover:border-brand-dark bg-white'
            }`}
          >
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === key ? 'bg-white/20 text-white' : 'bg-brand-muted text-brand-dark/60'}`}>
              {counts[key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-border p-12 text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="font-serif text-lg font-bold text-brand-dark mb-2">No enquiries yet</p>
          <p className="text-sm text-brand-dark/50 font-sans">When customers submit custom colour or size requests, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(enq => (
            <EnquiryCard
              key={enq.id}
              enq={enq}
              onStatusChange={(id, status) => dispatch(updateEnquiryStatus({ id, status }))}
              onDelete={(id) => dispatch(deleteEnquiry(id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};
