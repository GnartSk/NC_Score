import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.BackendURL}/training-program/${params.id}`, {
    method: 'DELETE',
    headers: {
      // Forward cookies if necessary
      Cookie: req.headers.get('cookie') || '',
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  const res = await fetch(`${process.env.BackendURL}/training-program/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: req.headers.get('cookie') || '',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
