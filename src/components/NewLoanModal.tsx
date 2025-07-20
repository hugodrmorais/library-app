'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
}

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanCreated: () => void;
  loanToEdit?: Loan | null;
  onLoanUpdated?: () => void;
}

interface Loan {
  id: string;
  userId: string;
  bookId: string;
  borrowedAt: string;
  dueDate: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
  book: {
    title: string;
    author: string;
    isbn: string;
  };
}

export default function NewLoanModal({ isOpen, onClose, onLoanCreated, loanToEdit, onLoanUpdated }: NewLoanModalProps) {
  const [formData, setFormData] = useState({
    userId: '',
    bookId: '',
    dueDate: ''
  });
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchBooks();
    }
  }, [isOpen]);

  useEffect(() => {
    if (loanToEdit) {
      setFormData({
        userId: loanToEdit.userId,
        bookId: loanToEdit.bookId,
        dueDate: loanToEdit.dueDate.split('T')[0]
      });
    } else {
      setFormData({
        userId: '',
        bookId: '',
        dueDate: ''
      });
    }
  }, [loanToEdit, isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const booksData = await response.json();
        // For editing, show all books; for new, only available
        const availableBooks = loanToEdit
          ? booksData
          : booksData.filter((book: Book) => book.available);
        setBooks(availableBooks);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let response;
      if (loanToEdit) {
        response = await fetch(`/api/loans/${loanToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('/api/loans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error saving loan');
      }

      if (loanToEdit && onLoanUpdated) {
        onLoanUpdated();
      } else {
        onLoanCreated();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{loanToEdit ? '✏️ Edit Loan' : '📖 New Loan'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              User *
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Book *
            </label>
            <select
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} (ISBN: {book.isbn})
                </option>
              ))}
            </select>
            {books.length === 0 && (
              <p className="text-sm text-gray-600 mt-1">
                No available books for loan
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || books.length === 0}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? (loanToEdit ? 'Saving...' : 'Creating...') : (loanToEdit ? 'Save Changes' : 'Create Loan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
