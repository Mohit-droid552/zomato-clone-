import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import CartItems from '../components/cart/CartItems.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, restaurantId, totalAmount } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          type="cart"
          title="Your Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Go ahead and explore top dishes near you!"
        />
      </div>
    );
  }

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <Link to="/" className="hover:text-zomato-pure transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/restaurant/${restaurantId}`} className="hover:text-zomato-pure transition-colors">Restaurant</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700">Shopping Cart</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={`/restaurant/${restaurantId}`}
          className="p-2 border border-slate-200 hover:border-slate-350 rounded-xl bg-white shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
          title="Back to restaurant menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Review Your Order
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">
            Confirm your items before proceeding to payment
          </p>
        </div>
      </div>

      {/* Cart Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-4">
          <CartItems items={items} restaurantId={restaurantId} />
        </div>

        {/* Right Column: Pricing details */}
        <div className="lg:col-span-1">
          <CartSummary
            totalAmount={totalAmount}
            actionText="Proceed to Checkout"
            onAction={handleCheckoutRedirect}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
