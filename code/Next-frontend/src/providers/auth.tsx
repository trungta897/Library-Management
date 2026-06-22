'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '@/services/auth'

// 👤 User type definition
interface User {
  id: string
  email: string
  fullName: string
  role: string
}

// 🔑 Auth Context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => Promise<void>
}

// 📌 Create Auth Context with default undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🔒 Helper to parse JWT payload
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

// 🏗️ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 🔄 Check if user is already logged in (on mount)
  useEffect(() => {
    try {
      const token = authService.getToken()
      if (token) {
        const decoded = parseJwt(token)
        if (decoded) {
          setUser({
            id: String(decoded.userId || ''),
            email: decoded.sub || '',
            fullName: decoded.fullName || '',
            role: (decoded.role || 'USER').toLowerCase(),
          })
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
    }
    setIsMounted(true)
  }, [])

  // 🔓 Login function
  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true)
    try {
      const userData = await authService.login(email, password, rememberMe)
      setUser(userData)
      return userData
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 📝 Register function
  const register = useCallback(async (fullName: string, email: string, password: string, phone?: string) => {
    setIsLoading(true)
    try {
      const result = await authService.register({ fullName, email, password, phone })
      // Sau khi đăng ký thành công, set user từ response
      setUser({
        id: String(result.id),
        email: result.email,
        fullName: result.fullName,
        role: result.role,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 🚪 Logout function
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 📦 Context value
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 🎣 Custom Hook - useAuth
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
