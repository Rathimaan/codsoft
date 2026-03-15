import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const existing = cartItems.find((i) => i._id === product._id);
    if (existing) {
      toast.success('Quantity updated!', { id: product._id });
      setCartItems((prev) => prev.map((i) => i._id === product._id ? { ...i, qty: i.qty + qty } : i));
    } else {
      toast.success(`${product.name} added to cart!`, { id: product._id });
      setCartItems((prev) => [...prev, { ...product, qty }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id));
    toast.error('Item removed from cart');
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems((prev) => prev.map((i) => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
