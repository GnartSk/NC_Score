'use client';
import { useState } from 'react';
import { Button, DatePicker, Form, Input, Modal } from 'antd';
import dayjs from 'dayjs';

interface EventFormProps {
  onSubmit: (event: {
    title: string;
    start: Date;
    end: Date;
    desc?: string;
  }) => void;
  onCancel: () => void;
}

const EventForm = ({ onSubmit, onCancel }: EventFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit({
      title: values.title,
      start: values.timeRange[0].toDate(),
      end: values.timeRange[1].toDate(),
      desc: values.desc
    });
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm Lịch Học Mới"
      open={true}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên môn học"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
        >
          <Input placeholder="Nhập tên môn học" />
        </Form.Item>

        <Form.Item
          label="Thời gian"
          name="timeRange"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
        >
          <DatePicker.RangePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            className="w-full"
          />
        </Form.Item>

        <Form.Item label="Ghi chú" name="desc">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Lưu Lịch
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EventForm;