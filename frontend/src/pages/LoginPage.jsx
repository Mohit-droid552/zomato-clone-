import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice.js';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Retrieve origin route redirect
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, from, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleQuickFill = () => {
    setEmail('demo@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-100 rounded-3xl p-8 shadow-lg animate-pop-in">
        <div className="text-center space-y-2">
          <span className="text-4xl font-black tracking-tight text-zomato-pure">zomato</span>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm font-semibold text-slate-400">
            Log in to manage your orders, addresses, and discover deals
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
          <div className="space-y-4">
            {/* Email field */}
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

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl focus-within:border-zomato-pure transition-colors bg-slate-50">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
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
                Log In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-2 select-none">
          <p className="text-xs font-semibold text-slate-500">Testing the app?</p>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs font-bold text-zomato-pure hover:underline focus:outline-none cursor-pointer"
          >
            Quick fill demo customer credentials
          </button>
        </div>

        <p className="text-center text-sm font-semibold text-slate-500">
          New to Zomato?{' '}
          <Link to="/signup" className="text-zomato-pure font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
