import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FolderOpen, AlertCircle, Save } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useProducts } from '../../context/ProductContext';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const { settings, updateSettings } = useSettings();
  const { products } = useProducts();
  const categories = settings.categories || [];
  
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    
    // Validate key
    const idClean = newId.trim().toLowerCase().replace(/\s+/g, '-');
    const labelClean = newLabel.trim();

    if (!idClean || !labelClean) {
      toast.error('Kategoriya kodi va nomi to\'ldirilishi shart');
      return;
    }

    if (categories.some(c => c.id === idClean)) {
      toast.error('Bu kodli kategoriya allaqachon mavjud');
      return;
    }

    const updated = [...categories, { id: idClean, label: labelClean }];
    saveCategories(updated, 'Kategoriya qo\'shildi');
    
    setNewId('');
    setNewLabel('');
  };

  const handleDelete = (id, label) => {
    // Check if there are products in this category
    const productCount = products.filter(p => p.category === id).length;
    
    let confirmMsg = `"${label}" kategoriyasini o'chirishni tasdiqlaysizmi?`;
    if (productCount > 0) {
      confirmMsg = `Diqqat! "${label}" kategoriyasida ${productCount} ta mahsulot bor. O'chirsangiz, bu mahsulotlar kategoriyasiz qoladi. Baribir o'chirilsinmi?`;
    }

    if (window.confirm(confirmMsg)) {
      const updated = categories.filter(c => c.id !== id);
      saveCategories(updated, 'Kategoriya o\'chirildi');
    }
  };

  const saveCategories = async (updatedList, successMsg) => {
    setSaving(true);
    try {
      await updateSettings({ categories: updatedList });
      toast.success(successMsg);
    } catch (err) {
      toast.error('Saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-display font-bold text-white mb-8"
      >
        Kategoriyalarni Boshqarish
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Category Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 h-fit"
        >
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Yangi kategoriya qo'shish
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                Kategoriya Kodi (ID)
              </label>
              <input
                type="text"
                value={newId}
                onChange={e => setNewId(e.target.value)}
                placeholder="masalan: salatlar"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none text-sm"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Kichik harflarda, bo'shliqlarsiz yoziladi (bo'shliqlar o'rniga chiziqcha ishlatiladi).
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                Kategoriya Nomi (Label)
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="masalan: Yengil Salatlar"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none text-sm"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Menyuda va saytda foydalanuvchiga ko'rinadigan nomi.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl gold-gradient text-dark-950 font-semibold text-sm disabled:opacity-50"
            >
              <Plus size={16} />
              Qo'shish
            </motion.button>
          </form>
        </motion.div>

        {/* Categories List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Mavjud kategoriyalar ({categories.length})
          </h3>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen size={40} className="mx-auto mb-2 opacity-30" />
              <p>Kategoriyalar mavjud emas</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              <AnimatePresence>
                {categories.map((c, idx) => {
                  const productCount = products.filter(p => p.category === c.id).length;
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.label}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {c.id}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                          {productCount} ta mahsulot
                        </span>
                        
                        <button
                          onClick={() => handleDelete(c.id, c.label)}
                          disabled={saving}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Kategoriyani o'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
