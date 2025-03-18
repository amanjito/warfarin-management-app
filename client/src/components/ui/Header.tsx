import { useState } from "react";
import { Bell, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Check if we're in demo mode
      const isSkipAuth = localStorage.getItem('skipAuth') === 'true';
      
      if (isSkipAuth) {
        // Clear the skipAuth flag
        localStorage.removeItem('skipAuth');
        // Mark that we're coming from demo mode to go directly to auth page
        sessionStorage.setItem('fromDemo', 'true');
        toast({
          title: "Exited demo mode",
          description: "You have been logged out of demo mode",
        });
      } else {
        // Regular Supabase logout
        await supabase.auth.signOut();
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account",
        });
      }
      
      // Redirect to auth page
      setLocation('/auth');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem signing you out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center">
          <svg 
            className="mr-2 h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M11 5a3 3 0 0 1 6 0v6.343a3 3 0 0 1-1.154 2.358L13 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3l-1.846-2.3A3 3 0 0 1 0 11.342V5a3 3 0 0 1 6 0v2a3 3 0 0 0 6 0V5z" />
          </svg>
          WarfarinTracker
        </h1>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="hover:bg-blue-600 mr-2 text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-blue-600 text-white">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
