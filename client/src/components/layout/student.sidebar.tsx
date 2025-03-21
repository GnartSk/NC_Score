'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    GlobalOutlined,
    PartitionOutlined,
    ProfileOutlined,

} from '@ant-design/icons';
import React, { useContext } from 'react';
import { StudentContext } from "@/lib/student.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons/faGraduationCap";

type MenuItem = Required<MenuProps>['items'][number];
const StudentSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(StudentContext)!;

    const items: MenuItem[] = [

        {
            key: 'grp',
            label: 'NC Score',
            type: 'group',
            children: [
                {
                    key: "current-score",
                    label: <Link href={"/dashboard"}>Điểm hiện tại</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "users",
                    label: <Link href={"/dashboard/user"}>Thử điểm</Link>,
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