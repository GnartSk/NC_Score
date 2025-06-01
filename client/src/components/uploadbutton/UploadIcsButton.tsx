'use client';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadIcsButton = () => {
  const beforeUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/ics/extract-class-codes`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Lỗi khi gửi file ICS lên server');
      const result = await response.json();
      // result là mảng mã môn học hoặc object chứa mảng
      const codes = Array.isArray(result)
        ? result
        : (result.codes || result.data || []);
      if (Array.isArray(codes) && codes.length > 0) {
        // Lưu cả object {code, name}
        localStorage.setItem('current_subject_codes', JSON.stringify(codes));
        message.success(`Đã lưu ${codes.length} môn đang học!`);
        message.info('Đã cập nhật trạng thái điểm. Vui lòng kiểm tra lại bảng điểm!');
      } else {
        message.warning('Không tìm thấy mã môn trong file ICS!');
      }
    } catch (err) {
      message.error('Lỗi khi xử lý file ICS!');
    }
    return false; // Ngăn upload mặc định
  };

  return (
    <Upload accept=".ics" showUploadList={false} beforeUpload={beforeUpload}>
      <Button icon={<UploadOutlined />}>Tải lên file lịch học (.ics)</Button>
    </Upload>
  );
};

export default UploadIcsButton; 