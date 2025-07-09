'use client';
import { Upload, Button, message, Modal, Table, Select, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getCookie } from 'cookies-next';
import { isGroupSubject } from '@/utils/groupSubjectMap';
import { getCourseSelection } from '@/utils/courseUtils';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface Subject {
  subjectCode: string;
  subjectName: string;
  credit: number;
  status: string;
  category: string;
  semester?: string;
}

function getCategoryFromCode(code: string) {
  if (code.startsWith('SS')) return 'Môn lý luận chính trị';
  if (code.startsWith('MA') || code.startsWith('PH') || code === 'IT001') return 'Toán - Tin học';
  if (code.startsWith('EN')) return 'Ngoại ngữ';
  if ((code.startsWith('IT') && code !== 'IT001') || code.startsWith('NT0') || code.startsWith('NT1')) return 'Cơ sở ngành';
  if (code.startsWith('NT')) return 'Chuyên ngành';
  return 'Tự chọn';
}

// Hàm lấy ngành học từ API
async function fetchUserMajor(): Promise<string | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('NCToken') : null;
    if (!token) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    console.log('[DEBUG][fetchUserMajor] data:', data);
    return data.data?.major || null;
  } catch (e) {
    console.error('[DEBUG][fetchUserMajor] error:', e);
    return null;
  }
}

// Hàm chuẩn hóa tên ngành để mapping đúng với groupSubjectMap
function normalizeMajor(major: string): string {
  if (!major) return '';
  const m = major.trim().toLowerCase();
  if (m.includes('mạng máy tính')) return 'Mạng máy tính & Truyền thông dữ liệu';
  if (m.includes('an toàn thông tin')) return 'An toàn thông tin';
  return major;
}

function getMajorFromLocalStorage() {
  try {
    const profile = localStorage.getItem('profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.major) return parsed.major;
    }
  } catch {}
  return null;
}

