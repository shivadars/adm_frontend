import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * EditableText — renders normal text when edit mode is OFF.
 * When ON, clicking shows inline input/textarea with dashed blue hover indicator.
 *
 * Props:
 *   value      — current text string
 *   onSave     — called with new string when admin finishes editing
 *   as         — HTML tag to render as (default 'span')
 *   className  — classes applied to the wrapper element
 *   multiline  — true → textarea, false → input
 *   placeholder — text shown when value is empty
 */
export const EditableText = ({
  value,
  onSave,
  as: Tag = 'span',
  className = '',
  multiline = false,
  placeholder = 'Click to edit...',
}) => {
  const isEditMode = useSelector(s => s.editMode.active);
  const [editing,  setEditing]  = useState(false);
  const [val,      setVal]      = useState(value);
  const [hovered,  setHovered]  = useState(false);
  const ref = useRef(null);

  // Sync when parent changes value (e.g. after Redux update)
  useEffect(() => { if (!editing) setVal(value); }, [value, editing]);

  // Auto-focus input when editing starts
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const save = () => {
    setEditing(false);
    setHovered(false);
    if (val !== value) onSave(val);
  };

  const cancel = () => { setVal(value); setEditing(false); setHovered(false); };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  };

  // ── Normal mode ────────────────────────────────────────────────────────────
  if (!isEditMode) return <Tag className={className}>{value}</Tag>;

  // ── Editing mode (input open) ──────────────────────────────────────────────
  if (editing) {
    const sharedStyle = {
      background: 'rgba(255,255,255,0.97)',
      border: '2px solid #3B82F6',
      borderRadius: '6px',
      outline: 'none',
      padding: '4px 8px',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      color: '#111827',
      resize: 'vertical',
      display: 'block',
    };
    return multiline
      ? <textarea ref={ref} value={val} rows={3} onChange={e => setVal(e.target.value)} onBlur={save} onKeyDown={handleKeyDown} style={sharedStyle} />
      : <input    ref={ref} value={val}          onChange={e => setVal(e.target.value)} onBlur={save} onKeyDown={handleKeyDown} style={sharedStyle} />;
  }

  // ── Edit mode — hoverable ──────────────────────────────────────────────────
  return (
    <Tag
      className={className}
      onClick={() => setEditing(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        outline:      hovered ? '2px dashed #60A5FA' : '2px dashed transparent',
        outlineOffset: '3px',
        borderRadius:  '4px',
        cursor:        'pointer',
        transition:    'outline-color 0.15s',
        position:      'relative',
      }}
    >
      {val || <span style={{ opacity: 0.45, fontStyle: 'italic' }}>{placeholder}</span>}

      {/* Tooltip badge */}
      {hovered && (
        <span style={{
          position:      'absolute',
          top:           '-22px',
          left:          '0',
          background:    '#3B82F6',
          color:         'white',
          fontSize:      '10px',
          fontWeight:    700,
          padding:       '2px 8px',
          borderRadius:  '4px',
          whiteSpace:    'nowrap',
          pointerEvents: 'none',
          zIndex:        1000,
          fontFamily:    'DM Sans, sans-serif',
        }}>
          ✏️ Click to edit
        </span>
      )}
    </Tag>
  );
};
