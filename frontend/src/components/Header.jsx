import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Phone, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-gold-500/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/menu" className="flex items-center gap-3">
            <img src={settings.logo} alt="SAFRAN" className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-display font-bold gold-text leading-none">{settings.name}</h1>
              <p className="text-[10px] text-gray-500 tracking-wider">{settings.description}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-gold-500 transition-colors"
              title="Admin panel"
            >
              <Shield size={18} />
            </Link>
            <a
              href={`tel:${settings.phone}`}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-gold-500 transition-colors"
            >
              <Phone size={18} />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-gold-500 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
