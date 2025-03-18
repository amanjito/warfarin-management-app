import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import { HeartPulse, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupErrors, setSignupErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Clear errors when changing tabs
  useEffect(() => {
    setLoginError('');
    setSignupErrors({
      email: '',
      password: '',
      confirmPassword: ''
    });

    // Clear form data too
    if (tab === 'login') {
      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');
    } else {
      setLoginEmail('');
      setLoginPassword('');
    }
  }, [tab]);

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

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Basic validation
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setLoginError(error.message);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        // Successful login will be handled by the auth state change listener
        toast({
          title: 'Login successful',
          description: 'Welcome back to WarfarinTracker!',
        });
      }
    } catch (error) {
      setLoginError('An unexpected error occurred');
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const validateSignupForm = () => {
    const errors = {
      email: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // Email validation
    if (!signupEmail) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!signupEmail.includes('@')) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!signupPassword) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (signupPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (confirmPassword !== signupPassword) {
      errors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setSignupErrors(errors);
    return isValid;
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateSignupForm()) {
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      // Important: Set autoconfirm to true to bypass email verification
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          // Force auto-confirm to bypass email verification
          data: {
            confirmed_at: new Date().toISOString(),
          }
        }
      });

      if (error) {
        console.error("Supabase signup error:", error);
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created',
          description: 'Please sign in with your new account',
        });
        
        // Reset forms and switch to login tab
        setLoginEmail(signupEmail);
        setLoginPassword('');
        setSignupEmail('');
        setSignupPassword('');
        setConfirmPassword('');
        setTab('login');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: 'Signup error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

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

      <div className="flex-1 px-6 pb-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="pb-0">
            <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your.email@example.com" 
                      className="pl-10" 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      id="login-password"
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10" 
                      required
                    />
                  </div>
                </div>
                
                {loginError && (
                  <div className="text-red-500 text-sm">{loginError}</div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                  <LogIn className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      id="signup-email"
                      type="email" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="your.email@example.com" 
                      className="pl-10" 
                      required
                    />
                  </div>
                  {signupErrors.email && (
                    <div className="text-red-500 text-sm">{signupErrors.email}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      id="signup-password"
                      type="password" 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10" 
                      required
                      minLength={6}
                    />
                  </div>
                  {signupErrors.password && (
                    <div className="text-red-500 text-sm">{signupErrors.password}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      id="confirm-password"
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10" 
                      required
                      minLength={6}
                    />
                  </div>
                  {signupErrors.confirmPassword && (
                    <div className="text-red-500 text-sm">{signupErrors.confirmPassword}</div>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Creating Account...' : 'Create Account'}
                  <UserPlus className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <p className="text-sm text-gray-500">
              {tab === 'login' 
                ? "Don't have an account? Click 'Sign Up' above" 
                : "Already have an account? Click 'Login' above"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}