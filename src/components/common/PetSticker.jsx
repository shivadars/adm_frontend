import React from 'react';
import { motion } from 'framer-motion';

export const PetSticker = ({ type, position }) => {
  const positionClasses = {
    'top-right': 'absolute -top-4 -right-2 md:-top-6 md:-right-4 z-20',
    'bottom-left': 'absolute -bottom-4 -left-2 md:-bottom-6 md:-left-4 z-20',
  };

  const svgs = {
    dog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-16 h-16 drop-shadow-md opacity-80"><circle cx="50" cy="50" r="40" fill="#FFF5BA" /><circle cx="35" cy="40" r="5" fill="#8B4513" /><circle cx="65" cy="40" r="5" fill="#8B4513" /><path d="M40 60 Q50 70 60 60" stroke="#8B4513" stroke-width="3" fill="none" /></svg>`,
    cat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-14 h-14 drop-shadow-md opacity-80"><circle cx="50" cy="50" r="40" fill="#FFD1DC" /><path d="M20 30 L40 40 L30 10 Z" fill="#FFD1DC" /><path d="M80 30 L60 40 L70 10 Z" fill="#FFD1DC" /><circle cx="35" cy="45" r="4" fill="#555" /><circle cx="65" cy="45" r="4" fill="#555" /><path d="M45 55 L55 55 L50 65 Z" fill="#FF9999" /><path d="M40 70 Q50 80 60 70" stroke="#555" stroke-width="2" fill="none" /></svg>`,
  };

  const finalClass = positionClasses[position] || position;

  return (
    <motion.div 
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: Math.random() * 20 - 10 }}
      whileHover={{ scale: 1.2, rotate: Math.random() * 40 - 20 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
      className={`pointer-events-auto cursor-pointer ${finalClass}`}
      dangerouslySetInnerHTML={{ __html: svgs[type] }}
    />
  );
};
