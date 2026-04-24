import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateHeroSlide } from '../../features/admin/adminSlice';
import { EditableText }  from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';

export const HeroCarousel = () => {
  const dispatch   = useDispatch();
  const heroSlides = useSelector(s => s.admin.heroSlides);

  const update = (id, field, value) =>
    dispatch(updateHeroSlide({ id, [field]: value }));

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation={false}
        loop={true}
        speed={800}
        className="w-full h-[42vh] sm:h-[52vh] lg:h-[62vh] min-h-[350px] max-h-[650px]"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* ── Background image (editable) ────────────────────────── */}
              <EditableImage
                src={slide.image}
                alt={slide.badge}
                className="w-full h-full object-cover object-center"
                onSave={(src) => update(slide.id, 'image', src)}
              />

              {/* Gradient overlay: Left side slightly darker for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />

              {/* ── Text content (editable) ─────────────────────────────── */}
              <div className="absolute inset-0 flex items-center" style={{ pointerEvents: 'none' }}>
                <div className="w-full px-6 sm:px-12 lg:px-20">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="max-w-lg"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {/* Badge */}
                    <span className="inline-block bg-white/90 text-brand-dark text-[11px] font-bold px-3 py-1 mb-4 tracking-widest uppercase font-sans">
                      <EditableText
                        value={slide.badge}
                        onSave={(val) => update(slide.id, 'badge', val)}
                        as="span"
                      />
                    </span>

                    {/* Title */}
                    <EditableText
                      value={slide.title}
                      onSave={(val) => update(slide.id, 'title', val)}
                      as="h1"
                      className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.15] whitespace-pre-line"
                      multiline
                    />

                    {/* Subtitle */}
                    <EditableText
                      value={slide.subtitle}
                      onSave={(val) => update(slide.id, 'subtitle', val)}
                      as="p"
                      className="text-white/90 text-sm sm:text-base mb-8 font-sans leading-relaxed max-w-[90%]"
                      multiline
                    />

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                      <Link to={slide.link} className="btn-brand !rounded-lg !px-8 !py-3.5 !shadow-none hover:bg-opacity-90">
                        <EditableText
                          value={slide.cta}
                          onSave={(val) => update(slide.id, 'cta', val)}
                          as="span"
                          className="font-sans font-bold text-sm tracking-wide"
                        />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
