import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User as UserIcon, LogOut, ClipboardList, Menu, X } from 'lucide-react';
import { logout } from '../../store/slices/authSlice.js';
import { clearCart } from '../../store/slices/cartSlice.js';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const totalCartItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-100 glassmorphism shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-zomato-pure bg-clip-text">
              zomato
            </span>
            <span className="bg-zomato-100 text-zomato-pure text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md">
              Clone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 text-slate-600 hover:text-zomato-pure transition-colors flex items-center"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zomato-pure text-[10px] font-bold text-white ring-2 ring-white">
                      {totalCartItems}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-slate-200 hover:border-zomato-pure transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-zomato-100 text-zomato-pure flex items-center justify-center font-bold text-sm">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 pr-2">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-100 shadow-xl py-1 z-20 animate-pop-in">
                        <div className="px-4 py-2 border-b border-slate-50">
                          <p className="text-xs text-slate-400">Logged in as</p>
                          <p className="text-sm font-semibold text-slate-700 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ClipboardList className="w-4 h-4 text-slate-400" />
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-zomato-pure font-semibold text-sm transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-zomato-pure text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            {isAuthenticated && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-600 flex items-center"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zomato-pure text-[10px] font-bold text-white ring-2 ring-white">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3 animate-pop-in">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 border-b border-slate-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zomato-100 text-zomato-pure flex items-center justify-center font-bold text-base">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{user?.name}</h4>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>

              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                <ClipboardList className="w-5 h-5 text-slate-400" />
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold text-sm transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-rose-400" />
                Log Out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center py-2.5 bg-zomato-pure rounded-xl text-white font-semibold text-sm hover:bg-rose-600 shadow-sm transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
