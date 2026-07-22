import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetail, clearRestaurantDetail } from '../store/slices/restaurantSlice.js';
import MenuItemCard from '../components/menu/MenuItemCard.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { Star, Clock, MapPin, ShoppingBag, Search, ChevronRight } from 'lucide-react';

export const RestaurantPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { restaurantDetail, menu, loading, error } = useSelector((state) => state.restaurant);
  const cart = useSelector((state) => state.cart);

  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');

  const [imgSrc, setImgSrc] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const FALLBACK_BANNER_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80";

  useEffect(() => {
    dispatch(fetchRestaurantDetail(id));

    return () => {
      dispatch(clearRestaurantDetail());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (restaurantDetail) {
      setImgSrc(restaurantDetail.image);
      setImageLoaded(false);
    }
  }, [restaurantDetail]);

  if (loading && !restaurantDetail) {
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

  if (!restaurantDetail) {
    return null;
  }

  // Filter menu items
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesSearch && matchesVeg;
  });

  // Group menu by categories
  const categories = [...new Set(filteredMenu.map((item) => item.category))];

  // Calculate items in cart from this restaurant
  const itemsInCartFromThisRestaurant = cart.restaurantId === id ? cart.items : [];
  const totalItemsCount = itemsInCartFromThisRestaurant.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pb-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-100 py-3 text-xs sm:text-sm font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-zomato-pure transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 truncate">{restaurantDetail.name}</span>
        </div>
      </div>

      {/* Restaurant Header section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-md bg-slate-900">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse" />
          )}
          <img
            src={imgSrc}
            alt={restaurantDetail.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgSrc(FALLBACK_BANNER_IMAGE)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {restaurantDetail.cuisine.map((c) => (
                <span key={c} className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  {c}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {restaurantDetail.name}
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-semibold text-slate-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-zomato-pure" />
                {restaurantDetail.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                {restaurantDetail.deliveryTime} mins Delivery Time
              </span>
            </div>
          </div>

          {/* Rating Badge inside header */}
          <div className="absolute top-6 right-6 flex items-center gap-1 bg-white text-slate-800 font-extrabold text-sm sm:text-base px-3.5 py-1.5 rounded-2xl shadow-lg">
            <span>{restaurantDetail.rating.toFixed(1)}</span>
            <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 mt-8 gap-8">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'border-zomato-pure text-zomato-pure'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Order Online
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-zomato-pure text-zomato-pure'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Overview
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === 'menu' ? (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-5">
                <h3 className="font-bold text-slate-800 text-base">Search menu</h3>
                <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full text-xs font-semibold focus:outline-none bg-transparent placeholder-slate-400 text-slate-700"
                  />
                </div>

                <div className="border-t border-slate-50 pt-4">
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <span className="text-sm font-semibold text-slate-600">Veg Only</span>
                    <input
                      type="checkbox"
                      checked={vegOnly}
                      onChange={(e) => setVegOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Menu Feed */}
            <div className="lg:col-span-3 space-y-12">
              {filteredMenu.length === 0 ? (
                <EmptyState
                  type="search"
                  title="No Menu Items Found"
                  description="We couldn't find any dishes matching your query. Try resetting filters!"
                  onAction={() => {
                    setMenuSearch('');
                    setVegOnly(false);
                  }}
                />
              ) : (
                categories.map((category) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-800 tracking-tight pl-1 border-l-4 border-zomato-pure">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredMenu
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <MenuItemCard
                            key={item._id}
                            item={item}
                            restaurantId={id}
                          />
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Overview Tab */
          <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
            <h3 className="text-xl font-bold text-slate-800">About {restaurantDetail.name}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Welcome to {restaurantDetail.name}! Located at {restaurantDetail.address}, we are proud to offer high quality cuisines including {restaurantDetail.cuisine.join(', ')}. With a preparation rating of {restaurantDetail.rating.toFixed(1)} and delivery time of {restaurantDetail.deliveryTime} minutes, we stand ready to serve you!
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-sm">
              <div>
                <p className="text-slate-400 font-semibold">Average Cost</p>
                <p className="text-slate-800 font-bold text-base mt-0.5">₹{restaurantDetail.costForTwo} for two people</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold">Owner Partner</p>
                <p className="text-slate-800 font-bold text-base mt-0.5">Verified Partner Merchant</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating cart summary bar */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex justify-between items-center animate-pop-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zomato-pure rounded-xl">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} added
                </p>
                <p className="text-sm font-extrabold text-white">
                  ₹{cart.totalAmount} <span className="text-xs font-semibold text-slate-400">(Excl. taxes)</span>
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="bg-zomato-pure hover:bg-rose-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              View Cart <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;
