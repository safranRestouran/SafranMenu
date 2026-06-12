import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ value, onChange, placeholder = 'Taomlarni qidirish...' }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-xl glass text-white placeholder-gray-400 border border-white/10 focus:border-gold-500/50 focus:outline-none transition-colors"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400"
        >
          <X size={16} />
        </motion.button>
      )}
    </div>
  );
}
