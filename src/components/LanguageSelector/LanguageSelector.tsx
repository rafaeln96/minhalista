import { useLanguage } from '../../contexts/LanguageContext';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={styles.container} title={t('lang.switch')}>
      <button
        type="button"
        className={`${styles.langBtn} ${language === 'pt' ? styles.active : ''}`}
        onClick={() => setLanguage('pt')}
        aria-label="Português"
      >
        <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagIcon} aria-hidden="true">
          <g fillRule="evenodd">
            <path fill="#229e46" d="M0 0h640v480H0z"/>
            <path fill="#f8e523" d="M64 240L320 64l256 176-256 176z"/>
            <circle cx="320" cy="240" r="80" fill="#2b4594"/>
            <path fill="#ffffff" d="M246 222a84 84 0 0 0 148 30 80 80 0 0 1-148-30z"/>
          </g>
        </svg>
        <span>{t('lang.pt')}</span>
      </button>
      <button
        type="button"
        className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="English"
      >
        <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagIcon} aria-hidden="true">
          <g fillRule="evenodd">
            <path fill="#bd3d44" d="M0 0h640v480H0z"/>
            <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"/>
            <path fill="#192f5d" d="M0 0h288v258.5H0z"/>
            <g fill="#fff">
              <circle cx="28" cy="22" r="8"/><circle cx="80" cy="22" r="8"/><circle cx="132" cy="22" r="8"/><circle cx="184" cy="22" r="8"/><circle cx="236" cy="22" r="8"/>
              <circle cx="54" cy="50" r="8"/><circle cx="106" cy="50" r="8"/><circle cx="158" cy="50" r="8"/><circle cx="210" cy="50" r="8"/>
              <circle cx="28" cy="78" r="8"/><circle cx="80" cy="78" r="8"/><circle cx="132" cy="78" r="8"/><circle cx="184" cy="78" r="8"/><circle cx="236" cy="78" r="8"/>
              <circle cx="54" cy="106" r="8"/><circle cx="106" cy="106" r="8"/><circle cx="158" cy="106" r="8"/><circle cx="210" cy="106" r="8"/>
              <circle cx="28" cy="134" r="8"/><circle cx="80" cy="134" r="8"/><circle cx="132" cy="134" r="8"/><circle cx="184" cy="134" r="8"/><circle cx="236" cy="134" r="8"/>
              <circle cx="54" cy="162" r="8"/><circle cx="106" cy="162" r="8"/><circle cx="158" cy="162" r="8"/><circle cx="210" cy="162" r="8"/>
              <circle cx="28" cy="190" r="8"/><circle cx="80" cy="190" r="8"/><circle cx="132" cy="190" r="8"/><circle cx="184" cy="190" r="8"/><circle cx="236" cy="190" r="8"/>
              <circle cx="54" cy="218" r="8"/><circle cx="106" cy="218" r="8"/><circle cx="158" cy="218" r="8"/><circle cx="210" cy="218" r="8"/>
              <circle cx="28" cy="246" r="8"/><circle cx="80" cy="246" r="8"/><circle cx="132" cy="246" r="8"/><circle cx="184" cy="246" r="8"/><circle cx="236" cy="246" r="8"/>
            </g>
          </g>
        </svg>
        <span>{t('lang.en')}</span>
      </button>
    </div>
  );
}
