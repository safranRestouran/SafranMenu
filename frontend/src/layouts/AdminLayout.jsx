import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Palette, Key, LogOut, ArrowLeft,
} from 'lucide-react';

const NAV = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Mahsulotlar', icon: Package },
  { path: '/admin/branding', label: 'Branding', icon: Palette },
  { path: '/admin/password', label: 'Parol', icon: Key },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <aside className="hidden md:flex flex-col w-64 bg-dark-900 border-r border-gold-500/10 p-4">
        <div className="mb-8 text-center pt-4">
          <h2 className="text-xl font-display gold-text font-bold">SAFRAN</h2>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'gold-gradient text-dark-950 shadow-lg shadow-gold-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 pt-4 border-t border-white/10">
          <Link to="/menu">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft size={18} />
              Saytga qaytish
            </motion.div>
          </Link>
          <button onClick={handleLogout} className="w-full">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              Chiqish
            </motion.div>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-lg border-t border-gold-500/10">
        <div className="flex items-center justify-around py-2 px-2">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center gap-0.5">
                <div className={`p-2 rounded-lg ${isActive ? 'gold-gradient text-dark-950' : 'text-gray-400'}`}>
                  <Icon size={16} />
                </div>
                <span className={`text-[10px] ${isActive ? 'text-gold-500' : 'text-gray-500'}`}>{item.label}</span>
              </Link>
            );
          })}
          <button onClick={handleLogout} className="flex flex-col items-center gap-0.5">
            <div className="p-2 rounded-lg text-red-400"><LogOut size={16} /></div>
            <span className="text-[10px] text-gray-500">Chiqish</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
