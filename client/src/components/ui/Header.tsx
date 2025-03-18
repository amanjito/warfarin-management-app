import { useEffect, useState } from "react";
import { Bell, UserCircle, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/authContext";
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from "wouter";

export default function Header() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is in demo mode
    const demoMode = localStorage.getItem('demoMode') === 'true';
    setIsDemoMode(demoMode);
  }, []);

  const handleSignOut = async () => {
    try {
      if (isDemoMode) {
        // If in demo mode, just clear the localStorage flag
        localStorage.removeItem('demoMode');
        setIsDemoMode(false);
        
        toast({
          title: "Exited demo mode",
          description: "You have been signed out from demo mode.",
        });
        
        // Redirect to auth page
        setLocation('/auth');
      } else {
        // Normal sign out for authenticated users
        await signOut();
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  const displayName = user?.email?.split('@')[0] || 'Demo User';

  // Show the header with profile menu if authenticated or in demo mode
  const showProfileMenu = isAuthenticated || isDemoMode;

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold flex items-center cursor-pointer">
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
            WarfarinTracker {isDemoMode && <span className="text-xs ml-2">(Demo)</span>}
          </h1>
        </Link>
        {showProfileMenu && (
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {isDemoMode ? 'Demo Mode' : 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isDemoMode ? 'Exit Demo' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
