'use client';

import { useState, useEffect } from 'react';

interface LoanProps {
  onSubmit: () => void;
  initialData?: any;
  users: any[];
  books: any[];
}

export default function Loan({ onSubmit, initialData, users, books }: LoanProps) {
  const [formData, setFormData] = useState({
    userId: '',
    bookId: '',
    dueDate: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId || '',
        bookId: initialData.bookId || '',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        userId: '',
        bookId: '',
        dueDate: ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      let response;
      if (initialData && initialData.id) {
        // Edit loan
        response = await fetch(`/api/loans/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Create loan
        response = await fetch('/api/loans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        setFormError(errorData.error || 'Error saving loan');
        setSubmitting(false);
        return;
      }
      onSubmit();
    } catch (err) {
      setFormError('Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formError}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">User *</label>
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
        <label className="block text-sm font-medium text-gray-800 mb-1">Book *</label>
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
          <p className="text-sm text-gray-600 mt-1">No available books for loan</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Due Date *</label>
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
      <button
        type="submit"
        disabled={submitting || books.length === 0}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {submitting ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Loan')}
      </button>
    </form>
  );
}
