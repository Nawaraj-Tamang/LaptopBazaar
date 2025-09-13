import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const getCartKey = (user) => (user && user._id ? `cart_${user._id}` : null);

  // On mount: load cart for currently logged-in user (if any).
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const key = getCartKey(user);

    // migrate generic 'cartItems' into user's cart if present (backwards compatibility)
    const genericKey = 'cartItems';

    if (key) {
      const perUserSaved = localStorage.getItem(key);
      if (perUserSaved) {
        try { setCartItems(JSON.parse(perUserSaved)); } catch { setCartItems([]); }
      } else if (localStorage.getItem(genericKey)) {
        try {
          const parsed = JSON.parse(localStorage.getItem(genericKey));
          localStorage.setItem(key, JSON.stringify(parsed));
          localStorage.removeItem(genericKey);
          setCartItems(parsed);
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } else {
      // no logged-in user -> don't load any cart
      setCartItems([]);
    }
    // NOTE: intentionally only on mount. Most login flows reload the app,
    // but saving/loading uses localStorage so data persists per-user.
  }, []);

  // Whenever cartItems changes, save it to the current user's key.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const key = getCartKey(user);
    if (key) {
      localStorage.setItem(key, JSON.stringify(cartItems));
    }
    // if no user we do NOT save a guest cart
  }, [cartItems]);

  // Safeguarded cart actions (will no-op if no user)
  const addToCart = (item) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      // UI should prevent this, but guard anyway
      return false;
    }

    setCartItems(prev => {
      const exist = prev.find(i => i._id === item._id);
      if (exist) {
        return prev.map(i =>
          i._id === item._id ? { ...i, qty: (i.qty || 0) + (item.qty || 1) } : i
        );
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });

    return true;
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty: parseInt(qty, 10) } : i));
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
}
