'use client';
import { Table, Tag, Spin, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { convertScore10to4 } from '@/utils/scoreConvert';
import { getCourseSelection } from '@/utils/courseUtils';
import { isGroupSubject } from '@/utils/groupSubjectMap';

interface Subject {
    id: number | string;
    code: string;
    name: string;
    credits: number | string;
    qt?: number | string;
    th?: number | string;
    gk?: number | string;
    ck?: number | string;
    total?: number | string;
    status: string;
    category: string;
}

const mockData: Subject[] = [
    {
        id: 2,
        code: 'SS003',
        name: 'Tư tưởng Hồ Chí Minh',
        credits: 2,
        qt: 8,
        th: 8,
        gk: 7,
        ck: 10,
        total: 9,
        status: 'Hoàn thành',
        category: 'political',
    },
    {
        id: 15,
        code: 'SS004',
        name: 'Tư tưởng Hồ Chí Minh',
        credits: 2,
        qt: 8,
        th: 8,
        gk: 7,
        ck: 10,
        total: 9,
        status: 'Hoàn thành',
        category: 'political',
    },
    {
        id: 16,
        code: 'SS003',
        name: 'Tư tưởng Hồ Chí Minh',
        credits: 2,
        qt: 8,
        th: 8,
        gk: 7,
        ck: 10,
        total: 9,
        status: 'Hoàn thành',
        category: 'political',
    },
    {
        id: 17,
        code: 'SS003',
        name: 'Tư tưởng Hồ Chí Minh',
        credits: 2,
        qt: 8,
        th: 8,
        gk: 7,
        ck: 10,
        total: 9,
        status: 'Hoàn thành',
        category: 'political',
    },
    {
        id: 3,
        code: 'SS006',
        name: 'Pháp luật đại cương',
        credits: 2,
        qt: 8,
        th: 10,
        gk: 9.5,
        ck: 8,
        total: 9.5,
        status: 'Hoàn thành',
        category: 'political',
    },
    {
        id: 9,
        code: 'MA006',
        name: 'Giải tích',
        credits: 4,
        qt: 2,
        status: 'Rớt',
        category: 'math',
    },
    {
        id: 10,
        code: 'MA003',
        name: 'Đại số tuyến tính',
        credits: 3,
        qt: 8,
        th: 10,
        gk: 9.5,
        ck: 9,
        total: 9.5,
        status: 'Hoàn thành',
        category: 'math',
    },
];

// Hàm kiểm tra và lấy dữ liệu từ localStorage
const getScoreDataFromLocalStorage = (category: string): Subject[] | null => {
    try {
        const scoreData = localStorage.getItem('html_score_data');
        if (!scoreData) return null;
        const parsedData = JSON.parse(scoreData);
        if (parsedData && parsedData.semesters) {
            let allSubjects: any[] = [];
            Object.values(parsedData.semesters).forEach((value: any) => {
                if (Array.isArray(value.subjects)) {
                    allSubjects.push(...value.subjects);
                }
            });
            // Map lại các trường cho columns
            allSubjects = allSubjects.map((subj) => {
                const tk = subj.TK || subj.total;
                let status = 'Chưa học';
                if (tk === 'Miễn') status = 'Miễn';
                else if (tk === 'Hoãn thi') status = 'Hoãn thi';
                else if (tk === '&nbsp;' || tk === '' || tk === undefined || tk === null) status = 'Đang học';
                else if (!isNaN(Number(tk))) status = parseFloat(tk) >= 5 ? 'Hoàn thành' : 'Rớt';
                return {
                    ...subj,
                    code: subj.subjectCode || subj.code,
                    name: subj.subjectName || subj.name,
                    credits: subj.credit || subj.credits,
                    qt: subj.QT || subj.qt,
                    th: subj.TH || subj.th,
                    gk: subj.GK || subj.gk,
                    ck: subj.CK || subj.ck,
                    total: tk,
                    status,
                };
            });

            // Lọc theo khóa học và ngành học nếu có
            const courseSelection = getCourseSelection();
            const major = courseSelection?.major;
            if (major && category === 'Chuyên ngành') {
                allSubjects = allSubjects.filter((subj) => isGroupSubject('Chuyên ngành', major, subj.code));
            }
            if (major && category === 'Cơ sở ngành') {
                allSubjects = allSubjects.filter((subj) => isGroupSubject('Cơ sở ngành', major, subj.code));
            }

            if (category === 'Tất cả') return allSubjects;
            return allSubjects.filter((subj) => getCategoryFromCode(subj.code) === category);
        }
        return null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

// Hàm lấy danh sách mã môn đang học từ localStorage
const getCurrentSubjectCodes = (): string[] => {
    try {
        const codes = localStorage.getItem('current_subject_codes');
        if (!codes) return [];
        // Nếu là mảng object {code, name}
        const arr = JSON.parse(codes);
        if (arr.length && typeof arr[0] === 'object') {
            return arr.map((item: any) => item.code);
        }
        return arr;
    } catch {
        return [];
    }
};

// Hàm lấy danh sách môn đang học từ localStorage (object {code, name})
const getCurrentSubjectObjects = (): { code: string; name: string }[] => {
    try {
        const codes = localStorage.getItem('current_subject_codes');
        if (!codes) return [];
        const arr = JSON.parse(codes);
        if (arr.length && typeof arr[0] === 'object') {
            return arr;
        }
        // Nếu chỉ là mảng code cũ
        return arr.map((code: string) => ({ code, name: '' }));
    } catch {
        return [];
    }
};

function getCategoryFromCode(code: string | undefined) {
    if (!code || typeof code !== 'string') return 'Môn học khác';
    if (code.startsWith('SS') && code !== 'SS004') return 'Môn lý luận chính trị và pháp luật';
    if (code.startsWith('MA') || code.startsWith('PH') || code === 'IT001') return 'Toán - Tin học - Khoa học tự nhiên';
    if (code.startsWith('EN')) return 'Ngoại ngữ';
    if ((code.startsWith('IT') && code !== 'IT001') || code.startsWith('NT0') || code.startsWith('NT1'))
        return 'Cơ sở ngành';
    if (code.startsWith('NT2')) return 'Môn học khác';
    if (code.startsWith('NT')) return 'Chuyên ngành';
    return 'Môn học khác';
}

const CATEGORY_OPTIONS = [
    { value: 'Môn lý luận chính trị và pháp luật', label: 'Môn lý luận chính trị và pháp luật' },
    { value: 'Toán - Tin học - Khoa học tự nhiên', label: 'Toán - Tin học - Khoa học tự nhiên' },
    { value: 'Ngoại ngữ', label: 'Ngoại ngữ' },
    { value: 'Cơ sở ngành', label: 'Cơ sở ngành' },
    { value: 'Chuyên ngành', label: 'Chuyên ngành' },
    { value: 'Môn học khác', label: 'Môn học khác' },
];

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const part = parts.pop();
        return part ? part.split(';').shift() : null;
    }
    return null;
}

async function fetchUserMajor(): Promise<string | null> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('NCToken') : null;
        if (!token) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data?.major || null;
    } catch {
        return null;
    }
}

