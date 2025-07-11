import { extractClassCodesFromICS, extractClassInfoFromICS } from './extract-class-code';
import path from 'path';

// Đường dẫn đến file ICS
const icsFilePath = path.resolve(__dirname, '../../../request/ics/22521511_scheduled (2).ics');

// Trích xuất mã lớp học
console.log('Danh sách mã lớp học:');
const classCodes = extractClassCodesFromICS(icsFilePath);
console.log(classCodes);

// Trích xuất thông tin lớp học đầy đủ
console.log('\nThông tin lớp học đầy đủ:');
const classInfo = extractClassInfoFromICS(icsFilePath);
console.log(classInfo);

