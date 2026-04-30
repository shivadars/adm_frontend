import React, { useEffect } from 'react';
import { HeroCarousel } from '../components/banners/HeroCarousel';
import { ProductCard }  from '../components/product/ProductCard';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { CareTips }    from '../components/sections/CareTips';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts }   from '../features/products/productSlice';
import { updateContent, updateCategory } from '../features/admin/adminSlice';
import { EditableText }   from '../components/admin/EditableText';
import { EditableImage }  from '../components/admin/EditableImage';
import { motion }  from 'framer-motion';
import { Link }    from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="boutique-card">
    <div className="aspect-[3/4] skeleton" />
    <div className="p-4 space-y-2.5">
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-3 w-24 rounded" />
      <div className="flex justify-between pt-1">
        <div className="skeleton h-5 w-20 rounded" />
        <div className="skeleton w-8 h-8 rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Trust bar ─────────────────────────────────────────────────────────────────
const trust = [
  { icon: '🚚', label: 'Free Shipping', sub: 'Orders above ₹999' },
  { icon: '🧵', label: 'Handmade', sub: 'Crafted with love' },
  { icon: '🐾', label: 'Fur-Safe Fabric', sub: 'Tested & gentle' },
  { icon: '📦', label: 'Easy Returns', sub: '7-day policy' },
];
const TrustBar = () => (
  <div className="py-8 sm:py-10">
    <div className="section-wrap">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {trust.map(({ icon, label, sub }) => (
          <div key={label} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-5 sm:p-6 bg-[#073b3a] rounded-2xl shadow-boutique hover:-translate-y-1.5 transition-transform duration-300 border border-[#073b3a]/10">
            <span className="text-3xl sm:text-4xl drop-shadow-sm shrink-0">{icon}</span>
            <div className="mt-1 sm:mt-0">
              <p className="text-[13px] sm:text-sm font-bold text-[#e0f4ee] font-sans tracking-wide">{label}</p>
              <p className="text-[11px] sm:text-xs text-[#e0f4ee]/70 font-sans mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Section header ────────────────────────────────────────────────────────────
const SectionHead = ({ overline, title, link }) => (
  <div className="flex items-end justify-between mb-10">
    <div>
      <p className="brand-overline mb-1">{overline}</p>
      <h2 className="brand-title">{title}</h2>
    </div>
    {link && (
      <Link to={link} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:text-brand-blue transition-colors">
        View all <ArrowRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

// ─── Categories ────────────────────────────────────────────────────────────────
const CategoryGrid = () => {
  const dispatch   = useDispatch();
  const categories = useSelector(s => s.admin.categories);
  return (
    <section className="section-wrap py-16">
      {/* Heading block — styled like the logo */}
      <div className="text-center mb-12">
        <h2
          style={{
            fontFamily:  "'Playfair Display', serif",
            fontSize:    'clamp(2rem, 5vw, 3.5rem)',
            fontWeight:  900,
            color:       '#073b3a',
            letterSpacing: '0.04em',
            lineHeight:  1.1,
            marginBottom: '0.6rem',
          }}
        >
          WELCOME TO A'DOREMOM
        </h2>
        <p
          style={{
            fontFamily:   "'Playfair Display', serif",
            fontSize:     'clamp(0.75rem, 1.8vw, 1rem)',
            fontWeight:   500,
            color:        '#073b3a',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Designed with mother's touch, made for your fur baby's comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-boutique"
          >
            <EditableImage
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              onSave={(src) => dispatch(updateCategory({ ...cat, image: src }))}
            />
            {/* Clickable overlay covering the whole card */}
            <Link to={`/shop?category=${cat.urlKey}`} className="absolute inset-0 z-10">
              <span className="sr-only">Shop {cat.name}</span>
            </Link>

            <div className="absolute inset-0 bg-gradient-to-t from-[#073b3a] via-[#073b3a]/20 to-transparent opacity-80 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between pointer-events-none z-20">
              <div className="relative text-left">
                <p className="text-[#e0f4ee] text-[10px] uppercase tracking-widest font-bold font-sans mb-1">A'DOREMOM</p>
                <h3 className="font-serif font-bold text-white text-2xl drop-shadow-md">{cat.name}</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-[#e0f4ee] text-[#073b3a] text-xs font-bold px-4 py-2 rounded-full transition-transform group-hover:-translate-y-1 shadow-md">
                Shop <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


// ─── Promo banner (editable) ───────────────────────────────────────────────────
const CustomBanner = () => {
  const dispatch = useDispatch();
  const content  = useSelector(s => s.admin.content);
  const title    = content?.promoBannerTitle    || "Your Design, Our Handcraft";
  const subtitle = content?.promoBannerSubtitle || "Share your idea, reference, or dream outfit — and our skilled moms will craft it with the finest fabric, love stitched into every seam.";
  const image    = content?.promoBannerImage    || 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=700';

  return (
    <section className="section-wrap pb-16">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative rounded-3xl overflow-hidden bg-brand-muted border border-brand-border shadow-boutique flex flex-col md:flex-row items-stretch"
      >
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <span className="inline-block bg-brand-dark/10 text-brand-dark text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-widest w-fit">
            Custom Made 🧵
          </span>
          <EditableText
            value={title}
            onSave={(val) => dispatch(updateContent({ promoBannerTitle: val }))}
            as="h2"
            className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mb-4 leading-tight whitespace-pre-line"
            multiline
          />
          <EditableText
            value={subtitle}
            onSave={(val) => dispatch(updateContent({ promoBannerSubtitle: val }))}
            as="p"
            className="text-brand-dark/80 text-sm mb-8 leading-relaxed font-sans max-w-sm"
            multiline
          />
          <Link to="/shop" className="btn-brand w-fit">
            Order Custom Outfit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="md:w-1/2 h-60 md:h-auto overflow-hidden relative">
          <EditableImage
            src={image}
            alt="Custom pet outfit"
            className="w-full h-full object-cover"
            onSave={(val) => dispatch(updateContent({ promoBannerImage: val }))}
          />
        </div>
        <div className="absolute top-0 right-0 text-brand-dark/5 text-[200px] leading-none font-serif pointer-events-none select-none pr-4">🐾</div>
      </motion.div>
    </section>
  );
};

// ─── Products grid ─────────────────────────────────────────────────────────────
const ProductGrid = ({ title, overline, products, loading, link }) => (
  <section className="section-wrap pb-16">
    <SectionHead overline={overline} title={title} link={link} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading
        ? [...Array(4)].map((_, i) => <Skeleton key={i} />)
        : products.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
    </div>
    {link && (
      <div className="mt-10 text-center sm:hidden">
        <Link to={link} className="btn-brand-outline">View All Products</Link>
      </div>
    )}
  </section>
);

// ─── Instagram CTA strip ─────────────────────────────────────────────────────

// ─── Reviews Section ─────────────────────────────────────────────────────────
const ReviewsSection = () => {
  const reviews  = useSelector(s => s.admin.reviews) || [];
  const featured = reviews.filter(r => r.featured);
  if (featured.length === 0) return null;

  return (
    <section className="section-wrap pb-16">
      <div className="text-center mb-10">
        <p className="brand-overline mb-1">Happy Customers</p>
        <h2 className="brand-title">What Pet Moms Are Saying</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, s) => (
                <Star key={s} className={`w-4 h-4 ${s < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
            {/* Review text */}
            <p className="text-brand-dark/80 text-sm font-sans leading-relaxed flex-1">"{r.text}"</p>
            {/* Customer */}
            <div className="flex items-center gap-3 pt-3 border-t border-brand-border/50">
              <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-sm font-bold text-brand-light shrink-0">
                {r.avatar || r.name?.[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark font-sans">{r.name}</p>
                <p className="text-xs text-brand-dark/50 font-sans">{r.location} &middot; Verified Purchase</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ─── Instagram CTA strip ───────────────────────────────────────────────────────
const InstagramStrip = () => (
  <section className="py-16 border-y border-brand-border">
    <div className="section-wrap text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <InstagramIcon />
        <p className="brand-overline">Follow Us</p>
      </div>
      <h2 className="brand-title mb-4">Tag #ADOREMOM on Instagram</h2>
      <p className="text-brand-dark/70 text-sm font-sans max-w-md mx-auto mb-8">
        Share your fur baby's look and get featured on our page — we love seeing your little ones in our designs! 🐾
      </p>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-brand">
        <InstagramIcon /> @adoremom.in
      </a>
    </div>
  </section>
);

// ─── Decorative Graphics ────────────────────────────────────────────────────────
const PawPrint = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
    <g fill="#6ba4eb">
      <ellipse cx="22" cy="45" rx="10" ry="15" transform="rotate(-30 22 45)" />
      <ellipse cx="78" cy="45" rx="10" ry="15" transform="rotate(30 78 45)" />
      <ellipse cx="38" cy="25" rx="11" ry="17" transform="rotate(-10 38 25)" />
      <ellipse cx="62" cy="25" rx="11" ry="17" transform="rotate(10 62 25)" />
      <path d="M 18 68 C 5 45 40 40 50 52 C 60 40 95 45 82 68 C 75 85 64 90 50 82 C 36 90 25 85 18 68 Z" />
    </g>
  </svg>
);

const CloudShape = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
    <path fill="#6ba4eb" d="M80,45 c0-11 -9-20 -20-20 c-8.5,0 -16,5 -18.7,13 c-1.8-1.5 -4-2.5 -6.3-2.5 c-5.5,0 -10,4.5 -10,10 H25 c-8.3,0 -15,6.7 -15,15 c0,8.3,6.7,15,15,15 h55 c8.3,0,15-6.7,15-15 C95,51.7,88.3,45,80,45 z" />
  </svg>
);

const Sticker = ({ className = '', side, top = '0', out = 640, rotate = 0, scale = 1, isCloud = false, opacity = 0.12, blur = 0.5 }) => {
  const isLeft = side === 'left';
  const isRight = side === 'right';
  
  const style = { 
    top, 
    transform: `rotate(${rotate}deg) scale(${scale})`,
    opacity: opacity * 2.5,
    filter: blur > 0 ? `blur(${blur}px)` : 'none'
  };
  
  // Base margin mapping: 24 - 48px from absolute edges to avoid clipping
  if (isLeft)  style.right = `calc(min(50% + ${out}px, 100vw - 48px))`;
  if (isRight) style.left  = `calc(min(50% + ${out}px, 100vw - 48px))`;

  return (
    <div
      className={`absolute pointer-events-none select-none -z-10 ${className}`}
      style={style}
    >
      {isCloud ? (
        <CloudShape className="w-[65px] h-[65px] sm:w-[85px] sm:h-[85px]" />
      ) : (
        <PawPrint className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px]" />
      )}
    </div>
  );
};

// ─── Home page ─────────────────────────────────────────────────────────────────
export const Home = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.products);
  const loading = status === 'loading';

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  // Helper: check if a product belongs to a category (supports both old and new format)
  const inCategory = (p, catName) => {
    if (Array.isArray(p.categories) && p.categories.length > 0) {
      return p.categories.includes(catName);
    }
    const currentCatName = typeof p.category === 'object' ? p.category?.name : p.category;
    return currentCatName === catName;
  };

  // Trending: first 4 products that are NOT in New Collections, fallback to first 4
  const trending = items.filter(p => !inCategory(p, 'New Collections')).slice(0, 4);
  const trendingProducts = trending.length > 0 ? trending : items.slice(0, 4);

  // New Arrivals: products tagged as 'New Collections'
  const newArrivals = items.filter(p => inCategory(p, 'New Collections')).slice(0, 4);
  // Fallback: if admin hasn't tagged any as New Collections, show the next 4 products
  const newArrivalProducts = newArrivals.length > 0 ? newArrivals : items.slice(4, 8);
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col z-0">
      <HeroCarousel />
      
      {/* Upper Spacing Decals */}
      <div className="relative h-0">
        <Sticker className="hidden md:block" side="left" out={640} top="-20px" rotate={-10} scale={1.8} opacity={0.12} blur={0.5} />
        <Sticker className="hidden xl:block" side="right" out={600} top="30px" rotate={15} scale={1.0} opacity={0.08} isCloud />
        <Sticker className="hidden lg:block" side="right" out={710} top="60px" rotate={-5} scale={1.5} opacity={0.10} blur={1} />
      </div>
      <TrustBar />

      <div className="relative mt-8">
        <Sticker className="hidden lg:block" side="right" out={620} top="140px" rotate={12} scale={1.1} opacity={0.12} />
        <Sticker className="hidden xl:block" side="left" out={660} top="250px" rotate={-8} scale={1.6} opacity={0.15} blur={0.5} isCloud />
        <Sticker className="hidden md:block" side="left" out={590} top="-30px" rotate={15} scale={1.0} opacity={0.10} />
        <Sticker className="hidden 2xl:block" side="right" out={760} top="280px" rotate={-12} scale={1.4} opacity={0.16} />
        <CategoryGrid />
      </div>

      <div className="relative mt-4">
        <Sticker className="hidden xl:block" side="left" out={690} top="110px" rotate={-15} scale={1.2} opacity={0.12} />
        <Sticker className="hidden lg:block" side="right" out={640} top="190px" rotate={10} scale={1.0} opacity={0.11} isCloud blur={1} />
        <Sticker className="hidden md:block" side="left" out={580} top="280px" rotate={-5} scale={2.0} opacity={0.08} blur={0.5} />
        <ProductGrid
          overline="What's popular right now"
          title="Trending Outfits"
          products={trendingProducts}
          loading={loading}
          link="/shop"
        />
      </div>

      <div className="relative mt-8 sm:mt-0">
        <Sticker className="hidden lg:block" side="right" out={630} top="50px" rotate={15} scale={1.0} opacity={0.12} />
        <Sticker className="hidden xl:block" side="left" out={670} top="120px" rotate={-12} scale={1.4} opacity={0.10} isCloud blur={0.5} />
        <Sticker className="hidden md:block" side="right" out={720} top="-20px" rotate={5} scale={1.2} opacity={0.14} />
        <WhyChooseUs />
      </div>
      
      <div className="relative pt-8 sm:pt-0">
        <Sticker className="hidden lg:block" side="left" out={640} top="70px" rotate={-10} scale={1.0} opacity={0.15} isCloud blur={1} />
        <Sticker className="hidden 2xl:block" side="right" out={680} top="10px" rotate={-15} scale={1.6} opacity={0.12} />
        <Sticker className="hidden xl:block" side="left" out={720} top="220px" rotate={8} scale={0.9} opacity={0.10} />
        <CustomBanner />
      </div>


      <CareTips />
      
      {/* Reviews from happy customers */}
      <div className="relative pt-6 sm:pt-0">
        <Sticker className="hidden xl:block" side="left" out={650} top="40px" rotate={-15} scale={1.3} opacity={0.12} />
        <Sticker className="hidden lg:block" side="right" out={620} top="90px" rotate={10} scale={1.0} opacity={0.15} isCloud blur={0.5} />
        <ReviewsSection />
      </div>
      
      <div className="relative pt-6 sm:pt-0">
        <Sticker className="hidden xl:block" side="left" out={650} top="40px" rotate={-15} scale={1.3} opacity={0.12} />
        <Sticker className="hidden lg:block" side="right" out={620} top="90px" rotate={10} scale={1.0} opacity={0.15} isCloud blur={0.5} />
        <Sticker className="hidden md:block" side="right" out={690} top="-10px" rotate={-12} scale={1.7} opacity={0.10} />
        <InstagramStrip />
      </div>
    </div>
  );
};
