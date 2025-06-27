/**
 * Chuyển đổi điểm thang 10 sang thang 4 theo bảng quy đổi chuẩn
 * @param score10 Điểm thang 10
 * @returns Điểm thang 4
 */
export function convertScore10to4(score10: number): number {
  if (score10 >= 9 && score10 <= 10) return 4.0;
  if (score10 >= 8 && score10 < 9) return 3.5;
  if (score10 >= 7 && score10 < 8) return 3.0;
  if (score10 >= 6 && score10 < 7) return 2.5;
  if (score10 >= 5 && score10 < 6) return 2.0;
  if (score10 >= 4 && score10 < 5) return 1.5;
  if (score10 >= 3 && score10 < 4) return 1.0;
  return 0.0;
} 