'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal'
import Book from '@/components/forms/Book'
import User from '@/components/forms/User'
import Loan from '@/components/forms/Loan'
import Link from "next/link";

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
      {/* Navigation Bar */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">Digital Library</Link>
          <div className="space-x-6">
            <Link href="/books" className="text-gray-800 hover:text-blue-600 font-medium">Books</Link>
            <Link href="/users" className="text-gray-800 hover:text-blue-600 font-medium">Users</Link>
            <Link href="/loans" className="text-gray-800 hover:text-blue-600 font-medium">Loans</Link>
          </div>
        </div>
      </nav>
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

        {/* Loans list removed from here */}

        <footer className="text-center mt-12 text-gray-600">
          <p>© 2024 Digital Library - Built with Next.js and Prisma</p>
        </footer>
      </div>

      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)}>
        <Book onSubmit={handleBookAdded} />
      </Modal>

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
        <User onSubmit={handleUserAdded} />
      </Modal>

      <Modal isOpen={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)}>
        <Loan onSubmit={handleLoanCreated} users={users} books={books} />
      </Modal>
    </div>
  );
}
