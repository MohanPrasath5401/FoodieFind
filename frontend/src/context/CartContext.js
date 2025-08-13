// frontend/src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart items from localStorage, or start with an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart items from localStorage", error);
      return [];
    }
  });
  
  // Load initial shipping address from localStorage
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const localData = localStorage.getItem('shippingAddress');
      return localData ? JSON.parse(localData) : {};
    } catch (error) {
        console.error("Could not parse shipping address from localStorage", error);
        return {};
    }
  });

  // This effect runs every time cartItems changes, saving it to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // This effect runs every time shippingAddress changes, saving it to localStorage
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  const addToCart = (item, qty) => {
    const existItem = cartItems.find(x => x.name === item.name && x.restaurantId === item.restaurantId);
    if (existItem) {
      setCartItems(cartItems.map(x => x.name === existItem.name ? { ...item, qty: x.qty + qty } : x));
    } else {
      setCartItems([...cartItems, { ...item, qty }]);
    }
  };

  const removeFromCart = (name) => {
    setCartItems(cartItems.filter(x => x.name !== name));
  };
  
  const saveShippingAddress = (data) => {
      setShippingAddress(data);
  }

  const clearCart = () => {
    setCartItems([]);
    // Also clear it from localStorage
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, shippingAddress, saveShippingAddress, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);