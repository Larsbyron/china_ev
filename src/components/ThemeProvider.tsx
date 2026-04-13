'use client'

import { useEffect } from 'react'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Apply theme on mount
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    const theme = stored || (prefersLight ? 'light' : 'dark')
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  return <>{children}</>
}