'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { loginSchema, type LoginFormData } from '@/schemas/auth'
import Input from '@/components/base/Input'
import Checkbox from '@/components/base/Checkbox'
import Button from '@/components/base/Button'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  // 🔄 Form submit handler
  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage('')
      await onSubmit(data)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* ⚠️ Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-error-50 border border-error-500 text-error-500 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      {/* 📧 Email Input */}
      <Input
        label="Email"
        placeholder="example@email.com"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* 🔐 Password Input */}
      <Input
        label="Mật khẩu"
        placeholder="••••••••"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* 🔗 Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Ghi nhớ tôi"
          {...register('rememberMe')}
        />
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary-500 hover:text-primary-700 font-medium"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {/* 🔘 Submit Button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      {/* 📝 Sign Up Link */}
      <div className="text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link
          href="/register"
          className="text-primary-500 hover:text-primary-700 font-semibold"
        >
          Đăng ký ngay
        </Link>
      </div>
    </form>
  )
}
