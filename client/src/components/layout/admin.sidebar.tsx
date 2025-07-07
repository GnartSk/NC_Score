'use client';
import Layout from 'antd/es/layout';
import Menu from 'antd/es/menu';
import { AppstoreOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import { StudentContext } from '@/lib/student.context';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { FaCircleExclamation, FaPeopleGroup } from 'react-icons/fa6';
import Image from 'next/image';

type MenuItem = Required<MenuProps>['items'][number];
const AdminSidebar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(StudentContext)!;

    const items: MenuItem[] = [
        {
            key: 'grp',
            label: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64 }}>
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image src="/LogoUIT.svg" alt="Logo UIT" width={64} height={64} priority />
                    </Link>
                </div>
            ),
            type: 'group',
            children: [
                {
                    key: 'student-score',
                    label: <Link href={'/dashboard/student-score'}>Điểm sinh viên</Link>,
                    icon: <FaPeopleGroup />,
                },
                {
                    key: 'subject-managerment',
                    label: <Link href={'/dashboard/subject-managerment'}>Quản lý môn học</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: 'report',
                    label: <Link href={'/dashboard/report'}>Thông báo lỗi</Link>,
                    icon: <FaCircleExclamation />,
                },
            ],
        },
    ];

    return (
        <Sider collapsed={collapseMenu}>
            <Menu mode="inline" defaultSelectedKeys={['dashboard']} items={items} style={{ height: '100vh' }} />
        </Sider>
    );
};

export default AdminSidebar;
