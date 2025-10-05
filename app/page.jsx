'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

// Demo products data
const demoProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://picsum.photos/300/300',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://picsum.photos/300/300',
    description: 'Feature-rich smartwatch with health monitoring',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: 129.99,
    image: 'https://picsum.photos/300/300',
    description: 'Comfortable running shoes for athletes',
    category: 'Fashion'
  },
  {
    id: '4',
    name: 'Coffee Maker',
    price: 79.99,
    image: 'https://picsum.photos/300/300',
    description: 'Automatic coffee maker with programmable settings',
    category: 'Home'
  },
  {
    id: '5',
    name: 'Backpack',
    price: 59.99,
    image: 'https://picsum.photos/300/300',
    description: 'Durable backpack with laptop compartment',
    category: 'Fashion'
  },
  {
    id: '6',
    name: 'Bluetooth Speaker',
    price: 69.99,
    image: 'https://picsum.photos/300/300',
    description: 'Portable Bluetooth speaker with rich sound',
    category: 'Electronics'
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setProducts(demoProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to XCart
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover amazing products at great prices
          </p>
        </motion.section>

        {/* Products Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Skeleton loaders
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded-md mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded-md mb-2 w-3/4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded-md mb-4 w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="bg-gray-300 dark:bg-gray-600 h-10 rounded-md flex-1"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-10 rounded-md flex-1"></div>
                  </div>
                </div>
              ))
            ) : (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              © 2024 XCart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}