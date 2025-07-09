'use client';
import { useState, useEffect } from 'react';
import CountChart from "@/components/chart/CountChart";
import OverviewChart from "@/components/chart/OverviewChart";
import SubjectTable from '@/components/SubjectTable';
import UploadHtmlButton from '@/components/uploadbutton/UploadHtmlButton';
import UploadIcsButton from '@/components/uploadbutton/UploadIcsButton';
import { Tabs, Select } from 'antd';
import SemesterScoreTable from '@/components/SemesterScoreTable';
import './scoreTabCustom.css';
import { getScoreDataFromLocalStorage } from '@/components/SubjectTable';

const CATEGORY_OPTIONS = [
  { value: 'Tất cả', label: 'Tất cả' },
  { value: 'Môn lý luận chính trị và pháp luật', label: 'Môn lý luận chính trị và pháp luật', totalCredits: 13 },
  { value: 'Toán - Tin học - Khoa học tự nhiên', label: 'Toán - Tin học - Khoa học tự nhiên', totalCredits: 22 },
  { value: 'Ngoại ngữ', label: 'Ngoại ngữ', totalCredits: 12 },
  { value: 'Nhóm các môn học c ơ sở ngành', label: 'Nhóm các môn học cơ sở ngành', totalCredits: 49 },
  { value: 'Nhóm các môn học chuyên ngành', label: 'Nhóm các môn học chuyên ngành', totalCredits: 12 },
  { value: 'Môn học khác', label: 'Môn học khác', totalCredits: 6 },
];

function getTotalCreditsByMajor(major: string | null) {
  if (!major) return 130;
  if (major.toLowerCase().includes('mạng máy tính & truyền thông dữ liệu')) return 130;
  if (major.toLowerCase().includes('an toàn thông tin')) return 129;
  return 130;
}

function getAllSubjects() {
  // Lấy tất cả môn từ localStorage (nếu có)
  if (typeof window !== 'undefined') {
    const all = getScoreDataFromLocalStorage('Tất cả');
    return Array.isArray(all) ? all : [];
  }
  return [];
}

function getEarnedCredits(subjects: any[]) {
  return subjects
    .filter(item => item.status === 'Hoàn thành' || item.status === 'Miễn')
    .reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
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

async function fetchAllScoresFromAPI() {
  const token = typeof window !== 'undefined' ? getCookie('NCToken') : null;
  if (!token) {
    console.log('No token found');
    return [];
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/score/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('API status:', res.status);
  const data = await res.json();
  console.log('API data:', data);
  if (!res.ok) return [];
  return Array.isArray(data.data?.scores) ? data.data.scores : [];
}

export default function SubjectsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [earnedCredits, setEarnedCredits] = useState<Record<string, number>>({});
  const [scoreScale, setScoreScale] = useState<'10' | '4'>('10');
  const [major, setMajor] = useState<string | null>(null);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);

  const handleCreditsChange = (category: string, credits: number) => {
    setEarnedCredits(prev => ({
      ...prev,
      [category]: credits
    }));
  };

  const handleUploadSuccess = (data: any) => {
    // Sau khi upload thành công, cập nhật refreshKey để component SubjectTable re-render
    setRefreshKey(prev => prev + 1);
    
    console.log('Upload success:', data);
  };

  useEffect(() => {
    async function fetchData() {
      // Lấy ngành học
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('NCToken') : null;
        if (token) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setMajor(data.data?.major || null);
          }
        }
      } catch {}
      // Lấy toàn bộ scores từ API
      const scores = await fetchAllScoresFromAPI();
      setAllSubjects(scores);
      console.log('DEBUG allSubjects:', scores);
    }
    fetchData();
  }, [refreshKey]);

  const totalCredits = getTotalCreditsByMajor(major);
  const earnedCreditsAll = getEarnedCredits(allSubjects);
  const remainingCredits = totalCredits - earnedCreditsAll;

  // Lưu vào localStorage để dashboard page lấy
  if (typeof window !== 'undefined') {
    localStorage.setItem('earnedCreditsAll', earnedCreditsAll.toString());
    localStorage.setItem('remainingCredits', remainingCredits.toString());
  }

  const items = [
    {
      key: 'curriculum',
      label: 'Theo chương trình đào tạo',
      children: (
        <>
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">TỔNG QUAN</h1>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Thang điểm:</span>
                <Select
                  value={scoreScale}
                  onChange={setScoreScale}
                  options={[
                    { value: '10', label: 'Thang 10' },
                    { value: '4', label: 'Thang 4' }
                  ]}
                  style={{ width: 120 }}
                />
              </div>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <span className="font-semibold">Chọn nhóm môn:</span>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={CATEGORY_OPTIONS}
                style={{ minWidth: 220 }}
              />
            </div>
            {selectedCategory === 'Tất cả' ? (
              CATEGORY_OPTIONS.filter(opt => opt.value !== 'Tất cả').map(category => (
                <div key={`category-${category.value}`} className="mb-8">
                  <SubjectTable 
                    key={`subject-table-${category.value}-${refreshKey}`}
                    title={`${category.label}`}
                    category={category.value}
                    scoreScale={scoreScale}
                  />
                </div>
              ))
            ) : (
              <div className="mb-8">
                <SubjectTable 
                  title={`${selectedCategory}`}
                  category={selectedCategory}
                  key={`subject-table-${selectedCategory}-${refreshKey}`}
                  scoreScale={scoreScale}
                />
              </div>
            )}
          </div>
        </>
      ),
    },
    {
      key: 'semester',
      label: 'Theo học kỳ',
      children: (
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ĐIỂM THEO HỌC KỲ</h1>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Thang điểm:</span>
              <Select
                value={scoreScale}
                onChange={setScoreScale}
                options={[
                  { value: '10', label: 'Thang 10' },
                  { value: '4', label: 'Thang 4' }
                ]}
                style={{ width: 120 }}
              />
            </div>
          </div>
          <SemesterScoreTable key={`semester-${refreshKey}`} scoreScale={scoreScale} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-4 gap-2">
        <UploadIcsButton />
        <UploadHtmlButton onUploadSuccess={handleUploadSuccess} />
      </div>
      {/* CHARTS BÊN NGOÀI */}
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        <div className="w-full flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 h-[450px]">
            <CountChart total={totalCredits} earned={earnedCreditsAll} remaining={remainingCredits} />
          </div>
          <div className="w-full lg:w-1/2 h-[450px]">
            <OverviewChart />
          </div>
        </div>
      </div>
      {/* KHUNG ĐIỂM */}
      <div className="bg-white border-2 border-gray-300 rounded-lg">
        <Tabs
          defaultActiveKey="curriculum"
          items={items}
          className="p-4 custom-score-tabs"
          tabBarGutter={24}
        />
      </div>
    </div>
  );
}