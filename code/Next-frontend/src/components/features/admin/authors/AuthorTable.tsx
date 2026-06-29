"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Loader2, Users } from "lucide-react";
import { authorService } from "@/services/author";
import type { Author } from "@/types/author";
import AuthorModal from "./AuthorModal";
import { ADMIN } from "@/constants/ui-text/admin";

export default function AuthorTable() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorService.getAllAuthors();
      setAuthors(data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải danh sách thể loại");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleAdd = () => {
    setEditingAuthor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const [deleteAuthorId, setDeleteAuthorId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const textUI = ADMIN.MODAL.DELETE_AUTHOR;

  const handleDeleteClick = (id: number) => {
    setDeleteAuthorId(id);
  };

  const confirmDelete = async () => {
    if (deleteAuthorId === null) return;
    
    try {
      setIsDeleting(true);
      await authorService.deleteAuthor(deleteAuthorId);
      fetchAuthors();
      setDeleteAuthorId(null);
    } catch (err: any) {
      alert(err.message || "Lỗi khi xoá tác giả");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-surface-container-high bg-white">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink-950 flex items-center gap-2">
            <Users size={24} className="text-primary-600" />
            Quản lý Tác giả
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Thêm, sửa, xoá và quản lý các tác giả sách trong hệ thống.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-500 focus-ring shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Thêm tác giả mới
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-outline">
            <Loader2 size={32} className="animate-spin text-primary-500" />
            <p>Đang tải danh sách tác giả...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-error">
            <p>{error}</p>
            <button onClick={fetchAuthors} className="px-4 py-2 bg-surface-container-high rounded-lg text-on-surface hover:bg-surface-container-highest">Thử lại</button>
          </div>
        ) : authors.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-outline">
            <Users size={48} className="text-surface-container-highest" />
            <p>Chưa có tác giả nào.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-surface-container-high overflow-hidden shadow-sm">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-surface-container-lowest border-b border-surface-container-high">
                <tr>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant w-16 text-center">ID</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant w-1/3">Tên tác giả</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant w-1/2">Tiểu sử</th>
                  <th className="px-6 py-4 font-semibold text-on-surface-variant text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 text-center text-on-surface-variant">{author.id}</td>
                    <td className="px-6 py-4 font-medium text-ink-950">{author.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {author.biography || <span className="italic text-outline-variant">Không có tiểu sử</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(author)}
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors focus-ring"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(author.id)}
                          className="p-2 rounded-lg text-error hover:bg-error-50 transition-colors focus-ring"
                          title="Xoá"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AuthorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        author={editingAuthor}
        onSuccess={fetchAuthors}
      />

      {/* Delete Confirmation Modal */}
      {deleteAuthorId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-center text-lg font-semibold text-ink-950">{textUI.TITLE}</h3>
              <p className="mt-2 text-center text-sm text-on-surface-variant">
                {textUI.DESCRIPTION}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 bg-surface-container-lowest px-6 py-4 border-t border-surface-container-high">
              <button
                onClick={() => setDeleteAuthorId(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                disabled={isDeleting}
              >
                {textUI.CANCEL}
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center justify-center gap-2 rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white hover:bg-error-600 transition-colors w-[130px]"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : textUI.CONFIRM}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
