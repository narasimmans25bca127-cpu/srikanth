import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  // Each item: { product (id), name, price, image, stock, quantity }
  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id
            ? { ...i, stock: product.stock, quantity: Math.min(product.stock, i.quantity + quantity) }
            : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: Math.min(product.stock, quantity),
        },
      ];
    });
  };

  const removeFromCart = (productId) =>
    setItems((prev) => prev.filter((i) => i.product !== productId));

  const setQuantity = (productId, quantity) =>
    setItems((prev) =>
      prev.map((i) =>
        i.product === productId
          ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) }
          : i
      )
    );

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, setQuantity, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
