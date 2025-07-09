import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/training-program/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 