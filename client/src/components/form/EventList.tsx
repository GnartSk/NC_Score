import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

interface EventData {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface EventListProps {
  newEvent?: EventData;
}

const EventList: React.FC<EventListProps> = ({ newEvent }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [newEvent]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<EventData[]>(`${process.env.NEXT_PUBLIC_BackendURL}/events`);
      setEvents(response.data);
    } catch (err) {
      setError("Không thể tải danh sách lịch học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Thời khóa biểu</h2>

      {loading && <p>Đang tải thời khóa biểu...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && events.length === 0 && <p>Không có lịch học nào.</p>}

      {!loading &&
        events.map((event) => (
          <div key={event._id} className="p-3 border rounded-lg mb-2 shadow-sm bg-white">
            <h3 className="font-medium text-blue-600">{event.title}</h3>
            <p className="text-gray-700">{event.description || "Không có mô tả"}</p>
            <small className="text-gray-500">
              {dayjs(event.startTime).format("DD/MM/YYYY HH:mm")} - {dayjs(event.endTime).format("DD/MM/YYYY HH:mm")}
            </small>
          </div>
        ))}
    </div>
  );
};

export default EventList;
