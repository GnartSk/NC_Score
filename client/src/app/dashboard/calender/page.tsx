'use client';
import BigCalendar from "@/components/calendar/BigCalender";
import EventCalendar from "@/components/calendar/EventCalender";
import ImportICS from "@/components/uploadbutton/ImportICS";
import { useState } from "react";
import EventForm from "@/components/form/EventForm";
import { Button, message, Tooltip } from "antd";
import { exportToICS } from "@/utils/icsHelper";
import { DownloadOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  desc?: string;
  location?: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    setShowForm(false);
    message.success('Đã thêm sự kiện mới thành công');
  };

  const handleICSImport = (importedEvents: Event[]) => {
    // Only add events that don't already exist in the calendar
    const newEvents = importedEvents.filter(newEvent => 
      !events.some(existingEvent => 
        existingEvent.title === newEvent.title &&
        existingEvent.start.getTime() === newEvent.start.getTime() &&
        existingEvent.end.getTime() === newEvent.end.getTime()
      )
    );
    
    if (newEvents.length === 0) {
      message.info('Tất cả sự kiện đã tồn tại trong lịch');
      return;
    }
    
    const formattedEvents = newEvents.map(event => ({
      ...event,
      allDay: event.start.getHours() === 0 && 
              event.start.getMinutes() === 0 && 
              event.end.getHours() === 0 && 
              event.end.getMinutes() === 0
    }));
    
    setEvents([...events, ...formattedEvents]);
    message.success(`Đã thêm ${formattedEvents.length} sự kiện mới vào lịch`);
  };

  const handleExportICS = () => {
    if (events.length === 0) {
      message.warning('Không có sự kiện nào để xuất');
      return;
    }
    
    exportToICS(events, 'lich-hoc.ics');
    message.success('Đã xuất file ICS thành công');
  };

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row bg-blue-50 min-h-screen">
      {/* Main Calendar */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lịch Học</h1>
            <div className="flex gap-2">
              <Tooltip title="Thêm sự kiện mới">
                <Button 
                  type="primary" 
                  onClick={() => setShowForm(true)}
                  icon={<PlusOutlined />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm Lịch
                </Button>
              </Tooltip>
              
              <Tooltip title="Nhập lịch từ file ICS">
                <ImportICS onImport={handleICSImport} />
              </Tooltip>
              
              <Tooltip title="Xuất lịch ra file ICS">
                <Button
                  onClick={handleExportICS}
                  icon={<DownloadOutlined />}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={events.length === 0}
                >
                  Xuất ICS
                </Button>
              </Tooltip>
            </div>
          </div>
          
          <BigCalendar events={events} />
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <EventCalendar />
        </div>
        
        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <EventForm 
              onSubmit={handleAddEvent}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;