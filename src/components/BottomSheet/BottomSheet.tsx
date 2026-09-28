import { useState, useRef, useEffect, useMemo } from 'react';
import styles from './BottomSheet.module.css';
import { type Product, useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getQuantityStep, roundQuantity } from '../../utils/format';
import { suggestCorrection } from '../../utils/productCatalog';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Product | null;
}

export function BottomSheet({ isOpen, onClose, editingProduct }: BottomSheetProps) {
  const { addProduct, updateProduct } = useCart();
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [priceValue, setPriceValue] = useState(0);
  const [quantityStr, setQuantityStr] = useState('1');
  const [unit, setUnit] = useState('un');
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setName(editingProduct.name || '');
        const locale = language === 'pt' ? 'pt-BR' : 'en-US';
        setPriceValue(editingProduct.price);
        setPriceStr(editingProduct.price.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        if (Number.isInteger(editingProduct.quantity)) {
          setQuantityStr(editingProduct.quantity.toString());
        } else {
          setQuantityStr(editingProduct.quantity.toLocaleString(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 }));
        }

        setUnit(editingProduct.unit || 'un');
        setImageUrl(editingProduct.imageUrl);
      } else {
        setName('');
        setPriceStr('');
        setPriceValue(0);
        setQuantityStr('1');
        setUnit('un');
        setImageUrl(undefined);
      }
    }
  }, [isOpen, editingProduct, language]);

  const nameSuggestion = useMemo(() => suggestCorrection(name), [name]);

  if (!isOpen) return null;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setPriceStr('');
      setPriceValue(0);
      return;
    }
    const numValue = Number(value) / 100;
    setPriceValue(numValue);
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    setPriceStr(numValue.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          setImageUrl(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const parseQuantity = (str: string) => {
    if (language === 'pt') {
      const normalized = str.replace(/\./g, '').replace(',', '.').replace(/,/g, '');
      return parseFloat(normalized) || 0;
    }
    return parseFloat(str.replace(/,/g, '')) || 0;
  };

  const formatQuantityForInput = (value: number) => {
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    return Number.isInteger(value)
      ? value.toString()
      : value.toLocaleString(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.,]/g, '');
    setQuantityStr(value);
  };

  const handleDecreaseQuantity = () => {
    const num = parseQuantity(quantityStr);
    const step = getQuantityStep(unit);
    const newNum = roundQuantity(num - step, step);
    if (newNum > 0) {
      setQuantityStr(formatQuantityForInput(newNum));
    }
  };

  const handleIncreaseQuantity = () => {
    const num = parseQuantity(quantityStr);
    const step = getQuantityStep(unit);
    const newNum = roundQuantity(num + step, step);
    setQuantityStr(formatQuantityForInput(newNum));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseQuantity(quantityStr);
    if ((!name && !imageUrl) || priceValue <= 0 || quantity <= 0) return;

    const price = priceValue;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        price,
        quantity,
        unit,
        imageUrl
      });
    } else {
      addProduct({
        name,
        price,
        quantity,
        unit,
        imageUrl
      });
    }

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.dragHandle} />
        
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{editingProduct ? t('sheet.titleEdit') : t('sheet.titleNew')}</h2>
            <p className={styles.subtitle}>{t('sheet.subtitle')}</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.nameSection}>
            <div 
              className={styles.imageUpload} 
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Preview" className={styles.imagePreview} />
                  <button 
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl(undefined);
                    }}
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>{t('sheet.photoLabel')}</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className={styles.hiddenInput} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t('sheet.nameLabel')}</label>
              <input
                type="text"
                placeholder={t('sheet.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameSuggestion && (
                <button
                  type="button"
                  className={styles.nameSuggestion}
                  onClick={() => setName(nameSuggestion)}
                >
                  {t('sheet.nameSuggestion', { name: nameSuggestion })}
                </button>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>{t('sheet.priceLabel')}</label>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencySymbol}>{language === 'pt' ? 'R$' : '$'}</span>
              <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0,00" 
                value={priceStr}
                onChange={handlePriceChange}
                required
                className={styles.priceInput}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>{t('sheet.quantityLabel')}</label>
              <div className={styles.quantityControl}>
                <button 
                  type="button" 
                  className={styles.qtyBtn} 
                  onClick={handleDecreaseQuantity}
                >
                  −
                </button>
                <input 
                  type="text" 
                  inputMode="decimal"
                  className={styles.qtyInput} 
                  value={quantityStr}
                  onChange={handleQuantityChange}
                />
                <button 
                  type="button" 
                  className={styles.qtyBtn} 
                  onClick={handleIncreaseQuantity}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>{t('sheet.unitLabel')}</label>
              <select 
                className={styles.unitSelect} 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="un">{t('product.unit')}</option>
                <option value="kg">{t('product.kg')}</option>
                <option value="g">{t('product.g')}</option>
                <option value="L">{t('product.l')}</option>
                <option value="ml">{t('product.ml')}</option>
              </select>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={(!name && !imageUrl) || priceValue <= 0 || parseQuantity(quantityStr) <= 0}>
            {editingProduct ? t('sheet.submitEdit') : t('sheet.submitNew')}
          </button>
          
          {!editingProduct && <p className={styles.footerHint}>{t('sheet.footerHint')}</p>}
        </form>
      </div>
    </div>
  );
}
