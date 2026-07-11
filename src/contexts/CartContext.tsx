import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

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
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('@MinhaLista:products');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('@MinhaLista:products', JSON.stringify(products));
    } catch (e) {
      console.error('Erro ao salvar no localStorage (possível limite excedido)', e);
    }
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
    };
    setProducts((state) => [...state, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeProduct = (id: string) => {
    setProducts((state) => state.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return;
    setProducts((state) =>
      state.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const clearList = () => {
    setProducts([]);
  };

  const totalProducts = products.length;

  // Calcula o total de itens. Se for 'un', soma a quantidade. Se for peso/volume (kg, g, etc), conta como 1 item físico.
  const totalUnits = parseFloat(products.reduce((acc, p) => {
    return acc + (p.unit === 'un' ? p.quantity : 1);
  }, 0).toFixed(3));

  const totalPrice = products.reduce((acc, p) => {
    // Apenas multiplica se for unidade. Se for medida de peso/volume, o preço digitado é o preço final do pacote/etiqueta.
    const isUnitMultiplier = p.unit === 'un';
    const itemTotal = isUnitMultiplier ? p.price * p.quantity : p.price;
    const roundedItemTotal = Number(Math.round(Number(itemTotal + 'e2')) + 'e-2');
    return acc + roundedItemTotal;
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
