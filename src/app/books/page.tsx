'use client'

import { useState, useEffect } from 'react'
import BookForm from '@/components/forms/BookForm'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  publishedAt: number
  available: boolean
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/books?${params}`)
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error('Erro ao buscar livros:', error)
    }
  }

  const handleAddBook = async (bookData: any) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      })

      if (response.ok) {
        setShowForm(false)
        fetchBooks()
      }
    } catch (error) {
      console.error('Erro ao adicionar livro:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Livros</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Adicionar Livro'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Adicionar Novo Livro</h2>
          <BookForm onSubmit={handleAddBook} />
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Buscar livros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todas as categorias</option>
          <option value="Ficção">Ficção</option>
          <option value="Não-Ficção">Não-Ficção</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="História">História</option>
          <option value="Ciência">Ciência</option>
        </select>
        <button
          onClick={fetchBooks}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Buscar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-2">Autor: {book.author}</p>
            <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
            <p className="text-gray-600 mb-2">Categoria: {book.category}</p>
            <p className="text-gray-600 mb-2">Ano: {book.publishedAt}</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                book.available
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {book.available ? 'Disponível' : 'Indisponível'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
