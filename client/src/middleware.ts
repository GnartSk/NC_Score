import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('NCToken')?.value || '';

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
        const res = await fetch(`${process.env.BackendURL}/user/profile`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        const data = await res.json();
        const role = data.data.role;
        const adminRoutes = ['/dashboard/student-score', '/dashboard/subject-managerment', '/dashboard/report'];
        const userRouter = ['/dashboard/user'];

        // Kiểm tra nếu user đang truy cập dashboard và chưa chọn khóa học/ngành học
        if (req.nextUrl.pathname === '/dashboard') {
            // Kiểm tra xem user đã chọn khóa học và ngành học chưa
            const courseSelectionRes = await fetch(`${process.env.BackendURL}/user/course-selection`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            // Nếu chưa có thông tin khóa học hoặc API trả về lỗi, redirect đến trang chọn khóa học
            if (!courseSelectionRes.ok || courseSelectionRes.status === 404) {
                return NextResponse.redirect(new URL('/course-selection', req.url));
            }
        }

        if (adminRoutes.includes(req.nextUrl.pathname) && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        if (userRouter.includes(req.nextUrl.pathname) && role !== 'USER') {
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
