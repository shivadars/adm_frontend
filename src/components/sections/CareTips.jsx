import React from 'react';
import { motion } from 'framer-motion';

const dos = [
  'Measure your pet before ordering',
  'Use gentle, cold machine wash',
  'Air dry in shade to preserve color',
  'Check for accurate size using our size chart',
  'Store folded in a cotton bag',
];

const donts = [
  "Don't force outfit if it doesn't fit",
  "Avoid tumble drying — it shrinks fabric",
  "Don't use bleach or harsh detergents",
  "Don't leave on unattended sleeping pets",
  "Avoid direct ironing on print/embellishments",
];

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' } }),
};

export const CareTips = () => (
  <section className="py-20 bg-brand-muted">
    <div className="section-wrap">
      <div className="text-center mb-14">
        <p className="brand-overline mb-1.5">Pet Care Guide</p>
        <h2 className="brand-title">Care Tips from Mom's Desk 🐾</h2>
        <p className="text-brand-dark/80 mt-3 text-sm font-sans max-w-lg mx-auto">
          Follow these simple tips to ensure your fur baby's outfit stays fresh, soft, and beautiful for longer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Do's */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="boutique-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-dark/10 flex items-center justify-center text-xl">✅</div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">DO's</h3>
          </div>
          <ul className="space-y-3">
            {dos.map((tip, i) => (
              <motion.li
                key={tip}
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex items-start gap-3 text-sm text-brand-dark font-sans"
              >
                <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-dark/10 text-brand-dark flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Don'ts */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="boutique-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-xl">⛔</div>
            <h3 className="font-serif text-xl font-bold text-brand-blue">DON'Ts</h3>
          </div>
          <ul className="space-y-3">
            {donts.map((tip, i) => (
              <motion.li
                key={tip}
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex items-start gap-3 text-sm text-brand-dark font-sans"
              >
                <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-bold shrink-0">✕</span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);
