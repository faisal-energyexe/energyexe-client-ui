import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'obsidian'
type Mode = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  mode: Mode
  setTheme: (theme: Theme) => void
  setMode: (mode: Mode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const themeConfig: Record<Theme, { name: string; description: string; icon: string }> = {
  'obsidian': {
    name: 'Obsidian',
    description: 'Deep navy with sophisticated blue and cyan accents',
    icon: '🌊',
  },
}

export function ThemeProvider({
  children,
  defaultTheme = 'obsidian',
  defaultMode = 'dark'
}: {
  children: ReactNode
  defaultTheme?: Theme
  defaultMode?: Mode
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('energyexe-theme')
      if (stored === 'obsidian') return stored
    }
    return defaultTheme
  })
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('energyexe-mode')
      if (stored === 'light' || stored === 'dark') return stored
    }
    return defaultMode
  })

  useEffect(() => {
    // Apply theme and mode classes to document
    const root = document.documentElement

    // Remove mode class
    root.classList.remove('dark')

    // Add current theme class
    root.classList.add('theme-obsidian')

    // Add dark mode class if applicable
    if (mode === 'dark') {
      root.classList.add('dark')
    }
  }, [theme, mode])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('energyexe-theme', newTheme)
  }

  const setMode = (newMode: Mode) => {
    setModeState(newMode)
    localStorage.setItem('energyexe-mode', newMode)
  }

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
