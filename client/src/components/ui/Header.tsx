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
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
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
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center tracking-tight">
          <svg 
            className="mr-3 h-6 w-6" 
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
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="/dashboard" className="hover:text-blue-100 transition-colors flex items-center space-x-2">
            <span>Dashboard</span>
          </a>
          <a href="/pt-tracker" className="hover:text-blue-100 transition-colors flex items-center space-x-2">
            <span>PT Tracker</span>
          </a>
          <a href="/medication" className="hover:text-blue-100 transition-colors flex items-center space-x-2">
            <span>Medication</span>
          </a>
          <a href="/reminders" className="hover:text-blue-100 transition-colors flex items-center space-x-2">
            <span>Reminders</span>
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-blue-600/50 transition-colors text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-blue-600/50 transition-colors text-white">
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
