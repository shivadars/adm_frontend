import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  PawPrint, Image as ImageIcon, Calendar, AtSign, 
  ChevronRight, Heart, Plus, X 
} from 'lucide-react';
import { addPet, selectPetFields, selectUserPets } from '../features/pets/petSlice';

const PetOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const fields = useSelector(selectPetFields) || [];
  const pets = useSelector(state => selectUserPets(state, user?.id)) || [];

  // If pets already exist, redirect to the dashboard
  React.useEffect(() => {
    if (pets.length > 0) {
      navigate('/profile/pets');
    }
  }, [pets, navigate]);

  if (!Array.isArray(fields)) return null;

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        handleInputChange('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      dispatch(addPet({ userId: user?.id, pet: formData }));
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      {/* Background cute blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-6">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-brand-dark mb-3">Welcome to the Family!</h1>
          <p className="text-brand-dark/60 font-sans text-lg">Let's create a beautiful profile for your furry best friend.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 relative">
          <div className="space-y-8">
            
            {/* Photo Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-[2rem] border-4 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden ${preview ? 'border-brand-pink' : 'border-brand-border hover:border-brand-pink'}`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-brand-dark/20 group-hover:text-brand-pink transition-colors" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    required={fields.find(f => f.id === 'photo')?.required}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-brand-pink text-white p-2 rounded-xl shadow-lg">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-3 text-[11px] font-bold text-brand-dark/40 uppercase tracking-widest">Upload Pet Photo</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {fields.map(field => {
                if (field.id === 'photo') return null;

                return (
                  <div key={field.id} className="space-y-2">
                    <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                      {field.label}
                      {field.required && <Heart className="w-3 h-3 text-brand-pink fill-brand-pink" />}
                    </label>
                    
                    <div className="relative">
                      {field.id === 'instagram' && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40">
                          <AtSign className="w-4 h-4" />
                        </div>
                      )}
                      {field.id === 'dob' && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40">
                          <Calendar className="w-4 h-4" />
                        </div>
                      )}
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className={`w-full h-14 bg-brand-muted/50 border-2 border-transparent focus:border-brand-pink focus:bg-white rounded-2xl px-5 text-brand-dark transition-all outline-none font-sans ${field.id === 'instagram' || field.id === 'dob' ? 'pl-11' : ''}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-xl hover:bg-brand-pink transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Crafting Profile...
                </>
              ) : (
                <>
                  Continue to Shop
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-brand-dark/40 text-sm font-sans italic">
          "Every pet is a masterpiece, let's show them off!" 🐾
        </p>
      </motion.div>
    </div>
  );
};

export default PetOnboarding;
