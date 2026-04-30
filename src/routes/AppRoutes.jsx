import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';
import { AdminLayout } from '../admin/AdminLayout';

// Public pages
const Home           = React.lazy(() => import('../pages/Home.jsx').then(m => ({ default: m.Home })));
const Shop           = React.lazy(() => import('../pages/Shop.jsx').then(m => ({ default: m.Shop })));
const ProductDetails = React.lazy(() => import('../pages/ProductDetails.jsx').then(m => ({ default: m.ProductDetails })));
const Login          = React.lazy(() => import('../pages/Login.jsx').then(m => ({ default: m.Login })));
const Register       = React.lazy(() => import('../pages/Register.jsx').then(m => ({ default: m.Register })));

// Protected pages
const Cart     = React.lazy(() => import('../pages/Cart.jsx').then(m => ({ default: m.Cart })));
const Checkout = React.lazy(() => import('../pages/Checkout.jsx').then(m => ({ default: m.Checkout })));
const Profile  = React.lazy(() => import('../pages/Profile.jsx').then(m => ({ default: m.Profile })));

// Admin pages
const AdminDashboard = React.lazy(() => import('../admin/AdminDashboard.jsx').then(m => ({ default: m.AdminDashboard })));
const AdminProducts  = React.lazy(() => import('../admin/AdminProducts.jsx').then(m => ({ default: m.AdminProducts })));
const AdminOrders    = React.lazy(() => import('../admin/AdminOrders.jsx').then(m => ({ default: m.AdminOrders })));
const AdminCustomers = React.lazy(() => import('../admin/AdminCustomers.jsx').then(m => ({ default: m.AdminCustomers })));
const AdminInventory = React.lazy(() => import('../admin/AdminInventory.jsx').then(m => ({ default: m.AdminInventory })));
const AdminCoupons   = React.lazy(() => import('../admin/AdminCoupons.jsx').then(m => ({ default: m.AdminCoupons })));
const AdminReviews   = React.lazy(() => import('../admin/AdminReviews.jsx').then(m => ({ default: m.AdminReviews })));
const AdminBanners   = React.lazy(() => import('../admin/AdminBanners.jsx').then(m => ({ default: m.AdminBanners })));
const AdminContent   = React.lazy(() => import('../admin/AdminContent.jsx').then(m => ({ default: m.AdminContent })));
const AdminAnalytics = React.lazy(() => import('../admin/AdminAnalytics.jsx').then(m => ({ default: m.AdminAnalytics })));
const AdminSettings  = React.lazy(() => import('../admin/AdminSettings.jsx').then(m => ({ default: m.AdminSettings })));
const AdminEnquiries = React.lazy(() => import('../admin/AdminEnquiries.jsx').then(m => ({ default: m.AdminEnquiries })));
const AdminPetProfiles = React.lazy(() => import('../admin/AdminPetProfiles.jsx'));

// Pet Profile pages
const PetOnboarding = React.lazy(() => import('../pages/PetOnboarding.jsx'));
const PetProfile    = React.lazy(() => import('../pages/PetProfile.jsx'));

const Spinner = () => (
  <div className="flex justify-center items-center min-h-screen" style={{ background: '#e0f4ee' }}>
    <div className="w-10 h-10 border-4 border-brand-border rounded-full animate-spin" style={{ borderTopColor: '#073b3a' }} />
  </div>
);

const AdminPage = ({ children }) => (
  <AdminLayout>{children}</AdminLayout>
);

const AppRoutes = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      {/* Public */}
      <Route path="/"                element={<Home />} />
      <Route path="/shop"            element={<Shop />} />
      <Route path="/product/:id"     element={<ProductDetails />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />

      {/* Protected (customers) */}
      {/* /cart redirects directly to /checkout — no separate cart page */}
      <Route path="/cart"           element={<Navigate to="/checkout" replace />} />
      <Route path="/checkout"       element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/pets"   element={<ProtectedRoute><PetProfile /></ProtectedRoute>} />
      <Route path="/onboarding/pet" element={<ProtectedRoute><PetOnboarding /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin"            element={<AdminRoute><AdminPage><AdminDashboard /></AdminPage></AdminRoute>} />
      <Route path="/admin/products"   element={<AdminRoute><AdminPage><AdminProducts /></AdminPage></AdminRoute>} />
      <Route path="/admin/orders"     element={<AdminRoute><AdminPage><AdminOrders /></AdminPage></AdminRoute>} />
      <Route path="/admin/customers"  element={<AdminRoute><AdminPage><AdminCustomers /></AdminPage></AdminRoute>} />
      <Route path="/admin/inventory"  element={<AdminRoute><AdminPage><AdminInventory /></AdminPage></AdminRoute>} />
      <Route path="/admin/coupons"    element={<AdminRoute><AdminPage><AdminCoupons /></AdminPage></AdminRoute>} />
      <Route path="/admin/reviews"    element={<AdminRoute><AdminPage><AdminReviews /></AdminPage></AdminRoute>} />
      <Route path="/admin/banners"    element={<AdminRoute><AdminPage><AdminBanners /></AdminPage></AdminRoute>} />
      <Route path="/admin/content"    element={<AdminRoute><AdminPage><AdminContent /></AdminPage></AdminRoute>} />
      <Route path="/admin/analytics"  element={<AdminRoute><AdminPage><AdminAnalytics /></AdminPage></AdminRoute>} />
      <Route path="/admin/settings"   element={<AdminRoute><AdminPage><AdminSettings /></AdminPage></AdminRoute>} />
      <Route path="/admin/enquiries"  element={<AdminRoute><AdminPage><AdminEnquiries /></AdminPage></AdminRoute>} />
      <Route path="/admin/pet-profiles" element={<AdminRoute><AdminPage><AdminPetProfiles /></AdminPage></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#e0f4ee' }}>
          <p className="text-7xl mb-6">🐾</p>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-3">Page Not Found</h1>
          <a href="/" className="btn-brand">Go Home</a>
        </div>
      } />
    </Routes>
  </Suspense>
);

export default AppRoutes;
