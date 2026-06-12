import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useLanguage } from '../../../context/LanguageContext';
import { formatPrice, getImageUrl } from '../../../utils/helpers';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount } = useCart();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-dark-950/95 backdrop-blur-xl border-l border-gold-500/20 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-gold-500" />
                <h2 className="text-lg font-display font-semibold text-white">
                  {t('cart_title')} ({getItemCount()})
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-gray-400">
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                <ShoppingBag size={48} className="text-gold-500/30" />
                <p className="text-lg">{t('cart_empty')}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <img
                        src={getImageUrl(item.images?.[0])}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                        <p className="text-sm gold-text font-semibold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium text-white w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto p-1 rounded-md text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{t('cart_total')}:</span>
                    <span className="text-2xl font-bold gold-text">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
                    >
                      {t('cart_clear')}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl gold-gradient text-dark-950 text-sm font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-shadow"
                    >
                      {t('cart_close')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
