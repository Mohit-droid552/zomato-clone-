import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice.js';
import { Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, ShoppingBag, Store } from 'lucide-react';

export const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    dispatch(registerUser({ name, email, password, role }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-100 rounded-3xl p-8 shadow-lg animate-pop-in">
        <div className="text-center space-y-2">
          <span className="text-4xl font-black tracking-tight text-zomato-pure">zomato</span>
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-sm font-semibold text-slate-400">
            Sign up to order delicious food and track your deliveries
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-sm font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Account Role Selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'customer'
                  ? 'bg-white text-zomato-pure shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'partner'
                  ? 'bg-white text-zomato-pure shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Merchant Partner
            </button>
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
              <div className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl focus-within:border-zomato-pure transition-colors bg-slate-50">
                <UserIcon className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm font-semibold focus:outline-none bg-transparent placeholder-slate-400 text-slate-700"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl focus-within:border-zomato-pure transition-colors bg-slate-50">
                <Mail className="w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm font-semibold focus:outline-none bg-transparent placeholder-slate-400 text-slate-700"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl focus-within:border-zomato-pure transition-colors bg-slate-50">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm font-semibold focus:outline-none bg-transparent placeholder-slate-400 text-slate-700"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-zomato-pure hover:bg-rose-600 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl active:scale-98 cursor-pointer disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign Up <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm font-semibold text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-zomato-pure font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
