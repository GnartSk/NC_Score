'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { CourseSelection, setCourseSelection, getCourseDisplayName, getMajorDisplayName } from '@/utils/courseUtils';

const CourseSelectionPage = () => {
    const [selection, setSelection] = useState<CourseSelection>({
        course: '',
        major: ''
    });
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const courses = [
        { id: 'K17', name: getCourseDisplayName('K17') },
        { id: 'K18', name: getCourseDisplayName('K18') },
        { id: 'K19', name: getCourseDisplayName('K19') }
    ];

    const majors = [
        { id: 'ATTT', name: getMajorDisplayName('An toàn thông tin') },
        { id: 'MMT', name: getMajorDisplayName('Mạng máy tính & Truyền thông dữ liệu') }
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let storedToken = getCookie('NCToken') as string | undefined;
        if (!storedToken) {
            router.push('/auth/login');
            return;
        }
        setToken(storedToken);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selection.course || !selection.major) {
            alert('Vui lòng chọn đầy đủ khóa học và ngành học!');
            return;
        }

        setLoading(true);
        try {
            // Lấy tên ngành đúng với DTO
            const selectedMajor = majors.find(m => m.id === selection.major)?.name || selection.major;
            const payload = {
                course: selection.course,
                major: selectedMajor
            };
            // Lưu lựa chọn vào localStorage
            setCourseSelection(payload);
            
            // Gửi lên server để lưu vào database
            if (token) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/course-selection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Failed to save course selection');
                }
            }

            // Chuyển hướng đến dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Error saving course selection:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (courseId: string) => {
        setSelection(prev => ({ ...prev, course: courseId }));
    };

    const handleMajorChange = (majorId: string) => {
        setSelection(prev => ({ ...prev, major: majorId }));
    };

    if (!token) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex bg-[#F0F7FF] flex-col items-center justify-center min-h-screen px-20 text-center">
            <main className="flex flex-col items-center w-screen flex-1 px-20 text-center mt-9 min-w-[764px]">
                <div className="rounded-2xl shadow-2xl h-[600px] flex max-w-4xl">
                    <div className="md:w-4/5 p-6">
                        <div className="py-6">
                            <img className="px-36" src="/LogoUIT.svg" alt="logoUIT" />
                            <p className="font-bold text-gray-600 mt-2">Vui lòng chọn khóa học và ngành học của bạn để tiếp tục</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Khóa học */}
                            <div className="text-left">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Khóa học *
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {courses.map((course) => (
                                        <label
                                            key={course.id}
                                            className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                                                selection.course === course.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="course"
                                                value={course.id}
                                                checked={selection.course === course.id}
                                                onChange={() => handleCourseChange(course.id)}
                                                className="mr-3 text-blue-600"
                                            />
                                            <span className="font-medium">{course.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Ngành học */}
                            <div className="text-left">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Ngành học *
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {majors.map((major) => (
                                        <label
                                            key={major.id}
                                            className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                                                selection.major === major.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="major"
                                                value={major.id}
                                                checked={selection.major === major.id}
                                                onChange={() => handleMajorChange(major.id)}
                                                className="mr-3 text-blue-600"
                                            />
                                            <span className="font-medium">{major.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selection.course || !selection.major}
                                className="bg-[#0077FF] hover:scale-110 rounded-lg text-white px-4 py-3 inline-block font-semibold hover:bg-[#2e7bd9] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#71ACF2] md:block hidden justify-center items-center rounded-md max-w-3xl relative">
                        <h2 className="text-3xl absolute ml-24 mt-9 text-white font-bold mb-2">
                            Chọn thông tin học tập
                        </h2>
                        
                        <img className="object-cover" src="/BackgroundLogin.svg" alt="#" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseSelectionPage; 