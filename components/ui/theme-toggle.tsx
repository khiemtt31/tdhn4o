'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme/theme-context'

interface ThemeToggleProps {
  variant?: 'floating' | 'inline'
}

export function ThemeToggle({ variant = 'floating' }: ThemeToggleProps = {}) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const buttonClass = variant === 'floating'
    ? "fixed top-4 right-4 z-50 h-10 w-10 rounded-full shadow-lg"
    : "h-9 w-9"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={buttonClass}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}