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
  careTipsOverline:    'Pet Care Guide',
  careTipsTitle:       "Care Tips from Mom's Desk 🐾",
  careTipsSubtitle:    "Follow these simple tips to ensure your fur baby's outfit stays fresh, soft, and beautiful for longer.",
  careTipsImage:       '',
};

// ── Default custom categories (admin can add/remove) ──────────────────────
export const DEFAULT_CUSTOM_CATEGORIES = [
  { id: 'cat-1', name: 'Male',            urlKey: 'male',             description: 'Stylish and comfortable outfits designed especially for your male furry baby. From everyday casuals to festive wear, we have it all.' },
  { id: 'cat-2', name: 'Female',          urlKey: 'female',           description: 'Adorable and elegant fashion crafted for your princess pup. Explore our curated collection of feminine styles made with love.' },
  { id: 'cat-3', name: 'New Collections', urlKey: 'new-collections',  description: 'Fresh arrivals and season\'s latest designs — be the first to dress your pet in our newest handmade creations.' },
  { id: 'cat-4', name: 'Bandana',         urlKey: 'bandana',          description: 'Fun, trendy and easy to wear — our handcrafted bandanas are the perfect finishing touch for any pet outfit.' },
  { id: 'cat-5', name: 'Customization',   urlKey: 'customization',    description: 'Your idea, our craft. Send us your design and we\'ll stitch it into reality — fully personalised pet fashion, made just for you.' },
];

