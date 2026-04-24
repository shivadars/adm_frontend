import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateContent } from '../../features/admin/adminSlice';
import { EditableText } from '../admin/EditableText';

const DEFAULT_MESSAGES = [
  "🐾  Handmade with a Mother's Love  •  Free Shipping above ₹999",
  "🎀  New Arrivals: Monsoon Collection is here!",
  "💚  No Fur Damage, No Discomfort — A'DOREMOM Promise",
];

export const OfferStrip = () => {
  const dispatch    = useDispatch();
  const isEditMode  = useSelector(s => s.editMode.active);
  const offerContent = useSelector(s => s.admin.content);
  const messages    = offerContent?.offerMessages || DEFAULT_MESSAGES;

  const [idx, setIdx] = useState(0);

  // Rotate in normal mode, pause in edit mode
  useEffect(() => {
    if (isEditMode) return;
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [isEditMode, messages.length]);

  const saveMessage = (i, val) => {
    const newMsgs = [...messages];
    newMsgs[i] = val;
    dispatch(updateContent({ offerMessages: newMsgs }));
  };

  return (
    <div
      className="bg-[#073b3a] text-[#e0f4ee] text-center text-xs sm:text-sm font-medium overflow-hidden relative flex items-center justify-center"
      style={{ minHeight: isEditMode ? 'auto' : '36px' }}
    >
      {isEditMode ? (
        /* ── Edit mode: show all messages as editable rows ── */
        <div className="w-full flex flex-col items-center divide-y divide-[#e0f4ee]/20 py-1">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#e0f4ee]/70 py-1 px-4 font-sans">
            ✏️ Offer Strip Messages — click each to edit
          </p>
          {messages.map((msg, i) => (
            <div key={i} className="w-full flex justify-center py-1.5 px-4">
              <EditableText
                value={msg}
                onSave={(val) => saveMessage(i, val)}
                as="span"
                className="tracking-wide font-sans text-[#e0f4ee] text-xs sm:text-sm text-center"
              />
            </div>
          ))}
        </div>
      ) : (
        /* ── Normal mode: rotating animation ── */
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="absolute tracking-wide font-sans"
          >
            {messages[idx]}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
};
