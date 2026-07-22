import React from 'react';

export const CartSummary = ({
  totalAmount,
  actionText = 'Proceed to Checkout',
  onAction,
  loading = false,
}) => {
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const tax = Math.round(totalAmount * 0.05); // 5% GST
  const grandTotal = totalAmount + deliveryFee + tax;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-3">
        Order Bill Details
      </h3>

      <div className="space-y-3 text-sm font-semibold text-slate-500">
        <div className="flex justify-between items-center">
          <span>Items Subtotal</span>
          <span className="text-slate-800">₹{totalAmount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Delivery Partner Fee</span>
          <span className="text-slate-800">
            {deliveryFee === 0 ? (
              <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                Free
              </span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Taxes & Charges (5% GST)</span>
          <span className="text-slate-800">₹{tax}</span>
        </div>

        <div className="border-t border-dashed border-slate-200 my-4" />

        <div className="flex justify-between items-center text-base font-extrabold text-slate-800">
          <span>To Pay</span>
          <span className="text-xl text-zomato-pure">₹{grandTotal}</span>
        </div>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          disabled={loading || totalAmount === 0}
          className="w-full flex items-center justify-center py-3 bg-zomato-pure hover:bg-rose-600 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl active:scale-98 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            actionText
          )}
        </button>
      )}
    </div>
  );
};

export default CartSummary;
