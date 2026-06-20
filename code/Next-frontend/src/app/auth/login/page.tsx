'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth'
import LoginPage from '@/components/features/LoginPage'
import { LoginFormData } from '@/schemas/auth'

export default function LoginPageRoute() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated } = useAuth()

  // 🔄 Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // 🔐 Handle login submission
  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, data.rememberMe)
      // ✅ Login successful -> redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      // ❌ Login failed -> error sẽ được show trong form
      console.error('Login failed:', error)
      throw error
    }
  }

  return (
    <LoginPage
      onSubmit={handleLogin}
      isLoading={isLoading}
    />
  )
}
