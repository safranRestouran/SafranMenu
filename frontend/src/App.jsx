import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTelegram } from './hooks/useTelegram';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Splash from './pages/Splash';
import Menu from './pages/menu/Menu';
import Landing from './pages/landing/Landing';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBranding from './pages/admin/AdminBranding';
import AdminPassword from './pages/admin/AdminPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const location = useLocation();
  const { isReady, isTelegram } = useTelegram();
  const { setTheme } = useTheme();
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current && isTelegram) {
      const saved = localStorage.getItem('safran-theme');
      if (!saved) {
        const tg = window.Telegram?.WebApp;
        setTheme(tg?.colorScheme === 'dark' ? 'dark' : 'light');
      }
      initial.current = false;
    }
  }, [isTelegram, setTheme]);

  if (!isReady) return null;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/landing" element={<Landing />} />
        <Route element={<MainLayout />}>
          <Route path="/menu" element={<Menu />} />
        </Route>
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/branding" element={<AdminBranding />} />
          <Route path="/admin/password" element={<AdminPassword />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}