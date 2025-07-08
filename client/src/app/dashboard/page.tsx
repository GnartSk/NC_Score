'use client';
import { useEffect, useState, useCallback } from 'react';
import { getCookie } from 'cookies-next';
import StatsCard from '@/components/statscard/StatsCard';
import UploadButtons from '@/components/uploadbutton/UploadButtons';
import ProfileCard from '@/components/profilecard/profilecard';
import CalendarWidget from '@/components/calendar/CalendarWidget';
import Loading from '@/components/loading/Loading';

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

const DashboardPage = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [earnedCredits, setEarnedCredits] = useState(0);
    const [remainingCredits, setRemainingCredits] = useState(0);

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

                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-around">
                        <StatsCard value={getCurrentSemester(profile?.academicYear)} label="Kì học" bgColor="bg-blue-100" />
                        <StatsCard value={remainingCredits} label="Số tín chỉ còn lại" bgColor="bg-orange-300" />
                        <StatsCard value={earnedCredits} label="Số tín chỉ hoàn thành" bgColor="bg-teal-300" />
                        <StatsCard value={profile?.cumulativePoint !== undefined ? profile.cumulativePoint.toFixed(2) : '--'} label="GPA" bgColor="bg-blue-100" />
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
