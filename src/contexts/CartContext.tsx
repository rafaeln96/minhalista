import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { roundMoney } from '../utils/format';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl?: string;
}

interface CartContextData {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  removeProduct: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  clearList: () => void;
  totalProducts: number;
  totalUnits: number;
  totalPrice: number;
  storageError: string | null;
  clearStorageError: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [storageError, setStorageError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('@MinhaLista:products');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Erro ao carregar do localStorage (dados corrompidos)', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('@MinhaLista:products', JSON.stringify(products));
    } catch (e) {
      console.error('Erro ao salvar no localStorage (possível limite excedido)', e);
      setStorageError(t('error.storageFailed'));
    }
  }, [products, t]);

  const clearStorageError = () => setStorageError(null);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
    };
    setProducts((state) => [...state, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const safeUpdates = { ...updates };
      if (typeof safeUpdates.price === 'number' && (Number.isNaN(safeUpdates.price) || safeUpdates.price < 0)) {
        delete safeUpdates.price;
      }
      if (typeof safeUpdates.quantity === 'number' && (Number.isNaN(safeUpdates.quantity) || safeUpdates.quantity < 0)) {
        delete safeUpdates.quantity;
      }
      return { ...p, ...safeUpdates };
    }));
  };

  const removeProduct = (id: string) => {
    setProducts((state) => state.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (Number.isNaN(quantity) || quantity < 0) return;
    setProducts((state) =>
      state.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const clearList = () => {
    setProducts([]);
  };

  const totalProducts = products.length;

  const totalUnits = parseFloat(products.reduce((acc, p) => {
    return acc + (p.unit === 'un' ? p.quantity : 1);
  }, 0).toFixed(3));

  const totalPrice = products.reduce((acc, p) => {
    const isUnitMultiplier = p.unit === 'un';
    const itemTotal = isUnitMultiplier ? p.price * p.quantity : p.price;
    return acc + roundMoney(itemTotal);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        updateQuantity,
        updateProduct,
        clearList,
        totalProducts,
        totalUnits,
        totalPrice,
        storageError,
        clearStorageError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  return context;
}
