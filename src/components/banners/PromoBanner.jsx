import React from 'react';
import { motion } from 'framer-motion';
import { PetSticker } from '../common/PetSticker';

export const PromoBanner = () => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-primary-dark/20 rounded-3xl overflow-visible shadow-sm my-16 relative flex flex-col md:flex-row items-center border border-primary z-10"
  >
    <PetSticker type="dog" position="top-right" />
    <PetSticker type="cat" position="bottom-left" />

    <div className="md:w-1/2 p-10 md:p-16 text-center md:text-left z-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4 tracking-tight">Got a New Puppy?</h2>
      <p className="text-lg text-brand-dark/80 mb-8 font-medium">Get 20% off on all starter kits. Everything you need to welcome your new best friend.</p>
      <button className="bg-primary-dark hover:bg-primary text-white hover:text-primary-dark font-bold py-3 px-8 rounded-full shadow-md transition-all border hover:border-primary-dark cursor-pointer relative z-10">
        Claim Offer
      </button>
    </div>
    <div className="md:w-1/2 h-64 md:h-full w-full relative overflow-hidden rounded-r-3xl">
       <img src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=600" alt="Puppy" className="absolute inset-0 w-full h-full object-cover" />
    </div>
  </motion.div>
);
