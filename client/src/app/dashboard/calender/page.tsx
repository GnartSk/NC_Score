'use client'
import BigCalendar from "@/components/calendar/BigCalender";
import EventCalendar from "@/components/calendar/EventCalender";
import ImportICS from "@/components/uploadbutton/ImportICS";
import { useState } from "react";
import EventForm from "@/components/form/EventForm";
import { Button } from "antd";

const CalenderPage = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  }
  return (
    <div className="p-1 flex gap-4 flex-col xl:flex-row" style={{ backgroundColor: "#F0F7FF" }}>
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default CalenderPage;


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