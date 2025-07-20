"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AddUserModal from "@/components/AddUserModal";
import { prisma } from '@/lib/prisma';

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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setEditUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete the user "${user.name}"?`)) return;
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting user');
      }
      fetchUsers();
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
          <header className="text-3xl font-bold text-gray-900">👥 Users</header>
          <button
            onClick={handleAddUser}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ➕ Add User
          </button>
        </div>
        <p className="text-xl text-gray-800 mb-8">List of all registered users</p>
        {users.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-lg p-6 relative">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-gray-800 mb-2">Email: {user.email}</p>
                <p className="text-gray-800 mb-2">Loans: {user._count.loans}</p>
                <p className="text-gray-800">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">No users registered yet.</p>
        )}
      </div>
      <AddUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserAdded={fetchUsers}
        userToEdit={editUser}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
}
