import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
      <Header />
      <main className="pt-20 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
