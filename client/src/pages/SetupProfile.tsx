import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { getQueryFn } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import MedicalHistoryForm from '@/components/profile/MedicalHistoryForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function SetupProfile() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  // Fetch the current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/users/current'],
    queryFn: getQueryFn<User>({ on401: 'throw' }),
    enabled: !!userId,
  });

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          // Not logged in, redirect to auth page
          setLocation('/auth');
          return;
        }

        // Use user ID 1 in our mock environment
        setUserId(1);

        // Check if user has already completed setup
        const userResponse = await fetch('/api/users/current');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          if (userData.hasCompletedSetup) {
            // Setup already completed, redirect to dashboard
            setLocation('/dashboard');
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setLocation('/auth');
      }
    };

    checkAuth();
  }, [setLocation]);

  const handleSetupComplete = () => {
    setLocation('/dashboard');
  };

  if (loading || isUserLoading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
        
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {userId && <MedicalHistoryForm userId={userId} onComplete={handleSetupComplete} />}
    </div>
  );
}