const UploadIcsButton = () => {
  const [major, setMajor] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [parsedSubjects, setParsedSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ưu tiên lấy từ localStorage
    const localMajor = getMajorFromLocalStorage();
    if (localMajor) {
      setMajor(localMajor);
    } else {
      fetchUserMajor().then((mj) => {
        console.log('[DEBUG][useEffect] major from API:', mj);
        setMajor(mj);
      });
    }
  }, []);

  // Cấu hình cột cho bảng xác nhận
  const columns: ColumnsType<Subject> = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: 'Mã môn',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
    },
    {
      title: 'Tên môn',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'TC',
      dataIndex: 'credit',
      key: 'credit',
      width: 60,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded text-xs ${
          status === 'Đang học' ? 'bg-blue-100 text-blue-800' :
          status === 'Miễn' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Nhóm môn',
      dataIndex: 'category',
      key: 'category',
    },
  ];

  const semesterOptions = [
    { value: 'HK1-2024-2025', label: 'Học kỳ 1 - Năm học 2024-2025' },
    { value: 'HK2-2024-2025', label: 'Học kỳ 2 - Năm học 2024-2025' },
    { value: 'HK1-2023-2024', label: 'Học kỳ 1 - Năm học 2023-2024' },
    { value: 'HK2-2023-2024', label: 'Học kỳ 2 - Năm học 2023-2024' },
    { value: 'HK1-2022-2023', label: 'Học kỳ 1 - Năm học 2022-2023' },
    { value: 'HK2-2022-2023', label: 'Học kỳ 2 - Năm học 2022-2023' },
  ];

  function getSemesterLabel(semesterValue: string): string {
    const found = semesterOptions.find(opt => opt.value === semesterValue);
    return found ? found.label : semesterValue;
  }

  const beforeUpload = async (file: File) => {
    if (!major) {
      message.error('Vui lòng đợi thông tin ngành học được tải xong!');
      return false;
    }
    setLoading(true);
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
            console.log('[DEBUG] Mã môn đã có điểm:', scoredCodes);
          }
        } catch (e) { console.warn('Error reading html_score_data:', e); }
        
        // Lọc các môn chưa có điểm, normalize mã môn
        const filteredArr = Array.isArray(arr)
          ? arr.filter(subj => {
              const code = (subj.code || subj.subjectCode || '').toString().toUpperCase().trim();
              return !scoredCodes.includes(code);
            })
          : [];
        
        console.log('[DEBUG] Mã môn từ ICS:', Array.isArray(arr) ? arr.map(subj => (subj.code || subj.subjectCode || '').toString().toUpperCase().trim()) : []);
        console.log('[DEBUG] Mã môn được thêm vào trạng thái đang học:', filteredArr.map(subj => (subj.code || subj.subjectCode || '').toString().toUpperCase().trim()));
        
        if (filteredArr.length > 0) {
          const categorizedCodes = filteredArr.map(subj => {
            const code = (subj.code || subj.subjectCode || '').toString().toUpperCase().trim();
            let category = 'Tự chọn';
            let status = 'Đang học';
            
            // Nếu có logic phát hiện môn miễn từ ICS, set status = 'Miễn'
            if (subj.TK === 'Miễn' || subj.status === 'Miễn') {
              status = 'Miễn';
            }
            
            // Thêm log debug giá trị major và code
            console.log('[DEBUG][ICS] major:', major, '| normalized:', normalizeMajor(major || ''), '| code:', code);
            
            if (isGroupSubject('Cơ sở ngành', normalizeMajor(major || ''), code)) {
              category = 'Cơ sở ngành';
            } else if (isGroupSubject('Chuyên ngành', normalizeMajor(major || ''), code)) {
              category = 'Chuyên ngành';
            } else if (code.startsWith('SS')) {
              category = 'Môn lý luận chính trị và pháp luật';
            } else if (code.startsWith('MA') || code.startsWith('PH') || code === 'IT001') {
              category = 'Toán - Tin học - Khoa học tự nhiên';
            } else if (code.startsWith('EN')) {
              category = 'Ngoại ngữ';
            }
            
            return {
              subjectCode: code,
              subjectName: subj.name,
              credit: subj.credit || 0,
              status,
              category
            };
          });
          
          // Lưu dữ liệu để hiển thị trong modal
          setParsedSubjects(categorizedCodes);
          setModalVisible(true);
        } else {
          message.info('Tất cả các môn trong file ICS đã có điểm, không có môn mới để cập nhật.');
        }
      } else {
        message.error('Failed to upload file');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xác nhận upload
  const handleConfirmUpload = async () => {
    if (!selectedSemester) {
      message.error('Vui lòng chọn học kỳ!');
      return;
    }

    setConfirmLoading(true);
    try {
      // Thêm học kỳ vào dữ liệu với định dạng đầy đủ
      const semesterLabel = getSemesterLabel(selectedSemester);
      // Lấy dữ liệu điểm hiện có từ localStorage
      const htmlScoreData = localStorage.getItem('html_score_data');
      let allSubjects: any[] = [];
      if (htmlScoreData) {
        const parsed = JSON.parse(htmlScoreData);
        allSubjects = Object.values(parsed.semesters || {}).flatMap((sem: any) => sem.subjects || []);
      }
      // Chuẩn hóa mã môn và trạng thái
      const subjectStatusMap: Record<string, string[]> = {};
      allSubjects.forEach(subj => {
        const code = (subj.subjectCode || subj.code || '').toString().toUpperCase().trim();
        const status = (subj.status || '').toString().trim();
        if (!subjectStatusMap[code]) subjectStatusMap[code] = [];
        subjectStatusMap[code].push(status);
      });
      // Lọc danh sách môn sẽ thêm mới/cập nhật
      const subjectsWithSemester = parsedSubjects.filter(subject => {
        const code = subject.subjectCode;
        const statuses = subjectStatusMap[code] || [];
        // Nếu đã có Đang học → cho phép cập nhật (giữ lại trong danh sách)
        if (statuses.includes('Đang học')) return true;
        // Nếu có Rớt và có bản ghi khác (Hoàn thành, Miễn, Hoãn thi, v.v.) → KHÔNG tạo mới
        if (statuses.includes('Rớt') && statuses.some(s => s !== 'Rớt')) return false;
        // Nếu chỉ có Rớt → cho phép tạo mới
        if (statuses.length > 0 && statuses.every(s => s === 'Rớt')) return true;
        // Nếu chưa có bản ghi nào → cho phép tạo mới
        if (statuses.length === 0) return true;
        // Mặc định: không tạo mới
        return false;
      }).map(subject => ({
        ...subject,
        semester: semesterLabel
      }));
      if (subjectsWithSemester.length === 0) {
        message.info('Không có môn nào đủ điều kiện để cập nhật hoặc thêm mới!');
        setConfirmLoading(false);
        return;
      }
      console.log('Saving to localStorage:', subjectsWithSemester);
      localStorage.setItem('current_subject_codes', JSON.stringify(subjectsWithSemester));
      // Tự động lưu tất cả các môn lên database
      await uploadAllScoreToServer();
      message.success(`Đã upload file lịch học và cập nhật ${subjectsWithSemester.length} môn đang học cho học kỳ ${semesterLabel}!`);
      message.info('Đã cập nhật trạng thái điểm từ file ICS. Vui lòng kiểm tra lại bảng điểm!');
      setModalVisible(false);
      setSelectedSemester('');
      setParsedSubjects([]);
      window.location.reload();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setSelectedSemester('');
    setParsedSubjects([]);
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
    <>
      <Upload
        beforeUpload={beforeUpload}
        showUploadList={false}
        accept=".ics"
        disabled={!major}
      >
        <Button icon={<UploadOutlined />} loading={loading} disabled={!major}>
          Upload ICS
        </Button>
      </Upload>

      {/* Modal xác nhận dữ liệu */}
      <Modal
        title="Xác nhận thông tin môn học từ file ICS"
        open={modalVisible}
        onCancel={handleCancelModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={confirmLoading} 
            onClick={handleConfirmUpload}
            disabled={!selectedSemester}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Xác nhận và lưu
          </Button>,
        ]}
        maskClosable={false}
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-2">Vui lòng kiểm tra và xác nhận thông tin môn học trước khi lưu:</p>
            <p className="text-sm text-gray-500">Tìm thấy {parsedSubjects.length} môn học mới từ file ICS</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn học kỳ * <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn học kỳ"
              value={selectedSemester}
              onChange={setSelectedSemester}
              style={{ width: '100%' }}
              options={semesterOptions}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Danh sách môn học sẽ được thêm:</h3>
            <Table
              columns={columns}
              dataSource={parsedSubjects}
              pagination={false}
              rowKey={(record, index) => `${record.subjectCode}-${index}`}
              size="small"
              scroll={{ y: 300 }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadIcsButton;