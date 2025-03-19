import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={toggleTheme}
        aria-label="تغییر تم"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-slate-500" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-300" />
        )}
      </Button>
    </motion.div>
  );
}