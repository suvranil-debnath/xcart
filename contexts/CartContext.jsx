'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const cartRef = collection(db, 'users', user.uid, 'cart');
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setCartItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const cartItemRef = doc(db, 'users', user.uid, 'cart', product.id);
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        await updateDoc(cartItemRef, {
          quantity: existingItem.quantity + 1,
        });
        toast.success('Item quantity updated in cart');
      } else {
        await setDoc(cartItemRef, {
          ...product,
          quantity: 1,
          addedAt: new Date(),
        });
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const cartItemRef = doc(db, 'users', user.uid, 'cart', productId);
      await deleteDoc(cartItemRef);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;

    try {
      const cartItemRef = doc(db, 'users', user.uid, 'cart', productId);
      if (quantity <= 0) {
        await deleteDoc(cartItemRef);
      } else {
        await updateDoc(cartItemRef, {
          quantity: quantity,
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const cartRef = collection(db, 'users', user.uid, 'cart');
      const snapshot = await getDocs(cartRef);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart: cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};