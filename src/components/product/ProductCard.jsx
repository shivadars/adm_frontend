import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '../../features/cart/cartSlice';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const sellingPrice = product.sellingPrice ?? product.price;
  const mrp = product.mrp ?? null;
  const hasDiscount = mrp && mrp > sellingPrice;
  const discountPct = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  const requireAuth = (e, cb) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { navigate('/login?next=/shop'); return; }
    cb();
  };

  const handleAdd = (e) => requireAuth(e, () => {
    dispatch(addToCart({ product, quantity: 1, size: product.sizes?.[0] || 'One Size' }));
    dispatch(toggleCart(true));
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  });

  const handleWish = (e) => requireAuth(e, () => setWishlisted(w => !w));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="boutique-card group border border-brand-border bg-[#e8f0fe]"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-[#e8f0fe]">
        <img
          loading="lazy"
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.tags?.[0] && (
            <span className="bg-[#0a2540] text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#0a2540] uppercase tracking-wider backdrop-blur-md opacity-95">
              {product.tags[0]}
            </span>
          )}
          {hasDiscount && (
            <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#e53935] shadow-sm">{discountPct}% Off</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={handleWish}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform border border-brand-border">
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-[#2563eb] text-[#2563eb]' : 'text-[#0a2540]/60'}`} />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleAdd}
            className={`w-full py-3 text-sm font-semibold font-sans transition-colors border-t border-[#0a2540] ${added ? 'bg-[#4f9b9b] text-white' : 'bg-[#0a2540] text-white hover:bg-[#2563eb] hover:text-white'}`}
            >
            {added ? '✓  Added to Bag' : 'Quick Add to Bag'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="px-4 py-4">
        <p className="text-[10px] font-semibold text-[#4f9b9b] uppercase tracking-[0.15em] mb-1 font-sans">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif font-semibold text-[#0a2540] text-base leading-snug hover:text-[#2563eb] transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-[#e8f0fe] opacity-50'}`} />
            ))}
          </div>
          <span className="text-xs text-[#0a2540]/60 font-sans">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0">
            {/* Selling Price — highlighted and bold */}
            <span className="text-base font-bold text-[#0a2540]">₹{sellingPrice.toLocaleString('en-IN')}</span>
            {/* MRP — small, gray, crossed out */}
            {hasDiscount && <span className="text-xs text-[#0a2540]/40 line-through font-sans">₹{mrp.toLocaleString('en-IN')}</span>}
          </div>
          <button onClick={handleAdd}
            className="w-8 h-8 rounded-xl border border-[#0a2540] flex items-center justify-center bg-[#0a2540] text-white hover:bg-[#2563eb] hover:border-[#2563eb] transition-colors group/b">
            <ShoppingBag className="w-4 h-4 text-inherit transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
