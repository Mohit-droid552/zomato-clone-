import React from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { addToCart, removeFromCart, deleteFromCart } from '../../store/slices/cartSlice.js';

export const CartItems = ({ items, restaurantId }) => {
  const dispatch = useDispatch();

  const handleIncrement = (item) => {
    dispatch(
      addToCart({
        foodItem: item.foodItem,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantId,
      })
    );
  };

  const handleDecrement = (item) => {
    dispatch(removeFromCart(item.foodItem));
  };

  const handleDelete = (item) => {
    dispatch(deleteFromCart(item.foodItem));
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.foodItem}
          className="flex justify-between items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm animate-pop-in"
        >
          {/* Item details */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                {item.name}
              </h4>
              <p className="text-slate-500 font-bold text-sm">
                ₹{item.price}
              </p>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Quantity adjustment */}
            <div className="flex items-center bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200">
              <button
                onClick={() => handleDecrement(item)}
                className="px-2.5 py-1.5 hover:bg-slate-200 transition-colors rounded-l-xl cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1.5 text-center min-w-[20px]">
                {item.quantity}
              </span>
              <button
                onClick={() => handleIncrement(item)}
                className="px-2.5 py-1.5 hover:bg-slate-200 transition-colors rounded-r-xl cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total Item cost */}
            <span className="text-sm sm:text-base font-extrabold text-slate-800 min-w-[60px] text-right">
              ₹{item.price * item.quantity}
            </span>

            {/* Trash button */}
            <button
              onClick={() => handleDelete(item)}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
              title="Remove item"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
