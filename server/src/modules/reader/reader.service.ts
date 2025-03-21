import { Injectable } from '@nestjs/common';
import pdf from 'pdf-parse';

@Injectable()
export class ReaderService {
  uploadHtml(file: Express.Multer.File) {
    let content = file.buffer.toString('utf-8');
    let result: Record<string, any> = {};
    let regexStrong = /<strong>&nbsp;&nbsp;&nbsp;(.+?)<\/strong>/g;
    let regexRow =
      /<tr>\s*<td align='center'>\d+<\/td>\s*<td align='center' title='([^']+)'>([^<]+)<\/td>\s*<td[^>]*>\s*([^<]+)<\/td>\s*<td align='center'>(\d+)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center'>([^<]*)<\/td>/g;

    let matches = [...content.matchAll(regexStrong)];

    for (let i = 0; i < matches.length; i++) {
      let matchStrong = matches[i];
      let key = matchStrong[1].trim();
      let startIndex = matchStrong.index + matchStrong[0].length;
      let endIndex = i + 1 < matches.length ? matches[i + 1].index : content.length;

      result[key] = [];
      let subContent = content.substring(startIndex, endIndex);
      let matchRow;

      while ((matchRow = regexRow.exec(subContent)) !== null) {
        let subjectCode = matchRow[2].split('.')[0]; // Mã môn
        let subjectName = matchRow[3].replace(/&nbsp;/g, '').trim(); // Tên môn học, loại bỏ &nbsp;
        let credit = matchRow[4].trim(); // Số tín chỉ
        let QT = matchRow[5]?.trim() || '';
        let GK = matchRow[6]?.trim() || '';
        let TH = matchRow[7]?.trim() || '';
        let CK = matchRow[8]?.trim() || '';
        let TK = matchRow[9]?.trim() || '';

        let scores: Record<string, string> = {};
        if (QT) scores.QT = QT;
        if (GK) scores.GK = GK;
        if (TH) scores.TH = TH;
        if (CK) scores.CK = CK;
        if (TK) scores.TK = TK;

        if (Object.keys(scores).length > 0) {
          result[key].push({ subjectCode, subjectName, credit, ...scores });
        }
      }
    }
    return result;
  }

  private processBufferedSubject(buffer: string[], result: any, currentSemester: string) {
    const mergedLine = buffer.join(' ').replace(/\s+/g, ' '); // Ghép dòng bị tách
    const subjectPattern = /^(\d+)?([A-Z]{2,3}\d{3})\s+(.+?)\s+(\d+)((?:\s+\d+(?:\.\d+)?)+)?$/;
    const match = mergedLine.match(subjectPattern);

    if (match) {
      const [, , subjectCode, subjectName, credit, scores] = match;
      const subject: any = { subjectCode, subjectName, credit };

      // Tách điểm số
      if (scores) {
        const scoreValues = scores.trim().split(/\s+/);
        const labels = ['QT', 'GK', 'TH', 'CK', 'TK'];
        scoreValues.forEach((score, index) => (subject[labels[index]] = score));
      }

      result.parsedData[currentSemester].push(subject);
    }
  }

  private parseText(text: string): any {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line);
    const result: any = { parsedData: {} };
    let currentSemester = '';
    let buffer: string[] = [];

    // Regex nhận diện tiêu đề học kỳ
    const semesterPattern = /Học kỳ \d+ - Năm học \d{4}-\d{4}/;
    // Regex nhận diện môn học (Mã HP + Tên môn + Tín chỉ + Điểm số)
    const subjectPattern = /^(\d+)?([A-Z]{2,3}\d{3})\s+(.+?)\s+(\d+)((?:\s+\d+(?:\.\d+)?)+)?$/;

    lines.forEach((line) => {
      if (semesterPattern.test(line)) {
        if (buffer.length > 0) this.processBufferedSubject(buffer, result, currentSemester);
        currentSemester = line;
        result.parsedData[currentSemester] = [];
        buffer = [];
      } else if (subjectPattern.test(line)) {
        if (buffer.length > 0) this.processBufferedSubject(buffer, result, currentSemester);
        buffer = [line]; // Bắt đầu môn học mới
      } else if (buffer.length > 0) {
        buffer.push(line); // Ghép dòng bị xuống dòng
      }
    });

    if (buffer.length > 0) this.processBufferedSubject(buffer, result, currentSemester);

    console.log('Parsed Data:', JSON.stringify(result, null, 2));
    return result;
  }

  async uploadPdf(file: Express.Multer.File) {
    const dataBuffer = file.buffer;
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;

    console.log('Raw text from PDF:', extractedText);

    return this.parseText(extractedText);   }
}
