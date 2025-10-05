'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch this from your backend
        // For demo purposes, we'll check localStorage
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        } else {
          // If no orders found, create an empty array
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your orders
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Order #{order.id.substring(6, 14)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Items in your order
                </h4>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Shipping Address
                  </h4>
                  <Link
                    href={`/order-details/${order.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {order.shipping_address?.fullName}, {order.shipping_address?.street},{' '}
                  {order.shipping_address?.city}, {order.shipping_address?.state},{' '}
                  {order.shipping_address?.zipCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;