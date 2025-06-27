'use client';
import { Table, Tag, Spin, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { convertScore10to4 } from '@/utils/scoreConvert';

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
    // Lấy dữ liệu theo category từ parsedData.categories
    if (parsedData && parsedData.categories && parsedData.categories[category] && Array.isArray(parsedData.categories[category])) {
      return parsedData.categories[category];
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
const getCurrentSubjectObjects = (): { code: string, name: string }[] => {
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

function getCategoryFromCode(code: string) {
  if (code.startsWith('SS')) return 'Môn lý luận chính trị';
  if (code.startsWith('MA') || code.startsWith('PH') || code === 'IT001') return 'Toán - Tin học';
  if (code.startsWith('EN')) return 'Ngoại ngữ';
  if ((code.startsWith('IT') && code !== 'IT001' ) || code.startsWith('NT0') || code.startsWith('NT1') ) return 'Cơ sở ngành';
  if (code === 'NT209') return 'Chuyên ngành';
  if (code.startsWith('NT2')) return 'Tự chọn';
  if (code.startsWith('NT')) return 'Chuyên ngành';
  return 'Tự chọn';
}

const CATEGORY_OPTIONS = [
  { value: 'Môn lý luận chính trị', label: 'Môn lý luận chính trị' },
  { value: 'Toán - Tin học', label: 'Toán - Tin học' },
  { value: 'Ngoại ngữ', label: 'Ngoại ngữ' },
  { value: 'Cơ sở ngành', label: 'Cơ sở ngành' },
  { value: 'Chuyên ngành', label: 'Chuyên ngành' },
  { value: 'Tự chọn', label: 'Tự chọn' },
];

export default function SubjectTable({ 
  title, 
  category,
  onCreditsChange,
  scoreScale = '10',
}: { 
  title: string; 
  category: string;
  onCreditsChange?: (credits: number) => void;
  scoreScale?: '10' | '4';
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Subject[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    setIsClient(true);
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
        const currentSubjects = typeof window !== 'undefined' ? getCurrentSubjectObjects() : [];
        const found = currentSubjects.find(subj => subj.code === record.code);
        return found && found.name ? found.name : value || record.code;
      }
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
            status === 'Miễn' ? 'yellow' :
            status === 'Đang học' ? 'gold' : 'default'
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
    if (category === 'Tất cả') {
      // Lấy dữ liệu cho tất cả các category
      const allCategories = CATEGORY_OPTIONS.map(opt => opt.value);
      const allData: Subject[] = [];
      
      allCategories.forEach(cat => {
        const storedData = typeof window !== 'undefined' ? getScoreDataFromLocalStorage(cat) : null;
        if (storedData) {
          allData.push(...storedData);
        }
      });

      if (allData.length > 0) {
        setData(allData);
        setLoading(false);
      } else {
        // Nếu không có dữ liệu từ localStorage, lấy từ API
        Promise.all(allCategories.map(cat => fetchScoreData(cat)))
          .then(results => {
            const combinedData = results.flat();
            if (combinedData.length > 0) {
              setData(combinedData);
            } else {
              setData(mockData);
            }
          })
          .catch(() => {
            setData(mockData);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      const storedData = typeof window !== 'undefined' ? getScoreDataFromLocalStorage(category) : null;
      if (storedData) {
        setData(storedData);
        setLoading(false);
      } else {
        fetchScoreData(category)
          .then(apiData => {
            if (apiData && apiData.length > 0) {
              setData(apiData);
            } else {
              setData(mockData.filter(item => item.category === category));
            }
          })
          .catch(error => {
            setData(mockData.filter(item => item.category === category));
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [category]);

  // Hàm lấy dữ liệu điểm từ API
  const fetchScoreData = async (category: string): Promise<Subject[]> => {
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

  // Lấy danh sách môn đang học từ ICS
  const currentSubjects = typeof window !== 'undefined' ? getCurrentSubjectObjects() : [];
  // Gộp các môn ICS vào data bảng điểm nếu chưa có
  const dataWithCurrent = [
    ...data,
    ...currentSubjects
      .filter(subj => {
        const subjCategory = getCategoryFromCode(subj.code);
        return (category === 'Tất cả' || subjCategory === category) && !data.some(item => item.code === subj.code);
      })
      .map(subj => ({
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

  // Mapping trạng thái 'Đang học' cho các môn có code nằm trong current_subject_codes
  const mappedData = dataWithCurrent.map(item => {
    if (currentSubjects.some(subj => subj.code === item.code)) {
      return { ...item, status: 'Đang học' };
    }
    return item;
  });

  // Tính tổng số tín chỉ đã học được (các môn có status 'Hoàn thành')
  useEffect(() => {
    if (Array.isArray(mappedData)) {
      const earnedCredits = mappedData
        .filter(item => item.status === 'Hoàn thành')
        .reduce((sum, item) => sum + (Number(item.credits) || 0), 0);
      
      if (onCreditsChange) {
        onCreditsChange(earnedCredits);
      }
    }
  }, [mappedData, onCreditsChange]);

  if (!isClient) return null;

  // Tính tổng số tín chỉ đã học được
  const earnedCredits = Array.isArray(mappedData)
    ? mappedData
        .filter(item => item.status === 'Hoàn thành')
        .reduce((sum, item) => sum + (Number(item.credits) || 0), 0)
    : 0;

  // Lấy tổng số tín chỉ của category
  const getTotalCredits = (category: string) => {
    switch(category) {
      case 'Môn lý luận chính trị': return 13;
      case 'Toán - Tin học': return 22;
      case 'Ngoại ngữ': return 12;
      case 'Cơ sở ngành': return 49;
      case 'Chuyên ngành': return 12;
      case 'Tự chọn': return 6;
      default: return 0;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-gray-600 ml-10">
          <span className="font-medium">Tín chỉ: </span>
          <span className="font-bold">{earnedCredits}/{getTotalCredits(category)}</span>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={Array.isArray(mappedData)
          ? (category === 'Tất cả' ? mappedData : mappedData.filter(item => item.category === category))
          : []}
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
        rowKey={(record) => `${record.code}-${record.id || Math.random().toString(36).substring(2, 9)}`}
        className="antd-custom-table"
      />
    </div>
  );
}