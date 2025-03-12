import { Injectable } from '@nestjs/common';

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
}
