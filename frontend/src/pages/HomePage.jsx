import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../store/slices/restaurantSlice.js';
import Hero from '../components/home/Hero.jsx';
import RestaurantCard from '../components/home/RestaurantCard.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { SlidersHorizontal, Check } from 'lucide-react';

export const HomePage = () => {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.restaurant);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxDeliveryTime, setMaxDeliveryTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem('user_location') || ''
  );

  // User coordinates state
  const [userCoords, setUserCoords] = useState(() => {
    try {
      const stored = localStorage.getItem('user_coords');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Popular cuisines list
  const cuisines = ['Italian', 'American', 'Indian', 'Fast Food', 'Desserts'];

  // Save location to localStorage
  useEffect(() => {
    localStorage.setItem('user_location', selectedLocation);
  }, [selectedLocation]);

  // Save coordinates to localStorage
  useEffect(() => {
    if (userCoords) {
      localStorage.setItem('user_coords', JSON.stringify(userCoords));
    } else {
      localStorage.removeItem('user_coords');
    }
  }, [userCoords]);

  // Haversine formula to compute distance in km
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Load restaurants on mount and filter changes
  useEffect(() => {
    dispatch(
      fetchRestaurants({
        search: searchQuery,
        cuisine: selectedCuisine,
        minRating,
        maxDeliveryTime,
      })
    );
  }, [dispatch, searchQuery, selectedCuisine, minRating, maxDeliveryTime]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('');
    setMinRating('');
    setMaxDeliveryTime('');
  };

  const handleResetLocation = () => {
    setSelectedLocation('');
    setUserCoords(null);
    localStorage.removeItem('user_location');
  };

  const handleLocationChange = (address, coords) => {
    setSelectedLocation(address);
    setUserCoords(coords);
  };

  // Helper to extract city from location string for filtering
  const getCityFromLocation = (loc) => {
    if (!loc) return null;
    const cities = ["Delhi", "Bengaluru", "Mumbai", "Hyderabad", "Kolkata", "Chennai", "Pune", "Lucknow", "Jaipur", "Ahmedabad"];
    for (const city of cities) {
      if (loc.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    return null;
  };

  const activeCity = getCityFromLocation(selectedLocation);

  // 1. Filter restaurants by city text matching first (explicit location specified), or fallback to proximity radius
  let filteredByLocation = restaurants;
  if (activeCity) {
    filteredByLocation = restaurants.filter((r) =>
      r.address.toLowerCase().includes(activeCity.toLowerCase())
    );
  } else if (userCoords) {
    // If coordinates are available but city name is unrecognized, show within 100km radius
    filteredByLocation = restaurants.filter((r) => {
      const distance = getDistance(
        userCoords.lat,
        userCoords.lon,
        r.coordinates?.lat,
        r.coordinates?.lon
      );
      return distance !== null && distance < 100;
    });
  }

  // 2. Sort the filtered location list by proximity if coordinates are available
  const filteredRestaurants = [...filteredByLocation]
    .map((r) => {
      const distance = getDistance(
        userCoords?.lat,
        userCoords?.lon,
        r.coordinates?.lat,
        r.coordinates?.lon
      );
      return { ...r, distance };
    })
    .sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance; // closest first
      }
      if (a.isFeatured !== b.isFeatured) {
        return b.isFeatured ? 1 : -1;
      }
      return b.rating - a.rating;
    });

  return (
    <div className="pb-16">
      {/* Hero Header with Search Bar and Location Selector */}
      <Hero
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        location={selectedLocation}
        onLocationChange={handleLocationChange}
      />

      {/* Main feed container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Popular Restaurants
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Top-rated dining spots and delivery kitchens
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </div>

            {/* Rating Filter Toggle */}
            <button
              onClick={() => setMinRating(minRating === '4.0' ? '' : '4.0')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                minRating === '4.0'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
              }`}
            >
              {minRating === '4.0' && <Check className="w-3 h-3" />}
              Rating 4.0+
            </button>

            {/* Delivery Time Toggle */}
            <button
              onClick={() => setMaxDeliveryTime(maxDeliveryTime === '30' ? '' : '30')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                maxDeliveryTime === '30'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
              }`}
            >
              {maxDeliveryTime === '30' && <Check className="w-3 h-3" />}
              Fast Delivery (&lt; 30 mins)
            </button>

            {/* Clear Button */}
            {(selectedCuisine || minRating || maxDeliveryTime || searchQuery || userCoords) && (
              <button
                onClick={() => {
                  handleClearFilters();
                  handleResetLocation();
                }}
                className="text-xs font-bold text-zomato-pure hover:underline"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Cuisine Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => setSelectedCuisine('')}
            className={`px-5 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap active:scale-95 transition-all shrink-0 cursor-pointer ${
              selectedCuisine === ''
                ? 'bg-zomato-pure text-white shadow-md'
                : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-200 shadow-sm'
            }`}
          >
            All Cuisines
          </button>
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(selectedCuisine === c ? '' : c)}
              className={`px-5 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap active:scale-95 transition-all shrink-0 cursor-pointer ${
                selectedCuisine === c
                  ? 'bg-zomato-pure text-white shadow-md'
                  : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-200 shadow-sm'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Restaurant Grid Display */}
        {loading ? (
          <LoadingState type="skeleton-grid" />
        ) : error ? (
          <div className="text-center py-16 text-rose-500 font-bold">{error}</div>
        ) : filteredRestaurants.length === 0 ? (
          <EmptyState
            type="search"
            title="No Restaurants Found"
            description={
              (activeCity || userCoords)
                ? `We couldn't find any dining options near your selected location ("${selectedLocation || activeCity}"). Try searching another city like Mumbai or Delhi!`
                : "We couldn't find any dining options matching your criteria. Try adjusting filters!"
            }
            actionText={(activeCity || userCoords) ? "Reset Location" : "Clear Filters"}
            onAction={(activeCity || userCoords) ? handleResetLocation : handleClearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
