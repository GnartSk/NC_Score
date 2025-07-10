'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getCookie } from 'cookies-next';
import StatsCard from '@/components/statscard/StatsCard';
import UploadButtons from '@/components/uploadbutton/UploadButtons';
import ProfileCard from '@/components/profilecard/profilecard';
import CalendarWidget from '@/components/calendar/CalendarWidget';
import Loading from '@/components/loading/Loading';
import { Card, List, Avatar, Spin, Input, Select, Row, Col, Empty, Tag } from 'antd';
import { SearchOutlined, UserOutlined, BookOutlined, CrownOutlined } from '@ant-design/icons';

interface Profile {
    fullName: string;
    studentId: string;
    specialized: string;
    gmail: string;
    avatar: string;
    course?: string;
    major?: string;
    earnedCredits?: number;
    cumulativePoint?: number;
    academicYear?: number;
    role?: string;
}

interface UserInfo {
    fullName: string;
    studentId: string;
    specialized: string;
    gmail: string;
    avatar: string;
    course?: string;
    major?: string;
    earnedCredits?: number;
    cumulativePoint?: number;
    academicYear?: number;
    role?: string;
}

const DashboardPage = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [earnedCredits, setEarnedCredits] = useState(0);
    const [remainingCredits, setRemainingCredits] = useState(0);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedMajor, setSelectedMajor] = useState<string>('all');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');

    const { Search } = Input;

    const majors = useMemo(() => {
        const uniqueMajors = [...new Set(users.map(user => user.major).filter(Boolean))];
        return uniqueMajors.sort();
    }, [users]);

    const courses = useMemo(() => {
        const uniqueCourses = [...new Set(users.map(user => user.course).filter(Boolean))];
        return uniqueCourses.sort();
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const name = user.fullName || '';
            const mssv = user.studentId ? String(user.studentId) : '';
            const matchesSearch =
                searchText === '' ||
                name.toLowerCase().includes(searchText.toLowerCase()) ||
                mssv.includes(searchText);
            const matchesMajor = selectedMajor === 'all' || user.major === selectedMajor;
            const matchesCourse = selectedCourse === 'all' || user.course === selectedCourse;
            return matchesSearch && matchesMajor && matchesCourse;
        });
    }, [users, searchText, selectedMajor, selectedCourse]);

    // Hàm lấy tổng tín chỉ ngành
    function getTotalCreditsByMajor(major: string | undefined) {
        if (!major) return 130;
        if (major.toLowerCase().includes('mạng máy tính & truyền thông dữ liệu')) return 130;
        if (major.toLowerCase().includes('an toàn thông tin')) return 129;
        return 130;
    }

    // Hàm tính học kỳ hiện tại
    function getCurrentSemester(academicYear?: number) {
        if (!academicYear) return '--';
        const now = new Date();
        const startYear = academicYear;
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12
        let yearsPassed = currentYear - startYear;
        let semester;
        if (currentMonth >= 9 && currentMonth <= 12) {
            // Kỳ 1: tháng 9-12
            semester = yearsPassed * 2 +1 ;
        } else if (currentMonth >= 1 && currentMonth <= 8) {
            // Kỳ 2: tháng 1-8
            semester = yearsPassed * 2;
        } else {
            semester = '--';
        }
        return semester;
    }

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let storedToken = getCookie('NCToken') as string | undefined;
        setToken(storedToken ?? null);
    }, []);

    useEffect(() => {
        if (profile?.earnedCredits !== undefined) {
            setEarnedCredits(profile.earnedCredits);
            setRemainingCredits(getTotalCreditsByMajor(profile.major) - profile.earnedCredits);
        }
    }, [profile]);

    useEffect(() => {
        // Fetch danh sách user
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                let token = '';
                if (typeof window !== 'undefined') {
                    token = getCookie('NCToken') as string;
                    if (!token || token === 'null') {
                        token = localStorage.getItem('NCToken') || '';
                    }
                }
                if (!token || token === 'null') {
                    setUsers([]);
                    setLoadingUsers(false);
                    return;
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setUsers(data.data?.users || []);
            } catch {
                setUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const getProfile = useCallback(async (userToken: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${userToken}` },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setProfile(data.data);
            localStorage.setItem('profile', JSON.stringify(data.data));
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token) getProfile(token);
    }, [token, getProfile]);

    console.log('Profile', profile);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-1 space-y-6 min-h-screen bg-[#F0F7FF]">
            <div className="grid grid-cols-3 gap-4 items-start">
                <div className="col-span-2 flex flex-col space-y-4">
                    <div className="flex items-center bg-gradient-to-r from-blue-400 to-blue-200 p-6 rounded-lg shadow-md">
                        <h1 className="text-3xl text-white font-bold">Xin chào, {profile?.fullName}! 👋</h1>
                        <img src="/School.svg" className="h-24 object-contain ml-4" alt="School" />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {profile?.role === 'ADMIN' ? (
                            <Card 
                                title={
                                    <div className="flex items-center gap-2">
                                        <UserOutlined className="text-blue-500" />
                                        <span>Danh sách sinh viên</span>
                                        <Tag color="blue" className="ml-auto">
                                            {filteredUsers.length}/{users.length}
                                        </Tag>
                                    </div>
                                }
                                className="h-full"
                                extra={
                                    <button 
                                        onClick={() => {
                                            setSearchText('');
                                            setSelectedMajor('all');
                                            setSelectedCourse('all');
                                        }}
                                        className="text-xs text-gray-500 hover:text-blue-500"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                }
                            >
                                {/* Search and Filters */}
                                <div className="space-y-3 mb-4">
                                    <Search
                                        placeholder="Tìm kiếm theo tên hoặc MSSV..."
                                        allowClear
                                        onChange={(e) => setSearchText(e.target.value)}
                                        value={searchText}
                                        prefix={<SearchOutlined />}
                                    />
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Select
                                                placeholder="Lọc theo ngành"
                                                value={selectedMajor}
                                                onChange={setSelectedMajor}
                                                className="w-full"
                                                allowClear
                                            >
                                                <Select.Option value="all">Tất cả ngành</Select.Option>
                                                {majors.map(major => (
                                                    <Select.Option key={major} value={major}>{major}</Select.Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        <Col span={12}>
                                            <Select
                                                placeholder="Lọc theo khóa"
                                                value={selectedCourse}
                                                onChange={setSelectedCourse}
                                                className="w-full"
                                                allowClear
                                            >
                                                <Select.Option value="all">Tất cả khóa</Select.Option>
                                                {courses.map(course => (
                                                    <Select.Option key={course} value={course}>{course}</Select.Option>
                                                ))}
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                                {/* Student List */}
                                {loadingUsers ? (
                                    <div className="flex justify-center py-8">
                                        <Spin size="large" />
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <Empty 
                                        description="Không tìm thấy sinh viên nào" 
                                        className="py-8"
                                    />
                                ) : (
                                    <div className="max-h-[600px] overflow-y-auto">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={filteredUsers}
                                            renderItem={user => (
                                                <List.Item
                                                    className="p-3 rounded-lg mb-2 transition-all duration-200"
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar 
                                                                src={user.avatar} 
                                                                size={48}
                                                                icon={<UserOutlined />}
                                                                className="border-2 border-gray-200"
                                                            />
                                                        }
                                                        title={
                                                            <span className="font-medium text-gray-800">
                                                                {user.fullName}
                                                            </span>
                                                        }
                                                        description={
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-1 text-sm">
                                                                    <span className="font-medium text-gray-600">MSSV:</span>
                                                                    <span className="text-gray-800">{user.studentId}</span>
                                                                </div>
                                                                {user.course && (
                                                                    <div className="flex items-center gap-1 text-sm">
                                                                        <CrownOutlined className="text-gray-400" />
                                                                        <span className="text-gray-600">Khóa:</span>
                                                                        <span className="text-gray-800">{user.course}</span>
                                                                    </div>
                                                                )}
                                                                {user.major && (
                                                                    <div className="flex items-center gap-1 text-sm">
                                                                        <BookOutlined className="text-gray-400" />
                                                                        <span className="text-gray-600">Ngành:</span>
                                                                        <span className="text-gray-800">{user.major}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                )}
                            </Card>
                        ) : (
                            <div className="flex justify-around">
                                <StatsCard value={getCurrentSemester(profile?.academicYear)} label="Kì học" bgColor="bg-blue-100" />
                                <StatsCard value={remainingCredits} label="Số tín chỉ còn lại" bgColor="bg-orange-300" />
                                <StatsCard value={earnedCredits} label="Số tín chỉ hoàn thành" bgColor="bg-teal-300" />
                                <StatsCard value={profile?.cumulativePoint !== undefined ? profile.cumulativePoint.toFixed(2) : '--'} label="GPA" bgColor="bg-blue-100" />
                            </div>
                        )}
                    </div>

                    {/* Upload buttons chỉ hiện với user thường */}
                    {profile?.role !== 'ADMIN' && (
                      <div className="grid grid-cols-2 gap-4">
                        <UploadButtons label="Tải lên thời khóa biểu" icon="📅" />
                        <UploadButtons label="Tải lên bảng điểm sinh viên" icon="🆔" />
                      </div>
                    )}
                </div>

                <div className="col-span-1 flex flex-col space-y-4">
                    <CalendarWidget />
                    <ProfileCard
                        avatar={profile?.avatar}
                        name={profile?.fullName}
                        studentId={profile?.studentId}
                        major={profile?.major}
                        course={profile?.course}
                        email={profile?.gmail}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
