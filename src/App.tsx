import { useState } from 'react';
import './App.css';
import { CartProvider, useCart } from './contexts/CartContext';
import { Header } from './components/Header/Header';
import { ProductCard } from './components/ProductCard/ProductCard';
import { FAB } from './components/FAB/FAB';
import { BottomSheet } from './components/BottomSheet/BottomSheet';

function AppContent() {
  const { products, removeProduct } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const openEditor = (product: any) => {
    setEditingProduct(product);
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

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    // Se o produto tem nome, busca pelo nome
    if (product.name && product.name.toLowerCase().includes(query)) {
      return true;
    }
    
    // Busca pelo preço (permitindo digitar "2,50" ou "2.50" etc)
    const priceStr = product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (priceStr.includes(query) || product.price.toString().includes(query)) {
      return true;
    }
    
    // Se o produto não tem nome (apenas foto), ele pode ser encontrado se o usuário
    // digitar termos genéricos como "foto", "imagem", "sem nome" ou "produto"
    if (!product.name && product.imageUrl) {
      return ['foto', 'imagem', 'sem nome', 'produto'].some(term => term.includes(query));
    }
    
    return false;
  });

  return (
    <div className="app-container">
      <div className="sticky-wrapper">
        <Header />
        
        {products.length > 0 && (
          <div className="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}
      </div>
      
      <main className="product-list">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onEdit={() => openEditor(product)} 
            onRemove={() => setProductToDelete(product)}
          />
        ))}
        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="empty-search-state">
            <p>Nenhum produto encontrado para "{searchQuery}"</p>
          </div>
        )}
        
        {products.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <div className="empty-icon-bg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <div className="empty-icon-badge">+</div>
              </div>
            </div>
            <h2>Carrinho vazio</h2>
            <p>Adicione produtos conforme você<br/>vai colocando no carrinho.</p>
            <button className="empty-action-btn" onClick={() => setIsModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Tirar foto ou digitar nome
            </button>
          </div>
        )}
      </main>

      <FAB onClick={() => openEditor(null)} />
      
      <BottomSheet 
        isOpen={isModalOpen} 
        onClose={closeEditor} 
        editingProduct={editingProduct} 
      />

      {productToDelete && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Remover item?</h3>
            <p>Tem certeza que deseja remover <strong>{productToDelete.name || 'este produto'}</strong> da sua lista?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setProductToDelete(null)}>Cancelar</button>
              <button className="btn-delete" onClick={confirmDelete}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
