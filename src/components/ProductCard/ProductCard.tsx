import styles from './ProductCard.module.css';
import { type Product, useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/format';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onRemove: () => void;
}

export function ProductCard({ product, onEdit, onRemove }: ProductCardProps) {
  const { updateQuantity } = useCart();

  const handleDecrease = () => {
    if (product.quantity > 1) {
      const newNum = Math.ceil(product.quantity) - 1;
      updateQuantity(product.id, Math.max(1, newNum));
    } else {
      onRemove();
    }
  };

  const handleIncrease = () => {
    const newNum = Math.floor(product.quantity) + 1;
    updateQuantity(product.id, newNum);
  };

  const isUnitMultiplier = product.unit === 'un';
  
  // Arredonda usando o mesmo método do carrinho para evitar divergência de centavos
  const itemTotal = isUnitMultiplier ? product.quantity * product.price : product.price;
  const totalPrice = Number(Math.round(Number(itemTotal + 'e2')) + 'e-2');

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.placeholderIcon}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name || 'Produto'}</h3>
          <span className={styles.totalPrice}>{formatCurrency(totalPrice)}</span>
        </div>
        
        <div className={styles.details}>
          <span className={styles.unitDetail}>
            {product.quantity.toString().replace('.', ',')} {product.unit}
            {isUnitMultiplier && (
              <> × <span className={styles.unitPrice}>{formatCurrency(product.price)}</span></>
            )}
          </span>
        </div>
        
        <div className={styles.footerRow}>
          <div className={styles.quantityControl}>
            <button className={styles.qtyBtn} onClick={handleDecrease}>−</button>
            <span className={styles.qtyValue}>{product.quantity.toString().replace('.', ',')}</span>
            <button className={styles.qtyBtn} onClick={handleIncrease}>+</button>
          </div>

          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={onEdit} aria-label="Editar produto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button className={styles.deleteBtn} onClick={onRemove} aria-label="Remover produto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
