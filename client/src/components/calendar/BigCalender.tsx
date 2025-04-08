// "use client";

// import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
// import moment from "moment";
// import { calendarEvents } from "@/lib/data";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useState } from "react";

// const localizer = momentLocalizer(moment);

// const BigCalendar = () => {
//   const [view, setView] = useState<View>(Views.WORK_WEEK);

//   const handleOnChangeView = (selectedView: View) => {
//     setView(selectedView);
//   };

//   return (
//     <Calendar
//       localizer={localizer}
//       events={calendarEvents}
//       startAccessor="start"
//       endAccessor="end"
//       views={["month","work_week","day","agenda"]}
//       view={view}
//       style={{ height: "98%" }}
//       onView={handleOnChangeView}
//       min={new Date(2025, 1, 0, 7, 0, 0)}
//       max={new Date(2025, 1, 0, 17, 0, 0)}
//     />
//   );
// };

// export default BigCalendar;

'use client';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('vi');
const localizer = momentLocalizer(moment);

interface BigCalendarProps {
  events: Array<{
    title: string;
    start: Date;
    end: Date;
    desc?: string;
  }>;
}

const BigCalendar = ({ events }: BigCalendarProps) => {
  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      views={['month', 'week', 'day']}
      defaultView="week"
      messages={{
        today: 'Hôm nay',
        previous: 'Trước',
        next: 'Sau',
        month: 'Tháng',
        week: 'Tuần',
        day: 'Ngày'
      }}
      eventPropGetter={(event) => ({
        style: {
          backgroundColor: '#3b82f6',
          borderRadius: '4px',
          border: 'none',
          color: 'white'
        }
      })}
    />
  );
};

export default BigCalendar;