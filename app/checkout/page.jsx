'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Truck, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Home,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';

const CheckoutPage = () => {
  const { cart: cartItems, loading: cartLoading, getTotalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderProcessing, setOrderProcessing] = useState(false);

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const cart = cartItems;
  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (!cartLoading && (!cart || cart.length === 0)) {
      router.push('/');
    }
    
    // Load user profile data if available
    const fetchUserProfile = async () => {
      try {
        // Load saved addresses
        const userAddresses = localStorage.getItem('userAddresses');
        if (userAddresses) {
          const addresses = JSON.parse(userAddresses);
          setSavedAddresses(addresses);
          
          // Find default address
          const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setAddress({
              fullName: defaultAddress.fullName || '',
              street: defaultAddress.street || '',
              city: defaultAddress.city || '',
              state: defaultAddress.state || '',
              zipCode: defaultAddress.zipCode || '',
              phone: defaultAddress.phone || ''
            });
          }
        } else {
          // Fallback to legacy user address
          const savedAddress = localStorage.getItem('userAddress');
          if (savedAddress) {
            setAddress(JSON.parse(savedAddress));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    if (user) {
      fetchUserProfile();
    }
  }, [user, cart, authLoading, cartLoading, router]);
  
  // Load Razorpay script when component mounts
  useEffect(() => {
    loadRazorpayScript();
  }, []);
  
  const currentTotalPrice = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      // In a real app, this would call your backend to create an order
      // For demo purposes, we'll create a mock order with proper validation
      
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty. Cannot create order.');
      }
      
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (totalAmount <= 0) {
        throw new Error('Invalid order amount. Cannot process payment.');
      }
      
      // Generate a more realistic order ID
      const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      return {
        id: orderId,
        amount: Math.round(totalAmount * 100), // Razorpay expects amount in paise (smallest currency unit)
        currency: 'INR',
        receipt: 'receipt_' + orderId,
        created_at: new Date().toISOString(),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        total_amount: totalAmount
      };
    } catch (error) {
      console.error('Order creation failed:', error);
      throw new Error('Failed to create order: ' + error.message);
    }
  };

  const initiateRazorpayPayment = async () => {
    try {
      setLoading(true);
      
      // Create order using the dedicated function
      const order = await createOrder();

      // Add shipping address to the order
      order.shipping_address = address;
      
      // Set initial order status
      order.status = 'processing';
      
      // Store order in localStorage for demo purposes
      // In a real app, this would be stored in a database
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured. Please check your environment variables.');
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'XCart',
        description: 'Payment for your order',
        // Remove order_id as we're not using a real Razorpay order
        prefill: {
          name: address.fullName,
          email: user?.email || '',
          contact: address.phone
        },
        theme: {
          color: '#3399cc'
        },
        handler: async function(response) {
          try {
            console.log('Payment successful:', response);
            
            // In a real app, you would verify the payment signature on your backend
            // For demo purposes, we'll update the order with payment details
            const updatedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            const orderIndex = updatedOrders.findIndex(o => o.id === order.id);
            
            if (orderIndex !== -1) {
              updatedOrders[orderIndex].payment_id = response.razorpay_payment_id;
              updatedOrders[orderIndex].payment_status = 'completed';
              localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
            }

            // Clear cart
            await clearCart();
             
            // Redirect to success page with proper navigation
            window.location.href = '/order-success?payment=success&order_id=' + order.id;
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: address.fullName || user?.displayName || 'Customer',
          email: user?.email || '',
          contact: address.phone || ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setLoading(false);
          }
        }
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function(response) {
          console.error('Payment failed:', response.error);
          alert(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        
        razorpay.open();
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        throw error;
      }
      
    } catch (error) {
        console.error('Error processing payment:', error);
        
        // More specific error messages
        if (error.message.includes('Razorpay key not configured')) {
          alert('Payment configuration error. Please contact support.');
        } else if (error.message.includes('Failed to load Razorpay script')) {
          alert('Unable to load payment gateway. Please check your internet connection and try again.');
        } else {
          alert('Payment failed: ' + error.message);
        }
        
        setLoading(false);
      }
  };

  const handlePayment = async () => {
    if (!address.fullName || !address.street || !address.city || !address.state || !address.zipCode || !address.phone) {
      alert('Please fill in all address fields');
      return;
    }
    
    setOrderProcessing(true);
    
    // Save address to localStorage for future use
    localStorage.setItem('userAddress', JSON.stringify(address));
    
    try {
      // Check if Razorpay script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Unable to load payment gateway. Please try again.');
      }
      
      // Initiate Razorpay payment
      await initiateRazorpayPayment();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setOrderProcessing(false);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load payment gateway. Please try again.');
      return;
    }

    await initiateRazorpayPayment();
  };

  if (!user || !cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Processing your payment...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please don't close this window</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-8">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address and Payment */}
          <div className="space-y-6">
            {/* Address Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold dark:text-white">Shipping Address</h2>
              </div>
              
              {/* Saved Addresses Selector */}
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <button 
                      type="button"
                      className="w-full p-3 border rounded-md flex items-center justify-between bg-white dark:bg-gray-700 dark:border-gray-600"
                      onClick={() => setShowAddressSelector(!showAddressSelector)}
                    >
                      <div className="flex items-center">
                        <Home size={18} className="mr-2 text-gray-600 dark:text-gray-400" />
                        {selectedAddressId ? 
                          (savedAddresses.find(a => a.id === selectedAddressId)?.addressName || 'Selected Address') : 
                          'Select a saved address'}
                      </div>
                      <ChevronDown size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    {showAddressSelector && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                        {savedAddresses.map((addr) => (
                          <div 
                            key={addr.id}
                            className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${addr.id === selectedAddressId ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setAddress({
                                fullName: addr.fullName || '',
                                street: addr.street || '',
                                city: addr.city || '',
                                state: addr.state || '',
                                zipCode: addr.zipCode || '',
                                phone: addr.phone || ''
                              });
                              setShowAddressSelector(false);
                            }}
                          >
                            <div className="font-medium dark:text-white">{addr.addressName || 'Address'}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {addr.fullName}, {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                            </div>
                            {addr.isDefault && (
                              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded mt-1 inline-block">
                                Default
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    <Link href="/profile" className="hover:underline">Manage your addresses</Link>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold dark:text-white">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      Razorpay
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Secure payment gateway
                    </span>
                  </div>
                </label>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4 mr-1" />
                Your payment information is secure and encrypted
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t dark:border-gray-600 mt-6 pt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-blue-600">
                    ₹{currentTotalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ₹{currentTotalPrice.toLocaleString()}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Truck className="h-4 w-4 mr-1" />
                Free delivery within 3-5 business days
              </div>
            </motion.div>

            {/* Security Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
            >
              <div className="flex justify-center space-x-6 mb-4">
                <div className="text-green-600">
                  <CheckCircle className="h-8 w-8 mx-auto" />
                  <p className="text-xs mt-1">Secure Payment</p>
                </div>
                <div className="text-blue-600">
                  <Shield className="h-8 w-8 mx-auto" />
                  <p className="text-xs mt-1">SSL Encrypted</p>
                </div>
                <div className="text-purple-600">
                  <Truck className="h-8 w-8 mx-auto" />
                  <p className="text-xs mt-1">Free Shipping</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your personal and payment information is always protected
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;