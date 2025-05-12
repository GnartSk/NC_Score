'use client'

import { Layout } from "antd";

const StudentContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;

    return (
        <Content>
            <div
                style={{
                    padding: 24,
                    minHeight: 'calc(100vh - 180px)',
                    background: "#F0F7FF",
                    //borderRadius: "#ccc",
                }}
            >
                {children}
            </div>
        </Content>
    )
}

export default StudentContent;