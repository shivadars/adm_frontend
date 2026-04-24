/**
 * SizeGuide.jsx
 * Reusable size chart modal for cat and dog measurements.
 * Data sourced from the A'DOREMOM official size guide.
 */
import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Size chart data ───────────────────────────────────────────────────────
const DOG_SIZES = [
  { size: 'XXS',  neck: '9–10',   chest: '11–13', back: '7–9',   toe: '—',    breeds: 'Toy Poodle',                           price: '₹150/- Less' },
  { size: 'XS',   neck: '10–11',  chest: '13–15', back: '9–11',  toe: '—',    breeds: 'Chihuahua / Pomeranian / Yorkshire Terrier', price: '₹150/- Less' },
  { size: 'S',    neck: '12–13',  chest: '15–17', back: '11–13', toe: '—',    breeds: 'Small Terrier / Shih Tzu',              price: 'Catalog Price' },
  { size: 'M',    neck: '14–15',  chest: '19–20', back: '14–16', toe: '—',    breeds: 'Iggy / Bichon Frise / Pug / Poodle',   price: 'Catalog Price' },
  { size: 'L',    neck: '19–20',  chest: '23–25', back: '17–19', toe: '—',    breeds: 'Beagle / French Bulldog',              price: 'Catalog Price' },
  { size: 'XL',   neck: '22–23',  chest: '27–29', back: '20–22', toe: '—',    breeds: 'Border Collie / Corgi / Shiba Inu',    price: '₹150/- More' },
  { size: 'XXL',  neck: '25–26',  chest: '33–35', back: '23–25', toe: '—',    breeds: 'Labrador',                             price: '₹150/- More' },
  { size: 'XXXL', neck: '27–29',  chest: '36–40', back: '26–28', toe: '—',    breeds: 'German Shepherd / Golden Retriever / Dobermann', price: '₹150/- More' },
];

const CAT_SIZES = [
  { size: 'XXS',  neck: '5–7',   chest: '8–10',  back: '5–6',   price: '₹200/- Less' },
  { size: 'XS',   neck: '6–8',   chest: '10–12', back: '7–8',   price: '₹200/- Less' },
  { size: 'S',    neck: '8–10',  chest: '12–14', back: '9–10',  price: '₹150/- Less' },
  { size: 'M',    neck: '10–12', chest: '14–16', back: '11–12', price: '₹150/- Less' },
  { size: 'L',    neck: '12–14', chest: '16–18', back: '13–14', price: 'Catalog Price' },
  { size: 'XL',   neck: '14–16', chest: '18–20', back: '15–16', price: 'Catalog Price' },
  { size: 'XXL',  neck: '16–18', chest: '20–22', back: '17–18', price: 'Catalog Price' },
  { size: 'XXXL', neck: '18–20', chest: '22–24', back: '19–20', price: 'Catalog Price' },
];

const SizeTag = ({ size }) => {
  const colors = {
    XXS: 'bg-purple-100 text-purple-700', XS: 'bg-blue-100 text-blue-700',
    S: 'bg-green-100 text-green-700',     M: 'bg-teal-100 text-teal-700',
    L: 'bg-amber-100 text-amber-700',     XL: 'bg-orange-100 text-orange-700',
    XXL: 'bg-red-100 text-red-700',       XXXL: 'bg-rose-100 text-rose-700',
  };
  return (
    <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-full ${colors[size] || 'bg-gray-100 text-gray-700'}`}>
      {size}
    </span>
  );
};

export const SizeGuide = ({ open, onClose, defaultTab = 'dog' }) => {
  const [tab, setTab] = useState(defaultTab);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-brand-border shrink-0">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-brand-dark" />
                <h2 className="font-serif text-xl font-bold text-brand-dark">Size & Measurement Guide</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-brand-muted transition-colors">
                <X className="w-5 h-5 text-brand-dark/60" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-5 sm:px-8 pt-4 gap-2 shrink-0">
              {['dog', 'cat'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold font-sans transition-all ${
                    tab === t
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-dark/60 hover:bg-brand-muted'
                  }`}
                >
                  {t === 'dog' ? '🐶 Dog' : '🐱 Cat'}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6">

              {/* Measuring instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm font-sans">
                <p className="font-bold text-amber-800 mb-2">📏 How to Measure</p>
                {tab === 'dog' ? (
                  <ul className="text-amber-700 space-y-1 text-xs">
                    <li>• <strong>Neck Length</strong> — measure around the neck where collar sits</li>
                    <li>• <strong>Chest Length</strong> — widest point around the chest / ribcage</li>
                    <li>• <strong>Back Length</strong> — base of neck to base of tail</li>
                    <li>• <strong>Top to Toe Height</strong> — floor to top of shoulder blades</li>
                  </ul>
                ) : (
                  <ul className="text-amber-700 space-y-1 text-xs">
                    <li>• <strong>Neck Length</strong> — measure around the neck where collar sits</li>
                    <li>• <strong>Chest Length</strong> — widest point around the chest / ribcage</li>
                    <li>• <strong>Back Length</strong> — base of neck to base of tail</li>
                  </ul>
                )}
                <p className="mt-3 text-xs text-amber-700 font-semibold bg-amber-100 rounded-xl px-3 py-2">
                  ⚠️ Always add <strong>1 inch extra</strong> to every measurement — this gives your pet space to breathe comfortably.
                </p>
              </div>

              {/* Size table */}
              <div className="overflow-x-auto rounded-2xl border border-brand-border">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="bg-brand-dark text-white text-xs uppercase tracking-wider font-bold">
                      <th className="px-4 py-3 text-left rounded-tl-2xl">Size</th>
                      <th className="px-4 py-3 text-left">Neck (in)</th>
                      <th className="px-4 py-3 text-left">Chest (in)</th>
                      <th className="px-4 py-3 text-left">Back (in)</th>
                      {tab === 'dog' && <th className="px-4 py-3 text-left">Breeds</th>}
                      <th className="px-4 py-3 text-right rounded-tr-2xl">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tab === 'dog' ? DOG_SIZES : CAT_SIZES).map((row, i) => (
                      <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-muted/40'}>
                        <td className="px-4 py-3"><SizeTag size={row.size} /></td>
                        <td className="px-4 py-3 text-brand-dark/80 font-mono text-xs">{row.neck}"</td>
                        <td className="px-4 py-3 text-brand-dark/80 font-mono text-xs">{row.chest}"</td>
                        <td className="px-4 py-3 text-brand-dark/80 font-mono text-xs">{row.back}"</td>
                        {tab === 'dog' && (
                          <td className="px-4 py-3 text-brand-dark/60 text-xs">{row.breeds}</td>
                        )}
                        <td className="px-4 py-3 text-right text-xs font-semibold text-brand-dark/70">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-brand-dark/40 font-sans text-center pb-2">
                * All measurements in inches. For queries, contact us via chat or call.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuide;
