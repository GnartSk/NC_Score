'use client';
import ICAL from 'ical.js';

interface ICSEvent {
  title: string;
  start: Date;
  end: Date;
  desc?: string;
  location?: string;
  allDay?: boolean;
}

export const parseICSContent = (icsContent: string): ICSEvent[] => {
  try {
    const jcalData = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
    const events: ICSEvent[] = [];

    vevents.forEach((vevent) => {
      const event = new ICAL.Event(vevent);
      
      if (event.startDate && event.endDate) {
        const startDate = event.startDate.toJSDate();
        const endDate = event.endDate.toJSDate();
        
        const isAllDay = startDate.getHours() === 0 && 
                        startDate.getMinutes() === 0 && 
                        endDate.getHours() === 0 && 
                        endDate.getMinutes() === 0;

        events.push({
          title: event.summary || 'Không có tiêu đề',
          start: startDate,
          end: endDate,
          desc: event.description || '',
          location: event.location || '',
          allDay: isAllDay
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error parsing ICS content:', error);
    return [];
  }
};

export const exportToICS = (events: ICSEvent[], filename: string = 'calendar.ics') => {
  const calendar = new ICAL.Component(['vcalendar', [], []]);
  
  calendar.updatePropertyWithValue('version', '2.0');
  calendar.updatePropertyWithValue('prodid', '-//NC_Score//Calendar//VN');

  events.forEach(event => {
    const vevent = new ICAL.Component('vevent');
    
    const startDate = ICAL.Time.fromJSDate(event.start, false);
    const endDate = ICAL.Time.fromJSDate(event.end, false);
    
    vevent.addPropertyWithValue('summary', event.title);
    vevent.addPropertyWithValue('dtstart', startDate);
    vevent.addPropertyWithValue('dtend', endDate);
    
    if (event.desc) {
      vevent.addPropertyWithValue('description', event.desc);
    }
    
    if (event.location) {
      vevent.addPropertyWithValue('location', event.location);
    }
    
    const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@ncscore.com`;
    vevent.addPropertyWithValue('uid', uid);
    
    calendar.addSubcomponent(vevent);
  });

  const icsContent = calendar.toString();

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};