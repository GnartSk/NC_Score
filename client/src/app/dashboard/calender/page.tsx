// 'use client'
// import BigCalendar from "@/components/calendar/BigCalender";
// import EventCalendar from "@/components/calendar/EventCalender";
// import ImportICS from "@/components/uploadbutton/ImportICS";
// import { useState } from "react";
// import EventForm from "@/components/form/EventForm";
// import { Button } from "antd";

// const CalenderPage = () => {
//   const [events, setEvents] = useState([]);
//   const [showForm, setShowForm] = useState(false);
  
//   const handleAddEvent = (newEvent) => {
//     setEvents([...events, newEvent]);
//   }
//   return (
//     <div className="p-1 flex gap-4 flex-col xl:flex-row" style={{ backgroundColor: "#F0F7FF" }}>
//       <div className="w-full xl:w-2/3">
//         <div className="h-full bg-white p-4 rounded-md">
//           <h1 className="text-xl font-semibold">Schedule</h1>
//           <BigCalendar />
//         </div>
//       </div>
//       <div className="w-full xl:w-1/3 flex flex-col gap-8">
//         <EventCalendar />
//       </div>
//     </div>
//   );
// };

// export default CalenderPage;


// import { useState } from 'react';
// import EventForm from '@/components/form/EventForm';
// import EventList from '@/components/form/EventList';


// interface EventData {
//   _id: string;
//   title: string;
//   description: string;
//   startTime: string;
//   endTime: string;
// }

// const EventsPage = () => {
//   const [newEvent, setNewEvent] = useState<EventData | undefined>(undefined);

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold text-center mb-4">Quản Lý Lịch học</h1>
//       <EventForm onEventAdded={(event: EventData) => setNewEvent(event)} />
//       <EventList newEvent={newEvent} />
//     </div>
//   );
// };

// export default EventsPage;



'use client';
import BigCalendar from "@/components/calendar/BigCalender";
import EventCalendar from "@/components/calendar/EventCalender";
import ImportICS from "@/components/uploadbutton/ImportICS";
import { useState } from "react";
import EventForm from "@/components/form/EventForm";
import { Button } from "antd";

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  desc?: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    setShowForm(false);
  };

  const handleICSImport = (importedEvents: any[]) => {
    const formattedEvents = importedEvents.map(event => ({
      ...event,
      allDay: event.start.getHours() === 0 && event.end.getHours() === 0
    }));
    setEvents([...events, ...formattedEvents]);
  };

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row bg-blue-50 min-h-screen">
      {/* Main Calendar */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lịch Học</h1>
            <div className="flex gap-2">
              <Button 
                type="primary" 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm Lịch
              </Button>
              <ImportICS onImport={handleICSImport} />
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