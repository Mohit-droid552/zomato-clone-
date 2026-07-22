import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client.js';
import LoadingState from '../components/common/LoadingState.jsx';
import { CheckCircle, ShoppingBag, ClipboardList, MapPin } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await client.get(`/orders/${id}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || 'Failed to load order info');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <LoadingState type="spinner" />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-rose-500 font-bold text-lg">{error}</p>
        <Link to="/" className="button-primary inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8 animate-pop-in">
      {/* Animated Success Banner */}
      <div className="space-y-4">
        <div className="inline-flex p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full animate-pulse">
          <CheckCircle className="w-16 h-16 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-400 font-semibold max-w-sm mx-auto text-sm">
          Your food is being prepared at <span className="text-slate-700 font-bold">{order?.restaurant?.name}</span> and will arrive shortly.
        </p>
      </div>

      {/* Order Summary receipt */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md text-left space-y-6">
        <div className="flex justify-between items-center border-b border-slate-50 pb-4 text-xs font-bold text-slate-400">
          <span>ORDER ID: <span className="text-slate-600 uppercase select-all">{order?._id}</span></span>
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
            {order?.status}
          </span>
        </div>

        {/* Itemized List */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Items Ordered</h3>
          <div className="space-y-2 divide-y divide-slate-50">
            {order?.items?.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2 text-sm font-semibold">
                <span className="text-slate-600">
                  {item.name} <span className="text-slate-400 font-medium">x {item.quantity}</span>
                </span>
                <span className="text-slate-800">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-sm font-extrabold text-slate-800">
          <span>Total Paid</span>
          <span className="text-lg text-zomato-pure">₹{order?.totalAmount}</span>
        </div>

        {/* Delivery Details */}
        <div className="border-t border-slate-50 pt-4 flex gap-3">
          <MapPin className="w-5 h-5 text-zomato-pure shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Delivery Destination</h4>
            <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5 leading-relaxed">{order?.deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Routing actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/orders"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 text-sm"
        >
          <ClipboardList className="w-4 h-4" /> View Order History
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 text-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Keep Ordering
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
