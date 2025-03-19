import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren, Omit<NextThemesProviderProps, 'children'> {}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure we only render theme switching in the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}

export const ThemeToggle = createContext({
  theme: "light",
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeToggle)