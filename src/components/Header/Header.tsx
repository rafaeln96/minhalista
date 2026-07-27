import { useState } from 'react';
import styles from './Header.module.css';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrencyPart } from '../../utils/format';
import { generateShoppingListPDF } from '../../utils/pdfGenerator';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

export function Header() {
  const { products, totalProducts, totalUnits, totalPrice, clearList } = useCart();
  const { language, t } = useLanguage();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { symbol, value } = formatCurrencyPart(totalPrice);

  const productCountText = totalProducts === 1
    ? t('header.productCount_one', { count: totalProducts })
    : t('header.productCount_other', { count: totalProducts });

  const formattedUnits = language === 'pt'
    ? Number(totalUnits.toFixed(3)).toString().replace('.', ',')
    : Number(totalUnits.toFixed(3)).toString();

  const itemCountText = totalUnits === 1
    ? t('header.itemCount_one', { count: formattedUnits })
    : t('header.itemCount_other', { count: formattedUnits });

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h4l3 10h10l3-8H8" />
              <circle cx="10" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
          </div>
          <span className={styles.logoText}>{t('header.logo')}</span>
        </div>
        <div className={styles.topActions}>
          <LanguageSelector />
          <button 
            type="button"
            className={styles.exportBtn} 
            onClick={() => generateShoppingListPDF(products, totalUnits, totalPrice, language)}
            disabled={products.length === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {t('header.generatePdf')}
          </button>
          <button 
            type="button" 
            className={styles.clearBtn} 
            onClick={() => setShowClearConfirm(true)}
          >
            {t('header.clearList')}
          </button>
        </div>
      </div>

      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>{t('header.totalInCart')}</span>
        <div className={styles.totalValueContainer}>
          <span className={styles.currencySymbol}>{symbol}</span>
          <span className={styles.totalValue}>{value}</span>
        </div>
        <span className={styles.itemCount}>
          {productCountText} · {itemCountText}
        </span>
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title={t('confirmClear.title')}
        message={t('confirmClear.message', { count: totalProducts })}
        cancelText={t('confirmClear.cancel')}
        confirmText={t('confirmClear.confirm')}
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearList();
          setShowClearConfirm(false);
        }}
      />
    </header>
  );
}
