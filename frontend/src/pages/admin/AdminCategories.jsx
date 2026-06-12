import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, FolderOpen, Image as ImageIcon, Upload, Save, X, AlertTriangle, Layers } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useProducts } from '../../context/ProductContext';
import { uploadImage, deleteImage } from '../../utils/upload';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const { settings, updateSettings } = useSettings();
  const { products } = useProducts();
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
    if (!editForm.label.trim()) {
      toast.error('Kategoriya nomi bo\'sh bo\'lmasligi kerak');
      return;
    }

    const updated = categories.map(c => c.id === editingCat.id ? { ...c, label: editForm.label.trim(), image: editForm.image } : c);
    await saveCategories(updated, 'Kategoriya yangilandi');
    setEditingCat(null);
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
                    
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
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
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">ID (O'zgartirib bo'lmaydi)</label>
                    <input
                      type="text"
                      value={editForm.id}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-500 text-sm focus:outline-none"
                    />
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
