import { Injectable } from '@nestjs/common';
import pdf from 'pdf-parse';
import { SemesterDTO } from '../score/dto/all-score-body.dto';
import * as cheerio from 'cheerio';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from '../subject/schemas/subject.schema';
import { Model } from 'mongoose';
import * as pdf2table from 'pdf2table';

interface OpenSubject {
  subjectCode: string;
  subjectName: string;
  credit: number;
}

@Injectable()
export class ReaderService {
  constructor(
    @InjectModel(Subject.name)
    private subjectModel: Model<Subject>,
  ) {}

  uploadHtml(file: Express.Multer.File) {
    let content = file.buffer.toString('utf-8');
    let result: Record<string, SemesterDTO> = {};
    let regexStrong = /<strong>&nbsp;&nbsp;&nbsp;(.+?)<\/strong>/g;

    // Regex để bắt tr cả các dòng có thuộc tính như style="background-color:#ffbfdf;"
    let regexRow =
      /<tr([^>]*)>\s*<td align='center'>\d+<\/td>\s*<td align='center' title='([^']+)'>([^<]+)<\/td>\s*<td[^>]*>\s*([^<]+)<\/td>\s*<td align='center'>(\d+)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center' title='[^']*'>([^<]*)<\/td>\s*<td align='center'>([^<]*)<\/td>/g;

    // Regex để tìm điểm trung bình chung tích lũy
    let regexCumulative =
      /<strong>&nbsp;&nbsp;Điểm trung bình chung tích lũy<\/strong><\/td>.*?<td[^>]*>\s*<strong>([\d.]+)<\/strong>/s;

    // Trích xuất điểm trung bình chung tích lũy
    let cumulativeMatch = content.match(regexCumulative);
    let cumulativePoint = cumulativeMatch ? parseFloat(cumulativeMatch[1]) : undefined;

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
        let trAttributes = matchRow[1];
        let subjectCode = matchRow[3].split('.')[0];
        let subjectName = matchRow[4].replace(/&nbsp;/g, '').trim();
        let credit = parseInt(matchRow[5].trim(), 10);
        let QT = matchRow[6]?.trim() ? parseFloat(matchRow[6]) : undefined;
        let GK = matchRow[7]?.trim() ? parseFloat(matchRow[7]) : undefined;
        let TH = matchRow[8]?.trim() ? parseFloat(matchRow[8]) : undefined;
        let CK = matchRow[9]?.trim() ? parseFloat(matchRow[9]) : undefined;
        let TK = matchRow[10]?.trim() || '';

        let subject: any = { subjectCode, subjectName, credit, QT, GK, TH, CK, TK };

        if (trAttributes.includes('background-color:#ffbfdf')) {
          subject.status = 'Học lại';
        }

        result[semester].subjects.push(subject);
      }
    }

    return { semesters: result, cumulativePoint };
  }

  async uploadPdf(file: Express.Multer.File): Promise<Record<string, any>> {
    const dataBuffer = file.buffer;
    const semesters = {};
    const semesterRegex = /Học kỳ \d - Năm học \d{4}-\d{4}/;

    return new Promise((resolve, reject) => {
      pdf2table.parse(dataBuffer, (err, rows) => {
        if (err) reject(err);

        let currentSemester = '';
        for (const row of rows) {
          const joined = row.join(' ').trim();

          if (semesterRegex.test(joined)) {
            currentSemester = joined;
            semesters[currentSemester] = { subjects: [] };
            continue;
          }

          const codeMatch = row[0]?.match(/^([A-Z]{2,}\d{3})$/);
          if (codeMatch && currentSemester) {
            const subjectCode = row[0];
            const subjectName = row[1];
            const credit = parseInt(row[2]) || 0;

            const scores = {
              QT: this.safeParseFloat(row[3]),
              GK: this.safeParseFloat(row[4]),
              TH: this.safeParseFloat(row[5]),
              CK: this.safeParseFloat(row[6]),
              TK: isNaN(parseFloat(row[7])) ? row[7] : parseFloat(row[7]),
            };

            // Clean undefined/null scores
            Object.keys(scores).forEach((k) => {
              if (scores[k] === null || scores[k] === undefined || scores[k] === '') delete scores[k];
            });

            semesters[currentSemester].subjects.push({
              subjectCode,
              subjectName,
              credit,
              ...scores,
            });
          }
        }

        resolve({
          semesters,
          cumulativePoint: 8.17,
        });
      });
    });
  }

  async getSubject(file: Express.Multer.File): Promise<OpenSubject[]> {
    const html = file.buffer.toString('utf-8');
    const $ = cheerio.load(html);
    const results: OpenSubject[] = [];

    const rows = $('table.tablesorter tbody tr').toArray();

    const subjectsToUpsert: OpenSubject[] = [];

    for (const element of rows) {
      const columns = $(element).find('td');
      const subjectStatus = $(columns[4]).find('img').attr('alt');

      if (subjectStatus === 'Hiện đang mở') {
        const subjectCode = $(columns[1]).text().trim();
        const subjectName = $(columns[2]).text().trim();
        const LT = parseInt($(columns[11]).text().trim(), 10) || 0;
        const TH = parseInt($(columns[12]).text().trim(), 10) || 0;
        const credit = LT + TH;

        subjectsToUpsert.push({ subjectCode, subjectName, credit });
        results.push({ subjectCode, subjectName, credit });
      }
    }

    // Lấy danh sách subjectCode hiện có
    const existingSubjects = await this.subjectModel.find({
      subjectCode: { $in: subjectsToUpsert.map((s) => s.subjectCode) },
    });

    const existingMap = new Map(existingSubjects.map((s) => [s.subjectCode, s]));

    const bulkOperations = subjectsToUpsert.map((subject) => {
      if (existingMap.has(subject.subjectCode)) {
        return {
          updateOne: {
            filter: { subjectCode: subject.subjectCode },
            update: { $set: { subjectName: subject.subjectName, credit: subject.credit } },
          },
        };
      } else {
        return {
          insertOne: {
            document: subject,
          },
        };
      }
    });

    if (bulkOperations.length > 0) {
      await this.subjectModel.bulkWrite(bulkOperations);
    }

    return results;
  }

  private safeParseFloat(value: string): number | undefined {
    const v = parseFloat(value);
    return isNaN(v) ? undefined : v;
  }
}
