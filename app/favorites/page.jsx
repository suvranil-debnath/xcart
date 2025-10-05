'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Favorites are automatically loaded through the onSnapshot listener
    // We just need to set loading to false when they're loaded
    if (!favoritesLoading) {
      setLoading(false);
    }
  }, [user, router, favoritesLoading]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Shop
            </Link>
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Favorites
              </h1>
              {favorites.length > 0 && (
                <span className="ml-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                  {favorites.length} items
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start adding products to your favorites list!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Favorites Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favorites.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Items
                </Link>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Stats */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{favorites.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                ₹{Math.max(...favorites.map(p => p.price)).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Highest Price</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(favorites.map(p => p.category)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}