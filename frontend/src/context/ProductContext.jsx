import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../utils/supabase';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'safran-products';
const ProductContext = createContext();

function generateId() {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

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

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(loadLocal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setProducts(data);
          saveLocal(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const syncToSupabase = useCallback(async (action) => {
    if (!isConfigured) return null;
    try {
      return await action(supabase);
    } catch (err) {
      console.warn('[DB] Supabase sync failed:', err.message);
      return null;
    }
  }, []);

  const addProduct = async (product) => {
    const id = generateId();
    const now = new Date().toISOString();
    const newProduct = {
      id,
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      category: product.category,
      images: product.images || [],
      created_at: now,
      updated_at: now,
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    saveLocal(updated);
    toast.success('Mahsulot qo\'shildi');

    syncToSupabase((db) =>
      db.from('products').insert([{
        id, name: newProduct.name, description: newProduct.description,
        price: newProduct.price, category: newProduct.category,
        images: newProduct.images, created_at: now, updated_at: now,
      }])
    );

    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    const now = new Date().toISOString();
    const updated = products.map(p =>
      p.id === id
        ? { ...p, ...updates, price: Number(updates.price), updated_at: now }
        : p
    );
    setProducts(updated);
    saveLocal(updated);
    toast.success('Mahsulot yangilandi');

    syncToSupabase((db) =>
      db.from('products').update({
        name: updates.name, description: updates.description,
        price: Number(updates.price), category: updates.category,
        images: updates.images, updated_at: now,
      }).eq('id', id)
    );

    return updated.find(p => p.id === id);
  };

  const deleteProduct = async (id) => {
    const product = products.find(p => p.id === id);

    if (product?.images?.length) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/api/upload/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: product.images }),
      }).catch(() => {});
    }

    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveLocal(updated);
    toast.success('Mahsulot o\'chirildi');

    syncToSupabase((db) =>
      db.from('products').delete().eq('id', id)
    );
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
      products, loading, fetchProducts: () => {},
      addProduct, updateProduct, deleteProduct,
      getProductsByCategory, getStats,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
