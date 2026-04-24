import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ImageInput } from '../../admin/ImageInput';

/**
 * EditableImage — renders a normal <img> in view mode.
 * In Edit Mode, a floating camera button (📷) appears at the top-right corner
 * of the parent (which must be position:relative). Clicking it opens
 * a modal with both upload-from-device and paste-URL options.
 *
 * Props:
 *   src            — current image src
 *   onSave         — called with new src string
 *   alt, className — forwarded to <img>
 */
export const EditableImage = ({ src, onSave, alt = '', className = '' }) => {
  const isEditMode = useSelector(s => s.editMode.active);
  const [open,   setOpen]   = useState(false);
  const [newSrc, setNewSrc] = useState(src);

  useEffect(() => { setNewSrc(src); }, [src]);

  const handleSave = () => { onSave(newSrc); setOpen(false); };
  const handleCancel = () => { setNewSrc(src); setOpen(false); };

  if (!isEditMode) return <img src={src} alt={alt} className={className} />;

  return (
    <>
      {/* The image itself */}
      <img src={src} alt={alt} className={className} />

      {/* Floating camera btn — absolute-positioned within nearest relative parent */}
      <button
        onClick={() => setOpen(true)}
        title="Change image"
        style={{
          position:       'absolute',
          top:            '10px',
          right:          '10px',
          zIndex:         30,
          width:          '36px',
          height:         '36px',
          borderRadius:   '50%',
          background:     'rgba(0,0,0,0.65)',
          border:         '2px solid rgba(255,255,255,0.5)',
          backdropFilter: 'blur(6px)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '15px',
          transition:     'background 0.15s, transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.85)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.65)';     e.currentTarget.style.transform = 'scale(1)';   }}
      >
        📷
      </button>

      {/* Modal */}
      {open && (
        <div style={{
          position:       'fixed',
          inset:          0,
          background:     'rgba(0,0,0,0.65)',
          zIndex:         2000,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '16px',
        }}>
          <div style={{
            background:   '#e0f4ee',
            borderRadius: '20px',
            padding:      '24px',
            width:        '100%',
            maxWidth:     '420px',
            maxHeight:    '90vh',
            overflowY:    'auto',
            boxShadow:    '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '18px', color: '#111827', margin: 0 }}>
                Change Image
              </h3>
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6B7280' }}>✕</button>
            </div>

            <ImageInput
              value={newSrc}
              onChange={setNewSrc}
              height="h-40"
              label="Upload from device or paste URL"
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={handleCancel}
                style={{ flex: 1, padding: '10px', border: '1px solid #b2e3d9', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, cursor: 'pointer', background: 'white', color: '#6B7280' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!newSrc}
                style={{ flex: 1, padding: '10px', background: '#073b3a', color: '#e0f4ee', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, cursor: 'pointer', border: 'none', opacity: newSrc ? 1 : 0.5 }}
              >
                Replace Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
