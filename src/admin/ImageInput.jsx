import React, { useState, useRef } from 'react';
import { Upload, Link2, X, Image as ImageIcon } from 'lucide-react';

/**
 * ImageInput — reusable component for picking an image either by:
 *   • Uploading a file from the computer (File object)
 *   • Pasting an image URL
 *
 * Props:
 *   value    — current image src (File object, blob URL, or URL string)
 *   onChange — called with the new src string
 *   label    — optional field label
 *   height   — optional preview height class (default 'h-32')
 */
export const ImageInput = ({ value, onChange, label, height = 'h-32' }) => {
  const [tab, setTab] = useState('upload'); // 'upload' | 'url'
  const [urlVal, setUrlVal] = useState(typeof value === 'string' && value.startsWith('http') ? value : '');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  // Pass raw file up to parent, and show local preview
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Please use an image under 5 MB.');
      return;
    }
    setError('');
    onChange(file); // Pass the raw File object
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUrlSave = () => {
    if (!urlVal.trim()) return;
    setError('');
    onChange(urlVal.trim());
  };

  const clear = () => {
    onChange('');
    setUrlVal('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const previewSrc = React.useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return value;
  }, [value]);

  // Clean up blob URLs to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith('blob:')) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  return (
    <div>
      {label && (
        <label className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest font-sans mb-2 block">
          {label}
        </label>
      )}

      {/* Tab switcher */}
      <div className="flex rounded-xl overflow-hidden border border-brand-border mb-3 text-xs font-semibold font-sans">
        {[
          { key: 'upload', icon: Upload,  text: 'Upload File' },
          { key: 'url',    icon: Link2,   text: 'Paste URL'   },
        ].map(({ key, icon: Icon, text }) => (
          <button
            key={key}
            type="button"
            onClick={() => { setTab(key); setError(''); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors"
            style={tab === key
              ? { background: '#073b3a', color: '#e0f4ee' }
              : { background: '#e0f4ee', color: '#6B7280' }}
          >
            <Icon className="w-3.5 h-3.5" /> {text}
          </button>
        ))}
      </div>

      {/* ── Upload tab ── */}
      {tab === 'upload' && (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none
            ${dragging ? 'border-green-500 bg-green-50' : 'border-brand-border hover:border-green-400 hover:bg-brand-muted'}`}
          style={{ minHeight: '88px' }}
        >
          <Upload className="w-5 h-5 text-gray-300" />
          <p className="text-xs text-brand-dark/50 font-sans text-center px-3">
            <span className="font-semibold text-brand-dark/80">Click to upload</span> or drag & drop<br />
            <span className="text-[11px]">JPG, PNG, WEBP — max 5 MB</span>
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* ── URL tab ── */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlVal}
            onChange={(e) => setUrlVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSave()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-brand-border rounded-xl px-3 py-2.5 text-xs font-sans focus:outline-none focus:border-green-600 bg-brand-light"
          />
          <button
            type="button"
            onClick={handleUrlSave}
            className="px-3 py-2.5 rounded-xl text-xs font-bold text-white transition-colors whitespace-nowrap"
            style={{ background: '#073b3a' }}
          >
            Use
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-500 font-sans mt-1.5">{error}</p>
      )}

      {/* Live preview */}
      {value && (
        <div className={`relative mt-3 ${height} rounded-xl overflow-hidden border border-brand-border bg-brand-muted group`}>
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; setError('Could not load this image. Please check the URL or try another file.'); }}
            onLoad={(e) => { e.target.style.display = 'block'; setError(''); }}
          />
          {/* Clear button */}
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm font-sans">
              Preview
            </span>
          </div>
        </div>
      )}

      {/* Empty state icon */}
      {!value && (
        <div className="flex items-center justify-center mt-2 h-8">
          <ImageIcon className="w-4 h-4 text-gray-200" />
          <span className="text-[11px] text-gray-300 ml-1.5 font-sans">No image selected</span>
        </div>
      )}
    </div>
  );
};
