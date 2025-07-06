'use client'
import { StudentContext } from '@/lib/student.context';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { signOut } from "next-auth/react";
import { getCookie, deleteCookie } from 'cookies-next';
import { getCourseSelection, getCourseDisplayName, getMajorDisplayName } from '@/utils/courseUtils';

interface Profile {
    fullName: string;
    studentId: string;
    specialized: string;
    gmail: string;
    avatar: string;
}

const StudentHeader = (props: any) => {
    const { session } = props;
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(StudentContext)!;

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = getCookie('NCToken') as string | undefined;
                if (!token) return;

                const response = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setProfile(data.data);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSignOut = async () => {
        try {
            // Xóa dữ liệu điểm khỏi localStorage khi đăng xuất
            localStorage.removeItem('html_score_data');
            localStorage.removeItem('current_subject_codes');
            localStorage.removeItem('userCourseSelection');
            localStorage.removeItem('NCToken');
            deleteCookie('NCToken');
            await signOut({ redirect: false }).catch((error: any) => {
                if (
                    typeof error?.message === 'string' &&
                    error.message.includes('Unexpected end of JSON input')
                ) {
                    // Bỏ qua lỗi này
                    return;
                }
                console.error('Logout error:', error);
            });
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    Settings
                </span>
            ),
        },
        {
            key: '4',
            danger: true,
            label: <span onClick={handleSignOut}>Đăng xuất</span>,
        },
    ];

    // Ưu tiên hiển thị tên từ profile, nếu không có thì dùng từ session, hoặc giá trị mặc định
    const displayName = profile?.fullName || session?.user?.name || "Người dùng";
    const courseSelection = getCourseSelection();

    return (
        <>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    background: "#ffffff",
                    justifyContent: "space-between",
                    alignItems: "center"
                }} >

                <div className="flex items-center">
                    <Button
                        type="text"
                        icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapseMenu(!collapseMenu)}
                        style={{
                             fontSize: '16px',
                             width: 64,
                             height: 64,
                         }}
                    />
                    {courseSelection && (
                        <div className="ml-4 text-sm text-gray-600">
                            <span className="font-medium">{getCourseDisplayName(courseSelection.course)}</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium">{getMajorDisplayName(courseSelection.major)}</span>
                        </div>
                    )}
                </div>
                <Dropdown menu={{ items }} >
                    <a onClick={(e) => e.preventDefault()}
                        style={{ color: "unset", lineHeight: "0 !important", marginRight: 20 }}
                    >
                        <Space>
                            Xin chào {displayName}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
        </>
    )
}

export default StudentHeader;