import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60";

export const RestaurantCard = ({ restaurant }) => {
  const { _id, name, image, cuisine, rating, deliveryTime, costForTwo, isFeatured, distance } = restaurant;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <Link
      to={`/restaurant/${_id}`}
      className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-pop-in"
    >
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {/* Pulsing loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}
        {/* Restaurant Cover Image */}
        <img
          src={imgSrc}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className={`h-full w-full object-cover group-hover:scale-105 transition-all duration-500 ease-out ${
            imageLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-95'
          }`}
          loading="lazy"
        />

        {/* Featured Tag */}
        {isFeatured && (
          <span className="absolute top-4 left-4 bg-slate-900/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-sm">
            Featured
          </span>
        )}

        {/* Floating Proximity Distance */}
        {distance !== undefined && distance !== null && (
          <span className="absolute bottom-4 left-4 bg-white/90 text-slate-800 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1 shadow-sm border border-slate-50">
            <MapPin className="w-3.5 h-3.5 text-zomato-pure" />
            {distance} km away
          </span>
        )}

        {/* Floating Delivery Time */}
        <span className="absolute bottom-4 right-4 bg-white/90 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {deliveryTime} mins
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-zomato-pure transition-colors line-clamp-1">
              {name}
            </h3>
            {/* Rating Badge */}
            <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg shrink-0">
              {rating.toFixed(1)}
              <Star className="w-3 h-3 fill-current" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 line-clamp-1 font-medium">
            {cuisine.join(', ')}
          </p>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-50 text-sm font-semibold text-slate-600">
          <span>Est. Delivery</span>
          <span className="text-slate-800">₹{costForTwo} for two</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
