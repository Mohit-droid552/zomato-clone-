import React, { useEffect, useState } from 'react';
import client from '../api/client.js';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { ClipboardList, Calendar, MapPin, IndianRupee, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await client.get('/orders/my-orders');
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError(response.data.message || 'Failed to retrieve orders');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingState type="spinner" />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-500 font-bold text-lg mb-4">{error}</p>
        <Link to="/" className="button-primary">Go back home</Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          type="orders"
          title="No Orders Found"
          description="You haven't placed any food orders yet. Go ahead and treat yourself to something delicious!"
        />
      </div>
    );
  }

  const getStatusStyle = (status) => {
    const styles = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Preparing: 'bg-blue-50 text-blue-700 border-blue-200',
      'Out for Delivery': 'bg-purple-50 text-purple-700 border-purple-200',
      Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <Link to="/" className="hover:text-zomato-pure transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">My Orders</span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Your Order History
        </h1>
        <p className="text-sm text-slate-400 font-semibold mt-0.5">
          Track and review your food orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow animate-pop-in space-y-5"
          >
            {/* Top row details */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={order.restaurant?.image}
                  alt={order.restaurant?.name}
                  className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                />
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 hover:text-zomato-pure transition-colors text-base">
                    <Link to={`/restaurant/${order.restaurant?._id}`}>{order.restaurant?.name}</Link>
                  </h3>
                  <p className="text-slate-400 font-semibold text-xs flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:text-right">
                <span className={`px-3 py-1 border text-xs font-bold rounded-lg ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Middle row: items ordered list */}
            <div className="space-y-2.5 text-sm font-semibold">
              {order.items?.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-slate-600">
                  <span>
                    {item.name} <span className="text-slate-400 text-xs">x {item.quantity}</span>
                  </span>
                  <span className="text-slate-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bottom details: price and address */}
            <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div className="flex gap-2 text-slate-500 font-medium text-left sm:max-w-sm">
                <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-700">Delivered to:</strong> {order.deliveryAddress}
                </span>
              </div>

              <div className="sm:text-right shrink-0">
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Total Amount Paid</p>
                <p className="text-lg font-extrabold text-zomato-pure mt-0.5">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
