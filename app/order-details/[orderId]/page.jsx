'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const OrderDetailsPage = ({ params }) => {
  const { orderId } = params;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        // In a real app, you would fetch this from your backend
        // For demo purposes, we'll check localStorage
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          const foundOrder = orders.find(o => o.id === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            // Order not found
            router.push('/orders');
          }
        } else {
          // No orders found
          router.push('/orders');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, authLoading, router, orderId]);

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <Package className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Order not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/orders"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order #{order.id.substring(6, 14)}
              </h1>
              <div className="flex items-center mt-2">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                  {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Items
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{item.price.toFixed(2)} each
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        ₹{(item.price * item.quantity).toFixed(2)} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">₹{order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="font-medium text-gray-900 dark:text-white">Shipping</span>
                  <span className="text-gray-900 dark:text-white">Free</span>
                </div>
                <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Customer Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shipping_address?.fullName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {user?.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {order.shipping_address?.phone}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shipping_address?.fullName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {order.shipping_address?.street}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment Method: Razorpay
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Payment ID: {order.payment_id || 'Processing'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Status: {order.payment_status || 'Completed'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;