import { motion } from 'framer-motion';
import { CATEGORIES } from '../../../utils/categories';

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('all')}
        className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
          selected === 'all'
            ? 'gold-gradient text-dark-950 shadow-lg shadow-gold-500/25'
            : 'glass text-gray-300 hover:text-white border border-white/10'
        }`}
      >
        Barchasi
      </motion.button>
      {CATEGORIES.map(cat => (
        <motion.button
          key={cat.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(cat.id)}
          className={`flex-shrink-0 flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            selected === cat.id
              ? 'gold-gradient text-dark-950 shadow-lg shadow-gold-500/25'
              : 'glass text-gray-300 hover:text-white border border-white/10'
          }`}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}
