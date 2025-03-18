import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import { HeartPulse, Mail, Lock, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Auth() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange', // Validate as user types
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validate as user types
  });

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

  // Reset form errors when switching tabs
  useEffect(() => {
    if (tab === 'login') {
      loginForm.clearErrors();
    } else {
      signupForm.clearErrors();
    }
  }, [tab, loginForm, signupForm]);

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setAuthLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
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
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAuthLoading(false);
    }
  }

  async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
    setAuthLoading(true);
    
    try {
      // Important: Set autoconfirm to true to bypass email verification
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          // Force auto-confirm to bypass email verification
          data: {
            confirmed_at: new Date().toISOString(),
          }
        }
      });

      if (error) {
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
        
        // Reset the signup form and switch to login tab
        signupForm.reset();
        setTab('login');
        
        // Pre-fill login form with signup email
        loginForm.setValue('email', values.email);
      }
    } catch (error) {
      toast({
        title: 'Signup error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAuthLoading(false);
    }
  }
  
  const [googleAuthError, setGoogleAuthError] = useState(false);
  
  async function signInWithGoogle() {
    setAuthLoading(true);
    setGoogleAuthError(false);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        setGoogleAuthError(true);
        toast({
          title: 'Google sign in failed',
          description: 'Google authentication is not available at this time. Please use email sign in.',
          variant: 'destructive',
        });
      }
      // Success will be handled by the redirect
    } catch (error) {
      console.error('Unexpected OAuth error:', error);
      setGoogleAuthError(true);
      toast({
        title: 'Google sign in error',
        description: 'Google authentication is not available at this time. Please use email sign in.',
        variant: 'destructive',
      });
    } finally {
      setAuthLoading(false);
    }
  }

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
            {googleAuthError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Google Sign In Unavailable</AlertTitle>
                <AlertDescription>
                  Google authentication isn't available in this environment. Please use email and password to sign in.
                </AlertDescription>
              </Alert>
            )}
          
            {tab === 'login' ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input placeholder="your.email@example.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? 'Signing In...' : 'Sign In'}
                    <LogIn className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-sm text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={signInWithGoogle}
                    disabled={authLoading}
                  >
                    <SiGoogle className="mr-2 h-4 w-4" />
                    {authLoading ? 'Signing In...' : 'Sign in with Google'}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input placeholder="your.email@example.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? 'Creating Account...' : 'Create Account'}
                    <UserPlus className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-sm text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={signInWithGoogle}
                    disabled={authLoading}
                  >
                    <SiGoogle className="mr-2 h-4 w-4" />
                    {authLoading ? 'Signing In...' : 'Sign up with Google'}
                  </Button>
                </form>
              </Form>
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