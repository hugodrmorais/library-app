"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NewLoanModal from "@/components/NewLoanModal";

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

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [editLoan, setEditLoan] = useState<Loan | null>(null);

  const fetchLoans = async () => {
    try {
      const response = await fetch("/api/loans");
      if (response.ok) {
        const loansData = await response.json();
        setLoans(loansData);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAddLoan = () => {
    setEditLoan(null);
    setIsLoanModalOpen(true);
  };

  const handleEditLoan = (loan: Loan) => {
    setEditLoan(loan);
    setIsLoanModalOpen(true);
  };

  const handleDeleteLoan = async (loan: Loan) => {
    if (!confirm(`Are you sure you want to delete this loan for book "${loan.book.title}"?`)) return;
    try {
      const response = await fetch(`/api/loans/${loan.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting loan');
      }
      fetchLoans();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    }
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
          <header className="text-3xl font-bold text-gray-900">📖 Loans</header>
          <button
            onClick={handleAddLoan}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ➕ Add Loan
          </button>
        </div>
        <p className="text-xl text-gray-800 mb-8">List of all active loans</p>
        {loans.filter(loan => loan.status === 'ACTIVE').length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.filter(loan => loan.status === 'ACTIVE').map((loan) => (
              <div key={loan.id} className="bg-white rounded-lg shadow-lg p-6 relative">
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
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditLoan(loan)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLoan(loan)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">No active loans at the moment.</p>
        )}
      </div>
      <NewLoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onLoanCreated={fetchLoans}
        loanToEdit={editLoan}
        onLoanUpdated={fetchLoans}
      />
    </div>
  );
}
