import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  PawPrint, Plus, Trash2, GripVertical, Save, X, 
  Type, Calendar, Hash, Image as ImageIcon, AtSign, Sparkles 
} from 'lucide-react';
import { selectPetFields, updateFields } from '../features/pets/petSlice';
import { motion } from 'framer-motion';

const AdminPetProfiles = () => {
  const dispatch = useDispatch();
  const currentFields = useSelector(selectPetFields) || [];
  const [fields, setFields] = useState(currentFields);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAddField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: 'Enter detail...'
    };
    setFields([...fields, newField]);
    setHasChanges(true);
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(f => f.id !== id));
    setHasChanges(true);
  };

  const handleUpdateField = (id, updates) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    setHasChanges(true);
  };

  const handleSave = () => {
    dispatch(updateFields(fields));
    setHasChanges(false);
    alert('Pet Profile fields updated successfully!');
  };

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'date', label: 'Date Picker', icon: Calendar },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'image', label: 'Photo Upload', icon: ImageIcon },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-extrabold text-[#073b3a] uppercase tracking-[0.2em] mb-2 font-sans">Dynamic CMS</p>
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Pet Profile Configuration</h1>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <button 
              onClick={() => { setFields(currentFields); setHasChanges(false); }}
              className="px-6 py-2.5 rounded-xl border-2 border-brand-border text-sm font-bold text-brand-dark/60 hover:bg-brand-muted transition-all"
            >
              Discard
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 bg-[#073b3a] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-brand-border shadow-soft overflow-hidden">
        <div className="p-8 border-b border-brand-border /30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#073b3a]/10 rounded-xl flex items-center justify-center text-[#073b3a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-dark">Manage Profile Fields</h2>
              <p className="text-sm text-brand-dark/50">Add or remove details that users should fill for their pets.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div 
                key={field.id}
                className="group flex items-start gap-4 p-5 bg-brand-muted/30 rounded-2xl border border-transparent hover:border-brand-border transition-all"
              >
                <div className="mt-3 cursor-grab text-brand-dark/20 group-hover:text-brand-dark/40">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Field Label</label>
                    <input 
                      value={field.label}
                      onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                      className="w-full h-11 px-4 bg-white border border-brand-border rounded-xl text-sm font-sans focus:border-[#073b3a] outline-none transition-all"
                    />
                  </div>
                  
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Input Type</label>
                    <select 
                      value={field.type}
                      onChange={(e) => handleUpdateField(field.id, { type: e.target.value })}
                      className="w-full h-11 px-4 bg-white border border-brand-border rounded-xl text-sm font-sans focus:border-[#073b3a] outline-none transition-all appearance-none"
                    >
                      {fieldTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Placeholder / Hint</label>
                    <input 
                      value={field.placeholder || ''}
                      onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                      className="w-full h-11 px-4 bg-white border border-brand-border rounded-xl text-sm font-sans focus:border-[#073b3a] outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end justify-center pb-2">
                    <div className="flex flex-col items-center gap-1">
                      <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Req?</label>
                      <input 
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                        className="w-5 h-5 rounded border-brand-border text-[#073b3a] focus:ring-[#073b3a]"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemoveField(field.id)}
                  className="mt-7 p-2 text-brand-dark/20 hover:text-red-500 transition-colors"
                  title="Remove field"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button 
              onClick={handleAddField}
              className="w-full py-6 border-2 border-dashed border-brand-border rounded-2xl flex items-center justify-center gap-2 text-brand-dark/40 hover:text-[#073b3a] hover:border-[#073b3a] hover:bg-[#073b3a]/5 transition-all group font-bold uppercase tracking-widest text-[11px]"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
              Add Custom Detail Field
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-[#073b3a]/5 rounded-2xl p-6 border border-[#073b3a]/10">
        <p className="text-sm text-[#073b3a]/70 flex items-center gap-2">
          <PawPrint className="w-4 h-4" />
          <strong>Pro Tip:</strong> Changes here will immediately reflect on the user onboarding page and pet profiles.
        </p>
      </div>
    </div>
  );
};

export default AdminPetProfiles;
