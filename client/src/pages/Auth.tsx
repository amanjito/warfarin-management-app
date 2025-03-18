import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('signin');

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is signed in, redirect to dashboard
        setLocation('/');
      }
    };
    
    checkUser();
  }, [setLocation]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You've been signed in successfully.",
      });
      
      setLocation('/');
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email for a confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    
    try {
      // Use a demo account for testing
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demopassword',
      });
      
      if (error) {
        // If demo login fails, use anonymous session
        toast({
          title: "Using demo mode",
          description: "You're using the app without an account."
        });
        setLocation('/');
        return;
      }
      
      setLocation('/');
    } catch (error) {
      // Use anonymous session
      toast({
        title: "Using demo mode",
        description: "You're using the app without an account."
      });
      setLocation('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-card">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">WarfarinTracker</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to track your medication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="px-0 text-xs" type="button">
                      Forgot Password?
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" type="button" className="w-full" onClick={() => {
                  supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: window.location.origin
                    }
                  });
                }}>
                  Google
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" type="button" className="w-full" onClick={() => {
                  supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: window.location.origin
                    }
                  });
                }}>
                  Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={handleDemo}>
            Continue without an account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}