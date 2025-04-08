// components/uploadbutton/ImportICS.tsx
'use client';
import { Button } from 'antd';
import ical from 'ical.js';

interface ImportICSProps {
  onImport: (events: any[]) => void;
}

const ImportICS = ({ onImport }: ImportICSProps) => {
  // components/uploadbutton/ImportICS.tsx
// components/uploadbutton/ImportICS.tsx
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jcalData = ical.parse(e.target?.result as string);
        const events = jcalData[2].map((component: any) => {
          const event = new ical.Component(component);
          
          // Xử lý các trường có kiểu Time
          const dtstart = event.getFirstPropertyValue('dtstart');
          const dtend = event.getFirstPropertyValue('dtend');
          const summary = event.getFirstPropertyValue('summary');
  
          // Kiểm tra kiểu dữ liệu
          if (!(dtstart instanceof ical.Time) || !(dtend instanceof ical.Time)) {
            console.warn('Invalid date format', component);
            return null;
          }
  
          return {
            title: summary?.toString() || 'Không có tiêu đề',
            start: dtstart.toJSDate(),
            end: dtend.toJSDate(),
            location: event.getFirstPropertyValue('location')?.toString() || '',
            desc: event.getFirstPropertyValue('description')?.toString() || ''
          };
        }).filter(Boolean);
  
        onImport(events);
      } catch (error) {
        console.error('Error parsing ICS file:', error);
        alert('File ICS không hợp lệ');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".ics"
        onChange={handleFileUpload}
        id="ics-upload"
        hidden
      />
      <Button
        onClick={() => document.getElementById('ics-upload')?.click()}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800"
      >
        Import ICS
      </Button>
    </div>
  );
};

export default ImportICS;