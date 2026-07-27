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
        🇧🇷 {t('lang.pt')}
      </button>
      <button
        type="button"
        className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="English"
      >
        🇺🇸 {t('lang.en')}
      </button>
    </div>
  );
}
