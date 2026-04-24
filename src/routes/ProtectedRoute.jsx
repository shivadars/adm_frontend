import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector(s => s.auth);
  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};
