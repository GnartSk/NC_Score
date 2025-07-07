'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    GlobalOutlined,
    PartitionOutlined,
    ProfileOutlined,

} from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from "@/lib/student.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons/faGraduationCap";
import { getCourseSelection, getCourseDisplayName, getMajorDisplayName } from '@/utils/courseUtils';
import Image from 'next/image';

type MenuItem = Required<MenuProps>['items'][number];

// Hàm lấy thông tin user từ API
async function fetchUserProfile() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('NCToken') : null;
    if (!token) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

const StudentSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(StudentContext)!;
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
      fetchUserProfile().then(setUserProfile);
    }, []);

    const items: MenuItem[] = [

        {
            key: 'grp',
            label: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32 }}>
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image src="/LogoUIT.svg" alt="Logo UIT" width={32} height={32} priority />
                    </Link>
                </div>
            ),
            type: 'group',
            children: [
                {
                    key: "current-score",
                    label: <Link href={"/dashboard/score"}>Điểm hiện tại</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "users",
                    label: <Link href={"/dashboard/calender"}>Lịch</Link>,
                    icon: <ProfileOutlined />,
                },
                {
                    key: 'roadmap',
                    label: 'Lộ trình',
                    icon: <PartitionOutlined />,
                    children: [
                      { key: 'subject-suggestions', label: 'Đề xuất môn học' },
                      { key: 'schedule', label: 'Xếp TKB' },
                    ],
                },
                {
                    key: 'ctdt',
                    label: 'CTĐT',
                    icon: <FontAwesomeIcon icon={faGraduationCap} />,
                },
                {
                    type: 'divider',
                },
                {
                    key: 'forum',
                    label: 'Diễn đàn',
                    icon: <GlobalOutlined />,
                },
            ],
        },
    ];

    return (
        <Sider
            collapsed={collapseMenu}
        >
            {userProfile && !collapseMenu && (
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-1">Thông tin học tập</div>
                    <div className="text-xs text-blue-800">
                        <div>{getCourseDisplayName(userProfile.course)}</div>
                        <div>{getMajorDisplayName(userProfile.major)}</div>
                    </div>
                </div>
            )}
            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default StudentSideBar;