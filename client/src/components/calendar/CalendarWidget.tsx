import { Calendar } from "antd";

const CalendarWidget = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-2">Lịch</h3>
      <Calendar fullscreen={false} />
    </div>
  );
};

export default CalendarWidget;
