import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/authContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function RouteGuard({ children, requireAuth = true }: RouteGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [isInDemoMode, setIsInDemoMode] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Check if user is in demo mode
    const demoMode = localStorage.getItem('demoMode') === 'true';
    setIsInDemoMode(demoMode);
    
    // Handle normal authentication flow or demo mode
    if (!loading) {
      if (requireAuth) {
        if (!isAuthenticated && !demoMode) {
          // Not authenticated and not in demo mode - redirect to auth
          setLocation('/auth');
        }
      } else {
        // This is a public route (like auth or intro)
        if ((isAuthenticated || demoMode) && (location === '/auth' || location === '/intro')) {
          // User is authenticated or in demo mode but trying to access auth pages
          // Redirect to dashboard
          setLocation('/dashboard');
        }
      }
      
      // Set local loading to false as we've completed our checks
      setLocalLoading(false);
    }
  }, [isAuthenticated, loading, location, requireAuth, setLocation]);

  // Show loading indicator while checking authentication
  if (loading || localLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication check passed (or demo mode is active), render children
  return <>{children}</>;
}