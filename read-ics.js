const fs = require('fs');
const path = require('path');
const ical = require('node-ical');

/**
 * Đọc file ICS bằng thư viện node-ical
 * @param {string} filePath Đường dẫn đến file ICS
 */
function readIcsFile(filePath) {
  try {
    // Kiểm tra file tồn tại
    if (!fs.existsSync(filePath)) {
      console.error(`File không tồn tại: ${filePath}`);
      return;
    }

    // Đọc file thành chuỗi
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Phân tích nội dung ICS
    const parsedEvents = ical.parseICS(fileContent);
    
    // Lọc các sự kiện và chuyển đổi thành mảng dễ đọc
    const events = [];
    for (const key in parsedEvents) {
      const event = parsedEvents[key];
      
      // Chỉ xử lý các loại sự kiện VEVENT
      if (event.type === 'VEVENT' && event.start && event.end) {
        events.push({
          title: event.summary || 'Untitled Event',
          description: event.description || '',
          start: event.start,
          end: event.end,
          location: event.location || '',
          uid: event.uid || '',
          rrule: event.rrule ? {
            freq: event.rrule.freq,
            interval: event.rrule.interval,
            until: event.rrule.until,
            byDay: event.rrule.byDay
          } : null
        });
      }
    }
    
    // In kết quả
    console.log(`Đã đọc ${events.length} sự kiện từ file.`);
    
    events.forEach((event, index) => {
      console.log(`\n--- Sự kiện ${index + 1} ---`);
      console.log(`Tiêu đề: ${event.title}`);
      console.log(`Mô tả: ${event.description}`);
      console.log(`Thời gian bắt đầu: ${event.start}`);
      console.log(`Thời gian kết thúc: ${event.end}`);
      console.log(`Địa điểm: ${event.location || 'Không có'}`);
      console.log(`UID: ${event.uid}`);
      
      if (event.rrule) {
        console.log('Lặp lại: ');
        console.log(`  - Tần suất: ${event.rrule.freq}`);
        console.log(`  - Khoảng: ${event.rrule.interval}`);
        console.log(`  - Đến: ${event.rrule.until}`);
        console.log(`  - Ngày: ${event.rrule.byDay ? event.rrule.byDay.join(', ') : 'N/A'}`);
      }
    });
    
    return events;
  } catch (error) {
    console.error('Lỗi khi đọc file ICS:', error);
  }
}

// Đường dẫn đến file ICS
const filePath = path.resolve(__dirname, 'request/ics/22521511_scheduled (2).ics');

console.log('Đọc file ICS từ đường dẫn:', filePath);
readIcsFile(filePath);

// Hướng dẫn cài đặt thư viện node-ical
console.log('\n===================================');
console.log('LƯU Ý: Trước khi chạy file này, hãy cài đặt thư viện node-ical:');
console.log('npm install node-ical');
console.log('hoặc');
console.log('yarn add node-ical');
console.log('==================================='); 