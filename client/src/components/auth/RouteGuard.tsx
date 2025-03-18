import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/authContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function RouteGuard({ children, requireAuth = true }: RouteGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // If authentication is required but user is not authenticated
    if (!loading && requireAuth && !isAuthenticated) {
      // Redirect to auth page
      setLocation('/auth');
    }

    // If user is authenticated and trying to access auth pages
    if (!loading && isAuthenticated && (location === '/auth' || location === '/intro')) {
      // Redirect to dashboard
      setLocation('/');
    }
  }, [isAuthenticated, loading, location, requireAuth, setLocation]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication check passed, render children
  return <>{children}</>;
}