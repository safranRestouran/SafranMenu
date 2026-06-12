import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function MainLayout() {
  const { getItemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const count = getItemCount();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
      <Header />
      <main className="pt-20 pb-16">
        <Outlet />
      </main>

      <AnimatePresence>
        {count > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-3.5 rounded-full gold-gradient text-dark-950 font-semibold shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 transition-shadow"
          >
            <div className="relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-dark-950 text-gold-500 text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            </div>
            <span>Savat</span>
          </motion.button>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
