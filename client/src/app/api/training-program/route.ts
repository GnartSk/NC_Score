import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/training-program`, {
    credentials: 'include',
  });
  const data = await res.json();
  return NextResponse.json(data);
} 