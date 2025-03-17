import StatsCard from "@/components/statscard/StatsCard";
import UploadButtons from "@/components/uploadbutton/UploadButtons";
import ProfileCard from "@/components/profilecard/profilecard";
import CalendarWidget from "@/components/calendar/CalendarWidget";

const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6 min-h-screen" style={{ backgroundColor: "#F0F7FF" }}>
      <div className="grid grid-cols-3 gap-4 items-start">
        <div className="col-span-2 flex flex-col space-y-4">
          <div className="flex items-center bg-gradient-to-r from-blue-400 to-blue-200 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl text-white font-bold">Xin chào, Thùy Trang! 👋</h1>
            <img src="/School.svg" className="h-24 object-contain ml-auto" alt="School" />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex justify-around">
            <StatsCard value="6" label="Kì học" bgColor="bg-blue-100" />
            <StatsCard value="30" label="Số tín chỉ còn lại" bgColor="bg-orange-300" />
            <StatsCard value="91" label="Số tín chỉ hoàn thành" bgColor="bg-teal-300" />
            <StatsCard value="7.52" label="GPA" bgColor="bg-blue-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <UploadButtons label="Tải lên thời khóa biểu" icon="📅" />
            <UploadButtons label="Tải lên bảng điểm sinh viên" icon="🆔" />
          </div>
        </div>

        <div className="col-span-1 flex flex-col space-y-4">
          <CalendarWidget />
          <ProfileCard
            name="Lê Thị Thùy Trang"
            studentId="22521511"
            major="Mạng máy tính & Truyền thông"
            email="22521511@gm.uit.edu.vn"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

