import { createSlice } from '@reduxjs/toolkit';
import { mockProducts, mockCategories } from '../../services/apiMockData';

export const DEFAULT_FABRICS = [
  { id: 'f1', name: 'Soft Cotton', desc: 'Gentle, breathable & skin-safe' },
  { id: 'f2', name: 'Fleece', desc: 'Warm & cozy for winters' },
  { id: 'f3', name: 'Satin', desc: 'Smooth, shiny & party-ready' },
  { id: 'f4', name: 'Denim', desc: 'Sturdy & trendy everyday look' },
  { id: 'f5', name: 'Linen', desc: 'Lightweight & perfect for summers' },
];

export const DEFAULT_COLORS = [
  { id: 'c1', name: 'Ivory White',   hex: '#F8F4EE' },
  { id: 'c2', name: 'Blush Pink',    hex: '#F4B8C1' },
  { id: 'c3', name: 'Sky Blue',      hex: '#87CEEB' },
  { id: 'c4', name: 'Mint Green',    hex: '#A8E6CF' },
  { id: 'c5', name: 'Sunshine Yellow', hex: '#FFE082' },
  { id: 'c6', name: 'Lilac Purple',  hex: '#C8A2D9' },
  { id: 'c7', name: 'Terracotta',    hex: '#D4735E' },
  { id: 'c8', name: 'Navy Blue',     hex: '#1E3A5F' },
];

const DEFAULT_WHY = [
  { id: 'w1', emoji: '💰', title: 'Pocket-Friendly', desc: 'Premium quality pet fashion without burning a hole in your pocket. Style meets affordability.' },
  { id: 'w2', emoji: '🧵', title: 'Handmade Quality', desc: 'Every stitch is sewn with care by skilled hands. No factory shortcuts — just love and craft.' },
  { id: 'w3', emoji: '🐾', title: 'Zero Fur Damage', desc: 'Our soft, tested fabrics are gentle on fur and skin. No itching, no tangling, no stress.' },
  { id: 'w4', emoji: '💪', title: 'Built to Last', desc: 'Wash after wash, our outfits hold their shape and color — because durability is love too.' },
];

const DEFAULT_REVIEWS = [
  { id: 'r1', name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: "My Coco looks absolutely adorable in the pink frill dress! The fabric is so soft and she wore it all day without any discomfort. Will definitely order again!", featured: true, date: '2024-12-10', avatar: 'P' },
  { id: 'r2', name: 'Anjali Verma', location: 'Delhi', rating: 5, text: "Ordered a custom outfit for my pomeranian's birthday and it was beyond my expectations. The stitching quality is premium and it arrived in 4 days!", featured: true, date: '2025-01-05', avatar: 'A' },
  { id: 'r3', name: 'Kavitha Nair', location: 'Bangalore', rating: 5, text: "My retriever Max has sensitive skin and finds most pet clothes itchy. A'DOREMOM fabrics are the ONLY ones he's comfortable in. Ordering 3 more!", featured: true, date: '2025-02-18', avatar: 'K' },
  { id: 'r4', name: 'Sunita Rao', location: 'Hyderabad', rating: 4, text: "Beautiful kurta set for my indie dog. Sizing was perfect and the quality exceeded the price. Love this brand!", featured: false, date: '2025-03-01', avatar: 'S' },
  { id: 'r5', name: 'Meenakshi Iyer', location: 'Chennai', rating: 5, text: "Got the bandana pack and sweater combo — both are stunning. Very fast shipping and lovely packaging too!", featured: false, date: '2025-03-22', avatar: 'M' },
];

