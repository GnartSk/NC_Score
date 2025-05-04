'use client';
import { Table, Tag, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

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
  status: 'Hoàn thành' | 'Chưa học' | 'Rớt'|'Miễn';
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
    category: 'political'
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
    category: 'political'
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
    category: 'political'
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
    category: 'political'
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
    category: 'political'
  },
  {
    id: 9,
    code: 'MA006',
    name: 'Giải tích',
    credits: 4,
    qt: 2,
    status: 'Rớt',
    category: 'math'
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
    category: 'math'
  },
];

// Hàm kiểm tra và lấy dữ liệu từ localStorage
const getScoreDataFromLocalStorage = (category: string): Subject[] | null => {
  try {
    const scoreData = localStorage.getItem('html_score_data');
    if (!scoreData) return null;
    
    const parsedData = JSON.parse(scoreData);
    
    // Kiểm tra xem có dữ liệu trong category này không
    if (parsedData && parsedData[category] && Array.isArray(parsedData[category])) {
      return parsedData[category];
    }
    
    return null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export default function SubjectTable({ title, category }: { title: string; category: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Subject[]>([]);

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
      render: (value) => value || '-',
    },
    {
      title: 'TH',
      dataIndex: 'th',
      key: 'th',
      align: 'center',
      render: (value) => value || '-',
    },
    {
      title: 'GK',
      dataIndex: 'gk',
      key: 'gk',
      align: 'center',
      render: (value) => value || '-',
    },
    {
      title: 'CK',
      dataIndex: 'ck',
      key: 'ck',
      align: 'center',
      render: (value) => value || '-',
    },
    {
      title: 'TỔNG KẾT',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (value) => value?.toFixed(1) || '-',
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
    
    // Kiểm tra xem có dữ liệu từ file HTML đã được upload không
    const storedData = typeof window !== 'undefined' ? getScoreDataFromLocalStorage(category) : null;
    
    if (storedData) {
      // Nếu có dữ liệu từ localStorage, sử dụng dữ liệu đó
      setData(storedData);
      setLoading(false);
    } else {
      // Nếu không có, thử lấy từ API
      fetchScoreData()
        .then(apiData => {
          if (apiData && apiData.length > 0) {
            setData(apiData);
          } else {
            // Nếu không có dữ liệu từ API, dùng mock data
            setData(mockData.filter(item => item.category === category));
          }
        })
        .catch(error => {
          console.error('Error fetching score data:', error);
          // Dùng mock data nếu có lỗi
          setData(mockData.filter(item => item.category === category));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [category]);

  // Hàm lấy dữ liệu điểm từ API
  const fetchScoreData = async (): Promise<Subject[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/scores?category=${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching score data:', error);
      return [];
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
        rowKey={(record) => record.id?.toString() || `${record.code}-${Math.random().toString(36).substring(2, 9)}`}
        className="antd-custom-table"
      />
    </div>
  );
}