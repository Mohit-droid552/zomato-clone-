import React, { useState } from 'react';
import { Search, MapPin, Compass, Keyboard, ChevronDown } from 'lucide-react';

export const Hero = ({ searchValue, onSearchChange, location, onLocationChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    setDropdownOpen(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch reverse geocode using free OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await response.json();
          
          const address = data.address || {};
          const city = address.city || address.town || address.suburb || address.state || "Unknown Location";
          
          onLocationChange(city, { lat: latitude, lon: longitude });
        } catch (err) {
          console.error(err);
          // Fallback to coordinates format on API fail
          onLocationChange(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, { lat: latitude, lon: longitude });
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error(error);
        alert(`Error getting location: ${error.message}`);
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setLocating(true);
    setDropdownOpen(false);

    try {
      // Forward geocode manual address input using Nominatim Search API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualInput.trim())}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const displayName = result.display_name.split(',')[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        onLocationChange(displayName, { lat, lon });
      } else {
        // Fallback: set location name directly and clear coordinates
        onLocationChange(manualInput.trim(), null);
      }
    } catch (err) {
      console.error(err);
      onLocationChange(manualInput.trim(), null);
    } finally {
      setLocating(false);
      setManualInput('');
      setShowManualForm(false);
    }
  };

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80')` 
        }}
      />
      {/* Radial shade */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 select-none pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight select-none">
            zomato
          </h1>
          <p className="text-lg md:text-2xl font-light text-slate-300">
            Discover the best food & drinks in your city
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl p-1 text-slate-800 max-w-2xl mx-auto divide-y sm:divide-y-0 sm:divide-x divide-slate-100 animate-pop-in">
          
          {/* Location selector dropdown */}
          <div className="relative sm:w-1/3 shrink-0">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setShowManualForm(false);
              }}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50 transition-colors rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none select-none cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-5 h-5 text-zomato-pure shrink-0" />
                <span className="text-sm font-bold text-slate-700 truncate">
                  {locating ? "Locating..." : (location || "Select Location")}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-450 shrink-0" />
            </button>

            {dropdownOpen && (
              <>
                {/* Backdrop overlay */}
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                
                {/* Dropdown panel */}
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-slate-100 shadow-2xl py-3 px-4 z-50 animate-pop-in text-left space-y-3">
                  <button
                    onClick={handleGetCurrentLocation}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50 hover:text-zomato-pure text-slate-700 font-bold text-xs sm:text-sm text-left transition-colors cursor-pointer"
                  >
                    <Compass className="w-5 h-5 text-zomato-pure shrink-0" />
                    <div>
                      <p>Use Current Location</p>
                      <p className="text-[10px] text-slate-400 font-medium normal-case">Detect via browser GPS</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-2" />

                  {showManualForm ? (
                    <form onSubmit={handleManualSubmit} className="space-y-2 animate-pop-in">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Enter City Name</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder="Search city (e.g. Mumbai, Delhi)..."
                          value={manualInput}
                          onChange={(e) => setManualInput(e.target.value)}
                          className="flex-1 text-xs font-semibold p-2.5 border border-slate-200 rounded-xl focus:border-zomato-pure focus:outline-none shadow-inner"
                        />
                        <button
                          type="submit"
                          className="bg-zomato-pure text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-rose-600 shadow-sm"
                        >
                          Save
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowManualForm(false)}
                        className="text-[10px] font-bold text-slate-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowManualForm(true)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm text-left transition-colors cursor-pointer"
                    >
                      <Keyboard className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p>Pin Location Manually</p>
                        <p className="text-[10px] text-slate-400 font-medium normal-case">Type your city name</p>
                      </div>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Restaurant / Cuisine Search */}
          <div className="flex items-center gap-2 px-4 py-3 flex-1">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search for restaurant or a dish..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-sm font-medium focus:outline-none bg-transparent placeholder-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
