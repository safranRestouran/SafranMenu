import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [tg, setTg] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const webapp = window.Telegram?.WebApp;
    if (webapp) {
      webapp.ready();
      webapp.expand();
      try { webapp.enableClosingConfirmation?.(); } catch {}
      setTg(webapp);

      webapp.onEvent('themeChanged', () => {
        applyTheme(webapp);
      });

      applyTheme(webapp);
      setIsReady(true);
    } else {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // BackButton navigation
  useEffect(() => {
    if (!tg) return;
    if (location.pathname !== '/menu' && location.pathname !== '/') {
      tg.BackButton.show();
      tg.BackButton.onClick(() => navigate(-1));
    } else {
      tg.BackButton.hide();
    }
  }, [location.pathname, tg, navigate]);

  const setMainButton = useCallback((config) => {
    if (!tg) return;
    try {
      const btn = tg.MainButton;
      if (!config) { btn.hide(); return; }
      btn.setText(config.text || '');
      config.color && (btn.color = config.color);
      config.textColor && (btn.textColor = config.textColor);
      config.onClick && btn.onClick(config.onClick);
      config.progress ? btn.showProgress() : btn.hideProgress();
      btn.show();
    } catch {}
  }, [tg]);

  const showAlert = useCallback((msg) => {
    if (tg) { try { tg.showAlert(msg); } catch { alert(msg); } }
    else { alert(msg); }
  }, [tg]);

  const showConfirm = useCallback((msg) => {
    return new Promise((resolve) => {
      if (tg) { try { tg.showConfirm(msg, resolve); } catch { resolve(confirm(msg)); } }
      else { resolve(confirm(msg)); }
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
    setMainButton,
    showAlert,
    showConfirm,
    user: tg?.initDataUnsafe?.user || null,
    startParam: tg?.initDataUnsafe?.start_param || null,
  };
}

function applyTheme(webapp) {
  const params = webapp.themeParams;
  if (!params) return;
  const root = document.documentElement;
  root.style.setProperty('--tg-bg', params.bg_color || '#0f172a');
  root.style.setProperty('--tg-text', params.text_color || '#ffffff');
  root.style.setProperty('--tg-hint', params.hint_color || '#94a3b8');
  root.style.setProperty('--tg-link', params.link_color || '#D4AF37');
  root.style.setProperty('--tg-button', params.button_color || '#D4AF37');
  root.style.setProperty('--tg-button-text', params.button_text_color || '#0f172a');
  root.style.setProperty('--tg-secondary-bg', params.secondary_bg_color || '#1e293b');
}