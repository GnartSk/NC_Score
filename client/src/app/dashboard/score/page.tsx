 import CountChart from "@/components/chart/CountChart";
 import OverviewChart from "@/components/chart/OverviewChart";

// const ScorePage = () => {
//   return (
//     <div className="p-4 flex gap-4 flex-col md:flex-row">
//       <div className="w-full flex gap-4 flex-col lg:flex-row">
//         <div className="w-full lg:w-1/2 h-[450px]">
//           <CountChart />
//         </div>

//         <div className="w-full lg:w-1/2 h-[450px]">
//           <OverviewChart />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScorePage;


import SubjectTable from '@/components/SubjectTable';

export default function SubjectsPage() {
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
      <h1 className="text-2xl font-bold mb-6">TỔNG QUAN</h1>
      
      {/* Môn lý luận chính trị */}
      <SubjectTable 
        title="Các môn lý luận chính trị" 
        category="political"  // Đảm bảo khớp với category trong mock data
      />

      {/* Toán - Tin học */}
      <SubjectTable 
        title="Toán - Tin học - Khoa học tự nhiên" 
        category="math"  // Đảm bảo khớp với category trong mock data
      />
    </div>
    </>
  );
}