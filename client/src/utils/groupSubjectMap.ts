// Mapping nhóm môn -> ngành -> danh sách mã môn học
export const groupSubjectMap: Record<string, Record<string, string[]>> = {
  "Nhóm các môn học cơ sở ngành": {
    "Chung": [
      "IT002", "IT003", "IT004", "IT005", "IT006", "IT007", "NT106", "NT101", "NT132" // các môn mà mọi ngành đều học
    ],
    "An toàn thông tin": [
      "NT015", "NT230", "NT219", "NT209", "NT208", "NT521"// chỉ ATTT học
    ],
    "Mạng máy tính & Truyền thông dữ liệu": [
      "NT005", "NT131", "NT105", "NT118", "NT113" // chỉ MMT học
    ],
    // Thêm ngành mới ở đây
  },
  "Nhóm các môn học chuyên ngành": {
    "An toàn thông tin": [
      "NT204", "NT330", "NT207", "NT137", "NT213", "NT334", "NT535", "NT211", "NT212", "NT534", "NT133", "NT523", "NT205"
    ],
    "Mạng máy tính & Truyền thông dữ liệu": [
      "NT531", "NT532", "NT533", "NT536", "NT402", "NT538", "NT540", "NT541", "NT542", "NT543", "NT209"
    ],
  },
  // Thêm các nhóm khác nếu cần
};

// Hàm kiểm tra mã môn học có thuộc nhóm môn của ngành không (xét cả Chung)
export function isGroupSubject(group: string, major: string, subjectCode: string): boolean {
  const groupMap = groupSubjectMap[group] || {};
  return (
    (groupMap[major]?.includes(subjectCode) ?? false) ||
    (groupMap["Chung"]?.includes(subjectCode) ?? false)
  );
} 