// ── Bootstrap thunk: load ALL admin data from dataService at startup ──────
export const fetchAdminData = createAsyncThunk(
  'admin/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch the real products and categories from the database
      const [resProducts, resCategories] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories()
      ]);
      
      const dbProducts   = (resProducts.success && Array.isArray(resProducts.data)) ? resProducts.data : [];
      const dbCategories = (resCategories.success && Array.isArray(resCategories.data)) ? resCategories.data : [];
      
      const hero             = DEFAULT_HERO;
      const categories       = mockCategories;
      const content          = DEFAULT_CONTENT;
      const reviews          = DEFAULT_REVIEWS;
      const why              = DEFAULT_WHY;
      const enquiries        = [];
      const customCategories = dbCategories.length > 0 ? dbCategories : DEFAULT_CUSTOM_CATEGORIES;

      console.log('Admin fetch complete. Real Products found:', dbProducts.length);

      // ⚠️ FIX: Use ONLY database products, NO MORE MOCK DATA merging.
      const allProducts = dbProducts;

      // Auto-migrate legacy hero links
      let heroData = hero;
      if (Array.isArray(heroData)) {
        heroData = heroData.map((slide) => ({
          ...slide,
          link: slide.link === '/shop?category=dog' ? '/shop?category=male'
              : slide.link === '/shop?category=cat' ? '/shop?category=female'
              : slide.link,
        }));
      }

      return {
        products:          allProducts,
        heroSlides:        heroData,
        categories:        categories,
        content:           content,
        reviews:           reviews,
        whyChooseUs:       why,
        enquiries:         enquiries,
        customCategories:  customCategories,
        navbarFeatured:    {
          male: [null, null, null],
          female: [null, null, null],
          accessories: [null, null, null],
        },
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
    products:         [],
    heroSlides:       DEFAULT_HERO,
    categories:       mockCategories,
    content:          DEFAULT_CONTENT,
    reviews:          DEFAULT_REVIEWS,
    whyChooseUs:      DEFAULT_WHY,
    enquiries:        [],
    customCategories: DEFAULT_CUSTOM_CATEGORIES,
    navbarFeatured: {
      male: [null, null, null],
      female: [null, null, null],
      accessories: [null, null, null],
    },
    collectionDescriptions: {
      male:         { _default: 'Stylish and comfortable outfits designed for your male furry baby. From everyday casuals to festive looks, crafted with love.', Casual: 'Everyday comfort wear for your boy pup — soft fabrics and easy fits for walks, playdates, and lazy afternoons.', 'Party Wear': 'Because every good boy deserves to look dapper at parties. Our party wear collection brings the wow factor for special occasions.', Festive: 'Celebrate every festival in style. Our festive collection for male pets features rich fabrics, bright colours, and handcrafted details.', Tuxedo: 'For the most formal of occasions — our tuxedo range makes your male pup the best-dressed guest in the room.' },
      female:       { _default: 'Adorable and elegant fashion crafted for your princess pup. Explore feminine styles made with love and care.', Casual: 'Everyday chic for your girl pup — breezy, soft, and effortlessly stylish for every day of the week.', Designer: 'Exclusive designer pieces crafted with premium fabrics and intricate detailing — for the pup who deserves the best.', Festive: 'Shine at every celebration in our festive collection — vibrant colours, rich embroidery, and royal silhouettes.', 'Party Wear': 'Glam up your girl for every party with our stunning party wear range — frills, bows, and everything fabulous.', 'Skirt Top/ Co-ords': 'Trendy co-ord sets and skirt tops that are perfect for styled shoots, outings, and special moments.', Lehengas: 'Mini bridal vibes for your princess — handcrafted lehengas with intricate work, made for the most special days.' },
      accessories:  { _default: 'The perfect finishing touch for any pet outfit. Shop our curated range of handcrafted pet accessories.', Bandana: 'Fun, trendy and easy to wear — our handcrafted bandanas come in dozens of prints to match any outfit.', Caps: 'Keep your pup cool and cute with our range of pet caps — sun protection meets street style.', HairClips: 'Pretty clips and bows to add a little extra charm to your girl pup\'s everyday look.', Ties: 'A sharp tie makes every boy pup look like a true gentleman — available in silks, cottons, and printed patterns.' },
    },
    subCategories: {
      male:         ['Casual', 'Party Wear', 'Festive', 'Tuxedo'],
      female:       ['Casual', 'Designer', 'Festive', 'Party Wear', 'Skirt Top/ Co-ords', 'Lehengas'],
      accessories:  ['Bandana', 'Caps', 'HairClips', 'Ties'],
    },
    status:           'idle',
  },
  reducers: {
    // ── Products CRUD ────────────────────────────────────────────────────
    addProduct: (state, { payload }) => {
      state.products.push({ id: `p-${Date.now()}`, ...payload });
    },
    editProduct: (state, { payload }) => {
      const idx = state.products.findIndex((p) => p.id === payload.id);
      if (idx !== -1) {
        // Merge the updates
        state.products[idx] = { ...state.products[idx], ...payload };
        
        // ⚠️ CRITICAL FIX: If we have a new database ID, use it and 
        // discard the temporary one completely.
        if (payload.newId) {
          state.products[idx].id = payload.newId;
          delete state.products[idx].newId;
        }
      }
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
    addCategoryBanner: (state, { payload }) => {
      state.categories.push(payload);
    },
    deleteCategoryBanner: (state, { payload: id }) => {
      state.categories = state.categories.filter(c => c.id !== id);
    },

    // ── Navbar Featured Products ──────────────────────────────────────────
    updateNavbarFeatured: (state, { payload }) => {
      state.navbarFeatured = { ...state.navbarFeatured, ...payload };
    },

    // ── Custom Categories (admin-managed list for product dropdown) ───────
    addCategory: (state, { payload }) => {
      // payload can be a string (new name) or an object (for sync)
      if (typeof payload === 'string') {
        const name = payload.trim();
        if (!name) return;
        const alreadyExists = state.customCategories.some(
          (c) => c.name.toLowerCase() === name.toLowerCase()
        );
        if (alreadyExists) return;
        const urlKey = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        state.customCategories.push({ id: `cat-${Date.now()}`, name, urlKey });
      } else {
        // Sync real ID from backend
        const idx = state.customCategories.findIndex(c => c.id === payload.id);
        if (idx !== -1 && payload.newId) {
          state.customCategories[idx].id = payload.newId;
        }
      }
    },
    deleteCategory: (state, { payload: id }) => {
      state.customCategories = state.customCategories.filter((c) => c.id !== id);
    },
    updateCustomCategory: (state, { payload }) => {
      const idx = state.customCategories.findIndex(c => c.id === payload.id);
      if (idx !== -1) state.customCategories[idx] = { ...state.customCategories[idx], ...payload };
    },
    updateCollectionDescription: (state, { payload: { collection, subKey, description } }) => {
      if (!state.collectionDescriptions) state.collectionDescriptions = {};
      if (!state.collectionDescriptions[collection]) state.collectionDescriptions[collection] = {};
      state.collectionDescriptions[collection][subKey] = description;
    },
    addSubCategory: (state, { payload: { collection, name } }) => {
      if (!state.subCategories) state.subCategories = {};
      if (!state.subCategories[collection]) state.subCategories[collection] = [];
      const trimmed = name.trim();
      if (!trimmed) return;
      if (!state.subCategories[collection].includes(trimmed)) {
        state.subCategories[collection].push(trimmed);
      }
    },
    deleteSubCategory: (state, { payload: { collection, name } }) => {
      if (state.subCategories && state.subCategories[collection]) {
        state.subCategories[collection] = state.subCategories[collection].filter(n => n !== name);
      }
    },

    // ── Why Choose Us ────────────────────────────────────
    updateWhyReason: (state, { payload }) => {
      const idx = state.whyChooseUs.findIndex((r) => r.id === payload.id);
      if (idx !== -1) state.whyChooseUs[idx] = { ...state.whyChooseUs[idx], ...payload };
    },
    addWhyReason: (state, { payload }) => {
      state.whyChooseUs.push({ id: `w-${Date.now()}`, emoji: '✨', title: 'New Reason', desc: 'Describe why customers love A\'DOREMOM.', ...payload });
    },
    deleteWhyReason: (state, { payload: id }) => {
      state.whyChooseUs = state.whyChooseUs.filter(r => r.id !== id);
    },
    updateWhyTitle: (state, { payload }) => {
      if (state.content) state.content.whyChooseTitle = payload;
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
        if (payload.subCategories) {
          state.subCategories = payload.subCategories;
        }
        if (payload.navbarFeatured) {
          state.navbarFeatured = payload.navbarFeatured;
        }
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
  updateCategory, addCategoryBanner, deleteCategoryBanner,
  updateNavbarFeatured,
  addCategory, deleteCategory, updateCustomCategory, updateCollectionDescription,
  addSubCategory, deleteSubCategory,
  updateWhyReason, addWhyReason, deleteWhyReason, updateWhyTitle,
  addReview, editReview, deleteReview, toggleFeaturedReview,
  addEnquiry, updateEnquiryStatus, deleteEnquiry,
  updateContent,
} = adminSlice.actions;

export default adminSlice.reducer;
