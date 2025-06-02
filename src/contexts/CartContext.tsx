// context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../services/api';

interface CartItem {
  product: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  cartCount: 0,
  fetchCart: async () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data.items);
      const count = res.data.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      setCartCount(count);
    } catch {
      setItems([]);
      setCartCount(0);
    }
  };

  return (
    <CartContext.Provider value={{ items, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
