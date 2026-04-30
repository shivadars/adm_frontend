import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const IconWhatsapp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const links = {
  Shop: [
    { label: 'Daily Wear', href: '/shop?category=dog' },
    { label: 'Party Wear', href: '/shop' },
    { label: 'Custom Designs', href: '/shop' },
    { label: 'Accessories', href: '/shop?category=accessories' },
    { label: 'New Arrivals', href: '/shop' },
  ],
  Help: [
    { label: 'Size Guide', href: '#' },
    { label: 'Care Instructions', href: '#' },
    { label: 'Shipping Policy', href: '#' },
    { label: 'Returns & Refunds', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
};

export const Footer = () => (
  <footer style={{ backgroundColor: '#073b3a' }} className="text-brand-light relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10">

        {/* Brand column */}
        <div className="col-span-2 lg:col-span-2">
          <div className="inline-block mb-4 rounded-2xl px-4 py-2" style={{ background: 'rgba(255,255,255,0.92)' }}>
            <img src="/footerlogo.png" alt="A'DOREMOM Couture" className="h-14 w-auto object-contain" />
          </div>
          <p className="text-brand-light/70 text-sm leading-relaxed font-sans max-w-xs mb-6">
            Born from a mother's love, A'DOREMOM crafts handmade pet fashion that prioritizes your fur baby's comfort, safety, and style — all at an honest price.
          </p>

          {/* Contact */}
          <div className="space-y-2 text-sm text-brand-light/70 font-sans">
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +91 XXXXX XXXXX</div>
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> hello@adoremom.in</div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> India 🇮🇳</div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([heading, items]) => (
          <div key={heading}>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light/50 mb-5 font-sans">{heading}</h4>
            <ul className="space-y-3">
              {items.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="text-brand-light/75 hover:text-brand-light text-sm font-sans transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Social column — far right */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light/50 mb-5 font-sans">Follow Us</h4>
          <div className="flex flex-col gap-3">
            {[{ Icon: IconInstagram, label: 'Instagram' }, { Icon: IconWhatsapp, label: 'WhatsApp' }].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label}
                className="flex items-center gap-2.5 text-sm font-sans text-brand-light/70 hover:text-brand-light transition-colors group">
                <span className="w-9 h-9 rounded-xl border border-white/20 group-hover:bg-white/15 flex items-center justify-center transition-colors shrink-0">
                  <Icon />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-8 text-xs text-brand-light/40 font-sans">
        <p>© 2026 A'DOREMOM. All rights reserved.</p>
        <p>Made with 💚 for fur babies & their moms</p>
      </div>
    </div>
  </footer>
);
