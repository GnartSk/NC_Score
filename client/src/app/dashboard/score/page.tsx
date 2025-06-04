'use client';
import { useState } from 'react';
import CountChart from "@/components/chart/CountChart";
import OverviewChart from "@/components/chart/OverviewChart";
import SubjectTable from '@/components/SubjectTable';
import UploadHtmlButton from '@/components/uploadbutton/UploadHtmlButton';
import UploadIcsButton from '@/components/uploadbutton/UploadIcsButton';
import { Tabs, Select } from 'antd';
import SemesterScoreTable from '@/components/SemesterScoreTable';
import './scoreTabCustom.css';

const CATEGORY_OPTIONS = [
  { value: 'Tất cả', label: 'Tất cả' },
  { value: 'Môn lý luận chính trị', label: 'Môn lý luận chính trị' },
  { value: 'Toán - Tin học', label: 'Toán - Tin học' },
  { value: 'Ngoại ngữ', label: 'Ngoại ngữ' },
  { value: 'Cơ sở ngành', label: 'Cơ sở ngành' },
  { value: 'Chuyên ngành', label: 'Chuyên ngành' },
  { value: 'Tự chọn', label: 'Tự chọn' },
];

export default function SubjectsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const handleUploadSuccess = (data: any) => {
    // Sau khi upload thành công, cập nhật refreshKey để component SubjectTable re-render
    setRefreshKey(prev => prev + 1);
    
    console.log('Upload success:', data);
  };

  const items = [
    {
      key: 'curriculum',
      label: 'Theo chương trình đào tạo',
      children: (
        <>
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">TỔNG QUAN</h1>
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
                <SubjectTable 
                  key={`subject-table-${category.value}-${refreshKey}`}
                  title={`${category.label}`}
                  category={category.value}
                />
              ))
            ) : (
              <SubjectTable 
                title={`${selectedCategory}`}
                category={selectedCategory}
                key={`subject-table-${selectedCategory}-${refreshKey}`}
              />
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
          </div>
          <SemesterScoreTable key={`semester-${refreshKey}`} />
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
            <CountChart />
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