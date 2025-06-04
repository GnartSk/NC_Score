'use client';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getCookie } from 'cookies-next';
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
        if (Array.isArray(arr) && arr.length > 0) {
          const categorizedCodes = arr.map(subj => ({
            ...subj,
            category: getCategoryFromCode(subj.code)
          }));
          console.log('Saving to localStorage:', categorizedCodes);
          localStorage.setItem('current_subject_codes', JSON.stringify(categorizedCodes));
          message.success(`Đã upload file lịch học và cập nhật ${arr.length} môn đang học!`);
          message.info('Đã cập nhật trạng thái điểm từ file ICS. Vui lòng kiểm tra lại bảng điểm!');
          window.location.reload();
        } else {
          console.warn('ICS data is not a valid array or is empty:', arr);
        }
      } else {
        message.error('Failed to upload file');
      }
    } catch (error) {
      message.error('An error occurred');
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