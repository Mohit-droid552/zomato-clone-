import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-8 mb-12">
            <div>
              <span className="text-3xl font-black tracking-tight text-white">zomato</span>
              <p className="mt-2 text-sm text-slate-500">Deliciousness delivered straight to your doorstep.</p>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
              <span className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-white bg-slate-800">
                🇺🇸 English
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-white bg-slate-800">
                United States
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">About Zomato</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Who We Are</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Work With Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">Zomaverse</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Zomato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blinkit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feeding India</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hyperpure</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">For Restaurants</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Apps For You</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">Learn More</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-4">
            <p>© {new Date().getFullYear()} Zomato Clone. Developed with ❤️ for demonstration.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
