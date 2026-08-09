import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return <Loader label="Checking your session…" />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'NGO' ? '/ngo-dashboard' : '/donor-dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
