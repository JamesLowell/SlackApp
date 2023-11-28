import React from 'react'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem("uid");
  console.log('isAuthenticated:', isAuthenticated);
  if (!isAuthenticated) {
    alert('Please login to access the page');
    return <Navigate to="/log-in" replace={true} />;
  }

  return <>{children}</>;
}