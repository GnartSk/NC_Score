import * as fs from 'fs';

/**
 * Trích xuất mã lớp học từ file ICS
 * @param icsFilePath Đường dẫn đến file ICS
 * @returns Danh sách các mã lớp học
 */
export function extractClassCodesFromICS(icsFilePath: string): string[] {
  // Đọc nội dung file ICS
  const icsContent = fs.readFileSync(icsFilePath, 'utf-8');
  
  // Tìm tất cả các dòng SUMMARY
  const summaryRegex = /SUMMARY:(.*?)(?:\r?\n|\r|$)/g;
  const matches = [...icsContent.matchAll(summaryRegex)];
  
  // Trích xuất mã lớp học (phần trước dấu " - ")
  const classCodes = matches.map(match => {
    const summary = match[1];
    const dashIndex = summary.indexOf(' - ');
    if (dashIndex !== -1) {
      return summary.substring(0, dashIndex);
    }
    return summary; // Nếu không có dấu " - " thì trả về toàn bộ chuỗi
  });
  
  return classCodes;
}

/**
 * Trích xuất thông tin lớp học đầy đủ từ file ICS
 * @param icsFilePath Đường dẫn đến file ICS
 * @returns Danh sách các thông tin lớp học
 */
export function extractClassInfoFromICS(icsFilePath: string): Array<{code: string, room: string}> {
  // Đọc nội dung file ICS
  const icsContent = fs.readFileSync(icsFilePath, 'utf-8');
  
  // Tìm tất cả các dòng SUMMARY
  const summaryRegex = /SUMMARY:(.*?)(?:\r?\n|\r|$)/g;
  const matches = [...icsContent.matchAll(summaryRegex)];
  
  // Trích xuất mã lớp học và phòng học
  const classInfo = matches.map(match => {
    const summary = match[1];
    const dashIndex = summary.indexOf(' - ');
    if (dashIndex !== -1) {
      const code = summary.substring(0, dashIndex);
      const room = summary.substring(dashIndex + 3);
      return { code, room };
    }
    return { code: summary, room: '' }; // Nếu không có dấu " - " thì phòng học để trống
  });
  
  return classInfo;
} 