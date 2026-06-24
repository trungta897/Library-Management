// 📚 API Service cho Books

import type { Book, BookListItem } from '@/types/book';

// Response type từ backend
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

// Gọi qua Next.js proxy route (relative URL) để tránh CORS
const API_URL = '';

export const bookService = {
  // 📖 Lấy danh sách tất cả sách
  async getBooks(): Promise<BookListItem[]> {
    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ApiResponse<BookListItem[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Không thể lấy danh sách sách');
      }

      return result.data || [];
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
      }
      throw error;
    }
  },

  // 📖 Lấy danh sách top 10 sách đánh giá cao nhất
  async getTopRatedBooks(): Promise<BookListItem[]> {
    try {
      const response = await fetch(`${API_URL}/api/books/top-rated`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ApiResponse<BookListItem[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Không thể lấy danh sách top sách');
      }

      return result.data || [];
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
      }
      throw error;
    }
  },

  // 📖 Lấy chi tiết 1 cuốn sách theo ID
  async getBookById(id: number): Promise<Book> {
    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ApiResponse<Book> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Không tìm thấy sách');
      }

      if (!result.data) {
        throw new Error('Không tìm thấy sách');
      }

      return result.data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
      }
      throw error;
    }
  },
};
