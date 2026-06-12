import { useState, useEffect } from 'react';

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [tg, setTg] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    try {
      if (window.Telegram?.WebApp) {
        const webapp = window.Telegram.WebApp;
        webapp.ready();
        webapp.expand();
        setTg(webapp);
      }
    } catch { /* not in telegram */ }

    return () => clearTimeout(timer);
  }, []);

  const theme = tg?.colorScheme || 'dark';
  const tgTheme = {
    bg: tg?.themeParams?.bg_color || '#0f172a',
    text: tg?.themeParams?.text_color || '#ffffff',
    hint: tg?.themeParams?.hint_color || '#94a3b8',
    link: tg?.themeParams?.link_color || '#D4AF37',
    button: tg?.themeParams?.button_color || '#D4AF37',
    buttonText: tg?.themeParams?.button_text_color || '#0f172a',
    secondaryBg: tg?.themeParams?.secondary_bg_color || '#1e293b',
  };

  return { isReady, tg, theme, tgTheme, isTelegram: !!tg };
}
