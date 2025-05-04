'use client';
import { useState } from 'react';
import CountChart from "@/components/chart/CountChart";
import OverviewChart from "@/components/chart/OverviewChart";
import SubjectTable from '@/components/SubjectTable';
import UploadHtmlButton from '@/components/uploadbutton/UploadHtmlButton';

export default function SubjectsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = (data: any) => {
    // Sau khi upload thành công, cập nhật refreshKey để component SubjectTable re-render
    setRefreshKey(prev => prev + 1);
    
    // Có thể thêm xử lý khác nếu cần
    console.log('Upload success:', data);
  };

  return (
    <>
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">TỔNG QUAN</h1>
        <UploadHtmlButton onUploadSuccess={handleUploadSuccess} />
      </div>
      
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
      
      {/* Môn đại cương */}
      <div className="mb-6">
        <SubjectTable 
          title="Các môn đại cương" 
          category="Đại cương"
          key={`general-${refreshKey}`}
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
    </div>
    </>
  );
}