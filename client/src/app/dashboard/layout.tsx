import { auth } from '@/auth';
import StudentContent from '@/components/layout/student.content';
import StudentFooter from '@/components/layout/student.footer';
import StudentHeader from '@/components/layout/student.header';
import StudentSideBar from '@/components/layout/student.sidebar';
import { StudentContextProvider } from '@/library/student.context';

const StudentLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const session = await auth()

    return (
        <StudentContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <StudentSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <StudentHeader session={session} />
                    <StudentContent>
                        {children}
                    </StudentContent>
                    <StudentFooter />
                </div>
            </div>
        </StudentContextProvider>
    )
}

export default StudentLayout
