import React from 'react';

export const LoadingState = ({ type = 'spinner' }) => {
  if (type === 'skeleton-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-slate-200" />
            <div className="p-5 space-y-3">
              <div className="h-6 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-6 bg-slate-200 rounded w-1/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'skeleton-menu') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl animate-pulse">
            <div className="w-24 h-24 bg-slate-200 rounded-xl" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-12 h-12 border-4 border-zomato-100 border-t-zomato-pure rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Loading delicious food...</p>
    </div>
  );
};

export default LoadingState;
