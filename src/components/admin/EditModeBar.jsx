import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, LayoutDashboard, Star } from 'lucide-react';
import { setEditMode } from '../../features/editMode/editModeSlice';
import { Link } from 'react-router-dom';

export const EditModeBar = () => {
  const { active } = useSelector(s => s.editMode);
  const { role }   = useSelector(s => s.auth);
  const dispatch   = useDispatch();

  const isAdmin = role === 'admin' || role === 'superadmin';
  if (!isAdmin) return null;

  const fabBase = {
    position: 'fixed', bottom: '28px', zIndex: 1000,
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 18px', border: 'none', borderRadius: '50px',
    fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
    fontSize: '13px', cursor: 'pointer', letterSpacing: '0.03em',
  };

  return (
    <>
      {/* ── OFF state: two FABs ────────────────────────────────────── */}
      <AnimatePresence>
        {!active && (
          <>
            {/* Edit Site — bottom right */}
            <motion.button
              key="fab-edit"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1,   y: 0  }}
              exit={{    opacity: 0, scale: 0.8, y: 20  }}
              transition={{ duration: 0.25 }}
              onClick={() => dispatch(setEditMode(true))}
              title="Enter Edit Mode"
              style={{ ...fabBase, right: '28px', background: '#073b3a', color: '#e0f4ee', boxShadow: '0 4px 20px rgba(7,59,58,0.45)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0d5c5a'}
              onMouseLeave={e => e.currentTarget.style.background = '#073b3a'}
            >
              <Pencil style={{ width: '14px', height: '14px' }} />
              Edit Site
            </motion.button>

            {/* Dashboard — bottom left */}
            <motion.div
              key="fab-dash"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1,   y: 0  }}
              exit={{    opacity: 0, scale: 0.8, y: 20  }}
              transition={{ duration: 0.25, delay: 0.05 }}
              style={{ position: 'fixed', bottom: '28px', left: '28px', zIndex: 1000 }}
            >
              <Link
                to="/admin"
                style={{ ...fabBase, position: 'static', background: 'rgba(7,59,58,0.1)', color: '#073b3a', border: '1.5px solid rgba(7,59,58,0.25)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#073b3a'; e.currentTarget.style.color = '#e0f4ee'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(7,59,58,0.1)'; e.currentTarget.style.color = '#073b3a'; }}
              >
                <LayoutDashboard style={{ width: '14px', height: '14px' }} />
                Dashboard
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── ON state: bottom bar ───────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{    y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
              background: '#073b3a', borderTop: '2px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px', height: '52px', boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
              gap: '12px',
            }}
          >
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, minWidth: 0 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.25)', flexShrink: 0 }} />
              <span style={{ color: '#e0f4ee', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                Edit Mode
              </span>
              <span style={{ color: 'rgba(224,244,238,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', display: 'none' }} className="sm:block">
                — click any blue-outlined element to edit
              </span>
              <Link
                to="/admin"
                className="hidden md:flex"
                style={{ alignItems: 'center', gap: '5px', padding: '5px 12px', background: 'rgba(255,255,255,0.12)', color: '#e0f4ee', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', textDecoration: 'none' }}
              >
                <LayoutDashboard style={{ width: '12px', height: '12px' }} />
                Dashboard
              </Link>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <Link
                to="/admin/reviews"
                className="hidden sm:flex"
                style={{ alignItems: 'center', gap: '5px', padding: '5px 12px', background: 'rgba(255,255,255,0.08)', color: '#e0f4ee', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', textDecoration: 'none' }}
              >
                <Star style={{ width: '11px', height: '11px' }} />
                Manage Reviews
              </Link>
              <span style={{ color: 'rgba(224,244,238,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '11px' }} className="hidden lg:inline">
                Auto-saved
              </span>
              <button
                onClick={() => dispatch(setEditMode(false))}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#a83b25'}
                onMouseLeave={e => e.currentTarget.style.background = '#cc0000'}
              >
                <X style={{ width: '13px', height: '13px' }} />
                Exit Edit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blue edge ring */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="edge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999, outline: '3px solid rgba(59,130,246,0.28)', outlineOffset: '-3px' }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
