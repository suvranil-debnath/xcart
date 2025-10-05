'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Phone, 
  Save, 
  ArrowLeft,
  CheckCircle,
  Plus,
  Trash2,
  Edit,
  Home
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const emptyAddress = {
    id: '',
    name: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
  };
  
  const [currentAddress, setCurrentAddress] = useState({...emptyAddress});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    // Load saved addresses
    const loadAddresses = () => {
      try {
        const savedAddresses = localStorage.getItem('userAddresses');
        if (savedAddresses) {
          setAddresses(JSON.parse(savedAddresses));
        }
        
        // If no addresses yet, pre-fill with user name for first address
        if ((!savedAddresses || JSON.parse(savedAddresses).length === 0) && user) {
          setCurrentAddress(prev => ({
            ...prev,
            fullName: user.name || '',
            name: 'Home',
            isDefault: true
          }));
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    };

    loadAddresses();
  }, [user, authLoading, router]);

  const handleInputChange = (field, value) => {
    setCurrentAddress(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset success message when user makes changes
    if (saveSuccess) setSaveSuccess(false);
  };
  
  const addNewAddress = () => {
    setEditingIndex(-1);
    setCurrentAddress({
      ...emptyAddress,
      id: Date.now().toString(),
      fullName: user?.name || '',
      name: `Address ${addresses.length + 1}`
    });
    setShowAddressForm(true);
  };
  
  const editAddress = (index) => {
    setEditingIndex(index);
    setCurrentAddress({...addresses[index]});
    setShowAddressForm(true);
  };
  
  const deleteAddress = (index) => {
    const updatedAddresses = [...addresses];
    const removedAddress = updatedAddresses.splice(index, 1)[0];
    
    // If removing default address, set a new default if other addresses exist
    if (removedAddress.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const setDefaultAddress = (index) => {
    const updatedAddresses = addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index
    }));
    
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure address has an ID
      const addressToSave = {
        ...currentAddress,
        id: currentAddress.id || Date.now().toString()
      };
      
      let updatedAddresses = [];
      
      if (editingIndex >= 0) {
        // Update existing address
        updatedAddresses = addresses.map((addr, idx) => 
          idx === editingIndex ? addressToSave : addr
        );
      } else {
        // Add new address
        // If this is the first address or marked as default, ensure it's the only default
        if (addresses.length === 0 || addressToSave.isDefault) {
          updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: false
          }));
          addressToSave.isDefault = true;
        } else {
          updatedAddresses = [...addresses];
        }
        
        updatedAddresses.push(addressToSave);
      }
      
      setAddresses(updatedAddresses);
      localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      setSaveSuccess(true);
      setShowAddressForm(false);
      setCurrentAddress({...emptyAddress});
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-500">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {user.name || 'User'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user.email}
              </p>
              <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Addresses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Shipping Addresses
                </h2>
              </div>
              
              {!showAddressForm && (
                <button
                  type="button"
                  onClick={addNewAddress}
                  className="flex items-center px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Address
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center text-green-700 dark:text-green-400">
                <CheckCircle className="h-5 w-5 mr-2" />
                Address saved successfully!
              </div>
            )}

            {/* Address Form */}
            {showAddressForm && (
              <form onSubmit={handleSubmit} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address Name *
                      </label>
                      <input
                        type="text"
                        value={currentAddress.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Home, Work, etc."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={currentAddress.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={currentAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
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
                        value={currentAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
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
                        value={currentAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
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
                        value={currentAddress.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
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
                        value={currentAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={currentAddress.isDefault}
                      onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save Address
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Address List */}
            {!showAddressForm && (
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                    <p>No addresses saved yet.</p>
                    <p className="text-sm mt-1">Add your first shipping address to speed up checkout.</p>
                  </div>
                ) : (
                  addresses.map((address, index) => (
                    <div 
                      key={address.id || index} 
                      className={`border ${address.isDefault ? 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 relative`}
                    >
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      
                      <div className="flex items-start mb-2">
                        <Home className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{address.name}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{address.fullName}</p>
                        </div>
                      </div>
                      
                      <div className="ml-7 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>Phone: {address.phone}</p>
                      </div>
                      
                      <div className="mt-3 ml-7 flex space-x-3">
                        <button
                          type="button"
                          onClick={() => editAddress(index)}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </button>
                        
                        {!address.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(index)}
                            className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Set as default
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => deleteAddress(index)}
                          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}