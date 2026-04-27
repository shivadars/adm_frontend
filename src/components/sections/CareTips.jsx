import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateContent } from '../../features/admin/adminSlice';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import { ImageIcon } from 'lucide-react';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=900';

export const CareTips = () => {
  const dispatch   = useDispatch();
  const content    = useSelector(s => s.admin.content) || {};
  const isEditMode = useSelector(s => s.editMode.active);

  const overline = content.careTipsOverline || 'Pet Care Guide';
  const title    = content.careTipsTitle    || "Care Tips from Mom's Desk 🐾";
  const subtitle = content.careTipsSubtitle || "Follow these simple tips to ensure your fur baby's outfit stays fresh, soft, and beautiful for longer.";
  const image    = content.careTipsImage    || PLACEHOLDER_IMAGE;

  const save = (key, val) => dispatch(updateContent({ [key]: val }));

  return (
    <section className="py-20 bg-brand-muted">
      <div className="section-wrap">

        {/* Heading */}
        <div className="text-center mb-14">
          <EditableText
            value={overline}
            onSave={(v) => save('careTipsOverline', v)}
            as="p"
            className="brand-overline mb-1.5"
          />
          <EditableText
            value={title}
            onSave={(v) => save('careTipsTitle', v)}
            as="h2"
            className="brand-title"
          />
          <EditableText
            value={subtitle}
            onSave={(v) => save('careTipsSubtitle', v)}
            as="p"
            className="text-brand-dark/80 mt-3 text-sm font-sans max-w-lg mx-auto"
            multiline
          />
        </div>

        {/* Image box */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden shadow-boutique max-w-4xl mx-auto"
          style={{ minHeight: '320px' }}
        >
          {image ? (
            <EditableImage
              src={image}
              alt="Care Tips"
              className="w-full h-full object-cover"
              onSave={(v) => save('careTipsImage', v)}
            />
          ) : (
            /* Empty state — only shown when no image set yet */
            <div className="w-full flex flex-col items-center justify-center bg-white/60 border-2 border-dashed border-brand-border rounded-3xl"
              style={{ minHeight: '320px' }}>
              <ImageIcon className="w-14 h-14 text-brand-dark/20 mb-4" />
              <p className="text-brand-dark/40 font-sans text-sm font-semibold">
                {isEditMode ? 'Click the 📷 button to upload your Dos & Don\'ts image' : 'No image set yet'}
              </p>
              {/* In edit mode we still need EditableImage to render the camera button */}
              {isEditMode && (
                <EditableImage
                  src=""
                  alt="Care Tips"
                  className="hidden"
                  onSave={(v) => save('careTipsImage', v)}
                />
              )}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};
