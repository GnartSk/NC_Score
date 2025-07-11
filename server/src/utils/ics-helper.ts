import * as fs from 'fs';
import * as path from 'path';
import * as ical from 'node-ical';
import { promisify } from 'util';

// Chuyển đổi hàm callback-based thành Promise-based
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

export interface IcsEvent {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  uid?: string;
  classCode?: string;
  room?: string;
  subjectName?: string;
}

/**
 * Đọc file ICS từ đường dẫn và trả về danh sách các sự kiện
 * @param filePath Đường dẫn đến file ICS
 */
export async function parseIcsFile(filePath: string): Promise<IcsEvent[]> {
  try {
    const fileContent = await readFileAsync(filePath, 'utf8');
    return parseIcsContent(fileContent);
  } catch (error) {
    console.error('Error reading ICS file:', error);
    throw new Error(`Cannot read ICS file: ${error.message}`);
  }
}

/**
 * Phân tích chuỗi nội dung ICS và trả về danh sách các sự kiện
 * @param content Nội dung file ICS dạng chuỗi
 */
export function parseIcsContent(content: string): IcsEvent[] {
  try {
    const events: IcsEvent[] = [];
    const parsedEvents = ical.parseICS(content);

    for (const key in parsedEvents) {
      const event = parsedEvents[key];
      
      // Chỉ xử lý các sự kiện VEVENT
      if (event.type === 'VEVENT' && event.start && event.end) {
        const { classCode, room } = extractClassCodeAndRoom(event.summary || '');
        
        // Lấy subjectName từ description hoặc summary
        let subjectName = '';
        if (event.description) {
          // Tìm tên môn trong description, format: (Tên môn)
          const descMatch = /\((.*?)\)/.exec(event.description);
          if (descMatch) {
            subjectName = descMatch[1].trim();
          }
        }
        
        // Nếu không tìm thấy trong description, sử dụng classCode làm subjectName
        if (!subjectName && classCode) {
          subjectName = classCode;
        }
        
        // Fallback: sử dụng title nếu không có classCode
        if (!subjectName) {
          subjectName = event.summary || 'Unknown Subject';
        }
        
        events.push({
          title: event.summary || 'Untitled Event',
          description: event.description || '',
          start: new Date(event.start),
          end: new Date(event.end),
          location: event.location || '',
          uid: event.uid || undefined,
          classCode,
          room,
          subjectName
        });
      }
    }

    return events;
  } catch (error) {
    console.error('Error parsing ICS content:', error);
    throw new Error(`Cannot parse ICS content: ${error.message}`);
  }
}

/**
 * Lưu danh sách các sự kiện vào file ICS
 * @param events Danh sách sự kiện
 * @param outputPath Đường dẫn để lưu file ICS
 */
