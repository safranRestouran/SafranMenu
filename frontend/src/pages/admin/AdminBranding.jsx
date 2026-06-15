import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { uploadImage } from '../../utils/upload';
import toast from 'react-hot-toast';

export default function AdminBranding() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const logoRef = useRef();

  const handleLogoUpload = async (file) => {
    try {
      const url = await uploadImage(file, 'branding');
      setForm(f => ({ ...f, logo: url }));
      toast.success('Logotip yangilandi');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      updateSettings(form);
      toast.success('Sozlamalar saqlandi');
    } catch {
      toast.error('Xatolik');
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
        Branding Sozlamalari
      </motion.h1>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-display font-semibold text-white">Logotip</h3>
          <div className="text-center">
            <img src={form.logo} alt="Logo" className="w-24 h-24 mx-auto rounded-xl object-cover mb-2 bg-white/5" />
            <button
              onClick={() => logoRef.current?.click()}
              className="text-xs text-gold-500 hover:text-gold-400 transition-colors"
            >
              <Upload size={14} className="inline mr-1" />Almashtirish
            </button>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleLogoUpload(e.target.files[0])} />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-display font-semibold text-white">Restoran Ma'lumotlari</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Restoran Nomi</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Tavsif</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Telefon</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Telegram Username</label>
              <input
                type="text"
                value={form.telegram}
                onChange={e => setForm(f => ({ ...f, telegram: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Manzil</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Instagram Link</label>
              <input
                type="url"
                value={form.social?.instagram || ''}
                onChange={e => setForm(f => ({ ...f, social: { ...f.social, instagram: e.target.value } }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Telegram Link</label>
              <input
                type="url"
                value={form.social?.telegram || ''}
                onChange={e => setForm(f => ({ ...f, social: { ...f.social, telegram: e.target.value } }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gold-gradient text-dark-950 font-semibold disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </motion.button>
      </div>
    </div>
  );
}
