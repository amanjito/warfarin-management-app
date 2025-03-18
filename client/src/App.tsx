import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";

import Header from "@/components/ui/Header";
import Navigation from "@/components/ui/Navigation";
import Dashboard from "@/pages/Dashboard";
import PTTracker from "@/pages/PTTracker";
import MedicationInfo from "@/pages/MedicationInfo";
import Reminders from "@/pages/Reminders";
import Assistant from "@/pages/Assistant";
import NotFound from "@/pages/not-found";
import Intro from "@/pages/Intro";
import Auth from "@/pages/Auth";
import RouteGuard from "@/components/auth/RouteGuard";

function AuthenticatedApp() {
  const [location] = useLocation();
  
  return (
    <>
      <Header />
      <Navigation activeTab={location.split('/')[1] || 'dashboard'} />
      <main className="flex-1 container mx-auto px-4 py-6">
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
    </>
  );
}

function Router() {
  // Let the RouteGuard handle loading states
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/intro">
        <RouteGuard requireAuth={false}>
          <Intro />
        </RouteGuard>
      </Route>
      <Route path="/auth">
        <RouteGuard requireAuth={false}>
          <Auth />
        </RouteGuard>
      </Route>
      
      {/* Protected routes */}
      <Route path="/:rest*">
        <RouteGuard>
          <AuthenticatedApp />
        </RouteGuard>
      </Route>
    </Switch>
  );
}

function App() {
  const [, setLocation] = useLocation();
  
  // Check if user has visited the app before
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    // If first visit, redirect to intro
    if (!hasVisitedBefore) {
      localStorage.setItem('hasVisitedBefore', 'true');
      setLocation('/intro');
    }
  }, [setLocation]);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Router />
      <Toaster />
    </div>
  );
}

export default App;
