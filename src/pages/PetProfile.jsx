import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PawPrint, Plus, Trash2, Edit2, AtSign, Calendar,
  Heart, X, Image as ImageIcon, Ruler, Check, Edit3
} from 'lucide-react';
import { selectUserPets, deletePet, addPet, updatePet, selectPetFields, updatePetMeasurements, fetchUserPets } from '../features/pets/petSlice';
import { SizeGuide } from '../components/common/SizeGuide';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

// ── Inline Measurement Editor ─────────────────────────────────────────────
const MeasurementsCard = ({ pet, userId, dispatch }) => {
  const saved = pet.measurements || {};
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({ ...saved });
  const [guide,   setGuide]   = useState(false);

  const handleSave = () => {
    dispatch(updatePetMeasurements({ userId, petId: pet.id, measurements: form }));
    setEditing(false);
  };

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const hasMeasurements = saved.neckLength || saved.chestLength || saved.backLength || saved.size;

  return (
    <>
      <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-brand-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-brand-dark/50" />
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dark/40">Measurements</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGuide(true)}
              className="text-[10px] font-bold text-brand-dark/50 hover:text-brand-dark underline"
            >
              Size Guide
            </button>
            {!editing && (
              <button
                onClick={() => { setForm({ ...saved }); setEditing(true); }}
                className="flex items-center gap-1 text-[10px] font-bold text-brand-dark border border-brand-border rounded-lg px-2 py-1 hover:bg-brand-muted transition-colors"
              >
                <Edit3 className="w-3 h-3" /> {hasMeasurements ? 'Edit' : 'Add'}
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[['neckLength', 'Neck (in)'], ['chestLength', 'Chest (in)'], ['backLength', 'Back (in)'], ['topToToeHeight', 'Top-to-Toe (in)']].map(([key, label]) => (
                <div key={key}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-1">{label}</label>
                  <input
                    value={form[key] || ''}
                    onChange={setF(key)}
                    placeholder='e.g. 12"'
                    className="w-full border border-brand-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-dark"
                  />
                </div>
              ))}
            </div>

            {/* Size picker */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 block mb-2">Size</label>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, size: sz }))}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs border-2 transition-all ${
                      form.size === sz
                        ? 'border-brand-dark bg-brand-dark text-white'
                        : 'border-brand-border text-brand-dark/60 hover:border-brand-dark/50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1 bg-brand-dark text-white text-xs font-bold py-2 rounded-xl hover:bg-green-700 transition-colors">
                <Check className="w-3.5 h-3.5" /> Save
              </button>
              <button onClick={() => setEditing(false)} className="flex-1 text-xs font-bold py-2 rounded-xl border border-brand-border text-brand-dark/60 hover:bg-brand-muted transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : hasMeasurements ? (
          <div className="space-y-2">
            {saved.size && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-dark/50 font-sans">Current Size</span>
                <span className="text-sm font-extrabold text-brand-dark bg-brand-muted px-3 py-1 rounded-full font-mono">{saved.size}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[['neckLength', 'Neck'], ['chestLength', 'Chest'], ['backLength', 'Back'], ['topToToeHeight', 'Top-Toe']].map(([key, label]) =>
                saved[key] ? (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-[10px] text-brand-dark/40 font-sans">{label}</span>
                    <span className="text-xs font-bold text-brand-dark/70 font-mono">{saved[key]}"</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-brand-dark/30 font-sans italic">No measurements saved yet. Add them to auto-fill at checkout.</p>
        )}
      </div>

      <SizeGuide open={guide} onClose={() => setGuide(false)} />
    </>
  );
};

// ── Main PetProfile Page ──────────────────────────────────────────────────
const PetProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const pets     = useSelector(state => selectUserPets(state, user?.id)) || [];
  const fields   = useSelector(selectPetFields) || [];

  const [showAddModal, setShowAddModal] = useState(false);

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPets(user.id));
    }
  }, [dispatch, user?.id]);
  const [editingPet,   setEditingPet]   = useState(null);
  const [formData,     setFormData]     = useState({});
  const [preview,      setPreview]      = useState(null);

  // Clean up object URLs to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleOpenAdd = () => {
    setFormData({});
    setPreview(null);
    setEditingPet(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (pet) => {
    setEditingPet(pet);
    setFormData(pet);
    setPreview(pet.photo);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPet) {
      dispatch(updatePet({ userId: user.id, petId: editingPet.id, updates: formData }));
    } else {
      dispatch(addPet({ userId: user.id, pet: formData }));
    }
    setShowAddModal(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the raw file object in state for the API
      setFormData(prev => ({ ...prev, photo: file }));
      // Use createObjectURL for local preview
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen  pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-border pt-24 sm:pt-32 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-[10px] font-extrabold text-brand-pink uppercase tracking-[0.2em] mb-2 font-sans">Your Family</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">My Pet Profiles</h1>
              <p className="text-sm text-brand-dark/50 font-sans mt-1">Measurements saved here auto-fill at checkout 🛍️</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-brand-dark text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-pink transition-all shadow-lg active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Another Pet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {pets.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-10 sm:p-16 text-center shadow-soft border border-brand-border/50 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-10 h-10 text-brand-dark/20" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">No pet profiles yet</h2>
            <p className="text-brand-dark/50 mb-8 max-w-sm mx-auto text-sm font-sans">
              Add your pet's details to get personalized recommendations and auto-fill measurements at checkout.
            </p>
            <button onClick={handleOpenAdd} className="btn-brand">Add Your First Pet</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pets.map(pet => (
              <motion.div
                layout key={pet.id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-brand-border/40 group hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                {/* Photo */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  {pet.photo
                    ? <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    : <div className="w-full h-full bg-brand-muted flex items-center justify-center text-5xl">{pet.name?.[0]}</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                    <button onClick={() => handleOpenEdit(pet)} className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center text-brand-dark hover:text-brand-blue transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => dispatch(deletePet({ userId: user.id, petId: pet.id }))} className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center text-brand-dark hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
                      <span className="text-[10px] font-extrabold text-white uppercase tracking-widest opacity-80">{pet.breed}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">{pet.name}</h3>
                  </div>
                </div>

                {/* Info row */}
                <div className="px-4 sm:px-6 py-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-brand-dark/60">
                    <Calendar className="w-4 h-4 text-brand-pink shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">Birthday</p>
                      <p className="text-xs font-bold text-brand-dark/80 truncate">{pet.dob ? new Date(pet.dob).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                  {pet.instagram && (
                    <div className="flex items-center gap-2 text-brand-dark/60">
                      <AtSign className="w-4 h-4 text-brand-pink shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">Social</p>
                        <a href={`https://instagram.com/${pet.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-blue hover:underline truncate block">
                          {pet.instagram}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Measurements section */}
                <MeasurementsCard pet={pet} userId={user?.id} dispatch={dispatch} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 sm:p-8 border-b border-brand-border flex items-center justify-between shrink-0">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark">
                  {editingPet ? 'Edit Pet Profile' : 'Add New Pet'}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-brand-muted rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8">
                <form id="pet-profile-form" onSubmit={handleSubmit} className="space-y-5">
                  {/* Photo upload */}
                  <div className="flex justify-center mb-6">
                    <div className="relative group">
                      <div className={`w-24 sm:w-28 h-24 sm:h-28 rounded-3xl border-4 border-dashed transition-all overflow-hidden flex items-center justify-center ${preview ? 'border-brand-pink' : 'border-brand-border'}`}>
                        {preview
                          ? <img src={preview} alt="Pet" className="w-full h-full object-cover" />
                          : <ImageIcon className="w-6 h-6 text-brand-dark/20" />
                        }
                        <input
                          type="file" accept="image/*" onChange={handlePhotoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required={!editingPet && fields.find(f => f.id === 'photo')?.required}
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-brand-pink text-white p-1.5 rounded-lg shadow-lg">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {fields.map(field => {
                    if (field.id === 'photo') return null;
                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-brand-dark/40 uppercase tracking-widest ml-1 flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-brand-pink">*</span>}
                        </label>
                        <input
                          type={field.type} required={field.required} placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                          className="w-full h-12 bg-brand-muted/50 border-2 border-transparent focus:border-brand-pink focus:bg-white rounded-xl px-4 text-sm font-sans outline-none transition-all"
                        />
                      </div>
                    );
                  })}

                  {/* Pet type for size guide */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-brand-dark/40 uppercase tracking-widest ml-1 block">Pet Type</label>
                    <div className="flex gap-3">
                      {['dog', 'cat'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                          className={`flex-1 h-11 rounded-xl border-2 font-bold text-sm font-sans transition-all ${formData.type === t ? 'border-brand-dark bg-brand-dark text-white' : 'border-brand-border text-brand-dark/60 hover:border-brand-dark/40'}`}
                        >
                          {t === 'dog' ? '🐶 Dog' : '🐱 Cat'}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-5 sm:p-8 border-t border-brand-border /20 flex gap-3 sm:gap-4 shrink-0">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 h-12 sm:h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] border-2 border-brand-border text-brand-dark/60 hover:bg-brand-muted transition-all">
                  Cancel
                </button>
                <button type="submit" form="pet-profile-form" className="flex-1 h-12 sm:h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] bg-brand-dark text-white hover:bg-brand-pink transition-all shadow-lg">
                  {editingPet ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetProfile;
