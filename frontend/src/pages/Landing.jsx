import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Phone, MapPin, Send, Instagram, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Landing() {
  const { settings } = useSettings();
  const [activeLang, setActiveLang] = useState('UZ');

  const phoneLink = `tel:${settings.phone}`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  const botUsername = settings.telegram ? settings.telegram.replace('@', '') : 'safran_restaurant';
  const telegramBotLink = `https://t.me/${botUsername}_bot`;
  const instagramLink = settings.social?.instagram || 'https://instagram.com/safran_restaurant';
  const telegramChannelLink = settings.social?.telegram || `https://t.me/${botUsername}`;

  const languages = ['UZ', 'RU', 'EN'];

  const buttonClass = (isPrimary) => 
    `w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group border ${
      isPrimary 
        ? 'bg-gradient-to-r from-gold-500/20 via-amber-500/10 to-gold-500/20 border-gold-500/30 shadow-lg shadow-gold-500/5' 
        : 'bg-white/5 border-white/10'
    }`;

  const iconWrapperClass = (isPrimary) => 
    `w-11 h-11 rounded-full flex items-center justify-center border transition-transform duration-500 group-hover:rotate-12 ${
      isPrimary 
        ? 'bg-gold-500/20 border-gold-500/40 text-gold-500 shadow shadow-gold-500/10' 
        : 'bg-white/5 border-white/10 text-gray-300 group-hover:text-white'
    }`;

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-x-hidden"
      style={{
        backgroundImage: `url('/safran-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center justify-between min-h-screen text-white">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mt-6 w-full">
          {/* Circular Logo with golden glow */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-r from-gold-500 to-amber-600 shadow-lg shadow-gold-500/20"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-dark-950 flex items-center justify-center">
              <img 
                src={settings.logo || '/logo.svg'} 
                alt="Logo" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23D4AF37" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
                }}
              />
            </div>
          </motion.div>

          {/* Restaurant Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-display font-bold mt-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 drop-shadow-md"
          >
            {settings.name || 'SAFRAN'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-300 font-medium tracking-wide mt-1"
          >
            {settings.description || 'Milliy Taomlar Restorani'}
          </motion.p>

          {/* Language badge selectors (interactive) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mt-4 text-[10px] font-bold tracking-wider"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-2.5 py-1 rounded transition-all duration-300 ${
                  activeLang === lang 
                    ? 'bg-gold-500 text-dark-950 shadow shadow-gold-500/30' 
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </motion.div>

          {/* Inline social icons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mt-5"
          >
            <a 
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-500 hover:border-gold-500/30 hover:bg-gold-500/10 transition-all active:scale-95"
            >
              <Instagram size={16} />
            </a>
            <a 
              href={phoneLink}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-500 hover:border-gold-500/30 hover:bg-gold-500/10 transition-all active:scale-95"
            >
              <Phone size={16} />
            </a>
            <a 
              href={telegramChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-500 hover:border-gold-500/30 hover:bg-gold-500/10 transition-all active:scale-95"
            >
              <Send size={16} />
            </a>
          </motion.div>
        </div>

        {/* Buttons List Section */}
        <div className="w-full space-y-4 my-8">
          {/* 1. Menu Link (Client-side navigate) */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <Link 
              to="/menu"
              className={buttonClass(true)}
            >
              <div className="flex items-center gap-4">
                <div className={iconWrapperClass(true)}>
                  <UtensilsCrossed size={20} />
                </div>
                <span className="font-semibold text-base tracking-wide text-left text-gray-100 group-hover:text-white transition-colors">
                  Menyuni Ko'rish
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all">
                <ArrowRight size={18} />
              </div>
            </Link>
          </motion.div>

          {/* 2. Phone Link */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          >
            <a 
              href={phoneLink}
              className={buttonClass(false)}
            >
              <div className="flex items-center gap-4">
                <div className={iconWrapperClass(false)}>
                  <Phone size={20} />
                </div>
                <span className="font-semibold text-base tracking-wide text-left text-gray-100 group-hover:text-white transition-colors">
                  Telefon Qilish
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all">
                <ArrowRight size={18} />
              </div>
            </a>
          </motion.div>

          {/* 3. Location Link */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
          >
            <a 
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass(false)}
            >
              <div className="flex items-center gap-4">
                <div className={iconWrapperClass(false)}>
                  <MapPin size={20} />
                </div>
                <span className="font-semibold text-base tracking-wide text-left text-gray-100 group-hover:text-white transition-colors">
                  Joylashuv (Manzil)
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all">
                <ArrowRight size={18} />
              </div>
            </a>
          </motion.div>

          {/* 4. Telegram Bot Link */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
          >
            <a 
              href={telegramBotLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass(false)}
            >
              <div className="flex items-center gap-4">
                <div className={iconWrapperClass(false)}>
                  <Send size={20} />
                </div>
                <span className="font-semibold text-base tracking-wide text-left text-gray-100 group-hover:text-white transition-colors">
                  Telegram Bot
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all">
                <ArrowRight size={18} />
              </div>
            </a>
          </motion.div>

          {/* 5. Instagram Link */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
          >
            <a 
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass(false)}
            >
              <div className="flex items-center gap-4">
                <div className={iconWrapperClass(false)}>
                  <Instagram size={20} />
                </div>
                <span className="font-semibold text-base tracking-wide text-left text-gray-100 group-hover:text-white transition-colors">
                  Instagram Profil
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all">
                <ArrowRight size={18} />
              </div>
            </a>
          </motion.div>
        </div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mb-4 w-full"
        >
          {/* Glass pill for contact & working hours */}
          <div className="inline-block px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner">
            <p className="text-xs font-medium tracking-wide text-gray-400">
              <span className="text-gray-300 font-semibold">{settings.phone}</span>
              <span className="mx-2.5 text-gray-600">•</span>
              <span>Har kuni 10:00 - 23:00</span>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
