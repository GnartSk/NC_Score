"use client";

import { useState } from "react";
import { Upload, CalendarCheck } from "lucide-react";
import BigCalendar from "../calendar/BigCalender";

export default function ImportICS() {
    const [file, setFile] = useState<File | null>(null);
    const [events, setEvents] = useState([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const uploadICS = async () => {
        if (!file) return alert("Vui lòng chọn file!");

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/import-ics", { method: "POST", body: formData });
        const data = await res.json();

        // Chuyển đổi định dạng sự kiện
        const formattedEvents = data.events.map((event: any) => ({
            title: event.summary,
            start: new Date(event.start),
            end: new Date(event.end),
        }));

        setEvents(formattedEvents);
        alert("Import file ICS thành công!");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4 border border-gray-300">
            <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition">
                <Upload className="w-5 h-5 mr-2" />
                <span>{file ? file.name : "Chọn file ICS"}</span>
                <input type="file" accept=".ics" className="hidden" onChange={handleFileChange} />
            </label>

            <button
                onClick={uploadICS}
                disabled={!file}
                className={`w-full px-4 py-2 rounded-md text-white ${file ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"}`}
            >
                Import ICS
            </button>

            {/* Hiển thị lịch với dữ liệu đã import */}
            {/* <BigCalendar importedEvents={events} /> */}
        </div>
    );
}
