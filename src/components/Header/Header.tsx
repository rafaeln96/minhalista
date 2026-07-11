import { useState } from 'react';
import styles from './Header.module.css';
import { useCart } from '../../contexts/CartContext';
import { formatCurrencyPart } from '../../utils/format';
import { generateShoppingListPDF } from '../../utils/pdfGenerator';

export function Header() {
  const { products, totalProducts, totalUnits, totalPrice, clearList } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { symbol, value } = formatCurrencyPart(totalPrice);

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            {/* Simple Leaf/Cart SVG icon placeholder */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h4l3 10h10l3-8H8" />
              <circle cx="10" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
          </div>
          <span className={styles.logoText}>Mercado</span>
        </div>
        <div className={styles.topActions}>
          <button 
            className={styles.exportBtn} 
            onClick={() => generateShoppingListPDF(products, totalUnits, totalPrice)}
            disabled={products.length === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Gerar PDF
          </button>
          <button className={styles.clearBtn} onClick={() => setShowClearConfirm(true)}>
            Limpar lista
          </button>
        </div>
      </div>

      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>TOTAL NO CARRINHO</span>
        <div className={styles.totalValueContainer}>
          <span className={styles.currencySymbol}>{symbol}</span>
          <span className={styles.totalValue}>{value}</span>
        </div>
        <span className={styles.itemCount}>
          {totalProducts} {totalProducts === 1 ? 'produto' : 'produtos'} · {Number(totalUnits.toFixed(3)).toString().replace('.', ',')} {totalUnits === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {showClearConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Limpar toda a lista?</h3>
            <p>Você perderá todos os <strong>{totalProducts}</strong> produtos adicionados. Tem certeza que deseja esvaziar o carrinho?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowClearConfirm(false)}>Cancelar</button>
              <button className="btn-delete" onClick={() => {
                clearList();
                setShowClearConfirm(false);
              }}>Esvaziar</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
