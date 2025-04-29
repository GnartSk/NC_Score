import { Injectable } from '@nestjs/common';
import pdf from 'pdf-parse';
import { SemesterDTO, StudentGradesDTO, SubjectDTO } from '../score/dto/all-score-body.dto';

@Injectable()
export class ReaderService {
  uploadHtml(file: Express.Multer.File) {
    let content = file.buffer.toString('utf-8');
    let result: Record<string, SemesterDTO> = {};
    let regexStrong = /<strong>&nbsp;&nbsp;&nbsp;(.+?)<\/strong>/g;
    let regexRow =
      /<tr>\s*<td align='center'>\d+<\/td>\s*<td align='center' title='([^']+)'>([^<]+)<\/td>\s*<td[^>]*>\s*([^<]+)<\/td>\s*<td align='center'>(\d+)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center'>([^<]*)<\/td>/g;

    let matches = [...content.matchAll(regexStrong)];

    for (let i = 0; i < matches.length; i++) {
      let matchStrong = matches[i];
      let semester = matchStrong[1].trim();
      let startIndex = matchStrong.index + matchStrong[0].length;
      let endIndex = i + 1 < matches.length ? matches[i + 1].index : content.length;

      result[semester] = { subjects: [] };
      let subContent = content.substring(startIndex, endIndex);
      let matchRow;

      while ((matchRow = regexRow.exec(subContent)) !== null) {
        let subjectCode = matchRow[2].split('.')[0]; // Mã môn
        let subjectName = matchRow[3].replace(/&nbsp;/g, '').trim(); // Tên môn học
        let credit = parseInt(matchRow[4].trim(), 10); // Số tín chỉ
        let QT = matchRow[5]?.trim() ? parseFloat(matchRow[5]) : undefined;
        let GK = matchRow[6]?.trim() ? parseFloat(matchRow[6]) : undefined;
        let TH = matchRow[7]?.trim() ? parseFloat(matchRow[7]) : undefined;
        let CK = matchRow[8]?.trim() ? parseFloat(matchRow[8]) : undefined;
        let TK = matchRow[9]?.trim() || '';

        result[semester].subjects.push({ subjectCode, subjectName, credit, QT, GK, TH, CK, TK });
      }
    }

    return { semesters: result };
  }

  private parseText(text: string): StudentGradesDTO {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line);

    let result: StudentGradesDTO = { semesters: {} };
    let currentSemester = '';
    let buffer: string[] = [];

    const semesterPattern = /Học kỳ \d+ - Năm học \d{4}-\d{4}/;
    const subjectPattern = /^(\d+)?([A-Z]{2,3}\d{3})\s+(.+?)\s+(\d+)((?:\s+\d+(?:\.\d+)?)+)?$/;

    lines.forEach((line) => {
      if (semesterPattern.test(line)) {
        if (buffer.length > 0) {
          this.processBufferedSubject(buffer, result, currentSemester);
        }
        currentSemester = line;
        result.semesters[currentSemester] = { subjects: [] };
        buffer = [];
      } else if (subjectPattern.test(line)) {
        if (buffer.length > 0) {
          this.processBufferedSubject(buffer, result, currentSemester);
        }
        buffer = [line];
      } else if (buffer.length > 0) {
        buffer.push(line);
      }
    });

    if (buffer.length > 0) {
      this.processBufferedSubject(buffer, result, currentSemester);
    }

    return result;
  }

  private processBufferedSubject(buffer: string[], result: StudentGradesDTO, currentSemester: string) {
    if (!currentSemester) return;

    const subjectPattern = /^(\d+)?([A-Z]{2,3}\d{3})\s+(.+?)\s+(\d+)((?:\s+\d+(?:\.\d+)?)+)?$/;
    const subjectDetails = buffer.join(' ').match(subjectPattern);

    if (subjectDetails) {
      const [, , subjectCode, subjectName, credit, scores] = subjectDetails;
      const subject: SubjectDTO = { subjectCode, subjectName, credit: parseInt(credit, 10), TK: '' };

      if (scores) {
        const scoreKeys = ['QT', 'TH', 'CK', 'TK'];
        const scoreValues = scores.trim().split(/\s+/);

        scoreValues.forEach((score, index) => {
          if (score) {
            (subject as any)[scoreKeys[index]] = parseFloat(score);
          }
        });
      }

      result.semesters[currentSemester].subjects.push(subject);
    }
  }

  async uploadPdf(file: Express.Multer.File) {
    const dataBuffer = file.buffer;
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;

    console.log('Raw text from PDF:', extractedText);

    return this.parseText(extractedText);
  }
}
