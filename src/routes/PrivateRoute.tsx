import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { ReactElement } from 'react';

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in: redirect to login, saving where they tried to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in: render the requested page
  return children;
}
