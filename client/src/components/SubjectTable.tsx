'use client';
import { Table, Tag, Spin } from 'antd';
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
  status: 'Hoàn thành' | 'Chưa học' | 'Rớt';
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
            status === 'Rớt' ? 'red' : 'default'
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
    setTimeout(() => {
      setData(mockData.filter(item => item.category === category));
      setLoading(false);
    }, 1000);
  }, [category]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
        rowKey="id"
        className="antd-custom-table"
      />
    </div>
  );
}