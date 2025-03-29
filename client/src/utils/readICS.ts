import fs from "fs";
import ical from "ical";

export const readICSFile = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const events = ical.parseICS(data);

  // Lấy thông tin từ các sự kiện
  const eventList = Object.values(events).map((event: any) => {
    if (event.type === "VEVENT") {
      return {
        summary: event.summary,
        start: event.start,
        end: event.end,
        location: event.location,
        description: event.description,
      };
    }
  }).filter(Boolean);

  return eventList;
};
