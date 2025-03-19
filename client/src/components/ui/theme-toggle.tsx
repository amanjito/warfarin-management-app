import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle({ variant = "outline", className, size = "icon" }: {
  variant?: "outline" | "ghost" | "link" | "default" | "destructive" | "secondary" | null | undefined
  className?: string
  size?: "icon" | "default" | "sm" | "lg" | null | undefined
}) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Component must be client-side to use localStorage or CSS variables
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button 
            variant={variant || "ghost"} 
            size={size || "icon"} 
            className={`${className || "text-slate-500 hover:bg-slate-100 rounded-full"}`}
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
            <span className="sr-only">تغییر تم</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="py-2">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={`py-2 pr-3 text-sm ${theme === "light" ? "text-primary" : ""}`}
        >
          <Sun className="ml-2 h-4 w-4 rtl-icon" />
          <span>روشن</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={`py-2 pr-3 text-sm ${theme === "dark" ? "text-primary" : ""}`}
        >
          <Moon className="ml-2 h-4 w-4 rtl-icon" />
          <span>تاریک</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={`py-2 pr-3 text-sm ${theme === "system" ? "text-primary" : ""}`}
        >
          <Monitor className="ml-2 h-4 w-4 rtl-icon" />
          <span>سیستم</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}