import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateWhyReason, addWhyReason, deleteWhyReason, updateWhyTitle } from '../../features/admin/adminSlice';
import { EditableText } from '../admin/EditableText';
import { Plus, Trash2 } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

export const WhyChooseUs = () => {
  const dispatch   = useDispatch();
  const reasons    = useSelector(s => s.admin.whyChooseUs) || [];
  const title      = useSelector(s => s.admin.content?.whyChooseTitle) || "Why Moms Choose A'DOREMOM";
  const isEditMode = useSelector(s => s.editMode.active);

  return (
    <section style={{ background: '#073b3a' }} className="py-20">
      <div className="section-wrap">

        {/* Section heading — editable in edit mode */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-2 font-sans">Our Promise</p>
          <EditableText
            value={title}
            onSave={(val) => dispatch(updateWhyTitle(val))}
            as="h2"
            className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight"
          />
          <div className="w-16 h-0.5 bg-white/30 mx-auto mt-4 rounded-full" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.id}
              variants={FADE_UP}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="relative bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-7 text-center hover:bg-white/15 transition-colors duration-300 group"
            >
              {/* Delete button — only in edit mode */}
              {isEditMode && (
                <button
                  onClick={() => { if (window.confirm('Remove this card?')) dispatch(deleteWhyReason(r.id)); }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 text-white rounded-lg p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Emoji — editable */}
              <EditableText
                value={r.emoji}
                onSave={(val) => dispatch(updateWhyReason({ ...r, emoji: val }))}
                as="div"
                className="text-4xl mb-4"
              />
              {/* Title — editable */}
              <EditableText
                value={r.title}
                onSave={(val) => dispatch(updateWhyReason({ ...r, title: val }))}
                as="h3"
                className="font-serif text-lg font-bold text-white mb-2"
              />
              {/* Description — editable */}
              <EditableText
                value={r.desc}
                onSave={(val) => dispatch(updateWhyReason({ ...r, desc: val }))}
                as="p"
                className="text-white/70 text-sm leading-relaxed font-sans"
                multiline
              />
            </motion.div>
          ))}

          {/* Add card button — only in edit mode */}
          {isEditMode && (
            <motion.button
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => dispatch(addWhyReason({}))}
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/30 rounded-2xl p-7 text-white/50 hover:text-white hover:border-white/60 transition-colors duration-300 min-h-[160px]"
            >
              <Plus className="w-7 h-7" />
              <span className="text-sm font-semibold font-sans">Add Card</span>
            </motion.button>
          )}
        </div>

      </div>
    </section>
  );
};
