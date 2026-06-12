import { motion } from 'framer-motion';
import { Package, FolderOpen, Clock, HardDrive } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminDashboard() {
  const { products, getStats } = useProducts();
  const { settings } = useSettings();
  const categories = settings.categories || [];
  const stats = getStats();

  const cards = [
    { icon: Package, label: 'Jami Mahsulotlar', value: stats.total, color: 'from-gold-500/20 to-gold-500/5' },
    { icon: FolderOpen, label: 'Kategoriyalar', value: stats.categories, color: 'from-blue-500/20 to-blue-500/5' },
    { icon: Clock, label: 'Oxirgi qo\'shilgan', value: stats.lastAdded?.name || 'Yo\'q', color: 'from-green-500/20 to-green-500/5' },
    { icon: HardDrive, label: 'Saqlash hajmi', value: `${products.reduce((s, p) => s + (p.images?.length || 0), 0)} ta rasm`, color: 'from-purple-500/20 to-purple-500/5' },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-display font-bold text-white mb-8"
      >
        Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-5 bg-gradient-to-br ${card.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="text-gold-500" size={22} />
              </div>
              <p className="text-2xl font-bold text-white">{typeof card.value === 'number' ? card.value : card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-display font-semibold text-white mb-4">Kategoriyalar bo'yicha</h3>
          <div className="space-y-3">
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.id).length;
              const max = Math.max(1, ...categories.map(c => products.filter(p => p.category === c.id).length));
              const pct = max > 0 ? (count / max) * 100 : 0;
              return (
                <div key={cat.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{cat.label}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full rounded-full gold-gradient"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-display font-semibold text-white mb-4">So'nggi mahsulotlar</h3>
          {products.slice(0, 5).length === 0 ? (
            <p className="text-gray-500 text-sm">Hali mahsulot yo'q</p>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <span className="text-sm gold-text font-semibold">
                    {new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(p.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
