'use client'

import { useAuth } from '@/providers/auth'
import Button from '@/components/base/Button'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-500">Dashboard</h1>
            <p className="text-gray-600">Chào mừng trở lại, {user?.fullName || 'Người dùng'}!</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            isLoading={isLoading}
          >
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Thông tin tài khoản</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Tên:</strong> {user?.fullName}</p>
            <p><strong>Vai trò:</strong> {user?.role}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
