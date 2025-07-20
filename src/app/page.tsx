'use client';

import { useState, useEffect } from 'react';
import AddBookModal from '@/components/AddBookModal';
import AddUserModal from '@/components/AddUserModal';
import NewLoanModal from '@/components/NewLoanModal';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedAt: number;
  available: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    loans: number;
  };
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

export default function Home() {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeLoans: 0
  });

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const booksData = await response.json();
        setBooks(booksData);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

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

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/loans');
      if (response.ok) {
        const loansData = await response.json();
        setLoans(loansData);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const updateStats = () => {
    setStats({
      totalBooks: books.length,
      availableBooks: books.filter(book => book.available).length,
      totalUsers: users.length,
      activeLoans: loans.filter(loan => loan.status === 'ACTIVE').length
    });
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
    fetchLoans();
  }, []);

  useEffect(() => {
    updateStats();
  }, [books, users, loans]);

  const handleBookAdded = () => {
    fetchBooks();
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleLoanCreated = () => {
    fetchBooks();
    fetchLoans();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Digital Library
          </h1>
          <p className="text-xl text-gray-800">
            Book and loan management system
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📊 Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-800">Total Books:</span>
                <span className="font-semibold text-gray-900">{stats.totalBooks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Available Books:</span>
                <span className="font-semibold text-gray-900">{stats.availableBooks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Active Users:</span>
                <span className="font-semibold text-gray-900">{stats.totalUsers}</span>
              </div>
            </div>
          </div>

                    {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ⚡ Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ Add Book
              </button>
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                👤 Register User
              </button>
              <button
                onClick={() => setIsLoanModalOpen(true)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                📖 New Loan
              </button>
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔧 System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-800">Database: Connected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-800">Prisma: Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-800">Next.js: Running</span>
              </div>
            </div>
          </div>
        </div>

                {/* Books List */}
        {books.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Registered Books</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2">Author: {book.author}</p>
                  <p className="text-gray-800 mb-2">ISBN: {book.isbn}</p>
                  <p className="text-gray-800 mb-2">Category: {book.category}</p>
                  <p className="text-gray-800">Year: {book.publishedAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users List */}
        {users.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Registered Users</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2">Email: {user.email}</p>
                  <p className="text-gray-800 mb-2">Loans: {user._count.loans}</p>
                  <p className="text-gray-800">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Loans List */}
        {loans.filter(loan => loan.status === 'ACTIVE').length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 Active Loans</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.filter(loan => loan.status === 'ACTIVE').map((loan) => (
                <div key={loan.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{loan.book.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2">Borrowed by: {loan.user.name}</p>
                  <p className="text-gray-800 mb-2">Author: {loan.book.author}</p>
                  <p className="text-gray-800 mb-2">Due Date: {new Date(loan.dueDate).toLocaleDateString()}</p>
                  <p className="text-gray-800">Borrowed: {new Date(loan.borrowedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center mt-12 text-gray-600">
          <p>© 2024 Digital Library - Built with Next.js and Prisma</p>
        </footer>
      </div>

      <AddBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onBookAdded={handleBookAdded}
      />

      <AddUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      <NewLoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onLoanCreated={handleLoanCreated}
      />
    </div>
  );
}
