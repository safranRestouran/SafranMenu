import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Moon, Sun, Menu, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { getItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const itemCount = getItemCount();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-gold-500/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/menu" className="flex items-center gap-3">
            <img src={settings.logo} alt="SAFRAN" className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-display font-bold gold-text leading-none">{settings.name}</h1>
              <p className="text-[10px] text-gray-500 tracking-wider">{settings.description}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${settings.phone}`}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-gold-500 transition-colors"
            >
              <Phone size={18} />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-gold-500 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-gold-500 transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gold-gradient text-dark-950 text-[10px] font-bold flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
