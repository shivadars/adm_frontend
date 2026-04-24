import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateWhyReason } from '../../features/admin/adminSlice';
import { EditableText } from '../admin/EditableText';

const DEFAULT_WHY = [
  { id: 'w1', emoji: '💰', title: 'Pocket-Friendly', desc: 'Premium quality pet fashion without burning a hole in your pocket. Style meets affordability.' },
  { id: 'w2', emoji: '🧵', title: 'Handmade Quality', desc: 'Every stitch is sewn with care by skilled hands. No factory shortcuts — just love and craft.' },
  { id: 'w3', emoji: '🐾', title: 'Zero Fur Damage', desc: 'Our soft, tested fabrics are gentle on fur and skin. No itching, no tangling, no stress.' },
  { id: 'w4', emoji: '💪', title: 'Built to Last', desc: 'Wash after wash, our outfits hold their shape and color — because durability is love too.' },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

export const WhyChooseUs = () => {
  const dispatch   = useDispatch();
  const reasons    = useSelector(s => s.admin.whyChooseUs) || DEFAULT_WHY;

  return (
    <section className="bg-brand-dark py-20">
      <div className="section-wrap">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light/70 mb-2">Our Promise</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-light leading-tight">
            Why Moms Choose A'DOREMOM
          </h2>
          <div className="w-16 h-0.5 bg-brand-light/40 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.id}
              variants={FADE_UP}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-7 text-center hover:bg-white/15 transition-colors duration-300"
            >
              {/* Emoji editable */}
              <EditableText
                value={r.emoji}
                onSave={(val) => dispatch(updateWhyReason({ ...r, emoji: val }))}
                as="div"
                className="text-4xl mb-4"
              />
              {/* Title editable */}
              <EditableText
                value={r.title}
                onSave={(val) => dispatch(updateWhyReason({ ...r, title: val }))}
                as="h3"
                className="font-serif text-lg font-bold text-brand-light mb-2"
              />
              {/* Description editable */}
              <EditableText
                value={r.desc}
                onSave={(val) => dispatch(updateWhyReason({ ...r, desc: val }))}
                as="p"
                className="text-brand-light/75 text-sm leading-relaxed font-sans"
                multiline
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
