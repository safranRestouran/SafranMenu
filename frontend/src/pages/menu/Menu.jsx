import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../utils/categories';
import { useLanguage } from '../../context/LanguageContext';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import SkeletonLoader from './components/SkeletonLoader';
import { getImageUrl } from '../../utils/helpers';
import { ArrowLeft } from 'lucide-react';

export default function Menu() {
  const { products, loading } = useProducts();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products.filter(p => {
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setSearch('');
  };

  const getCategoryImage = (catId) => {
    const product = products.find(p => p.category === catId && p.images?.length > 0);
    return product?.images?.[0];
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold gold-text mb-2">
            {t('menu_title')}
          </h1>
          <p className="text-gray-400 text-sm">{t('menu_select_cat')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => {
            const bgImage = getCategoryImage(cat.id);
            const translatedLabel = t('cat_' + cat.id.replace('-', '_'));
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(cat.id)}
                className={`relative overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 min-h-[140px] md:min-h-[180px] group ${bgImage ? 'border border-white/10' : 'glass-card'}`}
              >
                {bgImage && (
                  <>
                    <motion.img
                      src={getImageUrl(bgImage)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85" />
                  </>
                )}
                <span className="relative z-10 text-4xl md:text-5xl">{cat.icon}</span>
                <span className={`relative z-10 text-lg md:text-xl font-display font-semibold transition-colors ${bgImage ? 'text-white' : 'text-white group-hover:text-gold-500'}`}>
                  {translatedLabel}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  const categoryLabel = selectedCategory ? t('cat_' + selectedCategory.replace('-', '_')) : '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>{t('menu_back')}</span>
        </button>
        <h1 className="text-3xl md:text-4xl font-display font-bold gold-text mb-2">
          {categoryLabel}
        </h1>
      </motion.div>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder={t('menu_search_placeholder')} />
      </div>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-500 text-lg">{t('menu_no_products')}</p>
          <p className="text-gray-600 text-sm mt-2">{t('menu_no_products_desc')}</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
