import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTelegram } from './hooks/useTelegram';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Splash from './pages/Splash';
import Menu from './pages/Menu';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBranding from './pages/admin/AdminBranding';
import AdminPassword from './pages/admin/AdminPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const location = useLocation();
  const { isReady, isTelegram, tgTheme } = useTelegram();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (isTelegram) {
      const prefersDark = tgTheme.bg && !tgTheme.bg.startsWith('#f');
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [isTelegram, tgTheme, setTheme]);

  if (!isReady) return null;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
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