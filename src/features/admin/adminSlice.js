/**
 * adminSlice.js
 *
 * Manages all admin/CMS data: products, hero slides, categories,
 * content, reviews, why-choose-us, and enquiries.
 *
 * Strategy:
 * - Synchronous reducers handle immediate UI state updates (fast, no flash)
 * - RTK Listener Middleware (configured in store.js) watches these reducers
 *   and calls dataService.setAdminData() in the background for persistence
 * - All existing component dispatches remain UNCHANGED
 *
 * Bootstrap thunk fetches all data from dataService at app startup.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockProducts, mockCategories }  from '../../services/apiMockData';
import dataService                        from '../../services/dataService';

// ── Seed / default data ──────────────────────────────────────────────────
export const DEFAULT_FABRICS = [
  { id: 'f1', name: 'Soft Cotton', desc: 'Gentle, breathable & skin-safe' },
  { id: 'f2', name: 'Fleece',      desc: 'Warm & cozy for winters' },
  { id: 'f3', name: 'Satin',       desc: 'Smooth, shiny & party-ready' },
  { id: 'f4', name: 'Denim',       desc: 'Sturdy & trendy everyday look' },
  { id: 'f5', name: 'Linen',       desc: 'Lightweight & perfect for summers' },
];

export const DEFAULT_COLORS = [
  { id: 'c1', name: 'Ivory White',      hex: '#F8F4EE' },
  { id: 'c2', name: 'Blush Pink',       hex: '#F4B8C1' },
  { id: 'c3', name: 'Sky Blue',         hex: '#87CEEB' },
  { id: 'c4', name: 'Mint Green',       hex: '#A8E6CF' },
  { id: 'c5', name: 'Sunshine Yellow',  hex: '#FFE082' },
  { id: 'c6', name: 'Lilac Purple',     hex: '#C8A2D9' },
  { id: 'c7', name: 'Terracotta',       hex: '#D4735E' },
  { id: 'c8', name: 'Navy Blue',        hex: '#1E3A5F' },
];

const DEFAULT_WHY = [
  { id: 'w1', emoji: '💰', title: 'Pocket-Friendly',  desc: 'Premium quality pet fashion without burning a hole in your pocket. Style meets affordability.' },
  { id: 'w2', emoji: '🧵', title: 'Handmade Quality', desc: 'Every stitch is sewn with care by skilled hands. No factory shortcuts — just love and craft.' },
  { id: 'w3', emoji: '🐾', title: 'Zero Fur Damage',  desc: 'Our soft, tested fabrics are gentle on fur and skin. No itching, no tangling, no stress.' },
  { id: 'w4', emoji: '💪', title: 'Built to Last',    desc: 'Wash after wash, our outfits hold their shape and color — because durability is love too.' },
];

const DEFAULT_REVIEWS = [
  { id: 'r1', name: 'Priya Sharma',    location: 'Mumbai',    rating: 5, text: "My Coco looks absolutely adorable in the pink frill dress! The fabric is so soft and she wore it all day without any discomfort. Will definitely order again!", featured: true,  date: '2024-12-10', avatar: 'P' },
  { id: 'r2', name: 'Anjali Verma',    location: 'Delhi',     rating: 5, text: "Ordered a custom outfit for my pomeranian's birthday and it was beyond my expectations. The stitching quality is premium and it arrived in 4 days!", featured: true,  date: '2025-01-05', avatar: 'A' },
  { id: 'r3', name: 'Kavitha Nair',    location: 'Bangalore', rating: 5, text: "My retriever Max has sensitive skin and finds most pet clothes itchy. A'DOREMOM fabrics are the ONLY ones he's comfortable in. Ordering 3 more!", featured: true,  date: '2025-02-18', avatar: 'K' },
  { id: 'r4', name: 'Sunita Rao',      location: 'Hyderabad', rating: 4, text: "Beautiful kurta set for my indie dog. Sizing was perfect and the quality exceeded the price. Love this brand!", featured: false, date: '2025-03-01', avatar: 'S' },
  { id: 'r5', name: 'Meenakshi Iyer',  location: 'Chennai',   rating: 5, text: "Got the bandana pack and sweater combo — both are stunning. Very fast shipping and lovely packaging too!", featured: false, date: '2025-03-22', avatar: 'M' },
];

const DEFAULT_HERO = [
  { id: 1, badge: 'Daily Wear Collection',  title: "Pet Wear with a\nMother's Touch",     subtitle: 'Soft, breathable everyday outfits — crafted to keep your fur baby comfortable all day long.',         image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1400', link: '/shop?category=male',          cta: 'Shop Daily Wear' },
  { id: 2, badge: 'Party Wear Collection',  title: "Dressed to Impress,\nBorn to Adore",   subtitle: "Gorgeous party outfits for every celebration — because your pet deserves the spotlight.",              image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=1400', link: '/shop?category=female',        cta: 'Shop Party Wear' },
  { id: 3, badge: 'Custom Designs',         title: "Your Vision,\nOur Handcraft",           subtitle: "Send your design idea — we'll stitch it with love. Every piece is one-of-a-kind.",                   image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=1400', link: '/shop?category=customization', cta: 'Order Custom' },
];

const DEFAULT_CONTENT = {
  offerMessages: [
    "🐾  Handmade with a Mother's Love  •  Free Shipping above ₹999",
    "🎀  New Arrivals: Monsoon Collection is here!",
    "💚  No Fur Damage, No Discomfort — A'DOREMOM Promise",
  ],
  promoBannerTitle:    "Your Design,\nOur Handcraft",
  promoBannerSubtitle: "Share your idea, reference, or dream outfit — and our skilled moms will craft it with the finest fabric.",
  promoBannerImage:    'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=700',
  whyChooseTitle:      "Why Moms Choose A'DOREMOM",
};

// ── Default custom categories (admin can add/remove) ──────────────────────
export const DEFAULT_CUSTOM_CATEGORIES = [
  { id: 'cat-1', name: 'Male',            urlKey: 'male' },
  { id: 'cat-2', name: 'Female',          urlKey: 'female' },
  { id: 'cat-3', name: 'New Collections', urlKey: 'new-collections' },
  { id: 'cat-4', name: 'Bandana',         urlKey: 'bandana' },
  { id: 'cat-5', name: 'Customization',   urlKey: 'customization' },
];

// ── Bootstrap thunk: load ALL admin data from dataService at startup ──────
export const fetchAdminData = createAsyncThunk(
  'admin/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [products, hero, categories, content, reviews, why, enquiries, customCategories] = await Promise.all([
        dataService.getAdminData('products'),
        dataService.getAdminData('hero'),
        dataService.getAdminData('categories'),
        dataService.getAdminData('content'),
        dataService.getAdminData('reviews'),
        dataService.getAdminData('why'),
        dataService.getAdminData('enquiries'),
        dataService.getAdminData('customCategories'),
      ]);

      // Auto-migrate legacy hero links
      let heroData = hero.data;
      if (Array.isArray(heroData)) {
        heroData = heroData.map((slide) => ({
          ...slide,
          link: slide.link === '/shop?category=dog' ? '/shop?category=male'
              : slide.link === '/shop?category=cat' ? '/shop?category=female'
              : slide.link,
        }));
      }

      return {
        products:          products.data         || mockProducts,
        heroSlides:        heroData              || DEFAULT_HERO,
        categories:        categories.data       || mockCategories,
        content:           content.data          || DEFAULT_CONTENT,
        reviews:           reviews.data          || DEFAULT_REVIEWS,
        whyChooseUs:       why.data              || DEFAULT_WHY,
        enquiries:         enquiries.data        || [],
        customCategories:  customCategories.data || DEFAULT_CUSTOM_CATEGORIES,
      };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// ── Sync thunk: persist a single admin data key via dataService ───────────
export const syncAdminData = createAsyncThunk(
  'admin/sync',
  async ({ key, value }, { rejectWithValue }) => {
    const result = await dataService.setAdminData(key, value);
    if (!result.success) return rejectWithValue(result.error);
    return { key, value };
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products:         mockProducts,
    heroSlides:       DEFAULT_HERO,
    categories:       mockCategories,
    content:          DEFAULT_CONTENT,
    reviews:          DEFAULT_REVIEWS,
    whyChooseUs:      DEFAULT_WHY,
    enquiries:        [],
    customCategories: DEFAULT_CUSTOM_CATEGORIES,
    status:           'idle',
  },
  reducers: {
    // ── Products CRUD ────────────────────────────────────────────────────
    addProduct: (state, { payload }) => {
      state.products.push({ id: `p-${Date.now()}`, ...payload });
    },
    editProduct: (state, { payload }) => {
      const idx = state.products.findIndex((p) => p.id === payload.id);
      if (idx !== -1) state.products[idx] = { ...state.products[idx], ...payload };
    },
    deleteProduct: (state, { payload: id }) => {
      state.products = state.products.filter((p) => p.id !== id);
    },

    // ── Hero slides ──────────────────────────────────────────────────────
    updateHeroSlide: (state, { payload }) => {
      const idx = state.heroSlides.findIndex((s) => s.id === payload.id);
      if (idx !== -1) state.heroSlides[idx] = { ...state.heroSlides[idx], ...payload };
      else            state.heroSlides.push(payload);
    },
    deleteHeroSlide: (state, { payload: id }) => {
      state.heroSlides = state.heroSlides.filter((s) => s.id !== id);
    },

    // ── Categories (banner images — from AdminBanners) ──────────────────
    updateCategory: (state, { payload }) => {
      const idx = state.categories.findIndex((c) => c.id === payload.id);
      if (idx !== -1) state.categories[idx] = { ...state.categories[idx], ...payload };
    },

    // ── Custom Categories (admin-managed list for product dropdown) ───────
    addCategory: (state, { payload }) => {
      const name = payload.trim();
      if (!name) return;
      const alreadyExists = state.customCategories.some(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      if (alreadyExists) return;
      const urlKey = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      state.customCategories.push({ id: `cat-${Date.now()}`, name, urlKey });
    },
    deleteCategory: (state, { payload: id }) => {
      state.customCategories = state.customCategories.filter((c) => c.id !== id);
    },

    // ── Why Choose Us ────────────────────────────────────────────────────
    updateWhyReason: (state, { payload }) => {
      const idx = state.whyChooseUs.findIndex((r) => r.id === payload.id);
      if (idx !== -1) state.whyChooseUs[idx] = { ...state.whyChooseUs[idx], ...payload };
    },

    // ── Reviews ──────────────────────────────────────────────────────────
    addReview: (state, { payload }) => {
      state.reviews.push({
        id: `r-${Date.now()}`,
        featured: false,
        date: new Date().toISOString().slice(0, 10),
        ...payload,
      });
    },
    editReview: (state, { payload }) => {
      const idx = state.reviews.findIndex((r) => r.id === payload.id);
      if (idx !== -1) state.reviews[idx] = { ...state.reviews[idx], ...payload };
    },
    deleteReview: (state, { payload: id }) => {
      state.reviews = state.reviews.filter((r) => r.id !== id);
    },
    toggleFeaturedReview: (state, { payload: id }) => {
      const r = state.reviews.find((r) => r.id === id);
      if (r) r.featured = !r.featured;
    },

    // ── Enquiries ────────────────────────────────────────────────────────
    addEnquiry: (state, { payload }) => {
      state.enquiries.unshift({
        id: `enq-${Date.now()}`,
        status: 'new',
        createdAt: new Date().toISOString(),
        ...payload,
      });
    },
    updateEnquiryStatus: (state, { payload: { id, status } }) => {
      const e = state.enquiries.find((e) => e.id === id);
      if (e) e.status = status;
    },
    deleteEnquiry: (state, { payload: id }) => {
      state.enquiries = state.enquiries.filter((e) => e.id !== id);
    },

    // ── Content ──────────────────────────────────────────────────────────
    updateContent: (state, { payload }) => {
      state.content = { ...state.content, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminData.fulfilled, (state, { payload }) => {
        state.status           = 'succeeded';
        state.products         = payload.products;
        state.heroSlides       = payload.heroSlides;
        state.categories       = payload.categories;
        state.content          = payload.content;
        state.reviews          = payload.reviews;
        state.whyChooseUs      = payload.whyChooseUs;
        state.enquiries        = payload.enquiries;
        state.customCategories = payload.customCategories;
      })
      .addCase(fetchAdminData.rejected, (state) => {
        state.status = 'failed';
        // Keep defaults on failure
      });
  },
});

export const {
  addProduct, editProduct, deleteProduct,
  updateHeroSlide, deleteHeroSlide,
  updateCategory,
  addCategory, deleteCategory,
  updateWhyReason,
  addReview, editReview, deleteReview, toggleFeaturedReview,
  addEnquiry, updateEnquiryStatus, deleteEnquiry,
  updateContent,
} = adminSlice.actions;

export default adminSlice.reducer;
