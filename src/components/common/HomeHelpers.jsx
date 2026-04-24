import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Skeleton loader for product cards
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-brand-border">
    <div className="aspect-[3/4] skeleton" />
    <div className="p-4 space-y-2.5">
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
      <div className="flex justify-between items-center pt-1">
        <div className="skeleton h-5 w-20 rounded" />
        <div className="skeleton h-8 w-8 rounded-xl" />
      </div>
    </div>
  </div>
);

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

const SectionHeader = ({ overline, title, viewAllLink }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <p className="section-subtitle mb-1.5">{overline}</p>
      <h2 className="section-title">{title}</h2>
    </div>
    {viewAllLink && (
      <Link
        to={viewAllLink}
        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark hover:text-primary-darker transition-colors"
      >
        View all <ArrowRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

export { SectionHeader, FADE_UP };
