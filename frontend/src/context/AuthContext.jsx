import { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'safran-auth';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  passwordHash: CryptoJS.SHA256('admin123').toString(),
};

function hashPassword(pw) {
  return CryptoJS.SHA256(pw).toString();
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsAuthenticated(true);
        setUser(parsed);
      } catch { /* ignore */ }
    }
    if (!localStorage.getItem('safran-admin-creds')) {
      localStorage.setItem('safran-admin-creds', JSON.stringify(DEFAULT_CREDENTIALS));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const creds = JSON.parse(localStorage.getItem('safran-admin-creds') || JSON.stringify(DEFAULT_CREDENTIALS));
    if (username === creds.username && hashPassword(password) === creds.passwordHash) {
      const userData = { username, loggedInAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  const changePassword = (currentPassword, newPassword) => {
    const creds = JSON.parse(localStorage.getItem('safran-admin-creds') || JSON.stringify(DEFAULT_CREDENTIALS));
    if (hashPassword(currentPassword) !== creds.passwordHash) return false;
    creds.passwordHash = hashPassword(newPassword);
    localStorage.setItem('safran-admin-creds', JSON.stringify(creds));
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
