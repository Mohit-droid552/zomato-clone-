import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Leaf } from 'lucide-react';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice.js';

const FALLBACK_FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60";

export const MenuItemCard = ({ item, restaurantId }) => {
  const dispatch = useDispatch();
  const { _id, name, description, price, image, isVeg, isBestselling, isTopRated, isTodaysSpecial } = item;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(image);

  // Retrieve current quantity from the Redux cart slice
  const cartItem = useSelector((state) =>
    state.cart.items.find((c) => c.foodItem === _id)
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    dispatch(
      addToCart({
        foodItem: _id,
        name,
        price,
        image,
        restaurantId,
      })
    );
  };

  const handleRemove = () => {
    dispatch(removeFromCart(_id));
  };

  return (
    <div className="flex justify-between items-center gap-6 p-4 sm:p-5 bg-white border border-slate-100 rounded-3xl hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 animate-pop-in">
      <div className="flex-1 space-y-2">
        <div className="flex items-center flex-wrap gap-2">
          {/* Veg / Non-Veg Indicator */}
          <span
            className={`flex items-center justify-center border-2 w-5 h-5 rounded-md p-0.5 shrink-0 ${
              isVeg ? 'border-emerald-500' : 'border-rose-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isVeg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>
          {isVeg && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 uppercase">
              <Leaf className="w-3 h-3" /> Veg
            </span>
          )}
          {isBestselling && (
            <span className="text-[9px] font-extrabold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md uppercase select-none tracking-wide">
              🔥 Bestseller
            </span>
          )}
          {isTopRated && (
            <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md uppercase select-none tracking-wide">
              ★ Top Rated
            </span>
          )}
          {isTodaysSpecial && (
            <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase select-none tracking-wide">
              ✨ Chef's Special
            </span>
          )}
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-800">{name}</h4>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <p className="text-base sm:text-lg font-extrabold text-slate-800">
          ₹{price}
        </p>
      </div>

      {/* Right Side: Image and Add Button */}
      <div className="relative flex flex-col items-center justify-center shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-2xl overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-2xl" />
        )}
        <img
          src={imgSrc}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImgSrc(FALLBACK_FOOD_IMAGE)}
          className={`w-full h-full object-cover rounded-2xl transition-all duration-500 ${
            imageLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-95'
          }`}
          loading="lazy"
        />

        {/* Floating Add/Quantity control */}
        <div className="absolute -bottom-3 select-none">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-white hover:bg-slate-50 text-zomato-pure font-bold text-xs sm:text-sm px-4 py-2 border border-slate-150 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ADD <Plus className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center bg-zomato-pure text-white font-bold text-xs sm:text-sm rounded-xl shadow-md divide-x divide-rose-400">
              <button
                onClick={handleRemove}
                className="px-2.5 py-2 hover:bg-rose-600 transition-colors rounded-l-xl cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-2 text-center min-w-[24px]">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="px-2.5 py-2 hover:bg-rose-600 transition-colors rounded-r-xl cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
