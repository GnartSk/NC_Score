'use client'
import { Layout } from 'antd';

const StudentFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                NC Score ©{new Date().getFullYear()} Created by NCTeams
            </Footer>
        </>
    )
}

export default StudentFooter;
