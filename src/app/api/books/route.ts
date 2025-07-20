import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Listar todos os livros
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(books);
      } catch (error) {
      console.error('Error fetching books:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
}

// POST - Criar novo livro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, isbn, category, publishedAt } = body;

    // Basic validation
    if (!title || !author || !isbn || !category || !publishedAt) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if ISBN already exists
    const existingBook = await prisma.book.findUnique({
      where: { isbn }
    });

    if (existingBook) {
      return NextResponse.json(
        { error: 'ISBN already registered' },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        category,
        publishedAt: parseInt(publishedAt),
        available: true
      }
    });

    return NextResponse.json(book, { status: 201 });
      } catch (error) {
      console.error('Error creating book:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
}
