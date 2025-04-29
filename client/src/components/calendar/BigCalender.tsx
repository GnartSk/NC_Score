'use client';
import { Calendar, momentLocalizer, Event, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import { Tooltip } from 'antd';

moment.locale('vi');
const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  desc?: string;
  location?: string;
}

interface BigCalendarProps {
  events: CalendarEvent[];
}

const BigCalendar = ({ events }: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.WEEK);

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  // Custom event component with tooltip
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const tooltipContent = (
      <div>
        <div><strong>{event.title}</strong></div>
        {event.location && <div><strong>Địa điểm:</strong> {event.location}</div>}
        {event.desc && <div><strong>Mô tả:</strong> {event.desc}</div>}
        <div><strong>Bắt đầu:</strong> {moment(event.start).format('DD/MM/YYYY HH:mm')}</div>
        <div><strong>Kết thúc:</strong> {moment(event.end).format('DD/MM/YYYY HH:mm')}</div>
      </div>
    );

    return (
      <Tooltip title={tooltipContent} color="#1677ff">
        <div className="rbc-event-content">
          {event.title}
        </div>
      </Tooltip>
    );
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      views={['month', 'week', 'day', 'agenda']}
      view={view}
      onView={handleViewChange}
      defaultView="week"
      components={{
        event: EventComponent
      }}
      messages={{
        today: 'Hôm nay',
        previous: 'Trước',
        next: 'Sau',
        month: 'Tháng',
        week: 'Tuần',
        day: 'Ngày',
        agenda: 'Sự kiện',
        showMore: (total) => `+${total} sự kiện khác`
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