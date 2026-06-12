import { Phone, MapPin, Send, Instagram } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-dark-900 border-t border-gold-500/10">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <img src={settings.logo} alt="SAFRAN" className="w-12 h-12 mx-auto md:mx-0 mb-3" />
            <h3 className="text-xl font-display font-bold gold-text">{settings.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{settings.description}</p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Aloqa</h4>
            <div className="space-y-3">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors justify-center md:justify-start">
                <Phone size={16} />
                <span className="text-sm">{settings.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
                <MapPin size={16} />
                <span className="text-sm">{settings.address}</span>
              </div>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Ijtimoiy Tarmoqlar</h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {settings.social?.telegram && (
                <a href={settings.social.telegram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass text-gray-400 hover:text-gold-500 hover:border-gold-500/30 transition-all">
                  <Send size={18} />
                </a>
              )}
              {settings.social?.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass text-gray-400 hover:text-gold-500 hover:border-gold-500/30 transition-all">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {settings.address && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-gold-500/10 h-48">
            <iframe
              title="Manzil"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        )}

        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {settings.name}. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
