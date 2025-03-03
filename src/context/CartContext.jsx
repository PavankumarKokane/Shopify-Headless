import React, { createContext, useContext, useState, useEffect } from 'react';
import { createCheckout, updateCheckout } from '../lib/shopify';

const CartContext = createContext(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [checkoutId, setCheckoutId] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCheckoutId = localStorage.getItem('checkoutId');
    const savedCheckoutUrl = localStorage.getItem('checkoutUrl');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCheckoutId) setCheckoutId(savedCheckoutId);
    if (savedCheckoutUrl) setCheckoutUrl(savedCheckoutUrl);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save checkout info to localStorage
  useEffect(() => {
    if (checkoutId) localStorage.setItem('checkoutId', checkoutId);
    if (checkoutUrl) localStorage.setItem('checkoutUrl', checkoutUrl);
  }, [checkoutId, checkoutUrl]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  async function addToCart(item) {
    setLoading(true);
    try {
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.variantId === item.variantId
      );

      let newCart;
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newCart = [...cart];
        newCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item to cart
        newCart = [...cart, item];
      }

      // Update cart state
      setCart(newCart);

      // Create or update checkout
      if (!checkoutId) {
        const checkout = await createCheckout(item.variantId, item.quantity);
        setCheckoutId(checkout.id);
        setCheckoutUrl(checkout.webUrl);
      } else {
        const lineItems = newCart.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }));
        
        const checkout = await updateCheckout(checkoutId, lineItems);
        setCheckoutUrl(checkout.webUrl);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(id, quantity) {
    setLoading(true);
    try {
      const newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      });

      // Remove item if quantity is 0
      const filteredCart = newCart.filter((item) => item.quantity > 0);
      setCart(filteredCart);

      // Update checkout
      if (checkoutId) {
        const lineItems = filteredCart.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }));
        
        const checkout = await updateCheckout(checkoutId, lineItems);
        setCheckoutUrl(checkout.webUrl);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  }

  function removeFromCart(id) {
    updateQuantity(id, 0);
  }

  function clearCart() {
    setCart([]);
    setCheckoutId('');
    setCheckoutUrl('');
    localStorage.removeItem('cart');
    localStorage.removeItem('checkoutId');
    localStorage.removeItem('checkoutUrl');
  }

  const value = {
    cart,
    cartCount,
    checkoutUrl,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}