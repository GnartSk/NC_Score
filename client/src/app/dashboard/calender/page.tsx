'use client'
import BigCalendar from "@/components/calendar/BigCalender";
import EventCalendar from "@/components/calendar/EventCalender";
import ImportICS from "@/components/uploadbutton/ImportICS";
import { useState } from "react";


const CalenderPage = () => {
  return (
    <div className="p-1 flex gap-4 flex-col xl:flex-row" style={{ backgroundColor: "#F0F7FF" }}>
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <ImportICS/>
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default CalenderPage;
