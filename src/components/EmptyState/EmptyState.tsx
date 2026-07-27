import { useLanguage } from '../../contexts/LanguageContext';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onAddProduct: () => void;
}

export function EmptyState({ onAddProduct }: EmptyStateProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIconWrapper}>
        <div className={styles.emptyIconBg}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <div className={styles.emptyIconBadge}>+</div>
        </div>
      </div>
      <h2 className={styles.title}>{t('empty.title')}</h2>
      <p className={styles.subtitle}>{t('empty.subtitle')}</p>
      <button type="button" className={styles.emptyActionBtn} onClick={onAddProduct}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
        {t('empty.button')}
      </button>
    </div>
  );
}
