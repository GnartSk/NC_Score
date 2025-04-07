import { useState } from "react";
import { Button, Input, DatePicker, message } from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

interface EventData {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface EventFormProps {
  onEventAdded?: (event: EventData) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !startTime || !endTime) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<EventData>("http://localhost:3000/events", {
        title,
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      message.success("Sự kiện đã được thêm!");

      if (onEventAdded) {
        onEventAdded(response.data);
      }

      setTitle("");
      setDescription("");
      setStartTime(null);
      setEndTime(null);
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg max-w-md mx-auto bg-white">
      <h2 className="text-lg font-semibold mb-4 text-center text-blue-600">Thêm Lịch Học</h2>
      <div className="space-y-4"> 
        <Input
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <Input
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <DatePicker
          showTime
          value={startTime}
          onChange={(value) => setStartTime(value)}
          className="w-full p-2 border rounded"
          placeholder="Chọn thời gian bắt đầu"
        />
        <DatePicker
          showTime
          value={endTime}
          onChange={(value) => setEndTime(value)}
          className="w-full p-2 border rounded"
          placeholder="Chọn thời gian kết thúc"
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Thêm lịch học
        </Button>
      </div>
    </div>
  );
  
};

export default EventForm;
