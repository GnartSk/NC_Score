import * as fs from 'fs';
import * as path from 'path';
import { parseIcsContent, parseIcsBuffer } from '../../../utils/ics-helper';

/**
 * Đọc file ICS bằng cách sử dụng Buffer
 * 
 * @param filePath Đường dẫn đến file ICS
 * @returns Các sự kiện được phân tích từ file ICS
 */
async function readIcsFileWithBuffer(filePath: string) {
  try {
    // Đọc file thành buffer
    const buffer = fs.readFileSync(filePath);
    
    // Sử dụng hàm parseIcsBuffer từ ics-helper
    const events = parseIcsBuffer(buffer);
    
    console.log(`Đã đọc ${events.length} sự kiện từ file.`);
    
    // In thông tin chi tiết về các sự kiện
    events.forEach((event, index) => {
      console.log(`\n--- Sự kiện ${index + 1} ---`);
      console.log(`Tiêu đề: ${event.title}`);
      console.log(`Mô tả: ${event.description}`);
      console.log(`Thời gian bắt đầu: ${event.start}`);
      console.log(`Thời gian kết thúc: ${event.end}`);
      console.log(`Địa điểm: ${event.location || 'Không có'}`);
      console.log(`UID: ${event.uid}`);
    });
    
    return events;
  } catch (error) {
    console.error('Lỗi khi đọc file ICS:', error.message);
    throw error;
  }
}

/**
 * Đọc file ICS bằng cách sử dụng nội dung chuỗi
 * 
 * @param filePath Đường dẫn đến file ICS
 * @returns Các sự kiện được phân tích từ file ICS
 */
async function readIcsFileWithString(filePath: string) {
  try {
    // Đọc file thành chuỗi UTF-8
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Sử dụng hàm parseIcsContent từ ics-helper
    const events = parseIcsContent(content);
    
    console.log(`Đã đọc ${events.length} sự kiện từ file.`);
    
    // In thông tin chi tiết về các sự kiện
    events.forEach((event, index) => {
      console.log(`\n--- Sự kiện ${index + 1} ---`);
      console.log(`Tiêu đề: ${event.title}`);
      console.log(`Mô tả: ${event.description}`);
      console.log(`Thời gian bắt đầu: ${event.start}`);
      console.log(`Thời gian kết thúc: ${event.end}`);
      console.log(`Địa điểm: ${event.location || 'Không có'}`);
      console.log(`UID: ${event.uid}`);
    });
    
    return events;
  } catch (error) {
    console.error('Lỗi khi đọc file ICS:', error.message);
    throw error;
  }
}

// Xử lý chính
async function main() {
  try {
    // Đường dẫn đến file ICS (cần điều chỉnh để phù hợp với môi trường của bạn)
    const filePath = path.resolve(process.cwd(), 'request/ics/22521511_scheduled (2).ics');
    
    console.log('Đường dẫn file:', filePath);
    console.log('\n=== Đọc file bằng phương thức Buffer ===');
    await readIcsFileWithBuffer(filePath);
    
    console.log('\n=== Đọc file bằng phương thức String ===');
    await readIcsFileWithString(filePath);
    
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

// Chạy chương trình
main(); 