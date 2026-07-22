import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout and components
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import RestaurantPage from './pages/RestaurantPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';

export const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Application Layout */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="restaurant/:id" element={<RestaurantPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="cart"
            element={
              <ProtectedRoute allowedRoles={['customer', 'partner', 'admin']}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute allowedRoles={['customer', 'partner', 'admin']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-success/:id"
            element={
              <ProtectedRoute allowedRoles={['customer', 'partner', 'admin']}>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={['customer', 'partner', 'admin']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback routing */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center font-bold text-slate-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
