import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, context: any) {
  const params = await context.params;
  const id = params.id;
  try {
    const deleted = await prisma.loan.delete({
      where: { id },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting loan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: any) {
  const params = await context.params;
  const id = params.id;
  const data = await request.json();
  try {
    const updated = await prisma.loan.update({
      where: { id },
      data: {
        userId: data.userId,
        bookId: data.bookId,
        dueDate: new Date(data.dueDate), // Fixed to ensure valid DateTime
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('LOAN PUT ERROR:', error);
    return NextResponse.json({ error: 'Error updating loan' }, { status: 500 });
  }
}
