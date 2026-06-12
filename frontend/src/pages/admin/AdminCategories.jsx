import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, FolderOpen, Image as ImageIcon, Upload, Save, X, AlertTriangle, Layers, ChevronUp, ChevronDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useProducts } from '../../context/ProductContext';
import { uploadImage, deleteImage } from '../../utils/upload';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const { settings, updateSettings } = useSettings();
  const { products, updateProduct } = useProducts();
  const categories = settings.categories || [];
  
  // States
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newImage, setNewImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Edit states
  const [editingCat, setEditingCat] = useState(null);
  const [editForm, setEditForm] = useState({ id: '', label: '', image: '' });
  const [editUploading, setEditUploading] = useState(false);
  const [editDragOver, setEditDragOver] = useState(false);

  const fileRef = useRef();
  const editFileRef = useRef();

  // Add Category Handler
  const handleAdd = async (e) => {
    e.preventDefault();
    
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

    const newCategory = {
      id: idClean,
      label: labelClean,
      image: newImage || ''
    };

    const updated = [...categories, newCategory];
    await saveCategories(updated, 'Kategoriya muvaffaqiyatli qo\'shildi');
    
    setNewId('');
    setNewLabel('');
    setNewImage('');
  };

  // Delete Category Handler
  const handleDelete = async (id, label, imageUrl) => {
    const productCount = products.filter(p => p.category === id).length;
    
    let confirmMsg = `"${label}" kategoriyasini o'chirishni tasdiqlaysizmi?`;
    if (productCount > 0) {
      confirmMsg = `Diqqat! "${label}" kategoriyasida ${productCount} ta mahsulot bor. O'chirsangiz, bu mahsulotlar kategoriyasiz qoladi. Baribir o'chirilsinmi?`;
    }

    if (window.confirm(confirmMsg)) {
      // If there is an uploaded image, delete it from storage
      if (imageUrl) {
        await deleteImage(imageUrl);
      }
      const updated = categories.filter(c => c.id !== id);
      await saveCategories(updated, 'Kategoriya o\'chirildi');
    }
  };

  // Open Edit Modal
  const openEdit = (cat) => {
    setEditingCat(cat);
    setEditForm({ ...cat });
  };

  // Save Edit Handler
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const newIdClean = editForm.id.trim().toLowerCase().replace(/\s+/g, '-');
    const labelClean = editForm.label.trim();

    if (!newIdClean || !labelClean) {
      toast.error('Kategoriya kodi va nomi to\'ldirilishi shart');
      return;
    }

    const oldId = editingCat.id;
    const isIdChanged = newIdClean !== oldId;

    if (isIdChanged) {
      // Check if new ID already exists in other categories
      if (categories.some(c => c.id === newIdClean && c.id !== oldId)) {
        toast.error('Bu kodli kategoriya allaqachon mavjud');
        return;
      }
    }

    setSaving(true);
    try {
      // If ID changed, migrate products
      if (isIdChanged) {
        const catProducts = products.filter(p => p.category === oldId);
        if (catProducts.length > 0) {
          const proceed = window.confirm(
            `Kategoriya kodi "${oldId}" dan "${newIdClean}" ga o'zgarmoqda.\n` +
            `Ushbu kategoriyaga tegishli ${catProducts.length} ta mahsulot avtomatik tarzda yangi kodga o'tkaziladi. Davom etamizmi?`
          );
          if (!proceed) {
            setSaving(false);
            return;
          }

          toast.loading('Mahsulotlar yangilanmoqda...', { id: 'migration' });
          for (const p of catProducts) {
            await updateProduct(p.id, {
              name: p.name,
              description: p.description || '',
              price: p.price.toString(),
              category: newIdClean,
              images: p.images || []
            });
          }
          toast.success('Barcha mahsulotlar yangi kategoriyaga o\'tkazildi', { id: 'migration' });
        }
      }

      // Now save category updates
      const updated = categories.map(c => 
        c.id === oldId 
          ? { id: newIdClean, label: labelClean, image: editForm.image } 
          : c
      );
      await saveCategories(updated, 'Kategoriya muvaffaqiyatli yangilandi');
      setEditingCat(null);
    } catch (err) {
      toast.error('Tahrirlashda xatolik yuz berdi: ' + err.message, { id: 'migration' });
    } finally {
      setSaving(false);
    }
  };

  // Image upload helpers
  const handleImageFile = async (file, isEdit = false) => {
    const typeOk = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    const sizeOk = file.size <= 3 * 1024 * 1024;
    
    if (!typeOk) {
      toast.error('Faqat JPG, PNG yoki WEBP formatdagi rasmlar qabul qilinadi');
      return;
    }
    if (!sizeOk) {
      toast.error('Rasm hajmi 3MB dan oshmasligi kerak');
      return;
    }

    if (isEdit) setEditUploading(true);
    else setUploading(true);

    try {
      const url = await uploadImage(file, 'categories');
      if (isEdit) {
        setEditForm(f => ({ ...f, image: url }));
      } else {
        setNewImage(url);
      }
      toast.success('Rasm muvaffaqiyatli yuklandi');
    } catch (err) {
      toast.error(err.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      if (isEdit) setEditUploading(false);
      else setUploading(false);
    }
  };

  const removeCategoryImage = async (isEdit = false) => {
    const url = isEdit ? editForm.image : newImage;
    if (!url) return;

    if (window.confirm('Rasmni o\'chirishni tasdiqlaysizmi?')) {
      await deleteImage(url);
      if (isEdit) {
        setEditForm(f => ({ ...f, image: '' }));
      } else {
        setNewImage('');
      }
      toast.success('Rasm o\'chirildi');
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

  const moveCategory = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    await saveCategories(updated, "Kategoriyalar tartibi o'zgartirildi");
  };

  // Stats calculation
  const totalCats = categories.length;
  const customImagesCount = categories.filter(c => c.image).length;
  const emptyCatsCount = categories.filter(c => products.filter(p => p.category === c.id).length === 0).length;

  const statsCards = [
    { icon: Layers, label: 'Jami Kategoriyalar', value: totalCats, color: 'from-gold-500/20 to-gold-500/5' },
    { icon: ImageIcon, label: 'Rasmli Kategoriyalar', value: customImagesCount, color: 'from-blue-500/20 to-blue-500/5' },
    { icon: AlertTriangle, label: 'Bo\'sh Kategoriyalar', value: emptyCatsCount, color: 'from-amber-500/20 to-amber-500/5' },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-display font-bold text-white mb-8"
      >
        Kategoriyalarni Boshqarish
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statsCards.map((card, i) => {
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
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

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
                Faqat kichik harflar va chiziqcha. ID keyinchalik o'zgartirilmaydi.
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                Kategoriya Nomi
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="masalan: Yengil Salatlar"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none text-sm"
              />
            </div>

            {/* Category Image Upload */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Rasm (Ixtiyoriy)</label>
              {newImage ? (
                <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/40">
                  <img src={newImage} alt="Kategoriya rasmi" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeCategoryImage(false)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 text-sm font-semibold gap-1.5"
                  >
                    <Trash2 size={16} /> O'chirish
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleImageFile(e.dataTransfer.files[0], false); }}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    dragOver ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 hover:border-gold-500/30'
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => e.target.files[0] && handleImageFile(e.target.files[0], false)}
                  />
                  <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-400">Rasm yuklash yoki sudrab tashlash</p>
                </div>
              )}

              {uploading && (
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="h-full w-1/2 gold-gradient rounded-full"
                  />
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving || uploading}
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
              {categories.map((c, idx) => {
                const productCount = products.filter(p => p.category === c.id).length;
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                        {c.image ? (
                          <img src={c.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FolderOpen size={20} className="text-gold-500/60" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.label}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {c.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                      {/* Move Up/Down Controls */}
                      <div className="flex flex-col -space-y-0.5">
                        <button
                          type="button"
                          onClick={() => moveCategory(idx, 'up')}
                          disabled={idx === 0 || saving}
                          className="p-0.5 rounded hover:bg-white/5 text-gray-500 hover:text-gold-500 disabled:opacity-10 disabled:pointer-events-none transition-colors"
                          title="Tepaga siljitish"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCategory(idx, 'down')}
                          disabled={idx === categories.length - 1 || saving}
                          className="p-0.5 rounded hover:bg-white/5 text-gray-500 hover:text-gold-500 disabled:opacity-10 disabled:pointer-events-none transition-colors"
                          title="Pastga siljitish"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                        {productCount} ta mahsulot
                      </span>
                      
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
                        title="Tahrirlash"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id, c.label, c.image)}
                        disabled={saving}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Analytics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mt-8"
      >
        <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Layers className="text-gold-500" size={20} />
          Kategoriyalar Tahlili & Moliyaviy Ko'rsatkichlar
        </h3>
        
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">Tahlil qilish uchun kategoriyalar mavjud emas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Kategoriya</th>
                  <th className="py-3 px-4 text-center">Taomlar Soni</th>
                  <th className="py-3 px-4">Menu Ulushi</th>
                  <th className="py-3 px-4">O'rtacha Narx</th>
                  <th className="py-3 px-4">Narxlar Oralig'i</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {categories.map(c => {
                  const catProducts = products.filter(p => p.category === c.id);
                  const count = catProducts.length;
                  const percent = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                  
                  const prices = catProducts.map(p => Number(p.price || 0));
                  const avgPrice = count > 0 
                    ? Math.round(prices.reduce((sum, pr) => sum + pr, 0) / count)
                    : 0;
                  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

                  const formatVal = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(val);

                  return (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">
                        {c.label}
                        <span className="block text-[10px] text-gray-500 font-mono">ID: {c.id}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{count} ta</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-xs font-mono">{percent}%</span>
                          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full gold-gradient rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gold-500 font-semibold font-mono">
                        {count > 0 ? formatVal(avgPrice) : "—"}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-400 font-mono">
                        {count > 0 ? `${formatVal(minPrice)} - ${formatVal(maxPrice)}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditingCat(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="w-full max-w-md glass-card p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-white">
                    Kategoriyani tahrirlash
                  </h2>
                  <button onClick={() => setEditingCat(null)} className="p-1 rounded-lg hover:bg-white/10 text-gray-400">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Kategoriya Kodi (ID)</label>
                    <input
                      type="text"
                      value={editForm.id}
                      onChange={e => setEditForm(f => ({ ...f, id: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none text-sm"
                      placeholder="kategoriya-kodi"
                    />
                    <p className="text-[10px] text-amber-500 mt-1">
                      Kodni o'zgartirsangiz, ushbu kategoriyadagi barcha mahsulotlar ham avtomatik ravishda yangi kodga o'tkaziladi.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Nomi</label>
                    <input
                      type="text"
                      value={editForm.label}
                      onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none text-sm"
                      placeholder="Kategoriya nomi"
                    />
                  </div>

                  {/* Image Edit Section */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Kategoriya Rasmi</label>
                    {editForm.image ? (
                      <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/40">
                        <img src={editForm.image} alt="Kategoriya rasmi" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeCategoryImage(true)}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 text-sm font-semibold gap-1.5"
                        >
                          <Trash2 size={16} /> Rasmni o'chirish
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={e => { e.preventDefault(); setEditDragOver(true); }}
                        onDragLeave={() => setEditDragOver(false)}
                        onDrop={e => { e.preventDefault(); setEditDragOver(false); e.dataTransfer.files[0] && handleImageFile(e.dataTransfer.files[0], true); }}
                        onClick={() => editFileRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                          editDragOver ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 hover:border-gold-500/30'
                        }`}
                      >
                        <input
                          ref={editFileRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={e => e.target.files[0] && handleImageFile(e.target.files[0], true)}
                        />
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-400">Yangi rasm yuklash yoki tashlang</p>
                      </div>
                    )}

                    {editUploading && (
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="h-full w-1/2 gold-gradient rounded-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingCat(null)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-colors"
                    >
                      Bekor qilish
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={saving || editUploading}
                      className="flex-1 py-2.5 rounded-xl gold-gradient text-dark-950 font-semibold text-sm disabled:opacity-50"
                    >
                      <Save size={16} className="inline mr-1" />
                      Saqlash
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
