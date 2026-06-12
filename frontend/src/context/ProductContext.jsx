import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const STORAGE_KEY = 'safran-products';
const POLL_INTERVAL = 30000;
const ProductContext = createContext();

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Server xatosi' }));
    throw new Error(err.error || 'Server xatosi');
  }
  return res.json();
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(loadLocal);
  const [loading, setLoading] = useState(false);
  const syncRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    const data = await api('/products');
    setProducts(data);
    saveLocal(data);
  }, []);

  const syncProducts = useCallback(async () => {
    try {
      const data = await api('/products');
      setProducts(data);
      saveLocal(data);
    } catch {
      // silent poll
    }
  }, []);

  useEffect(() => {
    fetchProducts().then(() => setLoading(false)).catch(() => setLoading(false));
    setLoading(true);
    syncRef.current = setInterval(syncProducts, POLL_INTERVAL);
    return () => clearInterval(syncRef.current);
  }, [fetchProducts, syncProducts]);

  const addProduct = async (product) => {
    try {
      const data = await api('/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      const updated = [data, ...products];
      setProducts(updated);
      saveLocal(updated);
      toast.success('Mahsulot qo\'shildi');
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const data = await api(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const updated = products.map(p => (p.id === id ? data : p));
      setProducts(updated);
      saveLocal(updated);
      toast.success('Mahsulot yangilandi');
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    const product = products.find(p => p.id === id);
    try {
      if (product?.images?.length) {
        fetch(`${API_URL}/api/upload/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: product.images }),
        }).catch(() => {});
      }
      await api(`/products/${id}`, { method: 'DELETE' });
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveLocal(updated);
      toast.success('Mahsulot o\'chirildi');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const getProductsByCategory = (category) => {
    if (!category || category === 'all') return products;
    return products.filter(p => p.category === category);
  };

  const getStats = () => {
    const categories = [...new Set(products.map(p => p.category))];
    const sorted = [...products].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return {
      total: products.length,
      categories: categories.length,
      lastAdded: sorted[0] || null,
      byCategory: categories.map(cat => ({
        name: cat,
        count: products.filter(p => p.category === cat).length,
      })),
    };
  };

  return (
    <ProductContext.Provider value={{
      products, loading, fetchProducts,
      addProduct, updateProduct, deleteProduct,
      getProductsByCategory, getStats,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);