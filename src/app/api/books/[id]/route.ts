import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await prisma.book.delete({
      where: { id: params.id },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting book' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json();
  try {
    const updated = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        publishedAt: Number(data.publishedAt),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating book' }, { status: 500 });
  }
}
