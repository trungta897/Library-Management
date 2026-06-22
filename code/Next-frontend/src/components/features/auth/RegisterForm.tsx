'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { registerSchema, type RegisterFormData } from '@/schemas/auth'
import { authService } from '@/services/auth'
import Input from '@/components/base/Input'
import Button from '@/components/base/Button'

export default function RegisterForm() {
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // 🔄 Form submit handler — gọi API thực
  const handleFormSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // 📡 Gọi API đăng ký thực
      const result = await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phoneNumber || undefined,
      })

      console.log('✅ Đăng ký thành công:', result)
      setSuccessMessage(`Đăng ký thành công! Chào mừng ${result.fullName}`)

      // Chuyển đến trang login sau 2 giây
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Đăng ký thất bại. Vui lòng thử lại.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* ✅ Success Alert */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-500 text-green-700 flex items-start gap-3 animate-fade-in">
          <span className="text-xl flex-shrink-0">✅</span>
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* ⚠️ Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-500 text-red-700 flex items-start gap-3 animate-fade-in">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      {/* 👤 Full Name Input */}
      <Input
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        type="text"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      {/* 📱 Phone Number Input */}
      <Input
        label="Số điện thoại"
        placeholder="0901234567"
        type="tel"
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      {/* 📧 Email Input */}
      <Input
        label="Email Address"
        placeholder="name@example.com"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* 🔐 Password Input */}
      <Input
        label="Password"
        placeholder="••••••••"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* 🔐 Confirm Password Input */}
      <Input
        label="Confirm Password"
        placeholder="••••••••"
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* 🔘 Submit Button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Đang đăng ký...' : 'Đăng ký →'}
      </Button>

      {/* 📝 Login Link */}
      <div className="text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link
          href="/login"
          className="text-primary-500 hover:text-primary-700 font-medium"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  )
}