import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { ENDPOINTS } from '../services/endpoints';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '../features/cart/cartSlice';
import { addEnquiry } from '../features/admin/adminSlice';
import { fetchProducts } from '../features/products/productSlice';
import { DEFAULT_FABRICS, DEFAULT_COLORS } from '../features/admin/adminSlice';
import { 
  Star, Truck, ShieldCheck, ChevronRight, Heart, Ruler, 
  Palette, X, Check, Send, ChevronDown, ChevronUp,
  Wind, RotateCcw, ShoppingBag, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/product/ProductCard';

// ── Reusable Accordion Component ─────────────────────────────────────────────
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brand-border last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-sm font-bold text-brand-dark hover:text-brand-blue transition-colors text-left font-sans"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-brand-dark/70 font-sans leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Custom Color Enquiry Modal ───────────────────────────────────────────────
const ColorEnquiryModal = ({ product, onClose, onSubmit }) => {
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!desc.trim() && !imgUrl.trim()) return;
    onSubmit({ type: 'custom_color', colorDesc: desc, colorImage: imgUrl });
    setDone(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand-dark" />
            <h3 className="font-serif text-lg font-bold text-brand-dark">Custom Colour Enquiry</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-brand-muted"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-serif text-xl font-bold text-brand-dark mb-2">Enquiry Sent!</h4>
            <p className="text-sm text-brand-dark/70 font-sans mb-6">Our team will contact you soon about your custom colour requirement for <strong>{product?.name}</strong>.</p>
            <button onClick={onClose} className="btn-brand">Close</button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-brand-dark/70 font-sans">
              Can't find the colour you want? Describe it below or share a reference image — our team will get back to you!
            </p>
            <div>
              <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider font-sans mb-1 block">Describe your colour *</label>
              <textarea
                value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                placeholder="e.g. Deep royal blue with a matte finish, similar to sapphire..."
                className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-dark resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider font-sans mb-1 block">Reference Image URL <span className="font-normal text-brand-dark/40 normal-case tracking-normal">(optional)</span></label>
              <input
                value={imgUrl} onChange={e => setImgUrl(e.target.value)}
                placeholder="Paste an image URL from Pinterest, Google etc."
                className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-dark"
              />
              {imgUrl && (
                <img src={imgUrl} alt="Reference" className="mt-2 h-20 rounded-lg object-cover border border-brand-border" onError={e => e.target.style.display='none'} />
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-2.5 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark/80 hover:bg-brand-muted transition-colors font-sans">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!desc.trim() && !imgUrl.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 font-sans disabled:opacity-50 transition-colors"
                style={{ background: '#073b3a' }}
              >
                <Send className="w-4 h-4" /> Send Enquiry
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ── Custom Size Modal ────────────────────────────────────────────────────────
const CustomSizeModal = ({ product, onClose, onSubmit }) => {
  const MEASUREMENTS = [
    { key: 'neck',   label: 'Neck Circumference',  hint: 'Measure around the base of the neck' },
    { key: 'chest',  label: 'Chest / Belly Girth',  hint: 'Measure the widest part of the chest' },
    { key: 'back',   label: 'Back Length',          hint: 'From back of neck to base of tail' },
    { key: 'weight', label: 'Pet Weight (kg)',      hint: 'Helps us suggest the right fit' },
  ];
  const [form, setForm] = useState({ neck: '', chest: '', back: '', weight: '', notes: '' });
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!form.neck && !form.chest && !form.back) return;
    onSubmit({ type: 'custom_size', measurements: form });
    setDone(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-brand-dark" />
            <h3 className="font-serif text-lg font-bold text-brand-dark">Custom Size Request</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-brand-muted"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-serif text-xl font-bold text-brand-dark mb-2">Measurements Received!</h4>
            <p className="text-sm text-brand-dark/70 font-sans mb-6">We'll craft a perfect custom-fit outfit for your pet. Our team will confirm the order details with you shortly.</p>
            <button onClick={onClose} className="btn-brand">Close</button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div className="bg-brand-muted rounded-xl px-4 py-3 text-xs text-brand-dark/70 font-sans">
              📏 All measurements in <strong>centimetres (cm)</strong> unless noted. Use a soft tape measure for best results.
            </div>
            {MEASUREMENTS.map(({ key, label, hint }) => (
              <div key={key}>
                <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">
                  {label} {key !== 'weight' && <span className="font-normal normal-case tracking-normal text-brand-dark/40">(cm)</span>}
                </label>
                <input
                  type="number" step="0.5" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={hint}
                  className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-dark"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider font-sans mb-1 block">Additional Notes <span className="font-normal normal-case tracking-normal text-brand-dark/40">(optional)</span></label>
              <textarea
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                placeholder="e.g. My dog has a broad chest, please allow extra room..."
                className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-dark resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 border border-brand-border rounded-xl text-sm font-semibold text-brand-dark/80 hover:bg-brand-muted transition-colors font-sans">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!form.neck && !form.chest && !form.back}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 font-sans disabled:opacity-50"
                style={{ background: '#073b3a' }}
              >
                <Send className="w-4 h-4" /> Submit Measurements
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ── Main Product Details ─────────────────────────────────────────────────────
export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector(s => s.products.items);
  
  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedSize, setSelectedSize]       = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor]     = useState('');
  const [quantity, setQuantity]       = useState(1);
  const [wishlisted, setWishlisted]   = useState(false);
  const [added, setAdded]             = useState(false);
  const [colorModal, setColorModal]   = useState(false);
  const [sizeModal, setSizeModal]     = useState(false);
  
  // New input fields
  const [petName, setPetName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchCurrentProduct = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.PRODUCT_DETAILS(id));
        const p = res.data.data;
        setProduct(p);
        if (p.sizes?.length > 0) setSelectedSize(p.sizes[0]);
        if (p.materials?.length > 0) setSelectedMaterial(p.materials[0]);
        if (p.colors?.length > 0) setSelectedColor(p.colors[0]);
        
        // Ensure all products are available for "Similar Products"
        if (allProducts.length === 0) {
          dispatch(fetchProducts());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentProduct();
    window.scrollTo(0, 0);
  }, [id, dispatch, allProducts.length]);

  const handleAddToCart = (e, andRedirect = false) => {
    dispatch(addToCart({ 
      product, 
      quantity, 
      size: selectedSize, 
      material: selectedMaterial, 
      color: selectedColor,
      petName,
      specialRequests
    }));
    
    if (andRedirect) {
      navigate('/checkout');
    } else {
      dispatch(toggleCart(true));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleEnquiry = (extra) => {
    dispatch(addEnquiry({
      productId:   product.id,
      productName: product.name,
      productImage: product.image,
      selectedSize,
      selectedColor,
      selectedMaterial,
      ...extra,
    }));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-brand-border border-t-brand-dark rounded-full animate-spin" />
    </div>
  );
  if (!product) return (
    <div className="text-center py-20 min-h-screen">
      <p className="font-serif text-2xl text-brand-dark/70">Product not found.</p>
      <Link to="/shop" className="mt-6 inline-block btn-brand">Back to Shop</Link>
    </div>
  );

  const sellingPrice = product.sellingPrice ?? product.price;
  const mrp          = product.mrp ?? null;
  const hasDiscount  = mrp && mrp > sellingPrice;
  const discountPct  = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  const productFabrics = DEFAULT_FABRICS.filter(f => product.materials?.includes(f.id));
  const productColors  = DEFAULT_COLORS.filter(c => product.colors?.includes(c.id));

  const selectedColorObj   = DEFAULT_COLORS.find(c => c.id === selectedColor);
  const selectedMaterialObj = DEFAULT_FABRICS.find(f => f.id === selectedMaterial);

  // Similar Products filtering
  const similarProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || Math.random() > 0.7))
    .slice(0, 4);

  // Mock Gallery (since we only have one image in backend)
  const gallery = [
    product.image,
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80"
  ];

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center text-[10px] sm:text-xs text-brand-dark/70 font-sans gap-1.5 uppercase tracking-wide">
          <Link to="/" className="hover:text-brand-dark transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-brand-dark transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-dark font-bold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">

          {/* ── Left: Image Gallery & Details ───────────────────────────────────── */}
          <div className="w-full lg:w-[45%] flex flex-col gap-8 sticky top-32">
            <div className="flex flex-col md:flex-row-reverse gap-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 relative aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-soft group max-h-[650px]"
              >
                <img 
                  src={gallery[activeImg]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                {hasDiscount && (
                  <div className="absolute top-5 left-5 bg-brand-pink text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-soft uppercase tracking-wider">
                    {discountPct}% Off
                  </div>
                )}
              </motion.div>
              
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`w-16 sm:w-20 md:w-16 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImg === idx ? 'border-brand-pink shadow-soft' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Strip (Moved to Left) */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-brand-border/50">
              <div className="text-center group">
                <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center mx-auto mb-2 text-brand-dark group-hover:bg-brand-pink group-hover:text-white transition-all">
                  <Wind className="w-4 h-4" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/80">Breathable</p>
              </div>
              <div className="text-center group">
                <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center mx-auto mb-2 text-brand-dark group-hover:bg-brand-pink group-hover:text-white transition-all">
                  <Heart className="w-4 h-4" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/80">Handmade</p>
              </div>
              <div className="text-center group">
                <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center mx-auto mb-2 text-brand-dark group-hover:bg-brand-pink group-hover:text-white transition-all">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/80">Easy Returns</p>
              </div>
            </div>

            {/* Accordions (Moved to Left) */}
            <div className="border-t border-brand-border">
              <Accordion title="PRODUCT DETAILS" defaultOpen>
                <p>{product.description}</p>
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li>Premium boutique quality fabric</li>
                  <li>Breathable cotton lining</li>
                  <li>Durable stitching for active pets</li>
                  <li>Easy to wear with soft velcro/buttons</li>
                </ul>
              </Accordion>
              <Accordion title="FABRIC & CARE">
                <div className="space-y-3">
                  <p>Materials: {productFabrics.map(f => f.name).join(', ') || 'Cotton & Poly blend'}</p>
                  <p>Hand wash gently with mild detergent. Do not bleach. Air dry in shade to maintain color vibrancy.</p>
                </div>
              </Accordion>
              <Accordion title="SIZE GUIDE">
                <p>Standard measurements for our sizes. If your pet falls between sizes, always go for the larger one.</p>
                <div className="mt-3 grid grid-cols-2 gap-4 text-[11px] font-bold text-center">
                  <div className="bg-white p-3 rounded-xl border border-brand-border">XS: Neck 20cm</div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border">S: Neck 24cm</div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border">M: Neck 28cm</div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border">L: Neck 32cm</div>
                </div>
              </Accordion>
              <Accordion title="SHIPPING INFO">
                <p>Ships within 2-4 business days. Free shipping on orders above ₹999. Easy 7-day returns if size doesn't fit.</p>
              </Accordion>
            </div>
          </div>

          {/* ── Right: Purchase Info ───────────────────────────────────── */}
          <div className="w-full lg:w-[55%] flex flex-col pt-0 sm:pt-4">
            {/* Header info */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark leading-tight mb-3">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'opacity-30'}`} />
                ))}
              </div>
              <span className="text-[13px] font-bold text-brand-dark/50 font-sans tracking-wide">
                4.8 <span className="font-normal">(136 reviews)</span>
              </span>
            </div>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-serif text-3xl font-extrabold text-brand-dark">₹{sellingPrice.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <span className="text-lg text-brand-dark/30 line-through font-sans">₹{mrp.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="text-brand-dark/70 font-sans text-sm leading-relaxed mb-8 max-w-lg italic">
              "Soft, breathable and oh-so-pretty! Made for your little princess."
            </p>

            {/* Customization Selectors */}
            <div className="space-y-8 mb-10">
              
              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-brand-dark uppercase tracking-widest font-sans">Select Size</span>
                  <button className="flex items-center gap-1.5 text-[10px] font-extrabold text-brand-pink uppercase tracking-wider hover:underline transition-all">
                    <Ruler className="w-3 h-3" /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes?.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-2xl border-2 text-xs font-bold transition-all duration-300 font-sans ${
                        selectedSize === size
                          ? 'border-brand-pink bg-brand-pink text-white shadow-soft scale-110'
                          : 'border-brand-border text-brand-dark/60 bg-white hover:border-brand-pink'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  <button
                    onClick={() => setSizeModal(true)}
                    className="h-12 px-5 rounded-2xl border-2 border-dashed border-brand-dark/20 text-[10px] font-bold text-brand-dark/60 hover:border-brand-pink hover:text-brand-pink transition-all uppercase tracking-wider"
                  >
                    Custom Size
                  </button>
                </div>
              </div>

              {/* Material Selector */}
              <div>
                <span className="text-[11px] font-bold text-brand-dark uppercase tracking-widest font-sans mb-4 block">Select Material</span>
                <div className="flex flex-wrap gap-3">
                  {(product.materials || DEFAULT_FABRICS).map(fabric => (
                    <button
                      key={fabric.name || fabric}
                      onClick={() => setSelectedMaterial(fabric.name || fabric)}
                      className={`h-11 px-6 rounded-2xl border-2 text-[11px] font-bold transition-all duration-300 font-sans uppercase tracking-wider ${
                        selectedMaterial === (fabric.name || fabric)
                          ? 'border-brand-dark bg-brand-dark text-white'
                          : 'border-brand-border text-brand-dark/60 bg-white hover:border-brand-dark'
                      }`}
                    >
                      {fabric.name || fabric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-brand-dark uppercase tracking-widest font-sans">Select Colour</span>
                  <button 
                    onClick={() => setColorModal(true)}
                    className="flex items-center gap-1.5 text-[10px] font-extrabold text-brand-pink uppercase tracking-wider hover:underline transition-all"
                  >
                    <Palette className="w-3 h-3" /> Custom Colour?
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {(product.colors || DEFAULT_COLORS).map(color => (
                    <button
                      key={color.name || color}
                      onClick={() => setSelectedColor(color.name || color)}
                      className={`group relative flex flex-col items-center gap-2`}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 transform ${
                          selectedColor === (color.name || color) ? 'border-brand-dark scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex || color }}
                      />
                      <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${selectedColor === (color.name || color) ? 'text-brand-dark' : 'text-brand-dark/40'}`}>
                        {color.name || color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personalization Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-widest font-sans px-1">Pet Name (Optional)</label>
                  <input 
                    type="text" 
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g. Coco"
                    className="w-full h-12 px-5 rounded-2xl border-2 border-brand-border bg-white text-sm font-sans focus:outline-none focus:border-brand-pink transition-all shadow-sm focus:shadow-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-dark/60 uppercase tracking-widest font-sans px-1">Special Requests (Optional)</label>
                  <input 
                    type="text" 
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. I want a bow"
                    className="w-full h-12 px-5 rounded-2xl border-2 border-brand-border bg-white text-sm font-sans focus:outline-none focus:border-brand-pink transition-all shadow-sm focus:shadow-md"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between bg-white border-2 border-brand-border rounded-2xl h-14 px-4 shadow-sm min-w-[130px]">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-bold text-brand-dark/40 hover:text-brand-pink transition-colors text-lg">-</button>
                    <span className="flex-1 text-center font-bold text-brand-dark font-sans text-base">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center font-bold text-brand-dark/40 hover:text-brand-pink transition-colors text-lg">+</button>
                  </div>
                  
                  <div className="flex-1 flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 h-14 rounded-2xl font-bold uppercase tracking-[0.1em] text-[13px] shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${added ? 'bg-[#16a34a] text-white shadow-green-600/20' : 'bg-[#0a2540] hover:bg-[#1d4ed8] text-white shadow-[#0a2540]/20'}`}
                    >
                      {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                      {added ? 'Added to Bag' : 'Add to Bag'}
                    </button>

                    <button
                      onClick={() => setWishlisted(w => !w)}
                      className="w-14 h-14 rounded-2xl border-2 border-[#bfdbfe] bg-white flex items-center justify-center transition-all hover:border-[#2563eb] shadow-sm hover:shadow-md group shrink-0"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-[#ff6b81] text-[#ff6b81]' : 'text-[#0a2540]/40 group-hover:text-[#ff6b81]'}`} />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={(e) => handleAddToCart(e, true)}
                  className="w-full h-14 rounded-2xl bg-[#2563eb] font-bold uppercase tracking-[0.1em] text-[13px] text-white hover:opacity-90 transition-all shadow-lg active:scale-[0.98] transform"
                >
                  Buy It Now
                </button>
              </div>
            </div>

            {/* Mamma's Note */}
            <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-pink/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="font-serif text-lg font-bold text-brand-pink mb-2 flex items-center gap-2">
                Mamma's Note <Heart className="w-4 h-4 fill-brand-pink" />
              </h3>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
                "This dress is stitched with love and care. Just like how I cared for each tiny stitch. May your baby feel as special as they are!"
              </p>
            </div>
          </div>
        </div>

        {/* ── Similar Products ────────────────────────────────────────── */}
        <section className="mt-20 lg:mt-32 border-t border-brand-border pt-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] font-extrabold text-brand-pink uppercase tracking-[0.2em] mb-2 font-sans">Curated for you</p>
              <h2 className="font-serif text-3xl font-bold text-brand-dark">You May Also Like</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-brand-dark hover:text-brand-pink transition-colors flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {colorModal && <ColorEnquiryModal product={product} onClose={() => setColorModal(false)} onSubmit={handleEnquiry} />}
        {sizeModal  && <CustomSizeModal   product={product} onClose={() => setSizeModal(false)}  onSubmit={handleEnquiry} />}
      </AnimatePresence>
    </div>
  );
};

const ArrowRight = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
