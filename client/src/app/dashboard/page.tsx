import StatsCard from "@/components/statscard/StatsCard";
import UploadButtons from "@/components/uploadbutton/UploadButtons";
import ProfileCard from "@/components/profilecard/profilecard";
import CalendarWidget from "@/components/calendar/CalendarWidget";

const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
<div
          className="min-h-[10rem] h-10 min-w-[12.5rem] shrink-0 flex bg-gradient-to-r from-blue-400 to-blue-200 bg-opacity-50 rounded-lg"

        >
          <h1 className="text-3xl mt-8 ml-10 flex text-white font-bold ">
            Xin chào, Thùy Trang!👋
          </h1>
          <div className=" flex flex-initial -mt-28 h-96 w-96 ml-32">
            <img
              src="/School.svg"
              className="object-contain"
            />
          </div>
        </div>
      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard value="6" label="Kì học" />
        <StatsCard value="Số tín chỉ còn lại" label="✔" />
        <StatsCard value="7.52" label="GPA" />
      </div>

      {/*thông tin người dùng */}
      <div className="grid grid-cols-3 gap-4">
        <UploadButtons />
        <CalendarWidget />
        <ProfileCard
          name="Lê Thị Thùy Trang"
          studentId="22521511"
          major="Mạng máy tính & Truyền thông"
          email="22521511@gm.uit.edu.vn"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
