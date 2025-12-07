'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, userSchema } from '@/lib/validations/auth'

interface UserContextType {
  user: User | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'user'

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage or sessionStorage on mount
  useEffect(() => {
    const localUser = localStorage.getItem(USER_STORAGE_KEY)
    const sessionUser = sessionStorage.getItem(USER_STORAGE_KEY)
    const storedUser = localUser || sessionUser

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        const validatedUser = userSchema.parse(parsedUser)
        setUser(validatedUser)
      } catch (error) {
        console.error('Invalid user data in storage:', error)
        localStorage.removeItem(USER_STORAGE_KEY)
        sessionStorage.removeItem(USER_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // Fetch user from API if not in storage
  useEffect(() => {
    if (!user && !isLoading) {
      fetchUserFromAPI()
    }
  }, [user, isLoading])

  const fetchUserFromAPI = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        const validatedUser = userSchema.parse(data.user)
        setUser(validatedUser)
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(validatedUser))
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const login = async (email: string, password: string, rememberMe?: boolean): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      if (response.ok) {
        const data = await response.json()
        const validatedUser = userSchema.parse(data.user)
        setUser(validatedUser)
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem(USER_STORAGE_KEY, JSON.stringify(validatedUser))
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API error:', error)
    }
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
    sessionStorage.removeItem(USER_STORAGE_KEY)
  }

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}