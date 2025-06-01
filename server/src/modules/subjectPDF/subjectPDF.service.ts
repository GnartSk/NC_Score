import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectsPDFService {
  private subjectsPDF = [
    // Môn lý luận chính trị
    { id: 2, code: 'SS003', name: 'Tư tưởng Hồ Chí Minh', credits: 2, qt: 8, thi: 8, gk1: 7, total: 7, status: 'Hoàn thành', category: 'political' },
    // ... thêm các môn khác
    // Toán-Tin
    { id: 9, code: 'MA006', name: 'Giải tích', credits: 4, qt: 2, status: 'Rớt', category: 'math' },
  ];

  findByCategory(category: string) {
    return this.subjectsPDF.filter(subjectPDF => subjectPDF.category === category);
  }
}