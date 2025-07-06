'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Loading from '@/components/loading/Loading';

const AuthPage = () => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Lưu token vào cookie (hết hạn sau 3 giờ)
            setCookie('NCToken', token, { maxAge: 3 * 60 * 60, path: '/' });

            // Chuyển hướng đến dashboard
            router.replace('/dashboard');
        } else {
            // Không có token -> quay về login
            router.replace('/auth/login');
        }
    }, []);

    return <Loading />;
};

export default AuthPage;
