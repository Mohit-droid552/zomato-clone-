import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client.js';
import { clearCart } from '../store/slices/cartSlice.js';
import { addSavedAddress } from '../store/slices/authSlice.js';
import CartSummary from '../components/cart/CartSummary.jsx';
import Toast from '../components/common/Toast.jsx';
import { ChevronRight, ArrowLeft, MapPin, Plus, Check } from 'lucide-react';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, restaurantId, totalAmount } = useSelector((state) => state.cart);

  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0] || '');
  const [newAddress, setNewAddress] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <Link to="/" className="button-primary mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    try {
      setLoading(true);
      await dispatch(addSavedAddress(newAddress.trim())).unwrap();
      setSelectedAddress(newAddress.trim());
      setNewAddress('');
      setShowAddForm(false);
      setToastMessage('Address saved successfully');
      setToastType('success');
    } catch (err) {
      setToastMessage(err || 'Failed to add address');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setToastMessage('Please select or add a delivery address');
      setToastType('error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        restaurantId,
        items: items.map((item) => ({
          foodItem: item.foodItem,
          quantity: item.quantity,
        })),
        deliveryAddress: selectedAddress,
      };

      const response = await client.post('/orders', payload);

      if (response.data.success) {
        const orderId = response.data.order._id;
        dispatch(clearCart());
        navigate(`/order-success/${orderId}`);
      } else {
        setToastMessage(response.data.message || 'Order failed');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to place order');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <Link to="/" className="hover:text-zomato-pure transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/cart" className="hover:text-zomato-pure transition-colors">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">Checkout</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/cart"
          className="p-2 border border-slate-200 hover:border-slate-350 rounded-xl bg-white shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Choose Delivery Address
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">
            Select where you want your food delivered
          </p>
        </div>
      </div>

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Address Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Delivery Location</h3>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1 text-xs font-bold text-zomato-pure border border-zomato-100 hover:bg-zomato-50 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              )}
            </div>

            {/* Form for adding a new address */}
            {showAddForm && (
              <form onSubmit={handleAddNewAddress} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-4 animate-pop-in">
                <h4 className="font-bold text-slate-700 text-sm">Add New Address</h4>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter full delivery address (House No, Building, Street, Area, ZIP)..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full text-sm font-semibold p-3 border border-slate-250 rounded-xl focus:border-zomato-pure focus:outline-none bg-white placeholder-slate-400 text-slate-700 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAddress('');
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-zomato-pure hover:bg-rose-600 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List of saved addresses */}
            {user?.addresses?.length === 0 && !showAddForm ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-semibold space-y-2">
                <p>No saved addresses found.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-xs text-zomato-pure font-bold hover:underline"
                >
                  Click here to add one.
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {user?.addresses?.map((address, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAddress(address)}
                    className={`flex justify-between items-start gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all duration-150 ${
                      selectedAddress === address
                        ? 'border-zomato-pure bg-zomato-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-350 bg-white'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        selectedAddress === address ? 'bg-zomato-pure text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-800 text-sm">Address #{idx + 1}</p>
                        <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5 leading-relaxed">{address}</p>
                      </div>
                    </div>
                    {selectedAddress === address && (
                      <div className="p-1 bg-zomato-pure text-white rounded-full shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Payment Action */}
        <div className="lg:col-span-1">
          <CartSummary
            totalAmount={totalAmount}
            actionText="Confirm Order"
            onAction={handlePlaceOrder}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
