import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { CATEGORY_MAP } from '../utils/categories';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);
  const images = product?.images?.length ? product.images : ['/placeholder.svg'];

  if (!product) return null;

  const nextImg = () => setImgIndex(i => (i + 1) % images.length);
  const prevImg = () => setImgIndex(i => (i - 1 + images.length) % images.length);

  return (
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
              className="w-full h-full object-cover"
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
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full glass text-gold-500 border border-gold-500/30">
                {CATEGORY_MAP[product.category] || product.category}
              </span>
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
                className="flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-dark-950 font-semibold hover:shadow-lg hover:shadow-gold-500/30 transition-shadow"
              >
                <ShoppingCart size={18} />
                Savatga qo'shish
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