export async function saveEventsToIcs(events: IcsEvent[], outputPath: string): Promise<string> {
  try {
    // Đảm bảo thư mục tồn tại
    const dir = path.dirname(outputPath);
    await mkdirAsync(dir, { recursive: true }).catch(() => {});

    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//NC_Score//Calendar//VN\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';

    for (const event of events) {
      icsContent += 'BEGIN:VEVENT\r\n';
      icsContent += `SUMMARY:${event.title}\r\n`;
      
      // Format dates
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      icsContent += `DTSTART:${formatDate(event.start)}\r\n`;
      icsContent += `DTEND:${formatDate(event.end)}\r\n`;
      
      if (event.description) {
        icsContent += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\r\n`;
      }
      
      if (event.location) {
        icsContent += `LOCATION:${event.location}\r\n`;
      }
      
      // Create a unique ID if not provided
      const uid = event.uid || `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@ncscore.com`;
      icsContent += `UID:${uid}\r\n`;
      
      icsContent += 'END:VEVENT\r\n';
    }

    icsContent += 'END:VCALENDAR';

    await writeFileAsync(outputPath, icsContent, 'utf8');
    return outputPath;
  } catch (error) {
    console.error('Error saving ICS file:', error);
    throw new Error(`Cannot save ICS file: ${error.message}`);
  }
}

/**
 * Phân tích Buffer của file ICS và trả về danh sách các sự kiện
 * @param buffer Buffer của file ICS
 */
export function parseIcsBuffer(buffer: Buffer): IcsEvent[] {
  if (!buffer || !(buffer instanceof Buffer)) {
    console.error('Invalid buffer provided to parseIcsBuffer');
    throw new Error('Invalid buffer provided');
  }

  try {
    console.log(`Buffer received: ${buffer.length} bytes`);
    const content = buffer.toString('utf8');
    console.log(`Content length: ${content.length} characters`);
    
    // Kiểm tra nội dung hợp lệ
    if (!content || !content.includes('BEGIN:VCALENDAR')) {
      console.error('Invalid ICS content format (no BEGIN:VCALENDAR)');
      throw new Error('Invalid ICS content format');
    }
    
    return parseIcsContent(content);
  } catch (error) {
    console.error('Error parsing ICS buffer:', error);
    throw error;
  }
}

/**
 * Trích xuất mã lớp học và phòng học từ chuỗi summary
 * Format: "SUMMARY:[Mã lớp] - [Phòng học]"
 * @param summary Chuỗi summary từ sự kiện ICS
 * @returns Object chứa mã lớp học và phòng học
 */
export function extractClassCodeAndRoom(summary: string): { classCode: string, room: string } {
  const dashIndex = summary.indexOf(' - ');
  let classPart = summary;
  let room = '';
  
  if (dashIndex !== -1) {
    classPart = summary.substring(0, dashIndex);
    room = summary.substring(dashIndex + 3);
  }
  
  // Lấy phần trước dấu chấm đầu tiên để chỉ lấy mã môn học
  // Ví dụ: NT541.P21.2 -> NT541, NT541.P21 -> NT541
  const dotIndex = classPart.indexOf('.');
  let classCode = classPart;
  if (dotIndex !== -1) {
    classCode = classPart.substring(0, dotIndex);
  }
  
  return { classCode: classCode.trim(), room: room.trim() };
}

/**
 * Trích xuất danh sách mã lớp học từ file ICS
 * @param filePath Đường dẫn đến file ICS
 * @returns Danh sách các mã lớp học
 */
export function extractClassCodesFromICS(filePath: string): string[] {
  const icsContent = fs.readFileSync(filePath, 'utf-8');
  
  const summaryRegex = /SUMMARY:(.*?)(?:\r?\n|\r|$)/g;
  const matches = [...icsContent.matchAll(summaryRegex)];
  
  const classCodes = matches.map(match => {
    const summary = match[1];
    const { classCode } = extractClassCodeAndRoom(summary);
    return classCode;
  });
  
  return classCodes;
}

/**
 * Trích xuất thông tin lớp học đầy đủ từ file ICS
 * @param filePath Đường dẫn đến file ICS
 * @returns Danh sách các thông tin lớp học
 */
export function extractClassInfoFromICS(filePath: string): Array<{code: string, room: string}> {
  const icsContent = fs.readFileSync(filePath, 'utf-8');
  
  const summaryRegex = /SUMMARY:(.*?)(?:\r?\n|\r|$)/g;
  const matches = [...icsContent.matchAll(summaryRegex)];
  
  const classInfo = matches.map(match => {
    const summary = match[1];
    const { classCode: code, room } = extractClassCodeAndRoom(summary);
    return { code, room };
  });
  
  return classInfo;
}

/**
 * Trích xuất mã lớp học từ buffer ICS
 * @param buffer Buffer của file ICS
 * @returns Danh sách các mã lớp học
 */
export function extractClassCodesFromBuffer(buffer: Buffer): string[] {
  if (!buffer || !(buffer instanceof Buffer)) {
    throw new Error('Invalid buffer provided');
  }
  
  try {
    const content = buffer.toString('utf8');
    
    // Kiểm tra nội dung hợp lệ
    if (!content || !content.includes('BEGIN:VCALENDAR')) {
      throw new Error('Invalid ICS content in buffer');
    }
    
    // Tìm tất cả các dòng SUMMARY
    const summaryRegex = /SUMMARY:(.*?)(?:\r?\n|\r|$)/g;
    const matches = [...content.matchAll(summaryRegex)];
    
    if (matches.length === 0) {
      return []; // Không tìm thấy dòng SUMMARY nào
    }
    
    // Trích xuất mã lớp học (phần trước dấu " - ")
    const classCodes = matches.map(match => {
      const summary = match[1];
      const { classCode } = extractClassCodeAndRoom(summary);
      return classCode;
    });
    
    return classCodes;
  } catch (error) {
    console.error('Error extracting class codes from buffer:', error);
    throw error;
  }
}

/**
 * Trích xuất mã lớp học và tên môn học từ buffer ICS
 * @param buffer Buffer của file ICS
 * @returns Danh sách các mã lớp học và tên môn học
 */
export function extractClassCodesAndNamesFromBuffer(buffer: Buffer): Array<{ code: string, name: string }> {
  if (!buffer || !(buffer instanceof Buffer)) {
    throw new Error('Invalid buffer provided');
  }
  try {
    const content = buffer.toString('utf8');
    // Tách từng VEVENT
    const eventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
    const events = [...content.matchAll(eventRegex)];
    const result: { code: string, name: string }[] = [];
    
    for (const eventMatch of events) {
      const eventBlock = eventMatch[1];
      // Lấy mã môn từ SUMMARY
      const summaryMatch = /SUMMARY:(.*?)(?:\r?\n|\r|$)/.exec(eventBlock);
      if (summaryMatch) {
        const summary = summaryMatch[1];
        // Sử dụng logic tương tự extractClassCodeAndRoom để chỉ lấy mã môn học
        const dashIndex = summary.indexOf(' - ');
        let classPart = summary;
        
        if (dashIndex !== -1) {
          classPart = summary.substring(0, dashIndex);
        }
        
        // Lấy phần trước dấu chấm đầu tiên để chỉ lấy mã môn học
        const dotIndex = classPart.indexOf('.');
        let code = classPart;
        if (dotIndex !== -1) {
          code = classPart.substring(0, dotIndex);
        }
        code = code.trim();
        
        // Lấy tên môn từ DESCRIPTION
        const descMatch = /DESCRIPTION:.*?\((.*?)\)/.exec(eventBlock);
        const name = descMatch ? descMatch[1].trim() : '';
        
        if (code) result.push({ code, name });
      }
    }
    return result;
  } catch (error) {
    console.error('Error extracting class codes and names from buffer:', error);
    throw error;
  }
}
