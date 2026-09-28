import styles from './Toast.module.css';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  if (!message) return null;

  return (
    <div className={styles.toast} role="alert">
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.closeBtn} onClick={onDismiss} aria-label="×">
        ×
      </button>
    </div>
  );
}
