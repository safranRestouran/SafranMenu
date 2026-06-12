import { useState, useEffect, useCallback } from 'react';

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
        try { webapp.enableClosingConfirmation?.(); } catch {} // 6.0+
        setTg(webapp);
      }
    } catch { /* not in telegram */ }

    return () => clearTimeout(timer);
  }, []);

  const setBackButton = useCallback((show, callback) => {
    if (!tg) return;
    try {
      if (show) {
        tg.BackButton.show();
        tg.BackButton.onClick(callback);
      } else {
        tg.BackButton.hide();
        tg.BackButton.offClick(callback);
      }
    } catch { /* ignore */ }
  }, [tg]);

  const showAlert = useCallback((msg) => {
    if (tg) {
      try { tg.showAlert(msg); } catch { alert(msg); }
    } else {
      alert(msg);
    }
  }, [tg]);

  const showConfirm = useCallback((msg) => {
    return new Promise((resolve) => {
      if (tg) {
        try { tg.showConfirm(msg, resolve); } catch { resolve(confirm(msg)); }
      } else {
        resolve(confirm(msg));
      }
    });
  }, [tg]);

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

  return {
    isReady,
    tg,
    theme,
    tgTheme,
    isTelegram: !!tg,
    setBackButton,
    showAlert,
    showConfirm,
    user: tg?.initDataUnsafe?.user || null,
    startParam: tg?.initDataUnsafe?.start_param || null,
  };
}