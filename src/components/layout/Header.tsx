'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            Biblioteca App
          </Link>

          <nav className="flex space-x-6">
            <Link href="/dashboard" className="hover:text-blue-200">
              Dashboard
            </Link>
            <Link href="/books" className="hover:text-blue-200">
              Livros
            </Link>
            <Link href="/loans" className="hover:text-blue-200">
              Empréstimos
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-blue-200"
            >
              Sair
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
