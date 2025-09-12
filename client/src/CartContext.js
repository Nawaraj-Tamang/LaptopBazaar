import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exist = cartItems.find(item => item._id === product._id);
    if (exist) {
      // Increment qty if already in cart
      setCartItems(
        cartItems.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + product.qty } : item
        )
      );
    } else {
      setCartItems([...cartItems, product]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems(
      cartItems.map(item =>
        item._id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
