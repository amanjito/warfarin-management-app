import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/ui/Header";
import Navigation from "@/components/ui/Navigation";
import Dashboard from "@/pages/Dashboard";
import PTTracker from "@/pages/PTTracker";
import MedicationInfo from "@/pages/MedicationInfo";
import Reminders from "@/pages/Reminders";
import Assistant from "@/pages/Assistant";
import NotFound from "@/pages/not-found";

function Router() {
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
