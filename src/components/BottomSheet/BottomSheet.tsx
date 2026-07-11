import { useState, useRef, useEffect } from 'react';
import styles from './BottomSheet.module.css';
import { useCart } from '../../contexts/CartContext';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: any;
}

export function BottomSheet({ isOpen, onClose, editingProduct }: BottomSheetProps) {
  const { addProduct, updateProduct } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [quantityStr, setQuantityStr] = useState('1');
  const [unit, setUnit] = useState('un');
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setName(editingProduct.name || '');
        setPriceStr(editingProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        
        if (Number.isInteger(editingProduct.quantity)) {
          setQuantityStr(editingProduct.quantity.toString());
        } else {
          setQuantityStr(editingProduct.quantity.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }));
        }
        
        setUnit(editingProduct.unit || 'un');
        setImageUrl(editingProduct.imageUrl);
      } else {
        setName('');
        setPriceStr('');
        setQuantityStr('1');
        setUnit('un');
        setImageUrl(undefined);
      }
    }
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setPriceStr('');
      return;
    }
    const numValue = Number(value) / 100;
    setPriceStr(numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseQuantity = (str: string) => {
    if (str.includes(',')) {
      return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
    }
    return parseFloat(str) || 0;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.,]/g, '');
    setQuantityStr(value);
  };

  const handleDecreaseQuantity = () => {
    const num = parseQuantity(quantityStr);
    const newNum = Math.ceil(num) - 1;
    if (num > 1) {
      setQuantityStr(Math.max(1, newNum).toString());
    }
  };

  const handleIncreaseQuantity = () => {
    const num = parseQuantity(quantityStr);
    const newNum = Math.floor(num) + 1;
    setQuantityStr(newNum.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!name && !imageUrl) || !priceStr || !quantityStr) return;

    const price = Number(priceStr.replace(/\./g, '').replace(',', '.'));
    const quantity = parseQuantity(quantityStr);
    
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

    // Reset handled by onClose which changes isOpen to false
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dragHandle} />
        
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{editingProduct ? 'Editar produto' : 'Novo produto'}</h2>
            <p className={styles.subtitle}>Tire uma foto ou escreva o nome</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
                  <span>FOTO</span>
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
              <label>NOME</label>
              <input 
                type="text" 
                placeholder="Leite, Arroz, Sabão..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>PREÇO UNITÁRIO</label>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencySymbol}>R$</span>
              <input 
                type="text" 
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
              <label>QUANTIDADE</label>
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
              <label>MEDIDA</label>
              <select 
                className={styles.unitSelect} 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="un">un</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={(!name && !imageUrl) || !priceStr || !quantityStr}>
            {editingProduct ? 'Salvar alterações' : '+ Adicionar ao carrinho'}
          </button>
          
          {!editingProduct && <p className={styles.footerHint}>Toque fora para fechar · adicione vários em sequência</p>}
        </form>
      </div>
    </div>
  );
}
