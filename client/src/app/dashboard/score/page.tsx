'use client';
import { useState } from 'react';
import CountChart from "@/components/chart/CountChart";
import OverviewChart from "@/components/chart/OverviewChart";
import SubjectTable from '@/components/SubjectTable';
import UploadHtmlButton from '@/components/uploadbutton/UploadHtmlButton';
import UploadIcsButton from '@/components/uploadbutton/UploadIcsButton';
import { Tabs } from 'antd';
import SemesterScoreTable from '@/components/SemesterScoreTable';
import './scoreTabCustom.css';

export default function SubjectsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

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
            
            {/* Khối kiến thức đại cương */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">KHỐI KIẾN THỨC ĐẠI CƯƠNG</h2>
              
              {/* Môn lý luận chính trị */}
              <div className="mb-6">
                <SubjectTable 
                  title="Các môn lý luận chính trị" 
                  category="Môn lý luận chính trị"
                  key={`political-${refreshKey}`}
                />
              </div>

              {/* Toán - Tin học */}
              <div className="mb-6">
                <SubjectTable 
                  title="Toán - Tin học - Khoa học tự nhiên" 
                  category="Toán - Tin học"
                  key={`math-${refreshKey}`}
                />
              </div>
              
              {/* Môn đại cương khác (ngoại ngữ) */}
              <div className="mb-6">
                <SubjectTable 
                  title="Ngoại ngữ" 
                  category="Ngoại ngữ"
                  key={`general-${refreshKey}`}
                />
              </div>
            </div>
            
            {/* Khối kiến thức chuyên ngành */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">KHỐI KIẾN THỨC CHUYÊN NGÀNH</h2>
              
              {/* Môn cơ sở ngành */}
              <div className="mb-6">
                <SubjectTable 
                  title="Các môn cơ sở ngành" 
                  category="Cơ sở ngành"
                  key={`foundation-${refreshKey}`}
                />
              </div>
              
              {/* Môn chuyên ngành */}
              <div className="mb-6">
                <SubjectTable 
                  title="Các môn chuyên ngành" 
                  category="Chuyên ngành"
                  key={`specialized-${refreshKey}`}
                />
              </div>
              
              {/* Môn tự chọn */}
              <div className="mb-6">
                <SubjectTable 
                  title="Các môn tự chọn" 
                  category="Tự chọn"
                  key={`elective-${refreshKey}`}
                />
              </div>
            </div>
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