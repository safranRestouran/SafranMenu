import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl, truncate } from '../utils/helpers';
import { CATEGORY_MAP } from '../utils/categories';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, index = 0, onView }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass-card group cursor-pointer overflow-hidden"
      onClick={() => onView?.(product)}
    >
      <div className="relative h-48 md:h-56 overflow-hidden">
        <motion.img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          whileHover={{ scale: 1.1 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-medium rounded-full glass text-gold-500 border border-gold-500/30">
            {CATEGORY_MAP[product.category] || product.category}
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
      </div>
      <div className="p-4">
        <h3 className="text-lg font-display font-semibold text-white mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
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
            className="flex items-center gap-2 px-4 py-2 rounded-full gold-gradient text-dark-950 text-sm font-medium hover:shadow-lg hover:shadow-gold-500/25 transition-shadow"
          >
            <ShoppingCart size={16} />
            Savat
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
