import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('NCToken')?.value || '';

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        const data = await res.json();
        const adminRoutes = ['/dashboard/student-score', '/dashboard/subject-managerment', '/dashboard/report'];

        if (adminRoutes.includes(req.nextUrl.pathname) && data.data.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
}

// Chỉ áp dụng middleware cho các route bắt đầu bằng /dashboard
export const config = {
    matcher: ['/dashboard/:path*'],
};
