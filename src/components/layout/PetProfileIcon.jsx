import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { selectUserPets, selectPetFields } from '../../features/pets/petSlice';

export const PetProfileIcon = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const pets = useSelector(state => selectUserPets(state, user?.id)) || [];
  const fields = useSelector(selectPetFields) || [];

  if (!isAuthenticated || user?.role === 'admin') return null;

  const mainPet = pets[0];
  let percentage = 0;

  if (mainPet && fields.length > 0) {
    const filledCount = fields.filter(f => mainPet[f.id]).length;
    percentage = Math.round((filledCount / fields.length) * 100);
  }

  const size = 38;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center">
      <Link 
        to={pets.length > 0 ? "/profile/pets" : "/onboarding/pet"}
        className="relative flex items-center justify-center group"
        title={pets.length > 0 ? `Pet Profile (${percentage}% complete)` : "Add your pet profile!"}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-brand-border/30" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-brand-pink transition-all duration-700 ease-out" />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${pets.length > 0 ? 'bg-brand-pink/10 text-brand-pink' : 'bg-brand-muted text-brand-dark/40 group-hover:bg-brand-pink/10 group-hover:text-brand-pink'}`}>
            {mainPet?.photo ? (
              <img src={mainPet.photo} alt={mainPet.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <PawPrint className="w-4 h-4" />
            )}
          </div>
        </div>

        {pets.length === 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-pink"></span>
          </span>
        )}
      </Link>
    </div>
  );
};
