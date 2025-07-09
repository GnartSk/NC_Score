// components/uploadbutton/ImportICS.tsx
'use client';
import { Button, message } from 'antd';
import { useState } from 'react';
import { parseICSContent } from '@/utils/icsHelper';

interface Event {
  title: string;
  start: Date;
  end: Date;
  desc?: string;
  location?: string;
  allDay?: boolean;
}

interface ImportICSProps {
  onImport: (events: Event[]) => void;
}

const ImportICS = ({ onImport }: ImportICSProps) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const calendarEvents = parseICSContent(data);
        
        if (calendarEvents.length) {
          onImport(calendarEvents);
          message.success(`Đã import ${calendarEvents.length} sự kiện thành công`);
        } else {
          message.warning('Không tìm thấy sự kiện nào trong file ICS');
        }
      } catch (error) {
        console.error('Error parsing ICS file:', error);
        message.error('Không thể đọc file ICS. Vui lòng kiểm tra định dạng file.');
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      message.error('Lỗi khi đọc file');
      setLoading(false);
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
        loading={loading}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800"
      >
        Import ICS
      </Button>
    </div>
  );
};

export default ImportICS;