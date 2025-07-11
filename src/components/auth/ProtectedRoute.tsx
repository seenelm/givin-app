import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required, check if user is admin
  // This is a placeholder - you'll need to implement admin check logic
  if (requireAdmin) {
    // Example check - you would replace this with your actual admin check
    const isAdmin = user.email === 'admin@example.com'; // Replace with your admin logic
    
    if (!isAdmin) {
      return (
        <div className="auth-denied">
          <h1>Admin Access Required</h1>
          <p>
            You need administrator privileges to access this page.
          </p>
        </div>
      );
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
