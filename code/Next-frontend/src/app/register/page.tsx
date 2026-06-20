'use client'

import RegisterForm from "@/components/features/RegisterForm";
import { RegisterFormData } from "@/schemas/auth";

export default function RegisterPage() {
  // Hàm xử lý khi nhấn nút Đăng ký
  const handleRegister = async (data: RegisterFormData) => {
    console.log("Dữ liệu đăng ký:", data);
    // Ở đây sau này bạn sẽ gọi API thật
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar trang trí */}
      <div className="hidden md:flex w-2/5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-6">📚 Lumina Library</h1>
          <p className="text-blue-100">Hệ thống quản lý thư viện thông minh.</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tạo tài khoản</h2>
          {/* Truyền hàm handleRegister vào đây để hết lỗi */}
          <RegisterForm onSubmit={handleRegister} />
        </div>
      </div>
    </div>
  );
}
