'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Shield, 
  Truck, 
  ArrowLeft,
  CreditCard,
  Star 
} from 'lucide-react';
import Link from 'next/link';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </Link>
          <div className="flex items-center">
            <ShoppingBag className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              XCart
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to XCart
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Sign in to access your shopping cart, favorites, and order history. 
              Your shopping experience is just one click away!
            </p>

            {/* Google Sign In */}
            <div className="space-y-4">
              <GoogleSignInButton />
              
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Why join XCart?
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Secure shopping with SSL encryption
                </span>
              </div>
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Free shipping on orders over ₹999
                </span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Multiple payment options including Razorpay
                </span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Exclusive deals and early access to sales
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Benefits Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">
                Join Thousands of Happy Shoppers
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Wide Selection</h3>
                    <p className="text-blue-100 text-sm">
                      Discover thousands of products across multiple categories
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast Delivery</h3>
                    <p className="text-blue-100 text-sm">
                      Get your orders delivered quickly and reliably
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">100% Secure</h3>
                    <p className="text-blue-100 text-sm">
                      Your data and payments are protected with bank-level security
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">New Customer Offer</p>
                    <p className="text-xs text-blue-200">Get 10% off your first order</p>
                  </div>
                  <div className="text-2xl font-bold">10% OFF</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  50K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Products
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  100K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Support
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}