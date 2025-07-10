import { auth } from '@/auth';
import AdminSidebar from '@/components/layout/admin.sidebar';
import StudentContent from '@/components/layout/student.content';
import StudentFooter from '@/components/layout/student.footer';
import StudentHeader from '@/components/layout/student.header';
import StudentSideBar from '@/components/layout/student.sidebar';
import { StudentContextProvider } from '@/lib/student.context';
import { cookies } from 'next/headers';

const StudentLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();
    let role = session?.user?.role;

    if (!role) {
        // Lấy token từ cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('NCToken')?.value;
        if (token) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store',
                });
                if (res.ok) {
                    const data = await res.json();
                    role = data.data?.role;
                }
            } catch (e) {
                // ignore
            }
        }
    }

    const isUser = role === 'USER';

    // if (!role) {
    //     return <div>Không xác định được quyền truy cập. Vui lòng đăng nhập lại.</div>;
    // }

    return (
        <StudentContextProvider>
            <div style={{ display: 'flex' }}>
                <div className="left-side" style={{ minWidth: 80 }}>
                    {isUser ? <StudentSideBar /> : <AdminSidebar />}
                </div>
                <div className="right-side" style={{ flex: 1 }}>
                    <StudentHeader session={session} />
                    <StudentContent>{children}</StudentContent>
                    <StudentFooter />
                </div>
            </div>
        </StudentContextProvider>
    );
};

export default StudentLayout;
