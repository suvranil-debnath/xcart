'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

// Component that uses searchParams
const OrderDetails = () => {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const id = searchParams.get('order_id');
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  return (
    <>
      {orderId && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg inline-block">
          <p className="text-sm text-gray-500 dark:text-gray-400">Order Reference</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            #{orderId.substring(6, 14)}
          </p>
        </div>
      )}
    </>
  );
};

const OrderSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 sm:p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Order Successful!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <Suspense fallback={<div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg inline-block">Loading order details...</div>}>
            <OrderDetails />
          </Suspense>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 sm:px-10">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            A confirmation email has been sent to your email address.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;