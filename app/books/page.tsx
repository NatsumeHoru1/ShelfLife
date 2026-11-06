'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBook, Book } from '@/context/BookContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BooksPage() {
  const { user, loadingUser, books, addBook, updateBookStatus, deleteBook } = useBook();

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState<number | ''>('');
  const [status, setStatus] = useState<'read' | 'reading' | 'finished'>('reading');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 1. Protected Route check (Khi F5 giữ nguyên trang, không bị văng)
  if (loadingUser) {
    return (
      <div className="py-24 text-center text-slate-500 font-semibold text-base sm:text-lg">
        ⏳ Đang tải dữ liệu kệ sách của bạn...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto bg-white p-8 rounded-2xl border shadow-sm">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Truy cập bị giới hạn</h2>
        <p className="text-slate-600 mb-6 text-sm">
          Vui lòng đăng nhập tài khoản của bạn để xem và quản lý kệ sách cá nhân.
        </p>
        <Link href="/login">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">
            Đăng nhập ngay
          </Button>
        </Link>
      </div>
    );
  }

  // 2. [A] Xử lý thêm sách (Chặn hoàn toàn việc để trống)
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const numPages = Number(pages);

    if (!trimmedTitle) {
      setFormError('Tiêu đề sách không được để trống');
      return;
    }
    if (trimmedTitle.length > 80) {
      setFormError('Tiêu đề sách tối đa 80 ký tự');
      return;
    }

    if (!trimmedAuthor) {
      setFormError('Tên tác giả không được để trống');
      return;
    }
    if (trimmedAuthor.length > 60) {
      setFormError('Tên tác giả tối đa 60 ký tự');
      return;
    }

    if (!pages || isNaN(numPages) || numPages < 1 || numPages > 5000) {
      setFormError('Số trang phải từ 1 đến 5000');
      return;
    }

    setSubmitting(true);
    const { error } = await addBook({
      title: trimmedTitle,
      author: trimmedAuthor,
      pages: numPages,
      status,
    });
    setSubmitting(false);

    if (error) {
      setFormError(error.message || 'Không thể thêm sách');
    } else {
      setTitle('');
      setAuthor('');
      setPages('');
      setStatus('reading');
    }
  };

  // 3. [B] Nút Advance di chuyển: read -> reading -> finished (Biến mất khi finished)
  const handleAdvance = async (book: Book) => {
    if (book.status === 'read') {
      await updateBookStatus(book.id, 'reading');
    } else if (book.status === 'reading') {
      await updateBookStatus(book.id, 'finished');
    }
  };

  // 4. [C] Lọc sách: Bỏ qua mọi phần tử để trống và lọc theo từ khóa, trạng thái
  const filteredBooks = books
    .filter((b) => b.title && b.title.trim() !== '' && b.author && b.author.trim() !== '')
    .filter((b) => {
      const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
      const matchesSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

  // Nút Clear / Reset
  const handleReset = () => {
    setSearchTerm('');
    setSelectedStatus('all');
  };

  // Tính toán Summary & Breakdown động theo danh sách đang hiển thị
  const currentCount = filteredBooks.length;
  const totalPages = filteredBooks.reduce((sum, b) => sum + (b.pages || 0), 0);
  const readingCount = filteredBooks.filter((b) => b.status === 'reading').length;
  const readCount = filteredBooks.filter((b) => b.status === 'read').length;
  const finishedCount = filteredBooks.filter((b) => b.status === 'finished').length;

  return (
    <div className="space-y-6 py-4 sm:py-6">
      {/* Tiêu đề trang */}
      <div className="border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>📚 My Shelf</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi tiến độ đọc, số trang và quản lý vòng đời sách trên kệ của bạn.
        </p>
      </div>

      {/* KHUNG BỐ CỤC CHUẨN:
          - Mobile 375px: 1 cột (grid-cols-1), form và chữ đọc rõ ràng không tràn viền.
          - Desktop >= 1280px (xl:): Form và Summary nằm KẾ BÊN danh sách sách (xl:grid-cols-12). */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
        
        {/* ========================================================
            CỘT TRÁI (xl:col-span-5): SUMMARY & FORM ADD A BOOK
           ======================================================== */}
        <div className="xl:col-span-5 space-y-6 w-full">
          
          {/* [C] SUMMARY & BREAKDOWN */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
                <span>📊 Summary & Breakdown</span>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  {currentCount} books
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Books</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{currentCount}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Pages</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{totalPages.toLocaleString()}</p>
                </div>
              </div>

              {/* Breakdown 3 trạng thái */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded bg-purple-50 border border-purple-100 text-purple-800">
                  <span className="font-bold text-base block">{readCount}</span>
                  <span className="text-[11px]">Read</span>
                </div>
                <div className="p-2 rounded bg-blue-50 border border-blue-100 text-blue-800">
                  <span className="font-bold text-base block">{readingCount}</span>
                  <span className="text-[11px]">Reading</span>
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-100 text-emerald-800">
                  <span className="font-bold text-base block">{finishedCount}</span>
                  <span className="text-[11px]">Finished</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* [A] FORM ADD A BOOK */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>➕</span> Add a Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="book-title" className="text-xs font-bold text-slate-700">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[10px] text-slate-400">{title.length}/80</span>
                  </div>
                  <Input
                    id="book-title"
                    data-testid="input-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={80}
                    placeholder="e.g. Clean Code"
                    className="w-full text-sm"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="book-author" className="text-xs font-bold text-slate-700">
                      Author <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[10px] text-slate-400">{author.length}/60</span>
                  </div>
                  <Input
                    id="book-author"
                    data-testid="input-author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    maxLength={60}
                    placeholder="e.g. Robert C. Martin"
                    className="w-full text-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="book-pages" className="text-xs font-bold text-slate-700 mb-1 block">
                    Pages <span className="text-red-500">*</span> (1 - 5000)
                  </Label>
                  <Input
                    id="book-pages"
                    data-testid="input-pages"
                    type="number"
                    min={1}
                    max={5000}
                    value={pages}
                    onChange={(e) => setPages(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 464"
                    className="w-full text-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="book-status" className="text-xs font-bold text-slate-700 mb-1 block">
                    Status
                  </Label>
                  <select
                    id="book-status"
                    data-testid="select-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="reading">📖 Reading</option>
                    <option value="read">👀 Read (To Read)</option>
                    <option value="finished">✅ Finished</option>
                  </select>
                </div>

                {formError && (
                  <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                    {formError}
                  </p>
                )}

                <Button
                  type="submit"
                  data-testid="btn-add-book"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-sm"
                >
                  {submitting ? 'Adding...' : 'Add Book to Shelf'}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>

        {/* ========================================================
            CỘT PHẢI (xl:col-span-7): SEARCH, FILTER & THE LIST
           ======================================================== */}
        <div className="xl:col-span-7 space-y-4 w-full">
          
          {/* [C] SEARCH, FILTER VÀ NÚT CLEAR / RESET */}
          <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="🔍 Tìm theo tên sách hoặc tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm w-full"
              />
              {(searchTerm !== '' || selectedStatus !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50 font-semibold whitespace-nowrap"
                >
                  ✕ Clear
                </Button>
              )}
            </div>

            {/* Các tab Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'reading', 'read', 'finished'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    selectedStatus === st
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* [B] THE LIST (DANH SÁCH SÁCH) */}
          {filteredBooks.length === 0 ? (
            <div
              data-testid="books-empty"
              className="py-16 text-center text-slate-500 bg-white rounded-xl border border-dashed"
            >
              <div className="text-3xl mb-2">📚</div>
              <p className="font-semibold text-slate-700">Không tìm thấy sách nào</p>
              <p className="text-xs text-slate-400 mt-1">
                {books.length === 0
                  ? 'Kệ sách của bạn đang trống. Hãy thêm cuốn sách đầu tiên ở form bên cạnh!'
                  : 'Không có cuốn sách nào khớp với từ khóa hoặc bộ lọc.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  data-testid="book-item"
                  className="bg-white p-4 sm:p-5 rounded-xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 data-testid="book-title" className="font-bold text-slate-900 text-base leading-snug">
                        {book.title}
                      </h3>
                      {/* Badge hiển thị trạng thái */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          book.status === 'reading'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : book.status === 'finished'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {book.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Tác giả: <span data-testid="book-author" className="font-semibold text-slate-700">{book.author}</span>
                      <span className="text-slate-300 mx-2">•</span>
                      <span data-testid="book-pages" className="text-slate-600">{book.pages} trang</span>
                    </p>
                  </div>

                  {/* CÁC NÚT THAO TÁC */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* NÚT ADVANCE: read -> reading -> finished (Biến mất khi finished) */}
                    {book.status !== 'finished' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdvance(book)}
                        className="text-xs font-bold border-emerald-500 text-emerald-700 hover:bg-emerald-50 h-8 px-3"
                      >
                        {book.status === 'read' ? 'Start Reading →' : 'Finish ✓'}
                      </Button>
                    )}

                    {/* NÚT DELETE */}
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="btn-delete-book"
                      onClick={() => deleteBook(book.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-700 text-xs h-8 px-2.5"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
