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
              status === 'Hoàn thành' ? 'green' :
              status === 'Rớt' ? 'red' :
              status === 'Miễn' ? 'blue' :
              status === 'Hoãn thi' ? 'orange' :
              status === 'Đang học' ? 'gold' : 'default'
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
    const scoreData = localStorage.getItem('html_score_data');
    let parsedData: any = undefined;
    let semestersData: any = {};
    if (scoreData) {
      try {
        parsedData = JSON.parse(scoreData);
        if (parsedData && parsedData.semesters) {
          // Sử dụng đúng định dạng server trả về
          Object.entries(parsedData.semesters).forEach(([semester, value]) => {
            semestersData[semester] = (value as any).subjects
              ? (value as any).subjects.map((subj: any) => {
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
                })
              : [];
          });
        }
      } catch (error) {
        console.error('Error parsing score data:', error);
      }
    }
    // Thêm các môn ICS (đang học) vào học kỳ mới nhất
    const icsRaw = localStorage.getItem('current_subject_codes');
    if (icsRaw) {
      try {
        const icsSubjects = JSON.parse(icsRaw);
        if (Array.isArray(icsSubjects) && icsSubjects.length > 0) {
          let semesters = Object.keys(semestersData);
          // Sắp xếp học kỳ theo năm và số học kỳ
          semesters.sort((a, b) => {
            const regex = /Học kỳ (\d+) - Năm học (\d{4})-(\d{4})/;
            const matchA = a.match(regex);
            const matchB = b.match(regex);
            if (matchA && matchB) {
              const [ , hkA, yA ] = matchA;
              const [ , hkB, yB ] = matchB;
              // So sánh năm học trước
              if (yA !== yB) return Number(yB) - Number(yA);
              // Nếu năm học giống nhau, so sánh số học kỳ
              return Number(hkB) - Number(hkA);
            }
            // Nếu không match, giữ nguyên thứ tự cũ
            return 0;
          });
          let latestSemester = semesters.length > 0 ? semesters[0] : undefined;
          if (!latestSemester) {
            latestSemester = 'Học kỳ mới nhất';
            semestersData[latestSemester] = [];
          }
          const currentSubjects = semestersData[latestSemester] ? semestersData[latestSemester].map((s: any) => s.code) : [];
          const icsToAdd = icsSubjects.filter((ics: any) => !currentSubjects.includes(ics.code));
          if (icsToAdd.length > 0) {
            const newSubjects = icsToAdd.map((ics: any, idx: number) => ({
              id: `ics-${ics.code}`,
              code: ics.code,
              subjectCode: ics.code,
              name: ics.name,
              subjectName: ics.name,
              credits: '',
              qt: '',
              th: '',
              gk: '',
              ck: '',
              total: '',
              status: 'Đang học',
              semester: latestSemester,
            }));
            semestersData[latestSemester] = [...(semestersData[latestSemester] || []), ...newSubjects];
          }
          // Giữ lại 1 bản ghi duy nhất cho mỗi mã môn trong học kỳ mới nhất, ưu tiên Hoàn thành > Đang học > Rớt
          type StatusType = 'Hoàn thành' | 'Đang học' | 'Rớt';
          const priority: Record<StatusType, number> = { 'Hoàn thành': 3, 'Đang học': 2, 'Rớt': 1 };
          if (semestersData[latestSemester]) {
            const merged = semestersData[latestSemester];
            semestersData[latestSemester] = Object.values(
              merged.reduce((acc: any, item: any) => {
                const code = item.code;
                if (!acc[code]) {
                  acc[code] = item;
                } else {
                  const s1 = (item.status as StatusType);
                  const s2 = (acc[code].status as StatusType);
                  if ((priority[s1] || 0) > (priority[s2] || 0)) {
                    acc[code] = item;
                  }
                }
                return acc;
              }, {} as Record<string, any>)
            );
          }
        }
      } catch (e) { /* ignore */ }
    }
    setData(semestersData);
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
            rowClassName={(record) => record.status === 'Rớt' ? 'bg-red-100' : ''}
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