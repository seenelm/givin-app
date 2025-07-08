// src/routes/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { ReactElement } from 'react';


export default function PrivateRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
