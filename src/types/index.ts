export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
  createdAt: Date
  updatedAt: Date
}

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  publishedAt: number
  available: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Loan {
  id: string
  userId: string
  bookId: string
  borrowedAt: Date
  returnedAt?: Date
  dueDate: Date
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE'
  user: User
  book: Book
  createdAt: Date
  updatedAt: Date
}
