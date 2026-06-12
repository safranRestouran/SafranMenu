import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminPassword() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Yangi parol kamida 6 belgi bo\'lishi kerak');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Yangi parollar mos kelmadi');
      return;
    }
    if (changePassword(currentPassword, newPassword)) {
      toast.success('Parol muvaffaqiyatli o\'zgartirildi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error('Joriy parol noto\'g\'ri');
    }
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-display font-bold text-white mb-8"
      >
        Parolni o'zgartirish
      </motion.h1>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gold-gradient/20 bg-gold-500/10">
              <Key size={24} className="text-gold-500" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-white">Xavfsizlik</h3>
              <p className="text-sm text-gray-400">Admin panel parolini o'zgartiring</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Joriy parol</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Yangi parol</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              placeholder="Kamida 6 belgi"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Yangi parolni takrorlang</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-500/50 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gold-gradient text-dark-950 font-semibold"
          >
            <Save size={18} />
            Parolni saqlash
          </motion.button>
        </form>
      </div>
    </div>
  );
}
