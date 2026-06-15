import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const SETTINGS_KEY = 'safran-settings';
const DEFAULT_SETTINGS = {
  name: 'SAFRAN',
  description: 'Milliy Taomlar Restorani',
  phone: '+998973624755',
  phone2: '+998886001700',
  telegram: 'SafranMenu_bot',
  address: 'Xorazm Xazorasp',
  logo: '/logo.png',
  favicon: '/favicon.svg',
  social: {
    instagram: 'https://instagram.com/safran_kafe_',
    telegram: 'https://t.me/SafranMenu_bot',
  },
  categories: [
    { id: 'mangal', label: 'Mangal' },
    { id: 'milliy-taomlar', label: 'Milliy Taomlar' },
    { id: 'ichimliklar', label: 'Ichimliklar' },
    { id: 'shirinliklar', label: 'Shirinliklar' },
    { id: 'salatlar', label: 'Salatlar' },
  ],
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.phone === '+998901234567') {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
          return DEFAULT_SETTINGS;
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (settings.favicon) {
      const link = document.querySelector('link[rel="icon"]');
      if (link) link.href = settings.favicon;
    }
    document.title = `${settings.name} - ${settings.description}`;
  }, [settings]);

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) {
        const categories = data.social?.categories || DEFAULT_SETTINGS.categories;
        const merged = { ...DEFAULT_SETTINGS, ...data, categories };
        setSettings(merged);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      }
    } catch { /* use local */ }
  }, []);

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

    const dbData = { ...updated };
    dbData.social = {
      ...updated.social,
      categories: updated.categories
    };
    delete dbData.categories;

    try {
      await supabase.from('settings').upsert({ id: 1, ...dbData });
    } catch { /* offline */ }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
