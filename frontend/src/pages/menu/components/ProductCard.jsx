import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useSettings } from '../../../context/SettingsContext';
import { useLanguage } from '../../../context/LanguageContext';
import { formatPrice, getImageUrl, truncate } from '../../../utils/helpers';
import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCard({ product, index = 0, onView }) {
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const categories = settings.categories || [];

  const cat = categories.find(c => c.id === product.category);
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
    : product.category;
  const [imgIndex, setImgIndex] = useState(0);
  const images = product?.images?.length ? product.images : ['/placeholder.svg'];
  const hasMultipleImages = images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass-card group cursor-pointer overflow-hidden flex flex-col"
      onClick={() => onView?.(product)}
    >
      <div className="relative h-42 flex-shrink-0 overflow-hidden bg-dark-950/50">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={getImageUrl(images[imgIndex])}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === imgIndex ? 'bg-gold-500 w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-medium rounded-full glass text-gold-500 border border-gold-500/30">
            {categoryLabel}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onView?.(product); }}
          className="absolute top-3 left-3 p-2 rounded-full glass text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye size={16} />
        </motion.button>

        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i - 1 + images.length) % images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-display font-semibold text-white mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {truncate(product.description, 60)}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold gold-text">
            {formatPrice(product.price)}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full gold-gradient text-dark-950 text-xs sm:text-sm font-medium hover:shadow-lg hover:shadow-gold-500/25 transition-shadow"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Savat</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}