import type { Metadata } from 'next';
import { AuthProvider } from '@/providers/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumina Library - Quản lý thư viện thông minh',
  description: 'Hệ thống quản lý thư viện hiện đại với giao diện dễ sử dụng',
  icons: {
    icon: '📚',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
