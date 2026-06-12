import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const SETTINGS_KEY = 'safran-settings';
const DEFAULT_SETTINGS = {
  name: 'SAFRAN',
  description: 'Milliy Taomlar Restorani',
  phone: '+998901234567',
  telegram: 'safran_restaurant',
  address: 'Toshkent sh., Amir Temur ko\'chasi, 100',
  logo: '/logo.svg',
  favicon: '/favicon.svg',
  social: {
    instagram: '',
    telegram: 'https://t.me/safran_restaurant',
  },
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
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
        const merged = { ...DEFAULT_SETTINGS, ...data };
        setSettings(merged);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      }
    } catch { /* use local */ }
  }, []);

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    try {
      await supabase.from('settings').upsert({ id: 1, ...updated });
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
