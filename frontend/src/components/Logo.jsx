import { motion } from 'framer-motion';

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`${sizes[size]} relative flex items-center justify-center`}
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.6 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B8962E" />
            </linearGradient>
            <linearGradient id="goldGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFE699" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#goldGrad2)" strokeWidth="1" opacity="0.5" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.7" />
          <text x="50" y="38" textAnchor="middle" fill="url(#goldGrad)" fontFamily="Playfair Display, serif" fontSize="18" fontWeight="bold">S</text>
          <text x="50" y="58" textAnchor="middle" fill="url(#goldGrad)" fontFamily="Playfair Display, serif" fontSize="8" letterSpacing="2">SAFRAN</text>
          <circle cx="50" cy="78" r="4" fill="url(#goldGrad)" opacity="0.6" />
          <line x1="30" y1="78" x2="42" y2="78" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.4" />
          <line x1="58" y1="78" x2="70" y2="78" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.4" />
          <path d="M36 50 Q50 30 64 50 Q50 70 36 50Z" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.5" />
        </svg>
      </motion.div>
      {showText && (
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-display gold-text font-bold">
            SAFRAN
          </h1>
          <p className="text-xs md:text-sm text-gray-400 dark:text-gray-400 tracking-widest uppercase">
            Milliy Taomlar Restorani
          </p>
        </div>
      )}
    </div>
  );
}
