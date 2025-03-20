import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Header from "@/components/ui/Header";
import Navigation from "@/components/ui/Navigation";
import Dashboard from "@/pages/Dashboard";
import PTTracker from "@/pages/PTTracker";
import MedicationInfo from "@/pages/MedicationInfo";
import Reminders from "@/pages/Reminders";
import Assistant from "@/pages/Assistant";
import NotFound from "@/pages/not-found";
import IntroPages from "@/pages/IntroPages";
import Auth from "@/pages/Auth";

// Check if user has seen intro pages
const hasSeenIntro = () => {
  return localStorage.getItem('hasSeenIntro') === 'true';
};

// Set that user has seen intro pages
const setSeenIntro = () => {
  localStorage.setItem('hasSeenIntro', 'true');
};

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={() => {
        // If user has seen intro, redirect to auth page
        if (hasSeenIntro()) {
          return <Redirect to="/auth" />;
        }
        
        // Mark intro as seen and show intro pages
        setSeenIntro();
        return <IntroPages />;
      }} />
      <Route path="/intro" component={IntroPages} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PrivateRouter() {
  const [location] = useLocation();
  
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-28">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/pt-tracker" component={PTTracker} />
          <Route path="/medication" component={MedicationInfo} />
          <Route path="/reminders" component={Reminders} />
          <Route path="/assistant" component={Assistant} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Navigation activeTab={location.split('/')[1] || 'dashboard'} />
    </>
  );
}

function App() {
  // Initially set isAuthenticated to null (loading state)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check current auth status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      // Enable real auth check
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      // Enable real auth check
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking auth (not needed now but kept for when we restore auth)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-slate-950">
        {isAuthenticated ? <PrivateRouter /> : <PublicRouter />}
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
