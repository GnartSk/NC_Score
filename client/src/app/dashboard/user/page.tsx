// import React from 'react'

// const ProfileUserPage = () => {
//   return (
//     <div>ProfileUserPage</div>
//   )
// }

// export default ProfileUserPage

// "use client";
// import { useState } from "react";
// import { readICSFile } from "@/utils/readICS";

// const ICSUploader = () => {
//   const [events, setEvents] = useState<any[]>([]);

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       if (event.target?.result) {
//         const icsData = event.target.result.toString();
//         const parsedEvents = readICSData(icsData);
//         setEvents(parsedEvents);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const readICSData = (icsData: string) => {
//     const ical = require("ical");
//     const events = ical.parseICS(icsData);
//     return Object.values(events)
//       .filter((event: any) => event.type === "VEVENT")
//       .map((event: any) => ({
//         summary: event.summary,
//         start: event.start,
//         end: event.end,
//         location: event.location,
//         description: event.description,
//       }));
//   };

//   return (
//     <div>
//       <input type="file" accept=".ics" onChange={handleFileUpload} />
//       {events.map((event, index) => (
//         <div key={index}>
//           <h3>{event.summary}</h3>
//           <p>Bắt đầu: {event.start.toString()}</p>
//           <p>Kết thúc: {event.end.toString()}</p>
//           <p>Địa điểm: {event.location}</p>
//           <p>Mô tả: {event.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ICSUploader;
