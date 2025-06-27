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

export default function SemesterScoreTable({ scoreScale = '10' }: { scoreScale?: '10' | '4' }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{[key: string]: Subject[]}>({});

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
        if (value === 'Miễn') {
          return <Tag color="green" className="px-2 py-1 rounded text-xs font-semibold">Miễn</Tag>;
        }
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
      render: (status) => (
        <Tag 
          color={
            status === 'Hoàn thành' ? 'green' :
            status === 'Rớt' ? 'red' :
            status === 'Miễn' ? 'yellow' : 'default'
          }
          className="rounded-full px-3"
        >
          {status}
        </Tag>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    
    // Lấy dữ liệu từ localStorage
    const scoreData = localStorage.getItem('html_score_data');
    if (scoreData) {
      try {
        const parsedData = JSON.parse(scoreData);
        if (parsedData && parsedData.semesters) {
          setData(parsedData.semesters);
        }
      } catch (error) {
        console.error('Error parsing score data:', error);
      }
    }
    
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      {Object.entries(data).map(([semester, subjects]) => (
        <div key={semester} className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{semester}</h2>
          <Table
            columns={columns}
            dataSource={subjects}
            loading={loading}
            pagination={false}
            scroll={{ x: 1000 }}
            rowKey={(record) => `${semester}-${record.code}-${record.id || Math.random().toString(36).substring(2, 9)}`}
            className="antd-custom-table"
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