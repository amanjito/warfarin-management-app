import { useEffect, useState } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import { HeartPulse } from 'lucide-react';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        setLocation('/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setLocation('/dashboard');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setLocation]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <HeartPulse className="h-16 w-16 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 text-center mb-4">
        <div className="mb-6 flex justify-center">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center">
            <HeartPulse className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Welcome to WarfarinTracker</h1>
        <p className="text-gray-600 mt-2">Sign in or create a new account to continue</p>
      </div>

      <div className="flex-1 px-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2196F3',
                    brandAccent: '#1976D2',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
            }}
            providers={['google']}
            redirectTo={window.location.origin + '/dashboard'}
          />
        </div>
      </div>
    </div>
  );
}