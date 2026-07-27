import type { Product } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProductCard } from '../ProductCard/ProductCard';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  onEditProduct: (product: Product) => void;
  onRemoveProduct: (product: Product) => void;
  onOpenAddModal: () => void;
}

export function ProductList({
  products,
  filteredProducts,
  searchQuery,
  onEditProduct,
  onRemoveProduct,
  onOpenAddModal,
}: ProductListProps) {
  const { t } = useLanguage();

  if (products.length === 0) {
    return (
      <main className={styles.productList}>
        <EmptyState onAddProduct={onOpenAddModal} />
      </main>
    );
  }

  return (
    <main className={styles.productList}>
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={() => onEditProduct(product)}
          onRemove={() => onRemoveProduct(product)}
        />
      ))}

      {filteredProducts.length === 0 && searchQuery && (
        <div className={styles.emptySearchState}>
          <p>{t('search.emptyResult', { query: searchQuery })}</p>
        </div>
      )}
    </main>
  );
}
