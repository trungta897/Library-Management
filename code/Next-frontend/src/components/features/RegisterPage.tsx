'use client'

import RegisterForm from './RegisterForm'

interface RegisterPageProps {
  onSubmit: (data: any) => Promise<void>  
  isLoading?: boolean
}

export default function RegisterPage({ onSubmit, isLoading = false }: RegisterPageProps) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 🎨 Sidebar Section */}
      <div className="w-0 md:w-2/5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-8 md:p-12 flex-col justify-between relative overflow-hidden hidden md:flex">
        {/* 🎨 Decorative background shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          {/* Logo & Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-400 text-slate-900 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
                📚
              </div>
              <h1 className="text-3xl font-bold">Lumina Library</h1>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed">
              Quản lý thư viện thông minh và hiệu quả với công nghệ AI
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">📖</span>
              <div>
                <h3 className="font-semibold text-blue-50">Quản lý sách</h3>
                <p className="text-blue-200 text-sm">Quản lý toàn bộ bộ sưu tập sách của bạn</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">👥</span>
              <div>
                <h3 className="font-semibold text-blue-50">Quản lý thành viên</h3>
                <p className="text-blue-200 text-sm">Theo dõi thành viên và mượn sách</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">📊</span>
              <div>
                <h3 className="font-semibold text-blue-50">Báo cáo & Thống kê</h3>
                <p className="text-blue-200 text-sm">Xem chi tiết hoạt động thư viện</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-8 border-t border-blue-400 border-opacity-20">
          <p className="text-blue-200 text-sm">
            © 2024 Lumina Library AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* 📱 Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 md:w-3/5">
        <div className="w-full max-w-md">
          {/* 📱 Mobile Logo (show on mobile only) */}
          <div className="md:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
                📚
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Lumina Library</h1>
            </div>
          </div>

          {/* 🎴 Register Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Tạo tài khoản mới
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Nhập thông tin để bắt đầu hành trình với Lumina Library
            </p>

            {/* Form Component */}
            <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
          </div>

          {/* 🔒 Security Info */}
          <div className="text-center mt-6 text-xs text-gray-500">
            🔒 Được bảo vệ bởi mã hóa SSL
          </div>
        </div>
      </div>
    </div>
  )
}
