import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Menu() {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products.filter(p => {
    const matchCategory = category === 'all' || p.category === category;
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold gold-text mb-2">
          Bizning Menyu
        </h1>
        <p className="text-gray-400 text-sm">Eng yaxshi milliy taomlar</p>
      </motion.div>

      <div className="mb-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-500 text-lg">Hozircha taomlar mavjud emas</p>
          <p className="text-gray-600 text-sm mt-2">Tez orada yangi taomlar qo'shiladi</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onView={setSelectedProduct}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