const heroSlides = [
  { id: 1, badge: 'Daily Wear Collection', title: "Pet Wear with a\nMother's Touch", subtitle: 'Soft, breathable everyday outfits — crafted to keep your fur baby comfortable all day long.', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1400', link: '/shop?category=male', cta: 'Shop Daily Wear' },
  { id: 2, badge: 'Party Wear Collection', title: "Dressed to Impress,\nBorn to Adore", subtitle: "Gorgeous party outfits for every celebration — because your pet deserves the spotlight.", image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=1400', link: '/shop?category=female', cta: 'Shop Party Wear' },
  { id: 3, badge: 'Custom Designs', title: "Your Vision,\nOur Handcraft", subtitle: "Send your design idea — we'll stitch it with love. Every piece is one-of-a-kind.", image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=1400', link: '/shop?category=customization', cta: 'Order Custom' },
];

const content = {
  offerMessages: [
    "🐾  Handmade with a Mother's Love  •  Free Shipping above ₹999",
    "🎀  New Arrivals: Monsoon Collection is here!",
    "💚  No Fur Damage, No Discomfort — A'DOREMOM Promise",
  ],
  promoBannerTitle: "Your Design,\nOur Handcraft",
  promoBannerSubtitle: "Share your idea, reference, or dream outfit — and our skilled moms will craft it with the finest fabric.",
  promoBannerImage: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=700',
  whyChooseTitle: "Why Moms Choose A'DOREMOM",
};

const load = (key, fallback) => {
  try {
    const d = localStorage.getItem(key);
    if (!d) return fallback;
    const parsed = JSON.parse(d);
    
    // Auto-migrate any legacy cached data
    if (key === 'adoremom_hero' && Array.isArray(parsed)) {
      parsed.forEach(slide => {
        if (slide.link === '/shop?category=dog') slide.link = '/shop?category=male';
        if (slide.link === '/shop?category=cat') slide.link = '/shop?category=female';
      });
      localStorage.setItem(key, JSON.stringify(parsed));
    }
    return parsed;
  } catch { 
    return fallback; 
  }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products:      load('adoremom_products',   mockProducts),
    heroSlides:    load('adoremom_hero',        heroSlides),
    categories:    load('adoremom_categories',  mockCategories),
    content:       load('adoremom_content',     content),
    reviews:       load('adoremom_reviews',     DEFAULT_REVIEWS),
    whyChooseUs:   load('adoremom_why',         DEFAULT_WHY),
    enquiries:     load('adoremom_enquiries',   []),
  },
  reducers: {
    // ── Products CRUD ──────────────────────────────────────────────────────────
    addProduct: (state, { payload }) => {
      state.products.push({ id: `p-${Date.now()}`, ...payload });
      save('adoremom_products', state.products);
    },
    editProduct: (state, { payload }) => {
      const idx = state.products.findIndex(p => p.id === payload.id);
      if (idx !== -1) state.products[idx] = { ...state.products[idx], ...payload };
      save('adoremom_products', state.products);
    },
    deleteProduct: (state, { payload: id }) => {
      state.products = state.products.filter(p => p.id !== id);
      save('adoremom_products', state.products);
    },

    // ── Hero slides ────────────────────────────────────────────────────────────
    updateHeroSlide: (state, { payload }) => {
      const idx = state.heroSlides.findIndex(s => s.id === payload.id);
      if (idx !== -1) state.heroSlides[idx] = { ...state.heroSlides[idx], ...payload };
      else state.heroSlides.push(payload);
      save('adoremom_hero', state.heroSlides);
    },
    deleteHeroSlide: (state, { payload: id }) => {
      state.heroSlides = state.heroSlides.filter(s => s.id !== id);
      save('adoremom_hero', state.heroSlides);
    },

    // ── Category images ────────────────────────────────────────────────────────
    updateCategory: (state, { payload }) => {
      const idx = state.categories.findIndex(c => c.id === payload.id);
      if (idx !== -1) state.categories[idx] = { ...state.categories[idx], ...payload };
      save('adoremom_categories', state.categories);
    },

    // ── WhyChooseUs ────────────────────────────────────────────────────────────
    updateWhyReason: (state, { payload }) => {
      const idx = state.whyChooseUs.findIndex(r => r.id === payload.id);
      if (idx !== -1) state.whyChooseUs[idx] = { ...state.whyChooseUs[idx], ...payload };
      save('adoremom_why', state.whyChooseUs);
    },

    // ── Reviews ────────────────────────────────────────────────────────────────
    addReview: (state, { payload }) => {
      state.reviews.push({ id: `r-${Date.now()}`, featured: false, date: new Date().toISOString().slice(0,10), ...payload });
      save('adoremom_reviews', state.reviews);
    },
    editReview: (state, { payload }) => {
      const idx = state.reviews.findIndex(r => r.id === payload.id);
      if (idx !== -1) state.reviews[idx] = { ...state.reviews[idx], ...payload };
      save('adoremom_reviews', state.reviews);
    },
    deleteReview: (state, { payload: id }) => {
      state.reviews = state.reviews.filter(r => r.id !== id);
      save('adoremom_reviews', state.reviews);
    },
    toggleFeaturedReview: (state, { payload: id }) => {
      const r = state.reviews.find(r => r.id === id);
      if (r) r.featured = !r.featured;
      save('adoremom_reviews', state.reviews);
    },

    // ── Enquiries (Custom Color / Custom Size) ─────────────────────────────────────
    addEnquiry: (state, { payload }) => {
      state.enquiries.unshift({
        id: `enq-${Date.now()}`,
        status: 'new',
        createdAt: new Date().toISOString(),
        ...payload,
      });
      save('adoremom_enquiries', state.enquiries);
    },
    updateEnquiryStatus: (state, { payload: { id, status } }) => {
      const e = state.enquiries.find(e => e.id === id);
      if (e) e.status = status;
      save('adoremom_enquiries', state.enquiries);
    },
    deleteEnquiry: (state, { payload: id }) => {
      state.enquiries = state.enquiries.filter(e => e.id !== id);
      save('adoremom_enquiries', state.enquiries);
    },

    // ── Content ────────────────────────────────────────────────────────────────
    updateContent: (state, { payload }) => {
      state.content = { ...state.content, ...payload };
      save('adoremom_content', state.content);
    },
  },
});

export const {
  addProduct, editProduct, deleteProduct,
  updateHeroSlide, deleteHeroSlide,
  updateCategory,
  updateWhyReason,
  addReview, editReview, deleteReview, toggleFeaturedReview,
  addEnquiry, updateEnquiryStatus, deleteEnquiry,
  updateContent,
} = adminSlice.actions;

export default adminSlice.reducer;