export default function SubjectTable({
    title,
    category,
    onCreditsChange,
    scoreScale = '10',
    viewType = 'curriculum',
}: {
    title: string;
    category: string;
    onCreditsChange?: (credits: number) => void;
    scoreScale?: '10' | '4';
    viewType?: 'curriculum' | 'semester';
}) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Subject[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [currentSubjectObjects, setCurrentSubjectObjects] = useState<{ code: string; name: string }[]>([]);
    const [major, setMajor] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
        // Lấy danh sách môn đang học từ localStorage khi ở client
        if (typeof window !== 'undefined') {
            try {
                const codes = localStorage.getItem('current_subject_codes');
                if (codes) {
                    const arr = JSON.parse(codes);
                    if (arr.length && typeof arr[0] === 'object') {
                        setCurrentSubjectObjects(arr);
                    } else {
                        setCurrentSubjectObjects(arr.map((code: string) => ({ code, name: '' })));
                    }
                } else {
                    setCurrentSubjectObjects([]);
                }
            } catch {
                setCurrentSubjectObjects([]);
            }
        }
        // Lấy ngành học từ API
        fetchUserMajor().then(setMajor);
    }, []);

    const columns: ColumnsType<Subject> = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'stt',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: 80,
        },
        {
            title: 'MÃ MÔN',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
        },
        {
            title: 'TÊN MÔN',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            render: (value, record) => {
                // Nếu value rỗng hoặc value là mã môn, tìm tên từ ICS
                if (value && value !== record.code) return value;
                const found = currentSubjectObjects.find((subj) => subj.code === record.code);
                return found && found.name ? found.name : value || record.code;
            },
        },
        {
            title: 'TC',
            dataIndex: 'credits',
            key: 'credits',
            align: 'center',
        },
        {
            title: 'QT',
            dataIndex: 'qt',
            key: 'qt',
            align: 'center',
            render: (value) => {
                if (value === undefined || value === null || value === '') return '-';
                const score = typeof value === 'string' ? parseFloat(value) : value;
                if (isNaN(score)) return '-';
                return scoreScale === '4' ? convertScore10to4(score).toFixed(1) : score.toFixed(1);
            },
        },
        {
            title: 'TH',
            dataIndex: 'th',
            key: 'th',
            align: 'center',
            render: (value) => {
                if (value === undefined || value === null || value === '') return '-';
                const score = typeof value === 'string' ? parseFloat(value) : value;
                if (isNaN(score)) return '-';
                return scoreScale === '4' ? convertScore10to4(score).toFixed(1) : score.toFixed(1);
            },
        },
        {
            title: 'GK',
            dataIndex: 'gk',
            key: 'gk',
            align: 'center',
            render: (value) => {
                if (value === undefined || value === null || value === '') return '-';
                const score = typeof value === 'string' ? parseFloat(value) : value;
                if (isNaN(score)) return '-';
                return scoreScale === '4' ? convertScore10to4(score).toFixed(1) : score.toFixed(1);
            },
        },
        {
            title: 'CK',
            dataIndex: 'ck',
            key: 'ck',
            align: 'center',
            render: (value) => {
                if (value === undefined || value === null || value === '') return '-';
                const score = typeof value === 'string' ? parseFloat(value) : value;
                if (isNaN(score)) return '-';
                return scoreScale === '4' ? convertScore10to4(score).toFixed(1) : score.toFixed(1);
            },
        },
        {
            title: 'TỔNG KẾT',
            dataIndex: 'total',
            key: 'total',
            align: 'center',
            render: (value) => {
                if (value === undefined || value === null || value === '') return '-';
                if (value === 'Miễn') return 'Miễn';
                const score = typeof value === 'string' ? parseFloat(value) : value;
                if (isNaN(score)) return '-';
                return scoreScale === '4' ? convertScore10to4(score).toFixed(1) : score.toFixed(1);
            },
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                if (status === 'Miễn') {
                    return (
                        <Tag color="blue" className="rounded-full px-3">
                            Miễn
                        </Tag>
                    );
                }
                return (
                    <Tag
                        color={
                            status === 'Hoàn thành'
                                ? 'green'
                                : status === 'Rớt'
                                ? 'red'
                                : status === 'Đang học'
                                ? 'gold'
                                : status === 'Hoãn thi'
                                ? 'orange'
                                : 'default'
                        }
                        className="rounded-full px-3"
                    >
                        {status}
                    </Tag>
                );
            },
        },
    ];

    useEffect(() => {
        setLoading(true);
        const userToken = getCookie('NCToken');
        fetch(`${process.env.NEXT_PUBLIC_BackendURL}/score/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                const scores = res.data?.scores || [];
                // Map lại các trường cho columns
                let allSubjects = (scores as any[]).map((subj: any) => {
                    // Nếu status là 'Miễn' từ database, ưu tiên lấy luôn
                    if (subj.status === 'Miễn') {
                        return {
                            ...subj,
                            code: subj.subjectCode || subj.code,
                            name: subj.subjectName || subj.name,
                            credits: subj.credit || subj.credits,
                            qt: subj.QT || subj.qt,
                            th: subj.TH || subj.th,
                            gk: subj.GK || subj.gk,
                            ck: subj.CK || subj.ck,
                            total: 'Miễn',
                            status: 'Miễn',
                        };
                    }
                    const tk = subj.TK || subj.total;
                    let status = 'Chưa học';
                    if (tk === 'Miễn') status = 'Miễn';
                    else if (tk === 'Hoãn thi') status = 'Hoãn thi';
                    else if (tk === '&nbsp;' || tk === '' || tk === undefined || tk === null) status = 'Đang học';
                    else if (!isNaN(Number(tk))) status = parseFloat(tk) >= 5 ? 'Hoàn thành' : 'Rớt';
                    return {
                        ...subj,
                        code: subj.subjectCode || subj.code,
                        name: subj.subjectName || subj.name,
                        credits: subj.credit || subj.credits,
                        qt: subj.QT || subj.qt,
                        th: subj.TH || subj.th,
                        gk: subj.GK || subj.gk,
                        ck: subj.CK || subj.ck,
                        total: tk,
                        status,
                    };
                });
                if (category !== 'Tất cả') {
                    allSubjects = allSubjects.filter((subj: any) => getCategoryFromCode(subj.code) === category);
                }
                setData(allSubjects);
                // Tính tổng số tín chỉ đã học được (các môn có status 'Hoàn thành')
                if (onCreditsChange) {
                    const earnedCredits = allSubjects
                        .filter((item: any) => item.status === 'Hoàn thành' || item.status === 'Miễn')
                        .reduce((sum: number, item: any) => sum + (Number(item.credits) || 0), 0);
                    onCreditsChange(earnedCredits);
                }
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    }, [category, onCreditsChange]);

    // Lấy danh sách môn đang học từ ICS
    const currentSubjects = typeof window !== 'undefined' ? getCurrentSubjectObjects() : [];
    // Gộp các môn ICS vào data bảng điểm nếu chưa có
    // Đảm bảo chỉ hiển thị 1 bản ghi duy nhất cho mỗi mã môn: ưu tiên Hoàn thành > Đang học > Rớt
    const mergedData = [
        ...data,
        ...currentSubjects
            .filter((subj) => {
                const subjCategory = getCategoryFromCode(subj.code);
                return (
                    (category === 'Tất cả' || subjCategory === category) &&
                    !data.some((item) => item.code === subj.code)
                );
            })
            .map((subj) => ({
                id: `current-${subj.code}`,
                code: subj.code,
                name: subj.name,
                credits: '',
                qt: '',
                th: '',
                gk: '',
                ck: '',
                total: '',
                status: 'Đang học',
                category: getCategoryFromCode(subj.code),
            })),
    ];

    // Chỉ giữ lại bản ghi ưu tiên: Hoàn thành > Đang học > Rớt cho mỗi mã môn
    type StatusType = 'Hoàn thành' | 'Đang học' | 'Rớt';
    const priority: Record<StatusType, number> = { 'Hoàn thành': 3, 'Đang học': 2, Rớt: 1 };
    const uniqueData = Object.values(
        mergedData.reduce((acc, item) => {
            const code = item.code;
            if (!acc[code]) {
                acc[code] = item;
            } else {
                // Ưu tiên Hoàn thành > Đang học > Rớt
                const s1 = item.status as StatusType;
                const s2 = acc[code].status as StatusType;
                if ((priority[s1] || 0) > (priority[s2] || 0)) {
                    acc[code] = item;
                }
            }
            return acc;
        }, {} as Record<string, any>),
    );

    let filteredData: any[] = [];
    if (viewType === 'curriculum') {
        // Chỉ giữ bản ghi ưu tiên nhất cho mỗi mã môn
        filteredData = Array.isArray(uniqueData)
            ? Object.values(
                  (uniqueData as any[]).reduce((acc, item) => {
                      const code = item.code;
                      let status: StatusType = 'Rớt';
                      if (item.total === 'Miễn') status = 'Hoàn thành';
                      else if (item.total === 'Hoãn thi') status = 'Đang học';
                      else if (
                          item.total === '&nbsp;' ||
                          item.total === '' ||
                          item.total === undefined ||
                          item.total === null
                      )
                          status = 'Đang học';
                      else if (!isNaN(Number(item.total))) status = parseFloat(item.total) >= 5 ? 'Hoàn thành' : 'Rớt';
                      if (!acc[code] || priority[status as StatusType] > priority[acc[code].__status as StatusType]) {
                          acc[code] = { ...item, __status: status };
                      }
                      return acc;
                  }, {} as Record<string, any>),
              ).map((item: any) => {
                  const { __status, ...rest } = item;
                  return rest;
              })
            : [];
    } else {
        // Hiển thị tất cả bản ghi (theo học kỳ)
        filteredData = Array.isArray(uniqueData) ? uniqueData : [];
    }

    if (!isClient) return null;

    // Tính tổng số tín chỉ đã học được
    const earnedCredits = Array.isArray(filteredData)
        ? filteredData
              .filter((item) => {
                  let status = 'Chưa học';
                  if (item.total === 'Miễn') status = 'Miễn';
                  else if (item.total === 'Hoãn thi') status = 'Hoãn thi';
                  else if (
                      item.total === '&nbsp;' ||
                      item.total === '' ||
                      item.total === undefined ||
                      item.total === null
                  )
                      status = 'Đang học';
                  else if (!isNaN(Number(item.total))) status = parseFloat(item.total) >= 5 ? 'Hoàn thành' : 'Rớt';
                  return status === 'Hoàn thành' || status === 'Miễn';
              })
              .reduce((sum, item) => sum + (Number(item.credits) || 0), 0)
        : 0;

    // Lấy tổng số tín chỉ của category
    const getTotalCredits = (category: string) => {
        switch (category) {
            case 'Môn lý luận chính trị và pháp luật':
                return 13;
            case 'Toán - Tin học - Khoa học tự nhiên':
                return 22;
            case 'Ngoại ngữ':
                return 12;
            case 'Cơ sở ngành':
                return 49;
            case 'Chuyên ngành':
                return 12;
            case 'Môn học khác':
                return 8;
            default:
                return 0;
        }
    };

    // Lấy thông tin khóa học và ngành học
    const courseSelection = getCourseSelection();

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <div className="text-gray-600 ml-10">
                        <span className="font-medium">Tín chỉ: </span>
                        <span className="font-bold">
                            {earnedCredits}/{getTotalCredits(category)}
                        </span>
                    </div>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={
                    category === 'Tất cả'
                        ? filteredData
                        : filteredData.filter((item) => getCategoryFromCode(item.code) === category)
                }
                loading={loading}
                pagination={false}
                scroll={{ x: 1000 }}
                rowKey={(record) => `${record.code}-${record.id || Math.random().toString(36).substring(2, 9)}`}
                className="antd-custom-table"
            />
        </div>
    );
}

export { getScoreDataFromLocalStorage };
