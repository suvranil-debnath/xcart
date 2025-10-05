'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext({});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setFavorites(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addToFavorites = async (product) => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      const favoriteRef = doc(db, 'users', user.uid, 'favorites', product.id);
      await setDoc(favoriteRef, {
        ...product,
        addedAt: new Date(),
      });
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (productId) => {
    if (!user) return;

    try {
      const favoriteRef = doc(db, 'users', user.uid, 'favorites', productId);
      await deleteDoc(favoriteRef);
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  const toggleFavorite = async (product) => {
    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product);
    }
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};