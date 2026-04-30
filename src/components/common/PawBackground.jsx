import React from 'react';
import { PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

export const PawBackground = () => {
  // Random positions and rotations for 10 paws
  const paws = [
    // Left Side Paws
    { top: '8%',   left: '4%',   size: 80,  rotate: -15, opacity: 0.2 },
    { top: '82%', left: '6%',   size: 110, rotate: 25,  opacity: 0.18 },
    { top: '45%', left: '3%',   size: 95,  rotate: -35, opacity: 0.15 },
    { top: '25%', left: '12%',  size: 70,  rotate: 120, opacity: 0.18 },
    { top: '62%', left: '10%',  size: 85,  rotate: 20,  opacity: 0.22 },
    { top: '15%', left: '20%',  size: 60,  rotate: -45, opacity: 0.16 },
    { top: '70%', left: '18%',  size: 75,  rotate: 15,  opacity: 0.18 },
    { top: '92%', left: '15%',  size: 65,  rotate: -60, opacity: 0.14 },
    { top: '5%',   left: '22%',  size: 55,  rotate: 30,  opacity: 0.12 },
    { top: '52%', left: '15%',  size: 80,  rotate: 45,  opacity: 0.2 },

    // Right Side Paws
    { top: '12%', left: '88%',  size: 90,  rotate: 10,  opacity: 0.22 },
    { top: '78%', left: '82%',  size: 105, rotate: -20, opacity: 0.2 },
    { top: '35%', left: '92%',  size: 75,  rotate: 45,  opacity: 0.15 },
    { top: '65%', left: '78%',  size: 90,  rotate: 60,  opacity: 0.18 },
    { top: '50%', left: '85%',  size: 70,  rotate: -10, opacity: 0.15 },
    { top: '10%', left: '75%',  size: 65,  rotate: 45,  opacity: 0.16 },
    { top: '88%', left: '90%',  size: 80,  rotate: -15, opacity: 0.18 },
    { top: '22%', left: '80%',  size: 60,  rotate: -30, opacity: 0.14 },
    { top: '58%', left: '94%',  size: 75,  rotate: 25,  opacity: 0.17 },
    { top: '5%',   left: '94%',  size: 65,  rotate: -40, opacity: 0.12 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {paws.map((paw, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: paw.opacity, scale: 1 }}
          transition={{ duration: 1, delay: i * 0.1 }}
          style={{
            position: 'absolute',
            top: paw.top,
            left: paw.left,
            color: '#073b3a', // brand-blue like color
            transform: `rotate(${paw.rotate}deg)`,
            filter: 'drop-shadow(4px 8px 12px rgba(7, 59, 58, 0.4))' // 3D effect
          }}
        >
          <PawPrint size={paw.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};
