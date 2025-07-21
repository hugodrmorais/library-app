"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from '@/components/Modal';
import Book from '@/components/forms/Book';
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedAt: number;
  available: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const router = useRouter();

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      if (response.ok) {
        const booksData = await response.json();
        setBooks(booksData);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setEditBook(null);
    setIsBookModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setIsBookModalOpen(true);
  };

  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete the book "${book.title}"?`)) return;
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting book');
      }
      fetchBooks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // New handler for form submit
  const handleBookSubmit = () => {
    setIsBookModalOpen(false);
    fetchBooks();
    router.push("/books");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">Digital Library</Link>
          <div className="space-x-6">
            <Link href="/" className="text-gray-800 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link href="/books" className="text-gray-800 hover:text-blue-600 font-medium">Books</Link>
            <Link href="/users" className="text-gray-800 hover:text-blue-600 font-medium">Users</Link>
            <Link href="/loans" className="text-gray-800 hover:text-blue-600 font-medium">Loans</Link>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <header className="text-3xl font-bold text-gray-900">📚 Books</header>
          <button
            onClick={handleAddBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Add Book
          </button>
        </div>
        <p className="text-xl text-gray-800 mb-8">List of all registered books</p>
        {books.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-lg p-6 relative">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.available ? "Available" : "Borrowed"}
                  </span>
                </div>
                <p className="text-gray-800 mb-2">Author: {book.author}</p>
                <p className="text-gray-800 mb-2">ISBN: {book.isbn}</p>
                <p className="text-gray-800 mb-2">Category: {book.category}</p>
                <p className="text-gray-800">Year: {book.publishedAt}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">No books registered yet.</p>
        )}
      </div>
      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)}>
        <Book onSubmit={handleBookSubmit} initialData={editBook || undefined} />
      </Modal>
    </div>
  );
}
