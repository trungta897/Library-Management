'use client'

import { Card, CardContent, CardHeader } from '@/components/base/Card'
import LoginForm from './LoginForm'

interface LoginPageProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export default function LoginPage({ onSubmit, isLoading = false }: LoginPageProps) {
  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-gradient-to-b from-primary-50 via-white to-secondary-50
        p-4
        relative
        overflow-hidden
      "
    >
      {/* 🎨 Decorative circles - top right */}
      <div
        className="
          absolute top-0 right-0
          w-96 h-96
          bg-primary-300 opacity-10
          rounded-full blur-3xl
          -mr-48 -mt-48
        "
      />

      {/* 🎨 Decorative circles - bottom left */}
      <div
        className="
          absolute bottom-0 left-0
          w-96 h-96
          bg-secondary-300 opacity-10
          rounded-full blur-3xl
          -ml-48 -mb-48
        "
      />

      {/* 📱 Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* 🏢 Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary-500 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
              📚
            </div>
            <h1 className="text-3xl font-bold text-primary-500">Lumina Library</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Quản lý thư viện thông minh và hiệu quả
          </p>
        </div>

        {/* 🎴 Login Card */}
        <Card>
          <CardHeader className="border-b-2 border-primary-50">
            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
            <p className="text-sm text-gray-600 mt-1">
              Nhập email và mật khẩu để truy cập
            </p>
          </CardHeader>

          <CardContent>
            <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* 🔒 Footer Text */}
        <div className="text-center mt-6 text-xs text-gray-500">
          🔒 Được bảo vệ bởi mã hóa SSL
        </div>
      </div>
    </div>
  )
}
