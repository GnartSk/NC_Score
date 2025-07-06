'use client';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getCookie } from 'cookies-next';
import { isGroupSubject } from '@/utils/groupSubjectMap';
import { getCourseSelection } from '@/utils/courseUtils';

function getCategoryFromCode(code: string) {
  if (code.startsWith('SS')) return 'Môn lý luận chính trị';
  if (code.startsWith('MA') || code.startsWith('PH') || code === 'IT001') return 'Toán - Tin học';
  if (code.startsWith('EN')) return 'Ngoại ngữ';
  if ((code.startsWith('IT') && code !== 'IT001') || code.startsWith('NT0') || code.startsWith('NT1')) return 'Cơ sở ngành';
  if (code.startsWith('NT')) return 'Chuyên ngành';
  return 'Tự chọn';
}

const UploadIcsButton = () => {
  const beforeUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getCookie('NCToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/ics/extract-class-codes`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        console.log('ICS API response:', data);
        const arr = data.data;
        // Lấy danh sách mã môn đã có điểm từ localStorage
        let scoredCodes = [];
        try {
          const htmlScoreData = localStorage.getItem('html_score_data');
          if (htmlScoreData) {
            const parsed = JSON.parse(htmlScoreData);
            const allSubjects = Object.values(parsed.semesters || {}).flatMap((sem: any) => sem.subjects || []);
            // Lấy tất cả các mã môn đã có điểm tổng kết hoặc có tag Rớt, Hoãn thi, Hoàn thành, Miễn
            scoredCodes = allSubjects
              .filter((subj: any) => {
                const tk = (subj.TK ?? '').toString().trim();
                const status = (subj.status ?? '').toString().trim();
                if (tk && tk !== '-' && !isNaN(Number(tk))) return true;
                if ([
                  'Rớt', 'Hoãn thi', 'Hoàn thành', 'Miễn'
                ].includes(status) || [
                  'Rớt', 'Hoãn thi', 'Hoàn thành', 'Miễn'
                ].includes(tk)) return true;
                return false;
              })
              .map((subj: any) => (subj.subjectCode || subj.code || '').toString().toUpperCase().trim());
            // Log danh sách mã môn đã có điểm
            console.log('[DEBUG] Mã môn đã có điểm:', scoredCodes);
          }
        } catch (e) { console.warn('Error reading html_score_data:', e); }
        // Lấy ngành học hiện tại
        const courseSelection = getCourseSelection();
        const major = courseSelection?.major || '';
        // Lọc các môn chưa có điểm, normalize mã môn
        const filteredArr = Array.isArray(arr)
          ? arr.filter(subj => {
              const code = (subj.code || subj.subjectCode || '').toString().toUpperCase().trim();
              return !scoredCodes.includes(code);
            })
          : [];
        // Log danh sách mã môn từ ICS
        console.log('[DEBUG] Mã môn từ ICS:', Array.isArray(arr) ? arr.map(subj => (subj.code || subj.subjectCode || '').toString().toUpperCase().trim()) : []);
        console.log('[DEBUG] Mã môn được thêm vào trạng thái đang học:', filteredArr.map(subj => (subj.code || subj.subjectCode || '').toString().toUpperCase().trim()));
        if (filteredArr.length > 0) {
          const categorizedCodes = filteredArr.map(subj => {
            const code = subj.code;
            let category = 'Tự chọn';
            if (isGroupSubject('Cơ sở ngành', major, code)) {
              category = 'Cơ sở ngành';
            } else if (isGroupSubject('Chuyên ngành', major, code)) {
              category = 'Chuyên ngành';
            } else if (code.startsWith('SS')) {
              category = 'Môn lý luận chính trị';
            } else if (code.startsWith('MA') || code.startsWith('PH') || code === 'IT001') {
              category = 'Toán - Tin học';
            } else if (code.startsWith('EN')) {
              category = 'Ngoại ngữ';
            }
            return {
              subjectCode: code,
              subjectName: subj.name,
              credit: subj.credit || 0,
              status: 'Đang học',
              category
            };
          });
          console.log('Saving to localStorage:', categorizedCodes);
          localStorage.setItem('current_subject_codes', JSON.stringify(categorizedCodes));
          // Tự động lưu tất cả các môn lên database
          await uploadAllScoreToServer();
          message.success(`Đã upload file lịch học và cập nhật ${filteredArr.length} môn đang học!`);
          message.info('Đã cập nhật trạng thái điểm từ file ICS. Vui lòng kiểm tra lại bảng điểm!');
          window.location.reload();
        } else {
          message.info('Tất cả các môn trong file ICS đã có điểm, không có môn mới để cập nhật.');
        }
      } else {
        message.error('Failed to upload file');
      }
    } catch (error) {
      message.error('An error occurred');
    }
  };

  // Hàm gọi API lưu điểm lên server
  const uploadAllScoreToServer = async () => {
    const htmlScoreData = localStorage.getItem('html_score_data');
    const icsSubjects = localStorage.getItem('current_subject_codes');
    // Lấy token từ cookie hoặc localStorage
    const token = getCookie('NCToken') || localStorage.getItem('NCToken');
    if (!token || token === 'null') {
      message.error('Bạn cần đăng nhập lại để sử dụng tính năng này!');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/score/allScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          semesters: htmlScoreData ? JSON.parse(htmlScoreData).semesters : {},
          currentSubjects: icsSubjects ? JSON.parse(icsSubjects) : [],
        }),
      });
      if (res.ok) {
        message.success('Đã lưu điểm lên hệ thống!');
      } else {
        message.error('Lưu điểm lên hệ thống thất bại!');
      }
    } catch (e) {
      message.error('Lỗi khi lưu điểm lên hệ thống!');
    }
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      showUploadList={false}
      accept=".ics"
    >
      <Button icon={<UploadOutlined />}>Upload ICS</Button>
    </Upload>
  );
};

export default UploadIcsButton;