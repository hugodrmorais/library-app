import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all loans
export async function GET() {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new loan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bookId, dueDate } = body;

    // Basic validation
    if (!userId || !bookId || !dueDate) {
      return NextResponse.json(
        { error: 'User, book and due date are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (!book.available) {
      return NextResponse.json(
        { error: 'Book is not available for loan' },
        { status: 400 }
      );
    }

    // Create loan and update book availability
    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId,
        dueDate: new Date(dueDate),
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        book: {
          select: {
            title: true,
            author: true
          }
        }
      }
    });

    // Update book availability
    await prisma.book.update({
      where: { id: bookId },
      data: { available: false }
    });

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
