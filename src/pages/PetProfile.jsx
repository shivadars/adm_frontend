import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PawPrint, Plus, Trash2, Edit2, AtSign, Calendar, 
  MapPin, Heart, ChevronRight, X, Image as ImageIcon 
} from 'lucide-react';
import { selectUserPets, deletePet, addPet, updatePet, selectPetFields } from '../features/pets/petSlice';

const PetProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const pets = useSelector(state => selectUserPets(state, user?.id)) || [];
  const fields = useSelector(selectPetFields) || [];
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-border pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-extrabold text-brand-pink uppercase tracking-[0.2em] mb-2 font-sans">Your Family</p>
              <h1 className="font-serif text-4xl font-bold text-brand-dark">My Pet Profiles</h1>
            </div>
            <button 
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-pink transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Another Pet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {pets.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-soft border border-brand-border/50 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-10 h-10 text-brand-dark/20" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-3">No pet profiles yet</h2>
            <p className="text-brand-dark/50 mb-8 max-w-sm mx-auto">Add your pet's details to get personalized recommendations and track your orders easily.</p>
            <button onClick={handleOpenAdd} className="btn-brand">Add Your First Pet</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map(pet => (
              <motion.div
                layout
                key={pet.id}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-soft border border-brand-border/40 group hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                    <button onClick={() => handleOpenEdit(pet)} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-brand-dark hover:text-brand-blue transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => dispatch(deletePet({ userId: user.id, petId: pet.id }))} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-brand-dark hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
                      <span className="text-[10px] font-extrabold text-white uppercase tracking-widest opacity-80">{pet.breed}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white">{pet.name}</h3>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-brand-dark/60">
                      <Calendar className="w-4 h-4 text-brand-pink" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">Birthday</p>
                        <p className="text-xs font-bold text-brand-dark/80">{new Date(pet.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {pet.instagram && (
                      <div className="flex items-center gap-3 text-brand-dark/60">
                        <AtSign className="w-4 h-4 text-brand-pink" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">Social</p>
                          <a href={`https://instagram.com/${pet.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-blue hover:underline">{pet.instagram}</a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header - Fixed */}
              <div className="p-6 sm:p-8 border-b border-brand-border flex items-center justify-between shrink-0">
                <h2 className="font-serif text-2xl font-bold text-brand-dark">{editingPet ? 'Edit Pet Profile' : 'Add New Pet'}</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-brand-muted rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <form id="pet-profile-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* ... Photo upload ... */}
                  <div className="flex justify-center mb-8">
                    <div className="relative group">
                      <div className={`w-28 h-28 rounded-3xl border-4 border-dashed transition-all overflow-hidden flex items-center justify-center ${preview ? 'border-brand-pink' : 'border-brand-border'}`}>
                        {preview ? <img src={preview} alt="Pet" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-brand-dark/20" />}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required={!editingPet && fields.find(f => f.id === 'photo')?.required}
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-brand-pink text-white p-1.5 rounded-lg shadow-lg">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {fields.map(field => {
                      if (field.id === 'photo') return null;
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-brand-dark/40 uppercase tracking-widest ml-1 flex items-center gap-1">
                            {field.label}
                            {field.required && <span className="text-brand-pink">*</span>}
                          </label>
                          <input
                            type={field.type}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                            className="w-full h-12 bg-brand-muted/50 border-2 border-transparent focus:border-brand-pink focus:bg-white rounded-xl px-4 text-sm font-sans outline-none transition-all"
                          />
                        </div>
                      );
                    })}
                  </div>
                </form>
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 sm:p-8 border-t border-brand-border bg-brand-light/20 flex gap-4 shrink-0">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] border-2 border-brand-border text-brand-dark/60 hover:bg-brand-muted transition-all">Cancel</button>
                <button 
                  type="submit" 
                  form="pet-profile-form"
                  className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] bg-brand-dark text-white hover:bg-brand-pink transition-all shadow-lg"
                >
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
