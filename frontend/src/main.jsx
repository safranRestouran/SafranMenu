import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              <ProductProvider>
                <CartProvider>
                  <App />
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      className: '!bg-white dark:!bg-dark-800 !text-gray-900 dark:!text-white !shadow-xl !rounded-2xl',
                      duration: 3000,
                    }}
                  />
                </CartProvider>
              </ProductProvider>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
