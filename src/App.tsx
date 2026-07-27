import { useState } from 'react';
import './App.css';
import { CartProvider, useCart, type Product } from './contexts/CartContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Header } from './components/Header/Header';
import { SearchBar } from './components/SearchBar/SearchBar';
import { ProductList } from './components/ProductList/ProductList';
import { FAB } from './components/FAB/FAB';
import { BottomSheet } from './components/BottomSheet/BottomSheet';
import { ConfirmModal } from './components/ConfirmModal/ConfirmModal';

function AppContent() {
  const { products, removeProduct } = useCart();
  const { language, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const openEditor = (product?: Product | null) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  };

  const closeEditor = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      removeProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    if (product.name && product.name.toLowerCase().includes(query)) {
      return true;
    }

    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    const priceStr = product.price.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (priceStr.includes(query) || product.price.toString().includes(query)) {
      return true;
    }

    if (!product.name && product.imageUrl) {
      const terms = ['foto', 'imagem', 'sem nome', 'produto', 'photo', 'image', 'picture', 'no name', 'product'];
      return terms.some((term) => term.includes(query));
    }

    return false;
  });

  const deleteProductName = productToDelete?.name || (productToDelete?.imageUrl ? t('product.photoOnly') : t('product.defaultName'));

  return (
    <div className="app-container">
      <div className="sticky-wrapper">
        <Header />

        {products.length > 0 && (
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        )}
      </div>

      <ProductList
        products={products}
        filteredProducts={filteredProducts}
        searchQuery={searchQuery}
        onEditProduct={(p) => openEditor(p)}
        onRemoveProduct={(p) => setProductToDelete(p)}
        onOpenAddModal={() => openEditor(null)}
      />

      <FAB onClick={() => openEditor(null)} />

      <BottomSheet
        isOpen={isModalOpen}
        onClose={closeEditor}
        editingProduct={editingProduct}
      />

      <ConfirmModal
        isOpen={!!productToDelete}
        title={t('confirmDelete.title')}
        message={t('confirmDelete.message', { name: deleteProductName })}
        cancelText={t('confirmDelete.cancel')}
        confirmText={t('confirmDelete.confirm')}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
