'use client';
import { Table, Tag, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { convertScore10to4 } from '@/utils/scoreConvert';

interface Subject {
    id: number;
    code: string;
    name: string;
    credits: number;
    qt?: number;
    th?: number;
    gk?: number;
    ck?: number;
    total?: number;
    status: 'Hoàn thành' | 'Chưa học' | 'Rớt' | 'Miễn';
    semester: string;
}

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const part = parts.pop();
        return part ? part.split(';').shift() : null;
    }
    return null;
}

// Hàm so sánh học kỳ dạng "Học kỳ X - Năm học YYYY-YYYY" hoặc "Học kỳ X YYYY-YYYY"
function compareSemester(a: string, b: string): number {
    const parse = (s: string) => {
        // Chỉ bắt định dạng 'Học kỳ X - Năm học YYYY-YYYY'
        const match = s.match(/Học kỳ\s*(\d)[\s-]*Năm học\s*(\d{4})[- ]?(\d{4})?/);
        if (!match) return null;
        const hk = parseInt(match[1]);
        const y1 = parseInt(match[2]);
        const y2 = parseInt(match[3] || match[2]);
        return { hk, y1, y2 };
    };
    const sa = parse(a);
    const sb = parse(b);
    if (!sa || !sb) return 0;
    // So sánh năm học mới nhất trước
    if (sa.y2 !== sb.y2) return sa.y2 - sb.y2;
    if (sa.y1 !== sb.y1) return sa.y1 - sb.y1;
    // Nếu cùng năm, học kỳ 2 trước học kỳ 1
    if (sa.hk !== sb.hk) return sa.hk - sb.hk;
    return 0;
}

export default function SemesterScoreTable({
    scoreScale = '10',
    userId,
}: {
    scoreScale?: '10' | '4';
    userId?: string;
}) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ [key: string]: any[] }>({});

    const columns: ColumnsType<any> = [
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
            dataIndex: 'subjectCode',
            key: 'subjectCode',
            align: 'center',
        },
        {
            title: 'TÊN MÔN',
            dataIndex: 'subjectName',
            key: 'subjectName',
            width: 250,
        },
        {
            title: 'TC',
            dataIndex: 'credit',
            key: 'credit',
            align: 'center',
        },
        {
            title: 'QT',
            dataIndex: 'QT',
            key: 'QT',
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
            dataIndex: 'TH',
            key: 'TH',
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
            dataIndex: 'GK',
            key: 'GK',
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
            dataIndex: 'CK',
            key: 'CK',
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
            dataIndex: 'TK',
            key: 'TK',
            align: 'center',
            render: (value) => {
                if (value === undefined || value === null || value === '') return '-';
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
                return (
                    <Tag
                        color={
                            status === 'Hoàn thành'
                                ? 'green'
                                : status === 'Rớt'
                                ? 'red'
                                : status === 'Miễn'
                                ? 'blue'
                                : status === 'Hoãn thi'
                                ? 'orange'
                                : status === 'Đang học'
                                ? 'gold'
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
        let url = '';
        let headers: any = {};
        if (userId) {
            url = `${process.env.NEXT_PUBLIC_BackendURL}/score/user/${userId}`;
            const token = getCookie('NCToken');
            headers = { Authorization: `Bearer ${token}` };
        } else {
            url = `${process.env.NEXT_PUBLIC_BackendURL}/score/profile`;
            const userToken = getCookie('NCToken');
            headers = { Authorization: `Bearer ${userToken}` };
        }
        fetch(url, {
            method: 'GET',
            headers,
        })
            .then((res) => res.json())
            .then((res) => {
                const scores = res.data?.scores || [];
                const semestersData: Record<string, any[]> = {};
                (scores as any[]).forEach((score: any) => {
                    const semester = score.semester || 'Chưa rõ học kỳ';
                    if (!semestersData[semester]) semestersData[semester] = [];
                    semestersData[semester].push({
                        ...score,
                        code: score.subjectCode,
                        name: score.subjectName,
                        credits: score.credit,
                        qt: score.QT,
                        th: score.TH,
                        gk: score.GK,
                        ck: score.CK,
                        total: score.TK,
                        status: score.status,
                    });
                });
                setData(semestersData);
            })
            .catch(() => setData({}))
            .finally(() => setLoading(false));
    }, [userId, scoreScale]);

    return (
        <div className="space-y-8">
            {Object.entries(data)
                .sort(([a], [b]) => compareSemester(b, a))
                .map(([semester, subjects]) => (
                    <div key={semester} className="p-4 bg-white rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{semester}</h2>
                        <Table
                            columns={columns}
                            dataSource={subjects}
                            loading={loading}
                            pagination={false}
                            scroll={{ x: 1000 }}
                            rowKey={(record) =>
                                `${semester}-${record.code}-${record.id || Math.random().toString(36).substring(2, 9)}`
                            }
                            className="antd-custom-table"
                            rowClassName={(record) => (record.status === 'Rớt' ? 'bg-red-100' : '')}
                        />
                    </div>
                ))}
            {Object.keys(data).length === 0 && !loading && (
                <div className="text-center text-gray-500 py-8">
                    Chưa có dữ liệu điểm học kỳ. Vui lòng tải lên file điểm để xem.
                </div>
            )}
        </div>
    );
}
