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
  
  // Trích xuất mã lớp học (phần trước dấu chấm đầu tiên)
  const classCodes = matches.map(match => {
    const summary = match[1];
    const dashIndex = summary.indexOf(' - ');
    let classPart = summary;
    if (dashIndex !== -1) {
      classPart = summary.substring(0, dashIndex);
    }
    const dotIndex = classPart.indexOf('.');
    if (dotIndex !== -1) {
      return classPart.substring(0, dotIndex).trim();
    }
    return classPart.trim();
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
    let classPart = summary;
    let room = '';
    if (dashIndex !== -1) {
      classPart = summary.substring(0, dashIndex);
      room = summary.substring(dashIndex + 3);
    }
    const dotIndex = classPart.indexOf('.');
    let code = classPart;
    if (dotIndex !== -1) {
      code = classPart.substring(0, dotIndex);
    }
    return { code: code.trim(), room: room.trim() };
  });
  
  return classInfo;
} 