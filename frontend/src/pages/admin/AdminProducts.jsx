import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Search, X, Upload, Image as ImageIcon,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';
import { uploadImage, uploadImages } from '../../utils/upload';
import toast from 'react-hot-toast';
import ImageCropperModal from '../../components/ImageCropperModal';

const EMPTY_FORM = { name: '', description: '', price: '', category: 'mangal', images: [] };

export default function AdminProducts() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings } = useSettings();
  const categories = settings.categories || [];
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cropper states
  const [cropQueue, setCropQueue] = useState([]);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [cropperOpen, setCropperOpen] = useState(false);

  const fileRef = useRef();

  useEffect(() => {
    if (cropQueue.length > 0 && !cropperOpen) {
      const file = cropQueue[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, [cropQueue, cropperOpen]);

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      images: product.images || [],
    });
    setShowForm(true);
  };

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(f => {
      const typeOk = ['image/jpeg', 'image/png', 'image/webp'].includes(f.type);
      const sizeOk = f.size <= 5 * 1024 * 1024;
      if (!typeOk) toast.error(`${f.name} - noto'g'ri format (JPG/PNG/WEBP)`);
      if (!sizeOk) toast.error(`${f.name} - 5MB dan katta`);
      return typeOk && sizeOk;
    });
    if (!validFiles.length) return;

    setCropQueue(prev => [...prev, ...validFiles]);
  };

  const handleCropComplete = async (croppedFile) => {
    setCropperOpen(false);
    setUploading(true);
    setUploadProgress(20);

    try {
      const url = await uploadImage(croppedFile, form.category);
      setForm(f => ({ ...f, images: [...f.images, url] }));
      toast.success('Rasm qirqildi va yuklandi');
    } catch (err) {
      toast.error(err.message || 'Rasm yuklashda xatolik');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setCropQueue(prev => prev.slice(1));
    }
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setCropQueue(prev => prev.slice(1));
  };

  const removeImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name || !form.price) {
      toast.error('Nom va narx majburiy');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await updateProduct(editing.id, form);
      } else {
        await addProduct(form);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditing(null);
    } catch { /* handled in context */ }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`"${product.name}" ni o'chirishni tasdiqlaysizmi?`)) {
      await deleteProduct(product.id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-display font-bold text-white"
        >
          Mahsulotlar ({products.length})
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl gold-gradient text-dark-950 font-medium text-xs sm:text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Yangi mahsulot</span>
          <span className="sm:hidden">Qo'shish</span>
        </motion.button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Mahsulot qidirish..."
          className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm sm:text-base focus:border-gold-500/50 focus:outline-none transition-colors"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 skeleton rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Mahsulot topilmadi</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map(p => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <img
                  src={p.images?.[0] || '/placeholder.svg'}
                  alt={p.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">
                    {categories.find(c => c.id === p.category)?.label || p.category}
                  </p>
                </div>
                <span className="text-sm gold-text font-semibold">
                  {new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(p.price)}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gold-500 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-white">
                    {editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-white/10 text-gray-400">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Nomi</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none"
                      placeholder="Mahsulot nomi"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Kategoriya</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id} className="bg-dark-900">{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Narx (UZS)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Tavsif</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold-500/50 focus:outline-none resize-none"
                      placeholder="Mahsulot haqida..."
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Rasmlar</label>
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        dragOver ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 hover:border-gold-500/30'
                      }`}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={e => handleFiles(e.target.files)}
                      />
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400">Rasmlarni tashlang yoki tanlang</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP | 5MB gacha</p>
                    </div>

                    {uploading && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Yuklanmoqda...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full rounded-full gold-gradient"
                          />
                        </div>
                      </div>
                    )}

                    {form.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.images.map((url, i) => (
                          <div key={i} className="relative group">
                            <img src={url} alt="" className="w-14 sm:w-16 h-14 sm:h-16 rounded-lg object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2 sm:py-2.5 rounded-xl border border-white/10 text-gray-300 text-xs sm:text-sm hover:bg-white/5 transition-colors"
                    >
                      Bekor qilish
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={uploading || submitting}
                      className="flex-1 py-2 sm:py-2.5 rounded-xl gold-gradient text-dark-950 font-semibold text-xs sm:text-sm disabled:opacity-50"
                    >
                      {uploading ? 'Yuklanmoqda...' : submitting ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropImageSrc}
        onClose={handleCropCancel}
        onCrop={handleCropComplete}
        defaultAspect={1}
      />
    </div>
  );
}
