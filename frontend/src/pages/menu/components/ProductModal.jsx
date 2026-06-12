import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useCart } from '../../../context/CartContext';
import { useSettings } from '../../../context/SettingsContext';
import { useLanguage } from '../../../context/LanguageContext';
import { formatPrice, getImageUrl } from '../../../utils/helpers';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const categories = settings.categories || [];

  const cat = product ? categories.find(c => c.id === product.category) : null;
  const translationKey = cat ? 'cat_' + cat.id.replace('-', '_') : '';
  const isDefaultLabel = cat && {
    mangal: 'Mangal',
    'milliy-taomlar': 'Milliy Taomlar',
    ichimliklar: 'Ichimliklar',
    shirinliklar: 'Shirinliklar',
    salatlar: 'Salatlar'
  }[cat.id] === cat.label;

  const categoryLabel = cat 
    ? (isDefaultLabel ? (t(translationKey) === translationKey ? cat.label : t(translationKey)) : cat.label) 
    : (product?.category || '');
  const [imgIndex, setImgIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const touchStart = useRef(null);
  const images = product?.images?.length ? product.images : ['/placeholder.svg'];

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [imgIndex]);

  useEffect(() => {
    if (!showFullscreen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [showFullscreen]);

  const nextImg = useCallback(() => {
    setImgIndex(i => (i + 1) % images.length);
  }, [images.length]);

  const prevImg = useCallback(() => {
    setImgIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || images.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    if (Math.abs(dx) > 50) dx > 0 ? prevImg() : nextImg();
    touchStart.current = null;
  };

  const handleWheel = (e) => {
    if (!showFullscreen) return;
    e.preventDefault();
    setZoom(z => Math.max(0.5, Math.min(4, z - e.deltaY * 0.01)));
  };

  const handleFullscreenNext = (e) => {
    e.stopPropagation();
    nextImg();
  };

  const handleFullscreenPrev = (e) => {
    e.stopPropagation();
    prevImg();
  };

  if (!product) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative h-64 md:h-80">
              <img
                src={getImageUrl(images[imgIndex])}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setShowFullscreen(true)}
              />
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i === imgIndex ? 'bg-gold-500' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full glass text-gold-500 border border-gold-500/30">
                  {categoryLabel}
                </span>
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="p-2 rounded-full glass text-white hover:bg-white/10 transition-colors"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">
                {product.name}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-3xl font-bold gold-text">
                  {formatPrice(product.price)}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { addToCart(product); onClose(); }}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full gold-gradient text-dark-950 font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-gold-500/30 transition-shadow"
                >
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">Savatga qo'shish</span>
                  <span className="sm:hidden">Savatga</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(4, z + 0.5)); }}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z - 0.5)); }}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-white/60 text-xs ml-2">{Math.round(zoom * 100)}%</span>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={handleFullscreenPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={handleFullscreenNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={28} />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === imgIndex ? 'bg-gold-500 scale-125' : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <motion.div
              className="w-full h-full flex items-center justify-center p-8"
              style={{
                cursor: zoom > 1 ? 'grab' : 'default',
              }}
              drag={zoom > 1}
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
              onDrag={(_, info) => setPan({ x: info.offset.x, y: info.offset.y })}
            >
              <motion.img
                ref={imgRef}
                src={getImageUrl(images[imgIndex])}
                alt={product.name}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}